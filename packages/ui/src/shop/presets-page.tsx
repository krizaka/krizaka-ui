// Story helper (never published): the same three-section page — hero, services, booking — wearing one look preset. Every preset
// has a story of it, in both themes, so a look that reads badly is seen before a shop wears it.
import { shopPresets } from "@krizaka/tokens/shop-presets";

import { Button } from "../button/button";
import { BookingSection } from "./booking/booking";
import { demoPets, demoSalon,type DemoShop } from "./demo";
import { ShopFrame } from "./frame";
import { HeroSection, type HeroVariant } from "./hero/hero";
import { mascotFor, ShopMascot } from "./look/mascots";
import { shopFrameLook } from "./look/owner-choice";
import type { ShopPage } from "./schema";
import { ServicesSection, type ServicesVariant } from "./services/services";

export function PresetPage({ id, accent, face, motion }: { id: string; accent?: string; face?: ShopPage["face"]; motion?: ShopPage["motion"] }) {
  const preset = shopPresets.find((p) => p.id === id)!;
  const shop: DemoShop = preset.trades[0] === "pets" ? demoPets : demoSalon;
  const hero = (preset.variants.hero ?? "poster") as HeroVariant;
  const services = (preset.variants.services ?? "menu") as ServicesVariant;
  const bird = mascotFor({ type: "booking", variant: "strip" }, preset);
  return (
    <ShopFrame {...shopFrameLook({ preset: { id: preset.id, version: preset.version }, accent, face, motion })} paper={preset.paper}>
      <HeroSection variant={hero === "tv" ? "poster" : hero} title={shop.name} eyebrow={shop.eyebrow} lead={shop.promise} cover={shop.cover} actions={<Button variant="primary" size="lg">Book</Button>} />
      <ServicesSection variant={services} title="Services" lead="Prices before taxes. Pick one, then the time." services={shop.services} chooseLabel="Choose" popularLabel="Popular" />
      <BookingSection mascot={bird ? <ShopMascot bird={bird} /> : undefined} label="Next free times" times={shop.times} href="#book" actionLabel="All times" />
    </ShopFrame>
  );
}
