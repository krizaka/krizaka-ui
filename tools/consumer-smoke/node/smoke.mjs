// The server-side packages, imported from npm by a plain Node ESM script, and exercised on their documented contract:
// @krizaka/realtime (memory bus, SSE framing and the stream) and @krizaka/push (token check, batching, dead tokens).
import assert from "node:assert/strict";
import { busKind, createBus, eventStream, memoryBus, sseFrame } from "@krizaka/realtime";
import { sseFrame as sseFrameAlone } from "@krizaka/realtime/sse";
import { EXPO_PUSH_BATCH, isExpoPushToken, sendExpoPush } from "@krizaka/push";

// realtime — a published event reaches the subscriber of its channel only.
const bus = memoryBus();
const seen = [];
const stop = bus.subscribe("room:1", (event) => seen.push(event));
await bus.publish("room:1", { bid: 42 });
await bus.publish("room:2", { bid: 7 });
await new Promise((resolve) => setTimeout(resolve, 20));
assert.deepEqual(seen, [{ bid: 42 }]);
stop();
assert.equal(busKind("memory"), "memory");
assert.ok(createBus({ kind: "memory" }));
assert.throws(() => createBus({ kind: "postgres" }), /PostgreSQL channel/); // fails loudly, never falls back to memory

const frame = sseFrame({ event: "bid", data: { bid: 42 } });
assert.match(frame, /event: bid/);
assert.equal(sseFrameAlone({ data: "x" }), sseFrame({ data: "x" }));

const response = eventStream({ start: ({ send }) => { send({ data: "hello" }); return () => {}; } });
assert.ok(response instanceof Response);
assert.match(response.headers.get("content-type") ?? "", /text\/event-stream/);
const reader = response.body.getReader();
const { value } = await reader.read();
const text = new TextDecoder().decode(value);
await reader.cancel();
assert.ok(text.length > 0, "the stream sends a first frame");

// push — tokens, batching by EXPO_PUSH_BATCH, dead tokens reported, never throws.
assert.equal(isExpoPushToken("ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]"), true);
assert.equal(isExpoPushToken("not-a-token"), false);
const calls = [];
const fakeFetch = async (_url, init) => {
  const body = JSON.parse(init.body);
  calls.push(body.length);
  return new Response(JSON.stringify({ data: body.map((_, i) => (i === 0 ? { status: "error", details: { error: "DeviceNotRegistered" } } : { status: "ok", id: `t${i}` })) }), { status: 200, headers: { "content-type": "application/json" } });
};
const messages = Array.from({ length: EXPO_PUSH_BATCH + 1 }, (_, i) => ({ to: `ExponentPushToken[device-token-${i}]`, title: "Hi", body: "A new bid" }));
const outcome = await sendExpoPush(messages, { fetch: fakeFetch });
assert.deepEqual(calls, [EXPO_PUSH_BATCH, 1]);
assert.equal(outcome.sent, EXPO_PUSH_BATCH - 1);
assert.deepEqual(outcome.deadTokens, [messages[0].to, messages[EXPO_PUSH_BATCH].to]);
const broken = await sendExpoPush(messages.slice(0, 1), { fetch: async () => { throw new Error("network down"); } });
assert.deepEqual(broken, { sent: 0, deadTokens: [], errors: ["network down"] });

console.log(JSON.stringify({ realtime: "ok", push: "ok", sent: outcome.sent, dead: outcome.deadTokens.length }));
