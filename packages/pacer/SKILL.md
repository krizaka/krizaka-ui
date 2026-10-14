---
name: krizaka-pacer
description: Cadence in a Krizaka app with @krizaka/pacer (TanStack Pacer behind the Krizaka facade) — debouncing a search or an autosave, throttling a scroll or a progress, a queue of uploads or syncs with concurrency, priority, retries with backoff and pause/resume per job, a client rate limiter that obeys a 429's Retry-After. Use it before writing a setTimeout debounce, a retry loop, an upload queue or a rate-limit check in a Krizaka product.
---

# @krizaka/pacer

## Rules

1. Import from `@krizaka/pacer` (framework-free) and `@krizaka/pacer/react` (hooks) — **never `@tanstack/pacer`** and
   never a hand-written `setTimeout` debounce or retry loop.
2. A search box or an autosave: `useDebouncedValue(value, ms)` / `useDebouncedCallback(fn, ms)` (`cancel()`, `flush()`).
   A scroll, a pointer, a progress callback: `useThrottledCallback(fn, ms)`.
3. A list of things to send (uploads, a draft sync, a batch of pushes): `createQueue` / `useQueue`. The job receives
   `{ signal, attempt, resumed }` — **stop when `signal` aborts**, continue from your offset when `resumed`.
4. Failures: `retries` + `backoff` (`exponential` by default, 1 s, capped at 30 s) and `shouldRetry` to refuse a 4xx.
   A job that exhausts them is `status: "error"` with `error`; `retry(id)` puts it back.
5. A server's 429: `RateLimiter.fromProblemDetails(body | headers | response)` then `await limiter.wait(signal)` before
   the call — it reads `retryAt`, `retryAfterSeconds` and `Retry-After`, like `KrizakaApiError`.

## Recipes

```tsx
const [text, setText] = useState("");
const query = useDebouncedValue(text, 250);                 // feed `query` to useQuery
```

```tsx
const queue = useQueue<{ name: string; progress: number }>({ concurrency: 2, retries: 3 });
const jobs = useQueueSnapshot(queue);                        // re-renders when a job changes
queue.add(async ({ signal, resumed }) => upload(file, { signal, resumed, onProgress: (p) => queue.update(file.name, (m) => ({ ...m, progress: p })) }),
          { id: file.name, meta: { name: file.name, progress: 0 } });
```

- `pause(id)` aborts the job's signal and frees its place; `resume(id)` runs it again with `resumed: true`.
- `pauseAll()` / `resumeAll()` only stop or restart *starting* jobs (the ones under way finish); `configure({ concurrency })`
  applies to what starts next.
- Priorities: higher first, equals keep their order. `snapshot()` is the same array until something changes
  (`useSyncExternalStore`-safe).
