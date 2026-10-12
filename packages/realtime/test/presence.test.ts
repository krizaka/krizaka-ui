import { describe, expect, it } from "vitest";

import { memoryBus } from "../src/memory";
import { type PresenceReplica,ReplicatedPresence } from "../src/presence";

const opts = { ttlMs: 45_000, graceMs: 10_000 };

describe("presence by heartbeat and TTL", () => {
  it("announces online once, then nothing while beats keep coming", async () => {
    const p = new ReplicatedPresence({ instanceId: "a", ...opts });
    expect(await p.beat("u", "c1", "online", 0)).toEqual({ userId: "u", state: "online", at: 0 });
    expect(await p.beat("u", "c1", "online", 15_000)).toBeNull();
    expect(await p.beat("u", "c2", "online", 16_000)).toBeNull();
    expect((await p.get(["u"], 20_000)).get("u")?.state).toBe("online");
  });

  it("is as present as the most present connection (online beats away)", async () => {
    const p = new ReplicatedPresence({ instanceId: "a", ...opts });
    await p.beat("u", "phone", "away", 0);
    expect((await p.get(["u"], 1)).get("u")?.state).toBe("away");
    expect(await p.beat("u", "laptop", "online", 2)).toMatchObject({ state: "online" });
    expect(await p.beat("u", "laptop", "away", 3)).toMatchObject({ state: "away" });
  });

  it("a closed connection lingers for the grace period: a quick reconnection changes nothing", async () => {
    const p = new ReplicatedPresence({ instanceId: "a", ...opts });
    await p.beat("u", "c1", "online", 0);
    expect(await p.leave("u", "c1", 1_000)).toBeNull();
    expect(await p.beat("u", "c2", "online", 3_000)).toBeNull();
    expect(await p.settle("u", 20_000)).toBeNull();
    expect((await p.get(["u"], 20_000)).get("u")?.state).toBe("online");
  });

  it("goes offline after the grace, with the time last seen", async () => {
    const p = new ReplicatedPresence({ instanceId: "a", ...opts });
    await p.beat("u", "c1", "online", 0);
    await p.leave("u", "c1", 1_000);
    expect(await p.settle("u", 11_001)).toEqual({ userId: "u", state: "offline", at: 11_001 });
    const info = (await p.get(["u"], 12_000)).get("u");
    expect(info).toEqual({ state: "offline", lastSeenAt: 11_001 });
  });

  it("a connection that stops beating expires after its TTL (a crashed tab)", async () => {
    const p = new ReplicatedPresence({ instanceId: "a", ...opts });
    await p.beat("u", "c1", "online", 0);
    expect((await p.get(["u"], 44_999)).get("u")?.state).toBe("online");
    expect((await p.get(["u"], 45_000)).get("u")?.state).toBe("offline");
    expect(await p.settle("u", 45_000)).toMatchObject({ state: "offline" });
  });

  it("someone never seen is offline with no last-seen time", async () => {
    const p = new ReplicatedPresence({ instanceId: "a", ...opts });
    expect((await p.get(["ghost"])).get("ghost")).toEqual({ state: "offline", lastSeenAt: null });
  });
});

describe("presence replicated between instances", () => {
  function pair() {
    const queue: PresenceReplica[] = [];
    const a = new ReplicatedPresence({ instanceId: "A", ...opts, broadcast: (r) => queue.push(r) });
    const b = new ReplicatedPresence({ instanceId: "B", ...opts, broadcast: (r) => queue.push(r) });
    const deliver = () => {
      while (queue.length) {
        const r = queue.shift()!;
        a.receive(r, 0);
        b.receive(r, 0);
      }
    };
    return { a, b, deliver };
  }

  it("a person connected to A is online for B too", async () => {
    const { a, b, deliver } = pair();
    expect(await a.beat("u", "c1", "online", 0)).toMatchObject({ state: "online" });
    deliver();
    expect((await b.get(["u"], 1)).get("u")?.state).toBe("online");
  });

  it("closing the tab on A while the phone is on B keeps the person online, and only one instance announces", async () => {
    const { a, b, deliver } = pair();
    await a.beat("u", "tab", "online", 0);
    deliver();
    expect(await b.beat("u", "phone", "online", 0)).toBeNull(); // already announced by A
    deliver();
    await a.leave("u", "tab", 0);
    expect(await a.settle("u", 10_001)).toBeNull(); // B still holds the phone
    deliver();
    expect((await a.get(["u"], 10_002)).get("u")?.state).toBe("online");
  });

  it("the last instance to lose the person announces offline, and a later return is announced again", async () => {
    const { a, b, deliver } = pair();
    await a.beat("u", "tab", "online", 0);
    deliver();
    await a.leave("u", "tab", 0);
    expect(await a.settle("u", 10_001)).toMatchObject({ state: "offline" });
    deliver();
    expect(await b.beat("u", "phone", "online", 20_000)).toMatchObject({ state: "online" });
  });

  it("both instances losing the person at once: exactly one of them announces offline", async () => {
    const queue: PresenceReplica[] = [];
    const found: string[] = [];
    const a = new ReplicatedPresence({ instanceId: "A", ...opts, broadcast: (r) => queue.push(r) });
    const b = new ReplicatedPresence({ instanceId: "B", ...opts, broadcast: (r) => queue.push(r) });
    a.onChange((c) => found.push(`A:${c.state}`));
    b.onChange((c) => found.push(`B:${c.state}`));
    await a.beat("u", "tab", "online", 0);
    await b.beat("u", "phone", "online", 0);
    for (const r of queue.splice(0)) (r.i === "A" ? b : a).receive(r, 0);
    await a.leave("u", "tab", 0);
    await b.leave("u", "phone", 0);
    // Both settle before hearing from the other: neither sees the person offline yet.
    expect(await a.settle("u", 10_001)).toBeNull();
    expect(await b.settle("u", 10_001)).toBeNull();
    for (const r of queue.splice(0)) (r.i === "A" ? b : a).receive(r, 10_002);
    expect(found).toEqual(["B:offline"]);
  });

  it("snapshots fit the bus and fade when an instance goes silent", async () => {
    const a = new ReplicatedPresence({ instanceId: "A", ...opts, snapshotPage: 2, snapshotTtlMs: 75_000 });
    for (const u of ["u1", "u2", "u3"]) await a.beat(u, "c", "online", 0);
    const pages = a.snapshot(1);
    expect(pages).toHaveLength(2);
    const b = new ReplicatedPresence({ instanceId: "B", ...opts, snapshotTtlMs: 75_000 });
    for (const page of pages) b.receive(page, 1);
    expect((await b.get(["u1", "u3"], 2)).get("u3")?.state).toBe("online");
    expect((await b.get(["u3"], 75_002)).get("u3")?.state).toBe("offline");
  });
});

