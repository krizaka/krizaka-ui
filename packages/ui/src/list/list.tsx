// Client (the selection, the windowing of long lists). A list of records read top to bottom: a leading visual, a
// title and a line, trailing details and actions — dense or comfortable, selectable with a checkbox per row, windowed
// past a few hundred rows, with its loading, empty and error states. A real `<ul>`: each row a `<li>`, its main action
// a link or a button that fills the row, its secondary actions beside it (never nested in the main one).
import * as React from "react";
import { tv } from "tailwind-variants";

import { Checkbox } from "../checkbox";
import { ChevronGlyph } from "../glyphs";
import { useControllable } from "../media";

export const list = tv({
  slots: {
    root: "w-full overflow-hidden rounded-xl border border-border-default bg-surface-1",
    scroller: "overflow-y-auto focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring",
    ul: "m-0 list-none divide-y divide-border-subtle p-0",
    item: "relative flex items-center gap-3 px-4 transition-colors data-[state=selected]:bg-accent-soft has-[[data-main]:hover]:bg-surface-2/60",
    main:
      "flex min-w-0 flex-1 items-center gap-3 self-stretch text-left text-fg outline-hidden " +
      "focus-visible:after:absolute focus-visible:after:inset-0.5 focus-visible:after:rounded-lg focus-visible:after:ring-2 focus-visible:after:ring-ring",
    leading: "flex shrink-0 items-center justify-center text-fg-secondary",
    text: "flex min-w-0 flex-1 flex-col",
    title: "truncate text-sm font-semibold text-fg",
    description: "line-clamp-2 text-xs text-fg-secondary",
    meta: "flex shrink-0 flex-col items-end gap-1 text-xs tabular-nums text-fg-secondary",
    actions: "relative z-10 flex shrink-0 items-center gap-1",
    chevron: "h-4 w-4 shrink-0 text-fg-muted",
    message: "px-4 py-10 text-center text-sm text-fg-secondary",
    skeleton: "animate-pulse rounded bg-surface-3 motion-reduce:animate-none",
    footer: "border-t border-border-default px-4 py-3",
  },
  variants: {
    density: {
      comfortable: { item: "min-h-16 py-2.5" },
      compact: { item: "min-h-11 py-1.5", description: "line-clamp-1" },
    },
  },
  defaultVariants: { density: "comfortable" },
});

export type ListLabels = {
  /** The checkbox of a row: `(title) => "Select " + title`. */
  selectRow: (title: string) => string;
  /** Read while the rows load (“Loading”). */
  loading: string;
  /** The default empty state (“Nothing to show”). */
  empty: string;
};

export const listLabels: ListLabels = { selectRow: (title) => `Select ${title}`, loading: "Loading", empty: "Nothing to show" };

export type ListRow = {
  /** The row's main line — passed translated. */
  title: string;
  /** A second line (a detail, a status in words). */
  description?: React.ReactNode;
  /** Before the text: an `Avatar`, an icon, a thumbnail. */
  leading?: React.ReactNode;
  /** After the text: a time, an amount, a `Badge`. */
  meta?: React.ReactNode;
  /** Secondary actions beside the row (icon buttons, a menu) — outside the main action. */
  actions?: React.ReactNode;
  /** The row opens this address (its main action is a link). */
  href?: string;
  /** The row's main action (a button), when it is not a link. */
  onSelect?: () => void;
};

export type ListProps<T> = {
  /** The records, in order. */
  items: readonly T[];
  /** A stable id per record: the React key and the selection's value. */
  getId: (item: T) => string;
  /** What a record shows: its title, line, visuals, details, actions and where it leads. */
  row: (item: T) => ListRow;
  /** The list's accessible name (“Jobs”). */
  "aria-label": string;
  /** comfortable (default: 64 px rows with a line) · compact (44 px: dense admin lists). */
  density?: "comfortable" | "compact";
  /** A checkbox per row. */
  selectable?: boolean;
  /** The ids selected (controlled). */
  selected?: readonly string[];
  /** The ids selected at first, uncontrolled. */
  defaultSelected?: readonly string[];
  /** Called with the new selection. */
  onSelectedChange?: (selected: string[]) => void;
  /** Shows a chevron on the rows that lead somewhere. */
  chevrons?: boolean;
  /** Loading: `loadingRows` skeleton rows and `aria-busy`. */
  loading?: boolean;
  /** How many skeleton rows. Default 5. */
  loadingRows?: number;
  /** A failure in place of the rows (an `Alert` with a retry); announced. */
  error?: React.ReactNode;
  /** Shown when there is no record (an `EmptyState`). */
  empty?: React.ReactNode;
  /** Renders only the rows in view: fixed `rowHeight`, a scrolling region of `height` px. */
  virtualize?: { rowHeight: number; height: number; overscan?: number };
  /** Under the list: a `Pagination`, a “Load more” button, a total. */
  footer?: React.ReactNode;
  /** The words, passed translated; English by default. */
  labels?: Partial<ListLabels>;
  /** Classes merged on the root. */
  className?: string;
};

