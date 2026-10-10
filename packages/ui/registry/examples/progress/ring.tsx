import { Progress } from "@krizaka/ui/progress";

// A ring holds its amount in the centre; `valueText` gives the words a screen reader reads.
export default function ProgressRing() {
  return (
    <div className="flex items-end gap-6">
      <Progress variant="ring" size="sm" label="Profile completed" value={40} />
      <Progress variant="ring" size="md" label="Raised" value={420} max={1000} valueText="$420 of $1,000">
        <span className="text-sm font-bold text-fg">42%</span>
      </Progress>
      <Progress variant="ring" size="lg" label="Raised towards the goal" value={750} max={1000} valueText="$750 of $1,000">
        <span className="font-display text-2xl font-black text-fg">$750</span>
        <span className="text-xs text-fg-secondary">of $1,000</span>
      </Progress>
    </div>
  );
}
