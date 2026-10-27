import { CollectionSwitcher } from "@krizaka/ui/collection-switcher";
import * as React from "react";

const COLLECTIONS = [
  { id: "all", name: "Everything", isDefault: true, count: 42 },
  { id: "spring", name: "Spring bookings", count: 12 },
  { id: "weddings", name: "Weddings", count: 5 },
];

// The current collection is held by the URL: here a state stands in for it; a product pushes the route in `onValueChange`.
export default function CollectionSwitcherList() {
  const [value, setValue] = React.useState("spring");
  return (
    <CollectionSwitcher
      collections={COLLECTIONS}
      value={value}
      onValueChange={setValue}
      label="Collections"
      defaultLabel="Default"
      onRemove={(id) => setValue(id === value ? "all" : value)}
      removeLabel={(name) => `Remove ${name}`}
      onCreate={() => undefined}
      createLabel="New collection"
      className="w-72"
    />
  );
}
