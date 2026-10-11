import { BarChart } from "@krizaka/charts/bar";

// Thousands of euros per quarter.
const quarters = [
  { quarter: "Q4 2025", starter: 18, pro: 42, studio: 26 },
  { quarter: "Q1 2026", starter: 21, pro: 51, studio: 34 },
  { quarter: "Q2 2026", starter: 24, pro: 58, studio: 47 },
  { quarter: "Q3 2026", starter: 22, pro: 66, studio: 61 },
];

export default function PlansByQuarter() {
  return (
    <BarChart
      title="Revenue per plan (k€)"
      data={quarters}
      x="quarter"
      xLabel="Quarter"
      series={[
        { key: "starter", label: "Starter" },
        { key: "pro", label: "Pro" },
        { key: "studio", label: "Studio" },
      ]}
      format="integer"
    />
  );
}
