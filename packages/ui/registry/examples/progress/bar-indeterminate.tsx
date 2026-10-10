import { Progress } from "@krizaka/ui/progress";

// No `value`: a wait of unknown length (still under reduced motion).
export default function ProgressBarIndeterminate() {
  return <Progress label="Processing" />;
}
