// Client (a scroll position, measured items). Long lists and galleries rendered by what is in view, on TanStack Virtual
// v3 behind the Krizaka facade (ADR-001: a product imports `@krizaka/ui/virtual`, never `@tanstack/*`). A list is a
// focusable scrolling region holding a `role="list"` whose items say where they stand in the whole (`aria-setsize`,
// `aria-posinset`), so a screen reader knows "item 4,812 of 50,000" though only twenty exist in the page.
import {
  measureElement as measureTanStack,
  observeElementRect,
  type ReactVirtualizer,
  useVirtualizer as useTanStackVirtualizer,
  useWindowVirtualizer as useTanStackWindowVirtualizer,
  type VirtualItem,
  type Virtualizer as TanStackVirtualizer,
} from "@tanstack/react-virtual";
import * as React from "react";
import { tv } from "tailwind-variants";

import { useLatest, usePrefersReducedMotion } from "../media";

export type { VirtualItem };

export const virtual = tv({
  slots: {
    viewport:
      "relative w-full overflow-auto overscroll-contain rounded-xl focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring",
    list: "relative w-full",
    item: "absolute top-0 left-0 w-full",
    row: "absolute top-0 left-0 grid w-full",
    empty: "px-4 py-10 text-center text-sm text-fg-secondary",
  },
});

/** What a list or a grid can be asked to do from outside (`ref`). */
export type VirtualHandle = {
  /** Scrolls the item at `index` into view — smoothly, unless the person asked for less motion. */
  scrollToIndex: (index: number, align?: "start" | "center" | "end" | "auto") => void;
};

/** The window virtualizer of TanStack Virtual (a feed that scrolls the page), re-exported through the facade. */
export const useWindowVirtualizer = useTanStackWindowVirtualizer;
/** The element virtualizer of TanStack Virtual (anything the components do not cover), re-exported through the facade. */
export const useVirtualizer = useTanStackVirtualizer;
export type Virtualizer<S extends Element | Window = Element, I extends Element = Element> = ReactVirtualizer<S, I>;

type Size = number | ((index: number) => number);

/**
 * TanStack's observer of the scrolling element's size, falling back to the declared height while the element has no
 * layout (not yet in the page, in a hidden tab, under a DOM without layout such as a test): the rows of the first
 * screen are rendered at once instead of none.
 */
/** TanStack's measure of an item, falling back to the estimate while it has no layout (0 px). */
export const measureWithFallback =
  (estimate: (index: number) => number) =>
  <S extends Element | Window, I extends Element>(element: I, entry: ResizeObserverEntry | undefined, instance: TanStackVirtualizer<S, I>) => {
    const size = measureTanStack(element, entry, instance);
    return size > 0 ? size : estimate(Number(element.getAttribute("data-index") ?? 0));
  };

/** The fallbacks as stable options (a new function at each render would re-observe the element at each render). */
export function useLayoutFallbacks(height: number, estimate: Size) {
  const estimateOf = sizeOf(estimate);
  const key = typeof estimate === "number" ? estimate : 0;
  // eslint-disable-next-line react-hooks/exhaustive-deps -- a function estimate is read through its latest value
  return React.useMemo(() => ({ observeElementRect: observeRectWithFallback(height), measureElement: measureWithFallback(estimateOf) }), [height, key]);
}

export const observeRectWithFallback =
  (height: number) =>
  <S extends Element, I extends Element>(instance: TanStackVirtualizer<S, I>, callback: (rect: { width: number; height: number }) => void) =>
    observeElementRect(instance, (rect) => callback(rect.height > 0 ? rect : { width: rect.width, height }));
const sizeOf = (size: Size) => (typeof size === "number" ? () => size : size);

/** Calls `onEndReached` once each time the last rendered item comes within `threshold` items of the end. */
function useEndReached(items: readonly VirtualItem[], count: number, threshold: number, onEndReached: (() => void) | undefined) {
  const latest = useLatest(onEndReached);
  const last = items.at(-1)?.index ?? -1;
  const reached = count > 0 && last >= count - 1 - threshold;
  const firedAt = React.useRef(-1);
  React.useEffect(() => {
    if (!reached || firedAt.current === count) return;
    firedAt.current = count;
    latest.current?.();
  }, [reached, count, latest]);
}

function useHandle(ref: React.Ref<VirtualHandle> | undefined, virtualizer: { scrollToIndex: (index: number, options: { align: "start" | "center" | "end" | "auto"; behavior: ScrollBehavior }) => void }, toIndex: (i: number) => number) {
  const reduce = usePrefersReducedMotion();
  React.useImperativeHandle(
    ref,
    () => ({ scrollToIndex: (index, align = "auto") => virtualizer.scrollToIndex(toIndex(index), { align, behavior: reduce ? "auto" : "smooth" }) }),
    [virtualizer, reduce, toIndex],
  );
}

