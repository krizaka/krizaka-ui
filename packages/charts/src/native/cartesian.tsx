// LineChart, AreaChart and BarChart for React Native: the web's props (data, x, y / series, format, xFormat,
// thresholds) and the same geometry (src/core), drawn with react-native-svg. The active point (a tap, or the screen
// reader's swipe) is marked on the plot and written under it.
import { useMemo, useState } from "react";
import Svg, { Circle, G, Line, Path, Text as SvgText } from "react-native-svg";

import { extent, normalizeSeries, stack, tabulate } from "../core/data";
import { describeSeries } from "../core/describe";
import { categoryFormatter, shareFormatter, valueFormatter } from "../core/format";
import { bandScale, linearScale, niceDomain, pointScale, thinLabels } from "../core/scale";
import { areaPath, barPath, type Curve, linePath, type Point, segments } from "../core/shape";
import type { Accessor, CategoryFormat, Datum, SeriesSpec, Threshold, ValueFormat } from "../core/types";
import { NativeFrame, type NativeFrameProps, NativeLegend, useNativeSettings } from "./frame";

export interface NativeCartesianProps<T extends Datum> extends NativeFrameProps {
  /** The rows, in the order of the x axis. */
  data: readonly T[];
  /** The field (or function) of the category. */
  x?: Accessor<T, unknown>;
  /** A single series: its field. */
  y?: Accessor<T, number | null | undefined>;
  /** The name of the single `y` series. */
  yLabel?: string;
  /** The series, each with its field and name. */
  series?: readonly SeriesSpec<T>[];
  /** How the values are written. */
  format?: ValueFormat;
  /** How the categories are written. */
  xFormat?: CategoryFormat;
  /** Horizontal lines at a value. */
  thresholds?: readonly Threshold[];
}

type Mode = { kind: "line" | "area" | "bar"; curve?: Curve; stacked?: boolean };

const textWidth = (text: string) => Math.ceil(text.length * 6.4);

