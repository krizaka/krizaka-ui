"use client";
// The relation between two measures — a video's length against its watch time, a job's input size against its
// duration — a bubble's area for a third, a colour per group. The summary says what the eye looks for: the ranges and
// the correlation (Pearson's r). The canvas renderer takes tens of thousands of points. ECharts, loaded when the chart
// nears the screen.
import { formatNumber } from "@krizaka/intl";
import { useCallback, useMemo } from "react";

import { read } from "../core/data";
import { valueFormatter } from "../core/format";
import { fill } from "../core/labels";
import type { Accessor, Datum, Threshold, ValueFormat } from "../core/types";
import { EChartHost, type EngineProps, type WalkItem } from "../echarts/host";
import { baseOption, type ResolvedTheme, tooltipHtml, valueAxis } from "../echarts/theme";
import type { ChartFrameProps } from "../web/frame";
import { useSettings } from "../web/frame";
import { Legend } from "../web/parts";

const engine = () => import("../echarts/engines/scatter");

export interface ScatterChartProps<T extends Datum> extends ChartFrameProps, EngineProps {
  /** One row per point. */
  data: readonly T[];
  /** The fields of the two measures. */
  x: Accessor<T, number>;
/** The field of the vertical measure. */
  y: Accessor<T, number>;
  /** A third measure, drawn as the bubble's area. */
  size?: Accessor<T, number>;
  /** The field of a point's group: one colour per group (three at most read apart for everyone). */
  group?: Accessor<T, string>;
  /** The field naming a point (the tooltip's title). */
  name?: Accessor<T, string>;
  /** How each measure is written. */
  xFormat?: ValueFormat;
/** How the vertical measure is written. */
  yFormat?: ValueFormat;
/** How the third measure (the bubbles) is written. */
  sizeFormat?: ValueFormat;
  /** The names of the measures: the axes, the tooltip, the table. */
  xLabel: string;
/** The name of the vertical measure. */
  yLabel: string;
/** The name of the third measure. */
  sizeLabel?: string;
  /** Horizontal lines at a y value. */
  thresholds?: readonly Threshold[];
}

/** Pearson's correlation coefficient, or null under three points or without variance. */
export function correlation(points: readonly { x: number; y: number }[]): number | null {
  const n = points.length;
  if (n < 3) return null;
  const mx = points.reduce((s, p) => s + p.x, 0) / n;
  const my = points.reduce((s, p) => s + p.y, 0) / n;
  let sxy = 0;
  let sxx = 0;
  let syy = 0;
  for (const p of points) {
    sxy += (p.x - mx) * (p.y - my);
    sxx += (p.x - mx) ** 2;
    syy += (p.y - my) ** 2;
  }
  return sxx && syy ? sxy / Math.sqrt(sxx * syy) : null;
}

