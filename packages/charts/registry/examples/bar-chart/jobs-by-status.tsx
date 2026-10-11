import { BarChart } from "@krizaka/charts/bar";

const days = [
  { day: "2026-10-05", completed: 1_240, failed: 38, queued: 12 },
  { day: "2026-10-06", completed: 1_612, failed: 41, queued: 20 },
  { day: "2026-10-07", completed: 1_505, failed: 95, queued: 31 },
  { day: "2026-10-08", completed: 1_788, failed: 27, queued: 18 },
  { day: "2026-10-09", completed: 1_934, failed: 33, queued: 44 },
  { day: "2026-10-10", completed: 1_102, failed: 19, queued: 9 },
  { day: "2026-10-11", completed: 986, failed: 12, queued: 63 },
];

export default function JobsByStatus() {
  return (
    <BarChart
      title="Jobs per day, by status"
      description="Orazaka · all workspaces"
      data={days}
      x="day"
      xFormat="day"
      series={[
        { key: "completed", label: "Completed", color: "success" },
        { key: "failed", label: "Failed", color: "danger" },
        { key: "queued", label: "Queued", color: "neutral" },
      ]}
      format="integer"
      stacked
      exportable={["csv", "png"]}
    />
  );
}
