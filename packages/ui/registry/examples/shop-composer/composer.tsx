"use client";

import { shopStarters } from "@krizaka/ui/shop";
import { ShopComposer } from "@krizaka/ui/shop-composer";

const presets = [
  { id: "salon-vitrine", version: 1, name: "Vitrine", density: "compact", variants: { hero: "poster", services: "menu" } },
  { id: "salon-atelier", version: 1, name: "Atelier", density: "airy", variants: { hero: "split", services: "menu" } },
] as const;

// The product's own route goes here (`https://…/salon?draft=<id>`); a still note stands in for it.
const PREVIEW = "data:text/html,%3Cbody style='margin:0;display:grid;place-items:center;height:100vh;font:15px system-ui;color:%23667'%3EThe live page of the shop appears here%3C/body%3E";

// The salon's compact page: reorder with Alt+↑ / Alt+↓, change how a section is drawn, undo with ⌘Z, publish to see what changes.
export default function ShopComposerExample() {
  return (
    <div className="h-[44rem] max-w-full p-3">
      <ShopComposer value={shopStarters.salonCompact} previewUrl={PREVIEW} presets={presets} onPublish={() => undefined} className="h-full" />
    </div>
  );
}
