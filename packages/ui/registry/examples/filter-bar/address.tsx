"use client";

import { FilterBar, FilterMenu, readFilterParams, writeFilterParams } from "@krizaka/ui/filter-bar";
import * as React from "react";

const ROLES = [
  { value: "creator", label: "Creator" },
  { value: "fan", label: "Fan" },
  { value: "admin", label: "Admin" },
];

// The address is the state: read it, write it back (the page goes back to 1). In Next.js: useSearchParams + router.replace.
export default function FilterBarAddress() {
  const [params, setParams] = React.useState(() => new URLSearchParams("role=creator,admin&page=3"));
  const { role } = readFilterParams(params, ["role"]);
  const set = (next: string[]) => setParams(writeFilterParams(params, { role: next }));
  return (
    <FilterBar
      label="Filter users"
      active={role!.map((r) => ({ id: r, label: `Role: ${ROLES.find((o) => o.value === r)?.label}`, onRemove: () => set(role!.filter((x) => x !== r)) }))}
      onClearAll={() => set([])}
      results={`?${params.toString()}`}
    >
      <FilterMenu label="Role" options={ROLES} value={role!} onValueChange={set} />
    </FilterBar>
  );
}
