# @krizaka/pacer

Cadence for every Krizaka app — debounce, throttle, a job queue and a client rate limiter on **TanStack Pacer** (beta),
behind one Krizaka package. A product imports `@krizaka/pacer`, never `@tanstack/pacer`
([ADR-001](../../docs/adr/ADR-001-tanstack-under-krizaka-facades.md)): this package's version is the contract.

```bash
npm install @krizaka/pacer
```

ESM only. Framework-free (`@krizaka/pacer`) plus React hooks (`@krizaka/pacer/react`, React ≥ 18, web and React Native).

| Entry | What |
| :-- | :-- |
| `@krizaka/pacer` | `debounce`, `throttle` · `createQueue` · `RateLimiter` (`fromProblemDetails`), `retryAtOf` |
| `@krizaka/pacer/react` | `useDebouncedValue`, `useDebouncedCallback`, `useThrottledCallback` · `useQueue`, `useQueueSnapshot` |

## Debounce and throttle

```tsx
import { useDebouncedCallback, useDebouncedValue } from "@krizaka/pacer/react";

const q = useDebouncedValue(text, 250);                       // the value, once typing pauses
const save = useDebouncedCallback((draft) => put(draft), 800); // save.cancel(), save.flush(), save.pending
```

A wait of `0` calls through at once. `useThrottledCallback(fn, 100)` runs the first call at once and the last one after the
pause (a scroll, a pointer move, a progress).

## A queue

```ts
import { createQueue } from "@krizaka/pacer";

const uploads = createQueue<{ name: string; progress: number }>({
  concurrency: 2,
  retries: 3,
  backoff: { kind: "exponential", baseMs: 1000, maxMs: 30_000, jitter: 0.2 },
  shouldRetry: (error) => !(error instanceof ClientError),   // a 4xx never deserves another try
});

const id = uploads.add(
  ({ signal, resumed, attempt }) => send(file, { signal, resumed }),   // aborted by pause / cancel
  { id: file.name, priority: 1, meta: { name: file.name, progress: 0 } },
);
uploads.update(id, (m) => ({ ...m, progress: 0.4 }));
uploads.pause(id);     // aborts its signal, keeps its place; resume(id) runs it again with `resumed: true`
uploads.retry(id);     // a failed job goes back in the line
uploads.cancel(id);    // aborts and forgets
uploads.snapshot();    // [{ id, status: "queued" | "running" | "paused" | "done" | "error", attempt, error, meta }]
```

In a component: `const queue = useQueue<Meta>({ concurrency: 2 }); const jobs = useQueueSnapshot(queue);` — the queue is
aborted when the component leaves.

## A rate limiter that listens to the server

```ts
import { RateLimiter } from "@krizaka/pacer";

const limiter = new RateLimiter({ limit: 5, windowMs: 1000 });
await limiter.wait(signal);                     // resolves when a call may go

// the server said 429 with a Problem Details body (or a Retry-After header):
const held = RateLimiter.fromProblemDetails(await response.json().catch(() => ({})), { now: Date.now() });
await held.wait(signal);                        // waits for retryAt / retryAfterSeconds / Retry-After
```

It reads the same hints as `KrizakaApiError` of [`@krizaka/query`](../query): `retryAt` (epoch ms or ISO date),
`retryAfterSeconds`, or a `Retry-After` header (seconds or an HTTP date).

## Used by

`@krizaka/ui/file-upload` (`useUploadQueue` is a queue of uploads) and `@krizaka/ui/search-field` (its debounce).
