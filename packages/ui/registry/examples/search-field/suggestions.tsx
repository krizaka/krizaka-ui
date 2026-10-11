"use client";

import { SearchField } from "@krizaka/ui/search-field";
import * as React from "react";

const RECENT = [
  { value: "sunset", label: "sunset timelapse", meta: "Tag" },
  { value: "eric", label: "Eric Tremblay", meta: "Creator" },
  { value: "studio", label: "studio lighting", meta: "2 days ago" },
];

// Recent searches under the field: the arrows walk them, Enter picks one.
export default function SearchFieldSuggestions() {
  const [query, setQuery] = React.useState("");
  const shown = RECENT.filter((s) => s.label.includes(query.toLowerCase()));
  return (
    <SearchField
      label="Search videos"
      placeholder="Search videos"
      value={query}
      onValueChange={setQuery}
      suggestions={shown}
      suggestionsLabel="Recent searches"
      onSuggestionSelect={(s) => setQuery(s.label)}
    />
  );
}
