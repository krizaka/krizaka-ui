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
import { SelectionBar, type SelectionBarLabels } from "./selection-bar";
import { useRouteTable } from "./use-route-table";

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
          "@max-xl:[&>*]:min-w-0 @max-xl:[&>*]:shrink @max-xl:[&>*]:whitespace-normal " +
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
          "[&>*]:min-w-0 [&>*]:shrink [&>*]:whitespace-normal " +
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
    // What a row becomes on a phone (under 36 rem, or with `layout="cards"`): a card, or a list row (#636).
    phone: { cards: {}, list: {} },
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
    // The list rows (#636): no box in the box, no label/value lines — the checkbox, the title and its line of facts, the
    // status at the end, a hairline between rows. Each cell says its place in `data-list` (title · status · away).
    {
      layout: "auto",
      phone: "list",
      class: {
        tbody: "@max-xl:gap-0 @max-xl:p-0",
        tr:
          "@max-xl:flex @max-xl:items-center @max-xl:gap-3 @max-xl:rounded-none @max-xl:border-0 @max-xl:border-b @max-xl:border-border-subtle @max-xl:bg-transparent " +
          "@max-xl:px-4 @max-xl:py-3 @max-xl:last:border-b-0",
        td:
          "@max-xl:block @max-xl:text-left @max-xl:before:content-none @max-xl:data-[list=title]:min-w-0 @max-xl:data-[list=title]:flex-1 " +
          "@max-xl:data-[list=status]:shrink-0 @max-xl:data-[list=away]:hidden @max-xl:data-[card=message]:w-full",
        select: "@max-xl:relative @max-xl:right-auto @max-xl:top-auto @max-xl:z-[1] @max-xl:shrink-0 @max-xl:self-center",
        expander: "@max-xl:relative @max-xl:z-[1] @max-xl:shrink-0",
      },
    },
    {
      layout: "cards",
      phone: "list",
      class: {
        tbody: "gap-0 p-0",
        tr: "flex items-center gap-3 rounded-none border-0 border-b border-border-subtle bg-transparent px-4 py-3 last:border-b-0",
        td: "block text-left before:content-none data-[list=title]:min-w-0 data-[list=title]:flex-1 data-[list=status]:shrink-0 data-[list=away]:hidden data-[card=message]:w-full",
        select: "relative right-auto top-auto z-[1] shrink-0 self-center",
        expander: "relative z-[1] shrink-0",
      },
    },
  ],
  defaultVariants: { layout: "auto", density: "comfortable", sticky: false, striped: false, typed: false, phone: "cards" },
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

// The list rows (`phone="list"`): the facts line under the title, the columns that go to the row's detail (every
// priority-1 column that is neither the title nor a status), the button and the panel that show them, the title's link
// stretched over the row.
const LIST_FACTS = { auto: "hidden @max-xl:mt-0.5 @max-xl:block @max-xl:truncate text-xs font-normal text-fg-secondary", table: "hidden", cards: "mt-0.5 block truncate text-xs font-normal text-fg-secondary" } as const;
const LIST_IN_DETAIL = { auto: "hidden @max-xl:grid", table: "hidden", cards: "grid" } as const;
const LIST_TOGGLE = { auto: "@max-xl:inline-flex", table: "", cards: "inline-flex" } as const;
const LIST_PANEL = { auto: "@max-xl:block", table: "", cards: "block" } as const;
const LIST_LINK = { auto: "@max-xl:after:absolute @max-xl:after:inset-0 @max-xl:after:content-['']", table: "", cards: "after:absolute after:inset-0 after:content-['']" } as const;

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
   * go to the row's detail (a chevron opens it); under 36 rem (cards) 2 stays on the card, 3+ go to its detail. In the phone's
   * list rows (`phone="list"`), the 2s are joined as the line of facts under the title.
   */
  priority?: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  /** `title`: the line under the name (an id), in mono. */
  subtitle?: (row: T) => React.ReactNode;
  /** `link`: where the value leads. `title`: the row's page — the name becomes its link (the whole row, in the phone's list rows). */
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
  /** The words of the bar of a selection (`bulkActions`). */
  selection?: Partial<SelectionBarLabels>;
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

  /**
   * Keeps the sort, the filters and the page in the address (`?clients.sort=…&clients.page=2`): back and forward, a reload
   * and a shared link all land on the same table. Replaces `sort`, `filters` and `page`; needs the router's adapter
   * (`RouteStateProvider`) in a framework.
   */
  routeKey?: string;

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
  /**
   * The actions on the selection, given by the product: the bar (`SelectionBar`) appears under the table while rows are
   * chosen — the count, these actions, « Clear selection » — sticky, docked above the tab bar on a phone. Needs `selectable`.
   */
  bulkActions?: (selection: { selected: string[]; clear: () => void }) => React.ReactNode;
  /** The most rows a bulk call takes (200 for `@krizaka/organize`): the bar says so past it and its actions rest. */
  bulkMax?: number;
  /** What the last bulk change did ("3 moved, 1 skipped"), announced politely by the bar. */
  bulkResult?: string;

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
  /**
   * What a row becomes on a phone (under 36 rem, or always with `layout="cards"`): `cards` (a card per row, its values
   * labelled) or `list` — a list row: the selection's checkbox, the `title` column with its `priority: 2` columns joined as
   * one line of facts, the `status` / `badge` column at the end; the other columns in the row's detail.
   * @default "cards"
   */
  phone?: "cards" | "list";
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
type Up<S> = S | ((old: S) => S);
const apply = <S,>(updater: S | ((old: S) => S), old: S): S => (typeof updater === "function" ? (updater as (old: S) => S)(old) : updater);

