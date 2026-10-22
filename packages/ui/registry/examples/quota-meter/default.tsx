import { QuotaMeter } from "@krizaka/ui/quota-meter";

// TEMPLATE — the plan's room: storage used, what to do about it, the small figures.
export default function QuotaMeterDefault() {
  return (
    <QuotaMeter
      className="max-w-md"
      title="Storage"
      plan="Creator plan"
      value={8.6}
      max={10}
      usedText="8.6 GB of 10 GB"
      meterLabel="Storage used"
      level="warning"
      statusText="You are at 86 %. Remove a video or change plan before you reach the limit."
      details={["412 of 600 minutes", "2 of 10 uploads today"]}
      action={<a href="#manage" className="font-semibold text-fg-accent hover:underline">Manage your videos</a>}
    />
  );
}
