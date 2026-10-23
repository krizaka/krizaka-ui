// Client (the table's state, the windowing of long lists). A real `<table>` with a caption and column headers
// (`scope="col"`, `aria-sort` on the sorted one) that turns into a stack of cards in a narrow container — one DOM, the
// roles written out so that the change of `display` never loses the table's semantics. The engine is TanStack Table v9
// (engine.ts): sorting, filters and facets, grouping, expanding, pagination, selection, visibility, pinning, resizing —
// in the browser, or on the server (`manual` + `onStateChange`). Long lists render by what is in view (`virtualized`).
import { useTable } from "@tanstack/react-table";
import * as React from "react";
import { tv } from "tailwind-variants";

import { Checkbox } from "../checkbox";
import { cn } from "../cn";
import { ChevronGlyph, SortGlyph } from "../glyphs";
import { useControllable } from "../media";
import { Pagination, type PaginationLabels } from "../pagination";
import { useLayoutFallbacks, useVirtualizer } from "../virtual/virtual";
import {
  type CellValue,
  type ColumnDef,
  type ColumnResizingState,
  type DataTableFilterState,
  type DataTableInstance,
  features,
  FILTERS,
  type FilterValue,
  type RowData,
  sortByValue,
  type TableCell,
  type TableColumn,
  type TableRow,
} from "./engine";

export const dataTable = tv({
  slots: {
    root: "@container w-full overflow-clip rounded-xl border border-border-default bg-surface-1",
    toolbar: "border-b border-border-default p-3",
    scroller: "w-full overflow-x-auto",
    table: "w-full border-collapse text-left text-sm text-fg",
    caption: "px-4 pt-4 pb-2 text-left text-sm font-semibold text-fg",
    thead: "bg-surface-2/60",
    headRow: "border-b border-border-default",
    th: "relative whitespace-nowrap px-4 py-3 text-xs font-semibold text-fg-secondary",
    sortButton:
      "-mx-1.5 inline-flex items-center gap-1 rounded-md px-1.5 py-1 hover:bg-surface-3 hover:text-fg " +
      "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring aria-[pressed=true]:text-fg",
    resizer:
      "absolute top-0 right-0 h-full w-1.5 cursor-col-resize touch-none select-none bg-transparent hover:bg-border-strong " +
      "focus-visible:bg-accent focus-visible:outline-hidden data-[resizing]:bg-accent",
    tbody: "",
    tr: "border-b border-border-subtle transition-colors last:border-b-0 hover:bg-surface-2/50 data-[state=selected]:bg-accent-soft",
    groupRow: "bg-surface-2/40 font-semibold",
    td: "px-4 py-3 align-middle",
    select: "w-10",
    expander: "w-10",
    toggle:
      "inline-flex h-7 min-w-7 items-center justify-center gap-1.5 rounded-md text-fg-secondary hover:bg-surface-3 hover:text-fg " +
      "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring [&[aria-expanded=true]>svg]:rotate-90 [&>svg]:transition-transform motion-reduce:[&>svg]:transition-none",
    detail: "bg-surface-0 px-4 py-4",
    message: "px-4 py-10 text-center text-sm text-fg-secondary",
    skeleton: "h-4 w-full max-w-40 animate-pulse rounded bg-surface-3 motion-reduce:animate-none",
    footer: "border-t border-border-default px-4 py-3",
  },
  variants: {
    layout: {
      table: {
        th: "data-[pin]:sticky data-[pin]:z-[2] data-[pin]:bg-surface-2 data-[pin=start]:left-(--dt-pin) data-[pin=end]:right-(--dt-pin)",
        td: "data-[pin]:sticky data-[pin]:z-[1] data-[pin]:bg-surface-1 data-[pin=start]:left-(--dt-pin) data-[pin=end]:right-(--dt-pin)",
      },
      // Below 36rem of container: cards. The sortable headers stay, as a row of sort buttons above the cards.
      auto: {
        table: "@max-xl:block",
        caption: "@max-xl:block",
        thead: "@max-xl:sr-only @max-xl:bg-transparent @max-xl:has-[[data-keep]]:not-sr-only @max-xl:has-[[data-keep]]:block",
        headRow: "@max-xl:flex @max-xl:flex-wrap @max-xl:items-center @max-xl:gap-2 @max-xl:px-3 @max-xl:py-2",
        th:
          "@max-xl:sr-only @max-xl:data-[keep]:not-sr-only @max-xl:data-[keep]:block @max-xl:p-0 " +
          "@xl:data-[pin]:sticky @xl:data-[pin]:z-[2] @xl:data-[pin]:bg-surface-2 @xl:data-[pin=start]:left-(--dt-pin) @xl:data-[pin=end]:right-(--dt-pin)",
        tbody: "@max-xl:grid @max-xl:gap-3 @max-xl:p-3",
        tr: "@max-xl:relative @max-xl:grid @max-xl:gap-1.5 @max-xl:rounded-xl @max-xl:border @max-xl:border-border-default @max-xl:bg-surface-0 @max-xl:p-4 @max-xl:last:border-b",
        td:
          "@max-xl:flex @max-xl:min-w-0 @max-xl:items-baseline @max-xl:justify-between @max-xl:gap-4 @max-xl:p-0 @max-xl:text-right @max-xl:[overflow-wrap:anywhere] " +
          "@max-xl:before:shrink-0 @max-xl:before:text-xs @max-xl:before:font-semibold @max-xl:before:text-fg-secondary @max-xl:before:content-[attr(data-label)] " +
          "@max-xl:data-[card=title]:order-first @max-xl:data-[card=title]:pr-8 @max-xl:data-[card=title]:text-left @max-xl:data-[card=title]:text-base @max-xl:data-[card=title]:font-semibold @max-xl:data-[card=title]:before:content-none " +
          "@max-xl:data-[card=hidden]:hidden @max-xl:data-[card=message]:block @max-xl:data-[card=message]:text-center @max-xl:data-[card=message]:before:content-none " +
          "@xl:data-[pin]:sticky @xl:data-[pin]:z-[1] @xl:data-[pin]:bg-surface-1 @xl:data-[pin=start]:left-(--dt-pin) @xl:data-[pin=end]:right-(--dt-pin)",
        select: "@max-xl:absolute @max-xl:right-3 @max-xl:top-3 @max-xl:w-auto @max-xl:before:content-none",
        expander: "@max-xl:before:content-none",
      },
      cards: {
        table: "block",
        caption: "block",
        thead: "sr-only bg-transparent has-[[data-keep]]:not-sr-only has-[[data-keep]]:block",
        headRow: "flex flex-wrap items-center gap-2 px-3 py-2",
        th: "sr-only p-0 data-[keep]:not-sr-only data-[keep]:block",
        tbody: "grid gap-3 p-3",
        tr: "relative grid gap-1.5 rounded-xl border border-border-default bg-surface-0 p-4 last:border-b",
        td:
          "flex min-w-0 items-baseline justify-between gap-4 p-0 text-right [overflow-wrap:anywhere] before:shrink-0 before:text-xs before:font-semibold before:text-fg-secondary before:content-[attr(data-label)] " +
          "data-[card=title]:order-first data-[card=title]:pr-8 data-[card=title]:text-left data-[card=title]:text-base data-[card=title]:font-semibold data-[card=title]:before:content-none " +
          "data-[card=hidden]:hidden data-[card=message]:block data-[card=message]:text-center data-[card=message]:before:content-none",
        select: "absolute right-3 top-3 w-auto before:content-none",
        expander: "before:content-none",
      },
    },
    density: {
      comfortable: {},
      compact: { th: "py-2", td: "py-1.5" },
    },
    // The header stays in view while the page scrolls (table layouts only; `--dt-top` clears a fixed bar).
    sticky: { true: {}, false: {} },
    // Zebra rows (the table layouts); the cards keep their frame.
    striped: { true: {}, false: {} },
    // Typed columns: one height per row (`typed`); untyped tables keep the height of their content.
    typed: { true: {}, false: {} },
  },
  compoundVariants: [
    { layout: "table", sticky: true, class: { th: "sticky top-(--dt-top,0px) z-[3] bg-surface-2" } },
    { layout: "auto", sticky: true, class: { th: "@xl:sticky @xl:top-(--dt-top,0px) @xl:z-[3] @xl:bg-surface-2" } },
    { layout: "table", striped: true, class: { tr: "even:bg-surface-2/40" } },
    { layout: "auto", striped: true, class: { tr: "@xl:even:bg-surface-2/40" } },
    // One row height per density (a two-line row — a name and its id — is the tallest).
    { layout: "table", density: "comfortable", typed: true, class: { td: "h-15" } },
    { layout: "auto", density: "comfortable", typed: true, class: { td: "@xl:h-15" } },
    { layout: "table", density: "compact", typed: true, class: { td: "h-12" } },
    { layout: "auto", density: "compact", typed: true, class: { td: "@xl:h-12" } },
  ],
  defaultVariants: { layout: "auto", density: "comfortable", sticky: false, striped: false, typed: false },
});

