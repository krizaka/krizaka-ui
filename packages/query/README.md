# @krizaka/query

Server state for every Krizaka app — **TanStack Query v5** behind one Krizaka package. A product imports
`@krizaka/query`, never `@tanstack/*` ([ADR-001](../../docs/adr/ADR-001-tanstack-under-krizaka-facades.md)): this
package's version is the contract, and a TanStack break is fixed here once.

```bash
npm install @krizaka/query zod
```

ESM only, React ≥ 18. TanStack Query and its devtools are re-exported whole; on top of them:

| Entry | What |
| :-- | :-- |
| `@krizaka/query` | TanStack Query (`useQuery`, `useMutation`, `queryOptions`…) · `createQueryClient` · `KrizakaQueryProvider` · `krizakaFetch`, `configureKrizakaFetch` · `KrizakaApiError`, `isKrizakaApiError` · `defineKeys` · `useLiveInvalidation`, `eventSourceLive`, `createLiveInvalidator` |
| `@krizaka/query/server` | `prefetch`, `KrizakaHydration`, `createServerQueryClient` — the App Router's first screen |
| `@krizaka/query/persist` | `createPersister`, `mmkvStorage`, `persistOptions`, `PersistQueryClientProvider` — the offline cache |
| `@krizaka/query/native` | `bindNativeLifecycle` (AppState, NetInfo), `nativeQueryDefaults` (`offlineFirst`) |
| `@krizaka/query/devtools` | `KrizakaDevtools`, `ReactQueryDevtools` (nothing rendered in production) |

## The rule: the first screen is a Server Component

A page renders its first screen on the server, with its data — the LCP never waits for a client request. Query takes
over for the interaction: `KrizakaHydration` prefetches the page's queries and hydrates the client components that
read the same keys, so they render at once and do not refetch. **Never a `fetch` in a client `useEffect`** — ESLint
says so (`krizaka/no-fetch-in-client-effect` of `@krizaka/config`, counted by `krizaka-ratchet`).

## A complete example

```ts
// lib/videos.ts — one module per resource: schema, keys, queries, mutations, live rules
import { defineKeys, krizakaFetch, queryOptions } from "@krizaka/query";
import { z } from "zod";

export const Video = z.object({ id: z.string(), title: z.string(), likes: z.number(), liked: z.boolean() });
export const videoKeys = defineKeys("videos", { list: (f: { q?: string }) => [f], detail: (id: string) => [id] });

export const videosQuery = (f: { q?: string } = {}) =>
  queryOptions({
    queryKey: videoKeys.list(f),
    queryFn: ({ signal }) => krizakaFetch("/api/videos", { schema: z.array(Video), query: f, signal }),
    meta: { list: true },
  });
```

```tsx
// app/videos/page.tsx — Server Component
import { KrizakaHydration } from "@krizaka/query/server";

export default function Page() {
  return (
    <KrizakaHydration queries={[videosQuery()]}>
      <VideoList />
    </KrizakaHydration>
  );
}
```

```tsx
// app/videos/video-list.tsx
"use client";
import { eventSourceLive, useLiveInvalidation, useMutation, useQuery, useQueryClient } from "@krizaka/query";

const live = typeof window === "undefined" ? null : eventSourceLive("/api/videos/stream");

export function VideoList() {
  const client = useQueryClient();
  const videos = useQuery(videosQuery()); // hydrated: no request on the first render
  useLiveInvalidation(live, {
    "video.created": [videoKeys.all], // invalidate: the server stays the truth
    "video.updated": (e: { video: Video }, qc) => qc.setQueryData(videoKeys.detail(e.video.id), e.video),
  });
  const like = useMutation({
    mutationFn: (id: string) => krizakaFetch(`/api/videos/${id}/like`, { method: "POST", schema: Video }),
    onMutate: async (id) => {
      await client.cancelQueries({ queryKey: videoKeys.all });
      const previous = client.getQueryData(videosQuery().queryKey);
      client.setQueryData(videosQuery().queryKey, (list) => list?.map((v) => (v.id === id ? { ...v, liked: true } : v)));
      return { previous };
    },
    onError: (_e, _id, ctx) => client.setQueryData(videosQuery().queryKey, ctx?.previous),
    onSettled: () => client.invalidateQueries({ queryKey: videoKeys.all }),
  });
  // …
}
```

The provider, once, in the root layout (a client component):

```tsx
"use client";
import { configureKrizakaFetch, KrizakaQueryProvider } from "@krizaka/query";
import { KrizakaDevtools } from "@krizaka/query/devtools";

configureKrizakaFetch({ credentials: "include" }); // only for a cross-origin API

export function Providers({ children }) {
  return (
    <KrizakaQueryProvider onUnauthorized={() => location.assign("/sign-in")}>
      {children}
      <KrizakaDevtools />
    </KrizakaQueryProvider>
  );
}
```

