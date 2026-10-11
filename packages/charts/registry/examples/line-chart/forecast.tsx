import { LineChart } from "@krizaka/charts/line";

const requests = [
  { week: "2026-07-06", actual: 41_200 },
  { week: "2026-07-13", actual: 43_900 },
  { week: "2026-07-20", actual: 47_100 },
  { week: "2026-07-27", actual: 52_800, forecast: 52_800 },
  { week: "2026-08-03", forecast: 57_400 },
  { week: "2026-08-10", forecast: 61_000 },
  { week: "2026-08-17", forecast: 66_300 },
];

export default function Forecast() {
  return (
    <LineChart
      title="Inference requests per week"
      description="Actual, then forecast"
      data={requests}
      x="week"
      xFormat="day"
      series={[
        { key: "actual", label: "Actual" },
        { key: "forecast", label: "Forecast", color: 1, dashed: true },
      ]}
      format="compact"
      markers={[{ x: "2026-07-27", label: "Studio launch", tone: "accent" }]}
      dots
    />
  );
}
