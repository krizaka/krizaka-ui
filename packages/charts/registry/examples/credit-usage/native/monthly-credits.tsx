import { CreditUsage } from "@krizaka/charts/native";

const daily = [120, 180, 95, 210, 260, 140, 60, 75, 230, 310, 280, 190, 240, 300];

// The credits card of the mobile app.
export default function NativeMonthlyCredits() {
  return (
    <CreditUsage
      title="Credits this month"
      used={3_120}
      limit={5_000}
      daily={daily}
      renewsAt="2026-11-01"
      now={new Date("2026-10-11T09:00:00Z")}
      labels={{ remaining: "credits left of {limit}" }}
    />
  );
}
