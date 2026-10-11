import { Mascot } from "@krizaka/ui/mascots";
import { Facts } from "@krizaka/ui/page";
import { PageHero } from "@krizaka/ui/page-hero";

// The first screen of a sub-page: the way back, where the reader is, the title, what the page gives — the facts under
// it and the page's bird beside it. Painted at once: never revealed.
export default function PageHeroBuildingBlock() {
  return (
    <PageHero
      className="w-full"
      back={{ href: "#open-source", label: "Open source" }}
      eyebrow="Building block · Java"
      title="Krizaka Java"
      lead="The Spring Boot foundation every Krizaka service starts from: one parent, one BOM, starters that agree."
      aside={<Mascot bird="duck" mood="welcome" size={112} />}
    >
      <Facts items={[{ label: "Maven Central 0.1.0", tone: "ok" }, { label: "Java 21" }, { label: "Apache-2.0" }]} />
    </PageHero>
  );
}
