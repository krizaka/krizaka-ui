"use client";

import { SearchField } from "@krizaka/ui/search-field";
import { useState } from "react";

// The site's search: ⌘K (Ctrl+K) focuses it from anywhere, Enter goes to the results (here it only says where it would go).
export default function SearchFieldGlobal() {
  const [last, setLast] = useState<string | null>(null);
  return (
    <div className="flex w-full max-w-md flex-col gap-2">
      <SearchField label="Search the studio" placeholder="Search creators, videos, tags" shortcut="k" onSubmit={(query) => setLast(query)} />
      {last !== null && (
        <p role="status" className="text-xs text-fg-secondary">
          Goes to <code>/explore?q={encodeURIComponent(last)}</code>
        </p>
      )}
    </div>
  );
}
