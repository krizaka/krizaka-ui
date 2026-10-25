import * as React from "react";
import { Pressable, type StyleProp, StyleSheet, Text, View, type ViewStyle } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

import { countName, countText } from "../app-header/count-text";
import { useTheme } from "./theme";
import { Txt } from "./txt";

export type AppHeaderProps = {
  /** The product's name, as text (`Yomizaka`). */
  name: string;
  /** The product's mark (`<ProductMark id="yomizaka" size={24} />`), before the name. */
  mark?: React.ReactNode;
  /** Makes the name a button home; its accessible name is `name`. */
  onHome?: () => void;
  /** The search trigger, first of the controls: `AppHeaderSearch`. */
  search?: React.ReactNode;
  /** The language (« FR »): the host's control, labelled. */
  language?: React.ReactNode;
  /** The host's own controls, after the language. */
  actions?: React.ReactNode;
  /** Messages: an `AppHeaderCount`. Empty: hidden. */
  messages?: React.ReactNode;
  /** Notifications: an `AppHeaderCount`. Empty: hidden. */
  notifications?: React.ReactNode;
  /** The one primary action, before the account. */
  primary?: React.ReactNode;
  /** The account, last (an `Avatar` in a button, named). */
  account?: React.ReactNode;
  /** Styles merged last. */
  style?: StyleProp<ViewStyle>;
};

/**
 * The app's top bar, the web's `AppHeader` on a phone: the mark and the name, then the controls in the family's fixed order —
 * search · language · actions · messages · notifications · primary · account — under the status bar's safe area. The
 * name truncates first; the controls keep their size.
 */
export function AppHeader({ name, mark, onHome, search, language, actions, messages, notifications, primary, account, style }: AppHeaderProps) {
  const { theme, insets } = useTheme();
  const brand = (
    <>
      {mark}
      <Txt variant="label" numberOfLines={1} style={styles.name}>
        {name}
      </Txt>
    </>
  );
  return (
    <View role="banner" style={[{ paddingTop: insets.top, backgroundColor: theme.surface1, borderBottomColor: theme.borderSubtle }, styles.root, style]}>
      <View style={styles.bar}>
        {onHome ? (
          <Pressable role="link" aria-label={name} onPress={onHome} style={styles.brand}>
            {brand}
          </Pressable>
        ) : (
          <View style={styles.brand}>{brand}</View>
        )}
        <View style={styles.controls}>
          {search}
          {language}
          {actions}
          {messages}
          {notifications}
          {primary}
          {account}
        </View>
      </View>
    </View>
  );
}

export type AppHeaderCountProps = {
  /** What it is (« Notifications ») — passed translated; its accessible name, with the count. */
  label: string;
  /** The icon (an `@krizaka/icons/native` glyph): decorative. */
  icon: React.ReactNode;
  /** The unread count; 0 or absent draws no badge. */
  count?: number;
  /** The count in words (« 3 new ») — passed translated, with its plural. Default: the number. */
  countLabel?: string;
  /** Above it the badge shows `max+`. Default 99. */
  max?: number;
  /** Opens the screen (Notifications, Messages). */
  onPress?: () => void;
  /** The screen it leads to is on view (drawn as pressed). */
  current?: boolean;
};

/** An icon button of the top bar with an unread count, the count said in its name (« Notifications, 3 new »). */
export function AppHeaderCount({ label, icon, count, countLabel, max = 99, onPress, current }: AppHeaderCountProps) {
  const { theme } = useTheme();
  const text = countText(count, max);
  return (
    <Pressable
      role="button"
      aria-label={countName(label, count, countLabel)}
      onPress={onPress}
      hitSlop={4}
      style={({ pressed }) => [styles.icon, (pressed || current) && { backgroundColor: theme.surface2 }]}
    >
      <View aria-hidden>{icon}</View>
      {text ? (
        <View aria-hidden style={[styles.count, { backgroundColor: theme.accent, borderColor: theme.surface1 }]}>
          <Text style={[styles.countText, { color: theme.onAccent }]}>{text}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

export type AppHeaderSearchProps = {
  /** What it searches (« Search files and checks ») — passed translated: the button's name. */
  label: string;
  /** Opens the app's search screen or palette. */
  onOpen: () => void;
};

/** The top bar's search trigger on a phone: a magnifier, named by `label`, that opens the app's search. */
export function AppHeaderSearch({ label, onOpen }: AppHeaderSearchProps) {
  const { theme } = useTheme();
  return (
    <Pressable role="button" aria-label={label} onPress={onOpen} hitSlop={4} style={({ pressed }) => [styles.icon, pressed && { backgroundColor: theme.surface2 }]}>
      <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={theme.textSecondary} strokeWidth={2} strokeLinecap="round" aria-hidden>
        <Circle cx={11} cy={11} r={7} />
        <Path d="m20 20-3.5-3.5" />
      </Svg>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { borderBottomWidth: StyleSheet.hairlineWidth },
  bar: { height: 56, flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 12 },
  brand: { flexShrink: 1, minWidth: 0, flexDirection: "row", alignItems: "center", gap: 8, minHeight: 44 },
  name: { flexShrink: 1, fontWeight: "700" },
  controls: { marginLeft: "auto", flexShrink: 0, flexDirection: "row", alignItems: "center", gap: 4 },
  icon: { width: 40, height: 40, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  count: { position: "absolute", top: 2, right: 0, minWidth: 18, height: 18, paddingHorizontal: 4, borderRadius: 9, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  countText: { fontSize: 10, fontWeight: "700", lineHeight: 12, fontVariant: ["lining-nums", "tabular-nums"] },
});
