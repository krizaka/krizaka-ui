// Native — layouts that choose their columns from the width they are given, never from a device name. A size class is a
// property of the room (compact < 600 pt, regular < 840 pt, expanded from there), the one a phone in portrait, a large
// phone in landscape or a small tablet, and a tablet each fall in — iPad split view and Android windows included.
import * as React from "react";
import { type LayoutChangeEvent, type StyleProp, StyleSheet, useWindowDimensions, View, type ViewStyle } from "react-native";

export type SizeClass = "compact" | "regular" | "expanded";

/** Where a size class begins, in points of the room the layout is given (Material's window size classes). */
export const SIZE_CLASS_FROM = { regular: 600, expanded: 840 } as const;

/** The size class of a width in points. */
export function sizeClassOf(width: number): SizeClass {
  return width >= SIZE_CLASS_FROM.expanded ? "expanded" : width >= SIZE_CLASS_FROM.regular ? "regular" : "compact";
}

/** The size class of the window (use a `Grid` or `Columns` when it is the room of a container that matters). */
export function useSizeClass(): SizeClass {
  return sizeClassOf(useWindowDimensions().width);
}

/** The system's text scale (Dynamic Type, Android font size): 1 by default, 2 at 200 %. */
export function useFontScale(): number {
  return useWindowDimensions().fontScale || 1;
}

/** The gap tokens, in points. */
export const GRID_GAPS = { none: 0, xs: 4, sm: 8, md: 12, lg: 16, xl: 24 } as const;
export type GridGap = keyof typeof GRID_GAPS;

/** How many columns per size class, or one number for all. A size class left out takes the one before it (compact → regular → expanded). */
export type GridColumns = number | Partial<Record<SizeClass, number>>;

/** One column on a compact room, two on a regular one, three on an expanded one. */
export const DEFAULT_COLUMNS: Record<SizeClass, number> = { compact: 1, regular: 2, expanded: 3 };

type Measure = { width: number; gap: number; minItemWidth: number; columns?: GridColumns; maxColumns: number; fontScale: number };

/**
 * The number of columns for a room of `width` points. The columns asked for (per size class of that room) are a ceiling:
 * an item is never narrower than `minItemWidth`, which grows with the text scale (an item holding 200 % text needs twice
 * the room), so what is asked is reduced until nothing overflows. One column is always possible.
 */
export function gridColumns({ width, gap, minItemWidth, columns, maxColumns, fontScale }: Measure): number {
  const need = minItemWidth * Math.max(1, fontScale);
  const fit = Math.max(1, Math.floor((width + gap) / (need + gap)));
  const asked = columnsFor(sizeClassOf(width), columns);
  return Math.max(1, Math.min(asked, fit, maxColumns));
}

function columnsFor(sizeClass: SizeClass, columns: GridColumns = DEFAULT_COLUMNS): number {
  if (typeof columns === "number") return Math.max(1, Math.floor(columns));
  const order: SizeClass[] = ["compact", "regular", "expanded"];
  for (let i = order.indexOf(sizeClass); i >= 0; i--) {
    const value = columns[order[i] as SizeClass];
    if (value) return Math.max(1, Math.floor(value));
  }
  return 1;
}

/** The width of one item when `columns` share `width` with `gap` between them (whole points, so a row never wraps early). */
export function itemWidth(width: number, columns: number, gap: number): number {
  return Math.floor((width - gap * (columns - 1)) / columns);
}

export type GridProps = {
  /** The items. Each is one cell. */
  children: React.ReactNode;
  /** Columns per size class of the room the grid is given (default 1 · 2 · 3), or one number. A ceiling: it drops when `minItemWidth` does not fit. */
  columns?: GridColumns;
  /** No cell is narrower than this, in points (default 160); it grows with the text scale. */
  minItemWidth?: number;
  /** The space between cells (default `md`). */
  gap?: GridGap;
  /** The most columns, whatever the room (default 6). */
  maxColumns?: number;
  /** The cells of a row are as tall as the tallest (default true): give the item `flex: 1` to fill its cell. */
  equalHeight?: boolean;
  /** The text scale to lay out for; by default the system's. Pass 2 to see 200 % text. */
  fontScale?: number;
  /** For tests. */
  testID?: string;
  /** The accessible name when the grid is a list of things (`role="list"`). */
  "aria-label"?: string;
  /** Styles merged last. */
  style?: StyleProp<ViewStyle>;
};

