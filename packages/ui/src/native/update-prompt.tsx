import * as React from "react";
import { type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";

import { Button } from "./button";
import { useTheme } from "./theme";
import { Txt } from "./txt";

export type UpdatePromptProps = {
  /** The headline (“A new version is available”) — passed translated; also the accessible name of the card. */
  title: string;
  /** Why update, in a sentence — the backend's localized `message`. */
  message?: string;
  /** The versions, in mono (“1.2.0 → 1.4.0”). */
  versionLabel?: string;
  /** The product's mark (decorative), e.g. `<ProductMark id="orazaka" size={40} />`. */
  mark?: React.ReactNode;
  /** The button that updates (“Update”). */
  updateLabel: string;
  /** Opens the store page (`Linking.openURL(storeUrl)`). */
  onUpdate: () => void;
  /** The way out (“Later”). */
  laterLabel: string;
  /** Called by the way out: `useAppConfig().dismissSoft` remembers it for this version. */
  onLater: () => void;
  /** Styles merged last. */
  style?: StyleProp<ViewStyle>;
};

/** The soft update: a card the person can dismiss, never a blocker. */
export function UpdatePrompt({ title, message, versionLabel, mark, updateLabel, onUpdate, laterLabel, onLater, style }: UpdatePromptProps) {
  const { theme, radius } = useTheme();
  return (
    <View
      role="region"
      aria-label={title}
      style={[styles.root, { backgroundColor: theme.surface1, borderColor: theme.borderSubtle, borderRadius: radius.xl }, style]}
    >
      <View style={styles.head}>
        {mark ? (
          <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={styles.mark}>
            {mark}
          </View>
        ) : null}
        <View style={styles.text}>
          <Txt variant="label">{title}</Txt>
          {message ? <Txt tone="secondary">{message}</Txt> : null}
          {versionLabel ? (
            <Txt variant="mono" tone="muted">
              {versionLabel}
            </Txt>
          ) : null}
        </View>
      </View>
      <View style={styles.actions}>
        <Button label={laterLabel} variant="ghost" size="sm" onPress={onLater} />
        <Button label={updateLabel} variant="primary" size="sm" onPress={onUpdate} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: 12, padding: 16, borderWidth: StyleSheet.hairlineWidth },
  head: { flexDirection: "row", gap: 12, alignItems: "center" },
  mark: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  text: { flex: 1, gap: 2 },
  actions: { flexDirection: "row", justifyContent: "flex-end", gap: 8 },
});
