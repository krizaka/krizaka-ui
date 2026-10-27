import { ShopFrame } from "@krizaka/ui/shop";
import { demoPets } from "@krizaka/ui/shop/demo";
import { ServicesSection } from "@krizaka/ui/shop/services";

// Nothing beside the list: two columns from a laptop, one on a phone.
export default function ShopMenuColumns() {
  return (
    <ShopFrame density="compact" preset="pets-canal">
      <ServicesSection title="Walks and visits" services={demoPets.services} columns={2} chooseLabel="Choose" popularLabel="Popular" />
    </ShopFrame>
  );
}
