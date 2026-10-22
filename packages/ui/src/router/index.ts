/** @krizaka/ui/router — the URL is the state: `useRouteState(key, { values, default })`, `RouteStateProvider` (your router's adapter), the pure `readRouteValue` / `writeRouteValue`. Client ("use client"). */
export {
  browserAdapter,
  readRouteValue,
  type RouteAdapter,
  type RouteBindable,
  type RouteStateOptions,
  RouteStateProvider,
  type RouteStateProviderProps,
  useRouteBinding,
  useRouteState,
  writeRouteValue,
} from "./route-state";
