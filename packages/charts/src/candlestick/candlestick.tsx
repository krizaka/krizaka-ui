"use client";
// Open, high, low, close per period — a price, an auction's bids per hour — with what a colour-blind reader needs: a
// rising candle is hollow (outlined in the success tone), a falling one filled (danger), so the shape says the
// direction as well as the colour. Optional volume in its own panel below (never a second axis on the same plot),
// zoom by wheel and drag, thresholds. ECharts, loaded when the chart nears the screen.
import { useCallback, useMemo } from "react";

import { read } from "../core/data";
import { categoryFormatter, shareFormatter, valueFormatter } from "../core/format";
import { capitalize, fill } from "../core/labels";
import type { Accessor, CategoryFormat, Datum, Threshold, ValueFormat } from "../core/types";
import { EChartHost, type EngineProps, type WalkItem } from "../echarts/host";
import { baseOption, categoryAxis, type ResolvedTheme, tooltipHtml, valueAxis } from "../echarts/theme";
import type { ChartFrameProps } from "../web/frame";
import { useSettings } from "../web/frame";

const engine = () => import("../echarts/engines/candlestick");

export interface CandlestickProps<T extends Datum> extends ChartFrameProps, EngineProps {
  /** One row per period, oldest first. */
  data: readonly T[];
  /** The field of the period (a date, an hour). */
  x: Accessor<T, unknown>;
/** The field of the price at the start of the period. */
  open: Accessor<T, number>;
/** The field of the highest price of the period. */
  high: Accessor<T, number>;
/** The field of the lowest price of the period. */
  low: Accessor<T, number>;
/** The field of the price at the end of the period. */
  close: Accessor<T, number>;
  /** The field of the volume: drawn in its own panel under the candles. */
  volume?: Accessor<T, number>;
  /** How the prices and the volume are written. */
  format?: ValueFormat;
/** How the volume is written. Default `"compact"`. */
  volumeFormat?: ValueFormat;
  /** How the periods are written. */
  xFormat?: CategoryFormat;
  /** Horizontal lines: a reserve price, a target. */
  thresholds?: readonly Threshold[];
  /** Zoom with the wheel and drag to pan. Default true from 40 periods. */
  zoom?: boolean;
  /** The words of the table's columns and the tooltip's rows. */
  columnLabels?: { readonly open: string; readonly high: string; readonly low: string; readonly close: string; readonly volume: string };
}

const DEFAULT_COLUMNS = { open: "Open", high: "High", low: "Low", close: "Close", volume: "Volume" };

