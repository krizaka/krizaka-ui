"use client";

import { Badge } from "@krizaka/ui/badge";
import { DataTable, type DataTableColumn, DataTableColumnsMenu, DataTableExport, DataTableFilters } from "@krizaka/ui/data-table";

type Run = { id: string; pack: string; model: string; worker: string; status: keyof typeof tone; seconds: number; started: string; error?: string };
const tone = { succeeded: "success", running: "accent", failed: "danger", queued: "neutral" } as const;
const runs: Run[] = [
  { id: "run_9f2c41ab", pack: "video.short", model: "ltx-video", worker: "-", status: "queued", seconds: 0, started: "2026-10-15 09:18" },
  { id: "run_9f2c41a8", pack: "audio.transcribe", model: "whisper-large-v3", worker: "gpu-lyon-01", status: "running", seconds: 318, started: "2026-10-15 09:16" },
  { id: "run_9f2c41a9", pack: "voice.clone", model: "xtts-v2", worker: "gpu-lyon-02", status: "failed", seconds: 7, started: "2026-10-15 09:02", error: "Out of memory (24 GB)" },
  { id: "run_9f2c41aa", pack: "chat.summarise", model: "llama-3.3-70b-instruct", worker: "cpu-mtl-04", status: "succeeded", seconds: 96, started: "2026-10-15 08:51" },
];
const columns: DataTableColumn<Run>[] = [
  { id: "pack", header: "Run", type: "title", sortable: true, filter: "text", subtitle: (r) => r.id },
  { id: "status", header: "Status", type: "status", sortable: true, filter: "facet", cell: (r) => <Badge size="sm" tone={tone[r.status]}>{r.status}</Badge> },
  { id: "seconds", header: "Duration", type: "number", unit: "s", sortable: true, filter: "range" },
  { id: "model", header: "Model", type: "text", clamp: 1, priority: 2 },
  { id: "worker", header: "Worker", type: "text", clamp: 1, priority: 3 },
  { id: "started", header: "Started", type: "date", sortable: true, priority: 4 },
  { id: "error", header: "Error", type: "text", priority: 5, cell: (r) => r.error ?? "—" },
];
const bar = <div className="flex flex-col gap-3"><DataTableFilters /><div className="flex gap-2"><DataTableColumnsMenu /><DataTableExport filename="runs.csv" /></div></div>;

// An admin console: filters, columns menu and CSV export in the toolbar; selection; the error in the detail.
export default function DataTableRuns() {
  return <DataTable caption="Runs" rows={runs} columns={columns} getRowId={(r) => r.id} rowLabel={(r) => r.id} selectable density="compact" stickyHeader toolbar={bar} />;
}
