# Example — Next.js App Router

The whole @krizaka/query pattern on one resource (videos): the first screen is a Server Component that prefetches
(`KrizakaHydration`), the client list reads the same key without refetching, a like is an optimistic mutation, and the
server's Server-Sent Events invalidate the list. Type-checked by `pnpm --filter @krizaka/query typecheck`; copy the
files into an app that depends on `@krizaka/query` (and `zod`).

| File | Role |
| :-- | :-- |
| `lib/videos.ts` | schema, keys, query options, the mutation and the live rules — one module per resource |
| `app/providers.tsx` | `"use client"`: the provider, the fetch defaults, the devtools |
| `app/layout.tsx` | wraps the app in the providers |
| `app/videos/page.tsx` | Server Component: prefetch + hydration |
| `app/videos/video-list.tsx` | `"use client"`: `useQuery`, `useMutation`, `useLiveInvalidation` |
