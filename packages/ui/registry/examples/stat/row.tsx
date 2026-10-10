import { Stat } from "@krizaka/ui/stat";

// A row of stats, as a dashboard shows them.
export default function StatRow() {
  return (
    <div className="grid grid-cols-3 gap-8 rounded-xl border border-border-default bg-surface-1 p-6">
      <Stat label="Views" value="12.4k" trend="up" trendLabel="+8 %" hint="7 days" />
      <Stat label="Supporters" value="318" trend="up" trendLabel="+21" hint="7 days" />
      <Stat label="Payouts" value="€902" trend="down" trendLabel="−3 %" hint="7 days" />
    </div>
  );
}