describe("the memory bus", () => {
  it("delivers to every subscriber of a channel, never to others, and stops after unsubscribe", async () => {
    const bus = memoryBus();
    const got: unknown[] = [];
    const off = bus.subscribe("user:1", (e) => got.push(e));
    bus.subscribe("user:2", () => got.push("wrong"));
    await bus.publish("user:1", { n: 1 });
    off();
    await bus.publish("user:1", { n: 2 });
    expect(got).toEqual([{ n: 1 }]);
  });

  it("a failing subscriber does not stop the others", async () => {
    const bus = memoryBus();
    const got: unknown[] = [];
    bus.subscribe("c", () => {
      throw new Error("boom");
    });
    bus.subscribe("c", (e) => got.push(e));
    await bus.publish("c", 1);
    expect(got).toEqual([1]);
  });
});

describe("presence — edges", () => {
  it("counts its connections, and stops telling a listener once it unsubscribed", async () => {
    const queue: PresenceReplica[] = [];
    const a = new ReplicatedPresence({ instanceId: "A", ...opts, broadcast: (r) => queue.push(r) });
    const b = new ReplicatedPresence({ instanceId: "B", ...opts });
    await a.beat("u", "c1", "online", 0);
    await a.beat("u", "c2", "online", 0);
    await a.beat("v", "c3", "away", 0);
    expect(a.connections).toBe(3);
    const heard: unknown[] = [];
    const off = b.onChange((c) => heard.push(c));
    off();
    for (const r of queue.splice(0)) b.receive(r, 0);
    b.receive({ t: "d", i: "B", u: "u", s: "offline", at: 0 }, 0); // its own echo: ignored
    expect(heard).toEqual([]);
    expect((await b.get(["u", "v"], 1)).get("v")?.state).toBe("away");
  });

  it("an instance reporting a person offline removes only its own view", async () => {
    const b = new ReplicatedPresence({ instanceId: "B", ...opts });
    b.receive({ t: "d", i: "A", u: "u", s: "online", at: 0 }, 0);
    b.receive({ t: "d", i: "C", u: "u", s: "away", at: 0 }, 0);
    b.receive({ t: "d", i: "A", u: "u", s: "offline", at: 1 }, 1);
    expect((await b.get(["u"], 2)).get("u")?.state).toBe("away");
    b.receive({ t: "d", i: "C", u: "u", s: "offline", at: 3 }, 3);
    b.receive({ t: "d", i: "C", u: "nobody", s: "offline", at: 3 }, 3);
    expect((await b.get(["u"], 4)).get("u")).toEqual({ state: "offline", lastSeenAt: 3 });
  });

  it("a remote view expires on its own when the instance goes silent", async () => {
    const b = new ReplicatedPresence({ instanceId: "B", ...opts, snapshotTtlMs: 100 });
    b.receive({ t: "d", i: "A", u: "u", s: "online", at: 0 }, 0);
    b.receive({ t: "d", i: "C", u: "u", s: "online", at: 0 }, 50);
    expect((await b.get(["u"], 120)).get("u")?.state).toBe("online");
    expect((await b.get(["u"], 200)).get("u")?.state).toBe("offline");
  });

  it("leaving a connection it never saw, or a snapshot of nobody, changes nothing", async () => {
    const p = new ReplicatedPresence({ instanceId: "A", ...opts });
    expect(await p.leave("u", "ghost", 0)).toBeNull();
    await p.beat("u", "c", "online", 0);
    expect(p.snapshot(50_000)).toEqual([]);
  });

  it("keeps a bounded memory of when people were last seen", async () => {
    const p = new ReplicatedPresence({ instanceId: "A", ...opts });
    for (let i = 0; i < 100_000; i++) await p.settle(`u${i}`, 0);
    for (let i = 0; i < 100_000; i++) await p.beat(`u${i}`, "c", "online", 0);
    await p.beat("one-more", "c", "online", 0);
    expect((await p.get(["one-more"], 1)).get("one-more")?.state).toBe("online");
  });
});

describe("the memory bus — close", () => {
  it("drops every subscriber", async () => {
    const bus = memoryBus();
    const got: unknown[] = [];
    bus.subscribe("c", (e) => got.push(e));
    await bus.close();
    await bus.publish("c", 1);
    expect(got).toEqual([]);
    expect(bus.connected).toBe(true);
  });
});