// Column priorities. `priority: 1` (default) is always in the row; a higher number leaves the row when the table's own
// width (a container query, not the window's) falls under its tier and goes to the row's detail — the same
// `@container` that turns the table into cards. Written out in full: Tailwind finds a class only as a whole string.
//   priority 2 → 42rem · 3 → 48rem · 4 → 56rem · 5 → 64rem · 6 → 72rem · 7 → 80rem
// On the cards (under 36rem), priority 2 stays on the card's face and 3+ go to its detail.
type Priority = 2 | 3 | 4 | 5 | 6 | 7;
type ByLayout = { auto: Record<Priority, string>; table: Record<Priority, string>; cards: Record<Priority, string> };
const NO_CLASS: Record<Priority, string> = { 2: "", 3: "", 4: "", 5: "", 6: "", 7: "" };
/** The cell of a column that leaves the row. */
const LEAVES: ByLayout = {
  auto: { 2: "@xl:@max-2xl:hidden!", 3: "@max-3xl:hidden!", 4: "@max-4xl:hidden!", 5: "@max-5xl:hidden!", 6: "@max-6xl:hidden!", 7: "@max-7xl:hidden!" },
  table: { 2: "@max-2xl:hidden!", 3: "@max-3xl:hidden!", 4: "@max-4xl:hidden!", 5: "@max-5xl:hidden!", 6: "@max-6xl:hidden!", 7: "@max-7xl:hidden!" },
  cards: { 2: "", 3: "hidden!", 4: "hidden!", 5: "hidden!", 6: "hidden!", 7: "hidden!" },
};
/** Its header (the cards keep the sort buttons). */
const LEAVES_HEAD: ByLayout = {
  auto: { 2: "@xl:@max-2xl:hidden!", 3: "@xl:@max-3xl:hidden!", 4: "@xl:@max-4xl:hidden!", 5: "@xl:@max-5xl:hidden!", 6: "@xl:@max-6xl:hidden!", 7: "@xl:@max-7xl:hidden!" },
  table: LEAVES.table,
  cards: NO_CLASS,
};
/** Its line in the row's detail: shown exactly when the cell is not. */
const IN_DETAIL: ByLayout = {
  auto: { 2: "hidden @xl:@max-2xl:grid", 3: "hidden @max-3xl:grid", 4: "hidden @max-4xl:grid", 5: "hidden @max-5xl:grid", 6: "hidden @max-6xl:grid", 7: "hidden @max-7xl:grid" },
  table: { 2: "hidden @max-2xl:grid", 3: "hidden @max-3xl:grid", 4: "hidden @max-4xl:grid", 5: "hidden @max-5xl:grid", 6: "hidden @max-6xl:grid", 7: "hidden @max-7xl:grid" },
  cards: { 2: "hidden", 3: "grid", 4: "grid", 5: "grid", 6: "grid", 7: "grid" },
};
/** The button that opens the detail, and its panel, keyed by the highest priority of the table: seen only when something left the row. */
const TOGGLE: ByLayout = {
  auto: { 2: "hidden @xl:@max-2xl:inline-flex", 3: "hidden @max-3xl:inline-flex", 4: "hidden @max-4xl:inline-flex", 5: "hidden @max-5xl:inline-flex", 6: "hidden @max-6xl:inline-flex", 7: "hidden @max-7xl:inline-flex" },
  table: { 2: "hidden @max-2xl:inline-flex", 3: "hidden @max-3xl:inline-flex", 4: "hidden @max-4xl:inline-flex", 5: "hidden @max-5xl:inline-flex", 6: "hidden @max-6xl:inline-flex", 7: "hidden @max-7xl:inline-flex" },
  cards: { 2: "hidden", 3: "inline-flex", 4: "inline-flex", 5: "inline-flex", 6: "inline-flex", 7: "inline-flex" },
};
const PANEL: ByLayout = {
  auto: { 2: "hidden @xl:@max-2xl:block", 3: "hidden @max-3xl:block", 4: "hidden @max-4xl:block", 5: "hidden @max-5xl:block", 6: "hidden @max-6xl:block", 7: "hidden @max-7xl:block" },
  table: { 2: "hidden @max-2xl:block", 3: "hidden @max-3xl:block", 4: "hidden @max-4xl:block", 5: "hidden @max-5xl:block", 6: "hidden @max-6xl:block", 7: "hidden @max-7xl:block" },
  cards: { 2: "hidden", 3: "block", 4: "block", 5: "block", 6: "block", 7: "block" },
};

export type DataTableColumnType = "title" | "badge" | "number" | "link" | "date" | "status" | "text";

// What each type does to its cell. Sizes apply to the table layouts only (a card is not a column).
//  title: the column that takes the slack, truncated, full value on hover · badge, status, number, date: as wide as
//  their content, never stretched · link: truncated · text: wraps, two lines.
const TYPE_CELL: Record<DataTableColumnType, ByLayoutString> = {
  title: { auto: "@xl:w-full @xl:max-w-0 @xl:min-w-44", table: "w-full max-w-0 min-w-44", cards: "" },
  badge: { auto: "@xl:w-px", table: "w-px", cards: "" },
  status: { auto: "@xl:w-px @xl:whitespace-nowrap", table: "w-px whitespace-nowrap", cards: "" },
  number: { auto: "@xl:w-px @xl:whitespace-nowrap tabular-nums", table: "w-px whitespace-nowrap tabular-nums", cards: "tabular-nums" },
  date: { auto: "@xl:w-px @xl:whitespace-nowrap tabular-nums", table: "w-px whitespace-nowrap tabular-nums", cards: "tabular-nums" },
  link: { auto: "@xl:min-w-28 @xl:max-w-56", table: "min-w-28 max-w-56", cards: "" },
  text: { auto: "@xl:min-w-36", table: "min-w-36", cards: "" },
};
type ByLayoutString = { auto: string; table: string; cards: string };
const CLAMP = { 1: "line-clamp-1", 2: "line-clamp-2", 3: "line-clamp-3" } as const;