Two complete examples compile in this folder: [`examples/next-app-router`](examples/next-app-router) and
[`examples/expo`](examples/expo).

## The defaults of `createQueryClient`

| Option | Default | Why |
| :-- | :-- | :-- |
| `staleTime` | 30 s | A screen revisited within 30 s does not refetch. |
| retry | network error / 5xx: 3 times (1 s, 2 s, 4 s…) · 429: after its `retryAt` if ≤ `maxRetryWait` (30 s) · other 4xx and a bad body: never | Insisting on a refusal only adds load. |
| mutations | retried only on a 429 | A mutation is not idempotent; a 429 was not applied. |
| `onUnauthorized` | — | Any 401, query or mutation: refresh the session or go to sign-in. |
| `throwOnError` | a first load throws to the error boundary; a list (`meta: { list: true }`) or a refetch with data does not | A list shows its error in place, with a retry. |

## `krizakaFetch` and its errors

`krizakaFetch(url, { schema, json, query, ...init })` is `fetch` with the contract: the body is validated by the
schema (any [Standard Schema](https://standardschema.dev): zod ≥ 3.24, valibot…) and typed by it; a failure is a
`KrizakaApiError`. `configureKrizakaFetch({ baseUrl, credentials, getToken, headers, fetch })` sets the app's defaults
once: `getToken` injects `Authorization: Bearer …` (native, server to server), `credentials` sends the cookie of a
cross-origin API (web).

| `KrizakaApiError` field | From |
| :-- | :-- |
| `status` | the HTTP status; `0` when no response arrived |
| `code` | the body's `code`, else the slug of the problem `type`, else the status: `network`, `invalid-response`, `bad-request`, `unauthorized`, `forbidden`, `not-found`, `conflict`, `validation-failed`, `rate-limited`, `server`, `unavailable` |
| `type`, `title`, `detail` | RFC 9457 Problem Details (`detail` also from a route handler's `{ error }`) |
| `retryAt` | epoch ms, from the body's `retryAt` / `retryAfterSeconds` or the `Retry-After` header |
| `fields` | `{ name: { code?, message } }` from `errors[]` (krizaka-web), `fields`, or a zod `details.fieldErrors` |
| `requestId` | the body's `requestId` or the `X-Request-Id` header |

The words are the app's: `t(error.messageKey())` reads `apiErrors.<code>` from its catalogue (`@krizaka/i18n`).
An abort is rethrown as is (Query cancels quietly).

## Live invalidation

`useLiveInvalidation(source, rules, options)` applies realtime events to the cache. A source is anything with the
`subscribe(channel, handler)` of `@krizaka/realtime`'s `RealtimeBus` — `eventSourceLive(url)` in an app (one
`EventSource` shared by every subscriber, reopened with a growing delay when it closes for good; react-native-sse's on a
device), the bus itself in a test. A rule is a list of keys to invalidate (the default: the server stays the truth) or a
function that writes the cache (`setQueryData`) when the event carries the whole data. Events are de-duplicated by
`id` (the SSE `lastEventId` when the payload has none), so a replay after a reconnection is never applied twice; after
a reconnection, every key the static rules name is refetched.

## On a device (Expo)

```ts
import { bindNativeLifecycle, nativeQueryDefaults } from "@krizaka/query/native";
import { createPersister, mmkvStorage, PERSIST_MAX_AGE, PersistQueryClientProvider, persistOptions } from "@krizaka/query/persist";

configureKrizakaFetch({ baseUrl: API_URL, getToken: () => SecureStore.getItemAsync("token") });
bindNativeLifecycle({ appState: AppState, netInfo: NetInfo });
const client = createQueryClient({ gcTime: PERSIST_MAX_AGE, defaultOptions: nativeQueryDefaults });
const persister = createPersister({ storage: mmkvStorage(new MMKV()) });
// <PersistQueryClientProvider client={client} persistOptions={persistOptions({ persister, buster: appVersion })}>
```

A query with `meta: { persist: false }` is never written to the device.

## License

Apache-2.0 © Krizaka

## The URL as state — `@krizaka/query/url`

nuqs behind the Krizaka door (ADR-006): a filter, a tab, a page or a sort lives in the address, never in a client effect.

```tsx
// app/layout.tsx (Server Component): mount the adapter once
import { NuqsAdapter } from "@krizaka/query/url/next";

// a client component
import { parseAsString, useQueryState, withUrlDefaults } from "@krizaka/query/url";
const [tab, setTab] = useQueryState("tab", withUrlDefaults(parseAsString).withDefault("all"));

// a Server Component reads the same key
import { createLoader, parseAsString } from "@krizaka/query/url/server";
const load = createLoader({ tab: parseAsString.withDefault("all") });
```

`withUrlDefaults` = `replace` history, shallow, default cleared from the address. `next` is an optional peer (only `./url/next`).