/** A list of records: dense or comfortable, selectable, actions beside each row, windowed when long, with its states. */
export function List<T>({
  items,
  getId,
  row,
  "aria-label": label,
  density,
  selectable,
  selected: selectedProp,
  defaultSelected = [],
  onSelectedChange,
  chevrons,
  loading,
  loadingRows = 5,
  error,
  empty,
  virtualize,
  footer,
  labels: given,
  className,
}: ListProps<T>) {
  const labels = { ...listLabels, ...given };
  const s = list({ density });
  const [selected, setSelected] = useControllable<readonly string[]>(selectedProp, defaultSelected, onSelectedChange as (next: readonly string[]) => void);
  const [scrollTop, setScrollTop] = React.useState(0);
  const chosen = new Set(selected);
  const toggle = (id: string) => setSelected(chosen.has(id) ? selected.filter((x) => x !== id) : [...selected, id]);

  let shown = items;
  let before = 0;
  let after = 0;
  if (virtualize && !loading) {
    const overscan = virtualize.overscan ?? 6;
    const start = Math.max(0, Math.floor(scrollTop / virtualize.rowHeight) - overscan);
    const end = Math.min(items.length, Math.ceil((scrollTop + virtualize.height) / virtualize.rowHeight) + overscan);
    shown = items.slice(start, end);
    before = start * virtualize.rowHeight;
    after = (items.length - end) * virtualize.rowHeight;
  }

  let body: React.ReactNode;
  if (loading) {
    body = Array.from({ length: loadingRows }, (_, i) => (
      <li key={`loading-${i}`} aria-hidden className={s.item()}>
        <div className={s.skeleton({ className: "h-9 w-9 rounded-full" })} />
        <div className="flex flex-1 flex-col gap-2">
          <div className={s.skeleton({ className: "h-3.5 w-2/5" })} />
          <div className={s.skeleton({ className: "h-3 w-3/5" })} />
        </div>
      </li>
    ));
  } else if (error) {
    body = (
      <li className={s.message()}>
        <div role="alert">{error}</div>
      </li>
    );
  } else if (items.length === 0) {
    body = <li className={s.message()}>{empty ?? labels.empty}</li>;
  } else {
    body = shown.map((item) => {
      const id = getId(item);
      const r = row(item);
      const isChosen = chosen.has(id);
      const content = (
        <>
          {r.leading ? <span className={s.leading()}>{r.leading}</span> : null}
          <span className={s.text()}>
            <span className={s.title()}>{r.title}</span>
            {r.description ? <span className={s.description()}>{r.description}</span> : null}
          </span>
          {r.meta ? <span className={s.meta()}>{r.meta}</span> : null}
          {chevrons && (r.href || r.onSelect) ? <ChevronGlyph direction="right" className={s.chevron()} /> : null}
        </>
      );
      return (
        <li key={id} data-state={isChosen ? "selected" : undefined} className={s.item()} style={virtualize ? { height: virtualize.rowHeight } : undefined}>
          {selectable ? <Checkbox checked={isChosen} onCheckedChange={() => toggle(id)} aria-label={labels.selectRow(r.title)} className="relative z-10" /> : null}
          {r.href ? (
            <a href={r.href} data-main="" className={s.main()}>
              {content}
            </a>
          ) : r.onSelect ? (
            <button type="button" data-main="" onClick={r.onSelect} className={s.main()}>
              {content}
            </button>
          ) : (
            <div className={s.main()}>{content}</div>
          )}
          {r.actions ? <div className={s.actions()}>{r.actions}</div> : null}
        </li>
      );
    });
  }

  const ul = (
    <ul aria-label={label} aria-busy={loading || undefined} className={s.ul()}>
      {before > 0 ? <li aria-hidden style={{ height: before }} /> : null}
      {body}
      {after > 0 ? <li aria-hidden style={{ height: after }} /> : null}
    </ul>
  );
  return (
    <div className={s.root({ className })}>
      {loading ? <span className="sr-only" role="status">{labels.loading}</span> : null}
      {virtualize ? (
        <div tabIndex={0} role="region" aria-label={label} className={s.scroller()} style={{ height: virtualize.height }} onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}>
          {ul}
        </div>
      ) : (
        ul
      )}
      {footer ? <div className={s.footer()}>{footer}</div> : null}
    </div>
  );
}