export type SortDirection = "ascending" | "descending";
export type DataTableSort = { column: string; direction: SortDirection } | null;

/** What the server needs to fetch a page (`manual` mode): given to `onStateChange` at each change. */
export type DataTableQuery = {
  /** The sorted column, or `null`. */
  sort: DataTableSort;
  /** The filters in force, by column id. */
  filters: DataTableFilterState;
  /** The page, from 1 (1 without pagination). */
  page: number;
  /** Rows per page (`Infinity` without pagination). */
  pageSize: number;
};

export type DataTableColumn<T> = {
  /** A key of the column (and of the row, for the default value). */
  id: string;
  /** The column's name, passed translated: the header, the label of the value in a card, the filter's name. */
  header: string;
  /** What a cell shows. Default: the value as text. */
  cell?: (row: T) => React.ReactNode;
  /** The value sorted, filtered, grouped and exported. Default `row[id]`. */
  value?: (row: T) => CellValue;
  /** The header becomes a sort button (ascending → descending → none). */
  sortable?: boolean;
  /** How `DataTableFilters` filters it: `text` (a search), `facet` (values to choose), `range` (numbers between bounds). */
  filter?: "text" | "facet" | "range";
  /** The choices of a `facet` filter, with their words (and counts from the server). Default: the values found in the rows. */
  options?: readonly { value: string; label: string; count?: number }[];
  /** The rows can be grouped by this column (`groupBy`). */
  groupable?: boolean;
  /** What a group's row shows in this column, from the group's rows (a sum, a count). */
  aggregate?: (rows: readonly T[]) => React.ReactNode;
  /** Text alignment: `end` for amounts and counts. */
  align?: "start" | "center" | "end";
  /** The width, in px (the starting width when `resizing`). */
  width?: number;
  /** The narrowest the column may be, in px (also what a resized one may shrink to). Default 64. */
  minWidth?: number;
  /** In a card: `title` (the heading of the card), `label` (default: "Header  value"), `hidden`. */
  card?: "title" | "label" | "hidden";
  /** Hides the header visually (an actions column), keeping it for screen readers. */
  headerHidden?: boolean;
  /** Listed in `DataTableColumnsMenu`, so a person can hide it. Default `true`. */
  hideable?: boolean;
  /**
   * What the column holds, which sizes and aligns it: `title` (the name, takes the slack, truncated, `subtitle` under it in
   * mono — and the card's heading), `badge` · `status` (as wide as the badge, never stretched), `number` (end-aligned,
   * tabular), `date`, `link` (truncated, `href`), `text` (wraps, two lines). Untyped: as before.
   */
  type?: DataTableColumnType;
  /**
   * 1 (default) always in the row; 2 to 7 leave it when the table is narrower than 42 · 48 · 56 · 64 · 72 · 80 rem and
   * go to the row's detail (a chevron opens it); under 36 rem (cards) 2 stays on the card, 3+ go to its detail.
   */
  priority?: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  /** `title`: the line under the name (an id), in mono. */
  subtitle?: (row: T) => React.ReactNode;
  /** `link`: where the value leads. */
  href?: (row: T) => string | undefined;
  /** `number`: the unit after the value (muted). */
  unit?: string;
  /** The widest the column may be in the table layouts, in px; longer text is clamped, the full value on hover. */
  maxWidth?: number;
  /** One line only, truncated (the full value on hover). */
  nowrap?: boolean;
  /** Lines of text kept before the ellipsis (default 2 for `text`). */
  clamp?: 1 | 2 | 3;
};

export type DataTableLabels = {
  /** The checkbox of the header ("Select all rows"). */
  selectAll: string;
  /** The checkbox of a row: `(name) => "Select " + name`, the name from `rowLabel`. */
  selectRow: (name: string) => string;
  /** Read while the rows load ("Loading"). */
  loading: string;
  /** The default empty state ("Nothing to show"). */
  empty: string;
  /** The header of the column of the expand buttons, for screen readers ("Details"). */
  details: string;
  /** The button that opens a row: `(name) => "Show details of " + name`. */
  expandRow: (name: string) => string;
  /** The button of a group's row: `(value, count) => value + ", " + count + " rows"`. */
  group: (value: string, count: number) => string;
  /** The handle that resizes a column: `(header) => "Resize " + header`. */
  resize: (header: string) => string;
  /** The count of results under the filters: `(count) => count + " rows"`. */
  results: (count: number) => string;
  /** The accessible name of the filters' bar ("Filter the table"). */
  filters: string;
  /** "Clear filters". */
  clearFilters: string;
  /** A filter's chip remove button: `(label) => "Remove " + label`. */
  removeFilter: (label: string) => string;
  /** The words of a filter in force: `(header, value) => header + ": " + value`. */
  activeFilter: (header: string, value: string) => string;
  /** A `text` filter's field: `(header) => "Search " + header`. */
  search: (header: string) => string;
  /** The lower bound of a `range` filter: `(header) => header + " from"`. */
  rangeFrom: (header: string) => string;
  /** The upper bound of a `range` filter: `(header) => header + " to"`. */
  rangeTo: (header: string) => string;
  /** The button of the columns menu ("Columns"). */
  columns: string;
  /** The button that opens what left the row: `(name) => "Show more about " + name`. */
  showMore: (name: string) => string;
  /** The export button ("Export CSV"). */
  export: string;
  /** The words of the pagination under the table. */
  pagination?: Partial<PaginationLabels>;
};

export const dataTableLabels: DataTableLabels = {
  selectAll: "Select all rows",
  selectRow: (name) => `Select ${name}`,
  loading: "Loading",
  empty: "Nothing to show",
  details: "Details",
  expandRow: (name) => `Show details of ${name}`,
  group: (value, count) => `${value}, ${count} ${count === 1 ? "row" : "rows"}`,
  resize: (header) => `Resize ${header}`,
  results: (count) => `${count.toLocaleString("en")} ${count === 1 ? "row" : "rows"}`,
  filters: "Filter the table",
  clearFilters: "Clear filters",
  removeFilter: (label) => `Remove ${label}`,
  activeFilter: (header, value) => `${header}: ${value}`,
  search: (header) => `Search ${header.toLocaleLowerCase()}`,
  rangeFrom: (header) => `${header} from`,
  rangeTo: (header) => `${header} to`,
  columns: "Columns",
  showMore: (name) => `Show more about ${name}`,
  export: "Export CSV",
};

