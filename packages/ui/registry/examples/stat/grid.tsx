import { Meter } from "@krizaka/ui/meter";
import { Stat, StatGrid } from "@krizaka/ui/stat";

// The console's head: figures that wrap with the width, hairlines between them; a meter under the storage.
export default function StatGridExample() {
  return (
    <StatGrid>
      <Stat label="Gross volume" value="$21,045" trend="up" trendLabel="+15 %" hint="vs September" />
      <Stat label="Creator earnings" value="$17,888" trend="up" trendLabel="+16 %" hint="net of fees" />
      <Stat label="Open reports" value="7" trend="down" trendLabel="−3" hint="since yesterday" />
      <Stat label="Storage" value="1.74 TB" hint="of 2 TB" chart={<Meter label="Storage used" value={87} thresholds={{ low: 0.8, high: 0.95 }} />} />
    </StatGrid>
  );
}
