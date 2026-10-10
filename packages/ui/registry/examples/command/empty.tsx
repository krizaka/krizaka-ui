"use client";

import { Command } from "@krizaka/ui/command";
import { useState } from "react";

// What `emptyLabel` says when nothing matches the search (the search is controlled: `value` + `onValueChange`).
export default function CommandEmpty() {
  const [search, setSearch] = useState("zzz");
  return (
    <Command.Root label="Commands" className="w-[28rem] max-w-full rounded-xl border border-border-default">
      <Command.Input placeholder="Type a command or search" value={search} onValueChange={setSearch} />
      <Command.List label="Suggestions">
        <Command.Empty emptyLabel="Nothing matches." />
        <Command.Group heading="Pages">
          <Command.Item>Home</Command.Item>
          <Command.Item>Wallet</Command.Item>
        </Command.Group>
      </Command.List>
    </Command.Root>
  );
}
