"use client";

import { Badge } from "@krizaka/ui/badge";
import { DataTable, type DataTableColumn } from "@krizaka/ui/data-table";

type Job = { id: string; name: string; model: string; status: "done" | "running" | "failed"; seconds: number };
const jobs: Job[] = [
  { id: "job-4821", name: "Product shots, autumn", model: "Flux 1.1", status: "done", seconds: 42 },
  { id: "job-4822", name: "Podcast transcript", model: "Whisper large", status: "running", seconds: 318 },
  { id: "job-4823", name: "Trailer voice-over", model: "XTTS v2", status: "failed", seconds: 7 },
  { id: "job-4824", name: "Catalogue summaries", model: "Llama 3.3", status: "done", seconds: 96 },
];
const tone = { done: "success", running: "accent", failed: "danger" } as const;

const columns: DataTableColumn<Job>[] = [
  { id: "name", header: "Job", sortable: true, card: "title" },
  { id: "model", header: "Model", sortable: true },
  { id: "status", header: "Status", cell: (job) => <Badge tone={tone[job.status]}>{job.status}</Badge> },
  { id: "seconds", header: "Duration", sortable: true, align: "end", cell: (job) => `${job.seconds} s` },
];

// Sort by a header, select rows for a bulk action; cards below 36rem of width.
export default function DataTableJobs() {
  return (
    <DataTable
      caption="Jobs"
      rows={jobs}
      columns={columns}
      getRowId={(job) => job.id}
      rowLabel={(job) => job.name}
      defaultSort={{ column: "seconds", direction: "descending" }}
      selectable
      defaultSelected={["job-4823"]}
    />
  );
}
