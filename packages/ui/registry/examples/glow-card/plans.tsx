import { Button } from "@krizaka/ui/button";
import { GlowCard } from "@krizaka/ui/glow-card";

const plans = [
  { name: "Community", price: "Free", line: "Self-hosted, every feature.", action: "Start free" },
  { name: "Team", price: "€19", line: "Shared workspaces and roles.", action: "Choose Team", featured: true },
  { name: "Sovereign", price: "Custom", line: "Your servers, our support.", action: "Talk to us" },
];

// Plans: move the pointer across them — the light follows, the ring brightens. The featured plan's ring turns at rest.
// The columns follow the box they are in (a container query), not the screen: three side by side only when each has room
// for its price and its button; the buttons span their card and stand on one line at the bottom.
export default function GlowCardPlans() {
  return (
    <div className="@container w-full max-w-3xl">
      <div className="grid gap-3 @lg:grid-cols-3">
        {plans.map((p) => (
          <GlowCard key={p.name} alive={p.featured} className="flex min-w-0 flex-col gap-2 p-5">
            <h3 className="font-display text-base font-semibold text-fg">{p.name}</h3>
            <p className="font-display text-3xl font-bold tracking-tight text-fg">{p.price}</p>
            <p className="mb-3 text-sm text-fg-secondary">{p.line}</p>
            <Button variant={p.featured ? "gradient" : "outline"} size="sm" className="mt-auto w-full">
              {p.action}
            </Button>
          </GlowCard>
        ))}
      </div>
    </div>
  );
}
