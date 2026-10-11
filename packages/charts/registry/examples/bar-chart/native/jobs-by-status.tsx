import { BarChart } from "@krizaka/charts/native";

const days = [
  { day: "2026-10-07", completed: 1_505, failed: 95 },
  { day: "2026-10-08", completed: 1_788, failed: 27 },
  { day: "2026-10-09", completed: 1_934, failed: 33 },
  { day: "2026-10-10", completed: 1_102, failed: 19 },
  { day: "2026-10-11", completed: 986, failed: 12 },
];

export default function JobsByStatus() {
  return (
    <BarChart
      title="Jobs per day"
      data={days}
      x="day"
      xFormat="day"
      series={[
        { key: "completed", label: "Completed", color: "success" },
        { key: "failed", label: "Failed", color: "danger" },
      ]}
      format="compact"
      stacked
    />
  );
}
