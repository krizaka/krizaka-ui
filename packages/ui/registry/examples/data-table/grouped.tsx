"use client";

import { DataTable, type DataTableColumn } from "@krizaka/ui/data-table";

type Tip = { id: string; creator: string; fan: string; cents: number };
const tips: Tip[] = [
  { id: "t1", creator: "Elena Varga", fan: "marco_v", cents: 500 },
  { id: "t2", creator: "Elena Varga", fan: "ana.lu", cents: 1500 },
  { id: "t3", creator: "Noah Petit", fan: "kenji", cents: 300 },
  { id: "t4", creator: "Maya Chen", fan: "marco_v", cents: 2000 },
  { id: "t5", creator: "Noah Petit", fan: "zoe", cents: 700 },
];
const money = (cents: number) => (cents / 100).toLocaleString("en", { style: "currency", currency: "USD" });
const columns: DataTableColumn<Tip>[] = [
  { id: "creator", header: "Creator", groupable: true, card: "title" },
  { id: "fan", header: "From" },
  { id: "cents", header: "Amount", align: "end", cell: (t) => money(t.cents), aggregate: (rows) => money(rows.reduce((sum, t) => sum + t.cents, 0)) },
];

// Grouped by creator: a row per group with its count and its total, opened to see the tips.
export default function DataTableGrouped() {
  return <DataTable caption="Tips this week" rows={tips} columns={columns} getRowId={(t) => t.id} defaultGroupBy={["creator"]} defaultExpanded={{ "creator:Elena Varga": true }} />;
}
