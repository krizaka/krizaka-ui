// The engine of DataTable: TanStack Table v9 behind the Krizaka facade (ADR-001 — a product imports
// `@krizaka/ui/data-table`, never `@tanstack/*`). The features are registered once, at module scope (stable input),
// and the Krizaka API (`sort`, `filters`, `selected`, `page`… in the app's words) is translated to TanStack's state
// here — nothing else of the component knows TanStack's shapes.
import {
  type Cell,
  type Column,
  type ColumnDef,
  columnFacetingFeature,
  columnFilteringFeature,
  columnGroupingFeature,
  columnPinningFeature,
  columnResizingFeature,
  type columnResizingState as ColumnResizingState,
  columnSizingFeature,
  columnVisibilityFeature,
  createExpandedRowModel,
  createFacetedMinMaxValues,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createGroupedRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  type FilterFn,
  type ReactTable,
  type Row,
  type RowData,
  rowExpandingFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  type SortFn,
  tableFeatures,
} from "@tanstack/react-table";

export const features = tableFeatures({
  columnFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  columnFacetingFeature,
  facetedRowModel: createFacetedRowModel(),
  facetedUniqueValues: createFacetedUniqueValues(),
  facetedMinMaxValues: createFacetedMinMaxValues(),
  columnGroupingFeature,
  groupedRowModel: createGroupedRowModel(),
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  rowExpandingFeature,
  expandedRowModel: createExpandedRowModel(),
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
  rowSelectionFeature,
  columnVisibilityFeature,
  columnPinningFeature,
  columnSizingFeature,
  columnResizingFeature,
});

export type Features = typeof features;
/** The TanStack Table instance behind a DataTable — the escape hatch of `useDataTable()`. */
export type DataTableInstance<T extends RowData> = ReactTable<Features, T>;
export type TableRow<T extends RowData> = Row<Features, T>;
export type TableCell<T extends RowData> = Cell<Features, T, unknown>;
export type TableColumn<T extends RowData> = Column<Features, T, unknown>;

/** What a cell holds for sorting, filtering and the CSV export: a string, a number, a date, a boolean, or nothing. */
export type CellValue = string | number | boolean | Date | null | undefined;

/** A filter's value: a text (`text`), the values chosen (`facet`), or bounds, either open (`range`). */
export type FilterValue = string | readonly string[] | readonly [number | null, number | null];
/** The filters in force, by column id. */
export type DataTableFilterState = Readonly<Record<string, FilterValue>>;

const empty = (value: CellValue) => value == null || value === "";

/** The order of two values: empty last, dates and numbers by value, text in natural order ("item 2" < "item 10"). */
export function compareValues(a: CellValue, b: CellValue): number {
  if (empty(a)) return empty(b) ? 0 : 1;
  if (empty(b)) return -1;
  if (a instanceof Date || b instanceof Date) return Number(a) - Number(b);
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: "base" });
}

export const sortByValue: SortFn<Features, never> = (a, b, id) => compareValues(a.getValue(id) as CellValue, b.getValue(id) as CellValue);

/** A text filter: the value contains the words, case and accents ignored. */
export const filterText: FilterFn<Features, never> = (row, id, query: string) =>
  String(row.getValue(id) ?? "")
    .normalize("NFD")
    .toLocaleLowerCase()
    .includes(query.normalize("NFD").toLocaleLowerCase().trim());
filterText.autoRemove = (value: unknown) => typeof value !== "string" || value.trim() === "";

/** A facet filter: the value is one of those chosen. */
export const filterFacet: FilterFn<Features, never> = (row, id, chosen: readonly string[]) => chosen.includes(String(row.getValue(id) ?? ""));
filterFacet.autoRemove = (value: unknown) => !Array.isArray(value) || value.length === 0;

/** A range filter: the value (a number or a date) lies within the bounds, either of which may be open. */
export const filterRange: FilterFn<Features, never> = (row, id, [min, max]: readonly [number | null, number | null]) => {
  const raw = row.getValue(id) as CellValue;
  if (empty(raw)) return false;
  const value = Number(raw);
  return (min == null || value >= min) && (max == null || value <= max);
};
filterRange.autoRemove = (value: unknown) => !Array.isArray(value) || (value[0] == null && value[1] == null);

export const FILTERS = { text: filterText, facet: filterFacet, range: filterRange } as const;

export type { ColumnDef, ColumnResizingState, RowData };
