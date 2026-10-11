"use client";

import { DataTable, type DataTableColumn } from "@krizaka/ui/data-table";

type Video = { id: string; title: string; views: number; tips: string; visibility: string };
const videos: Video[] = [
  { id: "v1", title: "Sunset over Montréal", views: 12840, tips: "$184.00", visibility: "Public" },
  { id: "v2", title: "Behind the scenes, part 2", views: 3120, tips: "$62.50", visibility: "Followers" },
];
const columns: DataTableColumn<Video>[] = [
  { id: "title", header: "Title", card: "title" },
  { id: "visibility", header: "Visibility" },
  { id: "views", header: "Views", align: "end", cell: (v) => v.views.toLocaleString("en") },
  { id: "tips", header: "Tips", align: "end" },
];

// A studio's videos on a phone: one card per row, the title on top, every value labelled.
export default function DataTableCards() {
  return <DataTable caption="Your videos" rows={videos} columns={columns} getRowId={(v) => v.id} layout="cards" />;
}
