import { ProductLogo } from "@krizaka/ui";
import { ActionBar } from "@krizaka/ui/action-bar";
import { ArgumentCard } from "@krizaka/ui/argument-card";
import { Button } from "@krizaka/ui/button";
import { CardGrid } from "@krizaka/ui/card-grid";
import { CtaPanel } from "@krizaka/ui/cta-panel";
import { DecisionList } from "@krizaka/ui/decision-list";
import { MarketingLayout } from "@krizaka/ui/marketing-layout";
import { MascotQuote } from "@krizaka/ui/mascot-quote";
import { Mascot } from "@krizaka/ui/mascots";
import { NavBar } from "@krizaka/ui/nav-bar";
import { Facts, Section } from "@krizaka/ui/page";
import { PageHero } from "@krizaka/ui/page-hero";

const WHY = [
  { id: "local", title: "Local inference", hook: "Elsewhere, every prompt crosses the ocean.", bird: "falcon" as const },
  { id: "paid", title: "Paid once", hook: "Elsewhere, you pay per token, forever.", bird: "flamingo" as const },
  { id: "asked", title: "Agents that ask", hook: "Elsewhere, an agent acts first and apologises later.", bird: "pigeon" as const },
];
const DECISIONS = [
  { id: "local", chose: "Local models by default.", refused: "A hosted API as the default path.", because: "A prompt that never leaves cannot leak.", cost: "You need a GPU, or patience on a CPU." },
  { id: "telemetry", chose: "Zero telemetry.", refused: "Anonymous usage statistics.", because: "Anonymous rarely stays anonymous.", cost: "You tell us what breaks." },
];
const labels = { chose: "We chose", refused: "We refused", because: "Because", cost: "What it costs you" };

// TEMPLATE — a product page (Orazaka): the hero with its facts and its main action, the reasons as compact
// argument cards (the bird in the corner), the decisions with their cost, the owl's promise, the closing call. On a
// phone the hero's bird goes above the title, the cards stack, the decisions' three parts stack under the choice.
export default function MarketingLayoutProductPage() {
  return (
    <div className="brand-orazaka">
      <MarketingLayout
        skipLabel="Skip to content"
        header={
          <NavBar.Root label="Main" compactAfter={false} className="max-w-(--kz-page-max,72rem)">
            <NavBar.Brand href="#home"><ProductLogo id="orazaka" size={22} animated={false} /> Orazaka</NavBar.Brand>
            <NavBar.Items>
              <NavBar.Link href="#why" active>Why</NavBar.Link>
              <NavBar.Link href="#decisions">Decisions</NavBar.Link>
            </NavBar.Items>
          </NavBar.Root>
        }
      >
        <PageHero
          eyebrow="Sovereign AI · open source"
          title="The AI that never leaves home"
          lead="Chat, image, voice and video on your own server — one governed pipeline, nothing sent anywhere."
          aside={<Mascot bird="owl" mood="welcome" size={112} />}
        >
          <Facts items={[{ label: "Apache-2.0", tone: "ok" }, { label: "Law 25 · GDPR" }]} />
          <Button variant="primary" size="lg">Install in three commands</Button>
        </PageHero>
        <Section id="why" eyebrow="Why" title="Three traps it removes">
          <CardGrid min={260} fit="fit" reveal={false}>
            {WHY.map((w) => (
              <ArgumentCard
                key={w.id}
                id={`why-${w.id}`}
                title={w.title}
                mark={<Mascot bird={w.bird} size={40} animated={false} />}
                hook={{ label: "The trap", text: w.hook }}
                more={{ href: `#${w.id}`, label: "Details" }}
              />
            ))}
          </CardGrid>
        </Section>
        <Section id="decisions" eyebrow="Decisions" title="What we chose, and what it costs you" divider>
          <DecisionList decisions={DECISIONS} labels={labels} reveal={false} />
          <div className="mt-8">
            <MascotQuote variant="callout" bird="owl" label="The owl's promise">
              Every personal record stays in Québec, and you can read who touched it.
            </MascotQuote>
          </div>
        </Section>
        <Section spacing="sm" aria-labelledby="product-cta">
          <CtaPanel id="product-cta" title="Ready to run it at home?" body="Three commands, then your first private answer.">
            <ActionBar primaryFirst size="lg" label="Get started" actions={[{ href: "#install", label: "Install" }, { href: "#contact", label: "Talk to us" }]} />
          </CtaPanel>
        </Section>
      </MarketingLayout>
    </div>
  );
}
