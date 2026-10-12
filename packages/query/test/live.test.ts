import { memoryBus } from "@krizaka/realtime";

import { createQueryClient } from "../src/client";
import { createLiveInvalidator, type EventSourceLike, eventSourceLive, type LiveRules, type LiveSource, OPEN_CHANNEL } from "../src/live";

const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

describe("createLiveInvalidator", () => {
  it("invalidates, writes, de-duplicates and resyncs from a RealtimeBus", async () => {
    const bus = memoryBus();
    const source: LiveSource = bus; // a RealtimeBus is a LiveSource
    const client = createQueryClient();
    client.setQueryData(["notifications"], [1]);
    client.setQueryData(["videos", "v1"], { title: "old" });
    const invalidate = vi.spyOn(client, "invalidateQueries");
    const rules: LiveRules = {
      "notification.created": [["notifications"]],
      "video.updated": (event: { id: string; video: { id: string; title: string } }, qc) => {
        qc.setQueryData(["videos", event.video.id], event.video);
      },
      "video.deleted": (event: { videoId: string }) => [["videos", event.videoId]],
    };
    const off = createLiveInvalidator(client, () => rules).connect(source);

    await bus.publish("message", { type: "notification.created", id: "e1" });
    await bus.publish("message", { type: "notification.created", id: "e1" }); // replayed after a reconnection
    expect(invalidate).toHaveBeenCalledTimes(1);
    expect(client.getQueryState(["notifications"])!.isInvalidated).toBe(true);

    await bus.publish("message", { type: "video.updated", id: "e2", video: { id: "v1", title: "new" } });
    expect(client.getQueryData(["videos", "v1"])).toEqual({ id: "v1", title: "new" });
    expect(invalidate).toHaveBeenCalledTimes(1);

    await bus.publish("message", { type: "video.deleted", videoId: "v1" });
    expect(invalidate).toHaveBeenLastCalledWith({ queryKey: ["videos", "v1"] });

    // ignored: not an object, no type, an unknown type
    await bus.publish("message", "text");
    await bus.publish("message", { id: "e9" });
    await bus.publish("message", { type: "unknown" });
    expect(invalidate).toHaveBeenCalledTimes(2);

    // a reconnection refetches what the static rules name; a first open does not
    await bus.publish(OPEN_CHANNEL, { type: "open", reconnect: false });
    await bus.publish(OPEN_CHANNEL, null);
    expect(invalidate).toHaveBeenCalledTimes(2);
    await bus.publish(OPEN_CHANNEL, { type: "open", reconnect: true });
    expect(invalidate).toHaveBeenLastCalledWith({ queryKey: ["notifications"] });
    expect(invalidate).toHaveBeenCalledTimes(3);

    off();
    await bus.publish("message", { type: "notification.created", id: "e3" });
    expect(invalidate).toHaveBeenCalledTimes(3);
  });

  it("forgets the oldest ids, reads custom fields, can skip the resync", async () => {
    const bus = memoryBus();
    const client = createQueryClient();
    const invalidate = vi.spyOn(client, "invalidateQueries");
    const off = createLiveInvalidator(client, () => ({ ping: [["p"]] }), {
      channel: "events",
      typeOf: (event) => event.kind as string,
      idOf: (event) => event.seq as number,
      remember: 1,
      resyncOnReconnect: false,
    }).connect(bus);
    await bus.publish("events", { kind: "ping", seq: 1 });
    await bus.publish("events", { kind: "ping", seq: 2 });
    await bus.publish("events", { kind: "ping", seq: 1 }); // forgotten: applied again
    await bus.publish(OPEN_CHANNEL, { reconnect: true });
    expect(invalidate).toHaveBeenCalledTimes(3);
    off();
  });
});

/** An EventSource double: the test opens, emits and fails it. */
class FakeEventSource implements EventSourceLike {
  static instances: FakeEventSource[] = [];
  readyState = 0;
  listeners = new Map<string, Set<(event: { data?: unknown; lastEventId?: string }) => void>>();
  closed = false;
  constructor(
    readonly url: string,
    readonly init?: { withCredentials?: boolean },
  ) {
    FakeEventSource.instances.push(this);
  }
  addEventListener(type: string, listener: (event: { data?: unknown; lastEventId?: string }) => void) {
    if (!this.listeners.has(type)) this.listeners.set(type, new Set());
    this.listeners.get(type)!.add(listener);
  }
  removeEventListener(type: string, listener: (event: { data?: unknown; lastEventId?: string }) => void) {
    this.listeners.get(type)?.delete(listener);
  }
  close() {
    this.closed = true;
    this.readyState = 2;
  }
  emit(type: string, event: { data?: unknown; lastEventId?: string } = {}) {
    for (const listener of this.listeners.get(type) ?? []) listener(event);
  }
}

