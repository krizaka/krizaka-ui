"use client";
// “View as table”: the chart's data in the kit DataTable, in a side Sheet. Loaded only when it opens (the table engine
// is the heaviest part of the kit).
import { DataTable, type DataTableColumn } from "@krizaka/ui/data-table";
import { Dialog } from "@krizaka/ui/dialog";
import { useMemo } from "react";

import type { ChartLabels } from "../core/labels";
import { fill } from "../core/labels";
import type { TableModel } from "./frame";

type Row = { readonly id: string; readonly cells: readonly string[] };

export default function TableSheet({ title, table, labels, onClose }: { title: string; table: TableModel; labels: ChartLabels; onClose: () => void }) {
  const rows = useMemo<Row[]>(() => table.rows.map((cells, i) => ({ id: String(i), cells })), [table.rows]);
  const columns = useMemo<DataTableColumn<Row>[]>(
    () =>
      table.columns.map((header, i) => ({
        id: `c${i}`,
        header,
        value: (row) => row.cells[i] ?? "",
        cell: (row) => row.cells[i] ?? "",
        align: i === 0 ? "start" : "end",
        type: i === 0 ? "title" : "number",
      })),
    [table.columns],
  );
  return (
    <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
      <Dialog.Content placement="right" size="lg" closeLabel={labels.close}>
        <Dialog.Header>
          <Dialog.Title>{title}</Dialog.Title>
          <Dialog.Description>{fill(labels.tableRows, { count: rows.length })}</Dialog.Description>
        </Dialog.Header>
        <Dialog.Body>
          <DataTable rows={rows} columns={columns} getRowId={(row) => row.id} caption={fill(labels.tableCaption, { title })} />
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
}
