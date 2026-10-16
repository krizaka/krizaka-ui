import { KpiStat } from "@krizaka/charts/card";
import { StatGrid } from "@krizaka/ui/stat";

const jobs = [12, 18, 9, 22, 31, 27, 35, 41];
const minutes = [4.2, 4.6, 5.1, 4.4, 3.9, 3.7, 3.5, 3.2];

// The head of a dashboard: each figure with its change against the previous period and the shape of the period.
export default function DashboardRow() {
  return (
    <StatGrid>
      <KpiStat label="Jobs" value={195} previous={157} data={jobs} variant="bar" hint="last 8 days" />
      <KpiStat label="Success rate" value={0.94} previous={0.91} format="percent" hint="completed / all" />
      <KpiStat label="Median time" value={3.2} previous={4.2} good="down" data={minutes} format={{ style: "unit", unit: "minute" }} hint="to a result" />
      <KpiStat label="Credits spent" value={1240} previous={1100} good="down" format="integer" hint="this period" />
    </StatGrid>
  );
}
