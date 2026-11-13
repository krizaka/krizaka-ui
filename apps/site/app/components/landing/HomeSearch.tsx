"use client";

/* The home's search: one wide field that opens the site's search (Fumadocs' dialog, the same one as ⌘K in the bar). */

import { SearchIcon } from "@krizaka/icons";
import { Kbd } from "@krizaka/ui/kbd";

import { useSearchContext } from "../docs/fumadocs/client";

/* No aria-label: the accessible name is the visible text (WCAG 2.5.3, Label in Name), the placeholder and the shortcut. */
export function HomeSearch({ placeholder }: Readonly<{ placeholder: string }>) {
  const { setOpenSearch } = useSearchContext();
  return (
    <button type="button" className="kz-home-search" onClick={() => setOpenSearch(true)} aria-keyshortcuts="Meta+K Control+K">
      <SearchIcon size={16} aria-hidden />
      <span>{placeholder}</span>
      <Kbd>⌘K</Kbd>
    </button>
  );
}
