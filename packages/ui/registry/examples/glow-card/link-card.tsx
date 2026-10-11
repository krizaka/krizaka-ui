import { GlowCard } from "@krizaka/ui/glow-card";

// `asChild`: the card is the link. The focus lights the ring as the pointer does — keyboard readers get the same answer.
export default function GlowCardLink() {
  return (
    <GlowCard asChild glow="border" className="block max-w-sm no-underline focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring">
      <a href="#docs">
        <span className="block font-display text-lg font-semibold text-fg">Read the documentation</span>
        <span className="mt-1 block text-sm text-fg-secondary">Every component, its examples and its props — generated from the code.</span>
      </a>
    </GlowCard>
  );
}
