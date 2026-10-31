// The composer's side panels (akinaza#214): the outline and the inspector fold on a laptop so the preview can take the screen. The choice
// is the person's and is remembered (localStorage) — an external store read with
// `useSyncExternalStore`, never an effect. Until they choose, the outline is open and the inspector folded.
import * as React from "react";

type Panel = "outline" | "inspector";
export const PANELS_KEY = "kz-shop-composer-panels";

const read = () => {
  try {
    return localStorage.getItem(PANELS_KEY);
  } catch {
    return null; // storage refused (private mode): the default holds
  }
};
const subscribe = (l: () => void) => {
  addEventListener("storage", l);
  return () => removeEventListener("storage", l);
};

/** The remembered state of the two panels (the names of the open ones, e.g. « outline inspector »), and the setter that remembers a choice. */
export function usePanels() {
  const s = React.useSyncExternalStore(subscribe, read, () => null);
  const attr = s ?? "outline";
  const set = (name: Panel, on: boolean) => {
    try {
      localStorage.setItem(PANELS_KEY, ["outline", "inspector"].filter((n) => (n === name ? on : attr.includes(n))).join(" "));
      dispatchEvent(new Event("storage")); // the same tab hears itself; the other tabs get the browser's own
    } catch {
      // storage refused (private mode): the default holds
    }
  };
  return { attr, chosen: s !== null, set };
}
