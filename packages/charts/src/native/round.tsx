// PieChart, DonutChart, Gauge and Sparkline for React Native: the web's props, the same geometry (src/core).
import { useMemo, useState } from "react";
import Svg, { Circle, Line, Path, Text as SvgText } from "react-native-svg";

import { read } from "../core/data";
import { describeParts, describeSeries } from "../core/describe";
import { categoryFormatter, shareFormatter, valueFormatter } from "../core/format";
import { arcPath, areaPath, barPath, linePath, type Point, polar, segments, strokeArcPath } from "../core/shape";
import type { Accessor, Datum, SeriesColor, Threshold, Tone, ValueFormat } from "../core/types";
import { NativeFrame, type NativeFrameProps, NativeLegend, useNativeSettings } from "./frame";

export interface NativePieChartProps<T extends Datum> extends NativeFrameProps {
/** One row per part. */
  data: readonly T[];
  /** The field naming the part. */
  label: Accessor<T, string>;
  /** The field of its amount. */
  value: Accessor<T, number>;
/** How the amounts are written. */
  format?: ValueFormat;
  /** A ring with the total in its hole. */
  donut?: boolean;
  /** The words under the total of a donut. */
  centerLabel?: string;
  /** At most this many slices; the rest fold into `otherLabel`. Default 6. */
  maxSlices?: number;
/** The name of the folded slice. Default “Other”. */
  otherLabel?: string;
}

/** Part of a whole (React Native). */
export function PieChart<T extends Datum>(props: NativePieChartProps<T>) {
  const { data, label, value, format, donut, centerLabel, maxSlices = 6, otherLabel = "Other" } = props;
  const resolved = useNativeSettings(props);
  const { locale, labels, theme, color } = resolved;
  const fmt = useMemo(() => ({ value: valueFormatter(format, locale, labels.noValue), share: shareFormatter(locale) }), [format, locale, labels.noValue]);
  const slices = useMemo(() => {
    const rows = data.map((d, i) => ({ label: read(label, d, i), value: Math.max(0, Number(read(value, d, i)) || 0) })).sort((a, b) => b.value - a.value);
    const kept = rows.length > maxSlices ? rows.slice(0, maxSlices - 1) : rows;
    const out = kept.map((r, i) => ({ ...r, color: color(undefined, i + 1) }));
    if (rows.length > maxSlices) out.push({ label: otherLabel, value: rows.slice(maxSlices - 1).reduce((s, r) => s + r.value, 0), color: theme.textMuted });
    return out;
  }, [data, label, value, maxSlices, otherLabel, color, theme.textMuted]);
  const total = slices.reduce((s, x) => s + x.value, 0);
  const [active, setActive] = useState<number | null>(null);
  const isEmpty = total <= 0;
  const summary = isEmpty ? labels.empty : describeParts(donut ? "donut" : "pie", slices, { labels, value: fmt.value, share: fmt.share });
  return (
    <NativeFrame
      frame={props}
      defaultHeight={200}
      resolved={resolved}
      summary={summary}
      isEmpty={isEmpty}
      points={slices.map((s) => `${s.label}: ${fmt.value(s.value)} (${fmt.share(total ? s.value / total : 0)})`)}
      active={active}
      onActive={setActive}
      legend={<NativeLegend theme={theme} items={slices.map((s) => ({ label: `${s.label} · ${fmt.share(total ? s.value / total : 0)}`, color: s.color }))} />}
    >
      {(width, height) => {
        const radius = Math.max(10, Math.min(width, height) / 2 - 6);
        const inner = donut ? radius * 0.64 : 0;
        let angle = 0;
        return (
          <Svg width={width} height={height}>
            {slices.map((s, i) => {
              const start = angle;
              angle += total ? (s.value / total) * Math.PI * 2 : 0;
              return <Path key={s.label} d={arcPath(width / 2, height / 2, inner, radius, start, angle)} fill={s.color} stroke={theme.surface1} strokeWidth={slices.length > 1 ? 2 : 0} opacity={active !== null && active !== i ? 0.4 : 1} />;
            })}
            {donut && (
              <SvgText x={width / 2} y={height / 2 + (centerLabel ? 0 : 7)} fontSize={Math.max(14, Math.min(24, inner / 3))} fontWeight="600" fill={theme.textPrimary} textAnchor="middle">
                {fmt.value(total)}
              </SvgText>
            )}
            {donut && centerLabel ? (
              <SvgText x={width / 2} y={height / 2 + 18} fontSize={11} fill={theme.textSecondary} textAnchor="middle">
                {centerLabel}
              </SvgText>
            ) : null}
          </Svg>
        );
      }}
    </NativeFrame>
  );
}

