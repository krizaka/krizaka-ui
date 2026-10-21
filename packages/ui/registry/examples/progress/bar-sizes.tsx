import { Progress } from "@krizaka/ui/progress";

export default function ProgressBarSizes() {
  return (
    <div className="flex w-64 max-w-full flex-col gap-4">
      <Progress label="Small" size="sm" value={30} />
      <Progress label="Medium" size="md" value={55} />
      <Progress label="Large" size="lg" value={80} />
    </div>
  );
}
