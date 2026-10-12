---
name: krizaka-query
description: Server state in a Krizaka app with @krizaka/query (TanStack Query v5 behind the Krizaka facade) — reading and mutating API data, typed fetch with Problem Details errors, query keys, App Router prefetch and hydration, live invalidation from Server-Sent Events, offline cache on Expo. Use it before writing any data fetching, useQuery/useMutation, or realtime cache update in a Krizaka product.
---

# @krizaka/query

## Rules

1. Import from `@krizaka/query` (and its `./server`, `./persist`, `./native`, `./devtools`) — **never `@tanstack/*`**
   (ESLint `krizaka/no-direct-tanstack-import`, dependency-cruiser).
2. **The first screen is a Server Component.** Prefetch with `<KrizakaHydration queries={[…]}>` from
   `@krizaka/query/server`; the client component calls `useQuery` with the same options and renders at once.
3. **Never `fetch` (or `krizakaFetch`) inside a client `useEffect`** (ESLint `krizaka/no-fetch-in-client-effect`). Data
   is read by `useQuery`, written by `useMutation`.
4. One module per resource (`lib/<resource>.ts`, or `packages/core` in a product monorepo): schema (zod), keys
   (`defineKeys`), `queryOptions(...)`, mutation functions, live rules.
5. Calls go through `krizakaFetch(url, { schema, json, query, signal })`; failures are `KrizakaApiError` — branch on
   `error.code`, show `t(error.messageKey())` (never the server's English).
6. Realtime updates the cache with `useLiveInvalidation(source, rules)`: invalidate keys by default; `setQueryData` only
   when the event carries the whole object.

## Recipes

```ts
// lib/videos.ts
import { defineKeys, krizakaFetch, queryOptions } from "@krizaka/query";
import { z } from "zod";

export const Video = z.object({ id: z.string(), title: z.string() });
export const videoKeys = defineKeys("videos", { list: (f: { q?: string }) => [f], detail: (id: string) => [id] });
export const videosQuery = (f: { q?: string } = {}) =>
  queryOptions({
    queryKey: videoKeys.list(f),
    queryFn: ({ signal }) => krizakaFetch("/api/videos", { schema: z.array(Video), query: f, signal }),
    meta: { list: true }, // errors render in the list, not in the error boundary
  });
```

```tsx
// app/videos/page.tsx (Server Component)
import { KrizakaHydration } from "@krizaka/query/server";
export default function Page() {
  return <KrizakaHydration queries={[videosQuery()]}><VideoList /></KrizakaHydration>;
}
```

```tsx
// a client component
"use client";
import { eventSourceLive, useLiveInvalidation, useQuery } from "@krizaka/query";
const live = typeof window === "undefined" ? null : eventSourceLive("/api/stream");
export function VideoList() {
  const videos = useQuery(videosQuery());
  useLiveInvalidation(live, { "video.created": [videoKeys.all] });
  // …
}
```

- Provider (root layout, client): `<KrizakaQueryProvider onUnauthorized={…}>` + `<KrizakaDevtools />`.
- App defaults once: `configureKrizakaFetch({ baseUrl, credentials: "include" /* cross-origin web */, getToken /* native */ })`.
- Optimistic mutation: `onMutate` (cancel, snapshot, `setQueryData`) → `onError` (restore) → `onSettled` (invalidate).
- Expo: `bindNativeLifecycle({ appState: AppState, netInfo: NetInfo })`, `createQueryClient({ gcTime: PERSIST_MAX_AGE,
  defaultOptions: nativeQueryDefaults })`, `PersistQueryClientProvider` with `persistOptions({ persister:
  createPersister({ storage: mmkvStorage(new MMKV()) }) })`; SSE through `eventSourceLive(url, { EventSource })` of
  react-native-sse.

## Defaults to rely on

`staleTime` 30 s · retries: network/5xx ×3 with backoff, a 429 after its `retryAt` (≤ 30 s), never another 4xx ·
mutations retried only on 429 · a 401 calls `onUnauthorized` · a first load throws to the error boundary, a list
(`meta: { list: true }`) or a refetch does not.

## Error codes

`network` (status 0), `invalid-response` (schema), `bad-request`, `unauthorized`, `forbidden`, `not-found`, `conflict`,
`validation-failed` (`error.fields[name]`), `rate-limited` (`error.retryAt`), `server`, `unavailable` — or the
server's own `code` / problem type slug (`auction-closed`).
