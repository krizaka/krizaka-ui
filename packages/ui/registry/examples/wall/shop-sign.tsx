import { ShopSign } from "@krizaka/ui/wall";

import { messages } from "./messages";

export default function ShopSignExample() {
  const m = messages.en;
  return <div className="grid gap-8 p-8">
    <ShopSign logo={m.sign} variant="enamel" rotation={-1} />
    <ShopSign logo={m.neonSign} variant="neon" />
    <ShopSign logo={m.oldSign} variant="painted" rotation={1} />
  </div>;
}
