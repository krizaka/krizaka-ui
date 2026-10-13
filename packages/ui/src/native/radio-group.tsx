import * as React from "react";
import { Animated, Pressable, type StyleProp, StyleSheet, Text, View, type ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";

import { useTheme } from "./theme";

/** A choice: the value stored and its words (passed translated), a line under them, a second line on a key. */
export type RadioOption = { value: string; label: string; description?: string; hint?: string; disabled?: boolean };

export type RadioGroupProps = {
  /** The group's accessible name (the question), passed translated. */
  label: string;
  /** The choices, all visible (two to five, a few more for `buttons`). */
  options: readonly RadioOption[];
  /** The chosen value (controlled). */
  value?: string | null;
  /** The chosen value at first, uncontrolled. */
  defaultValue?: string | null;
  /** Called with the value pressed. */
  onValueChange?: (value: string) => void;
  /**
   * `list` (a dot and its words, 44-pt rows), `cards` (whole cards, the check lit), `buttons` (tactile keys that press
   * in: an `impact` haptic), `segmented` (a track of equal segments).
   * @default "list"
   */
  variant?: "list" | "cards" | "buttons" | "segmented";
  /** An error under the group, read and announced. */
  error?: string;
  /** Not available. */
  disabled?: boolean;
  /** Styles merged last. */
  style?: StyleProp<ViewStyle>;
};

function Check({ color }: { color: string }) {
  return (
    <Svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <Path d="M20 6 9 17l-5-5" />
    </Svg>
  );
}

/** A tactile key: raised on its ledge, sunk while pressed and once chosen (the spring of the theme). */
function Key({ option, checked, disabled, onPress }: { option: RadioOption; checked: boolean; disabled: boolean; onPress: () => void }) {
  const { theme, radius, motion } = useTheme();
  const [held, setHeld] = React.useState(false);
  const [sink] = React.useState(() => new Animated.Value(checked ? 1 : 0));
  const down = checked || held;
  React.useEffect(() => {
    Animated.timing(sink, { toValue: down ? 1 : 0, duration: motion.duration.fast, useNativeDriver: true }).start();
  }, [down, sink, motion.duration.fast]);
  return (
    <Pressable
      role="radio"
      aria-checked={checked}
      aria-label={option.hint ? `${option.label}, ${option.hint}` : option.label}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => setHeld(true)}
      onPressOut={() => setHeld(false)}
      style={[styles.keySlot, disabled ? styles.disabled : null]}
    >
      <View style={[styles.ledge, { borderRadius: radius.lg, backgroundColor: checked ? theme.accentHover : theme.borderStrong }]} />
      <Animated.View
        style={[
          styles.key,
          {
            borderRadius: radius.lg,
            backgroundColor: checked ? theme.accent : theme.surface2,
            borderColor: checked ? theme.accent : theme.borderDefault,
            transform: [{ translateY: sink.interpolate({ inputRange: [0, 1], outputRange: [0, 3] }) }],
          },
        ]}
      >
        <Text style={[styles.keyLabel, { color: checked ? theme.onAccent : theme.textPrimary }]}>{option.label}</Text>
        {option.hint ? <Text style={[styles.keyHint, { color: checked ? theme.onAccent : theme.textSecondary }]}>{option.hint}</Text> : null}
      </Animated.View>
    </Pressable>
  );
}

/**
 * One choice among a few, all visible — the web `RadioGroup` in its four looks. A radio group for VoiceOver and
 * TalkBack; each press plays a haptic (`selection`, `impact` for a tactile key) when the app passes `haptics`.
 */
