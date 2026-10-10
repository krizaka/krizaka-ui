"use client";

import { Command } from "@krizaka/ui/command";
import { useState } from "react";

// Nothing matches: `emptyLabel` is said beside the results, the listbox stays empty (valid for screen readers).
export default function CommandNoResults() {
  const [query, setQuery] = useState("zzz");
  return (
    <Command.Root label="Commands" className="w-[28rem] max-w-full rounded-xl border border-border-default shadow-lg">
      <Command.Input placeholder="Type a command or search" value={query} onValueChange={setQuery} />
      <Command.List label="Suggestions" emptyLabel={`Nothing matches “${query}”.`}>
        <Command.Group heading="Pages">
          <Command.Item>Home</Command.Item>
          <Command.Item>Wallet</Command.Item>
        </Command.Group>
      </Command.List>
    </Command.Root>
  );
}
