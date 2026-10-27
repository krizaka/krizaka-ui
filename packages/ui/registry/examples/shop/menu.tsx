import { OpeningHours } from "@krizaka/ui/opening-hours";
import { ShopFrame } from "@krizaka/ui/shop";
import { demoSalon } from "@krizaka/ui/shop/demo";
import { ServicesSection } from "@krizaka/ui/shop/services";

// The price board: a thumbnail only for a service's own photo (Short cut has none), a button that names its service.
export default function ShopMenu() {
  const { services, hours, status } = demoSalon;
  return (
    <ShopFrame density="compact">
      <ServicesSection
        title="Services"
        lead="Prices before taxes. Pick one, then the time."
        services={services}
        chooseLabel="Choose"
        popularLabel="Popular"
        aside={<OpeningHours label="Hours" days={hours} today="3" status={status} />}
      />
    </ShopFrame>
  );
}
