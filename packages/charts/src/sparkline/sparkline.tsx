"use client";
// A word-sized chart: the shape of a series inside a sentence, a table cell or a stat. With a `width` it is drawn on
// the server too (no placeholder); otherwise it fills its container. No axes: its title and summary carry the figures.
import { useMemo } from "react";

import { describeSeries } from "../core/describe";
import { categoryFormatter, shareFormatter, valueFormatter } from "../core/format";
import { niceDomain } from "../core/scale";
import { areaPath, barPath, linePath, type Point, segments } from "../core/shape";
import type { SeriesColor, Threshold, ValueFormat } from "../core/types";
import { ChartFrame, type ChartFrameProps, useSettings } from "../web/frame";
import { colorOf } from "../web/parts";

export interface SparklineProps extends Omit<ChartFrameProps, "hideTitle" | "dataTable" | "exportable" | "description"> {
  /** The values, oldest first (`null` for a gap). */
  data: readonly (number | null)[];
  /** The labels of the values (dates, ISO or `Date`), for the summary and the table. Default: their positions. */
  categories?: readonly unknown[];
  /** `line` (default), `area` (line over a wash) or `bar` (discrete counts: jobs per hour). */
  variant?: "line" | "area" | "bar";
  /** A palette slot, a tone or a CSS colour. Default: the trend's tone when `trendTone`, else slot 1. */
  color?: SeriesColor;
  /** Colour by the trend: success up, danger down (or the reverse with `"inverse"`: costs, latency). */
  trendTone?: boolean | "inverse";
  /** A dashed reference line (yesterday's average, a quota). */
  threshold?: Threshold;
  /** How the values are written in the summary and table. */
  format?: ValueFormat;
  /** A fixed width in pixels: drawn on the server too. Default: the container's width. */
  width?: number;
}

/** The shape of a trend in a few pixels: a stat's last 30 days, a job's throughput. */
export function Sparkline(props: SparklineProps) {
  const { data, categories, variant = "line", color, trendTone, threshold, format, width: fixed, height = 32 } = props;
  const { locale, labels } = useSettings(props);
  const table = useMemo(() => ({ categories: categories ?? data.map((_, i) => i + 1), series: [{ id: "v", label: props.title ?? "", values: data, slot: 1 }] }), [data, categories, props.title]);
  const fmt = useMemo(() => ({ value: valueFormatter(format, locale, labels.noValue), category: categoryFormatter(undefined, locale), share: shareFormatter(locale) }), [format, locale, labels.noValue]);
  const values = data.filter((v): v is number => v != null);
  const isEmpty = values.length === 0;
  const summary = isEmpty ? labels.empty : describeSeries(table, { kind: "sparkline", labels, value: fmt.value, category: fmt.category, share: fmt.share, thresholds: threshold ? [threshold] : [] });
  const first = values[0] ?? 0;
  const last = values[values.length - 1] ?? 0;
  const up = last >= first;
  const tone = trendTone ? ((trendTone === "inverse" ? !up : up) ? "success" : "danger") : undefined;
  const stroke = colorOf(color ?? tone, 1);

  return (
    <ChartFrame
      kind="sparkline"
      frame={{ ...props, hideTitle: true, dataTable: false, height, style: { ...(fixed ? { width: fixed, display: "inline-flex" } : {}), ...props.style } }}
      defaultHeight={32}
      table={{ columns: [labels.category, props.title ?? ""], rows: table.categories.map((c, i) => [fmt.category(c), fmt.value(data[i])]) }}
      summary={summary}
      isEmpty={isEmpty}
      navigable={false}
      ssrWidth={fixed}
      compact
    >
      {(width, h) => {
        let lo = Math.min(...values, threshold?.value ?? Number.POSITIVE_INFINITY);
        let hi = Math.max(...values, threshold?.value ?? Number.NEGATIVE_INFINITY);
        if (variant === "bar") {
          lo = Math.min(0, lo);
          hi = Math.max(0, hi);
        }
        const [d0, d1] = lo === hi ? niceDomain(lo, hi).domain : [lo, hi];
        const pad = variant === "bar" ? 0 : 3;
        const yOf = (v: number) => pad + (1 - (v - d0) / (d1 - d0 || 1)) * (h - pad * 2);
        const n = data.length;
        const xOf = (i: number) => (variant === "bar" ? (i + 0.5) * (width / n) : n > 1 ? pad + (i / (n - 1)) * (width - pad * 2) : width / 2);
        const pts = data.map((v, i) => (v == null ? null : ([xOf(i), yOf(v)] as Point)));
        const lastPoint = [...pts].reverse().find(Boolean);
        return (
          <svg className="kzc-svg" width={width} height={h} viewBox={`0 0 ${width} ${h}`} aria-hidden>
            {threshold && <line x1={0} x2={width} y1={yOf(threshold.value)} y2={yOf(threshold.value)} data-tone={threshold.tone ?? "neutral"} className="kzc-threshold" style={{ strokeWidth: 1 }} />}
            {variant === "bar"
              ? data.map((v, i) => {
                  if (v == null || v === 0) return null;
                  const bw = Math.max(1, Math.min(8, (width / n) * 0.7));
                  const top = Math.min(yOf(v), yOf(0));
                  return <path key={i} d={barPath(xOf(i) - bw / 2, top, bw, Math.abs(yOf(v) - yOf(0)), 1.5, false, v < 0)} style={{ fill: stroke }} />;
                })
              : segments(pts).map((seg) => (
                  <g key={seg[0]![0]}>
                    {variant === "area" && <path d={areaPath(seg, h, "monotone")} className="kzc-area" style={{ fill: stroke }} />}
                    <path d={linePath(seg, "monotone")} className="kzc-line" style={{ stroke, strokeWidth: 1.75 }} />
                  </g>
                ))}
            {variant !== "bar" && lastPoint && <circle cx={lastPoint[0]} cy={lastPoint[1]} r={2.75} style={{ fill: stroke }} />}
          </svg>
        );
      }}
    </ChartFrame>
  );
}
