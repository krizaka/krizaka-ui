// The native twin of the web SettingsRow: an optional icon tile, the label and its help, a value or a control on the
// right, a chevron when the row opens something. `SettingsGroup` is the titled card of hairline-separated rows.
import * as React from "react";
import { Pressable, StyleSheet, View, type ViewProps } from "react-native";
import Svg, { Path } from "react-native-svg";

import { useTheme } from "./theme";
import { Txt } from "./txt";

export type SettingsRowProps = {
  /** What the setting is ("Username"), passed translated. */
  label: string;
  /** One line of help under the label. */
  description?: string;
  /** An icon (24 pt) drawn in a tile before the label. */
  icon?: React.ReactNode;
  /** The current value on the right ("English", "Dark"). */
  value?: string;
  /** A control on the right (a `Switch`): the row is then not pressable by itself. */
  trailing?: React.ReactNode;
  /** Makes the row a button that opens something; a chevron is shown. */
  onPress?: () => void;
  /** Tints the label as dangerous ("Delete account"). */
  destructive?: boolean;
  /** The row's accessible name when the visible words do not say it all; by default the visible words (label, help, value) are read. */
  accessibilityLabel?: string;
  /** Not available: dimmed and not pressable. */
  disabled?: boolean;
};

/** One setting: its label and help on the left, its value or control on the right; a button when `onPress` is given. */
export function SettingsRow({ label, description, icon, value, trailing, onPress, destructive, accessibilityLabel, disabled }: SettingsRowProps) {
  const { theme } = useTheme();
  const body = (
    <>
      {icon ? <View style={[styles.tile, { backgroundColor: theme.surface3 }]}>{icon}</View> : null}
      <View style={styles.text}>
        <Txt variant="body" tone={destructive ? "danger" : "text"}>
          {label}
        </Txt>
        {description ? (
          <Txt variant="caption" tone="secondary">
            {description}
          </Txt>
        ) : null}
      </View>
      {value ? (
        <Txt variant="caption" tone="secondary" numberOfLines={1} style={styles.value}>
          {value}
        </Txt>
      ) : null}
      {trailing}
      {onPress && !trailing ? (
        <Svg width={16} height={16} viewBox="0 0 24 24" aria-hidden>
          <Path d="m9 6 6 6-6 6" fill="none" stroke={theme.textMuted} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      ) : null}
    </>
  );
  if (onPress && !trailing) {
    return (
      <Pressable
        role="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled: !!disabled }}
        disabled={disabled}
        onPress={onPress}
        style={({ pressed }) => [styles.row, pressed ? { backgroundColor: theme.surface2 } : null, disabled ? styles.disabled : null]}
      >
        {body}
      </Pressable>
    );
  }
  return (
    <View accessible={!trailing} accessibilityLabel={trailing ? undefined : accessibilityLabel} style={[styles.row, disabled ? styles.disabled : null]}>
      {body}
    </View>
  );
}

export type SettingsGroupProps = ViewProps & {
  /** The group's title ("Account"), passed translated; a heading for screen readers. */
  title?: string;
  /** The rows (`SettingsRow`). */
  children: React.ReactNode;
};

/** A titled card of `SettingsRow`s, divided by hairlines. */
export function SettingsGroup({ title, children, style, ...props }: SettingsGroupProps) {
  const { theme } = useTheme();
  const rows = React.Children.toArray(children).filter(Boolean);
  return (
    <View {...props} style={[styles.group, style]}>
      {title ? (
        <Txt variant="caption" tone="muted" role="heading" style={styles.title}>
          {title}
        </Txt>
      ) : null}
      <View style={[styles.card, { backgroundColor: theme.surface1, borderColor: theme.borderSubtle }]}>
        {rows.map((row, i) => (
          <React.Fragment key={i}>
            {i > 0 ? <View style={[styles.hairline, { backgroundColor: theme.borderSubtle }]} /> : null}
            {row}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  group: { rowGap: 8 },
  title: { textTransform: "uppercase", letterSpacing: 0.6, fontWeight: "700", paddingHorizontal: 4 },
  card: { borderWidth: StyleSheet.hairlineWidth, borderRadius: 16, overflow: "hidden" },
  hairline: { height: StyleSheet.hairlineWidth, marginLeft: 16 },
  row: { minHeight: 52, flexDirection: "row", alignItems: "center", columnGap: 12, paddingHorizontal: 16, paddingVertical: 10 },
  tile: { width: 32, height: 32, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  text: { flex: 1, rowGap: 2 },
  value: { maxWidth: "45%" },
  disabled: { opacity: 0.5 },
});
