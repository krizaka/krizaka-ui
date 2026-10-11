// Server-safe: no hook, no context. A `<nav>` named by `labels.nav`; the current page is `aria-current="page"`.
// Two modes: pages (`page` + `pageCount`: numbers with ellipses, which fold into "Page 3 of 12" in a narrow container)
// and cursor (`hasPrevious` / `hasNext`: an API that only knows the next and previous pages). Links (`getHref`) when
// the page lives in the address — the right default for a list a search engine or a shared link should reach — or
// buttons (`onPageChange`).
import type * as React from "react";
import { tv } from "tailwind-variants";

import { ChevronGlyph } from "../glyphs";

export const pagination = tv({
  slots: {
    root: "@container flex w-full flex-wrap items-center justify-between gap-3 text-sm",
    list: "flex items-center gap-1",
    pages: "hidden items-center gap-1 @md:flex",
    compact: "px-2 text-xs font-semibold tabular-nums text-fg-secondary @md:hidden",
    item:
      "inline-flex h-9 min-w-9 select-none items-center justify-center gap-1.5 rounded-lg px-2.5 text-sm font-semibold tabular-nums text-fg-secondary " +
      "transition-colors hover:bg-surface-2 hover:text-fg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring " +
      "aria-[current=page]:bg-accent aria-[current=page]:text-on-accent aria-[current=page]:hover:bg-accent " +
      "aria-disabled:pointer-events-none aria-disabled:opacity-40 disabled:pointer-events-none disabled:opacity-40",
    edge: "border border-border-default bg-surface-1 px-3",
    ellipsis: "inline-flex h-9 min-w-6 items-end justify-center pb-2 text-fg-muted",
    status: "text-xs text-fg-secondary tabular-nums",
    size: "flex items-center gap-2 text-xs text-fg-secondary",
    select:
      "h-9 rounded-lg border border-border-default bg-surface-2 px-2 text-sm text-fg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring",
  },
});

export type PaginationLabels = {
  /** The accessible name of the navigation ("Pagination", "Pages of results"). */
  nav: string;
  /** The previous-page control. */
  previous: string;
  /** The next-page control. */
  next: string;
  /** The accessible name of a page number: `(3) => "Page 3"`. */
  page: (page: number) => string;
  /** The folded form, in a narrow container: `(3, 12) => "Page 3 of 12"`. */
  compact: (page: number, pageCount: number) => string;
  /** The label of the page-size select ("Rows per page"). */
  pageSize: string;
};

/** The English words, for a quick start — pass your translations through `labels`. */
export const paginationLabels: PaginationLabels = {
  nav: "Pagination",
  previous: "Previous",
  next: "Next",
  page: (page) => `Page ${page}`,
  compact: (page, count) => `Page ${page} of ${count}`,
  pageSize: "Rows per page",
};

/**
 * The pages to show: the first and last `boundaries`, the current page and its `siblings`, and `"…"` where pages are
 * skipped. A gap of a single page shows that page instead of an ellipsis; few pages are all shown.
 */
export function pageRange(page: number, pageCount: number, siblings = 1, boundaries = 1): (number | "…")[] {
  // Few enough pages to show them all in the room the folded form takes: no ellipsis.
  if (pageCount <= 2 * boundaries + 2 * siblings + 3) return Array.from({ length: Math.max(0, pageCount) }, (_, i) => i + 1);
  const pages = new Set<number>();
  for (let i = 1; i <= Math.min(boundaries, pageCount); i += 1) pages.add(i);
  for (let i = Math.max(1, pageCount - boundaries + 1); i <= pageCount; i += 1) pages.add(i);
  for (let i = Math.max(1, page - siblings); i <= Math.min(pageCount, page + siblings); i += 1) pages.add(i);
  const sorted = [...pages].sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  sorted.forEach((n, i) => {
    const prev = sorted[i - 1];
    if (prev !== undefined && n - prev === 2) out.push(prev + 1);
    else if (prev !== undefined && n - prev > 2) out.push("…");
    out.push(n);
  });
  return out;
}

