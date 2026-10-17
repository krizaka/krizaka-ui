// KpiStat and ChartCard for React Native: the web's props (src/card), on the chart theme of the native frame — a key
// figure with its change in words and the shape of the period, and the card every chart of a phone dashboard sits in.
import { getNumberFormat } from "@krizaka/intl";
import { type ReactNode, useMemo } from "react";
import { StyleSheet, Text, View, type ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";

import { valueFormatter } from "../core/format";
import { fill } from "../core/labels";
import type { SeriesColor, ValueFormat } from "../core/types";
import { type NativeChartsSettings, useNativeSettings } from "./frame";
import { Sparkline } from "./round";

// @fixed: below half a percent, a change reads as flat (the same threshold as the web's KpiStat).
const FLAT = 0.005;
const ARROW = { up: "M7 17 17 7M8 7h9v9", down: "M7 7l10 10M17 8v9H8", flat: "M5 12h14M13 6l6 6-6 6" } as const;

export interface NativeKpiStatProps extends NativeChartsSettings {
  /** What the figure is (“Jobs”). */
  label: string;
  /** The figure for the period. */
  value: number;
  /** How it is written. Default `"number"`. */
  format?: ValueFormat;
  /** The same figure for the previous period: the trend is computed from it. */
  previous?: number;
  /** Which direction is good news. Default `"up"`; `"down"` for latency, failures, spend. */
  good?: "up" | "down";
  /** The shape of the period, oldest first (`null` for a gap). Without it, no sparkline. */
  data?: readonly (number | null)[];
  /** The labels of `data` (dates), for the sparkline's summary. */
  categories?: readonly unknown[];
  /** `bar` for discrete counts, `area` (default) or `line`. */
  variant?: "line" | "area" | "bar";
  /** The sparkline's colour. Default: the brand's. */
  color?: SeriesColor;
  /** Your own words for the change instead of “+12 % vs previous period”. */
  trendLabel?: string;
  /** A line under the figure: the period. */
  hint?: string;
  /** The container's style (layout only). */
  style?: ViewStyle;
}

/** A key figure, its change against the previous period and the shape of the period (React Native). */
export function KpiStat({ label, value, format, previous, good = "up", data, categories, variant = "area", color, trendLabel, hint, style, ...settings }: NativeKpiStatProps) {
  const resolved = useNativeSettings(settings);
  const { theme, locale, labels } = resolved;
  const write = useMemo(() => valueFormatter(format, locale, labels.noValue), [format, locale, labels.noValue]);
  const change = previous === undefined ? null : previous === 0 ? (value === 0 ? 0 : null) : value / previous - 1;
  const direction = change === null ? undefined : Math.abs(change) < FLAT ? "flat" : change > 0 ? "up" : "down";
  const pct = change === null ? null : getNumberFormat(locale, { style: "percent", maximumFractionDigits: 0, signDisplay: "exceptZero" }).format(change);
  const words = trendLabel ?? (pct !== null ? fill(labels.trendVsPrevious, { change: pct }) : undefined);
  const arrow = direction === "flat" || !direction ? theme.textSecondary : (direction === "up") === (good === "up") ? theme.success : theme.danger;
  const figure = write(value);
  return (
    <View style={[styles.stat, style]}>
      <View accessible aria-label={[label, figure, direction && words ? words : null, hint].filter(Boolean).join(", ")} style={styles.statText}>
        <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text>
        <Text style={[styles.value, { color: theme.textPrimary }]}>{figure}</Text>
        {(direction && words) || hint ? (
          <View style={styles.meta}>
            {direction && words ? (
              <View style={styles.trend}>
                <Svg width={14} height={14} viewBox="0 0 24 24" aria-hidden>
                  <Path d={ARROW[direction]} fill="none" stroke={arrow} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
                <Text style={[styles.small, styles.strong, { color: theme.textPrimary }]}>{words}</Text>
              </View>
            ) : null}
            {hint ? <Text style={[styles.small, { color: theme.textSecondary }]}>{hint}</Text> : null}
          </View>
        ) : null}
      </View>
      {data && data.length > 1 ? <Sparkline title={label} data={data} categories={categories} variant={variant} color={color} format={format} height={40} {...settings} /> : null}
    </View>
  );
}

export interface NativeChartCardProps extends NativeChartsSettings {
  /** What the chart shows, in a few words (the card's heading). */
  title: string;
  /** One line that says what the chart shows: “100 jobs · +100 % vs last week”. Written by the app, from its data. */
  insight?: string;
  /** The period, the unit, the source — under the insight. */
  description?: string;
  /** Controls beside the title: a period switch (a `Segmented` of @krizaka/ui/native). */
  actions?: ReactNode;
  /** A line under the chart: the source, the freshness. */
  footer?: string;
  /** The chart (`LineChart`, `BarChart`, `DonutChart`…) with `hideTitle`: the card's title names it. */
  children: ReactNode;
  /** The card's style (layout only). */
  style?: ViewStyle;
}

/** The frame of a chart on a phone: title, insight, actions, the chart, a footer — on the theme's card surface. */
export function ChartCard({ title, insight, description, actions, footer, children, style, ...settings }: NativeChartCardProps) {
  const { theme } = useNativeSettings(settings);
  return (
    <View style={[styles.card, { backgroundColor: theme.surface1, borderColor: theme.borderSubtle }, style]}>
      <View style={styles.head}>
        <View style={styles.headText}>
          <Text role="heading" style={[styles.title, { color: theme.textPrimary }]}>
            {title}
          </Text>
          {insight ? <Text style={[styles.insight, { color: theme.textPrimary }]}>{insight}</Text> : null}
          {description ? <Text style={[styles.small, { color: theme.textSecondary }]}>{description}</Text> : null}
        </View>
        {actions ? <View style={styles.actions}>{actions}</View> : null}
      </View>
      {children}
      {footer ? <Text style={[styles.small, { color: theme.textMuted }]}>{footer}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  stat: { gap: 8, minWidth: 0 },
  statText: { gap: 4 },
  label: { fontSize: 12, lineHeight: 16, fontWeight: "600", letterSpacing: 0.8, textTransform: "uppercase" },
  value: { fontSize: 26, lineHeight: 32, fontWeight: "900", fontVariant: ["tabular-nums"] },
  meta: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", columnGap: 8, rowGap: 2 },
  trend: { flexDirection: "row", alignItems: "center", gap: 4 },
  small: { fontSize: 12, lineHeight: 16 },
  strong: { fontWeight: "700" },
  card: { borderRadius: 16, borderWidth: StyleSheet.hairlineWidth, padding: 16, gap: 12 },
  head: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  headText: { flex: 1, minWidth: 0, gap: 2 },
  title: { fontSize: 14, lineHeight: 20, fontWeight: "600" },
  insight: { fontSize: 18, lineHeight: 24, fontWeight: "800", fontVariant: ["tabular-nums"] },
  actions: { flexShrink: 0 },
});
