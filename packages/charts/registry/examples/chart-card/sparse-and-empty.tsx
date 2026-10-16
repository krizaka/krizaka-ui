import { BarChart } from "@krizaka/charts/bar";
import { ChartCard } from "@krizaka/charts/card";

const days = Array.from({ length: 30 }, (_, i) => ({ day: `2026-09-${String(i + 1).padStart(2, "0")}`, jobs: i === 27 ? 100 : 0 }));

// 29 empty days and one bar: `autoRange` zooms on the active period and says how sparse it is. No data: a calm state.
export default function SparseAndEmpty() {
  return (
    <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
      <ChartCard title="Jobs per day" insight="100 jobs on Sep 28">
        <BarChart data={days} x="day" xFormat="day" y="jobs" yLabel="Jobs" format="integer" height={180} autoRange />
      </ChartCard>
      <ChartCard title="Failed jobs" insight="Nothing failed yet">
        <BarChart data={[]} x="day" y="jobs" yLabel="Jobs" height={180} />
      </ChartCard>
    </div>
  );
}
