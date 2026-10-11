import { Gauge } from "@krizaka/charts/native";

export default function CreditsQuota() {
  return (
    <Gauge
      title="Credits used this month"
      value={41_250}
      max={50_000}
      format="compact"
      caption="of 50K credits"
      zones={[
        { to: 40_000, tone: "success" },
        { to: 47_500, tone: "warning" },
        { to: 50_000, tone: "danger" },
      ]}
    />
  );
}
