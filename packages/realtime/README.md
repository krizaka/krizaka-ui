# @krizaka/realtime

Realtime for a Node app, behind **one interface**: a bus (publish / subscribe by channel), presence (who is
connected, by heartbeat and time-to-live) and Server-Sent Events. The adapter is a deployment choice — memory,
**PostgreSQL LISTEN/NOTIFY** or **Redis / Valkey** — and the code that publishes and subscribes never knows which.

```bash
npm install @krizaka/realtime
npm install pg        # for the PostgreSQL adapter's pgChannel (optional peer)
npm install ioredis   # for the Redis / Valkey adapter (optional peer)
```

ESM only, Node ≥ 22. The root entry loads no driver.

## What is in it

| Entry | What | Needs |
| :-- | :-- | :-- |
| `@krizaka/realtime` | `RealtimeBus`, `PresenceStore` and their types · `createBus` · `busKind` · `memoryBus` · `postgresBus` · `ReplicatedPresence` · `eventStream`, `sseFrame` | nothing |
| `@krizaka/realtime/sse` | `eventStream`, `sseFrame` alone (an edge route that only streams) | nothing |
| `@krizaka/realtime/postgres` | `postgresBus`, `PostgresChannel`, `NOTIFY_LIMIT`, `DEFAULT_CHANNEL` | a `PostgresChannel` |
| `@krizaka/realtime/pg` | `pgChannel` — a `PostgresChannel` on node-postgres | `pg` |
| `@krizaka/realtime/redis` | `redisBus`, `RedisPresence`, `DEFAULT_PREFIX` | `ioredis` |

## The contract

- **Best-effort.** `publish` never throws; when the network fails, the event still reaches this instance's
  subscribers. Durable facts (messages, bids) live in the database and are replayed from it — never from the bus.
- **Small payloads.** Ids and small facts; PostgreSQL caps a NOTIFY at 8 000 bytes (`NOTIFY_LIMIT` = 7 900 with the
  envelope).
- **Presence is never a database write per beat.** A connection beats (`beat`) every third of `ttlMs` (default
  45 s); a closed one lingers `graceMs` (default 10 s) so a reconnection changes nothing; `settle` after the grace
  tells whether the person went offline. Every call answers the change it caused, once, so the caller publishes it
  once — whichever instance noticed it.
- **Fail loudly on configuration.** `createBus` refuses a bus that cannot work (redis without a URL, postgres without a
  channel) instead of falling back to memory.

## Wiring it once

```ts
// lib/realtime.ts — the app's one realtime door
import { busKind, createBus, eventStream, type RealtimeBus } from "@krizaka/realtime";
import { pgChannel } from "@krizaka/realtime/pg";
import { redisBus } from "@krizaka/realtime/redis";

import { pool } from "./db"; // the app's own pool (a transaction pooler is fine for NOTIFY)

let bus: RealtimeBus | undefined;
export function realtimeBus() {
  return (bus ??= createBus({
    kind: busKind(process.env.REALTIME_BUS),               // postgres (default) · redis · memory
    // LISTEN needs a session: a direct connection, never PgBouncer in transaction mode.
    postgres: pgChannel({ listen: process.env.DATABASE_DIRECT_URL!, notify: pool }),
    channel: "myapp_events",                              // one NOTIFY channel per app
    redisBus,
    redisUrl: process.env.REALTIME_REDIS_URL,
    prefix: "myapp:rt:",                                  // one key prefix per app on a shared server
  }));
}

// app/api/events/route.ts — a Server-Sent Events stream
export function GET() {
  return eventStream({
    retryMs: 2000,
    heartbeatMs: 15_000,
    maxLifetimeMs: 300_000,                               // under the platform's request timeout; the client comes back
    start: ({ send }) => realtimeBus().subscribe(`user:${userId}`, (event) => send({ data: event })),
  });
}
```

The package reads **no environment variable**: the app decides which URL is the direct one, which channel and which
prefix are its own. Bring your own `PostgresChannel` (`{ notify, listen }`) if your app already has a LISTEN
connection; `pgChannel` is only the ready-made one.

## Which adapter

| Adapter | Fan-out | Presence | Choose it when |
| :-- | :-- | :-- | :-- |
| `memory` | inside one process | in memory | tests, one instance without a database |
| `postgres` (default) | `NOTIFY` to every instance's `LISTEN` — every instance receives every event | each instance's memory, replicated over the same channel (changes + a snapshot every 30 s) | one to ~3 instances: no extra service to run or pay for |
| `redis` | Redis / Valkey pub/sub, one subscription per channel that has a listener on the instance | in Redis, one atomic script per beat, keys that expire by themselves | more instances or many open streams: an event crosses the network only to instances that listen |

Switch to **Redis / Valkey** when the instances multiply (every PostgreSQL instance receives every event and the
NOTIFY queue is shared with the database), when presence must survive an instance's restart without a 75 s fade, or
when a managed cache is already there. Switching is a variable and a restart.

### PostgreSQL behind a pooler

`LISTEN` lives as long as its **session**. Behind PgBouncer (or any pooler) in **transaction** mode, the subscription
is lost between transactions: give `pgChannel` a **direct** connection string for `listen` (DigitalOcean, Supabase,
Neon and others all offer one next to the pooled one), and pass the app's pooled `pool` as `notify` — a NOTIFY is one
statement and goes through a transaction pooler. Without `notify`, `pgChannel` opens a pool of two connections on the
`listen` URL. The LISTEN connection reconnects by itself (1 s, doubling, capped at 30 s); while it is down, the
instance still publishes to the others and delivers its own events locally (`bus.connected` is `false`).

## How the Krizaka products use it

- **A video platform**: one `user:<id>` topic per account (messages, receipts, typing, notifications), `presence:<id>`
  delivered only to those allowed to see it, one topic per live auction and per challenge; the chat stream replays
  missed messages from the database with `Last-Event-ID`, then follows the bus.
- **A dating app**: the agent's reply streamed as SSE, the events of an account (a batch is ready, a new intro, a
  message) on `user:<id>`, the messages of an intro on `intro:<id>`.

Both run `postgres` by default and keep `redis` one variable away.

## Tests

`pnpm --filter @krizaka/realtime test` covers every adapter without a server (100 % enforced): the PostgreSQL bus over
an in-memory channel, `pgChannel` over a fake driver. The contract against real servers — two instances per adapter,
delivery under a second, order of a burst, presence announced once — runs with `REALTIME_IT=1`
(`pnpm --filter @krizaka/realtime test:integration`, `DATABASE_URL` and `REALTIME_REDIS_URL`), in CI's "Realtime adapters" job.

## License

Apache-2.0 © Krizaka