const valueOf = <T,>(column: DataTableColumn<T>, row: T): CellValue =>
  column.value ? column.value(row) : ((row as Record<string, unknown>)[column.id] as CellValue);

const display = (value: CellValue) => (value instanceof Date ? value.toISOString() : String(value ?? ""));

type Layout = "auto" | "table" | "cards";
type Styles = ReturnType<typeof dataTable>;
type Place = "title" | "status" | "facts" | "away" | "hidden";
type TableHeader<T extends RowData> = ReturnType<DataTableInstance<T>["getHeaderGroups"]>[number]["headers"][number];
type Pin = { "data-pin"?: "start" | "end"; style?: React.CSSProperties };

const sortingOf = (sort: DataTableSort) => (sort ? [{ id: sort.column, desc: sort.direction === "descending" }] : []);
const filterListOf = (filters: DataTableFilterState) => Object.entries(filters).map(([id, value]) => ({ id, value }));
const selectionOf = (selected: readonly string[]) => Object.fromEntries(selected.map((id) => [id, true as const]));

// Columns that can leave the row: their lines go to the row's detail, opened by a chevron in the first cell.
const priorityOf = <T extends RowData>(column: DataTableColumn<T>): 1 | Priority => (column.priority && column.priority > 1 ? (column.priority as Priority) : 1);

// The list rows' places: the title (the `title` column, else the first), the status at the end, the facts (the 2s) under
// the title, and the rest away, in the row's detail.
const placeOf = <T extends RowData>(titleColumn: DataTableColumn<T> | undefined, column: DataTableColumn<T>): Place => {
  if (column.card === "hidden") return "hidden";
  if (column === titleColumn) return "title";
  if (column.type === "status" || column.type === "badge") return "status";
  return priorityOf(column) === 2 ? "facts" : "away";
};

const cardOf = <T extends RowData>(column: DataTableColumn<T> | undefined) =>
  column?.card === "title" || (column && !column.card && column.type === "title") ? "title" : column?.card === "hidden" ? "hidden" : undefined;

/** What the cells and the rows need to know about the table they are in. */
type View<T extends RowData> = {
  s: Styles;
  L: Layout;
  list: boolean;
  labels: DataTableLabels;
  byId: Map<string, DataTableColumn<T>>;
  titleColumn: DataTableColumn<T> | undefined;
  facts: DataTableColumn<T>[];
  listAway: DataTableColumn<T>[];
  maxPriority: 1 | Priority;
  inlineToggle: boolean;
  hasExpander: boolean;
  detailed: boolean;
  selectable: boolean;
  span: number;
  chosen: Set<string>;
  virtualized: boolean;
  fixedLayout: boolean;
  renderDetail: ((row: T) => React.ReactNode) | undefined;
  rowLabel: ((row: T) => string) | undefined;
  visibleColumns: TableColumn<T>[];
  measureElement: ((node: Element | null) => void) | undefined;
  loading: boolean | undefined;
  loadingCount: number;
  error: React.ReactNode;
  empty: React.ReactNode;
  pageRows: TableRow<T>[];
  windowItems: { index: number }[] | null;
  resizing: boolean | undefined;
  stickyHeader: boolean | number | undefined;
  setSizing: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  allChosen: boolean;
  someChosen: boolean;
  selectableCount: number;
  toggleAll: () => void;
};

const nameOf = <T extends RowData>(v: View<T>, row: TableRow<T>) => (v.rowLabel ? v.rowLabel(row.original) : row.id);

const pin = <T extends RowData>(column: TableColumn<T>): Pin => {
  const position = column.getIsPinned();
  if (!position) return {};
  const offset = position === "start" ? column.getStart("start") : column.getAfter("end");
  return { "data-pin": position, style: { ["--dt-pin" as string]: `${offset}px` } };
};

const widthOf = <T extends RowData>(v: View<T>, column: TableColumn<T>): React.CSSProperties | undefined =>
  v.fixedLayout || v.byId.get(column.id)?.width ? { width: column.getSize() } : undefined;

