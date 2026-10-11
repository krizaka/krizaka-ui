"use client";
// Several measures of a few entities at once — models compared on latency, cost, quality — on ECharts (loaded when
// the chart comes near the screen). The rows are the axes, the series the entities, as in a line chart.
import { useCallback, useMemo } from "react";

import { normalizeSeries, summarize, tabulate } from "../core/data";
import { categoryFormatter, valueFormatter } from "../core/format";
import { fill } from "../core/labels";
import type { Accessor, Datum, SeriesSpec, ValueFormat } from "../core/types";
import { EChartHost, type EngineProps, type WalkItem } from "../echarts/host";
import { baseOption, type ResolvedTheme, tooltipHtml } from "../echarts/theme";
import type { ChartFrameProps } from "../web/frame";
import { useSettings } from "../web/frame";
import { Legend } from "../web/parts";

const engine = () => import("../echarts/engines/radar");

export interface RadarChartProps<T extends Datum> extends ChartFrameProps, EngineProps {
  /** One row per axis (“Latency”, “Quality”…). */
  data: readonly T[];
  /** The field (or function) naming the axis. */
  x: Accessor<T, string>;
  /** The entities compared, one value per axis each. */
  series: readonly SeriesSpec<T>[];
  /** How the values are written. */
  format?: ValueFormat;
  /** The end of every axis. Default: the largest value, rounded up. */
  max?: number;
  /** The header of the axes in the data table. */
  xLabel?: string;
}

export function RadarChart<T extends Datum>(props: RadarChartProps<T>) {
  const { data, x, series, format, max, xLabel } = props;
  const { locale, labels } = useSettings(props);
  const specs = useMemo(() => normalizeSeries(series, undefined, undefined), [series]);
  const table = useMemo(() => tabulate(data, x, specs), [data, x, specs]);
  const value = useMemo(() => valueFormatter(format, locale, labels.noValue), [format, locale, labels.noValue]);
  const axisNames = useMemo(() => table.categories.map((c) => categoryFormatter("text", locale)(c)), [table, locale]);
  const isEmpty = !data.length || !specs.length;
  const top = max ?? Math.max(1, ...table.series.flatMap((s) => s.values.map((v) => v ?? 0))) * 1.1;

  const summary = isEmpty
    ? labels.empty
    : [
        fill(labels.summaryIntro, { kind: labels.kinds.radar, count: `${specs.length} × ${data.length}` }),
        ...table.series.map((s) => {
          const sum = summarize(s, axisNames, String);
          return `${s.label}: ${fill(labels.summaryRange, { min: value(sum.min?.value), minAt: sum.min?.category ?? "", max: value(sum.max?.value), maxAt: sum.max?.category ?? "" })}.`;
        }),
      ].join(" ");

  const items: WalkItem[] = table.series.map((s, k) => ({ seriesIndex: 0, dataIndex: k, text: `${s.label}: ${axisNames.map((a, i) => `${a} ${value(s.values[i])}`).join(", ")}` }));

  const build = useCallback(
    (theme: ResolvedTheme) => ({
      ...baseOption(theme, true),
      tooltip: {
        ...(baseOption(theme, true).tooltip as object),
        trigger: "item",
        formatter: (p: { dataIndex: number }) => {
          const s = table.series[p.dataIndex]!;
          return tooltipHtml(s.label, axisNames.map((a, i) => ({ label: a, value: value(s.values[i]) })));
        },
      },
      radar: {
        indicator: axisNames.map((name) => ({ name, max: top })),
        radius: "68%",
        splitNumber: 4,
        axisName: { color: theme.text2, fontSize: 11 },
        splitLine: { lineStyle: { color: theme.grid } },
        splitArea: { show: false },
        axisLine: { lineStyle: { color: theme.grid } },
      },
      series: [
        {
          type: "radar",
          symbol: "circle",
          symbolSize: 6,
          data: table.series.map((s, k) => ({
            name: s.label,
            value: s.values.map((v) => v ?? 0),
            lineStyle: { width: 2, color: theme.palette[k % 8] },
            itemStyle: { color: theme.palette[k % 8], borderColor: theme.surface, borderWidth: 2 },
            areaStyle: { color: theme.palette[k % 8], opacity: 0.12 },
          })),
          emphasis: { lineStyle: { width: 3 }, areaStyle: { opacity: 0.25 } },
        },
      ],
    }),
    [table, axisNames, value, top],
  );

  return (
    <EChartHost
      kind="radar"
      frame={props}
      defaultHeight={320}
      table={{ columns: [xLabel ?? labels.category, ...table.series.map((s) => s.label)], rows: axisNames.map((a, i) => [a, ...table.series.map((s) => value(s.values[i]))]) }}
      summary={summary}
      isEmpty={isEmpty}
      legend={<Legend items={table.series.map((s) => ({ label: s.label, color: `var(--kzc-${s.slot})` }))} />}
      engine={engine}
      build={build}
      items={items}
    />
  );
}
