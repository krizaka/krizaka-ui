# @krizaka/push

## 0.1.1

### Patch Changes

- [#143](https://github.com/krizaka/krizaka-ui/pull/143) [`d0e43fd`](https://github.com/krizaka/krizaka-ui/commit/d0e43fd7defaba8be14d61c3b84799fec817dad5) Thanks [@oussamaABID](https://github.com/oussamaABID)! - Package homepage points to the documentation on krizaka.com (the page the npm listing links to is the one that explains the package).

## 0.1.0

### Minor Changes

- [#92](https://github.com/krizaka/krizaka-ui/pull/92) [`339cb7b`](https://github.com/krizaka/krizaka-ui/commit/339cb7b839e924b17e13150852f7df16112c9118) Thanks [@oussamaABID](https://github.com/oussamaABID)! - New platform bricks, extracted from a product where they ran in production. `@krizaka/realtime`: a realtime bus
  (publish / subscribe by channel) and presence (heartbeat + TTL, grace on disconnect, each change announced once)
  behind one interface, with memory, PostgreSQL LISTEN/NOTIFY and Redis / Valkey adapters, `pgChannel` (node-postgres:
  a direct LISTEN connection, NOTIFY through any pool — PgBouncer in transaction mode included) and Server-Sent Events
  (`eventStream`, `sseFrame`). The root entry loads no driver; `pg` and `ioredis` are optional peers. `@krizaka/push`:
  mobile push through the Expo Push Service (FCM / APNs) without an SDK — batches of 100, dead tokens reported, never
  throws.
