"use client";

import { DataTable, type DataTableColumn, DataTableColumnsMenu, DataTableExport, DataTableFilters } from "@krizaka/ui/data-table";

type Video = { id: string; title: string; creator: string; status: string; views: number };
const videos: Video[] = Array.from({ length: 36 }, (_, i) => ({
  id: `v${i + 1}`,
  title: ["Sunset over Montréal", "Behind the scenes", "Studio tour", "Live Q&A replay"][i % 4]! + ` #${i + 1}`,
  creator: ["Elena Varga", "Noah Petit", "Maya Chen"][i % 3]!,
  status: ["Public", "Followers", "Draft"][i % 3 === 2 ? 2 : i % 2]!,
  views: (i * 7919) % 20_000,
}));
const columns: DataTableColumn<Video>[] = [
  { id: "title", header: "Title", sortable: true, card: "title", filter: "text" },
  { id: "creator", header: "Creator", filter: "facet" },
  { id: "status", header: "Visibility", filter: "facet" },
  { id: "views", header: "Views", sortable: true, align: "end", filter: "range", cell: (v) => v.views.toLocaleString("en") },
];

// A search, facets with their counts, a range, the filters as chips; hide columns, export what is shown.
export default function DataTableFiltersExample() {
  return (
    <DataTable
      caption="Videos"
      rows={videos}
      columns={columns}
      getRowId={(v) => v.id}
      defaultPageSize={8}
      toolbar={
        <div className="flex flex-col gap-3">
          <DataTableFilters />
          <div className="flex justify-end gap-2">
            <DataTableColumnsMenu />
            <DataTableExport filename="videos.csv" />
          </div>
        </div>
      }
    />
  );
}
