"use client";

import { DataTable, type DataTableColumn } from "@krizaka/ui/data-table";

type Model = { id: string; name: string; provider: string; input: number; output: number; context: number; latency: number; region: string };
const models: Model[] = [
  { id: "m1", name: "Llama 3.3 70B", provider: "Self-hosted", input: 0.23, output: 0.4, context: 128, latency: 420, region: "eu-west" },
  { id: "m2", name: "Mistral Large", provider: "Mistral", input: 2, output: 6, context: 128, latency: 380, region: "eu-west" },
  { id: "m3", name: "Qwen 2.5 Coder", provider: "Self-hosted", input: 0.12, output: 0.2, context: 32, latency: 210, region: "eu-central" },
];
const usd = (n: number) => `$${n.toFixed(2)}`;
const columns: DataTableColumn<Model>[] = [
  { id: "name", header: "Model", width: 180, card: "title" },
  { id: "provider", header: "Provider", width: 140 },
  { id: "input", header: "Input / 1M", width: 130, align: "end", cell: (m) => usd(m.input) },
  { id: "output", header: "Output / 1M", width: 130, align: "end", cell: (m) => usd(m.output) },
  { id: "context", header: "Context", width: 110, align: "end", cell: (m) => `${m.context}k` },
  { id: "latency", header: "Latency", width: 110, align: "end", cell: (m) => `${m.latency} ms` },
  { id: "region", header: "Region", width: 130 },
];

// A wide table: the name stays at the start while it scrolls sideways; drag (or ← →) a header's edge to resize.
export default function DataTablePinned() {
  return <DataTable caption="Model pricing" rows={models} columns={columns} getRowId={(m) => m.id} pinning={{ start: ["name"] }} resizing layout="table" />;
}
