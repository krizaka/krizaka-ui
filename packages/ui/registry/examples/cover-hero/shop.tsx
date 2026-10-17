import { Badge } from "@krizaka/ui/badge";
import { Button } from "@krizaka/ui/button";
import { CoverHero } from "@krizaka/ui/cover-hero";

// A drawn sky (a data URI, so the example needs no network); a shop passes its own photo.
const COVER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%230f3d2e'/%3E%3Cstop offset='1' stop-color='%23b5651d'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='600' fill='url(%23g)'/%3E%3Ccircle cx='560' cy='190' r='90' fill='%23f2c48d' opacity='.55'/%3E%3Cpath d='M0 470 Q200 380 400 450 T800 420 V600 H0Z' fill='%23f2c48d' opacity='.35'/%3E%3C/svg%3E";

// A shop's first screen: its cover, the name, one line of promise, the facts that are true, the main action.
export default function CoverHeroShop() {
  return (
    <CoverHero
      cover={{ src: COVER, alt: "" }}
      eyebrow="Saint-Henri · Montréal"
      title="Pattes de Saint-Henri"
      lead="Neighbourhood dog walks, with a photo and a note after each one."
      facts={<><Badge tone="success" dot size="md">Open now · closes at 5 pm</Badge><Badge tone="scrim" size="md">Saint-Henri</Badge></>}
      actions={<Button size="lg" shape="cut" variant="primary">Book a walk</Button>}
    />
  );
}
