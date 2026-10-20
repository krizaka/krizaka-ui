import { GlowCard } from "@krizaka/ui/glow-card";

// `glow="spotlight"` is deprecated (krizaka-ui#393): the bloom under the pointer is retired, so these cards draw no ring.
export default function GlowCardSpotlight() {
  return (
    <div className="grid w-full max-w-lg grid-cols-2 gap-3">
      {["Tips", "Unlocks", "Auctions", "Challenges"].map((name) => (
        <GlowCard key={name} glow="spotlight" className="p-4">
          <p className="font-semibold text-fg">{name}</p>
          <p className="text-xs text-fg-secondary">90 % to the creator</p>
        </GlowCard>
      ))}
    </div>
  );
}
