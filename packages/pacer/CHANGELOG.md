# @krizaka/pacer

## 0.2.0

### Minor Changes

- [#915](https://github.com/krizaka/krizaka-ui/pull/915) [`0caeef8`](https://github.com/krizaka/krizaka-ui/commit/0caeef8fdf1421831de42a5ec18a0b24680029e8) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - `mapConcurrent(items, task, { concurrency, signal })`: one task per item, at most `concurrency` at once (default 3), every outcome kept in the items' order (a failure never stops the others). For « upload these photos, then save once » — the forms stop hand-writing a sequential loop.

## 0.1.0

### Minor Changes

- [#178](https://github.com/krizaka/krizaka-ui/pull/178) [`dbf4e2d`](https://github.com/krizaka/krizaka-ui/commit/dbf4e2d9ed12caf7c580fc89588aa02b59d6c703) Thanks [@oussamaABID](https://github.com/oussamaABID)! - New package: cadence for every Krizaka app, on TanStack Pacer (beta) behind the Krizaka facade — `debounce` / `throttle` and the hooks `useDebouncedValue`, `useDebouncedCallback`, `useThrottledCallback`; `createQueue` (concurrency, priority, retries with backoff and jitter, `shouldRetry`, pause / resume / retry / cancel per job, a snapshot that is stable until something changes) with `useQueue` / `useQueueSnapshot`; and `RateLimiter`, with `RateLimiter.fromProblemDetails()` reading a 429's `retryAt`, `retryAfterSeconds` or `Retry-After`.
