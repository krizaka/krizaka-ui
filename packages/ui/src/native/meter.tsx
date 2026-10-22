import * as React from "react";
import { type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";
import Svg, { Circle } from "react-native-svg";

import { type MeterLevel, meterModel, type MeterPart, type MeterThresholds } from "../meter/model";
import { type Theme, useTheme } from "./theme";
import { Txt } from "./txt";

export type { MeterPart };

export type MeterProps = {
  /** The accessible name (“Storage”, “Credits”) — passed translated; shown with `showLabel`. */
  label: string;
  /** The value, between `min` and `max` (ignored with `parts`). */
  value?: number;
  /** The start of the range. Default 0. */
  min?: number;
  /** The end of the range. Default 100. */
  max?: number;
  /** The value in words (“42 GB of 50 GB”); default: the percentage. */
  valueText?: string;
  /** The shares where the tone changes: below `low` good, up to `high` warning, past it the other end. */
  thresholds?: MeterThresholds;
  /** Which end is good: `low` (default: a quota) or `high` (a score). */
  optimum?: "low" | "high";
  /** Split into parts that add up to `max`: a stacked bar or ring, with its legend. */
  parts?: readonly MeterPart[];
  /** bar (default) · ring. */
  variant?: "bar" | "ring";
  /** sm · md (default) · lg: the bar's thickness, the ring's diameter. */
  size?: "sm" | "md" | "lg";
  /** Shows the label and the value above the bar. */
  showLabel?: boolean;
  /** A ring's centre: the value, a word. */
  children?: React.ReactNode;
  /** Styles merged last. */
  style?: StyleProp<ViewStyle>;
};

const THICK = { sm: 6, md: 8, lg: 12 } as const;
const RING = { sm: 56, md: 96, lg: 144 } as const;
// The parts must stay apart in every brand (accent, accent-2 and info can be one hue): the accent, then the status tones.
const partColor = (t: Theme, i: number) => [t.accent, t.warning, t.success, t.textSecondary, t.danger][i % 5]!;

const levelColor = (t: Theme, level: MeterLevel) => ({ ok: t.accent, success: t.success, warning: t.warning, danger: t.danger })[level];

/** A measure within a range — a quota, a balance, a share — toned by thresholds or split into parts: the web `Meter`. */
export function Meter({ label, value = 0, min = 0, max = 100, valueText, thresholds, optimum = "low", parts, variant = "bar", size = "md", showLabel, children, style }: MeterProps) {
  const { theme } = useTheme();
  const { ratio, level, words, shares: modelShares, arcs } = meterModel({ value, min, max, valueText, thresholds, optimum, parts });
  const tone = levelColor(theme, level);
  const shares = modelShares.map((p) => ({ ...p, color: partColor(theme, p.i) }));
  const a11y = parts
    ? { role: "group" as const, "aria-label": `${label}: ${shares.map((p) => `${p.label} ${p.words}`).join(", ")}` }
    : { role: "meter" as const, "aria-label": label, "aria-valuemin": min, "aria-valuemax": max, "aria-valuenow": Math.min(max, Math.max(min, value)), "aria-valuetext": words };
  const legend = parts ? (
    <View style={styles.legend} aria-hidden>
      {shares.map((p, i) => (
        <View key={i} style={styles.legendItem}>
          <View style={[styles.swatch, { backgroundColor: p.color }]} />
          <Txt variant="caption">{p.label}</Txt>
          <Txt variant="caption" tone="secondary">
            {p.words}
          </Txt>
        </View>
      ))}
    </View>
  ) : null;

  if (variant === "ring") {
    const side = RING[size];
    const r = 44;
    const c = 2 * Math.PI * r;
    return (
      <View accessible {...a11y} style={[styles.ringRoot, style]}>
        <View style={{ width: side, height: side }}>
          <Svg width={side} height={side} viewBox="0 0 100 100" style={{ transform: [{ rotate: "-90deg" }] }}>
            <Circle cx={50} cy={50} r={r} fill="none" stroke={theme.borderDefault} strokeWidth={9} />
            {arcs.map((arc, i) => (
              <Circle key={i} cx={50} cy={50} r={r} fill="none" stroke={arc.part === undefined ? tone : partColor(theme, arc.part)} strokeWidth={9} strokeDasharray={`${Math.max(0, arc.len * c - (parts ? 2 : 0))} ${c}`} strokeDashoffset={-arc.start * c} strokeLinecap={parts ? "butt" : "round"} />
            ))}
          </Svg>
          {children !== undefined ? <View style={[StyleSheet.absoluteFill, styles.center]}>{children}</View> : null}
        </View>
        {legend}
      </View>
    );
  }
  return (
    <View accessible {...a11y} style={[styles.root, style]}>
      {showLabel ? (
        <View style={styles.header} aria-hidden>
          <Txt variant="caption" numberOfLines={1} style={styles.caption}>
            {label}
          </Txt>
          {!parts ? (
            <Txt variant="caption" tone="secondary">
              {words}
            </Txt>
          ) : null}
        </View>
      ) : null}
      <View style={[styles.track, { height: THICK[size], backgroundColor: theme.surface3 }]}>
        {parts ? shares.map((p, i) => <View key={i} style={{ width: `${p.ratio * 100}%`, backgroundColor: p.color }} />) : <View style={[styles.fill, { width: `${ratio * 100}%`, backgroundColor: tone }]} />}
      </View>
      {legend}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { width: "100%", gap: 6 },
  header: { flexDirection: "row", alignItems: "baseline", gap: 8 },
  caption: { flex: 1, fontWeight: "600" },
  track: { flexDirection: "row", gap: 2, borderRadius: 999, overflow: "hidden", width: "100%" },
  fill: { height: "100%", borderRadius: 999 },
  legend: { flexDirection: "row", flexWrap: "wrap", columnGap: 14, rowGap: 4, marginTop: 4 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  swatch: { width: 8, height: 8, borderRadius: 4 },
  ringRoot: { alignItems: "center", gap: 8 },
  center: { alignItems: "center", justifyContent: "center" },
});
