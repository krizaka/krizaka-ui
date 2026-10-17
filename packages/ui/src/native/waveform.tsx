// Waveform on React Native: the bars of a sound, decorative by default, breathing on the native driver while it plays.
// Still under reduced motion and while the app is in the background (there is no intersection observer on the phone).
import * as React from "react";
import { Animated, AppState, Easing, StyleSheet, View, type ViewProps } from "react-native";

import { resamplePeaks } from "../waveform/bars";
import { useReducedMotion, useTheme } from "./theme";

export type WaveformProps = Omit<ViewProps, "children"> & {
  /** The peaks, between 0 and 1, as many as you like (resampled to `bars`). Without them: a flat line. */
  peaks?: readonly number[];
  /** How many bars. Default 32. */
  bars?: number;
  /** sm (24) · md (40, default) · lg (64): the height of the drawing, in points. */
  size?: "sm" | "md" | "lg";
  /** accent (default, the brand's colour) · neutral (a quiet line beside text). */
  tone?: "accent" | "neutral";
  /** Moves gently while `true` (a sound playing); still otherwise. */
  playing?: boolean;
  /** When given, it is an image named by this; otherwise decorative and hidden from the screen reader. */
  label?: string;
};

const HEIGHT = { sm: 24, md: 40, lg: 64 } as const;

/** A decorative waveform: the bars of a sound, breathing gently while it plays, still otherwise. */
export function Waveform({ peaks, bars = 32, size = "md", tone = "accent", playing = false, label, style, ...props }: WaveformProps) {
  const { theme } = useTheme();
  const reduce = useReducedMotion();
  const [active, setActive] = React.useState(() => AppState.currentState === "active");
  React.useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => setActive(state === "active"));
    return () => subscription.remove();
  }, []);

  const shape = React.useMemo(() => resamplePeaks(peaks ?? [], bars), [peaks, bars]);
  const values = React.useMemo(() => shape.map(() => new Animated.Value(1)), [shape]);
  const moving = playing && !reduce && active;

  React.useEffect(() => {
    if (!moving) {
      values.forEach((value) => value.setValue(1));
      return;
    }
    // Each bar starts at its own point of the breath, so the line ripples rather than pulses.
    const loops = values.map((value, i) => {
      value.setValue(((i * 7) % 11) / 11);
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(value, { toValue: 1, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(value, { toValue: 0, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ]),
      );
      loop.start();
      return loop;
    });
    return () => loops.forEach((loop) => loop.stop());
  }, [moving, values]);

  const named = label !== undefined;
  const barColour = tone === "neutral" ? theme.borderStrong : theme.accent;

  return (
    <View
      {...props}
      accessible={named}
      accessibilityRole={named ? "image" : undefined}
      accessibilityLabel={label}
      aria-hidden={named ? undefined : true}
      importantForAccessibility={named ? "yes" : "no-hide-descendants"}
      style={[styles.root, { height: HEIGHT[size] }, style]}
    >
      {shape.map((peak, i) => (
        <Animated.View
          key={i}
          testID="waveform-bar"
          style={[
            styles.bar,
            { height: `${Math.round(peak * 100)}%`, backgroundColor: barColour },
            { transform: [{ scaleY: values[i]!.interpolate({ inputRange: [0, 1], outputRange: [0.45, 1] }) }] },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "center", columnGap: 2 },
  bar: { flex: 1, minWidth: 2, borderRadius: 9999 },
});
