// Story helper (never published): the same three-section page — hero, services, booking — wearing one look preset. Every preset
// has a story of it, in both themes, so a look that reads badly is seen before a shop wears it.
import { shopPresets } from "@krizaka/tokens/shop-presets";

import { Button } from "../button/button";
import { BookingSection } from "./booking/booking";
import { demoPets, demoSalon,type DemoShop } from "./demo";
import { ShopFrame } from "./frame";
import { HeroSection, type HeroVariant } from "./hero/hero";
import { ServicesSection, type ServicesVariant } from "./services/services";

export function PresetPage({ id, accent }: { id: string; accent?: string }) {
  const preset = shopPresets.find((p) => p.id === id)!;
  const shop: DemoShop = preset.trades[0] === "pets" ? demoPets : demoSalon;
  const hero = (preset.variants.hero ?? "poster") as HeroVariant;
  const services = (preset.variants.services ?? "menu") as ServicesVariant;
  return (
    <ShopFrame preset={preset.id} density={preset.density} paper={preset.paper} accent={accent}>
      <HeroSection variant={hero === "tv" ? "poster" : hero} title={shop.name} eyebrow={shop.eyebrow} lead={shop.promise} cover={shop.cover} actions={<Button variant="primary" size="lg">Book</Button>} />
      <ServicesSection variant={services} title="Services" lead="Prices before taxes. Pick one, then the time." services={shop.services} chooseLabel="Choose" popularLabel="Popular" />
      <BookingSection label="Next free times" times={shop.times} href="#book" actionLabel="All times" />
    </ShopFrame>
  );
}
