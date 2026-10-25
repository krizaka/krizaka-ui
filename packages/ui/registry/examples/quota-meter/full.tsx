import { QuotaMeter } from "@krizaka/ui/quota-meter";

export default function QuotaMeterFull() {
  return (
    <QuotaMeter
      className="max-w-md"
      title="Storage"
      plan="Free plan"
      value={2}
      max={2}
      usedText="2 GB of 2 GB"
      meterLabel="Storage used"
      level="full"
      statusText="Your storage is full: new uploads wait."
      notices={["2 uploads are on hold.", "Uploads are paused for everyone while we catch up."]}
    />
  );
}
