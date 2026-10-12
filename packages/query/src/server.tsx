/**
 * The App Router side: the first screen is a Server Component, Query takes over on the client. `prefetch` runs the
 * page's queries on the server and returns their dehydrated state; `KrizakaHydration` does it and wraps its children in
 * a `HydrationBoundary`, so the client components that read the same keys render at once, without refetching.
 *
 * ```tsx
 * // app/videos/page.tsx (Server Component)
 * export default function Page() {
 *   return (
 *     <KrizakaHydration queries={[videosQuery()]}>
 *       <VideoList />
 *     </KrizakaHydration>
 *   );
 * }
 * ```
 */
import { dehydrate, type DehydratedState, type FetchQueryOptions, HydrationBoundary, type QueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { createQueryClient, type KrizakaQueryClientOptions } from "./core.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- any query's options, whatever its data and key types
export type PrefetchQuery = FetchQueryOptions<any, any, any, any>;

/** A client for one server render: no retry (the page answers now), the Krizaka defaults otherwise. */
export function createServerQueryClient(options: KrizakaQueryClientOptions = {}): QueryClient {
  return createQueryClient({ maxRetries: 0, ...options });
}

/**
 * Runs the queries (in parallel) and returns the state to hydrate. A failed query is left out: the client fetches it
 * (and shows its error) — the page itself never fails for one panel.
 */
export async function prefetch(queries: readonly PrefetchQuery[], client: QueryClient = createServerQueryClient()): Promise<DehydratedState> {
  await Promise.all(queries.map((query) => client.prefetchQuery(query)));
  return dehydrate(client);
}

export interface KrizakaHydrationProps {
  queries: readonly PrefetchQuery[];
  /** The request's client, when the page shares one between several boundaries. */
  client?: QueryClient;
  children?: ReactNode;
}

/** Prefetches on the server and hydrates the client components under it. An async Server Component. */
export async function KrizakaHydration({ queries, client, children }: KrizakaHydrationProps) {
  const state = await prefetch(queries, client);
  return <HydrationBoundary state={state}>{children}</HydrationBoundary>;
}
