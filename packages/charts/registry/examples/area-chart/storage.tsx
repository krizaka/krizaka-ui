import { AreaChart } from "@krizaka/charts/line";

const days = [12.4, 12.9, 13.1, 13.8, 14.6, 14.9, 15.7, 16.2, 16.4, 17.3, 18.1, 18.6, 19.4, 20.2].map((gb, i) => ({
  day: `2026-09-${String(i + 1).padStart(2, "0")}`,
  gb,
}));

export default function Storage() {
  return (
    <AreaChart
      title="Storage used"
      data={days}
      x="day"
      xFormat="day"
      y="gb"
      yLabel="Storage"
      format={{ style: "unit", unit: "gigabyte" }}
      height={220}
    />
  );
}
