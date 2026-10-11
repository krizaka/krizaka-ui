import { Gauge } from "@krizaka/charts/gauge";

// A challenge's escrow, in cents, against its objective.
export default function ChallengeGoal() {
  return (
    <Gauge
      title="“Shoot the sunrise from the Mont-Royal”"
      description="Challenge in escrow · 6 days left"
      value={186_000}
      max={300_000}
      format={{ style: "money", currency: "CAD" }}
      caption="raised"
      target={{ value: 250_000, label: "Objective" }}
      tone="accent"
      style={{ maxWidth: 320 }}
    />
  );
}
