import { afterEach, describe, expect, it, vi } from "vitest";

import { busKind, createBus, DEFAULT_CHANNEL, type RealtimeBus } from "../src/index";
import { NOTIFY_LIMIT, postgresBus, type PostgresChannel } from "../src/postgres";

/** A PostgreSQL in memory: NOTIFY reaches every LISTENer of the channel that is connected. */
function fakePostgres() {
  const listeners = new Set<{ channel: string; on: (p: string) => void; state: { connected: boolean } }>();
  const sent: { channel: string; payload: string }[] = [];
  let failNotify = false;
  const db: PostgresChannel = {
    async notify(channel, payload) {
      if (failNotify) throw new Error("connection refused");
      sent.push({ channel, payload });
      for (const l of listeners) if (l.channel === channel && l.state.connected) l.on(payload);
    },
    listen(channel, on) {
      const entry = { channel, on, state: { connected: true } };
      listeners.add(entry);
      return {
        get connected() {
          return entry.state.connected;
        },
        async close() {
          listeners.delete(entry);
        },
      };
    },
  };
  return {
    db,
    sent,
    listeners,
    failNotify: (v: boolean) => void (failNotify = v),
    drop: () => listeners.forEach((l) => (l.state.connected = false)),
  };
}

const buses: RealtimeBus[] = [];
afterEach(async () => {
  for (const bus of buses.splice(0)) await bus.close();
  vi.useRealTimers();
});

describe("the postgres bus", () => {
  it("fans out through one NOTIFY channel to every instance, by topic", async () => {
    const pg = fakePostgres();
    const a = postgresBus({ db: pg.db, channel: "app_events" });
    const b = postgresBus({ db: pg.db, channel: "app_events" });
    buses.push(a, b);
    const got: unknown[] = [];
    b.subscribe("user:1", (e) => got.push(e));
    b.subscribe("user:2", () => got.push("wrong"));
    await a.publish("user:1", { n: 1 });
    expect(got).toEqual([{ n: 1 }]);
    expect(pg.sent[0]).toEqual({ channel: "app_events", payload: JSON.stringify({ topic: "user:1", event: { n: 1 } }) });
    expect(a.kind).toBe("postgres");
    expect(a.connected).toBe(true);
  });

  it("uses DEFAULT_CHANNEL when none is given, and ignores payloads that are not its own", async () => {
    const pg = fakePostgres();
    const bus = postgresBus({ db: pg.db });
    buses.push(bus);
    const got: unknown[] = [];
    const off = bus.subscribe("t", (e) => got.push(e));
    await pg.db.notify(DEFAULT_CHANNEL, "not json");
    await bus.publish("t", 1);
    off();
    await bus.publish("t", 2);
    expect(got).toEqual([1]);
  });

  it("refuses a payload over the NOTIFY limit, and still delivers it locally", async () => {
    const pg = fakePostgres();
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const bus = postgresBus({ db: pg.db });
    buses.push(bus);
    const got: unknown[] = [];
    bus.subscribe("t", (e) => got.push(e));
    await bus.publish("t", "x".repeat(NOTIFY_LIMIT));
    expect(pg.sent).toHaveLength(0);
    expect(got).toHaveLength(1);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it("while its LISTEN is down, publishes for the others and hands the event to its own subscribers", async () => {
    const pg = fakePostgres();
    const bus = postgresBus({ db: pg.db });
    buses.push(bus);
    pg.drop();
    expect(bus.connected).toBe(false);
    const got: unknown[] = [];
    bus.subscribe("t", (e) => got.push(e));
    await bus.publish("t", "e");
    expect(pg.sent).toHaveLength(1);
    expect(got).toEqual(["e"]);
  });

  it("when NOTIFY fails, delivers locally rather than throwing", async () => {
    const pg = fakePostgres();
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const bus = postgresBus({ db: pg.db });
    buses.push(bus);
    pg.failNotify(true);
    const got: unknown[] = [];
    bus.subscribe("t", (e) => got.push(e));
    await expect(bus.publish("t", "e")).resolves.toBeUndefined();
    expect(got).toEqual(["e"]);
    warn.mockRestore();
  });

  it("replicates presence between instances, by delta and by a regular snapshot", async () => {
    vi.useFakeTimers();
    const pg = fakePostgres();
    const a = postgresBus({ db: pg.db, snapshotIntervalMs: 1000 });
    const b = postgresBus({ db: pg.db, snapshotIntervalMs: 1000 });
    buses.push(a, b);
    await a.presence.beat("u", "c", "online");
    expect((await b.presence.get(["u"])).get("u")?.state).toBe("online");
    const before = pg.sent.length;
    await vi.advanceTimersByTimeAsync(1000);
    expect(pg.sent.length).toBeGreaterThan(before);
    pg.failNotify(true);
    await vi.advanceTimersByTimeAsync(1000); // a failed snapshot is dropped silently
    await a.presence.beat("v", "c", "away"); // and so is a failed delta
  });

  it("closes its LISTEN connection", async () => {
    const pg = fakePostgres();
    const bus = postgresBus({ db: pg.db });
    expect(pg.listeners.size).toBe(1);
    await bus.close();
    expect(pg.listeners.size).toBe(0);
  });
});

describe("createBus", () => {
  it("builds the postgres bus on the channel given, and refuses it without one", async () => {
    const pg = fakePostgres();
    const bus = createBus({ kind: "postgres", postgres: pg.db, channel: "app_events" });
    buses.push(bus);
    await bus.publish("t", 1);
    expect(pg.sent[0]?.channel).toBe("app_events");
    expect(() => createBus({ kind: "postgres" })).toThrow(/PostgreSQL channel/);
  });

  it("builds the redis bus with the adapter passed in, so ioredis loads only when used", () => {
    const fake = createBus({ kind: "memory" });
    const redisBus = vi.fn(() => fake);
    expect(createBus({ kind: "redis", redisUrl: "redis://x", prefix: "app:", redisBus })).toBe(fake);
    expect(redisBus).toHaveBeenCalledWith(expect.objectContaining({ url: "redis://x", prefix: "app:" }));
    expect(() => createBus({ kind: "redis", redisUrl: "redis://x" })).toThrow(/@krizaka\/realtime\/redis/);
  });

  it("refuses an unknown bus", () => {
    expect(() => createBus({ kind: "kafka" as never })).toThrow(/unknown realtime bus/);
    expect(busKind("")).toBe("postgres");
  });
});
