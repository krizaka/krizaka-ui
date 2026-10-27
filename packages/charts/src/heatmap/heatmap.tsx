"use client";
// Magnitude across two dimensions — activity by weekday and hour — and its calendar form, one cell a day over a year.
// One sequential hue (the brand's) in even steps from near the surface; the legend writes each step's range; the
// keyboard walks the cells that have a value. ECharts, loaded when the chart nears the screen.
import { useCallback, useMemo } from "react";

import { read } from "../core/data";
import { asDate, categoryFormatter, valueFormatter } from "../core/format";
import { capitalize, fill } from "../core/labels";
import type { Accessor, CategoryFormat, Datum, ValueFormat } from "../core/types";
import { EChartHost, type EngineProps, type WalkItem } from "../echarts/host";
import { baseOption, categoryAxis, type ResolvedTheme, tooltipHtml } from "../echarts/theme";
import type { ChartFrameProps } from "../web/frame";
import { useSettings } from "../web/frame";
import { RampLegend } from "../web/parts";

const engine = () => import("../echarts/engines/heatmap");
const STEPS = 5;

const pieces = (theme: ResolvedTheme, min: number, max: number) =>
  theme.ramp.map((color, i) => ({ gte: min + ((max - min) * i) / STEPS, ...(i < STEPS - 1 ? { lt: min + ((max - min) * (i + 1)) / STEPS } : {}), color }));

export interface HeatmapProps<T extends Datum> extends ChartFrameProps, EngineProps {
  /** One row per cell. */
  data: readonly T[];
  /** The field of the column (an hour, a day) and of the row (a weekday, a team). */
  x: Accessor<T, unknown>;
/** The field of the row (a weekday, a team). */
  y: Accessor<T, unknown>;
  /** The field of the cell's value. */
  value: Accessor<T, number>;
  /** The order of the columns and the rows. Default: as they first appear. */
  xCategories?: readonly unknown[];
/** The order of the rows. Default: as they first appear. */
  yCategories?: readonly unknown[];
  /** How the values, the columns and the rows are written. */
  format?: ValueFormat;
/** How the columns are written. */
  xFormat?: CategoryFormat;
/** How the rows are written. */
  yFormat?: CategoryFormat;
  /** The headers of the data table. */
  xLabel?: string;
/** The header of the rows in the data table. */
  yLabel?: string;
}

