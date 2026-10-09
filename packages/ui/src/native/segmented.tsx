import * as React from "react";
import { Pressable, type StyleProp, StyleSheet, Text, View, type ViewStyle } from "react-native";

import { useTheme } from "./theme";

export type SegmentedOption<T extends string> = { value: T; label: string; disabled?: boolean };

export type SegmentedProps<T extends string> = {
  /** The views, in order; `label` passed translated. */
  options: readonly SegmentedOption<T>[];
  value: T;
  onValueChange: (value: T) => void;
  size?: "sm" | "md";
  /** The accessible name of the tab list — passed translated. */
  "aria-label"?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * Switches between views of one screen: equal segments on a track, the chosen one raised — the web
 * `Tabs variant="segmented"`. A tab list for screen readers. To filter a list, use `Chip.Group`.
 */
export function Segmented<T extends string>({ options, value, onValueChange, size = "md", "aria-label": label, style }: SegmentedProps<T>) {
  const { theme, radius } = useTheme();
  return (
    <View
      role="tablist"
      aria-label={label}
      style={[styles.track, { backgroundColor: theme.surface2, borderColor: theme.borderSubtle, borderRadius: radius.md, height: size === "sm" ? 32 : 40 }, style]}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            role="tab"
            aria-selected={selected}
            aria-disabled={option.disabled}
            disabled={option.disabled}
            onPress={() => {
              if (!selected) onValueChange(option.value);
            }}
            style={[
              styles.segment,
              { borderRadius: radius.sm },
              selected ? { backgroundColor: theme.surface0, borderColor: theme.borderDefault } : null,
              option.disabled ? styles.disabled : null,
            ]}
          >
            <Text numberOfLines={1} style={[styles.label, { color: selected ? theme.textPrimary : theme.textSecondary, fontSize: size === "sm" ? 12 : 13 }]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: { flexDirection: "row", padding: 3, gap: 3, borderWidth: StyleSheet.hairlineWidth },
  segment: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 8, borderWidth: StyleSheet.hairlineWidth, borderColor: "transparent" },
  label: { fontWeight: "600" },
  disabled: { opacity: 0.4 },
});