/** A pie with a hole (React Native). */
export function DonutChart<T extends Datum>(props: Omit<NativePieChartProps<T>, "donut">) {
  return <PieChart {...props} donut />;
}

export interface NativeGaugeProps extends NativeFrameProps {
/** The value. */
  value: number;
/** The start of the range. Default 0. */
  min?: number;
/** The end of the range. Default 100. */
  max?: number;
/** How the value is written. */
  format?: ValueFormat;
  /** The words under the value. */
  caption?: string;
  /** A tick on the arc: the objective. */
  target?: Threshold;
  /** Zones: the value takes the tone of the zone it is in. */
  zones?: readonly { readonly to: number; readonly tone: Tone; readonly label?: string }[];
/** The tone of the value without zones. Default `"accent"`. */
  tone?: Tone;
}

const START = (-120 * Math.PI) / 180;
const END = (120 * Math.PI) / 180;

/** One figure against its range (React Native). */
export function Gauge(props: NativeGaugeProps) {
  const { value, min = 0, max = 100, format, caption, target, zones = [], tone = "accent" } = props;
  const resolved = useNativeSettings(props);
  const { locale, labels, theme, color } = resolved;
  const fmt = valueFormatter(format, locale, labels.noValue);
  const clamped = Math.min(max, Math.max(min, value));
  const zone = zones.find((z) => clamped <= z.to) ?? zones[zones.length - 1];
  const at = (v: number) => START + ((Math.min(max, Math.max(min, v)) - min) / (max - min || 1)) * (END - START);
  const text = fmt(value);
  return (
    <NativeFrame
      frame={props}
      defaultHeight={170}
      resolved={resolved}
      summary={`${labels.kinds.gauge}: ${text} / ${fmt(max)}${zone?.label ? `, ${zone.label}` : ""}.`}
      isEmpty={false}
      points={[]}
      active={null}
      onActive={() => {}}
    >
      {(width, height) => {
        const radius = Math.max(20, Math.min(width / 2 - 12, (height - 16) / 1.58));
        const cx = width / 2;
        const cy = 8 + radius;
        const stroke = Math.max(8, radius * 0.16);
        const [tx0, ty0] = target ? polar(cx, cy, radius - stroke, at(target.value)) : [0, 0];
        const [tx1, ty1] = target ? polar(cx, cy, radius + stroke, at(target.value)) : [0, 0];
        return (
          <Svg width={width} height={height}>
            <Path d={strokeArcPath(cx, cy, radius, START, END)} stroke={theme.surface3} strokeWidth={stroke} strokeLinecap="round" fill="none" />
            {clamped > min && <Path d={strokeArcPath(cx, cy, radius, START, at(clamped))} stroke={color(zone?.tone ?? tone, 1)} strokeWidth={stroke} strokeLinecap="round" fill="none" />}
            {target && <Line x1={tx0} y1={ty0} x2={tx1} y2={ty1} stroke={theme.textPrimary} strokeWidth={2} strokeLinecap="round" />}
            <SvgText x={cx} y={cy + 8} fontSize={Math.max(12, Math.min(30, radius / 2.6, (radius * 1.45) / (text.length * 0.58)))} fontWeight="600" fill={theme.textPrimary} textAnchor="middle">
              {text}
            </SvgText>
            {caption ? (
              <SvgText x={cx} y={cy + Math.max(26, radius / 2.4)} fontSize={11} fill={theme.textSecondary} textAnchor="middle">
                {caption}
              </SvgText>
            ) : null}
          </Svg>
        );
      }}
    </NativeFrame>
  );
}

