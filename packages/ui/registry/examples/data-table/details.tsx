"use client";

import { Badge } from "@krizaka/ui/badge";
import { DataTable, type DataTableColumn } from "@krizaka/ui/data-table";

type Request = { id: string; creator: string; kind: string; status: "pending" | "approved"; note: string };
const requests: Request[] = [
  { id: "v-1042", creator: "Elena Varga", kind: "Identity check", status: "pending", note: "Passport, expires 2031. Selfie matches." },
  { id: "v-1041", creator: "Noah Petit", kind: "Payout account", status: "pending", note: "IBAN FR76 •••• 0412, holder name matches." },
  { id: "v-1039", creator: "Maya Chen", kind: "Identity check", status: "approved", note: "Approved by Sam on Oct 11." },
];
const columns: DataTableColumn<Request>[] = [
  { id: "creator", header: "Creator", card: "title" },
  { id: "kind", header: "Request" },
  { id: "status", header: "Status", cell: (r) => <Badge tone={r.status === "pending" ? "warning" : "success"}>{r.status}</Badge> },
];

// A button per row opens a panel under it: the details, without leaving the list.
export default function DataTableDetails() {
  return (
    <DataTable
      caption="Verification requests"
      rows={requests}
      columns={columns}
      getRowId={(r) => r.id}
      rowLabel={(r) => r.creator}
      defaultExpanded={{ "v-1042": true }}
      renderDetail={(r) => <p className="text-sm text-fg-secondary">{r.note}</p>}
    />
  );
}
