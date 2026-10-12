# @krizaka/query — Package Contract (agent-neutral)

> Published on npm as **`@krizaka/query`**. Lives in `packages/query` of the krizaka-ui monorepo: the root
> [`AGENTS.md`](../../AGENTS.md) applies first.

## 1. What belongs here

- **Server state shared by every product** (stack decision S1): TanStack Query v5 re-exported whole, the Krizaka
  defaults (`createQueryClient`), the typed fetch and its error (`krizakaFetch`, `KrizakaApiError`), typed keys
  (`defineKeys`), the realtime → cache bridge (`useLiveInvalidation`, `eventSourceLive`), App Router hydration
  (`./server`), the offline cache (`./persist`), the device wiring (`./native`), the devtools (`./devtools`).
- Not here: a product's endpoints, keys, schemas or event names (the app's `lib/<resource>.ts` or `packages/core`), the
  server side of the stream (`@krizaka/realtime`), the words of an error (the app's catalogue, by `messageKey()`).

## 2. Rules

- **The only door to `@tanstack/*query*`.** Products import this package; a TanStack upgrade is a release of it.
  TanStack versions are pinned exactly and move together (query, devtools, persister).
- **Server-safe by default.** `.`, `./server`, `./persist`, `./native` carry no `"use client"`: `krizakaFetch`,
  `createQueryClient` and the error class are callable from a Server Component. Only `react.js` (the provider, the live
  hook) and `./devtools` are client modules (tsup banner). The framework-free code lives once, in `core.js`, so every
  entry shares one `KrizakaApiError` class.
- **No product word, nothing read from the environment.** URLs, tokens, channels, event names arrive as arguments.
- **No React Native import.** `./native` and `./persist` take `AppState`, NetInfo, AsyncStorage or MMKV as arguments
  (structural types), so the web bundle never sees them.
- **Never a fetch in a client effect** — not even in an example: the first screen is a Server Component.

## 3. Quality gates

- `pnpm turbo run check --filter=@krizaka/query`: ESLint and `tsc` (sources, tests, both examples), tests (Vitest on
  happy-dom; functions and lines 100 %), build, size, publint + attw (`esm-only`).
- `examples/next-app-router` and `examples/expo` are type-checked by `typecheck`: they are the documentation that
  compiles.
- **Size budget** (gzip, TanStack and React excluded): `.` ≤ 4 kB, `./server` ≤ 1.5 kB, `./persist` ≤ 600 B,
  `./native` ≤ 500 B, `./devtools` ≤ 300 B.
- Published surface: exports `.`, `./server`, `./persist`, `./native`, `./devtools`, `./package.json`; files `dist`,
  `README.md`, `SKILL.md`, `LICENSE`. Renaming an export, a `KrizakaApiError` field, an error code or a default is a
  breaking change.

## 4. Release

A changeset for every change to `src/`. Not in the `fixed` group: its own version (0.x while the products adopt it).
`SKILL.md` is written by hand until the generated skills (stack decision S12) arrive.
