"use client";

import { Badge } from "@krizaka/ui/badge";
import { DataTable, type DataTableColumn, DataTableFilters } from "@krizaka/ui/data-table";

type Model = { id: string; name: string; maker: string; does: string; where: string; status: string; licence: string; context: number; verified: string };
const L = "https://www.apache.org/licenses/LICENSE-2.0";
const models: Model[] = [
  { id: "black-forest-labs/flux.1-schnell", name: "FLUX.1 schnell", maker: "Black Forest Labs", does: "Image", where: "Local", status: "Default", licence: "Apache-2.0", context: 0, verified: "2026-10-02" },
  { id: "meta-llama/llama-3.3-70b-instruct", name: "Llama 3.3 70B Instruct", maker: "Meta", does: "Chat", where: "Local", status: "Default", licence: "Llama 3.3 Community Licence", context: 131072, verified: "2026-10-09" },
  { id: "anthropic/claude-sonnet", name: "Claude Sonnet", maker: "Anthropic", does: "Chat", where: "Provider", status: "Available", licence: "Provider terms", context: 200000, verified: "2026-10-12" },
  { id: "lightricks/ltx-video", name: "LTX-Video", maker: "Lightricks", does: "Video", where: "Local", status: "Planned", licence: "OpenRAIL-M", context: 0, verified: "" },
];
const tone = { Default: "success", Available: "neutral", Planned: "warning" } as const;
// The model, its capability, where it runs and its status stay in the row; the rest leaves it as the table narrows.
const columns: DataTableColumn<Model>[] = [
  { id: "name", header: "Model", type: "title", sortable: true, filter: "text", subtitle: (m) => m.id },
  { id: "does", header: "Capability", type: "badge", sortable: true, filter: "facet", cell: (m) => <Badge size="sm">{m.does}</Badge> },
  { id: "where", header: "Runs where", type: "badge", filter: "facet", priority: 2, cell: (m) => <Badge size="sm" tone={m.where === "Local" ? "accent" : "neutral"}>{m.where}</Badge> },
  { id: "status", header: "Status", type: "status", sortable: true, filter: "facet", cell: (m) => <Badge size="sm" tone={tone[m.status as keyof typeof tone]}>{m.status}</Badge> },
  { id: "maker", header: "Maker", type: "text", clamp: 1, priority: 3 },
  { id: "licence", header: "Licence", type: "link", priority: 4, href: () => L },
  { id: "context", header: "Context", type: "number", unit: "tokens", priority: 5, value: (m) => m.context, cell: (m) => (m.context ? m.context.toLocaleString("en") : "—") },
  { id: "verified", header: "Verified", type: "date", priority: 5, cell: (m) => m.verified || "never" },
];

// Eight columns, any width, no overflow: the chevron opens what left the row; under 36 rem each row is a card.
export default function DataTableCatalogue() {
  return <DataTable caption="Models" rows={models} columns={columns} getRowId={(m) => m.id} rowLabel={(m) => m.name} density="compact" toolbar={<DataTableFilters />} />;
}
