import { StatGrid } from "@krizaka/ui/stat";

// A sparkline of @krizaka/charts goes in `chart` (64 × 18); here a plain line stands in for it.
const line = (points: string) => (
  <svg viewBox="0 0 64 18" width={64} height={18} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
    <polyline points={points} />
  </svg>
);

// The discreet activity of a side column: four figures in one row, each with its shape and its trend in words (demo data).
export default function StatStrip() {
  return (
    <StatGrid
      variant="strip"
      className="max-w-[26rem]"
      aria-label="Activity, last 30 days"
      items={[
        { id: "runs", label: "Checks run", value: "128", trend: "up", trendLabel: "+12 %", chart: line("0,15 13,11 26,13 39,7 52,5 64,2") },
        { id: "flagged", label: "Flagged", value: "9", trend: "down", trendLabel: "−2", chart: line("0,4 13,8 26,5 39,11 52,12 64,14") },
        { id: "time", label: "Average time", value: "42 s", trend: "flat", trendLabel: "same", chart: line("0,9 13,9 26,8 39,9 52,9 64,9") },
        { id: "credits", label: "Credits used", value: "310", trend: "up", trendLabel: "+4 %", chart: line("0,14 13,12 26,12 39,9 52,9 64,6") },
      ]}
    />
  );
}
