"use client";

import { FilterBar, type SavedViewItem } from "@krizaka/ui/filter-bar";
import * as React from "react";

const SYSTEM: SavedViewItem[] = [
  { id: "all", label: "All clients", group: "system", count: 42 },
  { id: "to_follow", label: "To follow up", group: "system", count: 7 },
];

// The views of a clients list (a fictitious bike workshop): chips with counts on a wide screen, one menu on a phone.
export default function FilterBarViews() {
  const [mine, setMine] = React.useState<SavedViewItem[]>([{ id: "v1", label: "Winter storage", group: "mine", count: 5 }]);
  const [current, setCurrent] = React.useState<string | null>("to_follow");
  return (
    <FilterBar
      label="Filter clients"
      results="7 clients"
      views={{
        views: [...SYSTEM, ...mine],
        current,
        modified: current === "to_follow",
        onSelect: setCurrent,
        onSave: (label) => { setMine((all) => [...all, { id: `v${all.length + 1}`, label, group: "mine" }]); setCurrent(`v${mine.length + 1}`); },
        onRename: (id, label) => setMine((all) => all.map((v) => (v.id === id ? { ...v, label } : v))),
        onDelete: (id) => { setMine((all) => all.filter((v) => v.id !== id)); setCurrent("all"); },
      }}
    />
  );
}