export function Heatmap<T extends Datum>(props: HeatmapProps<T>) {
  const { data, x, y, value, xCategories, yCategories, format, xFormat, yFormat, xLabel, yLabel } = props;
  const { locale, labels } = useSettings(props);
  const fmt = useMemo(
    () => ({ value: valueFormatter(format, locale, labels.noValue), axis: valueFormatter(format, locale, labels.noValue, true), x: categoryFormatter(xFormat ?? "text", locale), y: categoryFormatter(yFormat ?? "text", locale) }),
    [format, xFormat, yFormat, locale, labels.noValue],
  );
  const model = useMemo(() => {
    const xs = xCategories ? [...xCategories] : [...new Set(data.map((d, i) => read(x, d, i)))];
    const ys = yCategories ? [...yCategories] : [...new Set(data.map((d, i) => read(y, d, i)))];
    const cells = data
      .map((d, i) => ({ xi: xs.findIndex((c) => String(c) === String(read(x, d, i))), yi: ys.findIndex((c) => String(c) === String(read(y, d, i))), v: Number(read(value, d, i)) }))
      .filter((c) => c.xi >= 0 && c.yi >= 0 && Number.isFinite(c.v));
    const values = cells.map((c) => c.v);
    return { xs: xs.map((v) => fmt.x(v)), ys: ys.map((v) => fmt.y(v)), cells, min: Math.min(...values, 0), max: Math.max(...values, 0) };
  }, [data, x, y, value, xCategories, yCategories, fmt]);
  const isEmpty = model.cells.length === 0;
  const peak = model.cells.reduce<(typeof model.cells)[number] | null>((best, c) => (!best || c.v > best.v ? c : best), null);
  const summary = isEmpty
    ? labels.empty
    : `${fill(labels.summaryIntro, { kind: labels.kinds.heatmap, count: `${model.xs.length} × ${model.ys.length}` })} ${capitalize(fill(labels.summaryPeak, { value: fmt.value(peak!.v), at: `${model.ys[peak!.yi]}, ${model.xs[peak!.xi]}` }))}, ${fill(labels.summaryActive, { count: model.cells.filter((c) => c.v !== 0).length })}.`;
  const items: WalkItem[] = model.cells.map((c, i) => ({ seriesIndex: 0, dataIndex: i, text: `${model.ys[c.yi]}, ${model.xs[c.xi]}: ${fmt.value(c.v)}` }));

  const build = useCallback(
    (theme: ResolvedTheme, size: { width: number }) => {
      const base = baseOption(theme, true);
      return {
        ...base,
        tooltip: {
          ...(base.tooltip as object),
          trigger: "item",
          formatter: (p: { dataIndex: number }) => {
            const c = model.cells[p.dataIndex]!;
            return tooltipHtml(`${model.ys[c.yi]} · ${model.xs[c.xi]}`, [{ label: labels.value, value: fmt.value(c.v) }]);
          },
        },
        grid: { left: 8, right: 8, top: 8, bottom: 8, containLabel: true },
        xAxis: { ...categoryAxis(theme, model.xs), axisLine: { show: false }, axisLabel: { color: theme.text2, interval: size.width < 480 ? "auto" : 0 } },
        yAxis: { ...categoryAxis(theme, model.ys), axisLine: { show: false }, inverse: true },
        visualMap: { show: false, type: "piecewise", pieces: pieces(theme, model.min, model.max), dimension: 2 },
        series: [
          {
            type: "heatmap",
            data: model.cells.map((c) => [c.xi, c.yi, c.v]),
            itemStyle: { borderColor: theme.surface, borderWidth: 2, borderRadius: 3 },
            emphasis: { itemStyle: { borderColor: theme.text, borderWidth: 2 } },
          },
        ],
      };
    },
    [model, fmt, labels.value],
  );

  return (
    <EChartHost
      kind="heatmap"
      frame={props}
      defaultHeight={260}
      table={{ columns: [yLabel && xLabel ? `${yLabel} / ${xLabel}` : (yLabel ?? labels.category), ...model.xs], rows: model.ys.map((row, yi) => [row, ...model.xs.map((_, xi) => fmt.value(model.cells.find((c) => c.xi === xi && c.yi === yi)?.v))]) }}
      summary={summary}
      isEmpty={isEmpty}
      legend={isEmpty ? null : <RampLegend min={model.min} max={model.max} steps={STEPS} write={fmt.axis} />}
      engine={engine}
      build={build}
      items={items}
    />
  );
}

export interface CalendarHeatmapProps<T extends Datum> extends ChartFrameProps, EngineProps {
  /** One row per day (days without a row read as nothing). */
  data: readonly T[];
  /** The field of the day: an ISO date (`2026-04-12`), a `Date` or an epoch. */
  date: Accessor<T, unknown>;
  /** The field of the day's value. */
  value: Accessor<T, number>;
  /** The first and last days shown. Default: the year before the last day of the data. */
  range?: readonly [string, string];
  /** How the values are written. */
  format?: ValueFormat;
  /** The header of the values in the data table. */
  valueLabel?: string;
}

const iso = (date: Date) => date.toISOString().slice(0, 10);

