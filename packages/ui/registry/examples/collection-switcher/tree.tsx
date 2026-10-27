import { CollectionSwitcher } from "@krizaka/ui/collection-switcher";
import * as React from "react";

const COLLECTIONS = [
  { id: "all", name: "Everything", isDefault: true },
  { id: "2026", name: "2026", count: 17 },
  { id: "spring", name: "Spring", parentId: "2026", count: 12 },
  { id: "summer", name: "Summer", parentId: "2026", count: 5 },
];

// Nesting is optional: a collection with a `parentId` sits under its parent.
export default function CollectionSwitcherTree() {
  const [value, setValue] = React.useState("spring");
  return <CollectionSwitcher collections={COLLECTIONS} value={value} onValueChange={setValue} label="Collections" layout="tree" defaultLabel="Default" className="w-72" />;
}
