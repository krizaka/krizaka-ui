import { DashboardLayout, Widget } from "@krizaka/ui/dashboard-layout";
import { Stat } from "@krizaka/ui/stat";

// The grid: one column on a phone, two from `sm`, four from `xl`; `span` makes a widget wider (it keeps its order).
export default function DashboardLayoutWidgets() {
  return (
    <DashboardLayout className="w-full" title="Overview" description="The last 7 days.">
      <Widget title="Requests">
        <Stat label="Today" value="1,284" trend="up" trendLabel="+6 %" />
      </Widget>
      <Widget title="Credits left">
        <Stat label="Workspace" value="8,200" />
      </Widget>
      <Widget title="Usage" span={2}>
        <p className="text-sm text-fg-secondary">A chart of @krizaka/charts goes here.</p>
      </Widget>
      <Widget title="Recent jobs" span="full">
        <p className="text-sm text-fg-secondary">A DataTable goes here.</p>
      </Widget>
    </DashboardLayout>
  );
}
