import { Gauge } from "@krizaka/charts/gauge";

export default function CreditsQuota() {
  return (
    <Gauge
      title="Credits used this month"
      value={41_250}
      max={50_000}
      format="compact"
      caption="of 50K credits"
      zones={[
        { to: 40_000, tone: "success", label: "Within plan" },
        { to: 47_500, tone: "warning", label: "Nearing the limit" },
        { to: 50_000, tone: "danger", label: "At the limit" },
      ]}
      style={{ maxWidth: 320 }}
    />
  );
}
