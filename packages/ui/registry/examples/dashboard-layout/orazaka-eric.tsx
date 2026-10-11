import { Badge } from "@krizaka/ui/badge";
import { Button } from "@krizaka/ui/button";
import { DashboardLayout, Widget } from "@krizaka/ui/dashboard-layout";
import { Meter } from "@krizaka/ui/meter";
import { Progress } from "@krizaka/ui/progress";
import { Stat } from "@krizaka/ui/stat";
import { Tabs } from "@krizaka/ui/tabs";

const JOBS = [
  { name: "Catalogue summaries", studio: "Writing studio", value: 72, eta: "about 2 min" },
  { name: "Product shots, autumn", studio: "Image studio", value: 35, eta: "about 6 min" },
];
const PACKS = [
  { name: "Customer support", runs: "412 answers this week" },
  { name: "Law 25 review", runs: "38 documents checked" },
];

// TEMPLATE — Orazaka's console, Eric's morning (an accountant who runs his firm's AI on its own server): what the
// engine did, what is running now, the credits left, the packs at work. The period is a segmented tab above the grid;
// on a phone everything stacks in reading order, the running jobs first after the figures.
export default function DashboardLayoutOrazakaEric() {
  return (
    <div className="brand-orazaka w-full">
      <DashboardLayout
        eyebrow="Tremblay & associés · on-premise"
        title="Good morning, Eric"
        description="Nothing left your server this week: 1,284 requests, all answered locally."
        actions={
          <>
            <Button size="sm" variant="secondary" shape="cut">Add a pack</Button>
            <Button size="sm" variant="primary" shape="cut">New job</Button>
          </>
        }
        toolbar={
          <Tabs.Root defaultValue="7d" variant="segmented">
            <Tabs.List aria-label="Period">
              <Tabs.Trigger value="today">Today</Tabs.Trigger>
              <Tabs.Trigger value="7d">7 days</Tabs.Trigger>
              <Tabs.Trigger value="30d">30 days</Tabs.Trigger>
            </Tabs.List>
          </Tabs.Root>
        }
      >
        <Widget title="Requests">
          <Stat label="7 days" value="1,284" trend="up" trendLabel="+6 %" />
        </Widget>
        <Widget title="Answered locally">
          <Stat label="No cloud call" value="100 %" hint="sovereign mode" />
        </Widget>
        <Widget title="Median answer">
          <Stat label="Chat" value="1.8 s" trend="down" trendLabel="−0.3 s" />
        </Widget>
        <Widget title="Credits" description="Workspace plan">
          <Meter label="Credits used" value={3800} max={12000} valueText="3,800 of 12,000" showLabel />
        </Widget>
        <Widget title="Running now" span={2} action={<Badge tone="accent" dot>2 jobs</Badge>}>
          <ul className="flex flex-col gap-4">
            {JOBS.map((j) => (
              <li key={j.name} className="flex flex-col gap-1.5">
                <span className="flex items-baseline justify-between gap-2 text-sm">
                  <span className="font-medium text-fg">{j.name}</span>
                  <span className="text-xs text-fg-secondary">{j.studio}</span>
                </span>
                <Progress value={j.value} label={j.name} eta={j.eta} size="sm" />
              </li>
            ))}
          </ul>
        </Widget>
        <Widget title="Packs at work" span={2} action={<Button size="sm" variant="ghost">All packs</Button>}>
          <ul className="divide-y divide-border-subtle">
            {PACKS.map((p) => (
              <li key={p.name} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                <span className="font-medium text-fg">{p.name}</span>
                <span className="text-fg-secondary">{p.runs}</span>
              </li>
            ))}
          </ul>
        </Widget>
      </DashboardLayout>
    </div>
  );
}