export interface NativeSparklineProps extends Omit<NativeFrameProps, "hideTitle"> {
  /** The values, oldest first (`null` for a gap). */
  data: readonly (number | null)[];
/** The labels of the values (dates), for the summary. */
  categories?: readonly unknown[];
/** `line` (default), `area` or `bar`. */
  variant?: "line" | "area" | "bar";
/** A palette slot, a tone or a colour. */
  color?: SeriesColor;
  /** Colour by the trend (success up, danger down; `"inverse"` for costs). */
  trendTone?: boolean | "inverse";
/** How the values are written in the summary. */
  format?: ValueFormat;
  /** A fixed width. Default: the container's. */
  width?: number;
}

/** A word-sized trend (React Native). */
export function Sparkline(props: NativeSparklineProps) {
  const { data, categories, variant = "line", color: own, trendTone, format, width: fixed, height = 32 } = props;
  const resolved = useNativeSettings(props);
  const { locale, labels, color } = resolved;
  const fmt = useMemo(() => ({ value: valueFormatter(format, locale, labels.noValue), category: categoryFormatter(undefined, locale), share: shareFormatter(locale) }), [format, locale, labels.noValue]);
  const values = data.filter((v): v is number => v != null);
  const table = { categories: categories ?? data.map((_, i) => i + 1), series: [{ id: "v", label: props.title, values: data, slot: 1 }] };
  const isEmpty = values.length === 0;
  const up = (values[values.length - 1] ?? 0) >= (values[0] ?? 0);
  const stroke = color(own ?? (trendTone ? ((trendTone === "inverse" ? !up : up) ? "success" : "danger") : undefined), 1);
  return (
    <NativeFrame
      frame={{ ...props, hideTitle: true, height, style: { ...(fixed ? { width: fixed } : {}), ...props.style } }}
      defaultHeight={32}
      resolved={resolved}
      summary={isEmpty ? labels.empty : describeSeries(table, { kind: "sparkline", labels, value: fmt.value, category: fmt.category, share: fmt.share })}
      isEmpty={isEmpty}
      points={[]}
      active={null}
      onActive={() => {}}
    >
      {(width, h) => {
        const lo = variant === "bar" ? Math.min(0, ...values) : Math.min(...values);
        const hi = variant === "bar" ? Math.max(0, ...values) : Math.max(...values);
        const yOf = (v: number) => 3 + (1 - (v - lo) / (hi - lo || 1)) * (h - 6);
        const n = data.length;
        const xOf = (i: number) => (variant === "bar" ? (i + 0.5) * (width / n) : n > 1 ? 3 + (i / (n - 1)) * (width - 6) : width / 2);
        const pts = data.map((v, i) => (v == null ? null : ([xOf(i), yOf(v)] as Point)));
        const last = [...pts].reverse().find(Boolean);
        return (
          <Svg width={width} height={h}>
            {variant === "bar"
              ? data.map((v, i) => (v == null || v === 0 ? null : <Path key={i} d={barPath(xOf(i) - Math.min(4, width / n / 3), Math.min(yOf(v), yOf(0)), Math.min(8, (width / n) * 0.7), Math.abs(yOf(v) - yOf(0)), 1.5)} fill={stroke} />))
              : segments(pts).map((seg) => [
                  variant === "area" ? <Path key={`a${seg[0]![0]}`} d={areaPath(seg, h)} fill={stroke} opacity={0.14} /> : null,
                  <Path key={`l${seg[0]![0]}`} d={linePath(seg)} stroke={stroke} strokeWidth={1.75} fill="none" strokeLinecap="round" />,
                ])}
            {variant !== "bar" && last ? <Circle cx={last[0]} cy={last[1]} r={2.75} fill={stroke} /> : null}
          </Svg>
        );
      }}
    </NativeFrame>
  );
}
