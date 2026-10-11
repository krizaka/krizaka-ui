import { Progress } from "@krizaka/ui/progress";

// When it stops: `paused` rests striped (it waits for someone), `error` turns to the danger colour where it stopped.
export default function ProgressStatuses() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Progress label="Sync — paused, waiting for Wi-Fi" value={45} status="paused" showLabel />
      <Progress label="Transcoding failed at 72 %" value={72} status="error" showLabel valueText="Retry" />
    </div>
  );
}
