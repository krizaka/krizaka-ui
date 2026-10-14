---
"@krizaka/pacer": minor
---

New package: cadence for every Krizaka app, on TanStack Pacer (beta) behind the Krizaka facade — `debounce` / `throttle` and the hooks `useDebouncedValue`, `useDebouncedCallback`, `useThrottledCallback`; `createQueue` (concurrency, priority, retries with backoff and jitter, `shouldRetry`, pause / resume / retry / cancel per job, a snapshot that is stable until something changes) with `useQueue` / `useQueueSnapshot`; and `RateLimiter`, with `RateLimiter.fromProblemDetails()` reading a 429's `retryAt`, `retryAfterSeconds` or `Retry-After`.
