import { ProductLogo } from "@krizaka/ui";
import { ArgumentCard } from "@krizaka/ui/argument-card";
import { CardGrid } from "@krizaka/ui/card-grid";
import { DecisionList } from "@krizaka/ui/decision-list";
import { MarketingLayout } from "@krizaka/ui/marketing-layout";
import { Mascot } from "@krizaka/ui/mascots";
import { NavBar } from "@krizaka/ui/nav-bar";
import { Section } from "@krizaka/ui/page";
import { ClosingBand, LimitsBand, ProductActions, ProductHero } from "@krizaka/ui/product-page";

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

// TEMPLATE — a product page (Sovkora) on the product-page blocks: the hero in depth with its way in, the reasons as
// compact argument cards (the bird in the corner), the decisions with their cost, the limits beside the owl, the closing
// call. On a phone the hero is one column, the cards stack, the decisions' three parts stack under the choice.
export default function MarketingLayoutProductPage() {
  return (
    <div className="brand-sovkora">
      <MarketingLayout
        skipLabel="Skip to content"
        header={
          <NavBar.Root label="Main" compactAfter={false} className="max-w-(--kz-page-max,72rem)">
            <NavBar.Brand href="#home"><ProductLogo id="sovkora" size={22} animated={false} /> Sovkora</NavBar.Brand>
            <NavBar.Items>
              <NavBar.Link href="#why" active>Why</NavBar.Link>
              <NavBar.Link href="#decisions">Decisions</NavBar.Link>
            </NavBar.Items>
          </NavBar.Root>
        }
      >
        <ProductHero
          title="The AI that never leaves home"
          lead="Chat, image, voice and video on your own server, nothing sent anywhere."
          actions={<ProductActions primary={{ href: "#install", label: "Install in three commands" }} secondary={{ href: "#why", label: "Why" }} />}
        />
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
        </Section>
        <LimitsBand
          title="What it does not do"
          items={["It sends nothing anywhere.", "It keeps no usage statistics.", "It does not act without asking."]}
          bird="owl"
          caption="Fig. 1 · the owl, keeps what is yours"
        />
        <ClosingBand title="Ready to run it" inked="at home?" action={<ProductActions primary={{ href: "#install", label: "Install" }} secondary={{ href: "#contact", label: "Talk to us" }} />} />
      </MarketingLayout>
    </div>
  );
}
