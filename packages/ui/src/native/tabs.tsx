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
  /** `variant="binder"`: the divider's colour (the accent by default). Never the only signal: the words say it. */
  hue?: TabsHue;
};

/** A divider's colour: a role of the theme, ≥ 3:1 on both themes (the web's `TabsHue`). */
export type TabsHue = "accent" | "success" | "warning" | "danger" | "neutral";

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
  /** `underline` (default: sections of a screen, scrolls sideways when they do not fit), `segmented` (two to four views) or `binder` (dividers that organise collections, tags, statuses; they scroll sideways). */
  variant?: "underline" | "segmented" | "binder";
  /** `variant="binder"`: a « + » button after the dividers (« Intercalaire »): its words and what it does. */
  add?: { label: string; onAdd: () => void };
  /** Styles merged last, on the root. */
  style?: StyleProp<ViewStyle>;
};

/**
 * Sections of one screen — the web `Tabs`: a tab list (underlined, scrolling sideways when long, or segmented) and the
 * selected panel under it. For the app's main sections, use `TabBar`.
 */
export function Tabs<T extends string>({ items, value, defaultValue, onValueChange, "aria-label": label, variant = "underline", add, style }: TabsProps<T>) {
  const { theme, radius, haptic } = useTheme();
  const [own, setOwn] = React.useState<T | undefined>(defaultValue ?? items[0]?.value);
  const current = value ?? own;
  const select = (next: T) => {
    if (next === current) return;
    haptic("selection");
    if (value === undefined) setOwn(next);
    onValueChange?.(next);
  };
  const segmented = variant === "segmented";
  const binder = variant === "binder";
  const hueOf = (hue: TabsHue | undefined) =>
    ({ accent: theme.accent, success: theme.successText, warning: theme.warningText, danger: theme.dangerText, neutral: theme.textMuted })[hue ?? "accent"];
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
          binder ? [styles.divider, { borderTopColor: hueOf(item.hue), borderColor: theme.borderDefault, borderTopLeftRadius: radius.md, borderTopRightRadius: radius.md, backgroundColor: selected ? theme.surface1 : theme.surface2 }] : null,
          binder ? null : segmented ? styles.segment : styles.tab,
          segmented && selected ? { backgroundColor: theme.surface0, borderColor: theme.borderDefault, borderRadius: radius.sm } : null,
          !segmented && !binder ? { borderBottomColor: selected ? theme.accent : "transparent" } : null,
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
        <View style={[styles.underline, binder ? styles.binderRow : null, { borderBottomColor: binder ? theme.borderDefault : theme.borderSubtle }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} role="tablist" aria-label={label} contentContainerStyle={[styles.scroll, binder ? styles.binderScroll : null]}>
            {tabs}
          </ScrollView>
          {binder && add ? (
            <Pressable role="button" aria-label={add.label} onPress={add.onAdd} hitSlop={4} style={styles.add}>
              <Txt variant="label" tone="secondary">{`+ ${add.label}`}</Txt>
            </Pressable>
          ) : null}
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
  // A divider: a coloured top edge, its words; the selected one is the page's colour and sits on the line.
  divider: { minHeight: 44, justifyContent: "center", paddingHorizontal: 14, borderWidth: StyleSheet.hairlineWidth, borderTopWidth: 3, borderBottomWidth: 0, marginBottom: -StyleSheet.hairlineWidth },
  binderScroll: { alignItems: "flex-end", paddingHorizontal: 8 },
  binderRow: { flexDirection: "row", alignItems: "flex-end" },
  add: { minHeight: 44, justifyContent: "center", paddingHorizontal: 10 },
});