export function ScatterChart<T extends Datum>(props: ScatterChartProps<T>) {
  const { data, x, y, size, group, name, xFormat, yFormat, sizeFormat, xLabel, yLabel, sizeLabel, thresholds = [] } = props;
  const { locale, labels } = useSettings(props);
  const fmt = useMemo(
    () => ({
      x: valueFormatter(xFormat, locale, labels.noValue),
      xAxis: valueFormatter(xFormat, locale, labels.noValue, true),
      y: valueFormatter(yFormat, locale, labels.noValue),
      yAxis: valueFormatter(yFormat, locale, labels.noValue, true),
      size: valueFormatter(sizeFormat, locale, labels.noValue),
    }),
    [xFormat, yFormat, sizeFormat, locale, labels.noValue],
  );
  const points = useMemo(
    () =>
      data
        .map((d, i) => ({ x: Number(read(x, d, i)), y: Number(read(y, d, i)), s: size ? Number(read(size, d, i)) : null, g: group ? String(read(group, d, i)) : "", n: name ? String(read(name, d, i)) : "" }))
        .filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y)),
    [data, x, y, size, group, name],
  );
  const groups = useMemo(() => [...new Set(points.map((p) => p.g))], [points]);
  const isEmpty = points.length === 0;
  const r = correlation(points);
  const range = (values: number[], write: (v: number) => string) => `${write(Math.min(...values))} – ${write(Math.max(...values))}`;
  const summary = isEmpty
    ? labels.empty
    : [
        fill(labels.summaryIntro, { kind: labels.kinds.scatter, count: points.length }),
        `${xLabel}: ${range(points.map((p) => p.x), fmt.x)}; ${yLabel}: ${range(points.map((p) => p.y), fmt.y)}${r === null ? "" : `; ${fill(labels.summaryCorrelation, { r: formatNumber(r, { locale, maximumFractionDigits: 2, minimumFractionDigits: 2 }) })}`}.`,
      ].join(" ");
  const bySeries = useMemo(() => groups.map((g) => points.filter((p) => p.g === g)), [groups, points]);
  const items: WalkItem[] = bySeries.flatMap((list, s) =>
    list.map((p, i) => ({ seriesIndex: s, dataIndex: i, text: `${p.n || p.g}${p.n || p.g ? ": " : ""}${xLabel} ${fmt.x(p.x)}, ${yLabel} ${fmt.y(p.y)}${p.s != null && sizeLabel ? `, ${sizeLabel} ${fmt.size(p.s)}` : ""}` })),
  );
  const maxSize = Math.max(0, ...points.map((p) => p.s ?? 0));

  const build = useCallback(
    (theme: ResolvedTheme) => {
      const base = baseOption(theme, true);
      return {
        ...base,
        tooltip: {
          ...(base.tooltip as object),
          trigger: "item",
          formatter: (p: { seriesIndex: number; dataIndex: number }) => {
            const point = bySeries[p.seriesIndex]![p.dataIndex]!;
            return tooltipHtml(point.n || point.g || undefined, [
              { label: xLabel, value: fmt.x(point.x), color: theme.palette[p.seriesIndex % 8] },
              { label: yLabel, value: fmt.y(point.y) },
              ...(point.s != null && sizeLabel ? [{ label: sizeLabel, value: fmt.size(point.s) }] : []),
            ]);
          },
        },
        grid: { left: 8, right: 16, top: 16, bottom: 28, containLabel: true },
        xAxis: { ...valueAxis(theme, (v: number) => fmt.xAxis(v)), scale: true, name: xLabel, nameLocation: "middle", nameGap: 26, nameTextStyle: { color: theme.text2 } },
        yAxis: { ...valueAxis(theme, (v: number) => fmt.yAxis(v)), scale: true },
        series: bySeries.map((list, s) => ({
          type: "scatter",
          name: groups[s],
          data: list.map((p) => [p.x, p.y, p.s ?? 0]),
          symbolSize: (value: number[]) => (size && maxSize ? 6 + Math.sqrt((value[2] ?? 0) / maxSize) * 30 : 9),
          itemStyle: { color: theme.palette[s % 8], opacity: size ? 0.7 : 0.9, borderColor: theme.surface, borderWidth: 1.5 },
          emphasis: { itemStyle: { opacity: 1, borderColor: theme.text, borderWidth: 2 } },
          markLine:
            s === 0 && thresholds.length
              ? {
                  symbol: "none",
                  silent: true,
                  data: thresholds.map((t) => ({ yAxis: t.value, label: { formatter: fill(labels.summaryThreshold, { label: t.label, value: fmt.y(t.value) }), color: theme.text, position: "insideEndTop", fontWeight: 600 }, lineStyle: { color: theme.text2, type: [6, 4], width: 1.5 } })),
                }
              : undefined,
        })),
      };
    },
    [bySeries, groups, fmt, xLabel, yLabel, sizeLabel, size, maxSize, thresholds, labels.summaryThreshold],
  );

  return (
    <EChartHost
      kind="scatter"
      frame={props}
      defaultHeight={320}
      table={{
        columns: [labels.category, xLabel, yLabel, ...(size ? [sizeLabel ?? labels.value] : [])],
        rows: points.map((p, i) => [p.n || p.g || String(i + 1), fmt.x(p.x), fmt.y(p.y), ...(size ? [fmt.size(p.s)] : [])]),
      }}
      summary={summary}
      isEmpty={isEmpty}
      legend={group ? <Legend items={groups.map((g, i) => ({ label: g, color: `var(--kzc-${(i % 8) + 1})` }))} /> : null}
      engine={engine}
      build={build}
      items={items}
    />
  );
}
