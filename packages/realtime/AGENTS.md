# @krizaka/realtime — Package Contract (agent-neutral)

> Published on npm as **`@krizaka/realtime`**. Lives in `packages/realtime` of the krizaka-ui monorepo: the root
> [`AGENTS.md`](../../AGENTS.md) applies first.

## 1. What belongs here

- **Server realtime shared by every product**: the `RealtimeBus` interface (publish / subscribe by channel, presence),
  its adapters (memory, PostgreSQL LISTEN/NOTIFY, Redis / Valkey), `pgChannel` (node-postgres), Server-Sent Events
  framing (`eventStream`, `sseFrame`). Level 0, no UI.
- Not here: topics and who may read them (the app's `lib/realtime.ts` and its access rules), message persistence and
  replay, the client side (`EventSource`, React Native SSE), a product's channel name or key prefix.

## 2. Rules

- **No product word** anywhere in this folder, code or docs: channel and prefix defaults are generic
  (`DEFAULT_CHANNEL`, `DEFAULT_PREFIX`), the app passes its own.
- **Nothing read from the environment.** Connection strings, channel, prefix and timings arrive as arguments; error
  messages may name the conventional variables (`REALTIME_BUS`, `REDIS_URL`) the apps use.
- **The root entry loads no driver.** `pg` and `ioredis` are optional peer dependencies, imported only by `./pg` and
  `./redis`; `createBus` receives `redisBus` rather than importing it. Never a static import of a driver from
  `src/index.ts`, `src/postgres.ts`, `src/memory.ts`, `src/presence.ts` or `src/sse.ts`.
- **LISTEN takes a direct connection** (`pgChannel({ listen })`); NOTIFY may go through any pool.
- **Best-effort**: `publish` never throws; a failing subscriber never stops the others; payloads stay under
  `NOTIFY_LIMIT`.

## 3. Quality gates

- `pnpm turbo run check --filter=@krizaka/realtime`: ESLint and `tsc`, tests (Vitest, **100 % coverage enforced** on
  everything but `src/redis.ts`), build, size, publint + attw (`esm-only`).
- `src/redis.ts` and the PostgreSQL path end to end are proven by `test/bus.integration.test.ts` against real servers
  (`REALTIME_IT=1`, CI job "Realtime adapters": PostgreSQL 16 and Valkey 8 services).
- **Size budget** (gzip, drivers excluded): `.` ≤ 4 kB, `./sse` ≤ 1 kB, `./pg` ≤ 2 kB, `./redis` ≤ 3 kB.
- Published surface: exports `.`, `./sse`, `./postgres`, `./pg`, `./redis`, `./package.json`; files `dist`,
  `README.md`, `LICENSE`. Removing or renaming an export or an option, or changing the NOTIFY envelope
  (`{ topic, event }`) or the Redis key layout, is a breaking change (instances of two versions share a channel during
  a rolling deploy).

## 4. Release

A changeset for every change to `src/`. Not in the `fixed` group: its own version (0.x while the products adopt it).
