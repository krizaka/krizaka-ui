import { ArgumentCard } from "@krizaka/ui/argument-card";
import { CardGrid } from "@krizaka/ui/card-grid";

const reasons = [
  { id: "local", title: "Local inference", hook: "Elsewhere, every prompt crosses the ocean." },
  { id: "pipeline", title: "One pipeline", hook: "Elsewhere, each feature guards itself — or forgets." },
  { id: "telemetry", title: "Zero telemetry", hook: "Elsewhere, usage data is the price of the free tier." },
];

// The quiet hover on the reasons: no glow, a lift, a ring on focus. The grid is quiet, so every card is.
export default function ArgumentCardHoverQuiet() {
  return (
    <CardGrid className="w-full max-w-5xl" min={260} reveal={false} hover="quiet">
      {reasons.map((r) => (
        <ArgumentCard key={r.id} id={`quiet-${r.id}`} title={r.title} hook={{ label: "The trap elsewhere", text: r.hook }} more={{ href: `#${r.id}`, label: "Details" }} />
      ))}
    </CardGrid>
  );
}
