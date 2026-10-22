// Client. The URL is the state: a selection the user would want to share, reload or come back to (a tab, a type, a
// filter) lives in a search parameter, never in `useState` (Oussama, 2026-10-22: « changer les tabs doit changer les routes »).
// One primitive reads and writes it: `useRouteState`. The selection components take `routeKey` and bind to it.
import * as React from "react";

/** How a router moves and reads the address: the browser's by default, your framework's through `RouteStateProvider`. */
export interface RouteAdapter {
  /** The current query string, with or without `?` (`""` on the server). */
  search: () => string;
  /** Go to `search` (`?type=bail`, or `""`), keeping the path and the hash; `replace` keeps the history as it is. */
  navigate: (search: string, options: { replace: boolean }) => void;
  /** Calls `onChange` when the address changes under you (back, forward, another navigation); returns the unsubscribe. */
  subscribe: (onChange: () => void) => () => void;
}

const CHANGE = "kz-route-state";

/** The History API: any web app (Vite, a static site). Next.js apps pass their router's adapter once, in the layout. */
export const browserAdapter: RouteAdapter = {
  search: () => (typeof window === "undefined" ? "" : window.location.search),
  navigate: (search, { replace }) => {
    const url = `${window.location.pathname}${search}${window.location.hash}`;
    window.history[replace ? "replaceState" : "pushState"](window.history.state, "", url);
    window.dispatchEvent(new Event(CHANGE));
  },
  subscribe: (onChange) => {
    window.addEventListener("popstate", onChange);
    window.addEventListener(CHANGE, onChange);
    return () => {
      window.removeEventListener("popstate", onChange);
      window.removeEventListener(CHANGE, onChange);
    };
  },
};

const AdapterContext = React.createContext<RouteAdapter>(browserAdapter);

export interface RouteStateProviderProps {
  /** How your router reads the query string, navigates and tells about changes. */
  adapter: RouteAdapter;
  children: React.ReactNode;
}

/** Gives `useRouteState` your router: `<RouteStateProvider adapter={nextAdapter}>` once, in the root layout. */
export function RouteStateProvider({ adapter, children }: RouteStateProviderProps) {
  return <AdapterContext.Provider value={adapter}>{children}</AdapterContext.Provider>;
}

export interface RouteStateOptions<V extends string> {
  /** The values the parameter may hold, as a const list: anything else in the address reads as the default. Omit for free text. */
  values?: readonly V[];
  /** The value when the parameter is absent. It is never written to the address (a clean URL). */
  default: V;
  /** `push` (the default) keeps each change in the history, `replace` overwrites it: use `replace` for a filter typed or toggled in passing. */
  history?: "push" | "replace";
}

/** The value a query string holds for `key`, checked against `values`. Pure: the hook and the tests share it. */
export function readRouteValue<V extends string>(search: string, key: string, { values, default: fallback }: Pick<RouteStateOptions<V>, "values" | "default">): V {
  const raw = new URLSearchParams(search).get(key);
  if (raw === null) return fallback;
  return !values || (values as readonly string[]).includes(raw) ? (raw as V) : fallback;
}

/** The query string with `key` set to `value` (removed when it is the default); every other parameter is kept. Pure. */
export function writeRouteValue(search: string, key: string, value: string, fallback: string): string {
  const params = new URLSearchParams(search);
  if (value === fallback) params.delete(key);
  else params.set(key, value);
  const text = params.toString();
  return text ? `?${text}` : "";
}

/**
 * A value kept in the URL's search parameter `key`: `const [type, setType] = useRouteState("type", { values: TYPES, default: "auto" })`
 * with `const TYPES = ["auto", "lease", "contract", "invoice", "other"] as const`. The value is typed from the list, an
 * unknown one in the address reads as the default, the default is not written, other parameters are kept.
 * `key` undefined makes the hook inert (it returns the default) so a component can call it unconditionally.
 */
export function useRouteState<V extends string>(key: string | undefined, { values, default: fallback, history = "push" }: RouteStateOptions<V>): readonly [V, (next: V) => void] {
  const adapter = React.useContext(AdapterContext);
  const search = React.useSyncExternalStore(adapter.subscribe, adapter.search, () => "");
  const value = key === undefined ? fallback : readRouteValue(search, key, { values, default: fallback });
  const set = React.useCallback(
    (next: V) => {
      if (key === undefined) return;
      adapter.navigate(writeRouteValue(adapter.search(), key, next, fallback), { replace: history === "replace" });
    },
    [adapter, key, fallback, history],
  );
  return [value, set] as const;
}

/**
 * The query string and a way to change several parameters in one navigation (a sort and the page it resets). Writes made
 * in the same tick build on each other, so a router that applies them later never loses one.
 */
export function useRouteSearch(): { search: string; write: (update: (search: string) => string, options?: { replace?: boolean }) => void } {
  const adapter = React.useContext(AdapterContext);
  const search = React.useSyncExternalStore(adapter.subscribe, adapter.search, () => "");
  const latest = React.useRef(search);
  React.useEffect(() => {
    latest.current = search;
  }, [search]);
  const write = React.useCallback(
    (update: (search: string) => string, { replace = false }: { replace?: boolean } = {}) => {
      const next = update(latest.current);
      latest.current = next;
      adapter.navigate(next, { replace });
    },
    [adapter],
  );
  return { search, write };
}

/** What a selection component spreads on its root: `value` and `onValueChange` bound to the URL when `routeKey` is set. */
export interface RouteBindable {
  value?: string | null;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

/** The props of a selection component bound to the URL (`routeKey`), or its own, unchanged, when there is no `routeKey`. */
export function useRouteBinding<P extends RouteBindable>(routeKey: string | undefined, routeValues: readonly string[] | undefined, props: P): P {
  const initial = props.defaultValue ?? props.value ?? routeValues?.[0] ?? "";
  const [value, set] = useRouteState<string>(routeKey, { values: routeValues, default: initial });
  if (routeKey === undefined) return props;
  return {
    ...props,
    value,
    defaultValue: undefined,
    onValueChange: (next: string) => {
      set(next);
      props.onValueChange?.(next);
    },
  };
}
