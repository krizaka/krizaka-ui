import { ShopSign } from "@krizaka/ui/wall";

// The name is live text, the page's heading (`as`, `h1` by default): enamel, neon (one flicker, the first time it is seen),
// painted, or `none` (the name alone on paper). A logo is optional beside it.
export default function ShopSignExample() {
  const m = { sign: "Neighbourhood workshop", neonSign: "Still open", oldSign: "Since forever", plain: "Cèdre & Ciseaux" };
  return <div className="grid gap-8 p-8">
    <ShopSign as="h2" variant="enamel" rotation={-1}>{m.sign}</ShopSign>
    <ShopSign as="h2" variant="neon">{m.neonSign}</ShopSign>
    <ShopSign as="h2" variant="painted" rotation={1}>{m.oldSign}</ShopSign>
    <ShopSign as="h2" variant="none">{m.plain}</ShopSign>
  </div>;
}