export type VirtualListProps<T> = {
  /** The items, all of them: only those in view (and `overscan` around) are rendered. */
  items: readonly T[];
  /** Draws one item. */
  renderItem: (item: T, index: number) => React.ReactNode;
  /** A stable key per item (an id): keeps measurements on the right item when the list changes. Default: the index. */
  getKey?: (item: T, index: number) => string | number;
  /** The size of an item in px, or a guess per index; each item is then measured (dynamic sizes). */
  estimateSize: Size;
  /** The accessible name of the list ("Messages", "Events"), passed translated. */
  label: string;
  /** `self` (default): the list scrolls in its own region of `height`. `window`: the page scrolls (a feed). */
  scroll?: "self" | "window";
  /** The height of the scrolling region (`self`): px or any CSS length. Default 400. */
  height?: number | string;
  /** Items rendered beyond the visible ones, on each side. Default 6. */
  overscan?: number;
  /** Space between two items, in px. Default 0. */
  gap?: number;
  /** Called when the end comes near (load the next page): once per length of `items`. */
  onEndReached?: () => void;
  /** How many items before the end `onEndReached` fires. Default 5. */
  endReachedThreshold?: number;
  /** Shown instead of the list when there is no item. */
  empty?: React.ReactNode;
  /** Shown after the last item (a spinner while the next page loads). */
  footer?: React.ReactNode;
  /** `scrollToIndex` from outside. */
  ref?: React.Ref<VirtualHandle>;
  /** Classes merged on the scrolling region (`self`) or the list (`window`). */
  className?: string;
};

/**
 * A long list rendered by what is in view: fixed or measured sizes, its own scrolling region or the page's, the end
 * announced for infinite loading, items placed in the whole for assistive technology.
 */
export function VirtualList<T>({
  items,
  renderItem,
  getKey,
  estimateSize,
  label,
  scroll = "self",
  height = 400,
  overscan = 6,
  gap = 0,
  onEndReached,
  endReachedThreshold = 5,
  empty,
  footer,
  ref,
  className,
}: VirtualListProps<T>) {
  const s = virtual();
  const viewport = React.useRef<HTMLDivElement>(null);
  const list = React.useRef<HTMLDivElement>(null);
  const [margin, setMargin] = React.useState(0);
  const fallbacks = useLayoutFallbacks(typeof height === "number" ? height : 400, estimateSize);
  const common = {
    measureElement: fallbacks.measureElement,
    count: items.length,
    estimateSize: sizeOf(estimateSize),
    overscan,
    gap,
    getItemKey: (index: number) => (getKey ? getKey(items[index] as T, index) : index),
  };
  // Both hooks run on every render (the rules of hooks); the unused one is disabled. TanStack Virtual's instance is
  // mutable by design: React Compiler skips this component, which re-renders on the virtualizer's own updates.
  // eslint-disable-next-line react-hooks/incompatible-library -- the virtualizer drives the renders of this component
  const self = useTanStackVirtualizer({
    ...common,
    getScrollElement: () => viewport.current,
    initialRect: { width: 0, height: typeof height === "number" ? height : 400 },
    observeElementRect: fallbacks.observeElementRect,
    enabled: scroll === "self",
  });
  const page = useTanStackWindowVirtualizer({
    ...common,
    scrollMargin: margin,
    initialRect: { width: 0, height: typeof window === "undefined" ? 800 : window.innerHeight },
    enabled: scroll === "window",
  });
  const virtualizer = scroll === "window" ? page : self;
  React.useLayoutEffect(() => {
    if (scroll === "window" && list.current) setMargin(list.current.getBoundingClientRect().top + window.scrollY);
  }, [scroll]);
  const virtualItems = virtualizer.getVirtualItems();
  useEndReached(virtualItems, items.length, endReachedThreshold, onEndReached);
  useHandle(ref, virtualizer, React.useCallback((i: number) => i, []));

  const offset = scroll === "window" ? virtualizer.options.scrollMargin : 0;
  const body =
    items.length === 0 && empty ? (
      <div className={s.empty()}>{empty}</div>
    ) : (
      <div ref={list} role="list" aria-label={scroll === "window" ? label : undefined} className={s.list({ className: scroll === "window" ? className : undefined })} style={{ height: virtualizer.getTotalSize() }}>
        {virtualItems.map((item) => (
          <div
            role="listitem"
            key={item.key}
            data-index={item.index}
            ref={virtualizer.measureElement}
            aria-setsize={items.length}
            aria-posinset={item.index + 1}
            className={s.item()}
            style={{ transform: `translateY(${item.start - offset}px)` }}
          >
            {renderItem(items[item.index] as T, item.index)}
          </div>
        ))}
      </div>
    );

  if (scroll === "window")
    return (
      <>
        {body}
        {footer}
      </>
    );
  return (
    // A scrolling region the keyboard can reach: Tab lands on it, the arrows and Page keys scroll it.
    <div ref={viewport} tabIndex={0} role="region" aria-label={label} className={s.viewport({ className })} style={{ height }}>
      {body}
      {footer}
    </div>
  );
}

