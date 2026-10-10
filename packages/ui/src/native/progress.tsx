import * as React from "react";
import { Animated, Easing, type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Rect, Stop } from "react-native-svg";

import { useReducedMotion, useSvgId, useTheme } from "./theme";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export type ProgressProps = {
  /** `bar` (default) or `ring`. */
  variant?: "bar" | "ring";
  size?: "sm" | "md" | "lg";
  /** How far, between 0 and `max`. `null` or absent: indeterminate (a wait of unknown length). */
  value?: number | null;
  max?: number;
  /** The accessible name — passed translated ("Upload", "Raised towards the goal"). */
  label: string;
  /** The value in words for screen readers ("$420 of $1,000") — default: the percentage. */
  valueText?: string;
  /** A ring's centre: an amount, a percentage, an icon. */
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

const BAR = { sm: 4, md: 8, lg: 12 } as const;
const RING = { sm: 40, md: 80, lg: 144 } as const;
const STROKE = { sm: 12, md: 9, lg: 7 } as const; // in a 100-unit box, as on the web

/**
 * A progress bar or ring in the accent gradient (`accent` → `accent2`): it moves to `value` / `max` when it changes,
 * indeterminate without a value. Still under reduced motion. A `progressbar` with its value for screen readers.
 */
export function Progress({ variant = "bar", size = "md", value, max = 100, label, valueText, children, style }: ProgressProps) {
  const { theme } = useTheme();
  const reduce = useReducedMotion();
  const id = useSvgId("kz-progress-");
  const known = typeof value === "number" && Number.isFinite(value);
  const ratio = known ? Math.min(1, Math.max(0, value / (max || 1))) : 0;
  const percent = Math.round(ratio * 100);

  const [progress] = React.useState(() => new Animated.Value(ratio));
  const [spin] = React.useState(() => new Animated.Value(0));
  const [track, setTrack] = React.useState(0);
  React.useEffect(() => {
    if (reduce) {
      progress.setValue(ratio);
      return;
    }
    const animation = Animated.timing(progress, { toValue: ratio, duration: 700, easing: Easing.out(Easing.cubic), useNativeDriver: false });
    animation.start();
    return () => animation.stop();
  }, [ratio, reduce, progress]);
  React.useEffect(() => {
    if (known || reduce) return;
    const loop = Animated.loop(Animated.timing(spin, { toValue: 1, duration: 1200, easing: Easing.linear, useNativeDriver: true }));
    loop.start();
    return () => {
      loop.stop();
      spin.setValue(0);
    };
  }, [known, reduce, spin]);

  const a11y = {
    accessible: true,
    role: "progressbar" as const,
    "aria-label": label,
    "aria-valuemin": known ? 0 : undefined,
    "aria-valuemax": known ? max : undefined,
    "aria-valuenow": known ? Math.min(max, Math.max(0, value)) : undefined,
    "aria-valuetext": known ? (valueText ?? `${percent}%`) : valueText,
  };
  const gradient = (
    <Defs>
      <LinearGradient id={id} x1="0" y1="0" x2="1" y2={variant === "ring" ? "1" : "0"}>
        <Stop offset="0" stopColor={theme.accent} />
        <Stop offset="1" stopColor={theme.accent2} />
      </LinearGradient>
    </Defs>
  );

  if (variant === "ring") {
    const side = RING[size];
    const stroke = STROKE[size];
    const r = 50 - stroke / 2;
    const circumference = 2 * Math.PI * r;
    const offset = known ? progress.interpolate({ inputRange: [0, 1], outputRange: [circumference, 0] }) : circumference * 0.75;
    const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });
    return (
      <View {...a11y} style={[styles.ring, { width: side, height: side }, style]}>
        <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ rotate: known ? "-90deg" : rotate }] }]}>
          <Svg width={side} height={side} viewBox="0 0 100 100">
            {gradient}
            <Circle cx={50} cy={50} r={r} fill="none" stroke={theme.borderDefault} strokeWidth={stroke} />
            <AnimatedCircle
              cx={50}
              cy={50}
              r={r}
              fill="none"
              stroke={`url(#${id})`}
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={offset}
            />
          </Svg>
        </Animated.View>
        {children}
      </View>
    );
  }

  const width = known ? progress.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] }) : "40%";
  // Indeterminate: a 40 % segment crosses the track (measured, so the motion runs on the native driver in points).
  const translate = spin.interpolate({ inputRange: [0, 1], outputRange: [-0.4 * track, track] });
  return (
    <View
      {...a11y}
      onLayout={known ? undefined : (event) => setTrack(event.nativeEvent.layout.width)}
      style={[styles.bar, { height: BAR[size], backgroundColor: theme.surface3 }, style]}
    >
      <Animated.View style={[styles.fill, { width }, known || reduce ? null : { transform: [{ translateX: translate }] }]}>
        <Svg width="100%" height="100%" preserveAspectRatio="none">
          {gradient}
          <Rect x={0} y={0} width="100%" height="100%" fill={`url(#${id})`} />
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  ring: { alignItems: "center", justifyContent: "center" },
  bar: { width: "100%", overflow: "hidden", borderRadius: 9999 },
  fill: { height: "100%", overflow: "hidden", borderRadius: 9999 },
});
