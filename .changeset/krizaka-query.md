---
"@krizaka/query": minor
---

New package — `@krizaka/query` 0.1.0: server state for every Krizaka app (stack decision S1). TanStack Query v5 and its
devtools re-exported whole (products never import `@tanstack/*`), with `createQueryClient` (30 s fresh, retries that
honour a 429's `retryAt` and never insist on a 4xx, `onUnauthorized`, errors to the boundary except lists),
`krizakaFetch` (Standard Schema validation, RFC 9457 Problem Details → `KrizakaApiError` with `code`, `retryAt`,
`fields`), `defineKeys`, `useLiveInvalidation` + `eventSourceLive` (realtime events → cache, de-duplicated, resync after
a reconnection; any `@krizaka/realtime` `RealtimeBus` is a source), App Router hydration (`@krizaka/query/server`:
`prefetch`, `KrizakaHydration`), the offline cache (`./persist`: `createPersister`, `mmkvStorage`), the device wiring
(`./native`: `bindNativeLifecycle`, `nativeQueryDefaults`) and `./devtools`. Ships its `SKILL.md`.
