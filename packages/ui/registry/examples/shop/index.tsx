import { ShopFrame } from "@krizaka/ui/shop";
import { demoPets } from "@krizaka/ui/shop/demo";
import { ServicesSection } from "@krizaka/ui/shop/services";

// Services · index: the same resolved services, another drawing.
export default function ShopIndex() {
  return (
    <ShopFrame density="compact" preset="pets-canal">
      <ServicesSection variant="index" title="Walks and visits" services={demoPets.services} chooseLabel="Choose" popularLabel="Popular" />
    </ShopFrame>
  );
}
