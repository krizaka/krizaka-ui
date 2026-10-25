"use client";

import { Badge } from "@krizaka/ui/badge";
import { DataTable, type DataTableColumn } from "@krizaka/ui/data-table";

type ApplicantFile = { id: string; applicant: string; unit: string; documents: number; updated: string; status: keyof typeof tone };
const tone = { Complete: "success", Missing: "warning", "In review": "accent" } as const;
const files: ApplicantFile[] = [
  { id: "f1", applicant: "Eric Tremblay", unit: "Unit 4B · Demo building", documents: 6, updated: "Today", status: "Complete" },
  { id: "f2", applicant: "Eric (co-applicant)", unit: "Unit 2A · Demo building", documents: 3, updated: "Yesterday", status: "Missing" },
  { id: "f3", applicant: "Demo applicant", unit: "Unit 7C · Sample tower", documents: 5, updated: "Oct 20", status: "In review" },
];
const columns: DataTableColumn<ApplicantFile>[] = [
  { id: "applicant", header: "Applicant", type: "title", subtitle: (f) => f.unit, href: (f) => `#files/${f.id}` },
  { id: "documents", header: "Documents", type: "number", priority: 2, cell: (f) => `${f.documents} documents` },
  { id: "updated", header: "Updated", priority: 2 },
  { id: "status", header: "Status", type: "status", cell: (f) => <Badge size="sm" tone={tone[f.status]}>{f.status}</Badge> },
];

// A landlord's applicant files as list rows on a phone (always, here): the name and unit, one line of facts, the status.
export default function DataTableApplicantFiles() {
  return <DataTable caption="Applicant files" rows={files} columns={columns} getRowId={(f) => f.id} rowLabel={(f) => f.applicant} layout="cards" phone="list" selectable />;
}
