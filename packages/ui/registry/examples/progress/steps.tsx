import { Progress } from "@krizaka/ui/progress";

// A task in steps: `segments` cuts the bar into its parts — 3 of 5 done reads at a glance.
export default function ProgressSteps() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Progress label="Profile completed" value={3} max={5} valueText="3 of 5 steps" segments={5} showLabel />
      <Progress variant="ring" label="Goal" value={7} max={10} segments={10} valueText="7 of 10 supporters">
        <span className="text-sm font-semibold text-fg">7/10</span>
      </Progress>
    </div>
  );
}
