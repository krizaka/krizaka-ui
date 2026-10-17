import { Badge } from "@krizaka/ui/badge";
import { Button } from "@krizaka/ui/button";
import { CoverHero } from "@krizaka/ui/cover-hero";

const COVER = "https://krizaka-assets.b-cdn.net/site/products/orazaka/gallery/mtl-snow.e3ecb20e82.webp";

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
