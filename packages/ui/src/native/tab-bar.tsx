import * as React from "react";
import { Pressable, type StyleProp, StyleSheet, Text, View, type ViewStyle } from "react-native";

import { useTheme } from "./theme";

export type TabBarItem<T extends string> = {
  /** The section's key (the route name). */
  value: T;
  /** Its name under the icon — passed translated. */
  label: string;
  /** The icon: a function of the selected state and the colour (`(on, color) => <HomeIcon color={color} />`). */
  icon: (selected: boolean, color: string) => React.ReactNode;
  /** A count on the icon (`99+` past 99); `true` for a dot without a number. */
  badge?: number | boolean;
  /** The badge in words for screen readers (“3 unread”) — passed translated. */
  badgeLabel?: string;
};

export type TabBarProps<T extends string> = {
  /** The app's main sections, two to five. */
  items: readonly TabBarItem<T>[];
  /** The current section. */
  value: T;
  /** Called with the section pressed (navigate there); a light tick confirms it. */
  onValueChange: (value: T) => void;
  /** Called when the current section is pressed again: scroll it to the top, refresh it. */
  onReselect?: (value: T) => void;
  /** The accessible name of the bar (“Main sections”) — passed translated. */
  "aria-label"?: string;
  /** Styles merged last. */
  style?: StyleProp<ViewStyle>;
};

/**
 * The app's main sections, at the bottom of the screen: an icon and a word each, the current one in the accent, a
 * badge for what is new; clear of the home indicator (the safe area), a tick on change, a second press to go back to
 * the top. Plug it in expo-router's or React Navigation's `tabBar`.
 */
export function TabBar<T extends string>({ items, value, onValueChange, onReselect, "aria-label": label, style }: TabBarProps<T>) {
  const { theme, insets, haptics } = useTheme();
  return (
    <View role="tablist" aria-label={label} style={[styles.bar, { backgroundColor: theme.surface1, borderTopColor: theme.borderSubtle, paddingBottom: Math.max(6, insets.bottom) }, style]}>
      {items.map((item) => {
        const selected = item.value === value;
        const color = selected ? theme.accentText : theme.textSecondary;
        const badge = item.badge === true ? "" : typeof item.badge === "number" && item.badge > 0 ? (item.badge > 99 ? "99+" : String(item.badge)) : null;
        return (
          <Pressable
            key={item.value}
            role="tab"
            aria-selected={selected}
            aria-label={[item.label, badge !== null ? item.badgeLabel : null].filter(Boolean).join(", ")}
            onPress={() => {
              haptics.selection();
              if (selected) onReselect?.(item.value);
              else onValueChange(item.value);
            }}
            style={({ pressed }) => [styles.item, { opacity: pressed ? 0.7 : 1 }]}
          >
            <View aria-hidden style={styles.icon}>
              {item.icon(selected, color)}
              {badge !== null ? (
                <View style={[badge ? styles.count : styles.dot, { backgroundColor: theme.danger, borderColor: theme.surface1 }]}>
                  {badge ? <Text style={[styles.countText, { color: theme.onAccent }]}>{badge}</Text> : null}
                </View>
              ) : null}
            </View>
            <Text aria-hidden numberOfLines={1} style={[styles.label, { color, fontWeight: selected ? "700" : "500" }]}>
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: "row", borderTopWidth: StyleSheet.hairlineWidth, paddingTop: 6 },
  item: { flex: 1, alignItems: "center", gap: 2, minHeight: 48, justifyContent: "center" },
  icon: { width: 28, height: 26, alignItems: "center", justifyContent: "center" },
  label: { fontSize: 11, lineHeight: 14 },
  count: { position: "absolute", top: -4, left: 16, minWidth: 18, height: 18, borderRadius: 9, paddingHorizontal: 4, alignItems: "center", justifyContent: "center", borderWidth: 2 },
  countText: { fontSize: 10, fontWeight: "800", lineHeight: 12 },
  dot: { position: "absolute", top: 0, right: 0, width: 10, height: 10, borderRadius: 5, borderWidth: 2 },
});
