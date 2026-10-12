---
"@krizaka/realtime": minor
"@krizaka/push": minor
---

New platform bricks, extracted from a product where they ran in production. `@krizaka/realtime`: a realtime bus
(publish / subscribe by channel) and presence (heartbeat + TTL, grace on disconnect, each change announced once)
behind one interface, with memory, PostgreSQL LISTEN/NOTIFY and Redis / Valkey adapters, `pgChannel` (node-postgres:
a direct LISTEN connection, NOTIFY through any pool — PgBouncer in transaction mode included) and Server-Sent Events
(`eventStream`, `sseFrame`). The root entry loads no driver; `pg` and `ioredis` are optional peers. `@krizaka/push`:
mobile push through the Expo Push Service (FCM / APNs) without an SDK — batches of 100, dead tokens reported, never
throws.
