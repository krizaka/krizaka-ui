import * as React from "react";
import { StyleSheet, View, type ViewProps } from "react-native";
import Svg, { Path } from "react-native-svg";

import { useTheme } from "./theme";
import { Txt } from "./txt";

export type StatTrend = "up" | "down" | "flat";

const ARROW: Record<StatTrend, string> = { up: "M7 17 17 7M8 7h9v9", down: "M7 7l10 10M17 8v9H8", flat: "M5 12h14M13 6l6 6-6 6" };

export type StatProps = Omit<ViewProps, "children"> & {
  /** What the figure is ("Revenue"), above it. */
  label: string;
  /** The figure, formatted by the app (`@krizaka/intl`), in tabular digits. */
  value: string;
  /** A line under the value: the period, the comparison. */
  hint?: string;
  /** The direction of the change; its arrow is decorative. */
  trend?: StatTrend;
  /** The change, in words ("+12 % vs last week") — the arrow alone says nothing. */
  trendLabel?: string;
  /** Under the figure: a `Sparkline` of @krizaka/charts/native, a `Meter`. */
  chart?: React.ReactNode;
};

/** A key figure: a label, the value in tabular digits, the change in words with its arrow, a hint, an optional chart. */
export function Stat({ label, value, hint, trend, trendLabel, chart, style, ...props }: StatProps) {
  const { theme } = useTheme();
  const arrow = trend === "up" ? theme.success : trend === "down" ? theme.danger : theme.textSecondary;
  // One element for a screen reader: "Revenue, $12,480, +12 % vs last week, last 30 days".
  const name = [label, value, trend && trendLabel ? trendLabel : null, hint].filter(Boolean).join(", ");
  return (
    <View accessible aria-label={name} {...props} style={[styles.root, style]}>
      <Txt variant="caption" tone="secondary" style={styles.label}>
        {label}
      </Txt>
      <Txt variant="display" style={styles.value}>
        {value}
      </Txt>
      {trendLabel || hint ? (
        <View style={styles.meta}>
          {trend && trendLabel ? (
            <View style={styles.trend}>
              <Svg width={14} height={14} viewBox="0 0 24 24" aria-hidden>
                <Path d={ARROW[trend]} fill="none" stroke={arrow} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
              <Txt variant="caption" style={styles.strong}>
                {trendLabel}
              </Txt>
            </View>
          ) : null}
          {hint ? (
            <Txt variant="caption" tone="secondary">
              {hint}
            </Txt>
          ) : null}
        </View>
      ) : null}
      {chart ? <View style={styles.chart}>{chart}</View> : null}
    </View>
  );
}

export type StatGridProps = ViewProps & {
  /** Hairlines between the stats (default) or space only. */
  divided?: boolean;
  /** Stats per row (default 2): a phone fits two figures side by side. */
  columns?: number;
};

/** A dashboard's head: the stats in rows of `columns`, on one card with hairlines between them. */
export function StatGrid({ divided = true, columns = 2, style, children, ...props }: StatGridProps) {
  const { theme, radius } = useTheme();
  const items = React.Children.toArray(children);
  return (
    <View
      {...props}
      style={[
        styles.grid,
        { borderRadius: radius.lg, borderColor: theme.borderDefault, backgroundColor: divided ? theme.borderSubtle : theme.surface1, gap: divided ? StyleSheet.hairlineWidth : 0 },
        style,
      ]}
    >
      {items.map((item, index) => (
        <View key={index} style={[styles.cell, { flexBasis: `${100 / columns}%`, maxWidth: `${100 / columns}%`, backgroundColor: theme.surface1 }]}>
          {item}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: 4, minWidth: 0 },
  label: { textTransform: "uppercase", letterSpacing: 0.8, fontWeight: "600" },
  value: { fontVariant: ["tabular-nums"], fontSize: 26, lineHeight: 32 },
  meta: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", columnGap: 8, rowGap: 2 },
  trend: { flexDirection: "row", alignItems: "center", gap: 4 },
  strong: { fontWeight: "700" },
  chart: { marginTop: 8, height: 40 },
  grid: { flexDirection: "row", flexWrap: "wrap", overflow: "hidden", borderWidth: StyleSheet.hairlineWidth },
  cell: { flexGrow: 1, padding: 16 },
});
