"use client";

import { DataTable, type DataTableColumn } from "@krizaka/ui/data-table";

type Event = { id: string; kind: string; at: string };
const events: Event[] = Array.from({ length: 5000 }, (_, i) => ({
  id: `evt-${i + 1}`,
  kind: ["view", "tip", "follow", "comment"][i % 4]!,
  at: `2026-10-${String(1 + (i % 11)).padStart(2, "0")} ${String(i % 24).padStart(2, "0")}:00`,
}));
const columns: DataTableColumn<Event>[] = [
  { id: "id", header: "Event", sortable: true },
  { id: "kind", header: "Kind", sortable: true },
  { id: "at", header: "At", align: "end" },
];

// 5,000 rows, ~20 rendered: the body scrolls, the header stays.
export default function DataTableVirtualized() {
  return <DataTable caption="Events" rows={events} columns={columns} getRowId={(e) => e.id} virtualize={{ rowHeight: 44, height: 320 }} density="compact" />;
}
