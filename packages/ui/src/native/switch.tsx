import * as React from "react";
import { Animated, Pressable, type StyleProp, StyleSheet, Text, View, type ViewStyle } from "react-native";

import { useTheme } from "./theme";

export type SwitchProps = {
  /** The accessible name ("Push notifications"), passed translated — also the visible words when `children` is not given and `showLabel` is set. */
  label: string;
  /** On (controlled). */
  checked?: boolean;
  /** On at first, uncontrolled. */
  defaultChecked?: boolean;
  /** Called with the new state. */
  onCheckedChange?: (checked: boolean) => void;
  /** A line under the label, read with the switch ("Auctions you follow, new messages"). Shown with `showLabel`. */
  description?: string;
  /** Draws the label (and the description) beside the switch, the whole row pressable: a settings row. */
  showLabel?: boolean;
  /** sm · md (default). */
  size?: "sm" | "md";
  /** An error under the row, read and announced. */
  error?: string;
  /** Not available. */
  disabled?: boolean;
  /** Styles merged last. */
  style?: StyleProp<ViewStyle>;
};

const SIZES = { sm: { w: 40, h: 24, knob: 18 }, md: { w: 52, h: 32, knob: 26 } } as const;

/**
 * An on/off switch for React Native — the web `Switch`, drawn by the theme (the accent when on, the material's knob),
 * not the system's: the same look on iOS and Android, a `selection` haptic when it flips. `showLabel` makes it a
 * settings row (the label and its description beside it, all pressable).
 */
export function Switch({ label, checked, defaultChecked = false, onCheckedChange, description, showLabel, size = "md", error, disabled, style }: SwitchProps) {
  const { theme, motion, haptic } = useTheme();
  const [own, setOwn] = React.useState(defaultChecked);
  const on = checked ?? own;
  const d = SIZES[size];
  const travel = d.w - d.knob - (d.h - d.knob);
  const [x] = React.useState(() => new Animated.Value(on ? 1 : 0));
  React.useEffect(() => {
    Animated.timing(x, { toValue: on ? 1 : 0, duration: motion.duration.base, useNativeDriver: true }).start();
  }, [on, x, motion.duration.base]);
  const toggle = () => {
    haptic("selection");
    if (checked === undefined) setOwn(!on);
    onCheckedChange?.(!on);
  };
  const track = (
    <View style={[styles.track, { width: d.w, height: d.h, borderRadius: d.h / 2, backgroundColor: on ? theme.accent : theme.surface3, borderColor: error ? theme.danger : on ? theme.accent : theme.borderDefault }]}>
      <Animated.View
        style={[
          styles.knob,
          {
            width: d.knob,
            height: d.knob,
            borderRadius: d.knob / 2,
            backgroundColor: theme.textOnMedia,
            shadowColor: theme.scrimStrong,
            transform: [{ translateX: x.interpolate({ inputRange: [0, 1], outputRange: [0, travel] }) }],
          },
        ]}
      />
    </View>
  );
  const a11y = {
    role: "switch" as const,
    "aria-checked": on,
    "aria-label": label,
    "aria-disabled": disabled || undefined,
    accessibilityHint: error ?? description,
    disabled,
    onPress: toggle,
  };
  if (!showLabel)
    return (
      <Pressable {...a11y} hitSlop={8} style={[disabled ? styles.disabled : null, style]}>
        {track}
      </Pressable>
    );
  return (
    <View style={[styles.root, style]}>
      <Pressable {...a11y} style={[styles.row, disabled ? styles.disabled : null]}>
        <View style={styles.text}>
          <Text style={[styles.label, { color: theme.textPrimary }]}>{label}</Text>
          {description ? <Text style={[styles.description, { color: theme.textSecondary }]}>{description}</Text> : null}
        </View>
        {track}
      </Pressable>
      {error ? (
        <Text role="alert" aria-live="polite" style={[styles.description, { color: theme.dangerText }]}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: 2, alignSelf: "stretch" },
  row: { flexDirection: "row", alignItems: "center", gap: 16, minHeight: 48 },
  text: { flex: 1, gap: 2 },
  label: { fontSize: 15, lineHeight: 20, fontWeight: "500" },
  description: { fontSize: 12, lineHeight: 16 },
  track: { justifyContent: "center", paddingHorizontal: 2, borderWidth: 1 },
  knob: { shadowOpacity: 0.25, shadowRadius: 3, shadowOffset: { width: 0, height: 1 }, elevation: 2 },
  disabled: { opacity: 0.4 },
});