/** A title: a link when the column has addresses, with its subtitle under it. */
function titleContent<T extends RowData>(v: View<T>, column: DataTableColumn<T>, original: T, text: string, cut: string) {
  const sub = column.subtitle?.(original);
  const href = column.href?.(original);
  const link = cn("block font-semibold text-fg no-underline hover:underline focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring", cut, v.list && LIST_LINK[v.L]);
  return (
    <span className="block min-w-0">
      {href ? (
        <a href={href} className={link} title={text}>
          {text}
        </a>
      ) : (
        <span className={cn("block font-semibold text-fg", cut)} title={text}>
          {text}
        </span>
      )}
      {sub ? <span className={cn("block font-mono text-xs text-fg-tertiary", cut)}>{sub}</span> : null}
    </span>
  );
}

function plainContent<T extends RowData>(column: DataTableColumn<T>, text: string, cut: string) {
  const lines = column.clamp ?? (column.type === "text" ? 2 : undefined);
  if (!column.nowrap && !lines) return text;
  return (
    <span className={column.nowrap ? cn("block", cut || "truncate") : CLAMP[lines as 1 | 2 | 3]} title={text}>
      {text}
    </span>
  );
}

// What a cell shows: the column's `cell`, or its value by type.
function contentOf<T extends RowData>(v: View<T>, column: DataTableColumn<T>, original: T): React.ReactNode {
  if (column.cell) return column.cell(original);
  const value = valueOf(column, original);
  const text = column.type === "date" && value instanceof Date ? value.toISOString().slice(0, 10) : display(value);
  const cut = TRUNCATE[v.L];
  switch (column.type) {
    case "title":
      return titleContent(v, column, original, text, cut);
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
    default:
      return plainContent(column, text, cut);
  }
}

// A group's row keeps its value as the title and its aggregates; a facts column is away (its value is in the title's line).
function listPlace<T extends RowData>(v: View<T>, row: TableRow<T> | null, column: DataTableColumn<T>) {
  if (row?.getIsGrouped()) return row.groupingColumnId === column.id ? "title" : column.aggregate ? "status" : "away";
  const place = placeOf(v.titleColumn, column);
  return place === "facts" || place === "hidden" ? "away" : place;
}

/** The cell of a group row: the group's value as a button that opens it, or the column's aggregate. */
function groupContent<T extends RowData>(v: View<T>, row: TableRow<T>, column: DataTableColumn<T>, columnId: string) {
  const leaves = row
    .getLeafRows()
    .filter((r) => !r.getIsGrouped())
    .map((r) => r.original);
  if (columnId !== row.groupingColumnId) return column.aggregate ? column.aggregate(leaves) : null;
  const value = display(row.groupingValue as CellValue);
  return (
    <button type="button" className={v.s.toggle({ className: "px-1.5 font-semibold text-fg" })} aria-expanded={row.getIsExpanded()} onClick={row.getToggleExpandedHandler()}>
      <ChevronGlyph direction="right" className="h-4 w-4" />
      {v.labels.group(value, leaves.length)}
    </button>
  );
}

/** The cell's content; the list row's title carries its facts under it, the first cell its chevron (columns that left the row). */
function bodyContent<T extends RowData>(v: View<T>, row: TableRow<T>, column: DataTableColumn<T>, first: boolean) {
  const { original } = row;
  let content = contentOf(v, column, original);
  if (v.list && column === v.titleColumn && v.facts.length > 0) {
    content = (
      <span className="block min-w-0">
        {content}
        <span data-facts="" className={LIST_FACTS[v.L]}>
          {v.facts.map((c, i) => (
            <React.Fragment key={c.id}>
              {i > 0 ? <span aria-hidden>{" · "}</span> : null}
              {contentOf(v, c, original)}
            </React.Fragment>
          ))}
        </span>
      </span>
    );
  }
  if (first && v.inlineToggle) {
    const shown = v.maxPriority > 1 ? TOGGLE[v.L][v.maxPriority as Priority] : "hidden";
    content = (
      <span className="flex min-w-0 items-center gap-1">
        <button
          type="button"
          className={v.s.toggle({ className: cn(shown, v.listAway.length > 0 && LIST_TOGGLE[v.L], v.list && "relative z-[1]") })}
          aria-expanded={row.getIsExpanded()}
          aria-label={v.labels.showMore(nameOf(v, row))}
          onClick={row.getToggleExpandedHandler()}
        >
          <ChevronGlyph direction="right" className="h-4 w-4" />
        </button>
        <span className="min-w-0 flex-1">{content}</span>
      </span>
    );
  }
  return content;
}

function cellClass<T extends RowData>(v: View<T>, column: DataTableColumn<T>) {
  const level = priorityOf(column);
  const type = column.type;
  return [
    ALIGN[column.align ?? (type === "number" ? "end" : "start")],
    type ? TYPE_CELL[type][v.L] : "",
    level > 1 ? LEAVES[v.L][level as Priority] : "",
    (type || column.priority) && column.minWidth !== undefined ? MIN[v.L] : "",
    column.maxWidth !== undefined ? MAX[v.L] : "",
  ].join(" ");
}