export type VirtualGridProps<T> = {
  /** The items, all of them: only the rows in view are rendered. */
  items: readonly T[];
  /** Draws one cell (a card, a thumbnail). */
  renderItem: (item: T, index: number) => React.ReactNode;
  /** A stable key per item. Default: the index. */
  getKey?: (item: T, index: number) => string | number;
  /** The height of a row in px (a guess: rows are measured). */
  estimateRowHeight: number;
  /** The accessible name of the grid of items ("Videos"), passed translated. */
  label: string;
  /** A fixed number of columns. Without it, as many columns of at least `minItemWidth` as the width allows. */
  columns?: number;
  /** The narrowest a cell may be, in px, when `columns` is not set. Default 220. */
  minItemWidth?: number;
  /** The height of the scrolling region: px or any CSS length. Default 480. */
  height?: number | string;
  /** Space between cells, in px. Default 16. */
  gap?: number;
  /** Rows rendered beyond the visible ones. Default 3. */
  overscan?: number;
  /** Called when the last rows come near (load the next page). */
  onEndReached?: () => void;
  /** Shown instead of the grid when there is no item. */
  empty?: React.ReactNode;
  /** Shown after the last row. */
  footer?: React.ReactNode;
  /** `scrollToIndex` (of an item) from outside. */
  ref?: React.Ref<VirtualHandle>;
  /** Classes merged on the scrolling region. */
  className?: string;
};

/** The number of columns a width holds at `minItemWidth` each (at least one). */
export const columnsFor = (width: number, minItemWidth: number, gap: number) => Math.max(1, Math.floor((width + gap) / (minItemWidth + gap)));

/** A gallery rendered by the rows in view: as many columns as the width allows (or a fixed number), measured rows. */
export function VirtualGrid<T>({
  items,
  renderItem,
  getKey,
  estimateRowHeight,
  label,
  columns: fixed,
  minItemWidth = 220,
  height = 480,
  gap = 16,
  overscan = 3,
  onEndReached,
  empty,
  footer,
  ref,
  className,
}: VirtualGridProps<T>) {
  const s = virtual();
  const viewport = React.useRef<HTMLDivElement>(null);
  const [width, setWidth] = React.useState(0);
  React.useLayoutEffect(() => {
    const element = viewport.current;
    if (!element || fixed) return;
    setWidth(element.clientWidth);
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(([entry]) => entry && setWidth(entry.contentRect.width));
    observer.observe(element);
    return () => observer.disconnect();
  }, [fixed]);
  const columns = fixed ?? (width > 0 ? columnsFor(width, minItemWidth, gap) : 1);
  const rows = Math.ceil(items.length / columns);
  const fallbacks = useLayoutFallbacks(typeof height === "number" ? height : 480, estimateRowHeight);
  // eslint-disable-next-line react-hooks/incompatible-library -- the virtualizer drives the renders of this component
  const virtualizer = useTanStackVirtualizer({
    ...fallbacks,
    count: rows,
    estimateSize: () => estimateRowHeight,
    overscan,
    gap,
    getScrollElement: () => viewport.current,
    initialRect: { width: 0, height: typeof height === "number" ? height : 480 },
    getItemKey: (row) => (getKey && items[row * columns] !== undefined ? getKey(items[row * columns] as T, row * columns) : row),
  });
  const virtualRows = virtualizer.getVirtualItems();
  useEndReached(virtualRows, rows, 1, onEndReached);
  useHandle(ref, virtualizer, React.useCallback((i: number) => Math.floor(i / columns), [columns]));

  return (
    <div ref={viewport} tabIndex={0} role="region" aria-label={label} className={s.viewport({ className })} style={{ height }}>
      {items.length === 0 && empty ? (
        <div className={s.empty()}>{empty}</div>
      ) : (
        <div role="list" className={s.list()} style={{ height: virtualizer.getTotalSize() }}>
          {virtualRows.map((row) => (
            <div
              key={row.key}
              data-index={row.index}
              ref={virtualizer.measureElement}
              className={s.row()}
              style={{ transform: `translateY(${row.start}px)`, gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, gap }}
            >
              {items.slice(row.index * columns, row.index * columns + columns).map((item, i) => {
                const index = row.index * columns + i;
                return (
                  <div role="listitem" key={getKey ? getKey(item, index) : index} aria-setsize={items.length} aria-posinset={index + 1} className="min-w-0">
                    {renderItem(item, index)}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
      {footer}
    </div>
  );
}
