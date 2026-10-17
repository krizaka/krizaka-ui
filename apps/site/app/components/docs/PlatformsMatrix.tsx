"use client";

import { DataTable, type DataTableColumn } from "@krizaka/ui/data-table";
import Link from "next/link";

import type { ParityCell } from "@/lib/ui-registry";

import { InlineCode } from "./InlineCode";
import { cellTone, cellWord, type CellWords, issueUrl } from "./platform-cell";

export interface MatrixRow {
  name: string;
  title: string;
  href: string;
  web: ParityCell;
  native: ParityCell;
  desktop: ParityCell;
}

export interface MatrixLabels {
  caption: string;
  component: string;
  web: string;
  native: string;
  desktop: string;
  states: CellWords;
  issue: string;
}

const ORDER = { yes: 0, desktop: 0, gap: 1, "n/a": 2 } as const;

/** One cell: the state as a chip, and — when it is not there — why, the issue that tracks it or what to use instead. */
function Cell({ cell, labels, titleOf }: { cell: ParityCell; labels: MatrixLabels; titleOf: (name: string) => { title: string; href: string } | null }) {
  const use = cell.state === "n/a" && cell.use ? titleOf(cell.use) : null;
  return (
    <span className="kz-parity-cell">
      <span className="kz-chip-meta" data-tone={cellTone(cell)}>
        {cellWord(cell, labels.states)}
      </span>
      {cell.state === "gap" || cell.state === "n/a" ? (
        <span className="kz-parity-why">
          <InlineCode text={cell.reason} />
          {cell.state === "gap" ? (
            <>
              {" "}
              <a href={issueUrl(cell.issue)}>{`${labels.issue} ${cell.issue.split("#")[1] ? `#${cell.issue.split("#")[1]}` : cell.issue}`}</a>
            </>
          ) : null}
          {use ? (
            <>
              {" → "}
              <Link href={use.href}>{use.title}</Link>
            </>
          ) : null}
        </span>
      ) : null}
    </span>
  );
}

/** The parity matrix: every component, web · mobile · desktop, sortable; cards on a phone (DataTable of @krizaka/ui). */
export function PlatformsMatrix({ rows, labels }: { rows: MatrixRow[]; labels: MatrixLabels }) {
  const byName = new Map(rows.map((row) => [row.name, { title: row.title, href: row.href }]));
  const titleOf = (name: string) => byName.get(name) ?? null;
  const column = (id: "web" | "native" | "desktop", header: string): DataTableColumn<MatrixRow> => ({
    id,
    header,
    sortable: true,
    value: (row) => ORDER[row[id].state],
    type: "text",
    cell: (row) => <Cell cell={row[id]} labels={labels} titleOf={titleOf} />,
  });
  const columns: DataTableColumn<MatrixRow>[] = [
    { id: "title", header: labels.component, sortable: true, card: "title", cell: (row) => <Link href={row.href}>{row.title}</Link> },
    column("web", labels.web),
    column("native", labels.native),
    column("desktop", labels.desktop),
  ];
  return <DataTable caption={labels.caption} rows={rows} columns={columns} getRowId={(row) => row.name} rowLabel={(row) => row.title} defaultSort={{ column: "title", direction: "ascending" }} />;
}
