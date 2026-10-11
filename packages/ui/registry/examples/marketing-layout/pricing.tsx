import { Badge } from "@krizaka/ui/badge";
import { Button } from "@krizaka/ui/button";
import { GlowCard } from "@krizaka/ui/glow-card";
import { Meter } from "@krizaka/ui/meter";
import { Section } from "@krizaka/ui/page";
import { PageHero } from "@krizaka/ui/page-hero";

const PLANS = [
  { id: "community", name: "Community", price: "Free", unit: "self-hosted", points: ["Every feature", "Your hardware", "Community support"] },
  { id: "workspace", name: "Workspace", price: "€29", unit: "per month · 12,000 credits", points: ["Packs & Studios", "Shared workspaces", "Email support"], featured: true },
  { id: "sovereign", name: "Sovereign", price: "Custom", unit: "on your servers", points: ["Installation with you", "Law 25 review", "A named engineer"] },
];

// TEMPLATE — pricing and credits: the plans side by side (the featured one lit by its turning ring), what a credit buys,
// and the credits left for a signed-in visitor. On a phone the plans stack, the featured one first in the reading order
// it already has; every action is the cut button, the featured one primary.
export default function MarketingLayoutPricing() {
  return (
    <div className="w-full">
      <PageHero eyebrow="Pricing" title="Pay once for what was done" lead="Credits buy answers, images and minutes of video — never a seat you do not use." align="center" backdrop="plain" />
      <Section aria-label="Plans" spacing="sm">
        <ul className="grid gap-4 md:grid-cols-3">
          {PLANS.map((p) => (
            <li key={p.id} className="flex">
              <GlowCard alive={p.featured} className="flex w-full flex-col gap-4">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="font-display text-lg font-bold text-fg">{p.name}</h2>
                  {p.featured && <Badge tone="accent">Most chosen</Badge>}
                </div>
                <p>
                  <span className="font-display text-4xl font-extrabold text-fg">{p.price}</span>
                  <span className="mt-1 block text-sm text-fg-secondary">{p.unit}</span>
                </p>
                <ul className="flex flex-col gap-2 text-sm text-fg-secondary">
                  {p.points.map((x) => (
                    <li key={x}>— {x}</li>
                  ))}
                </ul>
                <Button variant={p.featured ? "primary" : "secondary"} shape="cut" className="mt-auto w-full">
                  Choose {p.name}
                </Button>
              </GlowCard>
            </li>
          ))}
        </ul>
      </Section>
      <Section id="credits" title="Your credits" headingSize="sm" spacing="sm" divider>
        <div className="max-w-md">
          <Meter label="Credits this month" value={3800} max={12000} valueText="3,800 of 12,000 used" thresholds={{ low: 0.7, high: 0.9 }} showLabel />
          <p className="mt-3 text-sm text-fg-secondary">One credit ≈ one chat answer · 4 credits an image · 30 a minute of video.</p>
        </div>
      </Section>
    </div>
  );
}
