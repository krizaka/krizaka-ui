import { GoalGauge } from "@krizaka/ui/goal-gauge";

// `mode="drain"`: what is left — the spent steps empty one by one (seats, tickets, problems still standing).
export default function GoalGaugeDrain() {
  return (
    <div className="w-80">
      <GoalGauge label="Seats left" segments={12} value={3} mode="drain" valueText="3 seats left" />
    </div>
  );
}
