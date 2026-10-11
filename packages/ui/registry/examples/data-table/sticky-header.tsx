"use client";

import { Badge } from "@krizaka/ui/badge";
import { DataTable, type DataTableColumn } from "@krizaka/ui/data-table";

type Run = { id: string; model: string; status: "done" | "running" | "queued"; tokens: number };
const models = ["Llama 3.3 70B", "Mistral Small", "Qwen 2.5 32B", "Whisper large", "Flux 1.1"];
const statuses = ["done", "running", "queued"] as const;
const runs: Run[] = Array.from({ length: 14 }, (_, i) => ({
  id: `run-${7310 + i}`,
  model: models[i % models.length],
  status: statuses[i % 3],
  tokens: 1200 + ((i * 7919) % 48000),
}));
const tone = { done: "success", running: "accent", queued: "neutral" } as const;

const columns: DataTableColumn<Run>[] = [
  { id: "id", header: "Run", card: "title" },
  { id: "model", header: "Model", sortable: true },
  { id: "status", header: "Status", cell: (run) => <Badge tone={tone[run.status]} dot={run.status === "running"} pulse>{run.status}</Badge> },
  { id: "tokens", header: "Tokens", sortable: true, align: "end", cell: (run) => run.tokens.toLocaleString("en") },
];

// `maxHeight`: the body scrolls (and Tab reaches it), the header stays on top in frosted glass; rows light up under the pointer.
export default function DataTableStickyHeader() {
  return <DataTable caption="Inference runs" rows={runs} columns={columns} getRowId={(run) => run.id} layout="table" maxHeight={280} />;
}
