// Client (sort and selection state, the windowing of long lists). A real `<table>` with a caption and column headers
// (`scope="col"`, `aria-sort` on the sorted one) that turns into a stack of cards in a narrow container — one DOM, the
// roles written out so that the change of `display` never loses the table's semantics. Selection through
// `@krizaka/ui/checkbox`; loading, empty and error states in the body; optional windowing for thousands of rows.
import * as React from "react";
import { tv } from "tailwind-variants";

import { Checkbox } from "../checkbox";
import { SortGlyph } from "../glyphs";
import { useControllable } from "../media";

export const dataTable = tv({
  slots: {
    root: "@container w-full overflow-hidden rounded-xl border border-border-default bg-surface-1",
    scroller: "w-full overflow-x-auto",
    table: "w-full border-collapse text-left text-sm text-fg",
    caption: "px-4 pt-4 pb-2 text-left text-sm font-semibold text-fg",
    thead: "bg-surface-2/60",
    headRow: "border-b border-border-default",
    th: "whitespace-nowrap px-4 py-3 text-xs font-semibold text-fg-secondary",
    sortButton:
      "-mx-1.5 inline-flex items-center gap-1 rounded-md px-1.5 py-1 hover:bg-surface-3 hover:text-fg " +
      "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring aria-[pressed=true]:text-fg",
    tbody: "",
    tr: "border-b border-border-subtle transition-colors last:border-b-0 hover:bg-surface-2/50 data-[state=selected]:bg-accent-soft",
    td: "px-4 py-3 align-middle",
    select: "w-10",
    message: "px-4 py-10 text-center text-sm text-fg-secondary",
    skeleton: "h-4 w-full max-w-40 animate-pulse rounded bg-surface-3 motion-reduce:animate-none",
    footer: "border-t border-border-default px-4 py-3",
  },
  variants: {
    layout: {
      table: {},
      // Below 36rem of container: cards. The sortable headers stay, as a row of sort buttons above the cards.
      auto: {
        table: "@max-xl:block",
        caption: "@max-xl:block",
        thead: "@max-xl:sr-only @max-xl:bg-transparent @max-xl:has-[[data-keep]]:not-sr-only @max-xl:has-[[data-keep]]:block",
        headRow: "@max-xl:flex @max-xl:flex-wrap @max-xl:items-center @max-xl:gap-2 @max-xl:px-3 @max-xl:py-2",
        th: "@max-xl:sr-only @max-xl:data-[keep]:not-sr-only @max-xl:data-[keep]:block @max-xl:p-0",
        tbody: "@max-xl:grid @max-xl:gap-3 @max-xl:p-3",
        tr: "@max-xl:relative @max-xl:grid @max-xl:gap-1.5 @max-xl:rounded-xl @max-xl:border @max-xl:border-border-default @max-xl:bg-surface-0 @max-xl:p-4 @max-xl:last:border-b",
        td:
          "@max-xl:flex @max-xl:items-baseline @max-xl:justify-between @max-xl:gap-4 @max-xl:p-0 @max-xl:text-right " +
          "@max-xl:before:shrink-0 @max-xl:before:text-xs @max-xl:before:font-semibold @max-xl:before:text-fg-secondary @max-xl:before:content-[attr(data-label)] " +
          "@max-xl:data-[card=title]:order-first @max-xl:data-[card=title]:pr-8 @max-xl:data-[card=title]:text-left @max-xl:data-[card=title]:text-base @max-xl:data-[card=title]:font-semibold @max-xl:data-[card=title]:before:content-none " +
          "@max-xl:data-[card=hidden]:hidden @max-xl:data-[card=message]:block @max-xl:data-[card=message]:text-center @max-xl:data-[card=message]:before:content-none",
        select: "@max-xl:absolute @max-xl:right-3 @max-xl:top-3 @max-xl:w-auto @max-xl:before:content-none",
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
          "flex items-baseline justify-between gap-4 p-0 text-right before:shrink-0 before:text-xs before:font-semibold before:text-fg-secondary before:content-[attr(data-label)] " +
          "data-[card=title]:order-first data-[card=title]:pr-8 data-[card=title]:text-left data-[card=title]:text-base data-[card=title]:font-semibold data-[card=title]:before:content-none " +
          "data-[card=hidden]:hidden data-[card=message]:block data-[card=message]:text-center data-[card=message]:before:content-none",
        select: "absolute right-3 top-3 w-auto before:content-none",
      },
    },
    density: {
      comfortable: {},
      compact: { th: "py-2", td: "py-1.5" },
    },
  },
  defaultVariants: { layout: "auto", density: "comfortable" },
});

export type SortDirection = "ascending" | "descending";
export type DataTableSort = { column: string; direction: SortDirection } | null;
type Sortable = string | number | boolean | Date | null | undefined;

