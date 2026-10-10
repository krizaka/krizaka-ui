import * as React from "react";
import { Animated, type StyleProp, StyleSheet, Text, type ViewStyle } from "react-native";

import { countdownParts, type CountdownUnits, useCountdown } from "../countdown/core";
import { useReducedMotion, useTheme } from "./theme";

export type { CountdownUnits };

export type CountdownProps = {
  /** The moment it counts down to: a Date, an ISO string or epoch milliseconds. */
  target: Date | string | number;
  /** Server clock − this clock, in milliseconds. */
  skewMs?: number;
  /** The short unit labels, passed translated. */
  units: CountdownUnits;
  /** Below this many milliseconds it turns urgent (the danger text role, the last segment breathes). Default 60 s. */
  urgentBelowMs?: number;
  /** sm · md (default) · lg. */
  size?: "sm" | "md" | "lg";
  /** Accessible name, e.g. "Ends in". */
  label: string;
  /** Also show `label` before the segments, in the secondary text role (default: only read by screen readers). */
  showLabel?: boolean;
  /** Styles merged last. */
  style?: StyleProp<ViewStyle>;
};

const FONT = { sm: 14, md: 20, lg: 32 } as const;

/**
 * Time left until a moment, as segments (2d 04h 13m — days only when there are some) in tabular figures, on the same
 * clock as the web `Countdown` (one interval for every countdown on screen). Under `urgentBelowMs` it turns to the
 * danger text role (≥ 4.5:1 in both themes) and its last segment breathes (still when the system reduces motion).
 * `showLabel` writes `label` before the segments; it is the accessible name either way.
 */
export function Countdown({ target, skewMs = 0, units, urgentBelowMs = 60_000, size = "md", label, showLabel = false, style }: CountdownProps) {
  const { theme, fonts } = useTheme();
  const reduce = useReducedMotion();
  const ms = useCountdown(target, skewMs);
  const urgent = ms > 0 && ms < urgentBelowMs;
  const parts = countdownParts(ms, units);
  const [opacity] = React.useState(() => new Animated.Value(1));
  React.useEffect(() => {
    if (!urgent || reduce) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.4, duration: 500, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => {
      loop.stop();
      opacity.setValue(1);
    };
  }, [urgent, reduce, opacity]);
  const color = urgent ? theme.dangerText : theme.textPrimary;
  const text = parts.map(([value, unit]) => `${String(value).padStart(2, "0")}${unit}`).join(" ");
  return (
    <Animated.View
      accessible
      role="timer"
      aria-label={`${label} ${text}`}
      style={[styles.root, style]}
    >
      {showLabel ? (
        <Text style={[styles.label, { color: theme.textSecondary, fontSize: Math.max(11, Math.round(FONT[size] * 0.6)) }]}>{label}</Text>
      ) : null}
      {parts.map(([value, unit], i) => (
        <Animated.View key={unit} style={[styles.segment, urgent && i === parts.length - 1 ? { opacity } : null]}>
          <Text style={[styles.value, { color, fontSize: FONT[size] }, fonts.display ? { fontFamily: fonts.display } : null]}>
            {String(value).padStart(2, "0")}
          </Text>
          <Text style={[styles.unit, { color: theme.textSecondary, fontSize: Math.round(FONT[size] / 2) }]}>{unit}</Text>
        </Animated.View>
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { flexDirection: "row", alignItems: "baseline", gap: 6 },
  segment: { flexDirection: "row", alignItems: "baseline" },
  value: { fontWeight: "900", fontVariant: ["tabular-nums"], letterSpacing: -0.3 },
  unit: { marginLeft: 2, fontWeight: "700", textTransform: "uppercase" },
  label: { fontWeight: "600", marginRight: 2 },
});
