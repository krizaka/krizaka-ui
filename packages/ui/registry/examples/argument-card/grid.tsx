import { ArgumentCard } from "@krizaka/ui/argument-card";
import { CardGrid } from "@krizaka/ui/card-grid";

const reasons = [
  { id: "local", title: "Local inference", hook: "Elsewhere, every prompt crosses the ocean." },
  { id: "pipeline", title: "One pipeline", hook: "Elsewhere, each feature guards itself — or forgets." },
  { id: "telemetry", title: "Zero telemetry", hook: "Elsewhere, usage data is the price of the free tier." },
];

// A product page's reasons, side by side: each card the same height, the hook at the same place on every card.
export default function ArgumentCardGrid() {
  return (
    <CardGrid className="w-full max-w-5xl" min={260} reveal={false}>
      {reasons.map((r) => (
        <ArgumentCard key={r.id} id={`why-${r.id}`} title={r.title} hook={{ label: "The trap elsewhere", text: r.hook }} more={{ href: `#${r.id}`, label: "Details" }} />
      ))}
    </CardGrid>
  );
}