export type DataTableColumn<T> = {
  /** A key of the column (and of the row, for the default cell and sort). */
  id: string;
  /** The column's name, passed translated: the header, and the label of the value in a card. */
  header: string;
  /** What a cell shows. Default: `value(row)`, or `row[id]`. */
  cell?: (row: T) => React.ReactNode;
  /** The value sorted on (and shown by default): a string, a number, a date. Default `row[id]`. */
  value?: (row: T) => Sortable;
  /** The header becomes a sort button (ascending → descending → none). */
  sortable?: boolean;
  /** Text alignment: `end` for amounts and counts. */
  align?: "start" | "center" | "end";
  /** A CSS width (`"8rem"`, `"30%"`). */
  width?: string;
  /** In a card: `title` (the heading of the card), `label` (default: "Header  value"), `hidden`. */
  card?: "title" | "label" | "hidden";
  /** Hides the header visually (an actions column), keeping it for screen readers. */
  headerHidden?: boolean;
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
};

export const dataTableLabels: DataTableLabels = {
  selectAll: "Select all rows",
  selectRow: (name) => `Select ${name}`,
  loading: "Loading",
  empty: "Nothing to show",
};

export type DataTableProps<T> = {
  /** The rows, in the order the server gave (sorted here unless `manualSort`). */
  rows: readonly T[];
  /** The columns, in order. */
  columns: readonly DataTableColumn<T>[];
  /** A stable id per row: the React key and the selection's value. */
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
  /** The server sorts (`onSortChange` fetches): the rows are shown as given. */
  manualSort?: boolean;
  /** Adds a checkbox per row and one in the header. */
  selectable?: boolean;
  /** The ids selected (controlled). */
  selected?: readonly string[];
  /** The ids selected at first, uncontrolled. */
  defaultSelected?: readonly string[];
  /** Called with the new selection. */
  onSelectedChange?: (selected: string[]) => void;
  /** The name of a row in its checkbox's label (default: its id). */
  rowLabel?: (row: T) => string;
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
  /** comfortable (default) · compact. */
  density?: "comfortable" | "compact";
  /** Renders only the rows in view (fixed `rowHeight`, a scrolling body of `height` px). Forces the table layout. */
  virtualize?: { rowHeight: number; height: number; overscan?: number };
  /** Under the table: a `Pagination`, a total. */
  footer?: React.ReactNode;
  /** The words, passed translated; English by default. */
  labels?: Partial<DataTableLabels>;
  /** Classes merged on the root. */
  className?: string;
};

function compare(a: Sortable, b: Sortable): number {
  if (a == null || a === "") return b == null || b === "" ? 0 : 1;
  if (b == null || b === "") return -1;
  if (a instanceof Date || b instanceof Date) return Number(a) - Number(b);
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: "base" });
}

const nextSort = (sort: DataTableSort, column: string): DataTableSort =>
  sort?.column !== column ? { column, direction: "ascending" } : sort.direction === "ascending" ? { column, direction: "descending" } : null;

const ALIGN = { start: "text-left", center: "text-center", end: "text-right" } as const;

