import { LatencyChart } from "@krizaka/charts/latency";

// Orazaka: how long a job takes to give its result, per kind — seconds turn into minutes.
const kinds = [
  { kind: "Summary", median: 8_400 },
  { kind: "Transcript", median: 46_000 },
  { kind: "Dubbing", median: 312_000 },
  { kind: "Video clip", median: 540_000 },
];

export default function TimeToResult() {
  return (
    <LatencyChart
      title="Time to result"
      data={kinds}
      x="kind"
      p50="median"
      p95={null}
      labels={{ p50: "Median", slowest: "median of {name}, the slowest" }}
    />
  );
}