export function Candlestick<T extends Datum>(props: CandlestickProps<T>) {
  const { data, x, open, high, low, close, volume, format, volumeFormat = "compact", xFormat, thresholds = [], zoom, columnLabels = DEFAULT_COLUMNS } = props;
  const { locale, labels } = useSettings(props);
  const fmt = useMemo(
    () => ({
      value: valueFormatter(format, locale, labels.noValue),
      axis: valueFormatter(format, locale, labels.noValue, true),
      volume: valueFormatter(volumeFormat, locale, labels.noValue),
      category: categoryFormatter(xFormat, locale),
      share: shareFormatter(locale),
    }),
    [format, volumeFormat, xFormat, locale, labels.noValue],
  );
  const rows = useMemo(
    () =>
      data.map((d, i) => ({
        x: fmt.category(read(x, d, i)),
        o: Number(read(open, d, i)),
        h: Number(read(high, d, i)),
        l: Number(read(low, d, i)),
        c: Number(read(close, d, i)),
        v: volume ? Number(read(volume, d, i)) : null,
      })),
    [data, x, open, high, low, close, volume, fmt],
  );
  const isEmpty = rows.length === 0;
  const first = rows[0];
  const last = rows[rows.length - 1];
  const hi = Math.max(...rows.map((r) => r.h));
  const lo = Math.min(...rows.map((r) => r.l));
  const change = first && last && first.o ? last.c / first.o - 1 : null;
  const summary = isEmpty
    ? labels.empty
    : [
        fill(labels.summaryIntro, { kind: labels.kinds.candlestick, count: `${rows.length} (${first!.x} – ${last!.x})` }),
        `${capitalize(fill(labels.summaryOhlc, { open: fmt.value(first!.o), close: fmt.value(last!.c), low: fmt.value(lo), high: fmt.value(hi) }))}${change === null ? "" : `, ${fill(change >= 0 ? labels.summaryTrendUp : labels.summaryTrendDown, { change: fmt.share(Math.abs(change)) })}`}.`,
      ].join(" ");
  const items: WalkItem[] = rows.map((r, i) => ({ seriesIndex: 0, dataIndex: i, text: `${r.x}: ${columnLabels.open} ${fmt.value(r.o)}, ${columnLabels.high} ${fmt.value(r.h)}, ${columnLabels.low} ${fmt.value(r.l)}, ${columnLabels.close} ${fmt.value(r.c)}` }));
  const zoomOn = zoom ?? rows.length >= 40;

  const build = useCallback(
    (theme: ResolvedTheme) => {
      const base = baseOption(theme, true);
      const withVolume = rows.some((r) => r.v != null);
      const xs = rows.map((r) => r.x);
      const grids = withVolume
        ? [
            { left: 8, right: 12, top: 12, bottom: "30%", containLabel: true },
            { left: 8, right: 12, top: "76%", bottom: 8, containLabel: true },
          ]
        : [{ left: 8, right: 12, top: 12, bottom: 8, containLabel: true }];
      return {
        ...base,
        tooltip: {
          ...(base.tooltip as object),
          trigger: "axis",
          axisPointer: { type: "line", lineStyle: { color: theme.axis } },
          formatter: (params: { dataIndex: number }[]) => {
            const r = rows[params[0]!.dataIndex]!;
            const up = r.c >= r.o;
            return tooltipHtml(
              r.x,
              [
                { label: columnLabels.open, value: fmt.value(r.o) },
                { label: columnLabels.high, value: fmt.value(r.h) },
                { label: columnLabels.low, value: fmt.value(r.l) },
                { label: columnLabels.close, value: fmt.value(r.c), color: up ? theme.success : theme.danger },
                ...(r.v != null ? [{ label: columnLabels.volume, value: fmt.volume(r.v) }] : []),
              ],
            );
          },
        },
        grid: grids,
        xAxis: grids.map((_, i) => ({ ...categoryAxis(theme, xs), gridIndex: i, axisLabel: { color: theme.text2, hideOverlap: true, show: i === grids.length - 1 } })),
        yAxis: [
          { ...valueAxis(theme, (v: number) => fmt.axis(v)), scale: true, gridIndex: 0 },
          ...(withVolume ? [{ ...valueAxis(theme, (v: number) => fmt.volume(v)), gridIndex: 1, splitNumber: 2 }] : []),
        ],
        dataZoom: zoomOn ? [{ type: "inside", xAxisIndex: grids.map((_, i) => i), start: Math.max(0, 100 - (40 / rows.length) * 100), end: 100 }] : [],
        series: [
          {
            type: "candlestick",
            data: rows.map((r) => [r.o, r.c, r.l, r.h]),
            barMaxWidth: 14,
            itemStyle: { color: theme.surface, color0: theme.danger, borderColor: theme.success, borderColor0: theme.danger, borderWidth: 1.5 },
            markLine: thresholds.length
              ? {
                  symbol: "none",
                  silent: true,
                  data: thresholds.map((t) => ({
                    yAxis: t.value,
                    label: { formatter: fill(labels.summaryThreshold, { label: t.label, value: fmt.value(t.value) }), color: theme.text, position: "insideEndTop", fontWeight: 600 },
                    lineStyle: { color: t.tone && t.tone !== "neutral" ? theme[t.tone === "accent" ? "accent" : t.tone] : theme.text2, type: [6, 4], width: 1.5 },
                  })),
                }
              : undefined,
          },
          ...(withVolume
            ? [
                {
                  type: "bar",
                  xAxisIndex: 1,
                  yAxisIndex: 1,
                  barMaxWidth: 14,
                  data: rows.map((r) => ({ value: r.v, itemStyle: { color: r.c >= r.o ? theme.success : theme.danger, opacity: 0.45, borderRadius: [2, 2, 0, 0] } })),
                },
              ]
            : []),
        ],
      };
    },
    [rows, fmt, thresholds, zoomOn, columnLabels, labels.summaryThreshold],
  );

  return (
    <EChartHost
      kind="candlestick"
      frame={props}
      defaultHeight={340}
      table={{
        columns: [labels.category, columnLabels.open, columnLabels.high, columnLabels.low, columnLabels.close, ...(volume ? [columnLabels.volume] : [])],
        rows: rows.map((r) => [r.x, fmt.value(r.o), fmt.value(r.h), fmt.value(r.l), fmt.value(r.c), ...(volume ? [fmt.volume(r.v)] : [])]),
      }}
      summary={summary}
      isEmpty={isEmpty}
      engine={engine}
      build={build}
      items={items}
    />
  );
}