function cardRole<T extends RowData>(v: View<T>, row: TableRow<T>, column: DataTableColumn<T>, columnId: string) {
  if (v.list) return column.card === "hidden" ? "hidden" : undefined;
  if (!row.getIsGrouped()) return cardOf(column);
  if (columnId === row.groupingColumnId) return "title";
  return column.aggregate ? undefined : "hidden";
}

function dataCell<T extends RowData>(v: View<T>, row: TableRow<T>, cell: TableCell<T>, first: boolean) {
  const column = v.byId.get(cell.column.id);
  if (!column) return null;
  const { style, ...pinnedProps } = pin(cell.column);
  const content = row.getIsGrouped() ? groupContent(v, row, column, cell.column.id) : bodyContent(v, row, column, first);
  return (
    <td
      role="cell"
      key={cell.id}
      data-label={column.header}
      data-card={cardRole(v, row, column, cell.column.id)}
      data-list={v.list ? listPlace(v, row, column) : undefined}
      {...pinnedProps}
      className={v.s.td({ className: cellClass(v, column) })}
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
}

/** The panel under an opened row: the columns that left the row, then the host's own detail. */
function detailRow<T extends RowData>(v: View<T>, row: TableRow<T>) {
  const left = v.visibleColumns.filter((c) => {
    const column = v.byId.get(c.id) as DataTableColumn<T>;
    return priorityOf(column) > 1 || v.listAway.includes(column);
  });
  const { L, s, renderDetail } = v;
  const panel = cn("px-4 py-4", v.maxPriority > 1 ? PANEL[L][v.maxPriority as Priority] : "hidden", v.listAway.length > 0 && LIST_PANEL[L]);
  return wideRow(
    v,
    renderDetail ? s.detail() : "bg-surface-0 p-0 text-left",
    <>
        {left.length > 0 ? (
          <dl className={cn("m-0 grid gap-3 text-left", renderDetail ? "mb-4" : panel)}>
            {left.map((c) => {
              const column = v.byId.get(c.id) as DataTableColumn<T>;
              const place = v.listAway.includes(column) ? LIST_IN_DETAIL[L] : IN_DETAIL[L][priorityOf(column) as Priority];
              return (
                <div key={c.id} className={cn(place, "grid-cols-[minmax(5rem,8rem)_minmax(0,1fr)] items-baseline gap-3")}>
                  <dt className="text-xs font-semibold text-fg-secondary">{column.header}</dt>
                  <dd className="m-0 min-w-0 text-sm text-fg">{contentOf(v, column, row.original)}</dd>
                </div>
              );
            })}
          </dl>
        ) : null}
        {renderDetail ? renderDetail(row.original) : null}
    </>,
  );
}

function renderRow<T extends RowData>(v: View<T>, row: TableRow<T>, index: number) {
  const isChosen = v.chosen.has(row.id);
  const grouped = row.getIsGrouped();
  const showDetail = v.detailed && !grouped && row.getIsExpanded() && !v.virtualized;
  const { s, labels } = v;
  const canExpand = !grouped && (v.renderDetail ? true : row.getCanExpand());
  const main = (
    <tr
      role="row"
      data-index={v.measureElement ? index : undefined}
      ref={v.measureElement}
      aria-rowindex={v.virtualized ? index + 2 : undefined}
      data-state={isChosen ? "selected" : undefined}
      data-group={grouped ? "" : undefined}
      className={s.tr({ className: grouped ? s.groupRow() : undefined })}
    >
      {v.selectable && (
        <td role="cell" className={s.td({ className: s.select() })}>
          {grouped ? null : <Checkbox checked={isChosen} onCheckedChange={() => row.toggleSelected()} aria-label={labels.selectRow(nameOf(v, row))} />}
        </td>
      )}
      {v.hasExpander && (
        <td role="cell" className={s.td({ className: s.expander() })}>
          {canExpand ? (
            <button type="button" className={s.toggle()} aria-expanded={row.getIsExpanded()} aria-label={labels.expandRow(nameOf(v, row))} onClick={row.getToggleExpandedHandler()}>
              <ChevronGlyph direction="right" className="h-4 w-4" />
            </button>
          ) : null}
        </td>
      )}
      {row.getVisibleCells().map((cell, i) => dataCell(v, row, cell, i === 0))}
    </tr>
  );
  // One Fragment keyed by the row either way: opening a row keeps its button (and the focus on it).
  return (
    <React.Fragment key={row.id}>
      {main}
      {showDetail ? detailRow(v, row) : null}
    </React.Fragment>
  );
}

/** A full-width row: a message, or the opened row's detail. */
function wideRow<T extends RowData>(v: View<T>, tdClass: string, children: React.ReactNode) {
  return (
    <tr role="row" className={v.s.tr({ className: "hover:bg-transparent" })}>
      <td role="cell" colSpan={v.span} data-card="message" className={v.s.td({ className: tdClass })}>
        {children}
      </td>
    </tr>
  );
}

function messageRow<T extends RowData>(v: View<T>, content: React.ReactNode, alert?: boolean) {
  return wideRow(v, v.s.message(), alert ? <div role="alert">{content}</div> : content);
}

function bodyRows<T extends RowData>(v: View<T>) {
  const { pageRows: rows, windowItems } = v;
  if (v.loading) {
    const { s, list } = v;
    return Array.from({ length: v.loadingCount }, (_, i) => (
      <tr role="row" key={`loading-${i}`} aria-hidden className={s.tr()}>
        {v.selectable && <td role="cell" className={s.td({ className: s.select() })} />}
        {v.hasExpander && <td role="cell" className={s.td({ className: s.expander() })} />}
        {v.visibleColumns.map((column) => (
          <td role="cell" key={column.id} data-card={list ? undefined : cardOf(v.byId.get(column.id))} data-list={list ? listPlace(v, null, v.byId.get(column.id) as DataTableColumn<T>) : undefined} className={s.td()}>
            <div className={s.skeleton()} />
          </td>
        ))}
      </tr>
    ));
  }
  if (v.error) return messageRow(v, v.error, true);
  if (rows.length === 0) return messageRow(v, v.empty ?? v.labels.empty);
  if (windowItems) return windowItems.map((item) => renderRow(v, rows[item.index] as TableRow<T>, item.index));
  return rows.map((row, i) => renderRow(v, row, i));
}

function headerLabel<T extends RowData>(v: View<T>, header: TableHeader<T>, column: DataTableColumn<T>, direction: SortDirection | undefined) {
  if (column.sortable) {
    return (
      <button type="button" aria-pressed={Boolean(direction)} className={v.s.sortButton()} onClick={() => header.column.toggleSorting(undefined, false)}>
        {column.header}
        <SortGlyph direction={direction} className="h-3.5 w-3.5" />
      </button>
    );
  }
  return column.headerHidden ? <span className="sr-only">{column.header}</span> : column.header;
}

function headerCell<T extends RowData>(v: View<T>, header: TableHeader<T>) {
  const column = v.byId.get(header.column.id);
  if (!column) return null;
  const sorted = header.column.getIsSorted();
  const direction: SortDirection | undefined = sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : undefined;
  const { style, ...pinnedProps } = pin(header.column);
  const level = priorityOf(column);
  const top = typeof v.stickyHeader === "number" ? { ["--dt-top" as string]: `${v.stickyHeader}px` } : {};
  return (
    <th
      role="columnheader"
      scope="col"
      key={header.id}
      aria-sort={column.sortable ? (direction ?? "none") : undefined}
      data-keep={column.sortable ? "" : undefined}
      {...pinnedProps}
      className={v.s.th({ className: cn(ALIGN[column.align ?? (column.type === "number" ? "end" : "start")], level > 1 && LEAVES_HEAD[v.L][level as Priority]) })}
      style={{ ...style, ...top, ...widthOf(v, header.column) }}
    >
      {headerLabel(v, header, column, direction)}
      {v.resizing && header.column.getCanResize() ? (
        <ResizeHandle
          label={v.labels.resize(column.header)}
          size={header.column.getSize()}
          min={column.minWidth ?? 64}
          resizing={header.column.getIsResizing()}
          className={v.s.resizer()}
          onPointerStart={header.getResizeHandler()}
          onSize={(size) => v.setSizing((old) => ({ ...old, [header.column.id]: size }))}
        />
      ) : null}
    </th>
  );
}

function headerRow<T extends RowData>(v: View<T>, headers: TableHeader<T>[]) {
  const { s, labels } = v;
  return (
    <tr role="row" aria-rowindex={v.virtualized ? 1 : undefined} className={s.headRow()}>
      {v.selectable && (
        <th role="columnheader" scope="col" data-keep="" className={s.th({ className: s.select() })}>
          <Checkbox
            checked={v.allChosen ? true : v.someChosen ? "indeterminate" : false}
            onCheckedChange={v.toggleAll}
            disabled={v.loading || v.selectableCount === 0}
            aria-label={labels.selectAll}
          />
        </th>
      )}
      {v.hasExpander && (
        <th role="columnheader" scope="col" className={s.th({ className: s.expander() })}>
          <span className="sr-only">{labels.details}</span>
        </th>
      )}
      {headers.map((header) => headerCell(v, header))}
    </tr>
  );
}

/** The sort, filters, selection, grouping, visibility, opened rows, page and page size — controlled or not — and the address's query. */
function useControlled<T extends RowData>(p: DataTableProps<T>, route: ReturnType<typeof useRouteTable>) {
  const { defaultSort = null, defaultFilters = NO_RECORD, defaultSelected = NONE, defaultGroupBy = NONE, defaultColumnVisibility = NO_RECORD, defaultExpanded = NO_RECORD, defaultPage = 1 } = p;
  const paginated = p.pageSize !== undefined || p.defaultPageSize !== undefined;
  const [sort, setSort] = useControllable<DataTableSort>(route ? route.sort : p.sort, defaultSort, route?.onSortChange ?? p.onSortChange);
  const [filters, setFiltersState] = useControllable<DataTableFilterState>(route ? route.filters : p.filters, defaultFilters, route?.onFiltersChange ?? p.onFiltersChange);
  const [selected, setSelected] = useControllable<readonly string[]>(p.selected, defaultSelected, p.onSelectedChange as (next: readonly string[]) => void);
  const [groupBy, setGroupBy] = useControllable<readonly string[]>(p.groupBy, defaultGroupBy, p.onGroupByChange as (next: readonly string[]) => void);
  const [visibility, setVisibility] = useControllable<Readonly<Record<string, boolean>>>(p.columnVisibility, defaultColumnVisibility, p.onColumnVisibilityChange as (next: Readonly<Record<string, boolean>>) => void);
  const [expanded, setExpanded] = useControllable<Readonly<Record<string, boolean>>>(p.expanded, defaultExpanded, p.onExpandedChange as (next: Readonly<Record<string, boolean>>) => void);
  const [pageSize, setPageSize] = useControllable<number>(p.pageSize, p.defaultPageSize ?? Number.POSITIVE_INFINITY, p.onPageSizeChange);
  const [page, setPage] = useControllable<number>(route ? route.page : p.page, defaultPage, route?.onPageChange ?? p.onPageChange);
  return { paginated, sort, setSort, filters, setFiltersState, selected, setSelected, groupBy, setGroupBy, visibility, setVisibility, expanded, setExpanded, pageSize, setPageSize, page, setPage };
}

type Controlled = ReturnType<typeof useControlled>;

/** One place announces the server's query: after any change of sort, filters, page or page size. */
function useAnnounce<T extends RowData>(p: DataTableProps<T>, c: Controlled, route: ReturnType<typeof useRouteTable>) {
  const { paginated, sort, filters, page, pageSize } = c;
  const { defaultSort = null, defaultFilters = NO_RECORD, defaultPage = 1 } = p;
  const announced = React.useRef(JSON.stringify([defaultSort, defaultFilters, paginated ? defaultPage : 1, paginated ? pageSize : null]));
  const announce = (next: Partial<DataTableQuery>) => {
    const query = { sort, filters, page: paginated ? page : 1, pageSize: paginated ? pageSize : Number.POSITIVE_INFINITY, ...next };
    if (route) announced.current = JSON.stringify([query.sort, query.filters, query.page, paginated ? query.pageSize : null]);
    p.onStateChange?.(query);
  };
  // The address can change under the table (back, forward, a shared link): the server is told the query it now shows,
  // once — a change the table made itself was announced already. A first visit on the defaults says nothing.
  const routeQuery = route ? JSON.stringify([route.sort, route.filters, paginated ? route.page : 1, paginated ? pageSize : null]) : null;
  React.useEffect(() => {
    if (routeQuery === null || routeQuery === announced.current) return;
    announced.current = routeQuery;
    announce({});
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only a change of the address's query announces
  }, [routeQuery]);
  return announce;
}

/** The changes of the query, each announced; in the address, the sort or the filters reset the page in the same navigation. */
function useQueryChanges<T extends RowData>(p: DataTableProps<T>, c: Controlled, route: ReturnType<typeof useRouteTable>) {
  const announce = useAnnounce(p, c, route);
  const resetPage = () => {
    if (c.paginated && c.page !== 1 && !route) c.setPage(1);
  };
  return {
    changeSort: (next: DataTableSort) => {
      c.setSort(next);
      resetPage();
      announce({ sort: next, page: 1 });
    },
    changeFilters: (next: DataTableFilterState) => {
      c.setFiltersState(next);
      resetPage();
      announce({ filters: next, page: 1 });
    },
    changePage: (next: number) => {
      c.setPage(next);
      announce({ page: next });
    },
    changePageSize: (next: number) => {
      c.setPageSize(next);
      c.setPage(1);
      announce({ pageSize: next, page: 1 });
    },
  };
}

type Changes = ReturnType<typeof useQueryChanges>;

const columnDefs = <T extends RowData>(columns: readonly DataTableColumn<T>[], resizing: boolean | undefined): ColumnDef<typeof features, T>[] =>
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
  }));

