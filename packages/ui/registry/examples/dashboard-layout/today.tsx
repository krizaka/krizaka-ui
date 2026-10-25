import { Badge } from "@krizaka/ui/badge";
import { Button } from "@krizaka/ui/button";
import { DashboardLayout, Widget } from "@krizaka/ui/dashboard-layout";
import { Stat } from "@krizaka/ui/stat";

const link = "font-semibold text-fg-accent underline underline-offset-2";

// TEMPLATE — a small service shop's morning (Atelier Eric, a fictitious bookkeeper): the date on the right of the heading, a lead
// sentence whose figures are links, four quick-access tiles, the widgets, and the side column (the period, what to do next, notes).
// On a phone the date goes under the title, the tiles are two by two and the side column comes last.
export default function DashboardLayoutToday() {
  return (
    <div className="brand-akinaza w-full">
      <DashboardLayout
        title="Good morning, Eric"
        date="Monday, October 26"
        description={
          <>
            <a className={link} href="#unpaid">2 invoices</a> are waiting for payment and <a className={link} href="#visits">3 visits</a> are planned today.
          </>
        }
        actions={<Button size="sm" variant="primary">New invoice</Button>}
        quickActions={[
          { id: "invoice", label: "New invoice", hint: "From a visit or a quote", href: "#invoice" },
          { id: "client", label: "New client", hint: "Name and a contact", href: "#client" },
          { id: "visit", label: "Plan a visit", hint: "Pick a time", href: "#visit" },
          { id: "expense", label: "Add an expense", hint: "A photo is enough", href: "#expense" },
        ]}
        quickActionsLabel="Quick access"
        side={
          <>
            <Widget title="This month" level={3} description="October 1 – 26">
              <Stat label="Invoiced" value="$4,280" trend="up" trendLabel="+12 %" />
            </Widget>
            <Widget title="Next steps" level={3}>
              <ul className="flex list-none flex-col gap-2 p-0 text-sm">
                <li>Send the Gagnon quote</li>
                <li>Call Mme Roy about her invoice</li>
              </ul>
            </Widget>
            <Widget title="Notes" level={3}>
              <p className="m-0 text-sm text-fg-secondary">Tax instalment is due on the 15th.</p>
            </Widget>
          </>
        }
      >
        <Widget title="Waiting for payment" span={2} action={<Badge tone="warning">2</Badge>}>
          <ul className="flex list-none flex-col gap-2 p-0 text-sm">
            <li>Gagnon — $640, 9 days late</li>
            <li>Roy — $215, due Friday</li>
          </ul>
        </Widget>
        <Widget title="Today" span={2}>
          <ul className="flex list-none flex-col gap-2 p-0 text-sm">
            <li>9:00 — Lavoie, kitchen taps</li>
            <li>11:30 — Roy, quote visit</li>
            <li>2:00 — Gagnon, follow-up</li>
          </ul>
        </Widget>
      </DashboardLayout>
    </div>
  );
}
