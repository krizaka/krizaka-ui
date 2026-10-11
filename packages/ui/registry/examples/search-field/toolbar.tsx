"use client";

import { SearchField } from "@krizaka/ui/search-field";
import * as React from "react";

const MODELS = ["Flux 1.1", "Whisper large", "XTTS v2", "Llama 3.3", "Qwen 2.5"];

// A small field that filters a list as you type (debounced).
export default function SearchFieldToolbar() {
  const [query, setQuery] = React.useState("");
  return (
    <div className="flex w-72 flex-col gap-2">
      <SearchField label="Filter models" placeholder="Filter models" size="sm" landmark={false} onSearch={setQuery} debounce={150} />
      <ul className="text-sm text-fg-secondary">
        {MODELS.filter((m) => m.toLowerCase().includes(query.toLowerCase())).map((m) => (
          <li key={m}>{m}</li>
        ))}
      </ul>
    </div>
  );
}
