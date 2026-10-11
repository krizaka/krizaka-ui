import { AreaChart } from "@krizaka/charts/line";

const weeks = [
  { week: "2026-08-03", chat: 9_400, image: 4_100, video: 1_200 },
  { week: "2026-08-10", chat: 10_200, image: 4_600, video: 1_900 },
  { week: "2026-08-17", chat: 9_800, image: 5_300, video: 2_400 },
  { week: "2026-08-24", chat: 11_600, image: 5_100, video: 3_100 },
  { week: "2026-08-31", chat: 12_300, image: 6_200, video: 3_600 },
  { week: "2026-09-07", chat: 12_900, image: 6_000, video: 4_800 },
  { week: "2026-09-14", chat: 13_400, image: 6_900, video: 5_200 },
  { week: "2026-09-21", chat: 14_100, image: 7_400, video: 6_100 },
];

export default function CreditsUsage() {
  return (
    <AreaChart
      title="Credits used per week, by model"
      description="Workspace “Atelier Nord”, Pro plan"
      data={weeks}
      x="week"
      xFormat="day"
      series={[
        { key: "chat", label: "Chat" },
        { key: "image", label: "Image" },
        { key: "video", label: "Video" },
      ]}
      format="integer"
      stacked
      thresholds={[{ value: 25_000, label: "Weekly allowance", tone: "warning" }]}
    />
  );
}
