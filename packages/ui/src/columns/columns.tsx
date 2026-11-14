// Server-safe. Layouts that decide on the width of the room they sit in — their container, never the viewport or a device —
// like the native `Grid` and `Columns` (src/native/grid.tsx), with the same props and the same size classes
// (compact < 600 px, regular < 840 px, expanded from there). No JS measures anything: `Grid` is a CSS container
// (`@container`) whose columns come from the size class of that container, and `Columns` stacks by container-relative
// sizing (a `flex-basis` that is huge below the width the columns need and zero above it). Every width is in `rem`, so a
// larger text size grows the room an item needs: at 200 % a card that held two per row stacks into one. The order is the
// reading order and it mirrors in `rtl`: no physical edge is used.
import * as React from "react";
import { tv } from "tailwind-variants";

/** The size class of a container: where each one begins, in px of the room (Material's window size classes, as on native). */
export const SIZE_CLASS_FROM = { regular: 600, expanded: 840 } as const;

/** The gap tokens, in px — the spacing scale (`gap-1` … `gap-6`), the same numbers as native. */
export const GRID_GAPS = { none: 0, xs: 4, sm: 8, md: 12, lg: 16, xl: 24 } as const;
export type GridGap = keyof typeof GRID_GAPS;

/** How many columns per size class, or one number for all. A size class left out takes the one before it (compact → regular → expanded). */
export type GridColumns = number | Partial<Record<"compact" | "regular" | "expanded", number>>;

/** One column on a compact room, two on a regular one, three on an expanded one. */
export const DEFAULT_COLUMNS = { compact: 1, regular: 2, expanded: 3 } as const;

const PX_PER_REM = 16;
const rem = (px: number) => `${px / PX_PER_REM}rem`;

export const columnsLayout = tv({
  slots: {
    // `@container`: the grid reads the width of this element. The track inside switches its columns at its widths.
    grid: "@container w-full min-w-0",
    track:
      "grid [--kz-grid-cols:var(--kz-grid-compact)] @min-[600px]:[--kz-grid-cols:var(--kz-grid-regular)] @min-[840px]:[--kz-grid-cols:var(--kz-grid-expanded)]",
    cell: "flex min-w-0 flex-col",
    columns: "flex w-full min-w-0 flex-wrap",
    column: "min-w-0",
  },
  variants: {
    gap: Object.fromEntries(
      Object.entries({ none: "gap-0", xs: "gap-1", sm: "gap-2", md: "gap-3", lg: "gap-4", xl: "gap-6" }).map(([name, cls]) => [name, { track: cls, columns: cls }]),
    ) as Record<GridGap, { track: string; columns: string }>,
    equalHeight: { true: { track: "items-stretch", cell: "*:flex-1" }, false: { track: "items-start" } },
  },
});

/** The columns of a size class: a size class left out takes the one before it. */
export function columnsFor(columns: GridColumns | undefined, sizeClass: keyof typeof DEFAULT_COLUMNS): number {
  const asked = columns ?? DEFAULT_COLUMNS;
  if (typeof asked === "number") return Math.max(1, Math.floor(asked));
  const order = ["compact", "regular", "expanded"] as const;
  for (let i = order.indexOf(sizeClass); i >= 0; i--) {
    const value = asked[order[i] as (typeof order)[number]];
    if (value) return Math.max(1, Math.floor(value));
  }
  return 1;
}

export type GridProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** The items. Each is one cell. */
  children: React.ReactNode;
  /** Columns per size class of the container the grid is in (default 1 · 2 · 3), or one number. A ceiling: it drops when `minItemWidth` does not fit. */
  columns?: GridColumns;
  /** No cell is narrower than this, in px (default 160); it grows with the text scale. */
  minItemWidth?: number;
  /** The space between cells (default `md`). */
  gap?: GridGap;
  /** The most columns, whatever the container (default 6). */
  maxColumns?: number;
  /** The cells of a row are as tall as the tallest (default true); `false` lets each keep its own height. */
  equalHeight?: boolean;
  /** The text scale to lay out for, on top of the browser's (widths are in `rem`, so a larger text size is followed already). Pass 2 to see 200 % text. */
  fontScale?: number;
};

