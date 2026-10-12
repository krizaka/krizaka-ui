/**
 * @krizaka/query — server state for every Krizaka app. TanStack Query v5 is re-exported whole (a product never imports
 * `@tanstack/*`: the version of this package is the contract), with the Krizaka layer on top: `createQueryClient`
 * (defaults), `krizakaFetch` (typed fetch, Problem Details errors), `defineKeys` (typed keys), `useLiveInvalidation` and
 * `eventSourceLive` (realtime → cache), `KrizakaQueryProvider`. Hydration for the App Router is in
 * `@krizaka/query/server`, the offline persister in `@krizaka/query/persist`, the device wiring in
 * `@krizaka/query/native`, the devtools in `@krizaka/query/devtools`.
 */
export * from "./core.js";
export { KrizakaQueryProvider, type KrizakaQueryProviderProps, useLiveInvalidation } from "./react.js";
export * from "@tanstack/react-query";
