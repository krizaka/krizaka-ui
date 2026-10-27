import { ShopFrame } from "@krizaka/ui/shop";
import { demoPolicies } from "@krizaka/ui/shop/demo";
import { PoliciesSection } from "@krizaka/ui/shop/policies";

// Cancellation, prices and the booking window, as term and value.
export default function ShopPolicies() {
  return (
    <ShopFrame>
      <PoliciesSection title="Good to know" items={demoPolicies} />
    </ShopFrame>
  );
}
