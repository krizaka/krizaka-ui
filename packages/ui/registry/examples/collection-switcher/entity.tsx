import { CollectionSwitcher } from "@krizaka/ui/collection-switcher";
import * as React from "react";

const SHOPS = [
  { id: "atelier", name: "Atelier Lune", isDefault: true, avatar: { defaultAvatar: { brand: "akinaza", kind: "shop", tone: 2 } as const } },
  { id: "marche", name: "Marché du samedi", avatar: { defaultAvatar: { brand: "akinaza", kind: "shop", tone: 5 } as const } },
];

// In the shell: a compact button that shows the current shop or studio and opens the others.
export default function CollectionSwitcherEntity() {
  const [value, setValue] = React.useState("atelier");
  return <CollectionSwitcher mode="entity" collections={SHOPS} value={value} onValueChange={setValue} label="Switch shop" defaultLabel="Main" onCreate={() => undefined} createLabel="New shop" />;
}
