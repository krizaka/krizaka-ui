import type { IconName } from "../icon";

/** One entry of the palette. */
export interface CommandPaletteItem {
  /** Stable id (also the cmdk value, with the label). */
  id: string;
  /** What the person reads — passed translated. */
  label: string;
  icon: IconName;
  /** Where it goes: handed to `onNavigate`. */
  href?: string;
  /** What it does, instead of (or after) navigating. */
  onSelect?: () => void;
  /** The group heading it sits under — passed translated. */
  section: string;
  /** More words the filter matches. */
  keywords?: string[];
}

/** The words of the palette — passed translated. */
export interface CommandPaletteLabels {
  /** The accessible name of the palette (the dialog and the combobox). */
  label: string;
  placeholder: string;
  /** The accessible name of the list of results. */
  results: string;
  /** Shown when nothing matches. */
  empty: string;
  /** Footer hints. */
  navigate: string;
  open: string;
  close: string;
}
