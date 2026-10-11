"use client";

import { SearchField } from "@krizaka/ui/search-field";

// The site's search: ⌘K (Ctrl+K) focuses it from anywhere, Enter goes to the results.
export default function SearchFieldGlobal() {
  return (
    <SearchField
      label="Search Orochia"
      placeholder="Search creators, videos, tags"
      shortcut="k"
      onSubmit={(query) => window.location.assign(`/explore?q=${encodeURIComponent(query)}`)}
    />
  );
}
