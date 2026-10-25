"use client";

import { Badge } from "@krizaka/ui/badge";
import { DataTable, type DataTableColumn } from "@krizaka/ui/data-table";

type Check = { id: string; document: string; type: string; check: string; when: string; result: keyof typeof tone };
const tone = { Authentic: "success", Review: "warning", Altered: "danger" } as const;
const checks: Check[] = [
  { id: "c1", document: "Bail_2026_Tremblay.pdf", type: "Lease", check: "Authenticity", when: "Oct 23", result: "Authentic" },
  { id: "c2", document: "Facture_Hydro_sept.pdf", type: "Invoice", check: "Authenticity", when: "Oct 22", result: "Review" },
  { id: "c3", document: "Releve_paie_0915.pdf", type: "Pay stub", check: "Income", when: "Oct 21", result: "Altered" },
];
const columns: DataTableColumn<Check>[] = [
  { id: "document", header: "Document", type: "title", href: (c) => `#checks/${c.id}` },
  { id: "type", header: "Type", priority: 2, nowrap: true },
  { id: "when", header: "When", type: "date", priority: 2, cell: (c) => c.when },
  { id: "check", header: "Check" },
  { id: "result", header: "Result", type: "status", cell: (c) => <Badge size="sm" tone={tone[c.result]}>{c.result}</Badge> },
];

// On a phone, each check is a list row: the document (its link), « Lease · Oct 23 », the result at the end.
export default function DataTableChecks() {
  return <DataTable caption="Checks" rows={checks} columns={columns} getRowId={(c) => c.id} rowLabel={(c) => c.document} phone="list" selectable />;
}
