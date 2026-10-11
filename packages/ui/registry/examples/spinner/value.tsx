import { Spinner } from "@krizaka/ui/spinner";

// `value` (0–1): the trace grows to what is done — a determinate wait in the same small footprint.
export default function SpinnerValue() {
  return (
    <div className="flex items-center gap-4">
      {[0.25, 0.6, 0.9].map((value) => (
        <Spinner key={value} label={`Uploading, ${Math.round(value * 100)} %`} value={value} size="lg" />
      ))}
    </div>
  );
}