/** A table of records: sort, selection, loading / empty / error, cards on a phone, windowing for long lists. */
export function DataTable<T>({
  rows,
  columns,
  getRowId,
  caption,
  showCaption,
  sort: sortProp,
  defaultSort = null,
  onSortChange,
  manualSort,
  selectable,
  selected: selectedProp,
  defaultSelected = [],
  onSelectedChange,
  rowLabel,
  loading,
  loadingRows = 5,
  error,
  empty,
  layout = "auto",
  density,
  virtualize,
  footer,
  labels: given,
  className,
}: DataTableProps<T>) {
  const labels = { ...dataTableLabels, ...given };
  const s = dataTable({ layout: virtualize ? "table" : layout, density });
  const [sort, setSort] = useControllable<DataTableSort>(sortProp, defaultSort, onSortChange);
  const [selected, setSelected] = useControllable<readonly string[]>(selectedProp, defaultSelected, onSelectedChange as (next: readonly string[]) => void);
  const [scrollTop, setScrollTop] = React.useState(0);

  const valueOf = (column: DataTableColumn<T>, row: T): Sortable =>
    column.value ? column.value(row) : ((row as Record<string, unknown>)[column.id] as Sortable);

  const sorted = React.useMemo(() => {
    const column = sort && columns.find((c) => c.id === sort.column);
    if (!column || manualSort) return rows;
    const factor = sort.direction === "ascending" ? 1 : -1;
    return [...rows].sort((a, b) => factor * compare(valueOf(column, a), valueOf(column, b)));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- valueOf only reads `column`
  }, [rows, columns, sort, manualSort]);

  const ids = sorted.map(getRowId);
  const chosen = new Set(selected);
  const allChosen = ids.length > 0 && ids.every((id) => chosen.has(id));
  const someChosen = ids.some((id) => chosen.has(id));
  const toggleAll = () => setSelected(allChosen ? selected.filter((id) => !ids.includes(id)) : [...new Set([...selected, ...ids])]);
  const toggle = (id: string) => setSelected(chosen.has(id) ? selected.filter((x) => x !== id) : [...selected, id]);

  const span = columns.length + (selectable ? 1 : 0);
  let windowed = sorted;
  let before = 0;
  let after = 0;
  let offset = 0;
  if (virtualize && !loading) {
    const overscan = virtualize.overscan ?? 6;
    const start = Math.max(0, Math.floor(scrollTop / virtualize.rowHeight) - overscan);
    const end = Math.min(sorted.length, Math.ceil((scrollTop + virtualize.height) / virtualize.rowHeight) + overscan);
    windowed = sorted.slice(start, end);
    before = start * virtualize.rowHeight;
    after = (sorted.length - end) * virtualize.rowHeight;
    offset = start;
  }

  const message = (content: React.ReactNode, alert?: boolean) => (
    <tr role="row" className={s.tr({ className: "hover:bg-transparent" })}>
      <td role="cell" colSpan={span} data-card="message" className={s.td({ className: s.message() })}>
        {alert ? <div role="alert">{content}</div> : content}
      </td>
    </tr>
  );

  let body: React.ReactNode;
  if (loading) {
    body = Array.from({ length: loadingRows }, (_, i) => (
      <tr role="row" key={`loading-${i}`} aria-hidden className={s.tr()}>
        {selectable && <td role="cell" className={s.td({ className: s.select() })} />}
        {columns.map((column) => (
          <td role="cell" key={column.id} data-card={column.card === "title" ? "title" : column.card === "hidden" ? "hidden" : undefined} className={s.td()}>
            <div className={s.skeleton()} />
          </td>
        ))}
      </tr>
    ));
  } else if (error) body = message(error, true);
  else if (sorted.length === 0) body = message(empty ?? labels.empty);
  else {
    body = windowed.map((row, i) => {
      const id = getRowId(row);
      const isChosen = chosen.has(id);
      return (
        <tr
          role="row"
          key={id}
          aria-rowindex={virtualize ? offset + i + 2 : undefined}
          data-state={isChosen ? "selected" : undefined}
          className={s.tr()}
          style={virtualize ? { height: virtualize.rowHeight } : undefined}
        >
          {selectable && (
            <td role="cell" className={s.td({ className: s.select() })}>
              <Checkbox checked={isChosen} onCheckedChange={() => toggle(id)} aria-label={labels.selectRow(rowLabel ? rowLabel(row) : id)} />
            </td>
          )}
          {columns.map((column) => (
            <td
              role="cell"
              key={column.id}
              data-label={column.header}
              data-card={column.card === "title" ? "title" : column.card === "hidden" ? "hidden" : undefined}
              className={s.td({ className: ALIGN[column.align ?? "start"] })}
            >
              {column.cell ? column.cell(row) : String(valueOf(column, row) ?? "")}
            </td>
          ))}
        </tr>
      );
    });
  }

  const table = (
    <table
      role="table"
      aria-busy={loading || undefined}
      aria-rowcount={virtualize ? sorted.length + 1 : undefined}
      className={s.table()}
    >
      <caption className={showCaption ? s.caption() : "sr-only"}>
        {caption}
        {loading ? <span className="sr-only">{` — ${labels.loading}`}</span> : null}
      </caption>
      <thead role="rowgroup" className={s.thead({ className: virtualize ? "sticky top-0 z-10 bg-surface-2" : undefined })}>
        <tr role="row" aria-rowindex={virtualize ? 1 : undefined} className={s.headRow()}>
          {selectable && (
            <th role="columnheader" scope="col" data-keep="" className={s.th({ className: s.select() })}>
              <Checkbox
                checked={allChosen ? true : someChosen ? "indeterminate" : false}
                onCheckedChange={toggleAll}
                disabled={loading || ids.length === 0}
                aria-label={labels.selectAll}
              />
            </th>
          )}
          {columns.map((column) => {
            const direction = sort?.column === column.id ? sort.direction : undefined;
            return (
              <th
                role="columnheader"
                scope="col"
                key={column.id}
                aria-sort={column.sortable ? (direction ?? "none") : undefined}
                data-keep={column.sortable ? "" : undefined}
                className={s.th({ className: ALIGN[column.align ?? "start"] })}
                style={column.width ? { width: column.width } : undefined}
              >
                {column.sortable ? (
                  <button type="button" aria-pressed={Boolean(direction)} className={s.sortButton()} onClick={() => setSort(nextSort(sort, column.id))}>
                    {column.header}
                    <SortGlyph direction={direction} className="h-3.5 w-3.5" />
                  </button>
                ) : column.headerHidden ? (
                  <span className="sr-only">{column.header}</span>
                ) : (
                  column.header
                )}
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

  return (
    <div className={s.root({ className })}>
      {virtualize ? (
        // A scrolling region the keyboard can reach: Tab lands on it, the arrows scroll it.
        <div
          tabIndex={0}
          role="region"
          aria-label={caption}
          className={s.scroller({ className: "overflow-y-auto focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring" })}
          style={{ height: virtualize.height }}
          onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
        >
          {table}
        </div>
      ) : (
        <div className={s.scroller()}>{table}</div>
      )}
      {footer ? <div className={s.footer()}>{footer}</div> : null}
    </div>
  );
}
