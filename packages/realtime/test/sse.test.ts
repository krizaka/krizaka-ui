import { describe, expect, it, vi } from "vitest";

import { busKind, createBus } from "../src/index";
import { eventStream, sseFrame } from "../src/sse";

describe("Server-Sent Events", () => {
  it("frames id, event, data and retry; a line break cannot inject a field", () => {
    expect(sseFrame({ id: "m42", event: "message", data: { a: 1 } })).toBe('id: m42\nevent: message\ndata: {"a":1}\n\n');
    expect(sseFrame({ retry: 1500 })).toBe("retry: 1500\n\n");
    expect(sseFrame({ comment: "x\ndata: evil" })).toBe(": x data: evil\n\n");
    expect(sseFrame({ data: "a\nb" })).toBe('data: "a\\nb"\n\n');
  });

  it("streams what start sends, then runs the cleanup when the client goes away", async () => {
    let cleaned = false;
    const res = eventStream({
      retryMs: 1000,
      start: ({ send }) => {
        send({ event: "connected", data: { ok: true } });
        return () => {
          cleaned = true;
        };
      },
    });
    expect(res.headers.get("content-type")).toContain("text/event-stream");
    const reader = res.body!.getReader();
    let text = "";
    while (!text.includes("connected")) text += new TextDecoder().decode((await reader.read()).value);
    expect(text).toContain("retry: 1000");
    await reader.cancel();
    expect(cleaned).toBe(true);
  });

  it("ends by itself after its maximum lifetime", async () => {
    const res = eventStream({ maxLifetimeMs: 30, start: () => undefined });
    const reader = res.body!.getReader();
    let done = false;
    while (!done) done = (await reader.read()).done;
    expect(done).toBe(true);
  });
});

describe("configuration", () => {
  it("defaults to postgres and refuses an unknown bus", () => {
    expect(busKind(undefined)).toBe("postgres");
    expect(busKind(" Redis ")).toBe("redis");
    expect(() => busKind("kafka")).toThrow(/REALTIME_BUS/);
  });

  it("refuses redis without a URL rather than falling back", () => {
    expect(() => createBus({ kind: "redis" })).toThrow(/REDIS_URL/);
    expect(createBus({ kind: "memory" }).kind).toBe("memory");
  });
});

describe("Server-Sent Events — lifecycle", () => {
  async function readAll(res: Response) {
    const reader = res.body!.getReader();
    let text = "";
    for (;;) {
      const { done, value } = await reader.read();
      if (done) return text;
      text += new TextDecoder().decode(value);
    }
  }

  it("beats on its own pace and calls onHeartbeat", async () => {
    let beats = 0;
    const res = eventStream({
      heartbeatMs: 5,
      maxLifetimeMs: 40,
      onHeartbeat: () => beats++,
      headers: { "X-Test": "1" },
      start: () => undefined,
    });
    expect(res.headers.get("x-test")).toBe("1");
    expect(await readAll(res)).toContain(": heartbeat");
    expect(beats).toBeGreaterThan(0);
  });

  it("ends when start fails, and runs a cleanup returned after the stream already ended", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    expect(await readAll(eventStream({ start: () => Promise.reject(new Error("no")) }))).toBe("");
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
    let cleaned = false;
    const text = await readAll(
      eventStream({
        start: ({ send, close }) => {
          send({ data: 1 });
          close();
          send({ data: 2 }); // after the end: dropped
          return () => {
            cleaned = true;
            throw new Error("a failing cleanup does not stop the others");
          };
        },
      }),
    );
    expect(text).toBe("data: 1\n\n");
    expect(cleaned).toBe(true);
  });

  it("a cleanup that throws at the end does not stop the others", async () => {
    let second = false;
    await readAll(
      eventStream({
        maxLifetimeMs: 10,
        start: () => () => {
          second = true;
          throw new Error("boom");
        },
      }),
    );
    expect(second).toBe(true);
  });
});
