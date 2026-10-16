import { ChartCard } from "@krizaka/charts/card";
import { DonutChart } from "@krizaka/charts/pie";

const kinds = [
  { kind: "Images", jobs: 96 },
  { kind: "Video", jobs: 41 },
  { kind: "Audio", jobs: 33 },
  { kind: "Text", jobs: 25 },
];

// Legend chips carry the value and the share, and switch a part off: click “Video” and the ring re-measures.
export default function UsageDonut() {
  return (
    <ChartCard title="What you made" insight="195 jobs, most of them images" description="Jobs by kind, last 7 days.">
      <DonutChart data={kinds} label="kind" value="jobs" labelHeader="Kind" valueHeader="Jobs" centerLabel="jobs" format="integer" height={220} />
    </ChartCard>
  );
}
