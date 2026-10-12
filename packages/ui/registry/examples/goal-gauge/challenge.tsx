import { GoalGauge } from "@krizaka/ui/goal-gauge";

// A challenge's goal: 6 backers of 10 — the reached steps light one by one when its scene plays.
export default function GoalGaugeChallenge() {
  return (
    <div className="w-80">
      <GoalGauge label="Backers" segments={10} value={6} valueText="6 of 10 backers" />
    </div>
  );
}
