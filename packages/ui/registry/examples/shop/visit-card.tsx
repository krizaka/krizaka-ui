import { ShopFrame } from "@krizaka/ui/shop";
import { demoMap, demoSalon as shop } from "@krizaka/ui/shop/demo";
import { VisitSection } from "@krizaka/ui/shop/visit";

// Visit · card: hours, address and a call; the map shows as a still until it is asked for on a phone.
export default function ShopVisitCard() {
  return (
    <ShopFrame>
      <VisitSection variant="card" title="Visit" hours={shop.hours} today="3" status={shop.status} hoursLabel="Hours" address={shop.address} phone={{ href: "tel:5145550110", label: shop.phone }} map={demoMap} />
    </ShopFrame>
  );
}
