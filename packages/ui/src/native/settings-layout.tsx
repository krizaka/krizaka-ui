import * as React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Svg, { Path } from "react-native-svg";

import { useTheme } from "./theme";
import { Txt } from "./txt";

export type SettingsSectionProps = {
  /** The group's title (`Account`), small capitals above the card: it names the group for screen readers. */
  title: string;
  /** What these settings change, in one sentence, under the card. */
  description?: string;
  /** The rows (`SettingsRow`), hairline-separated on one card. */
  children: React.ReactNode;
  /** At the foot of the group: a note, a Button. */
  footer?: React.ReactNode;
};

/** A titled group of settings rows on one card, hairlines between them — a phone's settings screen is a column of these. */
export function SettingsSection({ title, description, children, footer }: SettingsSectionProps) {
  const { theme, radius } = useTheme();
  const rows = React.Children.toArray(children).filter(Boolean);
  return (
    <View role="group" aria-label={title} style={styles.section}>
      <Txt variant="caption" tone="secondary" role="heading" style={styles.title}>
        {title}
      </Txt>
      <View style={[styles.card, { borderRadius: radius.lg, backgroundColor: theme.surface1, borderColor: theme.borderSubtle }]}>
        {rows.map((row, index) => (
          <View key={index} style={index > 0 ? [styles.separator, { borderTopColor: theme.borderSubtle }] : undefined}>
            {row}
          </View>
        ))}
      </View>
      {description ? (
        <Txt variant="caption" tone="secondary" style={styles.note}>
          {description}
        </Txt>
      ) : null}
      {footer ? <View style={styles.note}>{footer}</View> : null}
    </View>
  );
}

export type SettingsRowProps = {
  /** A signature icon (`@krizaka/icons/native`), decorative, drawn on an accent tile: receives the tile's text colour. */
  icon?: (color: string) => React.ReactNode;
  /** What the row sets (`Language`). */
  label: string;
  /** One line under the label. */
  hint?: string;
  /** The current value, on the right (`English`). */
  value?: string;
  /** A control on the right instead of the value and chevron: a `Switch`. The row is then not pressable. */
  accessory?: React.ReactNode;
  /** Opens the setting: the row is a button with a chevron. */
  onPress?: () => void;
  /** A destructive row (`Sign out`, `Delete account`): its label in the danger text role. */
  destructive?: boolean;
};

/** A row of a settings group: icon, label, hint, value and chevron — or a control (`accessory`) such as a Switch. */
export function SettingsRow({ icon, label, hint, value, accessory, onPress, destructive }: SettingsRowProps) {
  const { theme } = useTheme();
  const content = (
    <>
      {icon ? (
        <View aria-hidden style={[styles.icon, { backgroundColor: destructive ? theme.dangerSoft : theme.accentSoft }]}>
          {icon(destructive ? theme.dangerText : theme.accentText)}
        </View>
      ) : null}
      <View style={styles.text}>
        <Txt numberOfLines={1} tone={destructive ? "danger" : "text"}>
          {label}
        </Txt>
        {hint ? (
          <Txt variant="caption" tone="secondary" numberOfLines={2}>
            {hint}
          </Txt>
        ) : null}
      </View>
      {accessory ?? (
        <>
          {value ? (
            <Txt variant="caption" tone="secondary" numberOfLines={1} style={styles.value}>
              {value}
            </Txt>
          ) : null}
          {onPress ? (
            <Svg width={18} height={18} viewBox="0 0 24 24" aria-hidden>
              <Path d="m9 6 6 6-6 6" fill="none" stroke={theme.textMuted} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          ) : null}
        </>
      )}
    </>
  );
  if (onPress && !accessory) {
    return (
      <Pressable
        role="button"
        aria-label={[label, value, hint].filter(Boolean).join(", ")}
        onPress={onPress}
        style={({ pressed }) => [styles.row, { backgroundColor: pressed ? theme.surface2 : "transparent" }]}
      >
        {content}
      </Pressable>
    );
  }
  return <View style={styles.row}>{content}</View>;
}

const styles = StyleSheet.create({
  section: { gap: 8 },
  title: { textTransform: "uppercase", letterSpacing: 0.8, paddingHorizontal: 4, fontWeight: "600" },
  card: { borderWidth: StyleSheet.hairlineWidth, overflow: "hidden" },
  separator: { borderTopWidth: StyleSheet.hairlineWidth },
  note: { paddingHorizontal: 4 },
  row: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 14, paddingVertical: 12, minHeight: 56 },
  icon: { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  text: { flex: 1, minWidth: 0, gap: 2 },
  value: { maxWidth: 140 },
});
