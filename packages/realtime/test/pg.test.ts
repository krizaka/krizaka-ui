import { afterEach, describe, expect, it, vi } from "vitest";

import { pgChannel, type PgDriver, type PgListenClient } from "../src/pg";
import { NOTIFY_LIMIT } from "../src/postgres";

type Handler = (...args: never[]) => void;

/** node-postgres stand-ins: every Client and Pool built is recorded, a Client's connection can be made to fail. */
function fakeDriver(options: { failConnects?: number; hangConnect?: boolean } = {}) {
  let failures = options.failConnects ?? 0;
  const clients: FakeClient[] = [];
  const pools: FakePool[] = [];
  class FakeClient implements PgListenClient {
    handlers = new Map<string, Handler[]>();
    queries: string[] = [];
    ended = false;
    release?: () => void;
    constructor(readonly config: Record<string, unknown>) {
      clients.push(this);
    }
    async connect() {
      if (options.hangConnect) await new Promise<void>((r) => (this.release = r));
      if (failures > 0) {
        failures--;
        throw new Error("ECONNREFUSED");
      }
    }
    async query(text: string) {
      this.queries.push(text);
    }
    async end() {
      this.ended = true;
    }
    on(event: string, listener: Handler) {
      this.handlers.set(event, [...(this.handlers.get(event) ?? []), listener]);
      return this;
    }
    emit(event: string, ...args: unknown[]) {
      for (const h of this.handlers.get(event) ?? []) (h as (...a: unknown[]) => void)(...args);
    }
    removeAllListeners() {
      this.handlers.clear();
      return this;
    }
  }
  class FakePool {
    calls: { text: string; values?: unknown[] }[] = [];
    ended = false;
    constructor(readonly config: Record<string, unknown>) {
      pools.push(this);
    }
    async query(text: string, values?: unknown[]) {
      this.calls.push({ text, values });
    }
    async end() {
      this.ended = true;
    }
  }
  return { driver: { Client: FakeClient, Pool: FakePool } as unknown as PgDriver, clients, pools };
}

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("pgChannel", () => {
  it("LISTENs on a dedicated connection built from the connection string it is given", async () => {
    const { driver, clients } = fakeDriver();
    const states: boolean[] = [];
    const channel = pgChannel({ listen: "postgresql://direct:5432/app", driver, onState: (s) => states.push(s) });
    const got: string[] = [];
    const listener = channel.listen("app_events", (p) => got.push(p));
    await vi.waitFor(() => expect(listener.connected).toBe(true));
    expect(clients[0].config).toEqual({ connectionString: "postgresql://direct:5432/app" });
    expect(clients[0].queries).toEqual(["LISTEN app_events"]);
    clients[0].emit("notification", { channel: "app_events", payload: "hello" });
    clients[0].emit("notification", { channel: "other", payload: "no" });
    clients[0].emit("notification", { channel: "app_events" });
    expect(got).toEqual(["hello"]);
    await listener.close();
    expect(clients[0].ended).toBe(true);
    expect(listener.connected).toBe(false);
    expect(states).toEqual([true, false]);
  });

  it("refuses a channel that is not a plain identifier", () => {
    const { driver } = fakeDriver();
    expect(() => pgChannel({ listen: "x", driver }).listen("bad; drop", () => undefined)).toThrow(/invalid channel/);
  });

  it("reconnects with a growing, capped delay after a failure or a dropped connection", async () => {
    vi.useFakeTimers();
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const { driver, clients } = fakeDriver({ failConnects: 2 });
    const listener = pgChannel({ listen: { host: "db" }, driver, maxReconnectDelayMs: 1500 }).listen("c", () => undefined);
    await vi.advanceTimersByTimeAsync(0);
    expect(clients).toHaveLength(1);
    await vi.advanceTimersByTimeAsync(1000);
    expect(clients).toHaveLength(2);
    await vi.advanceTimersByTimeAsync(1499);
    expect(clients).toHaveLength(2);
    await vi.advanceTimersByTimeAsync(1);
    expect(clients).toHaveLength(3);
    expect(listener.connected).toBe(true);
    expect(clients[2].config).toEqual({ host: "db" });
    clients[2].emit("error");
    clients[2].emit("end"); // a second signal while a retry is already planned changes nothing
    expect(listener.connected).toBe(false);
    await vi.advanceTimersByTimeAsync(1000);
    expect(clients).toHaveLength(4);
    expect(listener.connected).toBe(true);
    await listener.close();
  });

  it("does not come back after close, even with a retry planned or a connection under way", async () => {
    vi.useFakeTimers();
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const failing = fakeDriver({ failConnects: 1 });
    const a = pgChannel({ listen: "x", driver: failing.driver }).listen("c", () => undefined);
    await vi.advanceTimersByTimeAsync(0);
    await a.close();
    await vi.advanceTimersByTimeAsync(60_000);
    expect(failing.clients).toHaveLength(1);

    const hanging = fakeDriver({ hangConnect: true });
    const b = pgChannel({ listen: "x", driver: hanging.driver }).listen("c", () => undefined);
    await b.close();
    hanging.clients[0].release?.();
    await vi.advanceTimersByTimeAsync(60_000);
    expect(b.connected).toBe(false);
    expect(hanging.clients).toHaveLength(1);
  });

  it("NOTIFYs through the pool it is given (a transaction pooler is fine)", async () => {
    const { driver, pools } = fakeDriver();
    const query = vi.fn(async () => undefined);
    const channel = pgChannel({ listen: "x", notify: { query }, driver });
    await channel.notify("c", "payload");
    expect(query).toHaveBeenCalledWith("select pg_notify($1, $2)", ["c", "payload"]);
    await channel.close();
    expect(pools).toHaveLength(0);
  });

  it("otherwise NOTIFYs through a small pool of its own on the listen connection, ended by close", async () => {
    const { driver, pools } = fakeDriver();
    const channel = pgChannel({ listen: "postgresql://direct/app", driver });
    await channel.notify("c", "a");
    await channel.notify("c", "b");
    expect(pools).toHaveLength(1);
    expect(pools[0].config).toEqual({ connectionString: "postgresql://direct/app", max: 2 });
    expect(pools[0].calls.map((c) => c.values)).toEqual([["c", "a"], ["c", "b"]]);
    await expect(channel.notify("c", "x".repeat(NOTIFY_LIMIT + 1))).rejects.toThrow(/too large/);
    await channel.close();
    expect(pools[0].ended).toBe(true);
    await channel.close();
  });

  it("uses node-postgres by default", () => {
    const channel = pgChannel({ listen: "postgresql://localhost:1/none" });
    expect(typeof channel.listen).toBe("function");
  });
});