type Pinning = { start?: readonly string[]; end?: readonly string[] } | undefined;

/** The table's state handed to the engine, from what the props and the hooks hold. */
function engineState(c: Controlled, rowCount: number, pinned: Pinning, sizing: Record<string, number>, resizeState: ColumnResizingState | undefined) {
  return {
    sorting: sortingOf(c.sort),
    columnFilters: filterListOf(c.filters),
    rowSelection: selectionOf(c.selected),
    grouping: [...c.groupBy],
    columnVisibility: { ...c.visibility },
    expanded: { ...c.expanded },
    pagination: { pageIndex: Math.max(0, c.page - 1), pageSize: c.paginated ? c.pageSize : Math.max(1, rowCount) },
    columnPinning: { start: [...(pinned?.start ?? [])], end: [...(pinned?.end ?? [])] },
    columnSizing: sizing,
    ...(resizeState ? { columnResizing: resizeState } : {}),
  };
}

/** What the engine tells us changed: each becomes our own state, announced when it is the query. */
function engineHandlers<T extends RowData>(
  c: Controlled,
  changes: Changes,
  setSizing: React.Dispatch<React.SetStateAction<Record<string, number>>>,
  setResizeState: React.Dispatch<React.SetStateAction<ColumnResizingState | undefined>>,
  currentRows: () => TableRow<T>[],
) {
  return {
    onSortingChange: (updater: Up<ReturnType<typeof sortingOf>>) => {
      const [first] = apply(updater, sortingOf(c.sort));
      changes.changeSort(first ? { column: first.id, direction: first.desc ? "descending" : "ascending" } : null);
    },
    onColumnFiltersChange: (updater: Up<{ id: string; value: unknown }[]>) => {
      const next = apply(updater, filterListOf(c.filters));
      changes.changeFilters(Object.fromEntries(next.map((f) => [f.id, f.value as FilterValue])));
    },
    onRowSelectionChange: (updater: Up<Record<string, true>>) => {
      const next = apply(updater, selectionOf(c.selected));
      c.setSelected(Object.keys(next).filter((id) => next[id]));
    },
    onGroupingChange: (updater: Up<string[]>) => c.setGroupBy(apply(updater, [...c.groupBy])),
    onColumnVisibilityChange: (updater: Up<Record<string, boolean>>) => c.setVisibility(apply(updater, { ...c.visibility })),
    onExpandedChange: (updater: Up<Record<string, boolean> | true>) => {
      const next = apply<Record<string, boolean> | true>(updater, { ...c.expanded });
      c.setExpanded(next === true ? Object.fromEntries(currentRows().map((r) => [r.id, true])) : next);
    },
    onColumnSizingChange: (updater: Up<Record<string, number>>) => setSizing((old: Record<string, number>) => apply(updater, old)),
    onColumnResizingChange: (updater: Up<ColumnResizingState>) => setResizeState((old) => apply(updater, old as ColumnResizingState)),
  };
}

