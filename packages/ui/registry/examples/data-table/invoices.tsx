"use client";

import { Badge } from "@krizaka/ui/badge";
import { DataTable, type DataTableColumn } from "@krizaka/ui/data-table";

type Invoice = { id: string; customer: string; email: string; issued: string; due: string; amount: number; status: keyof typeof tone };
const tone = { Paid: "success", Open: "accent", Overdue: "danger", Draft: "neutral" } as const;
const invoices: Invoice[] = [
  { id: "INV-2026-0143", customer: "Harbour Labs", email: "finance@harbourlabs.example", issued: "2026-10-14", due: "2026-11-13", amount: 2200, status: "Draft" },
  { id: "INV-2026-0142", customer: "Atelier Montréal Inc.", email: "billing@ateliermtl.example", issued: "2026-10-01", due: "2026-10-31", amount: 4280, status: "Open" },
  { id: "INV-2026-0138", customer: "Nord & Fils", email: "ap@nordfils.example", issued: "2026-09-12", due: "2026-10-12", amount: 15900, status: "Overdue" },
  { id: "INV-2026-0137", customer: "Lumen Collective", email: "hello@lumen.example", issued: "2026-09-10", due: "2026-10-10", amount: 640, status: "Paid" },
];
const columns: DataTableColumn<Invoice>[] = [
  { id: "id", header: "Invoice", type: "title", sortable: true, subtitle: (i) => i.customer },
  { id: "status", header: "Status", type: "status", sortable: true, cell: (i) => <Badge size="sm" tone={tone[i.status]}>{i.status}</Badge> },
  { id: "amount", header: "Amount", type: "number", sortable: true, cell: (i) => i.amount.toLocaleString("en", { style: "currency", currency: "USD" }) },
  { id: "due", header: "Due", type: "date", sortable: true, priority: 2 },
  { id: "issued", header: "Issued", type: "date", sortable: true, priority: 3 },
  { id: "email", header: "Billing contact", type: "link", priority: 4, href: (i) => `mailto:${i.email}` },
];

// Number, status and amount always; dates and contact move into the detail as the screen narrows. Sticky header, zebra.
export default function DataTableInvoices() {
  return <DataTable caption="Invoices" rows={invoices} columns={columns} getRowId={(i) => i.id} rowLabel={(i) => i.id} stickyHeader striped defaultSort={{ column: "due", direction: "descending" }} />;
}
