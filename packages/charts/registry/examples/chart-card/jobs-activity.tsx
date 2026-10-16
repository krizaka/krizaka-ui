import { BarChart } from "@krizaka/charts/bar";
import { ChartCard } from "@krizaka/charts/card";

const days = ["2026-10-03", "2026-10-04", "2026-10-05", "2026-10-06", "2026-10-07", "2026-10-08", "2026-10-09", "2026-10-10"];
const completed = [12, 18, 9, 22, 31, 27, 35, 41];
const failed = [1, 0, 2, 1, 3, 0, 1, 2];
const data = days.map((day, i) => ({ day, completed: completed[i], failed: failed[i] }));
const series = [
  { key: "completed", label: "Completed", color: "accent" },
  { key: "failed", label: "Failed", color: "danger" },
] as const;

// The card hands the chart its title and insight; the ⋯ menu (table, CSV, PNG, SVG, copy) comes with it.
export default function JobsActivity() {
  return (
    <ChartCard title="Jobs per day" insight="195 jobs · +24 % vs the week before" footer="Read from your own jobs — nothing estimated.">
      <BarChart data={data} x="day" xFormat="day" xLabel="Day" series={series} stacked format="integer" height={220} autoRange />
    </ChartCard>
  );
}
