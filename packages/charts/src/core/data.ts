// From the app's rows to what a chart draws: the categories (x) and, per series, one value per category. Missing
// values stay `null` (a gap), never a zero.
import type { Accessor, Datum, SeriesColor, SeriesSpec, SeriesSummary } from "./types";

/** Reads a field or calls the accessor. */
export function read<T, V>(accessor: Accessor<T, V>, datum: T, index: number): V {
  return typeof accessor === "function" ? accessor(datum, index) : (datum[accessor as keyof T] as V);
}

export interface Series {
  readonly id: string;
  readonly label: string;
  readonly values: readonly (number | null)[];
  readonly color?: SeriesColor;
  readonly dashed?: boolean;
  /** Its palette slot (1–8), in the order the series were given: a series keeps its colour whatever is filtered. */
  readonly slot: number;
}

export interface Table {
  readonly categories: readonly unknown[];
  readonly series: readonly Series[];
}

const toNumber = (value: unknown): number | null => (typeof value === "number" && Number.isFinite(value) ? value : null);

/** `series`, or a single series from `y` and `label`. */
export function normalizeSeries<T extends Datum>(series: readonly SeriesSpec<T>[] | undefined, y: Accessor<T, number | null | undefined> | undefined, label: string | undefined): readonly SeriesSpec<T>[] {
  if (series?.length) return series;
  if (y !== undefined) return [{ key: y, label: label ?? (typeof y === "string" ? y : "") }];
  return [];
}

/** The categories and the series' values, row by row. */
export function tabulate<T extends Datum>(data: readonly T[], x: Accessor<T, unknown> | undefined, series: readonly SeriesSpec<T>[]): Table {
  return {
    categories: data.map((datum, i) => (x === undefined ? i + 1 : read(x, datum, i))),
    series: series.map((spec, s) => ({
      id: typeof spec.key === "string" ? spec.key : `series-${s}`,
      label: spec.label,
      values: data.map((datum, i) => toNumber(read(spec.key, datum, i))),
      color: spec.color,
      dashed: spec.dashed,
      slot: (s % 8) + 1,
    })),
  };
}

/** The smallest and largest value of the series, `stacked` summing them per category (positives and negatives apart). */
export function extent(series: readonly Series[], stacked = false): [number, number] {
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;
  const count = series[0]?.values.length ?? 0;
  if (stacked) {
    for (let i = 0; i < count; i += 1) {
      let pos = 0;
      let neg = 0;
      for (const s of series) {
        const v = s.values[i] ?? 0;
        if (v >= 0) pos += v;
        else neg += v;
      }
      min = Math.min(min, neg);
      max = Math.max(max, pos);
    }
  } else {
    for (const s of series) {
      for (const v of s.values) {
        if (v == null) continue;
        min = Math.min(min, v);
        max = Math.max(max, v);
      }
    }
  }
  if (min === Number.POSITIVE_INFINITY) return [0, 0];
  return [min, max];
}

/** Per category and series, the base and top of a stacked mark (positives up, negatives down). */
export function stack(series: readonly Series[]): { base: number; top: number }[][] {
  const count = series[0]?.values.length ?? 0;
  const out = series.map(() => [] as { base: number; top: number }[]);
  for (let i = 0; i < count; i += 1) {
    let pos = 0;
    let neg = 0;
    series.forEach((s, k) => {
      const v = s.values[i] ?? 0;
      if (v >= 0) {
        out[k]!.push({ base: pos, top: pos + v });
        pos += v;
      } else {
        out[k]!.push({ base: neg, top: neg + v });
        neg += v;
      }
    });
  }
  return out;
}

/** What a series says: its extremes, its first and last values, its total and its trend (±1 % is flat). */
export function summarize(series: Series, categories: readonly unknown[], writeCategory: (c: unknown) => string): SeriesSummary {
  let min: SeriesSummary["min"] = null;
  let max: SeriesSummary["max"] = null;
  let first: number | null = null;
  let last: number | null = null;
  let total = 0;
  let count = 0;
  series.values.forEach((v, i) => {
    if (v == null) return;
    count += 1;
    total += v;
    if (first === null) first = v;
    last = v;
    if (!min || v < min.value) min = { value: v, category: writeCategory(categories[i]) };
    if (!max || v > max.value) max = { value: v, category: writeCategory(categories[i]) };
  });
  const change = first !== null && last !== null && first !== 0 && count > 1 ? (last as number) / first - 1 : null;
  const trend = count < 2 || change === null ? (count < 2 ? "none" : last! > first! ? "up" : last! < first! ? "down" : "flat") : Math.abs(change) < 0.01 ? "flat" : change > 0 ? "up" : "down";
  return { label: series.label, count, min, max, first, last, total, change, trend };
}

/**
 * The period that has data: the categories before the first and after the last value other than 0 or null are
 * dropped, but never below `min` categories (the window grows backwards first — the recent past gives a short burst
 * its scale — then forwards). `start` is the index of the first kept category in the table given; `active` the number
 * of categories with a value; `total` the number given. Nothing to trim, or no activity at all: the table as is.
 */
export function trimToActivity(table: Table, min = 7): { table: Table; start: number; active: number; total: number } {
  const total = table.categories.length;
  const has = (i: number) => table.series.some((s) => {
    const v = s.values[i];
    return v != null && v !== 0;
  });
  let first = -1;
  let last = -1;
  let active = 0;
  for (let i = 0; i < total; i += 1) {
    if (!has(i)) continue;
    active += 1;
    if (first < 0) first = i;
    last = i;
  }
  if (first < 0) return { table, start: 0, active: 0, total };
  let from = first;
  let to = last;
  const want = Math.min(total, Math.max(1, min));
  while (to - from + 1 < want) {
    if (from > 0) from -= 1;
    else if (to < total - 1) to += 1;
    else break;
  }
  if (from === 0 && to === total - 1) return { table, start: 0, active, total };
  return { table: { categories: table.categories.slice(from, to + 1), series: table.series.map((s) => ({ ...s, values: s.values.slice(from, to + 1) })) }, start: from, active, total };
}
