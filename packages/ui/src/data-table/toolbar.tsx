// The toolbar of a DataTable — its filters (a FilterBar built from the columns), the columns menu and the CSV export —
// connected to the table they sit in through `useDataTable()`. Words come from the table's `labels`.
import * as React from "react";

import { Button } from "../button";
import { DropdownMenu } from "../dropdown-menu";
import { Input } from "../field";
import { type ActiveFilter, FilterBar, FilterMenu } from "../filter-bar";
import { ChevronGlyph } from "../glyphs";
import { SearchField } from "../search-field";
import { dataTableCsv } from "./csv";
import { type DataTableColumn, useDataTable } from "./data-table";
import type { FilterValue } from "./engine";

export type DataTableFiltersProps = {
  /** The search's wait after the last key, in ms, before the filter applies (a request, in server mode). Default 250. */
  debounce?: number;
  /** More controls in the bar (a date range picker, a toggle). */
  children?: React.ReactNode;
  /** Classes merged on the bar. */
  className?: string;
};

const asRange = (value: FilterValue | undefined): [number | null, number | null] =>
  Array.isArray(value) && value.length === 2 && (typeof value[0] !== "string" || typeof value[1] !== "string") ? [value[0] as number | null, value[1] as number | null] : [null, null];
const asList = (value: FilterValue | undefined): readonly string[] => (Array.isArray(value) ? (value as readonly string[]) : []);
const number = (text: string) => (text.trim() === "" || Number.isNaN(Number(text)) ? null : Number(text));

/**
 * The filters of the table, from its columns: a search per `text` column, a menu of values (with their counts) per
 * `facet` column, two bounds per `range` column; the filters in force as removable chips, "clear all", and the count
 * of results, announced.
 */
export function DataTableFilters({ debounce = 250, children, className }: DataTableFiltersProps) {
  const { table, columns, labels, filters, setFilters, resultCount, manualFiltering } = useDataTable();
  const set = (id: string, value: FilterValue | null) => {
    const next = { ...filters };
    if (value === null || value === "" || (Array.isArray(value) && (value.length === 0 || (value.length === 2 && value[0] == null && value[1] == null)))) delete next[id];
    else next[id] = value;
    setFilters(next);
  };
  const filterable = columns.filter((column) => column.filter);
  const optionsOf = (column: DataTableColumn<object>) => {
    if (column.options) return column.options;
    // The values found in the rows, with their counts — the other filters applied (TanStack's facets).
    const facets = manualFiltering ? new Map<unknown, number>() : (table.getColumn(column.id)?.getFacetedUniqueValues() ?? new Map<unknown, number>());
    return [...facets.entries()]
      .filter(([value]) => value != null && value !== "")
      .map(([value, count]) => ({ value: String(value), label: String(value), count }))
      .sort((a, b) => a.label.localeCompare(b.label, undefined, { numeric: true }));
  };
  const active: ActiveFilter[] = filterable.flatMap((column) => {
    const value = filters[column.id];
    if (value === undefined) return [];
    let text: string;
    if (column.filter === "facet") {
      const options = optionsOf(column);
      text = asList(value).map((v) => options.find((o) => o.value === v)?.label ?? v).join(", ");
    } else if (column.filter === "range") {
      const [min, max] = asRange(value);
      text = `${min ?? "…"}–${max ?? "…"}`;
    } else text = String(value);
    const label = labels.activeFilter(column.header, text);
    return [{ id: column.id, label, onRemove: () => set(column.id, null) }];
  });
  return (
    <FilterBar
      label={labels.filters}
      active={active}
      onClearAll={() => setFilters({})}
      clearLabel={labels.clearFilters}
      removeLabel={labels.removeFilter}
      results={labels.results(resultCount)}
      className={className}
    >
      {filterable.map((column) => {
        if (column.filter === "text")
          return (
            <TextFilter
              key={column.id}
              label={labels.search(column.header)}
              value={typeof filters[column.id] === "string" ? (filters[column.id] as string) : ""}
              debounce={debounce}
              onCommit={(query) => set(column.id, query)}
            />
          );
        if (column.filter === "facet")
          return (
            <FilterMenu key={column.id} label={column.header} options={optionsOf(column)} value={asList(filters[column.id])} onValueChange={(value) => set(column.id, value)} />
          );
        const [min, max] = asRange(filters[column.id]);
        const bounds = manualFiltering ? undefined : table.getColumn(column.id)?.getFacetedMinMaxValues();
        return (
          <span key={column.id} className="inline-flex items-center gap-1.5">
            <Input
              type="number"
              inputMode="decimal"
              aria-label={labels.rangeFrom(column.header)}
              placeholder={bounds ? String(bounds[0]) : labels.rangeFrom(column.header)}
              value={min ?? ""}
              onChange={(event) => set(column.id, [number(event.currentTarget.value), max])}
              className="h-11 w-28"
            />
            <span aria-hidden className="text-fg-secondary">
              –
            </span>
            <Input
              type="number"
              inputMode="decimal"
              aria-label={labels.rangeTo(column.header)}
              placeholder={bounds ? String(bounds[1]) : labels.rangeTo(column.header)}
              value={max ?? ""}
              onChange={(event) => set(column.id, [min, number(event.currentTarget.value)])}
              className="h-11 w-28"
            />
          </span>
        );
      })}
      {children}
    </FilterBar>
  );
}