export function RadioGroup({ label, options, value: valueProp, defaultValue = null, onValueChange, variant = "list", error, disabled, style }: RadioGroupProps) {
  const { theme, radius, haptic } = useTheme();
  const [own, setOwn] = React.useState<string | null>(defaultValue);
  const value = valueProp !== undefined ? valueProp : own;
  const pick = (v: string) => {
    haptic(variant === "buttons" ? "impact" : "selection");
    if (valueProp === undefined) setOwn(v);
    if (v !== value) onValueChange?.(v);
  };
  const body = options.map((o) => {
    const checked = o.value === value;
    const off = Boolean(disabled || o.disabled);
    const name = o.description ? `${o.label}, ${o.description}` : o.label;
    if (variant === "buttons") return <Key key={o.value} option={o} checked={checked} disabled={off} onPress={() => pick(o.value)} />;
    if (variant === "segmented")
      return (
        <Pressable
          key={o.value}
          role="radio"
          aria-checked={checked}
          aria-label={o.label}
          aria-disabled={off || undefined}
          disabled={off}
          onPress={() => pick(o.value)}
          style={[styles.segment, { borderRadius: radius.md }, checked ? { backgroundColor: theme.surface0, borderColor: theme.borderDefault } : null, off ? styles.disabled : null]}
        >
          <Text numberOfLines={1} style={[styles.segmentLabel, { color: checked ? theme.textPrimary : theme.textSecondary }]}>
            {o.label}
          </Text>
        </Pressable>
      );
    if (variant === "cards")
      return (
        <Pressable
          key={o.value}
          role="radio"
          aria-checked={checked}
          aria-label={name}
          aria-disabled={off || undefined}
          disabled={off}
          onPress={() => pick(o.value)}
          style={({ pressed }) => [
            styles.card,
            { borderRadius: radius.xl, backgroundColor: checked ? theme.accentSoft : theme.surface1, borderColor: checked ? theme.accent : theme.borderDefault, transform: [{ scale: pressed ? 0.98 : 1 }] },
            off ? styles.disabled : null,
          ]}
        >
          <View style={[styles.cardCheck, { borderColor: checked ? theme.accent : theme.borderStrong, backgroundColor: checked ? theme.accent : theme.surface1 }]}>{checked ? <Check color={theme.onAccent} /> : null}</View>
          <Text style={[styles.cardLabel, { color: theme.textPrimary }]}>{o.label}</Text>
          {o.description ? <Text style={[styles.cardDescription, { color: theme.textSecondary }]}>{o.description}</Text> : null}
        </Pressable>
      );
    return (
      <Pressable key={o.value} role="radio" aria-checked={checked} aria-label={name} aria-disabled={off || undefined} disabled={off} onPress={() => pick(o.value)} style={[styles.row, off ? styles.disabled : null]}>
        <View style={[styles.dot, { borderColor: checked ? theme.accent : theme.borderStrong, backgroundColor: checked ? theme.accent : theme.surface1 }]}>{checked ? <View style={[styles.dotIn, { backgroundColor: theme.onAccent }]} /> : null}</View>
        <View style={styles.rowText}>
          <Text style={[styles.rowLabel, { color: theme.textPrimary }]}>{o.label}</Text>
          {o.description ? <Text style={[styles.cardDescription, { color: theme.textSecondary }]}>{o.description}</Text> : null}
        </View>
      </Pressable>
    );
  });
  return (
    <View style={[styles.root, style]}>
      <View
        role="radiogroup"
        aria-label={label}
        style={
          variant === "segmented"
            ? [styles.track, { borderRadius: radius.lg, backgroundColor: theme.surface2, borderColor: error ? theme.danger : theme.borderDefault }]
            : variant === "buttons"
              ? styles.keys
              : variant === "cards"
                ? styles.cards
                : styles.list
        }
      >
        {body}
      </View>
      {error ? (
        <Text role="alert" aria-live="polite" style={[styles.error, { color: theme.dangerText }]}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: 6, alignSelf: "stretch" },
  list: { gap: 2 },
  row: { flexDirection: "row", alignItems: "center", gap: 12, minHeight: 44 },
  rowText: { flex: 1, gap: 1 },
  rowLabel: { fontSize: 15, lineHeight: 20 },
  dot: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, alignItems: "center", justifyContent: "center" },
  dotIn: { width: 8, height: 8, borderRadius: 4 },
  cards: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  card: { flexGrow: 1, flexBasis: 140, minHeight: 72, padding: 14, paddingRight: 40, gap: 2, borderWidth: 1 },
  cardCheck: { position: "absolute", right: 12, top: 12, width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, alignItems: "center", justifyContent: "center" },
  cardLabel: { fontSize: 16, fontWeight: "700" },
  cardDescription: { fontSize: 12, lineHeight: 16 },
  keys: { flexDirection: "row", flexWrap: "wrap", gap: 10, paddingBottom: 4 },
  keySlot: { minWidth: 64, minHeight: 52 },
  ledge: { position: "absolute", left: 0, right: 0, top: 4, bottom: -4 },
  key: { minHeight: 48, paddingHorizontal: 16, paddingVertical: 8, alignItems: "center", justifyContent: "center", gap: 1, borderWidth: 1 },
  keyLabel: { fontSize: 15, fontWeight: "700" },
  keyHint: { fontSize: 11, fontWeight: "500" },
  track: { flexDirection: "row", padding: 3, gap: 3, borderWidth: StyleSheet.hairlineWidth, height: 42 },
  segment: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 8, borderWidth: StyleSheet.hairlineWidth, borderColor: "transparent" },
  segmentLabel: { fontSize: 13, fontWeight: "600" },
  error: { fontSize: 12, lineHeight: 16 },
  disabled: { opacity: 0.4 },
});