export type DataTableProps<T> = {
  /** The rows (stable: module scope, state or a query's data). Sorted, filtered and paginated here unless `manual`. */
  rows: readonly T[];
  /** The columns, in order (stable: module scope or `useMemo`). */
  columns: readonly DataTableColumn<T>[];
  /** A stable id per row: the React key, the selection's value, the expansion's key. */
  getRowId: (row: T) => string;
  /** What the table lists ("Jobs", "Your videos"): its `<caption>`, hidden unless `showCaption`. */
  caption: string;
  /** Shows the caption above the table. */
  showCaption?: boolean;

  /** The sorted column (controlled), `null` for none. */
  sort?: DataTableSort;
  /** The sort at first, uncontrolled. */
  defaultSort?: DataTableSort;
  /** Called when a header asks for a new sort. */
  onSortChange?: (sort: DataTableSort) => void;

  /** The filters in force (controlled), by column id — what `DataTableFilters` edits. */
  filters?: DataTableFilterState;
  /** The filters at first, uncontrolled. */
  defaultFilters?: DataTableFilterState;
  /** Called with the new filters. */
  onFiltersChange?: (filters: DataTableFilterState) => void;

  /** Adds a checkbox per row and one in the header. */
  selectable?: boolean;
  /** The ids selected (controlled). */
  selected?: readonly string[];
  /** The ids selected at first, uncontrolled. */
  defaultSelected?: readonly string[];
  /** Called with the new selection. */
  onSelectedChange?: (selected: string[]) => void;
  /** The name of a row in its labels (checkbox, expand button). Default: its id. */
  rowLabel?: (row: T) => string;

  /** The columns the rows are grouped by, in order (controlled) — each `groupable`. */
  groupBy?: readonly string[];
  /** The grouping at first, uncontrolled. */
  defaultGroupBy?: readonly string[];
  /** Called with the new grouping. */
  onGroupByChange?: (groupBy: string[]) => void;

  /** Visible (`true`) or hidden (`false`) columns, by id (controlled); a column not listed is visible. */
  columnVisibility?: Readonly<Record<string, boolean>>;
  /** The visibility at first, uncontrolled. */
  defaultColumnVisibility?: Readonly<Record<string, boolean>>;
  /** Called with the new visibility (`DataTableColumnsMenu`). */
  onColumnVisibilityChange?: (visibility: Record<string, boolean>) => void;

  /** Columns that stay in view while the table scrolls sideways: at the start (a name) or the end (actions). */
  pinning?: { start?: readonly string[]; end?: readonly string[] };
  /** Columns can be resized (pointer drag, or the arrow keys on the focused handle). */
  resizing?: boolean;

  /** The children of a row (a tree): each row with children gets a button that shows them. */
  getSubRows?: (row: T) => readonly T[] | undefined;
  /** A panel under an opened row (the details of a job): each row gets a button that opens it. */
  renderDetail?: (row: T) => React.ReactNode;
  /** The opened rows and groups (controlled), by id. */
  expanded?: Readonly<Record<string, boolean>>;
  /** The opened rows at first, uncontrolled. */
  defaultExpanded?: Readonly<Record<string, boolean>>;
  /** Called with the opened rows. */
  onExpandedChange?: (expanded: Record<string, boolean>) => void;

  /** Rows per page (controlled): turns on the pagination under the table. */
  pageSize?: number;
  /** Rows per page at first, uncontrolled: turns on the pagination under the table. */
  defaultPageSize?: number;
  /** Called with the size chosen in the pagination's select (`pageSizeOptions`). */
  onPageSizeChange?: (pageSize: number) => void;
  /** The sizes the pagination offers (`[10, 25, 50]`). */
  pageSizeOptions?: readonly number[];
  /** The page, from 1 (controlled). */
  page?: number;
  /** The page at first, uncontrolled. Default 1. */
  defaultPage?: number;
  /** Called with the page asked for. */
  onPageChange?: (page: number) => void;

  /** The server does the work: the rows are shown as given (sorted, filtered, a single page) — fetch in `onStateChange`. */
  manual?: { sorting?: boolean; filtering?: boolean; pagination?: boolean };
  /** The number of rows on the server (`manual.pagination`): the page count and the results' count. */
  rowCount?: number;
  /** Called with the sort, the filters and the page after each change: the query key of a server table. */
  onStateChange?: (query: DataTableQuery) => void;

  /** Rows are loading: skeleton rows (`loadingRows` of them) and `aria-busy`. */
  loading?: boolean;
  /** How many skeleton rows while loading. Default 5. */
  loadingRows?: number;
  /** A failure, shown in place of the rows (an `Alert`, a retry button); announced. */
  error?: React.ReactNode;
  /** Shown when there is no row (an `EmptyState`). Default: `labels.empty`. */
  empty?: React.ReactNode;

  /** `auto` (default): a table, cards below 36rem of container width. `table` or `cards` to force one. */
  layout?: "auto" | "table" | "cards";
  /** comfortable (default) · compact — one row height per density. */
  density?: "comfortable" | "compact";
  /** The header stays at the top of the window while the page scrolls (`--dt-top` on the table, or a number of px, clears a fixed bar). */
  stickyHeader?: boolean | number;
  /** Zebra rows. */
  striped?: boolean;
  /**
   * The table never scrolls sideways by default once its columns have a `type` or a `priority`: what does not fit goes to
   * the row's detail, then to cards. `true` opts in to a sideways scroll instead, with fades at the edges.
   */
  scroll?: boolean;
  /** Keeps the first column in view while the table scrolls sideways (with `scroll`). */
  stickyFirstColumn?: boolean;
  /** Renders only the rows in view, in a scrolling body of `height` px; rows are measured (`estimateRowHeight` is a guess). Forces the table layout. */
  virtualized?: { height: number; estimateRowHeight?: number; overscan?: number };

  /** Above the table, inside its frame: `DataTableFilters`, `DataTableColumnsMenu`, `DataTableExport`, actions. */
  toolbar?: React.ReactNode;
  /** Under the table (after the pagination): a total, a note. */
  footer?: React.ReactNode;
  /** The words, passed translated; English by default. */
  labels?: Partial<DataTableLabels>;
  /** Classes merged on the root. */
  className?: string;
};

type Context = {
  table: DataTableInstance<object>;
  columns: readonly DataTableColumn<object>[];
  labels: DataTableLabels;
  filters: DataTableFilterState;
  setFilters: (filters: DataTableFilterState) => void;
  /** The rows after the filters (all pages), or the server's count. */
  resultCount: number;
  /** The rows to export: filtered and sorted, every page, without the group rows. */
  exportRows: () => readonly unknown[];
  manualFiltering: boolean;
};

const DataTableContext = React.createContext<Context | null>(null);

/**
 * The table a component sits in (`toolbar`, or anything under it): the TanStack Table instance (`table` — the escape
 * hatch for what the props do not cover), the columns, the words, the filters and their setter.
 */
export function useDataTable<T extends RowData = object>() {
  const context = React.useContext(DataTableContext);
  if (!context) throw new Error("useDataTable: call it inside a DataTable (its `toolbar`, `footer` or a cell)");
  return context as unknown as Omit<Context, "table" | "columns" | "exportRows"> & {
    table: DataTableInstance<T>;
    columns: readonly DataTableColumn<T>[];
    exportRows: () => readonly T[];
  };
}

