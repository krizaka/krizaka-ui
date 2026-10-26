import { ProductLogo } from "@krizaka/ui";
import { CardGrid } from "@krizaka/ui/card-grid";
import { LinkCard } from "@krizaka/ui/link-card";
import { Section } from "@krizaka/ui/page";
import { PageHero } from "@krizaka/ui/page-hero";

const GROUPS = [
  {
    id: "start",
    title: "Start here",
    cards: [
      { id: "cli", logo: "orazaka", title: "The CLI", text: "npx orazaka install, start, dev — then every command." },
      { id: "packs", logo: "orazaka", title: "Packs & Studios", text: "The business offers Orazaka installs without code." },
      { id: "admin", logo: "orazaka", title: "The admin console", text: "Users, models, quotas and the audit log — behind four gates." },
    ],
  },
  {
    id: "platform",
    title: "Platform",
    cards: [
      { id: "ui", logo: "krizaka", title: "Krizaka UI", text: "Tokens, a Tailwind preset and the components — live." },
      { id: "java", logo: "krizaka", title: "Krizaka Java", text: "Parent, BOM, starters, messaging, Problem Details." },
    ],
  },
] as const;

// TEMPLATE — a documentation hub (krizaka.com/docs): the hero, then one section per group, each a grid of compact link
// cards — the whole card one link, the product's mark, one sentence, the way in. One column on a phone.
export default function MarketingLayoutDocsHub() {
  return (
    <div className="w-full">
      <PageHero eyebrow="Documentation" title="Build with Krizaka" lead="The building blocks the products are made of, documented from their source." backdrop="plain" />
      {GROUPS.map((g) => (
        <Section key={g.id} id={`hub-${g.id}`} title={g.title} headingSize="sm" spacing="sm">
          <CardGrid min={260} reveal={false}>
            {g.cards.map((c) => (
              <LinkCard key={c.id} href={`#${c.id}`} icon={<ProductLogo id={c.logo} size={24} animated={false} />} title={c.title} description={c.text} cta="Open" />
            ))}
          </CardGrid>
        </Section>
      ))}
    </div>
  );
}
