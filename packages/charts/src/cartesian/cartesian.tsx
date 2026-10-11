"use client";
// Line, area and bar charts: one cartesian engine in plain SVG (no chart library: a line chart weighs a few kB, not
// the 180 kB of a general engine), drawn on the --kz-* roles and the palette's CSS variables — a theme switch repaints
// it with no JavaScript. Thin marks (2 px lines, bars ≤ 24 px with a 4 px rounded data end, a 2 px gap between stacked
// segments), recessive grid, round ticks, selective direct labels, thresholds and markers, a crosshair tooltip and
// the keyboard.
import { type KeyboardEvent, type PointerEvent, type ReactNode, useMemo, useState } from "react";

import { extent, normalizeSeries, type Series, stack, type Table, tabulate } from "../core/data";
import { describeSeries } from "../core/describe";
import { categoryFormatter, shareFormatter, valueFormatter } from "../core/format";
import { type ChartKind, fill } from "../core/labels";
import { bandScale, linearScale, niceDomain, pointScale, thinLabels } from "../core/scale";
import { areaPath, barPath, type Curve, linePath, type Point, segments } from "../core/shape";
import type { Accessor, CategoryFormat, Datum, Marker, SeriesSpec, Threshold, ValueFormat } from "../core/types";
import { ChartFrame, type ChartFrameProps, useSettings } from "../web/frame";
import { colorOf, cx, Legend, Tooltip } from "../web/parts";

/** What every cartesian chart takes: rows, the category field, the series, the formats, thresholds and markers. */
export interface CartesianProps<T extends Datum> extends ChartFrameProps {
  /** The rows, in the order of the x axis. */
  data: readonly T[];
  /** The field (or function) of the category: a month (`"2026-04"`), a day, a label. Default: the row's position. */
  x?: Accessor<T, unknown>;
  /** A single series: its field. Use `series` for several. */
  y?: Accessor<T, number | null | undefined>;
  /** The name of the single `y` series (legend, tooltip, table). Default: the field's name. */
  yLabel?: string;
  /** The series to draw, each with its field and its name; the palette follows their order. */
  series?: readonly SeriesSpec<T>[];
  /** How the values are written (axis, tooltip, table, summary). Default `"number"`. */
  format?: ValueFormat;
  /** How the categories are written. Default: dates by their precision (`2026-04` → `Apr 2026`), text as is. */
  xFormat?: CategoryFormat;
  /** The header of the categories in the data table (`Month`). */
  xLabel?: string;
  /** Horizontal lines at a value: a goal, a payout threshold. */
  thresholds?: readonly Threshold[];
  /** Vertical markers at a category: a launch, an incident. */
  markers?: readonly Marker[];
  /** Show the legend (from two series). Default true. */
  legend?: boolean;
  /** Start the value axis at zero. Default: true for bars and areas; for lines, unless the values sit far from zero. */
  zero?: boolean;
  /** Called with the row when a point or a bar is clicked (or Enter is pressed on it). */
  onSelect?: (datum: T, index: number) => void;
}

export interface CartesianOptions {
  readonly kind: ChartKind;
  readonly mode: "line" | "area" | "bar";
  readonly curve?: Curve;
  readonly stacked?: boolean;
  readonly horizontal?: boolean;
  readonly dots?: boolean;
  readonly endLabels?: boolean;
  readonly valueLabels?: boolean;
}

const M = { top: 12, bottom: 26, right: 14 };