// A card never scrolls sideways, even when untyped columns keep the table's scroller.
const CARD_CLIP = { auto: "@max-xl:overflow-x-clip!", table: undefined, cards: "overflow-x-clip!" } as const;
const TRUNCATE = { auto: "@xl:truncate", table: "truncate", cards: "" } as const;
const MIN = { auto: "@xl:min-w-(--dt-min)!", table: "min-w-(--dt-min)!", cards: "" } as const;
const MAX = { auto: "@xl:max-w-(--dt-max)!", table: "max-w-(--dt-max)!", cards: "" } as const;
// A sideways scroll asked for (`scroll`): the edges fade where there is more to see.
const SHADOWS =
  "[background:linear-gradient(to_right,var(--kz-surface-1),transparent)_left/24px_100%_no-repeat_local,linear-gradient(to_left,var(--kz-surface-1),transparent)_right/24px_100%_no-repeat_local,linear-gradient(to_right,rgb(0_0_0/0.18),transparent)_left/10px_100%_no-repeat_scroll,linear-gradient(to_left,rgb(0_0_0/0.18),transparent)_right/10px_100%_no-repeat_scroll]";
const ALIGN = { start: "text-left", center: "text-center", end: "text-right" } as const;
const NONE: readonly never[] = [];
const NO_RECORD: Readonly<Record<string, never>> = {};
const apply = <S,>(updater: S | ((old: S) => S), old: S): S => (typeof updater === "function" ? (updater as (old: S) => S)(old) : updater);

const valueOf = <T,>(column: DataTableColumn<T>, row: T): CellValue =>
  column.value ? column.value(row) : ((row as Record<string, unknown>)[column.id] as CellValue);

const display = (value: CellValue) => (value instanceof Date ? value.toISOString() : String(value ?? ""));

