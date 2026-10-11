import { Progress } from "@krizaka/ui/progress";

// A player's timeline: what is watched, and — lighter — what is already loaded ahead (`buffer`).
export default function ProgressBuffer() {
  return (
    <div className="w-full max-w-sm">
      <Progress label="Played" value={38} buffer={71} valueText="1:54 of 5:00" size="sm" />
    </div>
  );
}