/**
 * A grid that fits its container: the columns come from the size class of the container's width, and no cell is narrower
 * than `minItemWidth`, so nothing overflows in a page, a side panel or a split. The order mirrors in right-to-left.
 */
export function Grid({ children, columns, minItemWidth = 160, gap = "md", maxColumns = 6, equalHeight = true, fontScale = 1, "aria-label": label, className, style, ...props }: GridProps) {
  const s = columnsLayout({ gap, equalHeight });
  const items = React.Children.toArray(children);
  const cap = Math.max(1, Math.floor(maxColumns));
  const at = (sizeClass: keyof typeof DEFAULT_COLUMNS) => Math.min(columnsFor(columns, sizeClass), cap);
  const vars = {
    "--kz-grid-compact": at("compact"),
    "--kz-grid-regular": at("regular"),
    "--kz-grid-expanded": at("expanded"),
    "--kz-grid-min": rem(minItemWidth * Math.max(1, fontScale)),
    "--kz-grid-gap": rem(GRID_GAPS[gap]),
    // As many tracks as `--kz-grid-cols` allows, none narrower than the minimum: the ceiling drops on its own.
    gridTemplateColumns:
      "repeat(auto-fill, minmax(max(var(--kz-grid-min), calc((100% - (var(--kz-grid-cols) - 1) * var(--kz-grid-gap)) / var(--kz-grid-cols))), 1fr))",
  } as React.CSSProperties;
  // A labelled grid is a list: real <ul>/<li> (native semantics on every device), never a div with an ARIA role.
  const Track = label ? "ul" : "div";
  const Cell = label ? "li" : "div";
  return (
    <div className={s.grid({ className })} style={style} {...props}>
      <Track className={s.track({ className: label ? "m-0 list-none p-0" : undefined })} style={vars} aria-label={label}>
        {items.map((child, index) => (
          <Cell key={React.isValidElement(child) && child.key != null ? child.key : index} className={s.cell()}>
            {child}
          </Cell>
        ))}
      </Track>
    </div>
  );
}

export type ColumnsProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** The columns, in reading order (the first is at the start edge, on the right in right-to-left). */
  children: React.ReactNode;
  /** The share of each column (default equal); `[1, 2]` is a third and two thirds. */
  weights?: readonly number[];
  /** Below this width per column, in px, the columns stack top to bottom (default 280); it grows with the text scale. */
  minColumnWidth?: number;
  /** The space between columns, and between stacked ones (default `lg`). */
  gap?: GridGap;
  /** The text scale to lay out for, on top of the browser's. Pass 2 to see 200 % text. */
  fontScale?: number;
};

/** The width, in px, that `count` columns need to sit side by side. */
export function columnsNeed(count: number, minColumnWidth: number, gapPx: number, fontScale = 1): number {
  return count * minColumnWidth * Math.max(1, fontScale) + gapPx * (count - 1);
}

/**
 * A few columns that sit side by side when their container holds them and stack when it does not — the master and the
 * detail, a form and its summary. Stacked, they keep their order and each takes the full width.
 */
export function Columns({ children, weights, minColumnWidth = 280, gap = "lg", fontScale = 1, className, style, ...props }: ColumnsProps) {
  const s = columnsLayout({ gap });
  const items = React.Children.toArray(children);
  const need = columnsNeed(items.length, minColumnWidth, GRID_GAPS[gap], fontScale);
  const side = items.length > 1;
  return (
    <div
      className={s.columns({ className })}
      style={{ "--kz-columns-need": rem(need), ...style } as React.CSSProperties}
      data-layout="columns"
      {...props}
    >
      {items.map((child, index) => (
        <div
          key={React.isValidElement(child) && child.key != null ? child.key : index}
          className={s.column()}
          // Container-relative: a basis above the row's width wraps the column onto its own line (stacked, full width);
          // below it the basis is 0 and the free space is shared by weight.
          style={{ flexGrow: weights?.[index] ?? 1, flexBasis: side ? "calc((var(--kz-columns-need) - 100%) * 999)" : "100%" }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
