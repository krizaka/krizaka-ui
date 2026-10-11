import { NumberTicker } from "@krizaka/ui/number-ticker";

// Inside gradient text: every box of the figure carries the gradient, so the climbing digits stay painted.
export default function NumberTickerGradient() {
  return (
    <p className="bg-linear-to-r from-accent to-accent-2 bg-clip-text font-display text-5xl font-bold text-transparent">
      <NumberTicker value={4.9} format={{ maximumFractionDigits: 1 }} locale="en" />
    </p>
  );
}
