"use client";

import { ProductLogo } from "@krizaka/ui";
import { AppShell } from "@krizaka/ui/app-shell";
import { Badge } from "@krizaka/ui/badge";
import { Button } from "@krizaka/ui/button";
import { DashboardLayout, Widget } from "@krizaka/ui/dashboard-layout";
import { DataTable, type DataTableColumn } from "@krizaka/ui/data-table";

const icon = (d: string) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={d} />
  </svg>
);

type Request = { id: string; creator: string; kind: string; status: "pending" | "approved" | "refused"; age: string };
const REQUESTS: Request[] = [
  { id: "v-1042", creator: "Elena Varga", kind: "Identity check", status: "pending", age: "12 min" },
  { id: "v-1041", creator: "Noah Petit", kind: "Payout account", status: "pending", age: "40 min" },
  { id: "v-1039", creator: "Maya Chen", kind: "Identity check", status: "approved", age: "2 h" },
  { id: "v-1036", creator: "Tom Lebrun", kind: "Age check (18+)", status: "refused", age: "5 h" },
];
const tone = { pending: "warning", approved: "success", refused: "danger" } as const;
const columns: DataTableColumn<Request>[] = [
  { id: "creator", header: "Creator", sortable: true, card: "title" },
  { id: "kind", header: "Request" },
  { id: "status", header: "Status", cell: (r) => <Badge tone={tone[r.status]} dot>{r.status}</Badge> },
  { id: "age", header: "Waiting", align: "end" },
];

// TEMPLATE — an administration console (Orochia admin): the shell with the console's sections, a queue of requests to
// review as a sortable table with bulk actions — cards on a phone — and the counts that say how long the queue is.
export default function AppShellAdminConsole() {
  return (
    <AppShell.Root>
      <AppShell.Sidebar label="Administration" brand={<><ProductLogo id="orochia" size={24} animated={false} /> Admin</>} closeLabel="Close the menu" collapseLabels={["Collapse", "Expand"]}>
        <AppShell.Group>Review</AppShell.Group>
        <AppShell.Item href="#verification" icon={icon("M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z")} label="Verification" current badge={2} />
        <AppShell.Item href="#moderation" icon={icon("M4 5h16v11H9l-5 4z")} label="Moderation" badge={5} />
        <AppShell.Group>Money</AppShell.Group>
        <AppShell.Item href="#payouts" icon={icon("M3 7h18v10H3zM12 12h.01")} label="Payouts" />
        <AppShell.Item href="#ledger" icon={icon("M5 4h14v16H5zM8 8h8M8 12h8M8 16h5")} label="Ledger" />
        <AppShell.Group>System</AppShell.Group>
        <AppShell.Item href="#backups" icon={icon("M4 7c0-2 16-2 16 0v10c0 2-16 2-16 0zM4 12c0 2 16 2 16 0")} label="Backups" />
      </AppShell.Sidebar>
      <AppShell.Body>
        <AppShell.Header title="Verification" menuLabel="Open the menu" actions={<Button size="sm" variant="secondary">Export</Button>} />
        <AppShell.Main>
          <DashboardLayout headingAs="h2" title="Requests to review" description="Oldest first. A decision is logged with your name.">
            <Widget level={3} title="Pending" description="identity and payout">
              <p className="font-display text-3xl font-extrabold text-fg">2</p>
            </Widget>
            <Widget level={3} title="Oldest wait">
              <p className="font-display text-3xl font-extrabold text-fg">40 min</p>
            </Widget>
            <Widget level={3} title="Queue" span="full">
              <DataTable caption="Verification requests" rows={REQUESTS} columns={columns} getRowId={(r) => r.id} rowLabel={(r) => `${r.creator}, ${r.kind}`} selectable />
            </Widget>
          </DashboardLayout>
        </AppShell.Main>
      </AppShell.Body>
    </AppShell.Root>
  );
}
