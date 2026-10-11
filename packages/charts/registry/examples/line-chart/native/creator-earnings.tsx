import { LineChart } from "@krizaka/charts/native";

const earnings = [
  { month: "2026-04", earnings: 182_000, tips: 21_000 },
  { month: "2026-05", earnings: 164_000, tips: 18_500 },
  { month: "2026-06", earnings: 231_000, tips: 26_000 },
  { month: "2026-07", earnings: 298_000, tips: 31_000 },
  { month: "2026-08", earnings: 276_000, tips: 35_500 },
  { month: "2026-09", earnings: 342_000, tips: 41_000 },
];

export default function CreatorEarnings() {
  return (
    <LineChart
      title="Earnings, last 6 months"
      data={earnings}
      x="month"
      series={[
        { key: "earnings", label: "Video sales" },
        { key: "tips", label: "Tips" },
      ]}
      format={{ style: "money", currency: "EUR" }}
      thresholds={[{ value: 250_000, label: "Payout threshold", tone: "success" }]}
    />
  );
}
