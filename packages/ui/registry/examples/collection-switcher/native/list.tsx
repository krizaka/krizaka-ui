import { CollectionSwitcher } from "@krizaka/ui/native";
import * as React from "react";

const COLLECTIONS = [
  { id: "all", name: "Everything", isDefault: true, count: 42 },
  { id: "2026", name: "2026", count: 17 },
  { id: "spring", name: "Spring", parentId: "2026", count: 12 },
];

// The current collection is held by the route; a state stands in for it here.
export default function NativeCollectionSwitcherList() {
  const [value, setValue] = React.useState("spring");
  return <CollectionSwitcher collections={COLLECTIONS} value={value} onValueChange={setValue} label="Collections" layout="tree" defaultLabel="Default" />;
}
