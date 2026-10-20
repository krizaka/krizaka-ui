import { ProductLogo } from "@krizaka/ui";
import { AppShell } from "@krizaka/ui/app-shell";
import { Avatar } from "@krizaka/ui/avatar";
import { Badge } from "@krizaka/ui/badge";
import { Button } from "@krizaka/ui/button";
import { DashboardLayout, Widget } from "@krizaka/ui/dashboard-layout";
import { Meter } from "@krizaka/ui/meter";
import { Stat } from "@krizaka/ui/stat";

const icon = (d: string) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={d} />
  </svg>
);
const NAV = [
  { id: "home", label: "Home", d: "M4 11 12 4l8 7v9H4z", current: true },
  { id: "videos", label: "Videos", d: "M4 6h12v12H4zM16 10l4-2v8l-4-2", badge: 2 },
  { id: "auctions", label: "Auctions", d: "M5 19h10M8 5l6 6M11 2l6 6M6 13l4-4" },
  { id: "challenges", label: "Challenges", d: "M12 3v18M5 7h10l-2 3 2 3H5" },
];
const MONEY = [
  { id: "earnings", label: "Earnings", d: "M4 18h16M7 14l3-3 3 2 5-6" },
  { id: "payouts", label: "Payouts", d: "M3 7h18v10H3zM12 12h.01" },
];
const SALES = [
  { what: "Unlock · “Night shoot, part 2”", who: "Léa M.", net: "€4.50" },
  { what: "Tip", who: "Samir K.", net: "€9.00" },
  { what: "Auction won · “Backstage cut”", who: "Inès B.", net: "€61.20" },
];

// TEMPLATE — Orochia's creator studio, Elena's home: the shell (sidebar of the studio, drawer on a phone) around a
// dashboard — this week's figures, the payout on its way, the latest sales, the next auction. On a phone the sidebar
// is a drawer, the stats stack two by two, every widget takes the full width.
export default function AppShellOrochiaStudio() {
  return (
    <div className="brand-orochia">
      <AppShell.Root>
        <AppShell.Sidebar
          label="Studio"
          brand={<><ProductLogo id="orochia" size={24} animated={false} /> Orochia</>}
          collapseLabels={["Collapse", "Expand"]}
          closeLabel="Close the menu"
          footer={
            <div className="flex items-center gap-2.5 px-2 py-2 text-sm">
              <Avatar fallback="EV" size="sm" />
              <span className="min-w-0 truncate font-medium">Elena Varga</span>
            </div>
          }
        >
          {NAV.map((n) => (
            <AppShell.Item key={n.id} href={`#${n.id}`} icon={icon(n.d)} label={n.label} current={n.current} badge={n.badge} />
          ))}
          <AppShell.Group>Money</AppShell.Group>
          {MONEY.map((n) => (
            <AppShell.Item key={n.id} href={`#${n.id}`} icon={icon(n.d)} label={n.label} />
          ))}
        </AppShell.Sidebar>
        <AppShell.Body>
          <AppShell.Header
            title="Studio"
            menuLabel="Open the menu"
            actions={<Button size="sm" variant="primary">Upload a video</Button>}
          />
          <AppShell.Main>
            <DashboardLayout headingAs="h2" eyebrow="This week" title="Good morning, Elena" description="Three sales since yesterday — your auction ends tonight.">
              <Widget level={3} title="Your week" span="full">
                <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                  <Stat label="Views" value="12.4k" trend="up" trendLabel="+8 %" hint="7 days" />
                  <Stat label="Supporters" value="318" trend="up" trendLabel="+21" hint="7 days" />
                  <Stat label="Earned" value="€902" trend="up" trendLabel="+14 %" hint="after the 10 % fee" />
                  <Stat label="Unlocks" value="146" trend="flat" trendLabel="±0" hint="7 days" />
                </div>
              </Widget>
              <Widget level={3} title="Next payout" description="Every Monday, from €20" span={2}>
                <Meter label="Towards your payout" value={74} max={100} valueText="€74 of €100 goal" showLabel />
                <p className="mt-3 text-sm text-fg-secondary">€902 will reach your bank on Monday.</p>
              </Widget>
              <Widget level={3} title="Auction" description="“Backstage cut”" span={2} action={<Badge tone="accent" dot>Open</Badge>}>
                <p className="font-display text-3xl font-extrabold text-fg">€68</p>
                <p className="text-sm text-fg-secondary">7 bids · ends tonight at 21:00</p>
              </Widget>
              <Widget level={3} title="Latest sales" span="full" action={<Button size="sm" variant="ghost">See all</Button>}>
                <ul className="divide-y divide-border-subtle">
                  {SALES.map((s) => (
                    <li key={s.what} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                      <span className="min-w-0">
                        <span className="block truncate font-medium text-fg">{s.what}</span>
                        <span className="text-fg-secondary">{s.who}</span>
                      </span>
                      <span className="font-mono font-semibold text-fg-success">{s.net}</span>
                    </li>
                  ))}
                </ul>
              </Widget>
            </DashboardLayout>
          </AppShell.Main>
        </AppShell.Body>
      </AppShell.Root>
    </div>
  );
}
