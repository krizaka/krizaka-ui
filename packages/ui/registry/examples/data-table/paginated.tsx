"use client";

import { DataTable, type DataTableColumn } from "@krizaka/ui/data-table";

type Invoice = { id: string; customer: string; issued: string; total: number };
const invoices: Invoice[] = Array.from({ length: 87 }, (_, i) => ({
  id: `INV-2026-${String(i + 1).padStart(4, "0")}`,
  customer: ["Atelier Lumen", "Northwind Studio", "Café Brûlé", "Kite & Co"][i % 4]!,
  issued: `2026-${String(1 + (i % 9)).padStart(2, "0")}-${String(1 + (i % 27)).padStart(2, "0")}`,
  total: ((i * 4111) % 120_000) / 100,
}));
const columns: DataTableColumn<Invoice>[] = [
  { id: "id", header: "Invoice", sortable: true, card: "title" },
  { id: "customer", header: "Customer", sortable: true },
  { id: "issued", header: "Issued", sortable: true },
  { id: "total", header: "Total", sortable: true, align: "end", cell: (r) => `€${r.total.toFixed(2)}` },
];

// Pages in the browser: the pagination under the table, the rows per page to choose; a sort goes back to page 1.
export default function DataTablePaginated() {
  return <DataTable caption="Invoices" rows={invoices} columns={columns} getRowId={(r) => r.id} defaultPageSize={10} pageSizeOptions={[10, 25, 50]} />;
}
