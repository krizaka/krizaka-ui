import { call, EVENTS, type TauriBridge } from "./bridge";

/** The labels of the standard macOS menus, in the page's language (its messages). */
export interface StandardMenuLabels {
  about: string;
  hide: string;
  hideOthers: string;
  showAll: string;
  quit: string;
  edit: string;
  undo: string;
  redo: string;
  cut: string;
  copy: string;
  paste: string;
  selectAll: string;
  window: string;
  minimize: string;
  zoom: string;
  close: string;
}

export interface MenuItemSpec {
  /** Sent back when the item is chosen: lowercase letters, digits, `.`, `-` (`library.add-folder`). */
  id: string;
  label: string;
  /** From `acceleratorOf` of `@krizaka/ui/app-shell`, so the menu and `useShortcuts` answer the same keys. */
  accelerator?: string;
  enabled?: boolean;
  /** A separator before this item. */
  separated?: boolean;
}

export interface MenuSpec {
  labels: StandardMenuLabels;
  /** The product's menus, between Edit and Window. */
  menus: { title: string; items: MenuItemSpec[] }[];
}

/**
 * The native menu bar (krizaka-ui ADR-002): the page sends it in its own words, the native side checks it (ids, labels,
 * accelerators, the standard shortcuts reserved) and builds it; `handlers[id]` runs when an item is chosen. Call it again
 * when the language changes. Returns the function that stops listening.
 */
export async function setNativeMenu(
  bridge: TauriBridge,
  spec: MenuSpec,
  handlers: Readonly<Record<string, (() => void) | undefined>>,
): Promise<() => void> {
  await call<void>(bridge, "set_menu", { spec });
  return bridge.listen<string>(EVENTS.menu, (event) => handlers[event.payload]?.());
}
