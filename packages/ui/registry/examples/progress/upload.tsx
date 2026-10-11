import { Progress } from "@krizaka/ui/progress";

// An upload the user follows: its name, the percentage and the time left above the bar — read as one sentence.
export default function ProgressUpload() {
  return (
    <div className="w-full max-w-sm">
      <Progress label="Night walk.mp4" value={64} eta="About 40 s left" showLabel />
    </div>
  );
}
