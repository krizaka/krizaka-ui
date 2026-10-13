"use client";

import { Avatar } from "@krizaka/ui/avatar";
import { Button } from "@krizaka/ui/button";
import { List } from "@krizaka/ui/list";
import { useState } from "react";

const viewers = [
  { id: "u1", name: "Mina Okafor", handle: "@mina", tipped: "$12" },
  { id: "u2", name: "Alex Moreau", handle: "@alex", tipped: "$5" },
  { id: "u3", name: "Elena Ruiz", handle: "@elena", tipped: "—" },
];

// Compact and selectable: who watched a story, a thank-you for the ones you pick.
export default function ListSelectable() {
  const [selected, setSelected] = useState<string[]>(["u1"]);
  return (
    <List
      aria-label="Viewers of your story"
      density="compact"
      items={viewers}
      getId={(v) => v.id}
      selectable
      selected={selected}
      onSelectedChange={setSelected}
      row={(v) => ({ title: v.name, description: v.handle, leading: <Avatar alt={v.name} fallback={v.name.charAt(0)} size="sm" />, meta: v.tipped })}
      footer={<Button size="sm" variant="primary" disabled={selected.length === 0}>{`Thank ${selected.length}`}</Button>}
    />
  );
}