export function CalendarHeatmap<T extends Datum>(props: CalendarHeatmapProps<T>) {
  const { data, date, value, range, format, valueLabel } = props;
  const { locale, labels } = useSettings(props);
  const fmt = useMemo(() => ({ value: valueFormatter(format, locale, labels.noValue), axis: valueFormatter(format, locale, labels.noValue, true), day: categoryFormatter("date", locale) }), [format, locale, labels.noValue]);
  const model = useMemo(() => {
    const days = data
      .map((d, i) => ({ day: asDate(read(date, d, i)), v: Number(read(value, d, i)) }))
      .filter((d): d is { day: Date; v: number } => d.day !== null && Number.isFinite(d.v))
      .map((d) => ({ day: iso(d.day), v: d.v }))
      .sort((a, b) => a.day.localeCompare(b.day));
    const last = days[days.length - 1]?.day ?? iso(new Date(0));
    const first = new Date(`${last}T00:00:00Z`);
    first.setUTCDate(first.getUTCDate() - 364);
    const span = range ?? ([iso(first), last] as const);
    const values = days.map((d) => d.v);
    return { days, span, min: Math.min(...values, 0), max: Math.max(...values, 0) };
  }, [data, date, value, range]);
  const isEmpty = model.days.length === 0;
  const peak = model.days.reduce<(typeof model.days)[number] | null>((best, d) => (!best || d.v > best.v ? d : best), null);
  const total = model.days.reduce((sum, d) => sum + d.v, 0);
  const summary = isEmpty
    ? labels.empty
    : `${fill(labels.summaryIntro, { kind: labels.kinds.calendar, count: `${fmt.day(model.span[0])} – ${fmt.day(model.span[1])}` })} ${capitalize(fill(labels.summaryTotal, { total: fmt.value(total) }))}, ${fill(labels.summaryPeak, { value: fmt.value(peak!.v), at: fmt.day(peak!.day) })}, ${fill(labels.summaryActive, { count: model.days.filter((d) => d.v !== 0).length })}.`;
  const items: WalkItem[] = model.days.map((d, i) => ({ seriesIndex: 0, dataIndex: i, text: `${fmt.day(d.day)}: ${fmt.value(d.v)}` }));

  const build = useCallback(
    (theme: ResolvedTheme, size: { width: number; height: number }) => {
      const base = baseOption(theme, true);
      const cell = Math.max(6, Math.min(18, Math.floor((size.width - 48) / 54)));
      const monthNames = Array.from({ length: 12 }, (_, m) => new Intl.DateTimeFormat(locale as string, { month: "short", timeZone: "UTC" }).format(new Date(Date.UTC(2026, m, 1))));
      const dayNames = Array.from({ length: 7 }, (_, d) => new Intl.DateTimeFormat(locale as string, { weekday: "narrow", timeZone: "UTC" }).format(new Date(Date.UTC(2026, 2, 1 + d))));
      return {
        ...base,
        tooltip: {
          ...(base.tooltip as object),
          trigger: "item",
          formatter: (p: { data: [string, number] }) => tooltipHtml(fmt.day(p.data[0]), [{ label: valueLabel ?? labels.value, value: fmt.value(p.data[1]) }]),
        },
        visualMap: { show: false, type: "piecewise", pieces: pieces(theme, model.min, model.max) },
        calendar: {
          range: [...model.span],
          cellSize: [cell, cell],
          top: 24,
          left: 32,
          right: 8,
          orient: "horizontal",
          splitLine: { show: false },
          itemStyle: { color: theme.surface2, borderColor: theme.surface, borderWidth: 2 },
          yearLabel: { show: false },
          monthLabel: { color: theme.text2, nameMap: monthNames, fontSize: 11 },
          dayLabel: { color: theme.text3, nameMap: dayNames, firstDay: 1, fontSize: 10 },
        },
        series: [{ type: "heatmap", coordinateSystem: "calendar", data: model.days.map((d) => [d.day, d.v]), itemStyle: { borderColor: theme.surface, borderWidth: 2, borderRadius: 2 } }],
      };
    },
    [model, fmt, valueLabel, locale, labels.value],
  );

  return (
    <EChartHost
      kind="calendar"
      frame={props}
      defaultHeight={170}
      table={{ columns: [labels.category, valueLabel ?? labels.value], rows: model.days.map((d) => [fmt.day(d.day), fmt.value(d.v)]) }}
      summary={summary}
      isEmpty={isEmpty}
      legend={isEmpty ? null : <RampLegend min={model.min} max={model.max} steps={STEPS} write={fmt.axis} />}
      engine={engine}
      build={build}
      items={items}
    />
  );
}