/** A table of records — sort, filters and facets, groups, details, pages, selection, visibility, pinning, resizing — on the client or the server, cards on a phone, windowing for long lists. */
export function DataTable<T extends RowData>(props: DataTableProps<T>) {
  const { rows, columns, getRowId, caption, showCaption, routeKey, selectable, bulkActions, bulkMax, bulkResult, pinning, resizing, getSubRows, renderDetail, rowLabel, pageSizeOptions, manual, rowCount } = props;
  const { loading, loadingRows: loadingCount = 5, error, empty, layout = "auto", phone = "cards", density, stickyHeader, striped, scroll, stickyFirstColumn, virtualized, toolbar, footer, className } = props;
  const labels = { ...dataTableLabels, ...props.labels };
  const L: Layout = virtualized ? "table" : layout;
  const typed = columns.some((c) => c.type || c.priority);
  const list = phone === "list" && L !== "table";
  const s = dataTable({ layout: L, density, sticky: Boolean(stickyHeader), striped: Boolean(striped), typed, phone: list ? "list" : "cards" });

  const route = useRouteTable(routeKey, { sort: props.defaultSort ?? null, page: props.defaultPage ?? 1, filters: props.defaultFilters ?? NO_RECORD }, columns.map((c) => c.id));
  const c = useControlled(props, route);
  const changes = useQueryChanges(props, c, route);
  const { paginated, page, pageSize, selected, setSelected } = c;
  const [sizing, setSizing] = React.useState<Record<string, number>>({});
  const [resizeState, setResizeState] = React.useState<ColumnResizingState | undefined>(undefined);

  const hasExpander = Boolean(renderDetail || getSubRows);
  const maxPriority = columns.reduce<1 | Priority>((max, column) => (priorityOf(column) > max ? priorityOf(column) : max), 1);
  const titleColumn = columns.find((col) => col.card === "title" || (!col.card && col.type === "title")) ?? columns[0];
  const listAway = list ? columns.filter((col) => placeOf(titleColumn, col) === "away" && priorityOf(col) === 1) : [];
  const facts = list ? columns.filter((col) => placeOf(titleColumn, col) === "facts") : [];
  const inlineToggle = (maxPriority > 1 || listAway.length > 0) && !hasExpander;
  const detailed = Boolean(renderDetail) || inlineToggle;
  const defs = React.useMemo(() => columnDefs(columns, resizing), [columns, resizing]);

  const firstId = columns[0]?.id;
  const pinned = stickyFirstColumn && firstId && !pinning?.start?.length ? { ...pinning, start: [firstId] } : pinning;
  const table: DataTableInstance<T> = useTable<typeof features, T>({
    features,
    columns: defs,
    data: rows as T[],
    getRowId: (row) => getRowId(row),
    getSubRows: getSubRows ? (row) => getSubRows(row) as T[] | undefined : undefined,
    getRowCanExpand: detailed ? () => true : undefined,
    state: engineState(c, rows.length, pinned, sizing, resizeState),
    ...engineHandlers<T>(c, changes, setSizing, setResizeState, () => table.getRowModel().rows),
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
  }) as unknown as DataTableInstance<T>;

  const visibleColumns = table.getVisibleLeafColumns();
  const pageRows = table.getRowModel().rows;
  const leafCount = (manual?.pagination || manual?.filtering) && rowCount !== undefined ? rowCount : table.getFilteredRowModel().rows.length;
  const pageCount = paginated ? Math.max(1, manual?.pagination ? Math.ceil((rowCount ?? rows.length) / pageSize) : table.getPageCount()) : 1;
  // A page beyond the last (the filters shrank the list): show the last one.
  React.useEffect(() => {
    if (paginated && !loading && page > pageCount) changes.changePage(pageCount);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only when the count of pages drops under the page
  }, [pageCount]);

  const selectableIds = pageRows.filter((r) => !r.getIsGrouped()).map((r) => r.id);
  const chosen = new Set(selected);
  const allChosen = selectableIds.length > 0 && selectableIds.every((id) => chosen.has(id));
  const someChosen = selectableIds.some((id) => chosen.has(id));
  const toggleAll = () => setSelected(allChosen ? selected.filter((id) => !selectableIds.includes(id)) : [...new Set([...selected, ...selectableIds])]);

  const span = visibleColumns.length + (selectable ? 1 : 0) + (hasExpander ? 1 : 0);
  const fixedLayout = Boolean(resizing || pinned?.start?.length || pinned?.end?.length);
  const sideways = scroll ?? (!typed && !stickyHeader);

  const scroller = React.useRef<HTMLDivElement>(null);
  const win = useWindow(virtualized, loading, pageRows, scroller);

  const v: View<T> = {
    s, L, list, labels, byId: new Map(columns.map((col) => [col.id, col])), titleColumn, facts, listAway, maxPriority, inlineToggle, hasExpander, detailed,
    selectable: Boolean(selectable), span, chosen, virtualized: Boolean(virtualized), fixedLayout, renderDetail,
    rowLabel, visibleColumns, measureElement: win.measureElement, loading, loadingCount, error, empty, pageRows, windowItems: win.items, resizing, stickyHeader, setSizing,
    allChosen, someChosen, selectableCount: selectableIds.length, toggleAll,
  };

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
        {headerRow(v, headers as unknown as TableHeader<T>[])}
      </thead>
      <tbody role="rowgroup" className={s.tbody()}>
        {win.before > 0 && (
          <tr aria-hidden style={{ height: win.before }}>
            <td colSpan={span} />
          </tr>
        )}
        {bodyRows(v)}
        {win.after > 0 && (
          <tr aria-hidden style={{ height: win.after }}>
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
    filters: c.filters,
    setFilters: changes.changeFilters,
    resultCount: leafCount,
    exportRows: () => table.getSortedRowModel().flatRows.filter((r) => !r.getIsGrouped()).map((r) => r.original),
    manualFiltering: Boolean(manual?.filtering),
  };

  const pagination = paginated ? (
    <Pagination
      page={Math.min(page, pageCount)}
      pageCount={pageCount}
      onPageChange={changes.changePage}
      pageSize={pageSizeOptions ? pageSize : undefined}
      pageSizeOptions={pageSizeOptions}
      onPageSizeChange={pageSizeOptions ? changes.changePageSize : undefined}
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
        {selectable && bulkActions ? (
          <SelectionBar count={selected.length} max={bulkMax} result={bulkResult} labels={labels.selection} onClear={() => setSelected([])}>
            {bulkActions({ selected: [...selected], clear: () => setSelected([]) })}
          </SelectionBar>
        ) : null}
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

/** Windowing: the rows in view, between two spacer rows that keep the scroll height. */
function useWindow<T extends RowData>(virtualized: DataTableProps<T>["virtualized"], loading: boolean | undefined, pageRows: TableRow<T>[], scroller: React.RefObject<HTMLDivElement | null>) {
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
  const items = virtualized && !loading ? virtualizer.getVirtualItems() : null;
  const before = items?.[0]?.start ?? 0;
  const after = items && items.length > 0 ? virtualizer.getTotalSize() - (items.at(-1)?.end ?? 0) : 0;
  return { items, before, after, measureElement: items ? virtualizer.measureElement : undefined };
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