export type DataTableColumnsMenuProps = {
  /** Opens the menu at first (a story, a test). */
  defaultOpen?: boolean;
  /** Classes merged on the button. */
  className?: string;
};

/** A menu of the `hideable` columns, each a checkbox: the person chooses what the table shows. */
export function DataTableColumnsMenu({ defaultOpen, className }: DataTableColumnsMenuProps) {
  const { table, columns, labels } = useDataTable();
  return (
    <DropdownMenu.Root defaultOpen={defaultOpen} modal={false}>
      <DropdownMenu.Trigger asChild>
        <Button variant="outline" size="sm" className={className}>
          {labels.columns}
          <ChevronGlyph className="h-4 w-4" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" aria-label={labels.columns}>
        {columns
          .filter((column) => column.hideable !== false)
          .map((column) => {
            const instance = table.getColumn(column.id);
            return (
              <DropdownMenu.CheckboxItem
                key={column.id}
                checked={instance?.getIsVisible() ?? true}
                onSelect={(event) => event.preventDefault()}
                onCheckedChange={(checked) => instance?.toggleVisibility(Boolean(checked))}
              >
                {column.header}
              </DropdownMenu.CheckboxItem>
            );
          })}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

export type DataTableExportProps = {
  /** The file's name. Default `"export.csv"`. */
  filename?: string;
  /** Receives the CSV instead of downloading it (send it to the server, a test). */
  onExport?: (csv: string) => void;
  /** Classes merged on the button. */
  className?: string;
};

/** Downloads what the table shows — the filtered and sorted rows of every page, the visible columns — as CSV. */
export function DataTableExport({ filename = "export.csv", onExport, className }: DataTableExportProps) {
  const { table, columns, labels, exportRows } = useDataTable();
  const run = () => {
    const visible = columns.filter((column) => table.getColumn(column.id)?.getIsVisible() !== false);
    const csv = dataTableCsv(exportRows(), visible);
    if (onExport) return onExport(csv);
    const url = URL.createObjectURL(new Blob(["﻿", csv], { type: "text/csv;charset=utf-8" }));
    const link = Object.assign(document.createElement("a"), { href: url, download: filename });
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  };
  return (
    <Button variant="outline" size="sm" className={className} onClick={run}>
      {labels.export}
    </Button>
  );
}

/**
 * A text filter: what is typed stays a draft until the debounce commits it, and a value that changes from outside
 * (back or forward on a `routeKey` table, « Clear all ») replaces the draft — the box always says what filters the rows.
 */
function TextFilter({ label, value, debounce, onCommit }: { label: string; value: string; debounce?: number; onCommit: (query: string) => void }) {
  const [draft, setDraft] = React.useState(value);
  const [seen, setSeen] = React.useState(value);
  const [committed, setCommitted] = React.useState(value);
  if (value !== seen) {
    setSeen(value);
    if (value !== committed) {
      setCommitted(value);
      setDraft(value);
    }
  }
  return (
    <SearchField
      label={label}
      placeholder={label}
      value={draft}
      onValueChange={setDraft}
      debounce={debounce}
      onSearch={(query) => {
        setCommitted(query);
        onCommit(query);
      }}
      landmark={false}
      size="sm"
      className="min-w-48 flex-1"
    />
  );
}
