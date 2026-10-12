import { GoalGauge } from "@krizaka/ui/goal-gauge";

// The boss gauge: a skewed frame, gradient cells, the label centred — every head sealed, the gauge empty.
export default function GoalGaugeArcade() {
  return (
    <div className="w-96 brand-orochia">
      <GoalGauge variant="arcade" label="Boss gauge" segments={8} value={0} mode="drain" valueText="All eight sealed" />
    </div>
  );
}
