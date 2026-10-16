import { BarChart } from "@krizaka/charts/bar";
import { ChartCard } from "@krizaka/charts/card";

const data = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => ({ day, jobs: [12, 18, 9, 22, 31, 27, 35][i] }));

// Before: a bare chart, “Show data” and the exports as text buttons. After: the same chart in a ChartCard.
export default function BeforeAfter() {
  return (
    <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
      <div>
        <p style={{ margin: "0 0 8px", fontSize: 12, color: "var(--kz-text-secondary)" }}>Before</p>
        <BarChart title="Jobs per day" data={data} x="day" y="jobs" yLabel="Jobs" height={180} actionsMenu={false} exportable />
      </div>
      <div>
        <p style={{ margin: "0 0 8px", fontSize: 12, color: "var(--kz-text-secondary)" }}>After</p>
        <ChartCard title="Jobs per day" insight="154 jobs · busiest on Sunday" footer="Source: your own jobs.">
          <BarChart data={data} x="day" y="jobs" yLabel="Jobs" height={180} />
        </ChartCard>
      </div>
    </div>
  );
}