describe("eventSourceLive", () => {
  beforeEach(() => {
    FakeEventSource.instances = [];
  });

  it("shares one stream, parses events, adds the SSE id, announces (re)connections", () => {
    const statuses: string[] = [];
    const live = eventSourceLive(() => "/api/stream", { EventSource: FakeEventSource, withCredentials: true, onStatus: (s) => statuses.push(s) });
    expect(live.status).toBe("idle");
    const messages: unknown[] = [];
    const opens: unknown[] = [];
    const offA = live.subscribe("message", (e) => messages.push(e));
    const offB = live.subscribe("message", () => {
      throw new Error("a failing handler never stops the others");
    });
    const offOpen = live.subscribe(OPEN_CHANNEL, (e) => opens.push(e));
    expect(FakeEventSource.instances).toHaveLength(1);
    const es = FakeEventSource.instances[0]!;
    expect([es.url, es.init]).toEqual(["/api/stream", { withCredentials: true }]);
    expect(live.status).toBe("connecting");

    vi.spyOn(console, "error").mockImplementation(() => undefined);
    es.emit("open");
    es.emit("message", { data: '{"type":"a"}', lastEventId: "m1" });
    es.emit("message", { data: '{"type":"b","id":"own"}', lastEventId: "m2" });
    es.emit("message", { data: "not json" });
    es.emit("message", { data: "[1]", lastEventId: "m3" });
    es.emit("message", { data: '{"type":"c"}' });
    expect(messages).toEqual([{ type: "a", id: "m1" }, { type: "b", id: "own" }, "not json", [1], { type: "c" }]);
    expect(opens).toEqual([{ type: "open", reconnect: false }]);

    // the browser retries by itself (CONNECTING), then reopens
    es.readyState = 0;
    es.emit("error");
    expect(live.status).toBe("reconnecting");
    es.emit("open");
    expect(opens).toEqual([{ type: "open", reconnect: false }, { type: "open", reconnect: true }]);
    expect(statuses).toEqual(["connecting", "open", "reconnecting", "open"]);

    offB();
    offA();
    expect(es.listeners.get("message")!.size).toBe(0);
    offOpen();
    expect(es.closed).toBe(true);
    expect(live.status).toBe("idle");
  });

  it("reopens a stream closed for good with a growing delay, and stops when nobody listens", () => {
    vi.useFakeTimers();
    try {
      const live = eventSourceLive("/s", { EventSource: FakeEventSource, retryDelay: 100, maxRetryDelay: 150 });
      const got: unknown[] = [];
      const off = live.subscribe("custom", (e) => got.push(e));
      const offSecond = live.subscribe("custom", () => undefined); // second subscriber of the same channel: one listener
      const first = FakeEventSource.instances[0]!;
      expect(first.listeners.get("custom")!.size).toBe(1);
      first.readyState = 2;
      first.emit("error");
      expect(first.closed).toBe(true);
      vi.advanceTimersByTime(100);
      const second = FakeEventSource.instances[1]!;
      second.emit("custom", { data: '{"x":1}' });
      expect(got).toEqual([{ x: 1 }]);
      second.readyState = 2;
      second.emit("error");
      vi.advanceTimersByTime(149);
      expect(FakeEventSource.instances).toHaveLength(2);
      vi.advanceTimersByTime(1);
      expect(FakeEventSource.instances).toHaveLength(3);
      const third = FakeEventSource.instances[2]!;
      third.emit("open"); // resets the delay
      third.readyState = 2;
      third.emit("error");
      off();
      offSecond();
      // nobody left: the pending reopen is cancelled
      vi.advanceTimersByTime(1000);
      expect(FakeEventSource.instances).toHaveLength(3);

      // closed for good while every subscriber already left: no reopen
      const lone = eventSourceLive("/t", { EventSource: FakeEventSource });
      const offLone = lone.subscribe("message", () => undefined);
      const es = FakeEventSource.instances[3]!;
      es.readyState = 2;
      offLone();
      es.emit("error");
      vi.advanceTimersByTime(5000);
      expect(FakeEventSource.instances).toHaveLength(4);
    } finally {
      vi.useRealTimers();
    }
  });

  it("uses the global EventSource, and says when there is none", async () => {
    const global = globalThis as { EventSource?: unknown };
    const original = global.EventSource;
    try {
      global.EventSource = FakeEventSource;
      eventSourceLive("/g").subscribe("message", () => undefined)();
      expect(FakeEventSource.instances).toHaveLength(1);
      global.EventSource = undefined;
      expect(() => eventSourceLive("/g").subscribe("message", () => undefined)).toThrow(/needs an EventSource/);
    } finally {
      global.EventSource = original;
    }
    await tick();
  });
});