export type PaginationProps = Omit<React.ComponentProps<"nav">, "children"> & {
  /** Pages mode: the current page, from 1. */
  page?: number;
  /** Pages mode: how many pages there are. Without it, the pagination is in cursor mode. */
  pageCount?: number;
  /** Called with the page asked for (buttons). Ignored for the pages `getHref` turns into links. */
  onPageChange?: (page: number) => void;
  /** The address of a page: the pages become links (crawlable, shareable, the state in the URL). */
  getHref?: (page: number) => string;
  /** Cursor mode: whether there is a previous page. */
  hasPrevious?: boolean;
  /** Cursor mode: whether there is a next page. */
  hasNext?: boolean;
  /** Cursor mode: called by the previous control. */
  onPrevious?: () => void;
  /** Cursor mode: called by the next control. */
  onNext?: () => void;
  /** Pages shown on each side of the current one. Default 1. */
  siblings?: number;
  /** Pages always shown at each end. Default 1. */
  boundaries?: number;
  /** A text beside the controls, read as is: "41–60 of 1,284", "12 results". */
  status?: React.ReactNode;
  /** The page size, with `pageSizeOptions` and `onPageSizeChange`: a select of rows per page. */
  pageSize?: number;
  /** The sizes offered (`[10, 20, 50]`). */
  pageSizeOptions?: readonly number[];
  /** Called with the size chosen. */
  onPageSizeChange?: (size: number) => void;
  /** Disables every control (a page is loading). */
  disabled?: boolean;
  /** The words, passed translated; English by default. */
  labels?: Partial<PaginationLabels>;
};

type ItemProps = {
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  current?: boolean;
  label: string;
  className: string;
  children: React.ReactNode;
};

function Item({ href, onClick, disabled, current, label, className, children }: ItemProps) {
  const common = { "aria-label": label, "aria-current": current ? ("page" as const) : undefined, className };
  if (href && !disabled) {
    return (
      <a href={href} onClick={onClick} {...common}>
        {children}
      </a>
    );
  }
  if (href) {
    return (
      <a role="link" aria-disabled {...common}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} disabled={disabled} {...common}>
      {children}
    </button>
  );
}

/** Moves through a long list: page numbers (folded on a narrow screen) or previous / next on a cursor. */
export function Pagination({
  page = 1,
  pageCount,
  onPageChange,
  getHref,
  hasPrevious,
  hasNext,
  onPrevious,
  onNext,
  siblings = 1,
  boundaries = 1,
  status,
  pageSize,
  pageSizeOptions,
  onPageSizeChange,
  disabled,
  labels: given,
  className,
  ...props
}: PaginationProps) {
  const s = pagination();
  const labels = { ...paginationLabels, ...given };
  const paged = pageCount !== undefined;
  const count = Math.max(1, pageCount ?? 1);
  const current = Math.min(Math.max(1, page), count);
  const canPrevious = paged ? current > 1 : Boolean(hasPrevious);
  const canNext = paged ? current < count : Boolean(hasNext);
  const go = (target: number) => () => onPageChange?.(target);
  const href = (target: number) => (paged && getHref ? getHref(target) : undefined);

  return (
    <nav aria-label={labels.nav} className={s.root({ className })} {...props}>
      {status !== undefined || pageSizeOptions ? (
        <div className="flex flex-wrap items-center gap-4">
          {status !== undefined && <p className={s.status()}>{status}</p>}
          {pageSizeOptions && pageSize !== undefined && (
            <label className={s.size()}>
              {labels.pageSize}
              <select
                className={s.select()}
                value={pageSize}
                disabled={disabled}
                onChange={(event) => onPageSizeChange?.(Number(event.target.value))}
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
      ) : null}
      <ul className={s.list()}>
        <li>
          <Item
            href={href(current - 1)}
            onClick={paged ? go(current - 1) : onPrevious}
            disabled={disabled || !canPrevious}
            label={labels.previous}
            className={s.item({ className: s.edge() })}
          >
            <ChevronGlyph direction="left" />
            <span className="hidden @lg:inline">{labels.previous}</span>
          </Item>
        </li>
        {paged && (
          <>
            <li className={s.pages()}>
              <ul className="contents">
                {pageRange(current, count, siblings, boundaries).map((n, i) =>
                  n === "…" ? (
                    <li key={`gap-${i}`} aria-hidden className={s.ellipsis()}>
                      …
                    </li>
                  ) : (
                    <li key={n}>
                      <Item href={href(n)} onClick={go(n)} disabled={disabled} current={n === current} label={labels.page(n)} className={s.item()}>
                        {n}
                      </Item>
                    </li>
                  ),
                )}
              </ul>
            </li>
            <li className={s.compact()}>
              {labels.compact(current, count)}
            </li>
          </>
        )}
        <li>
          <Item
            href={href(current + 1)}
            onClick={paged ? go(current + 1) : onNext}
            disabled={disabled || !canNext}
            label={labels.next}
            className={s.item({ className: s.edge() })}
          >
            <span className="hidden @lg:inline">{labels.next}</span>
            <ChevronGlyph direction="right" />
          </Item>
        </li>
      </ul>
    </nav>
  );
}