function NativeCartesian<T extends Datum>({ props, mode }: { props: NativeCartesianProps<T>; mode: Mode }) {
  const { data, x, y, yLabel, series: seriesProp, format, xFormat, thresholds = [] } = props;
  const resolved = useNativeSettings(props);
  const { locale, labels, theme, color } = resolved;
  const specs = useMemo(() => normalizeSeries(seriesProp, y, yLabel), [seriesProp, y, yLabel]);
  const table = useMemo(() => tabulate(data, x, specs), [data, x, specs]);
  const fmt = useMemo(
    () => ({ value: valueFormatter(format, locale, labels.noValue), axis: valueFormatter(format, locale, labels.noValue, true), category: categoryFormatter(xFormat, locale), share: shareFormatter(locale) }),
    [format, xFormat, locale, labels.noValue],
  );
  const isEmpty = table.series.length === 0 || table.series.every((s) => s.values.every((v) => v == null));
  const summary = isEmpty ? labels.empty : describeSeries(table, { kind: mode.kind, labels, value: fmt.value, category: fmt.category, share: fmt.share, thresholds });
  const points = table.categories.map((c, i) => `${fmt.category(c)}: ${table.series.map((s) => `${s.label} ${fmt.value(s.values[i])}`).join(", ")}`);
  const [active, setActive] = useState<number | null>(null);
  const colors = table.series.map((s) => color(s.color, s.slot));
  const count = table.categories.length;
  const stacked = Boolean(mode.stacked);

  return (
    <NativeFrame
      frame={props}
      defaultHeight={220}
      resolved={resolved}
      summary={summary}
      isEmpty={isEmpty}
      points={points}
      active={active}
      onActive={setActive}
      legend={<NativeLegend theme={theme} items={table.series.map((s, i) => ({ label: s.label, color: colors[i]! }))} />}
      indexAt={(px, width) => {
        if (!count) return null;
        const left = 44;
        return Math.max(0, Math.min(count - 1, mode.kind === "bar" ? Math.floor(((px - left) / (width - left - 8)) * count) : Math.round(((px - left) / (width - left - 8)) * (count - 1))));
      }}
    >
      {(width, height) => {
        let [lo, hi] = extent(table.series, stacked);
        for (const t of thresholds) {
          lo = Math.min(lo, t.value);
          hi = Math.max(hi, t.value);
        }
        lo = Math.min(0, lo);
        hi = Math.max(0, hi);
        const nice = niceDomain(lo, hi, 4);
        const ticks = nice.ticks.map((t) => fmt.axis(t));
        const x0 = Math.max(...ticks.map(textWidth)) + 8;
        const x1 = width - 8;
        const y0 = 8;
        const y1 = height - 22;
        const value = linearScale(nice.domain, [y1, y0], nice.ticks);
        const band = bandScale(count, [x0, x1], 0.3);
        const at = mode.kind === "bar" ? (i: number) => band(i) + band.bandwidth / 2 : pointScale(count, [x0, x1]);
        const stacks = stacked ? stack(table.series) : null;
        const widest = Math.max(...table.categories.map((c) => textWidth(fmt.category(c))));
        const labelsAt = thinLabels(count, Math.max(2, Math.floor((x1 - x0) / (widest + 16))));
        const groups = stacked ? 1 : table.series.length;
        const thickness = Math.min(20, Math.max(2, (band.bandwidth - (groups - 1) * 2) / groups));
        return (
          <Svg width={width} height={height}>
            {nice.ticks.map((t, i) => (
              <G key={t}>
                <Line x1={x0} x2={x1} y1={value(t)} y2={value(t)} stroke={t === 0 ? theme.borderDefault : theme.borderSubtle} strokeWidth={1} />
                <SvgText x={x0 - 6} y={value(t) + 4} fontSize={11} fill={theme.textSecondary} textAnchor="end">
                  {ticks[i]}
                </SvgText>
              </G>
            ))}
            {labelsAt.map((i) => (
              <SvgText key={i} x={at(i)} y={y1 + 16} fontSize={11} fill={theme.textSecondary} textAnchor={mode.kind !== "bar" && i === 0 ? "start" : mode.kind !== "bar" && i === count - 1 ? "end" : "middle"}>
                {fmt.category(table.categories[i])}
              </SvgText>
            ))}
            {active !== null && <Line x1={at(active)} x2={at(active)} y1={y0} y2={y1} stroke={theme.borderDefault} strokeWidth={1} />}
            {table.series.map((s, k) => {
              if (mode.kind === "bar") {
                return s.values.map((v, i) => {
                  const seg = stacks?.[k]?.[i];
                  const from = seg ? seg.base : 0;
                  const to = seg ? seg.top : (v ?? 0);
                  if (from === to) return null;
                  const isTop = !stacked || k === table.series.length - 1;
                  const top = Math.min(value(from), value(to));
                  const size = Math.abs(value(to) - value(from)) - (isTop ? 0 : 2);
                  const left = band(i) + (band.bandwidth - (thickness * groups + (groups - 1) * 2)) / 2 + (stacked ? 0 : k * (thickness + 2));
                  return <Path key={`${k}-${i}`} d={barPath(left, isTop ? top : top + 2, thickness, Math.max(0, size), isTop ? 4 : 0, false, to < from)} fill={colors[k]} opacity={active !== null && active !== i ? 0.4 : 1} />;
                });
              }
              const pts = s.values.map((v, i) => (v == null ? null : ([at(i), value(stacks ? stacks[k]![i]!.top : v)] as Point)));
              return segments(pts).map((seg) => (
                <G key={`${k}-${seg[0]![0]}`}>
                  {mode.kind === "area" && <Path d={areaPath(seg, stacks && k > 0 ? seg.map(([px]) => [px, value(stacks[k]![Math.round(((px - x0) / (x1 - x0)) * (count - 1))]!.base)] as Point) : value(0), mode.curve)} fill={colors[k]} opacity={stacked ? 0.5 : 0.14} />}
                  <Path d={linePath(seg, mode.curve)} stroke={colors[k]} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={s.dashed ? "6 4" : undefined} />
                </G>
              ));
            })}
            {thresholds.map((t, i) => (
              <G key={`t-${i}`}>
                <Line x1={x0} x2={x1} y1={value(t.value)} y2={value(t.value)} stroke={color(t.tone ?? "neutral", 1)} strokeWidth={1.5} strokeDasharray="6 4" />
                <SvgText x={x1} y={value(t.value) - 6} fontSize={11} fontWeight="600" fill={theme.textPrimary} textAnchor="end">
                  {t.label}
                </SvgText>
              </G>
            ))}
            {active !== null &&
              mode.kind !== "bar" &&
              table.series.map((s, k) => {
                const v = s.values[active];
                if (v == null) return null;
                return <Circle key={k} cx={at(active)} cy={value(stacks ? stacks[k]![active]!.top : v)} r={5} fill={colors[k]} stroke={theme.surface1} strokeWidth={2} />;
              })}
          </Svg>
        );
      }}
    </NativeFrame>
  );
}

export interface NativeLineChartProps<T extends Datum> extends NativeCartesianProps<T> {
  /** `monotone` (default), `linear` or `step`. */
  curve?: Curve;
}

/** Change over time (React Native): one line per series. */
export function LineChart<T extends Datum>({ curve = "monotone", ...props }: NativeLineChartProps<T>) {
  return <NativeCartesian props={props} mode={{ kind: "line", curve }} />;
}

export interface NativeAreaChartProps<T extends Datum> extends NativeLineChartProps<T> {
  /** Stack the series: the parts of a total over time. */
  stacked?: boolean;
}

export interface NativeBarChartProps<T extends Datum> extends NativeCartesianProps<T> {
  /** Stack the series in one bar per category; default: grouped side by side. */
  stacked?: boolean;
}

/** A volume over time (React Native): a line over a wash; `stacked` for the parts of a total. */
export function AreaChart<T extends Datum>({ curve = "monotone", stacked, ...props }: NativeAreaChartProps<T>) {
  return <NativeCartesian props={props} mode={{ kind: "area", curve, stacked }} />;
}

/** Amounts across categories (React Native): grouped or `stacked` bars. */
export function BarChart<T extends Datum>({ stacked, ...props }: NativeBarChartProps<T>) {
  return <NativeCartesian props={props} mode={{ kind: "bar", stacked }} />;
}