describe("pgChannel — a connection that fails to end", () => {
  it("swallows the error of ending a broken client", async () => {
    vi.useFakeTimers();
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const { driver, clients } = fakeDriver();
    const listener = pgChannel({ listen: "x", driver }).listen("c", () => undefined);
    await vi.advanceTimersByTimeAsync(0);
    for (const c of clients) c.end = () => Promise.reject(new Error("already closed"));
    clients[0].emit("error");
    await vi.advanceTimersByTimeAsync(1000);
    clients[1].end = () => Promise.reject(new Error("already closed"));
    await expect(listener.close()).resolves.toBeUndefined();
  });
});

describe("pgChannel — closed while connecting", () => {
  it("ends a connection that comes up after close, and plans no retry for one that fails after close", async () => {
    vi.useFakeTimers();
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const up = fakeDriver({ hangConnect: true });
    const a = pgChannel({ listen: "x", driver: up.driver }).listen("c", () => undefined);
    up.clients[0].end = () => Promise.reject(new Error("already closed"));
    await a.close();
    up.clients[0].release?.();
    await vi.advanceTimersByTimeAsync(0);
    expect(a.connected).toBe(false);

    const down = fakeDriver({ hangConnect: true, failConnects: 1 });
    const b = pgChannel({ listen: "x", driver: down.driver }).listen("c", () => undefined);
    await b.close();
    down.clients[0].release?.();
    await vi.advanceTimersByTimeAsync(60_000);
    expect(down.clients).toHaveLength(1);
  });
});