/**
 * A grid that fits its room: it measures the width it is given, picks its columns from the size class of that width, and
 * keeps every cell at least `minItemWidth` wide so nothing overflows — in a phone, a split view or a tablet. The order is
 * the reading order, and it mirrors in right-to-left. Before the first measure it is one column.
 */
export function Grid({ children, columns, minItemWidth = 160, gap = "md", maxColumns = 6, equalHeight = true, fontScale, testID, "aria-label": label, style }: GridProps) {
  const system = useFontScale();
  const [width, setWidth] = React.useState(0);
  const space = GRID_GAPS[gap];
  const n = width > 0 ? gridColumns({ width, gap: space, minItemWidth, columns, maxColumns, fontScale: fontScale ?? system }) : 1;
  const cell = width > 0 ? itemWidth(width, n, space) : undefined;
  const onLayout = React.useCallback((event: LayoutChangeEvent) => setWidth(Math.floor(event.nativeEvent.layout.width)), []);
  const items = React.Children.toArray(children);
  return (
    <View testID={testID} onLayout={onLayout} role={label ? "list" : undefined} aria-label={label} data-columns={n} style={[styles.grid, { gap: space }, equalHeight ? null : styles.start, style]}>
      {items.map((child, index) => (
        <View key={React.isValidElement(child) && child.key != null ? child.key : index} testID={testID ? `${testID}-cell` : undefined} role={label ? "listitem" : undefined} style={[styles.cell, cell ? { width: cell } : styles.full]}>
          {equalHeight && React.isValidElement<{ style?: StyleProp<ViewStyle> }>(child) ? React.cloneElement(child, { style: [child.props.style, styles.grow] }) : child}
        </View>
      ))}
    </View>
  );
}

export type ColumnsProps = {
  /** The columns, in reading order (the first is at the start edge, on the right in right-to-left). */
  children: React.ReactNode;
  /** The share of each column (default equal); `[1, 2]` is a third and two thirds. */
  weights?: readonly number[];
  /** Below this width per column, in points, the columns stack top to bottom (default 280); it grows with the text scale. */
  minColumnWidth?: number;
  /** The space between columns, and between stacked ones (default `lg`). */
  gap?: GridGap;
  /** The text scale to lay out for; by default the system's. */
  fontScale?: number;
  /** For tests. */
  testID?: string;
  /** Styles merged last. */
  style?: StyleProp<ViewStyle>;
};

/** Whether `count` columns of at least `minColumnWidth` fit side by side in `width`. */
export function columnsFit(width: number, count: number, minColumnWidth: number, gap: number, fontScale = 1): boolean {
  return width >= count * minColumnWidth * Math.max(1, fontScale) + gap * (count - 1);
}

/**
 * A few columns that sit side by side when the room holds them and stack when it does not — the master and the detail,
 * a form and its summary. It decides on the width it is given, not on the device, so it follows a split view or a
 * rotation. Stacked, the columns keep their order and each takes the full width.
 */
export function Columns({ children, weights, minColumnWidth = 280, gap = "lg", fontScale, testID, style }: ColumnsProps) {
  const system = useFontScale();
  const [width, setWidth] = React.useState(0);
  const space = GRID_GAPS[gap];
  const items = React.Children.toArray(children);
  const side = width > 0 && items.length > 1 && columnsFit(width, items.length, minColumnWidth, space, fontScale ?? system);
  const onLayout = React.useCallback((event: LayoutChangeEvent) => setWidth(Math.floor(event.nativeEvent.layout.width)), []);
  return (
    <View testID={testID} onLayout={onLayout} data-layout={side ? "side" : "stacked"} style={[side ? styles.row : styles.stack, { gap: space }, style]}>
      {items.map((child, index) => (
        <View key={React.isValidElement(child) && child.key != null ? child.key : index} style={side ? { flex: weights?.[index] ?? 1, minWidth: 0 } : styles.full}>
          {child}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", alignItems: "stretch", alignSelf: "stretch" },
  start: { alignItems: "flex-start" },
  cell: { flexDirection: "column", minWidth: 0 },
  full: { alignSelf: "stretch", width: "100%" },
  grow: { flexGrow: 1 },
  row: { flexDirection: "row", alignItems: "stretch", alignSelf: "stretch" },
  stack: { flexDirection: "column", alignSelf: "stretch" },
});
