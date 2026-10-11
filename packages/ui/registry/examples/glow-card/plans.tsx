import { Button } from "@krizaka/ui/button";
import { GlowCard } from "@krizaka/ui/glow-card";

const plans = [
  { name: "Community", price: "Free", line: "Self-hosted, every feature." },
  { name: "Team", price: "€19", line: "Shared workspaces and roles.", featured: true },
  { name: "Sovereign", price: "Custom", line: "Your servers, our support." },
];

// Plans: move the pointer across them — the light follows, the ring brightens. The featured plan's ring turns at rest.
export default function GlowCardPlans() {
  return (
    <div className="grid w-full max-w-3xl gap-4 sm:grid-cols-3">
      {plans.map((p) => (
        <GlowCard key={p.name} alive={p.featured} className="flex flex-col gap-3">
          <h3 className="font-display text-lg font-semibold text-fg">{p.name}</h3>
          <p className="font-display text-3xl font-bold text-fg">{p.price}</p>
          <p className="text-sm text-fg-secondary">{p.line}</p>
          <Button variant={p.featured ? "gradient" : "outline"} size="sm" className="mt-auto">
            Choose {p.name}
          </Button>
        </GlowCard>
      ))}
    </div>
  );
}