export function Cartesian<T extends Datum>({ props, options }: { props: CartesianProps<T>; options: CartesianOptions }) {
  const { data, x, y, yLabel, series: seriesProp, format, xFormat, xLabel, thresholds = [], markers = [], legend = true, zero, onSelect } = props;
  const { kind, mode, stacked = false, horizontal = false } = options;
  const { locale, labels } = useSettings(props);

  const specs = useMemo(() => normalizeSeries(seriesProp, y, yLabel), [seriesProp, y, yLabel]);
  const table = useMemo(() => tabulate(data, x, specs), [data, x, specs]);
  const fmt = useMemo(() => {
    const category = categoryFormatter(xFormat, locale);
    return {
      value: valueFormatter(format, locale, labels.noValue),
      axis: valueFormatter(format, locale, labels.noValue, true),
      category,
      share: shareFormatter(locale),
    };
  }, [format, xFormat, locale, labels.noValue]);

  const isEmpty = table.series.length === 0 || table.series.every((s) => s.values.every((v) => v == null));
  const summary = useMemo(
    () => (isEmpty ? labels.empty : describeSeries(table, { kind, labels, value: fmt.value, category: fmt.category, share: fmt.share, thresholds })),
    [isEmpty, table, kind, labels, fmt, thresholds],
  );
  const tableModel = useMemo(
    () => ({
      columns: [xLabel ?? labels.category, ...table.series.map((s) => s.label)],
      rows: table.categories.map((c, i) => [fmt.category(c), ...table.series.map((s) => fmt.value(s.values[i]))]),
    }),
    [table, fmt, xLabel, labels.category],
  );

  const [active, setActive] = useState<number | null>(null);
  const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null);
  const count = table.categories.length;

  const colors = table.series.map((s) => colorOf(s.color, s.slot));
  const legendNode = legend ? (
    <Legend items={table.series.map((s, i) => ({ label: s.label, color: colors[i]!, shape: mode === "bar" ? "square" : "line", dashed: s.dashed }))} />
  ) : null;

  const announce = active === null ? "" : `${fmt.category(table.categories[active])}: ${table.series.map((s) => `${s.label} ${fmt.value(s.values[active])}`).join(", ")}`;

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!count) return;
    const keys: Record<string, () => number | null> = {
      ArrowRight: () => Math.min(count - 1, (active ?? -1) + 1),
      ArrowDown: () => Math.min(count - 1, (active ?? -1) + 1),
      ArrowLeft: () => Math.max(0, (active ?? count) - 1),
      ArrowUp: () => Math.max(0, (active ?? count) - 1),
      Home: () => 0,
      End: () => count - 1,
      Escape: () => null,
    };
    if (event.key === "Enter" && active !== null && onSelect) {
      event.preventDefault();
      onSelect(data[active]!, active);
      return;
    }
    const next = keys[event.key];
    if (!next) return;
    event.preventDefault();
    setPointer(null);
    setActive(next());
  };

  return (
    <ChartFrame
      kind={kind}
      frame={props}
      table={tableModel}
      summary={summary}
      isEmpty={isEmpty}
      legend={legendNode}
      announcement={announce}
      active={active !== null}
      handlers={{
        onKeyDown,
        onBlur: () => setActive(null),
        onPointerLeave: () => {
          setActive(null);
          setPointer(null);
        },
      }}
    >
      {(width, height) => (
        <Plot
          table={table}
          width={width}
          height={height}
          options={options}
          fmt={fmt}
          colors={colors}
          thresholds={thresholds}
          markers={markers}
          zero={zero ?? (mode !== "line" || stacked)}
          autoZero={zero === undefined && mode === "line"}
          stacked={stacked}
          horizontal={horizontal}
          active={active}
          pointer={pointer}
          onPointer={(index, at) => {
            setActive(index);
            setPointer(at);
          }}
          onSelect={onSelect ? (i) => onSelect(data[i]!, i) : undefined}
          labels={{ thresholdTemplate: labels.summaryThreshold, total: labels.total }}
        />
      )}
    </ChartFrame>
  );
}

interface PlotProps {
  table: Table;
  width: number;
  height: number;
  options: CartesianOptions;
  fmt: { value: (v: number | null | undefined) => string; axis: (v: number | null | undefined) => string; category: (c: unknown) => string };
  colors: string[];
  thresholds: readonly Threshold[];
  markers: readonly Marker[];
  zero: boolean;
  autoZero: boolean;
  stacked: boolean;
  horizontal: boolean;
  active: number | null;
  pointer: { x: number; y: number } | null;
  onPointer: (index: number | null, at: { x: number; y: number } | null) => void;
  onSelect?: (index: number) => void;
  labels: { thresholdTemplate: string; total: string };
}

