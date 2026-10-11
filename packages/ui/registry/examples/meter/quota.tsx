import { Meter } from "@krizaka/ui/meter";

// Quotas: the tone turns to warning past 70 %, to danger past 90 % — and the value is said in words.
export default function MeterQuota() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Meter label="Storage" value={18} max={50} valueText="18 GB of 50 GB" thresholds={{ low: 0.7, high: 0.9 }} showLabel />
      <Meter label="GPU minutes" value={41} max={50} valueText="41 of 50 min" thresholds={{ low: 0.7, high: 0.9 }} showLabel />
      <Meter label="API calls" value={970} max={1000} valueText="970 of 1,000" thresholds={{ low: 0.7, high: 0.9 }} showLabel />
    </div>
  );
}
