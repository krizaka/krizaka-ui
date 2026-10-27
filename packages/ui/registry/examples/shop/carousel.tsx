import { ShopFrame } from "@krizaka/ui/shop";
import { demoPets } from "@krizaka/ui/shop/demo";
import { ServicesSection } from "@krizaka/ui/shop/services";

// Services · carousel: the same resolved services, another drawing.
export default function ShopCarousel() {
  return (
    <ShopFrame density="compact">
      <ServicesSection variant="carousel" title="Walks and visits" services={demoPets.services} chooseLabel="Choose" popularLabel="Popular" />
    </ShopFrame>
  );
}
