import * as React from "react";
import { Pressable, ScrollView, type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";

import { useTheme } from "./theme";
import { Txt } from "./txt";

export type TabItem<T extends string> = {
  /** The tab's key. */
  value: T;
  /** Its words — passed translated. */
  label: string;
  /** A count after the words (unread, results). */
  count?: number;
  /** The panel shown while it is selected. */
  content?: React.ReactNode;
  /** Cannot be selected. */
  disabled?: boolean;
};

export type TabsProps<T extends string> = {
  /** The tabs, in order. */
  items: readonly TabItem<T>[];
  /** The selected tab (controlled). */
  value?: T;
  /** The selected tab at first, uncontrolled. Default: the first. */
  defaultValue?: T;
  /** Called with the tab pressed; a light tick confirms it. */
  onValueChange?: (value: T) => void;
  /** The accessible name of the tab list — passed translated. */
  "aria-label"?: string;
  /** `underline` (default: sections of a screen, scrolls sideways when they do not fit) or `segmented` (two to four views). */
  variant?: "underline" | "segmented";
  /** Styles merged last, on the root. */
  style?: StyleProp<ViewStyle>;
};

/**
 * Sections of one screen — the web `Tabs`: a tab list (underlined, scrolling sideways when long, or segmented) and the
 * selected panel under it. For the app's main sections, use `TabBar`.
 */
export function Tabs<T extends string>({ items, value, defaultValue, onValueChange, "aria-label": label, variant = "underline", style }: TabsProps<T>) {
  const { theme, radius, haptics } = useTheme();
  const [own, setOwn] = React.useState<T | undefined>(defaultValue ?? items[0]?.value);
  const current = value ?? own;
  const select = (next: T) => {
    if (next === current) return;
    haptics.selection();
    if (value === undefined) setOwn(next);
    onValueChange?.(next);
  };
  const segmented = variant === "segmented";
  const tabs = items.map((item) => {
    const selected = item.value === current;
    return (
      <Pressable
        key={item.value}
        role="tab"
        aria-selected={selected}
        aria-disabled={item.disabled}
        disabled={item.disabled}
        onPress={() => select(item.value)}
        style={[
          segmented ? styles.segment : styles.tab,
          segmented && selected ? { backgroundColor: theme.surface0, borderColor: theme.borderDefault, borderRadius: radius.sm } : null,
          !segmented ? { borderBottomColor: selected ? theme.accent : "transparent" } : null,
          item.disabled ? styles.disabled : null,
        ]}
      >
        <Txt variant="label" tone={selected ? "text" : "secondary"} numberOfLines={1}>
          {item.label}
          {item.count !== undefined ? <Txt variant="caption" tone="secondary">{`  ${item.count}`}</Txt> : null}
        </Txt>
      </Pressable>
    );
  });
  const panel = items.find((i) => i.value === current)?.content;
  return (
    <View style={[styles.root, style]}>
      {segmented ? (
        <View role="tablist" aria-label={label} style={[styles.track, { backgroundColor: theme.surface2, borderColor: theme.borderSubtle, borderRadius: radius.md }]}>
          {tabs}
        </View>
      ) : (
        <View style={[styles.underline, { borderBottomColor: theme.borderSubtle }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} role="tablist" aria-label={label} contentContainerStyle={styles.scroll}>
            {tabs}
          </ScrollView>
        </View>
      )}
      {panel !== undefined ? <View role="tabpanel">{panel}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: 12 },
  underline: { borderBottomWidth: StyleSheet.hairlineWidth },
  scroll: { gap: 4, paddingHorizontal: 4 },
  tab: { minHeight: 44, justifyContent: "center", paddingHorizontal: 12, borderBottomWidth: 2 },
  track: { flexDirection: "row", padding: 3, gap: 3, borderWidth: StyleSheet.hairlineWidth, height: 40 },
  segment: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 8, borderWidth: StyleSheet.hairlineWidth, borderColor: "transparent" },
  disabled: { opacity: 0.4 },
});