/** A table of records — sort, filters and facets, groups, details, pages, selection, visibility, pinning, resizing — on the client or the server, cards on a phone, windowing for long lists. */
export function DataTable<T extends RowData>({
  rows,
  columns,
  getRowId,
  caption,
  showCaption,
  sort: sortProp,
  defaultSort = null,
  onSortChange,
  filters: filtersProp,
  defaultFilters = NO_RECORD,
  onFiltersChange,
  selectable,
  selected: selectedProp,
  defaultSelected = NONE,
  onSelectedChange,
  rowLabel,
  groupBy: groupByProp,
  defaultGroupBy = NONE,
  onGroupByChange,
  columnVisibility: visibilityProp,
  defaultColumnVisibility = NO_RECORD,
  onColumnVisibilityChange,
  pinning,
  resizing,
  getSubRows,
  renderDetail,
  expanded: expandedProp,
  defaultExpanded = NO_RECORD,
  onExpandedChange,
  pageSize: pageSizeProp,
  defaultPageSize,
  onPageSizeChange,
  pageSizeOptions,
  page: pageProp,
  defaultPage = 1,
  onPageChange,
  manual,
  rowCount,
  onStateChange,
  loading,
  loadingRows = 5,
  error,
  empty,
  layout = "auto",
  density,
  stickyHeader,
  striped,
  scroll,
  stickyFirstColumn,
  virtualized,
  toolbar,
  footer,
  labels: given,
  className,
}: DataTableProps<T>) {
  const labels = { ...dataTableLabels, ...given };
  const effectiveLayout = virtualized ? "table" : layout;
  const L = effectiveLayout;
  const typed = columns.some((c) => c.type || c.priority);
  const s = dataTable({ layout: L, density, sticky: Boolean(stickyHeader), striped: Boolean(striped), typed });

  const [sort, setSort] = useControllable<DataTableSort>(sortProp, defaultSort, onSortChange);
  const [filters, setFiltersState] = useControllable<DataTableFilterState>(filtersProp, defaultFilters, onFiltersChange);
  const [selected, setSelected] = useControllable<readonly string[]>(selectedProp, defaultSelected, onSelectedChange as (next: readonly string[]) => void);
  const [groupBy, setGroupBy] = useControllable<readonly string[]>(groupByProp, defaultGroupBy, onGroupByChange as (next: readonly string[]) => void);
  const [visibility, setVisibility] = useControllable<Readonly<Record<string, boolean>>>(visibilityProp, defaultColumnVisibility, onColumnVisibilityChange as (next: Readonly<Record<string, boolean>>) => void);
  const [expanded, setExpanded] = useControllable<Readonly<Record<string, boolean>>>(expandedProp, defaultExpanded, onExpandedChange as (next: Readonly<Record<string, boolean>>) => void);
  const paginated = pageSizeProp !== undefined || defaultPageSize !== undefined;
  const [pageSize, setPageSize] = useControllable<number>(pageSizeProp, defaultPageSize ?? Number.POSITIVE_INFINITY, onPageSizeChange);
  const [page, setPage] = useControllable<number>(pageProp, defaultPage, onPageChange);
  const [sizing, setSizing] = React.useState<Record<string, number>>({});
  const [resizeState, setResizeState] = React.useState<ColumnResizingState | undefined>(undefined);

  // One place announces the server's query: after any change of sort, filters, page or page size.
  const announce = (next: Partial<DataTableQuery>) =>
    onStateChange?.({ sort, filters, page: paginated ? page : 1, pageSize: paginated ? pageSize : Number.POSITIVE_INFINITY, ...next });
  const changeSort = (next: DataTableSort) => {
    setSort(next);
    if (paginated && page !== 1) setPage(1);
    announce({ sort: next, page: 1 });
  };
  const changeFilters = (next: DataTableFilterState) => {
    setFiltersState(next);
    if (paginated && page !== 1) setPage(1);
    announce({ filters: next, page: 1 });
  };
  const changePage = (next: number) => {
    setPage(next);
    announce({ page: next });
  };
  const changePageSize = (next: number) => {
    setPageSize(next);
    setPage(1);
    announce({ pageSize: next, page: 1 });
  };

  const hasExpander = Boolean(renderDetail || getSubRows);
  // Columns that can leave the row: their lines go to the row's detail, opened by a chevron in the first cell.
  const priorityOf = (column: DataTableColumn<T>): 1 | Priority => (column.priority && column.priority > 1 ? (column.priority as Priority) : 1);
  const maxPriority = columns.reduce<1 | Priority>((max, column) => (priorityOf(column) > max ? priorityOf(column) : max), 1);
  const inlineToggle = maxPriority > 1 && !hasExpander;
  const detailed = Boolean(renderDetail) || inlineToggle;
  const defs = React.useMemo<ColumnDef<typeof features, T>[]>(
    () =>
      columns.map((column) => ({
        id: column.id,
        accessorFn: (row: T) => valueOf(column, row),
        header: column.header,
        enableSorting: Boolean(column.sortable),
        sortFn: sortByValue as never,
        sortUndefined: "last",
        enableColumnFilter: Boolean(column.filter),
        filterFn: (column.filter ? FILTERS[column.filter] : FILTERS.text) as never,
        enableGrouping: Boolean(column.groupable),
        enableHiding: column.hideable !== false,
        enableResizing: Boolean(resizing),
        ...(column.width ? { size: column.width } : {}),
        minSize: column.minWidth ?? 64,
      })),
    [columns, resizing],
  );

  const firstId = columns[0]?.id;
  const pinned = stickyFirstColumn && firstId && !pinning?.start?.length ? { ...pinning, start: [firstId] } : pinning;
  const pageIndex = Math.max(0, page - 1);
  const table = useTable<typeof features, T>({
    features,
    columns: defs,
    data: rows as T[],
    getRowId: (row) => getRowId(row),
    getSubRows: getSubRows ? (row) => getSubRows(row) as T[] | undefined : undefined,
    getRowCanExpand: detailed ? () => true : undefined,
    state: {
      sorting: sort ? [{ id: sort.column, desc: sort.direction === "descending" }] : [],
      columnFilters: Object.entries(filters).map(([id, value]) => ({ id, value })),
      rowSelection: Object.fromEntries(selected.map((id) => [id, true])),
      grouping: [...groupBy],
      columnVisibility: { ...visibility },
      expanded: { ...expanded },
      pagination: { pageIndex, pageSize: paginated ? pageSize : Math.max(1, rows.length) },
      columnPinning: { start: [...(pinned?.start ?? [])], end: [...(pinned?.end ?? [])] },
      columnSizing: sizing,
      ...(resizeState ? { columnResizing: resizeState } : {}),
    },
    onSortingChange: (updater) => {
      const [first] = apply(updater, sort ? [{ id: sort.column, desc: sort.direction === "descending" }] : []);
      changeSort(first ? { column: first.id, direction: first.desc ? "descending" : "ascending" } : null);
    },
    onColumnFiltersChange: (updater) => {
      const next = apply(updater, Object.entries(filters).map(([id, value]) => ({ id, value })));
      changeFilters(Object.fromEntries(next.map((f) => [f.id, f.value as FilterValue])));
    },
    onRowSelectionChange: (updater) => {
      const next = apply(updater, Object.fromEntries(selected.map((id) => [id, true])));
      setSelected(Object.keys(next).filter((id) => next[id]));
    },
    onGroupingChange: (updater) => setGroupBy(apply(updater, [...groupBy])),
    onColumnVisibilityChange: (updater) => setVisibility(apply(updater, { ...visibility })),
    onExpandedChange: (updater) => {
      const next = apply(updater, { ...expanded });
      setExpanded(next === true ? Object.fromEntries(table.getRowModel().rows.map((r) => [r.id, true])) : next);
    },
    onColumnSizingChange: (updater) => setSizing((old: Record<string, number>) => apply(updater, old)),
    onColumnResizingChange: (updater) => setResizeState((old) => apply(updater, old as ColumnResizingState)),
    enableSortingRemoval: true,
    sortDescFirst: false,
    manualSorting: manual?.sorting,
    manualFiltering: manual?.filtering,
    manualPagination: manual?.pagination || !paginated,
    rowCount: manual?.pagination ? rowCount : undefined,
    autoResetPageIndex: false,
    autoResetExpanded: false,
    groupedColumnMode: false,
    columnResizeMode: "onChange",
    enableRowSelection: (row) => !row.getIsGrouped(),
  });

  const visibleColumns = table.getVisibleLeafColumns();
  const byId = new Map(columns.map((c) => [c.id, c]));
  const pageRows = table.getRowModel().rows;
  const leafCount = (manual?.pagination || manual?.filtering) && rowCount !== undefined ? rowCount : table.getFilteredRowModel().rows.length;
  const pageCount = paginated ? Math.max(1, manual?.pagination ? Math.ceil((rowCount ?? rows.length) / pageSize) : table.getPageCount()) : 1;
  // A page beyond the last (the filters shrank the list): show the last one.
  React.useEffect(() => {
    if (paginated && !loading && page > pageCount) changePage(pageCount);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only when the count of pages drops under the page
  }, [pageCount]);

  const selectableIds = pageRows.filter((r) => !r.getIsGrouped()).map((r) => r.id);
  const chosen = new Set(selected);
  const allChosen = selectableIds.length > 0 && selectableIds.every((id) => chosen.has(id));
  const someChosen = selectableIds.some((id) => chosen.has(id));
  const toggleAll = () =>
    setSelected(allChosen ? selected.filter((id) => !selectableIds.includes(id)) : [...new Set([...selected, ...selectableIds])]);

  const span = visibleColumns.length + (selectable ? 1 : 0) + (hasExpander ? 1 : 0);
  const fixedLayout = Boolean(resizing || pinned?.start?.length || pinned?.end?.length);
  const sideways = scroll ?? (!typed && !stickyHeader);
  const nameOf = (row: TableRow<T>) => (rowLabel ? rowLabel(row.original) : row.id);

  // Windowing: the rows in view, between two spacer rows that keep the scroll height.
  const scroller = React.useRef<HTMLDivElement>(null);
  const fallbacks = useLayoutFallbacks(virtualized?.height ?? 0, virtualized?.estimateRowHeight ?? 44);
  const virtualizer = useVirtualizer({
    ...fallbacks,
    count: pageRows.length,
    getScrollElement: () => scroller.current,
    estimateSize: () => virtualized?.estimateRowHeight ?? 44,
    overscan: virtualized?.overscan ?? 6,
    initialRect: { width: 0, height: virtualized?.height ?? 0 },
    getItemKey: (index) => pageRows[index]?.id ?? index,
    enabled: Boolean(virtualized) && !loading,
  });
  const windowItems = virtualized && !loading ? virtualizer.getVirtualItems() : null;
  const before = windowItems?.[0]?.start ?? 0;
  const after = windowItems && windowItems.length > 0 ? virtualizer.getTotalSize() - (windowItems.at(-1)?.end ?? 0) : 0;

  const pin = (column: TableColumn<T>): { "data-pin"?: "start" | "end"; style?: React.CSSProperties } => {
    const position = column.getIsPinned();
    if (!position) return {};
    const offset = position === "start" ? column.getStart("start") : column.getAfter("end");
    return { "data-pin": position, style: { ["--dt-pin" as string]: `${offset}px` } };
  };
  const width = (column: TableColumn<T>): React.CSSProperties | undefined =>
    fixedLayout || byId.get(column.id)?.width ? { width: column.getSize() } : undefined;

  const message = (content: React.ReactNode, alert?: boolean) => (
    <tr role="row" className={s.tr({ className: "hover:bg-transparent" })}>
      <td role="cell" colSpan={span} data-card="message" className={s.td({ className: s.message() })}>
        {alert ? <div role="alert">{content}</div> : content}
      </td>
    </tr>
  );

  const cardOf = (column: DataTableColumn<T> | undefined) =>
    column?.card === "title" || (column && !column.card && column.type === "title") ? "title" : column?.card === "hidden" ? "hidden" : undefined;

  // What a cell shows: the column's `cell`, or its value by type.
  const contentOf = (column: DataTableColumn<T>, original: T): React.ReactNode => {
    if (column.cell) return column.cell(original);
    const value = valueOf(column, original);
    const text = column.type === "date" && value instanceof Date ? value.toISOString().slice(0, 10) : display(value);
    const cut = TRUNCATE[L];
    switch (column.type) {
      case "title": {
        const sub = column.subtitle?.(original);
        return (
          <span className="block min-w-0">
            <span className={cn("block font-semibold text-fg", cut)} title={text}>
              {text}
            </span>
            {sub ? <span className={cn("block font-mono text-xs text-fg-tertiary", cut)}>{sub}</span> : null}
          </span>
        );
      }
      case "number":
        return (
          <span>
            {typeof value === "number" ? value.toLocaleString("en") : text}
            {column.unit ? <span className="ms-1 text-fg-secondary">{column.unit}</span> : null}
          </span>
        );
      case "link": {
        const href = column.href?.(original);
        return href ? (
          <a href={href} title={text} className={cn("block text-fg-accent underline-offset-2 hover:underline", cut)}>
            {text}
          </a>
        ) : (
          <span className={cn("block", cut)} title={text}>
            {text}
          </span>
        );
      }
      default: {
        const lines = column.clamp ?? (column.type === "text" ? 2 : undefined);
        if (!column.nowrap && !lines) return text;
        return (
          <span className={column.nowrap ? cn("block", cut || "truncate") : CLAMP[lines as 1 | 2 | 3]} title={text}>
            {text}
          </span>
        );
      }
    }
  };

  const dataCell = (row: TableRow<T>, cell: TableCell<T>, first: boolean) => {
    const column = byId.get(cell.column.id);
    if (!column) return null;
    const { style, ...pinnedProps } = pin(cell.column);
    let content: React.ReactNode;
    if (row.getIsGrouped()) {
      const leaves = row.getLeafRows().filter((r) => !r.getIsGrouped()).map((r) => r.original);
      if (cell.column.id === row.groupingColumnId) {
        const value = display(row.groupingValue as CellValue);
        content = (
          <button type="button" className={s.toggle({ className: "px-1.5 font-semibold text-fg" })} aria-expanded={row.getIsExpanded()} onClick={row.getToggleExpandedHandler()}>
            <ChevronGlyph direction="right" className="h-4 w-4" />
            {labels.group(value, leaves.length)}
          </button>
        );
      } else content = column.aggregate ? column.aggregate(leaves) : null;
    } else {
      content = contentOf(column, row.original);
      if (first && inlineToggle) {
        content = (
          <span className="flex min-w-0 items-center gap-1">
            <button
              type="button"
              className={s.toggle({ className: TOGGLE[L][maxPriority as Priority] })}
              aria-expanded={row.getIsExpanded()}
              aria-label={labels.showMore(nameOf(row))}
              onClick={row.getToggleExpandedHandler()}
            >
              <ChevronGlyph direction="right" className="h-4 w-4" />
            </button>
            <span className="min-w-0 flex-1">{content}</span>
          </span>
        );
      }
    }
    const level = priorityOf(column);
    const type = column.type;
    const cellClass = [
      ALIGN[column.align ?? (type === "number" ? "end" : "start")],
      type ? TYPE_CELL[type][L] : "",
      level > 1 ? LEAVES[L][level as Priority] : "",
      (type || column.priority) && column.minWidth !== undefined ? MIN[L] : "",
      column.maxWidth !== undefined ? MAX[L] : "",
    ].join(" ");
    return (
      <td
        role="cell"
        key={cell.id}
        data-label={column.header}
        data-card={row.getIsGrouped() ? (cell.column.id === row.groupingColumnId ? "title" : column.aggregate ? undefined : "hidden") : cardOf(column)}
        {...pinnedProps}
        className={s.td({ className: cellClass })}
        style={{
          ...style,
          ...(column.minWidth !== undefined ? { ["--dt-min" as string]: `${column.minWidth}px` } : {}),
          ...(column.maxWidth !== undefined ? { ["--dt-max" as string]: `${column.maxWidth}px` } : {}),
          ...(first && row.depth > 0 && !row.getIsGrouped() ? { paddingInlineStart: `${1 + row.depth * 1.25}rem` } : {}),
        }}
      >
        {content}
      </td>
    );
  };

  const renderRow = (row: TableRow<T>, index: number) => {
    const isChosen = chosen.has(row.id);
    const grouped = row.getIsGrouped();
    const canExpand = !grouped && (renderDetail ? true : row.getCanExpand());
    const showDetail = detailed && !grouped && row.getIsExpanded() && !virtualized;
    const cells = row.getVisibleCells();
    const main = (
      <tr
        role="row"
        data-index={windowItems ? index : undefined}
        ref={windowItems ? virtualizer.measureElement : undefined}
        aria-rowindex={virtualized ? index + 2 : undefined}
        data-state={isChosen ? "selected" : undefined}
        data-group={grouped ? "" : undefined}
        className={s.tr({ className: grouped ? s.groupRow() : undefined })}
      >
        {selectable && (
          <td role="cell" className={s.td({ className: s.select() })}>
            {grouped ? null : <Checkbox checked={isChosen} onCheckedChange={() => row.toggleSelected()} aria-label={labels.selectRow(nameOf(row))} />}
          </td>
        )}
        {hasExpander && (
          <td role="cell" className={s.td({ className: s.expander() })}>
            {canExpand ? (
              <button type="button" className={s.toggle()} aria-expanded={row.getIsExpanded()} aria-label={labels.expandRow(nameOf(row))} onClick={row.getToggleExpandedHandler()}>
                <ChevronGlyph direction="right" className="h-4 w-4" />
              </button>
            ) : null}
          </td>
        )}
        {cells.map((cell, i) => dataCell(row, cell, i === 0))}
      </tr>
    );
    // One Fragment keyed by the row either way: opening a row keeps its button (and the focus on it).
    if (!showDetail) return <React.Fragment key={row.id}>{main}</React.Fragment>;
    const left = visibleColumns.filter((c) => priorityOf(byId.get(c.id) as DataTableColumn<T>) > 1);
    return (
      <React.Fragment key={row.id}>
        {main}
        <tr role="row" className={s.tr({ className: "hover:bg-transparent" })}>
          <td role="cell" colSpan={span} data-card="message" className={s.td({ className: renderDetail ? s.detail() : "bg-surface-0 p-0 text-left" })}>
            {left.length > 0 ? (
              <dl className={cn("m-0 grid gap-3 text-left", renderDetail ? "mb-4" : cn("px-4 py-4", PANEL[L][maxPriority as Priority]))}>
                {left.map((c) => {
                  const column = byId.get(c.id) as DataTableColumn<T>;
                  return (
                    <div key={c.id} className={cn(IN_DETAIL[L][priorityOf(column) as Priority], "grid-cols-[minmax(5rem,8rem)_minmax(0,1fr)] items-baseline gap-3")}>
                      <dt className="text-xs font-semibold text-fg-secondary">{column.header}</dt>
                      <dd className="m-0 min-w-0 text-sm text-fg">{contentOf(column, row.original)}</dd>
                    </div>
                  );
                })}
              </dl>
            ) : null}
            {renderDetail ? renderDetail(row.original) : null}
          </td>
        </tr>
      </React.Fragment>
    );
  };

  let body: React.ReactNode;
  if (loading) {
    body = Array.from({ length: loadingRows }, (_, i) => (
      <tr role="row" key={`loading-${i}`} aria-hidden className={s.tr()}>
        {selectable && <td role="cell" className={s.td({ className: s.select() })} />}
        {hasExpander && <td role="cell" className={s.td({ className: s.expander() })} />}
        {visibleColumns.map((column) => (
          <td role="cell" key={column.id} data-card={cardOf(byId.get(column.id))} className={s.td()}>
            <div className={s.skeleton()} />
          </td>
        ))}
      </tr>
    ));
  } else if (error) body = message(error, true);
  else if (pageRows.length === 0) body = message(empty ?? labels.empty);
  else if (windowItems) body = windowItems.map((item) => renderRow(pageRows[item.index] as TableRow<T>, item.index));
  else body = pageRows.map((row, i) => renderRow(row, i));

  const headers = table.getHeaderGroups().at(-1)?.headers ?? [];
  const tableElement = (
    <table
      role="table"
      aria-busy={loading || undefined}
      aria-rowcount={virtualized ? pageRows.length + 1 : undefined}
      className={s.table({ className: fixedLayout ? "table-fixed" : undefined })}
      style={fixedLayout ? { minWidth: table.getTotalSize() + (selectable ? 40 : 0) + (hasExpander ? 40 : 0) } : undefined}
    >
      <caption className={showCaption ? s.caption() : "sr-only"}>
        {caption}
        {loading ? <span className="sr-only">{` — ${labels.loading}`}</span> : null}
      </caption>
      <thead role="rowgroup" className={s.thead({ className: virtualized ? "sticky top-0 z-10 bg-surface-2" : undefined })}>
        <tr role="row" aria-rowindex={virtualized ? 1 : undefined} className={s.headRow()}>
          {selectable && (
            <th role="columnheader" scope="col" data-keep="" className={s.th({ className: s.select() })}>
              <Checkbox
                checked={allChosen ? true : someChosen ? "indeterminate" : false}
                onCheckedChange={toggleAll}
                disabled={loading || selectableIds.length === 0}
                aria-label={labels.selectAll}
              />
            </th>
          )}
          {hasExpander && (
            <th role="columnheader" scope="col" className={s.th({ className: s.expander() })}>
              <span className="sr-only">{labels.details}</span>
            </th>
          )}
          {headers.map((header) => {
            const column = byId.get(header.column.id);
            if (!column) return null;
            const sorted = header.column.getIsSorted();
            const direction: SortDirection | undefined = sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : undefined;
            const { style, ...pinnedProps } = pin(header.column);
            const level = priorityOf(column);
            return (
              <th
                role="columnheader"
                scope="col"
                key={header.id}
                aria-sort={column.sortable ? (direction ?? "none") : undefined}
                data-keep={column.sortable ? "" : undefined}
                {...pinnedProps}
                className={s.th({ className: cn(ALIGN[column.align ?? (column.type === "number" ? "end" : "start")], level > 1 && LEAVES_HEAD[L][level as Priority]) })}
                style={{ ...style, ...(typeof stickyHeader === "number" ? { ["--dt-top" as string]: `${stickyHeader}px` } : {}), ...width(header.column) }}
              >
                {column.sortable ? (
                  <button type="button" aria-pressed={Boolean(direction)} className={s.sortButton()} onClick={() => header.column.toggleSorting(undefined, false)}>
                    {column.header}
                    <SortGlyph direction={direction} className="h-3.5 w-3.5" />
                  </button>
                ) : column.headerHidden ? (
                  <span className="sr-only">{column.header}</span>
                ) : (
                  column.header
                )}
                {resizing && header.column.getCanResize() ? (
                  <ResizeHandle
                    label={labels.resize(column.header)}
                    size={header.column.getSize()}
                    min={column.minWidth ?? 64}
                    resizing={header.column.getIsResizing()}
                    className={s.resizer()}
                    onPointerStart={header.getResizeHandler()}
                    onSize={(size) => setSizing((old: Record<string, number>) => ({ ...old, [header.column.id]: size }))}
                  />
                ) : null}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody role="rowgroup" className={s.tbody()}>
        {before > 0 && (
          <tr aria-hidden style={{ height: before }}>
            <td colSpan={span} />
          </tr>
        )}
        {body}
        {after > 0 && (
          <tr aria-hidden style={{ height: after }}>
            <td colSpan={span} />
          </tr>
        )}
      </tbody>
    </table>
  );

  const context: Context = {
    table: table as unknown as DataTableInstance<object>,
    columns: columns as readonly DataTableColumn<object>[],
    labels,
    filters,
    setFilters: changeFilters,
    resultCount: leafCount,
    exportRows: () => table.getSortedRowModel().flatRows.filter((r) => !r.getIsGrouped()).map((r) => r.original),
    manualFiltering: Boolean(manual?.filtering),
  };

  const pagination = paginated ? (
    <Pagination
      page={Math.min(page, pageCount)}
      pageCount={pageCount}
      onPageChange={changePage}
      pageSize={pageSizeOptions ? pageSize : undefined}
      pageSizeOptions={pageSizeOptions}
      onPageSizeChange={pageSizeOptions ? changePageSize : undefined}
      disabled={loading}
      labels={labels.pagination}
    />
  ) : null;

  return (
    <DataTableContext.Provider value={context}>
      <div className={s.root({ className })}>
        {toolbar ? <div className={s.toolbar()}>{toolbar}</div> : null}
        {virtualized ? (
          // A scrolling region the keyboard can reach: Tab lands on it, the arrows scroll it.
          <div
            ref={scroller}
            tabIndex={0}
            role="region"
            aria-label={caption}
            className={s.scroller({ className: "overflow-y-auto focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring" })}
            style={{ height: virtualized.height }}
          >
            {tableElement}
          </div>
        ) : (
          <div className={s.scroller({ className: sideways ? (scroll ? SHADOWS : CARD_CLIP[L]) : "overflow-x-clip" })}>{tableElement}</div>
        )}
        {pagination || footer ? (
          <div className={s.footer({ className: "flex flex-col gap-3" })}>
            {pagination}
            {footer}
          </div>
        ) : null}
      </div>
    </DataTableContext.Provider>
  );
}

/** The handle on a header's edge: drag it, or focus it and use ← → (Shift for larger steps). */
function ResizeHandle({
  label,
  size,
  min,
  resizing,
  className,
  onPointerStart,
  onSize,
}: {
  label: string;
  size: number;
  min: number;
  resizing: boolean;
  className: string;
  onPointerStart: (event: unknown) => void;
  onSize: (size: number) => void;
}) {
  return (
    // A focusable separator is interactive (WAI-ARIA "window splitter"): its value is the width, the arrows change it.
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label={label}
      aria-valuenow={Math.round(size)}
      aria-valuemin={min}
      tabIndex={0}
      data-resizing={resizing ? "" : undefined}
      className={className}
      onMouseDown={onPointerStart}
      onTouchStart={onPointerStart}
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => {
        const step = event.shiftKey ? 48 : 16;
        if (event.key === "ArrowLeft") onSize(Math.max(min, size - step));
        else if (event.key === "ArrowRight") onSize(size + step);
        else return;
        event.preventDefault();
      }}
    />
  );
}
