import { Button } from "@krizaka/ui/button";
import { CoverHero } from "@krizaka/ui/cover-hero";

// Without a cover the hero wears the brand's colours: a new shop still opens on a designed screen.
export default function CoverHeroPlain() {
  return <CoverHero eyebrow="Plateau · Montréal" title="Atelier Sève" lead="Ceramics classes for beginners, in small groups." actions={<Button size="lg" variant="primary">Book a class</Button>} />;
}
