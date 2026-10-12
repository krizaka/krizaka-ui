import * as React from "react";
import { Animated, StyleSheet, View, type ViewProps } from "react-native";

import { useEntrance } from "./story-motion";
import { useTheme } from "./theme";
import { Txt } from "./txt";

export type GoalGaugeProps = Omit<ViewProps, "children"> & {
  /** What the gauge counts (“Backers”) — passed translated; the meter's accessible name. */
  label: string;
  /** The number of steps of the goal (2–24). */
  segments: number;
  /** The steps reached (lit), from 0 to `segments` (default `segments`). */
  value?: number;
  /** The value in words (“6 of 10”); default `value / segments`. */
  valueText?: string;
  /** `fill` (default) lights the reached steps one by one on mount; `drain` empties the spent ones. */
  mode?: "fill" | "drain";
  /** Shows the label and the value above the segments (default true). */
  showLabel?: boolean;
  /** `default`: rounded segments. `arcade`: a skewed frame, the label centred. */
  variant?: "default" | "arcade";
  /** The steps light (or drain) once on mount; still when the system reduces motion. */
  animated?: boolean;
};

function Cell({ lit, animate, order, animated, arcade }: { lit: boolean; animate: boolean; order: number; animated: boolean; arcade: boolean }) {
  const { theme } = useTheme();
  const t = useEntrance(animated && animate, 300 + order * 100, 350);
  const spentOpacity = arcade ? 0.14 : 1;
  const opacity = !animate ? 1 : lit ? t.interpolate({ inputRange: [0, 1], outputRange: [0.25, 1] }) : t.interpolate({ inputRange: [0, 1], outputRange: [1, arcade ? 0.14 : 1] });
  const color = lit || arcade ? theme.accent : theme.surface3;
  return (
    <Animated.View
      style={[styles.cell, arcade ? styles.cellArcade : null, { backgroundColor: color, opacity: lit || animate ? opacity : spentOpacity }]}
    />
  );
}

/** A goal in steps for React Native: `role="meter"`, the reached steps lit, the value in words beside the label. */
export function GoalGauge({ label, segments, value, valueText, mode = "fill", showLabel = true, variant = "default", animated = true, style, ...props }: GoalGaugeProps) {
  const { theme } = useTheme();
  const total = Math.max(1, Math.round(segments));
  const lit = Math.min(total, Math.max(0, Math.round(value ?? total)));
  const words = valueText ?? `${lit} / ${total}`;
  const arcade = variant === "arcade";
  return (
    <View
      accessible
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={lit}
      aria-valuetext={words}
      {...props}
      style={[styles.root, style]}
    >
      {showLabel ? (
        <View aria-hidden style={[styles.head, arcade ? styles.headArcade : null]}>
          <Txt variant={arcade ? "mono" : "caption"} tone="secondary">
            {arcade ? label.toUpperCase() : label}
          </Txt>
          {arcade ? null : <Txt variant="caption">{words}</Txt>}
        </View>
      ) : null}
      <View aria-hidden style={[styles.cells, arcade ? [styles.cellsArcade, { borderColor: theme.borderSubtle, backgroundColor: theme.surface1 }] : null]}>
        {Array.from({ length: total }, (_, i) => {
          const on = i < lit;
          const animate = mode === "fill" ? on : !on;
          return <Cell key={i} lit={on} animate={animate} order={mode === "fill" ? i : i - lit} animated={animated} arcade={arcade} />;
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { alignSelf: "stretch", gap: 8 },
  head: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", gap: 12 },
  headArcade: { justifyContent: "center" },
  cells: { flexDirection: "row", gap: 4 },
  cellsArcade: { padding: 3, borderWidth: 1, borderRadius: 4, transform: [{ skewX: "-14deg" }] },
  cell: { flex: 1, height: 8, borderRadius: 4 },
  cellArcade: { height: 10, borderRadius: 1 },
});
