import { CreditUsage } from "@krizaka/charts/credits";

// The credits used each day of the last two weeks (an Orazaka Pro plan of 5,000 credits).
const daily = [120, 180, 95, 210, 260, 140, 60, 75, 230, 310, 280, 190, 240, 300];

export default function MonthlyCredits() {
  return (
    <CreditUsage
      title="Credits this month"
      description="Pro plan"
      used={3_120}
      limit={5_000}
      daily={daily}
      renewsAt="2026-11-01"
      now={new Date("2026-10-11T09:00:00Z")}
      labels={{ remaining: "credits left of {limit}" }}
    />
  );
}