function Plot({ table, width, height, options, fmt, colors, thresholds, markers, zero, autoZero, stacked, horizontal, active, pointer, onPointer, onSelect, labels }: PlotProps) {
  const { mode, curve = "monotone", dots, endLabels, valueLabels } = options;
  const series = table.series;
  const count = table.categories.length;

  // The value domain: the data, the thresholds, zero when asked (or when the data is near it), round ticks.
  let [lo, hi] = extent(series, stacked);
  for (const t of thresholds) {
    lo = Math.min(lo, t.value);
    hi = Math.max(hi, t.value);
  }
  const keepZero = zero || (autoZero && (lo <= 0 || lo < hi * 0.5));
  if (keepZero) {
    lo = Math.min(0, lo);
    hi = Math.max(0, hi);
  }
  const valueSpan = horizontal ? width : height;
  const nice = niceDomain(lo, hi, Math.max(2, Math.min(6, Math.round(valueSpan / 70))));
  const tickTexts = nice.ticks.map((t) => fmt.axis(t));
  const categoryTexts = table.categories.map((c) => fmt.category(c));

  const showEnd = mode !== "bar" && endLabels && series.length <= 3 && width >= 360;
  const endWidth = showEnd ? Math.max(...series.map((s) => textWidth(fmt.axis(lastValue(s))))) + 14 : 0;

  const left = horizontal ? Math.min(width * 0.35, Math.max(...categoryTexts.map(textWidth)) + 12) : Math.max(...tickTexts.map(textWidth)) + 10;
  const right = Math.max(M.right, endWidth, horizontal ? textWidth(tickTexts[tickTexts.length - 1] ?? "") / 2 + 4 : 0);
  const x0 = left;
  const x1 = Math.max(x0 + 10, width - right);
  const y0 = M.top + (markers.length ? 14 : 0);
  const y1 = Math.max(y0 + 10, height - M.bottom);

  const value = horizontal ? linearScale(nice.domain, [x0, x1], nice.ticks) : linearScale(nice.domain, [y1, y0], nice.ticks);
  const band = bandScale(count, horizontal ? [y0, y1] : [x0, x1], count > 24 ? 0.15 : 0.3);
  const point = mode === "bar" ? (i: number) => band(i) + band.bandwidth / 2 : pointScale(count, [x0, x1]);
  const centerOf = (i: number) => point(i);
  const base = value(Math.max(nice.domain[0], Math.min(nice.domain[1], 0)));

  // Which category labels fit: about one every 64 px along x, every 18 px along y.
  const labelIndexes = horizontal ? thinLabels(count, Math.floor((y1 - y0) / 18)) : thinLabels(count, Math.max(2, Math.floor((x1 - x0) / Math.max(64, Math.max(...categoryTexts.map(textWidth)) + 16))));

  const stacks = stacked ? stack(series) : null;

  const indexAt = (px: number, py: number) => {
    if (!count) return null;
    const along = horizontal ? py : px;
    if (mode === "bar") return Math.max(0, Math.min(count - 1, Math.floor((along - (horizontal ? y0 : x0)) / band.step)));
    const step = count > 1 ? (x1 - x0) / (count - 1) : 1;
    return Math.max(0, Math.min(count - 1, Math.round((px - x0) / step)));
  };

  const onMove = (event: PointerEvent<SVGSVGElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    const px = event.clientX - box.left;
    const py = event.clientY - box.top;
    onPointer(indexAt(px, py), { x: px, y: py });
  };

  const marks: ReactNode[] = [];
  if (mode === "bar") {
    const groups = stacked ? 1 : series.length;
    const thickness = Math.min(24, Math.max(2, (band.bandwidth - (groups - 1) * 2) / groups));
    const groupWidth = thickness * groups + (groups - 1) * 2;
    series.forEach((s, k) => {
      s.values.forEach((v, i) => {
        if (v == null && !stacked) return;
        const seg = stacks?.[k]?.[i];
        const from = seg ? seg.base : 0;
        const to = seg ? seg.top : (v ?? 0);
        if (from === to) return;
        const negative = to < from;
        const isTop = !stacked || series.slice(k + 1).every((other) => {
          const ov = other.values[i] ?? 0;
          return negative ? ov >= 0 : ov <= 0;
        });
        const offset = band(i) + (band.bandwidth - groupWidth) / 2 + (stacked ? 0 : k * (thickness + 2));
        const a = value(from);
        const b = value(to);
        // The 2 px surface gap between stacked segments: each segment gives up 2 px at its far end.
        const gap = stacked && !isTop ? 2 : 0;
        const radius = isTop ? 4 : 0;
        let d: string;
        if (horizontal) {
          const start = Math.min(a, b);
          const size = Math.abs(b - a) - gap;
          d = barPath(negative ? start + gap : start, offset, Math.max(0, size), thickness, radius, true, negative);
        } else {
          const top = Math.min(a, b);
          const size = Math.abs(b - a) - gap;
          d = barPath(offset, negative ? top : top + gap, thickness, Math.max(0, size), radius, false, negative);
        }
        marks.push(
          <path
            key={`${k}-${i}`}
            d={d}
            className={cx("kzc-mark", horizontal ? "kzc-enter-growx" : "kzc-enter-grow")}
            data-negative={negative || undefined}
            data-dim={active !== null && active !== i ? "" : undefined}
            style={{ fill: colors[k], cursor: onSelect ? "pointer" : undefined }}
            onClick={onSelect ? () => onSelect(i) : undefined}
          />,
        );
        if (valueLabels && series.length === 1 && count <= 16 && v != null) {
          const tip = value(to);
          marks.push(
            horizontal ? (
              <text key={`l-${i}`} x={negative ? tip - 6 : tip + 6} y={offset + thickness / 2} dominantBaseline="central" textAnchor={negative ? "end" : "start"} className="kzc-enter-fade">
                {fmt.axis(v)}
              </text>
            ) : (
              <text key={`l-${i}`} x={offset + thickness / 2} y={negative ? tip + 14 : tip - 6} textAnchor="middle" className="kzc-enter-fade">
                {fmt.axis(v)}
              </text>
            ),
          );
        }
      });
    });
  } else {
    series.forEach((s, k) => {
      const pts = s.values.map((v, i) => {
        if (v == null) return null;
        const top = stacks ? stacks[k]![i]!.top : v;
        return [centerOf(i), value(top)] as Point;
      });
      for (const seg of segments(pts)) {
        if (mode === "area") {
          const baseLine = stacks && k > 0 ? seg.map(([px]) => [px, value(stacks[k]![Math.round(indexAtX(px, x0, x1, count))]!.base)] as Point) : base;
          marks.push(<path key={`a-${k}-${seg[0]![0]}`} d={areaPath(seg, baseLine, curve)} className="kzc-area kzc-enter-fade" style={{ fill: colors[k], opacity: stacked ? 0.5 : undefined }} />);
        }
        marks.push(
          <path
            key={`l-${k}-${seg[0]![0]}`}
            d={linePath(seg, curve)}
            pathLength={s.dashed ? undefined : 1}
            className={cx("kzc-line kzc-mark", s.dashed ? "kzc-enter-fade" : "kzc-enter-line")}
            strokeDasharray={s.dashed ? "6 4" : undefined}
            style={{ stroke: colors[k] }}
          />,
        );
        if (dots || seg.length === 1) {
          for (const [px, py] of seg) marks.push(<circle key={`d-${k}-${px}`} cx={px} cy={py} r={4} className="kzc-dot kzc-enter-fade" style={{ fill: colors[k] }} />);
        }
      }
      if (showEnd) {
        const last = [...pts].reverse().find(Boolean);
        if (last) {
          marks.push(<circle key={`e-${k}`} cx={last[0]} cy={last[1]} r={4} className="kzc-dot kzc-enter-fade" style={{ fill: colors[k] }} />);
          marks.push(
            <text key={`et-${k}`} x={last[0] + 9} y={last[1]} dominantBaseline="central" className="kzc-strong kzc-enter-fade">
              {fmt.axis(lastValue(s))}
            </text>,
          );
        }
      }
    });
  }

  // Thresholds: a dashed line in the tone, its label and value on the surface.
  const thresholdMarks = thresholds.map((t, i) => {
    const at = value(t.value);
    const text = fill(labels.thresholdTemplate, { label: t.label, value: fmt.value(t.value) });
    return horizontal ? (
      <g key={`t-${i}`} data-tone={t.tone ?? "neutral"}>
        <line x1={at} x2={at} y1={y0} y2={y1} className="kzc-threshold" />
        <text x={at + 4} y={y0 + 10} className="kzc-threshold-label">
          {text}
        </text>
      </g>
    ) : (
      <g key={`t-${i}`} data-tone={t.tone ?? "neutral"}>
        <line x1={x0} x2={x1} y1={at} y2={at} className="kzc-threshold" />
        <text x={x1} y={at - 6} textAnchor="end" className="kzc-threshold-label">
          {text}
        </text>
      </g>
    );
  });

  const markerMarks = markers.map((m, i) => {
    const index = table.categories.findIndex((c) => sameCategory(c, m.x));
    if (index < 0) return null;
    const at = centerOf(index);
    return horizontal ? null : (
      <g key={`m-${i}`} data-tone={m.tone ?? "neutral"}>
        <line x1={at} x2={at} y1={y0 - 4} y2={y1} className="kzc-threshold" />
        <text x={at} y={y0 - 8} textAnchor={at > (x0 + x1) / 2 ? "end" : "start"} className="kzc-threshold-label">
          {m.label}
        </text>
      </g>
    );
  });

  const cursorAt = active !== null ? centerOf(active) : null;
  const tipRows = active !== null ? series.map((s, k) => ({ label: s.label, value: fmt.value(s.values[active]), color: colors[k], shape: mode === "bar" ? ("square" as const) : ("line" as const) })) : [];
  const stackTotal = active !== null && stacked && series.length > 1 ? series.reduce((sum, s) => sum + (s.values[active] ?? 0), 0) : null;
  const anchor =
    active === null
      ? null
      : pointer ?? (horizontal ? { x: value(Math.max(...series.map((s) => s.values[active] ?? 0))), y: cursorAt! } : { x: cursorAt!, y: Math.min(...series.map((s) => (s.values[active] == null ? y1 : value(s.values[active]!)))) });

  return (
    <>
      <svg className="kzc-svg" width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden onPointerMove={onMove}>
        {nice.ticks.map((t, i) =>
          horizontal ? (
            <g key={t}>
              <line x1={value(t)} x2={value(t)} y1={y0} y2={y1} className={t === 0 ? "kzc-axis" : "kzc-grid"} />
              <text x={value(t)} y={y1 + 16} textAnchor="middle">
                {tickTexts[i]}
              </text>
            </g>
          ) : (
            <g key={t}>
              <line x1={x0} x2={x1} y1={value(t)} y2={value(t)} className={t === 0 ? "kzc-axis" : "kzc-grid"} />
              <text x={x0 - 8} y={value(t)} textAnchor="end" dominantBaseline="central">
                {tickTexts[i]}
              </text>
            </g>
          ),
        )}
        {labelIndexes.map((i) =>
          horizontal ? (
            <text key={i} x={x0 - 8} y={centerOf(i)} textAnchor="end" dominantBaseline="central">
              {clip(categoryTexts[i]!, left - 12)}
            </text>
          ) : (
            <text key={i} x={centerOf(i)} y={y1 + 17} textAnchor={mode !== "bar" && i === 0 ? "start" : mode !== "bar" && i === count - 1 ? "end" : "middle"}>
              {categoryTexts[i]}
            </text>
          ),
        )}
        {cursorAt !== null && mode !== "bar" && <line x1={cursorAt} x2={cursorAt} y1={y0} y2={y1} className="kzc-cursor" />}
        {cursorAt !== null && mode === "bar" && (
          <rect
            x={horizontal ? x0 : band(active!) - (band.step - band.bandwidth) / 2}
            y={horizontal ? band(active!) - (band.step - band.bandwidth) / 2 : y0}
            width={horizontal ? x1 - x0 : band.step}
            height={horizontal ? band.step : y1 - y0}
            style={{ fill: "var(--kz-surface-2)", opacity: 0.6 }}
          />
        )}
        <g>{marks}</g>
        {thresholdMarks}
        {markerMarks}
        {active !== null &&
          mode !== "bar" &&
          series.map((s, k) => {
            const v = s.values[active];
            if (v == null) return null;
            const top = stacked ? stack(series)[k]![active]!.top : v;
            return <circle key={k} cx={cursorAt!} cy={value(top)} r={5} className="kzc-dot" style={{ fill: colors[k] }} />;
          })}
      </svg>
      {active !== null && anchor && (
        <Tooltip
          x={anchor.x}
          y={anchor.y}
          width={width}
          title={categoryTexts[active]}
          rows={stackTotal !== null ? [...tipRows, { label: labels.total, value: fmt.value(stackTotal) }] : tipRows}
        />
      )}
    </>
  );
}

const lastValue = (s: Series) => [...s.values].reverse().find((v) => v != null) ?? null;

/** An estimate of a label's width at 11 px (no layout on the server): the margins are sized from it. */
export function textWidth(text: string): number {
  return Math.ceil(text.length * 6.4);
}

function clip(text: string, max: number): string {
  if (textWidth(text) <= max) return text;
  const chars = Math.max(3, Math.floor(max / 6.4) - 1);
  return `${text.slice(0, chars)}…`;
}

function indexAtX(px: number, x0: number, x1: number, count: number): number {
  return count > 1 ? ((px - x0) / (x1 - x0)) * (count - 1) : 0;
}

function sameCategory(a: unknown, b: unknown): boolean {
  if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();
  return a === b || String(a) === String(b);
}
