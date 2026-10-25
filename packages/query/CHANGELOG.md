# @krizaka/query

## 0.2.2

### Patch Changes

- [#616](https://github.com/krizaka/krizaka-ui/pull/616) [`4c57528`](https://github.com/krizaka/krizaka-ui/commit/4c5752835ebf13c6095abb53ed4c6a74074a5f9e) Thanks [@dependabot](https://github.com/apps/dependabot)! - Dependencies: radix-ui 1.8, TanStack Table 9.3 / Virtual 3.14.21 / Query 5.104.5 and zod 4.6.7 (the monthly grouped update).

## 0.2.1

### Patch Changes

- [#179](https://github.com/krizaka/krizaka-ui/pull/179) [`e3bcc51`](https://github.com/krizaka/krizaka-ui/commit/e3bcc51692773c3cea99ec6198cd0011f026a70e) Thanks [@oussamaABID](https://github.com/oussamaABID)! - The documentation moved to **https://ui.krizaka.com**, built from this repository (`apps/site`) at every change: the
  packages' `homepage` (what npm shows) and READMEs point there — `@krizaka/tokens` to /foundations/tokens, `@krizaka/icons`
  to /foundations/icons, `@krizaka/fonts` to /foundations/typography, the packages without UI to /packages/<name>.
- Updated dependencies [[`e3bcc51`](https://github.com/krizaka/krizaka-ui/commit/e3bcc51692773c3cea99ec6198cd0011f026a70e)]:
  - @krizaka/realtime@0.2.1

## 0.2.0

### Minor Changes

- [#157](https://github.com/krizaka/krizaka-ui/pull/157) [`1d23271`](https://github.com/krizaka/krizaka-ui/commit/1d232714beb074a958a723828ba93bfe035ef703) Thanks [@oussamaABID](https://github.com/oussamaABID)! - `engines` is `node >=22` for every package: Node 20 reached end of life, and the products already run on Node 22. No compatibility shim.

### Patch Changes

- Updated dependencies [[`1d23271`](https://github.com/krizaka/krizaka-ui/commit/1d232714beb074a958a723828ba93bfe035ef703)]:
  - @krizaka/realtime@0.2.0

## 0.1.1

### Patch Changes

- [#143](https://github.com/krizaka/krizaka-ui/pull/143) [`d0e43fd`](https://github.com/krizaka/krizaka-ui/commit/d0e43fd7defaba8be14d61c3b84799fec817dad5) Thanks [@oussamaABID](https://github.com/oussamaABID)! - Package homepage points to the documentation on krizaka.com (the page the npm listing links to is the one that explains the package).
- Updated dependencies [[`d0e43fd`](https://github.com/krizaka/krizaka-ui/commit/d0e43fd7defaba8be14d61c3b84799fec817dad5)]:
  - @krizaka/realtime@0.1.2

## 0.1.0

### Minor Changes

- [#112](https://github.com/krizaka/krizaka-ui/pull/112) [`1ec774c`](https://github.com/krizaka/krizaka-ui/commit/1ec774c9af8717370b01110a281abdf969b7e039) Thanks [@oussamaABID](https://github.com/oussamaABID)! - New package — `@krizaka/query` 0.1.0: server state for every Krizaka app (stack decision S1). TanStack Query v5 and its
  devtools re-exported whole (products never import `@tanstack/*`), with `createQueryClient` (30 s fresh, retries that
  honour a 429's `retryAt` and never insist on a 4xx, `onUnauthorized`, errors to the boundary except lists),
  `krizakaFetch` (Standard Schema validation, RFC 9457 Problem Details → `KrizakaApiError` with `code`, `retryAt`,
  `fields`), `defineKeys`, `useLiveInvalidation` + `eventSourceLive` (realtime events → cache, de-duplicated, resync after
  a reconnection; any `@krizaka/realtime` `RealtimeBus` is a source), App Router hydration (`@krizaka/query/server`:
  `prefetch`, `KrizakaHydration`), the offline cache (`./persist`: `createPersister`, `mmkvStorage`), the device wiring
  (`./native`: `bindNativeLifecycle`, `nativeQueryDefaults`) and `./devtools`. Ships its `SKILL.md`.
