import { AreaChart } from "@krizaka/charts/native";

const weeks = [
  { week: "2026-08-03", chat: 9_400, image: 4_100 },
  { week: "2026-08-10", chat: 10_200, image: 4_600 },
  { week: "2026-08-17", chat: 9_800, image: 5_300 },
  { week: "2026-08-24", chat: 11_600, image: 5_100 },
  { week: "2026-08-31", chat: 12_300, image: 6_200 },
  { week: "2026-09-07", chat: 12_900, image: 6_000 },
];

export default function CreditsUsage() {
  return (
    <AreaChart
      title="Credits used per week"
      data={weeks}
      x="week"
      xFormat="day"
      series={[
        { key: "chat", label: "Chat" },
        { key: "image", label: "Image" },
      ]}
      format="compact"
      stacked
    />
  );
}
