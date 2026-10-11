import { PageHero } from "@krizaka/ui/page-hero";

// A hub opens on its title alone, centred, on the brand's plain gradient.
export default function PageHeroHub() {
  return (
    <PageHero
      className="w-full"
      align="center"
      backdrop="plain"
      eyebrow="Documentation"
      title="Build with Krizaka"
      lead="The building blocks the products are made of, documented from their source."
    />
  );
}
