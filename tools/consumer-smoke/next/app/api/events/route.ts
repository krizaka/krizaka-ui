import { memoryBus, eventStream } from "@krizaka/realtime";

// The documented Server-Sent Events route (README of @krizaka/realtime), on the in-process bus.
const bus = memoryBus();

export function GET() {
  return eventStream({
    retryMs: 2000,
    heartbeatMs: 15_000,
    maxLifetimeMs: 300_000,
    start: ({ send }) => bus.subscribe("smoke", (event) => send({ data: event })),
  });
}
