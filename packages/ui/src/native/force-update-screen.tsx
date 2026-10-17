import * as React from "react";
import { type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";

import { Button } from "./button";
import { useTheme } from "./theme";
import { Txt } from "./txt";

export type ForceUpdateScreenProps = {
  /** The headline (“Update to keep going”) — passed translated. */
  title: string;
  /** Why, in a sentence — the backend's localized `message`. */
  message?: string;
  /** The versions, in mono (“You have 1.1.0 · 1.2.0 or later is required”). */
  versionLabel?: string;
  /** The product's mark or mascot (decorative). */
  mark?: React.ReactNode;
  /** The button that updates (“Update the app”). */
  updateLabel: string;
  /** Opens the store page (`Linking.openURL(storeUrl)`). */
  onUpdate: () => void;
  /** A secondary way (“I already updated”) — with `onRetry`. */
  retryLabel?: string;
  /** Checks the backend again (`useAppConfig().refresh`). */
  onRetry?: () => void;
  /** Fill the whole screen (default). `false` for a card in a catalogue. */
  fill?: boolean;
  /** Styles merged last. */
  style?: StyleProp<ViewStyle>;
};

/** The forced update: replaces the app, with one thing to do and the way to do it. */
export function ForceUpdateScreen({ title, message, versionLabel, mark, updateLabel, onUpdate, retryLabel, onRetry, fill = true, style }: ForceUpdateScreenProps) {
  const { theme } = useTheme();
  return (
    <View
      aria-modal
      accessibilityViewIsModal
      style={[styles.root, fill ? styles.fill : null, { backgroundColor: theme.surface0 }, style]}
    >
      {mark ? (
        <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={styles.mark}>
          {mark}
        </View>
      ) : null}
      <Txt variant="title" style={styles.centred}>
        {title}
      </Txt>
      {message ? (
        <Txt tone="secondary" style={styles.centred}>
          {message}
        </Txt>
      ) : null}
      {versionLabel ? (
        <Txt variant="mono" tone="muted" style={styles.centred}>
          {versionLabel}
        </Txt>
      ) : null}
      <View style={styles.actions}>
        <Button label={updateLabel} variant="primary" size="lg" onPress={onUpdate} />
        {retryLabel && onRetry ? <Button label={retryLabel} variant="ghost" onPress={onRetry} /> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { alignItems: "center", justifyContent: "center", gap: 12, padding: 24 },
  fill: { flex: 1 },
  mark: { width: 96, height: 96, alignItems: "center", justifyContent: "center" },
  centred: { textAlign: "center", maxWidth: 340 },
  actions: { marginTop: 8, gap: 8, alignSelf: "stretch", maxWidth: 340, width: "100%" },
});
