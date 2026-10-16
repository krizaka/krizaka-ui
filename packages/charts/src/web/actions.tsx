"use client";
// The actions menu (⋯) of a chart, built from the kit: @krizaka/ui's DropdownMenu and IconButton. Loaded by the frame
// once the chart is in the browser (its own chunk): View as table (a Sheet holding the kit DataTable, loaded when it
// opens), Download CSV / PNG / SVG, Copy data. The accessible table stays in the page whether this is used or not.
import { IconButton } from "@krizaka/ui/button";
import { DropdownMenu } from "@krizaka/ui/dropdown-menu";
import { lazy, type ReactNode, Suspense, useState } from "react";

import type { ChartLabels } from "../core/labels";
import type { ExportFormat, TableModel } from "./frame";

const TableSheet = lazy(() => import("./table-sheet"));

export interface ChartActionsProps {
  readonly title: string;
  readonly table: TableModel;
  readonly labels: ChartLabels;
  /** Entries to offer, in this order. */
  readonly formats: readonly ExportFormat[];
  readonly viewTable: boolean;
  readonly onExport: (format: ExportFormat) => void;
  readonly onCopy: () => void;
}

const icon = (d: string) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={d} />
  </svg>
);
const ICONS = {
  table: "M3 5h18v14H3zM3 10h18M9 5v14",
  download: "M12 3v12M7 10l5 5 5-5M5 21h14",
  copy: "M9 9h11v11H9zM5 15V4h11",
} as const;

export default function ChartActions({ title, table, labels, formats, viewTable, onExport, onCopy }: ChartActionsProps) {
  const [sheet, setSheet] = useState(false);
  const entry: Record<ExportFormat, string> = { csv: labels.downloadCsv, png: labels.downloadPng, svg: labels.downloadSvg };
  let sheetNode: ReactNode = null;
  if (sheet) {
    sheetNode = (
      <Suspense fallback={null}>
        <TableSheet title={title} table={table} labels={labels} onClose={() => setSheet(false)} />
      </Suspense>
    );
  }
  return (
    <>
      <DropdownMenu.Root modal={false}>
        <DropdownMenu.Trigger asChild>
          <IconButton label={`${labels.actions} — ${title}`} variant="ghost" size="icon" className="kzc-more" data-testid="kzc-actions">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <circle cx="5" cy="12" r="1.8" />
              <circle cx="12" cy="12" r="1.8" />
              <circle cx="19" cy="12" r="1.8" />
            </svg>
          </IconButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end">
          {viewTable && (
            <DropdownMenu.Item onSelect={() => setSheet(true)}>
              {icon(ICONS.table)}
              {labels.viewTable}
            </DropdownMenu.Item>
          )}
          {viewTable && formats.length > 0 && <DropdownMenu.Separator />}
          {formats.map((format) => (
            <DropdownMenu.Item key={format} onSelect={() => onExport(format)}>
              {icon(ICONS.download)}
              {entry[format]}
            </DropdownMenu.Item>
          ))}
          <DropdownMenu.Separator />
          <DropdownMenu.Item onSelect={onCopy}>
            {icon(ICONS.copy)}
            {labels.copyData}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
      {sheetNode}
    </>
  );
}
