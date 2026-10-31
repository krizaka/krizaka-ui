// The composer's side panels (akinaza#214): the outline and the inspector fold on a laptop so the preview can take the screen. The choice
// is the person's and is remembered (localStorage) — an external store read with `useSyncExternalStore`, never an effect. Until they
// choose, the outline is open and the inspector folded: the preview then has more than half of a laptop screen.
import * as React from "react";

export type Panels = { outline: boolean; inspector: boolean };
export const DEFAULT_PANELS: Panels = { outline: true, inspector: false };
export const PANELS_KEY = "kz-shop-composer-panels";

const listeners = new Set<() => void>();
let cache: { raw: string | null; value: Panels; chosen: boolean } = { raw: null, value: DEFAULT_PANELS, chosen: false };

function read(): typeof cache {
  let raw: string | null;
  try {
    raw = typeof localStorage === "undefined" ? null : localStorage.getItem(PANELS_KEY);
  } catch {
    raw = cache.raw;
  }
  if (raw === cache.raw) return cache;
  let value = DEFAULT_PANELS;
  if (raw) {
    try {
      const o = JSON.parse(raw) as Partial<Panels>;
      value = { outline: o.outline !== false, inspector: o.inspector === true };
    } catch {
      value = DEFAULT_PANELS;
    }
  }
  cache = { raw, value, chosen: raw !== null };
  return cache;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

/** The remembered state of the two panels, and the setter that remembers a choice. */
export function usePanels() {
  const snap = React.useSyncExternalStore(subscribe, read, () => cache);
  const set = React.useCallback((next: Partial<Panels>) => {
    const value = { ...read().value, ...next };
    const raw = JSON.stringify(value);
    try {
      localStorage.setItem(PANELS_KEY, raw);
    } catch {
      // storage refused (private mode): the choice lasts until the page is left
    }
    cache = { raw, value, chosen: true };
    listeners.forEach((l) => l());
  }, []);
  return { panels: snap.value, chosen: snap.chosen, set };
}
