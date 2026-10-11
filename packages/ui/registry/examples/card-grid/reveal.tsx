import { CardGrid } from "@krizaka/ui/card-grid";
import { LinkCard } from "@krizaka/ui/link-card";

const sections = ["Getting started", "Architecture", "API", "Operations", "Guidelines", "Glossary"];

// Below the first screen the cards rise once into place, staggered by column (`columns`): the page's MotionObserver
// reveals them. Shown here already revealed (`reveal={false}`) — keep the default on a real page.
export default function CardGridReveal() {
  return (
    <CardGrid className="w-full max-w-4xl" min={220} columns={3} reveal={false} as="ul">
      {sections.map((s) => (
        <LinkCard key={s} href={`#${s}`} title={s} titleAs="span" />
      ))}
    </CardGrid>
  );
}
