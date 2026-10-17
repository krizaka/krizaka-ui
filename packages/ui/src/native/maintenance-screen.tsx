import * as React from "react";
import { type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";

import { Button } from "./button";
import { useTheme } from "./theme";
import { Txt } from "./txt";

export type MaintenanceScreenProps = {
  /** The headline (“Back in a few minutes”) — passed translated. */
  title: string;
  /** What is happening — the backend's localized maintenance `message`. */
  message?: string;
  /** The product's mark or mascot (decorative). */
  mark?: React.ReactNode;
  /** The button that checks again (“Try again”) — with `onRetry`. */
  retryLabel?: string;
  /** Checks the backend again (`useAppConfig().refresh`). */
  onRetry?: () => void;
  /** Fill the whole screen (default). `false` for a card in a catalogue. */
  fill?: boolean;
  /** Styles merged last. */
  style?: StyleProp<ViewStyle>;
};

/** The maintenance screen: announced politely, with one way to check again. */
export function MaintenanceScreen({ title, message, mark, retryLabel, onRetry, fill = true, style }: MaintenanceScreenProps) {
  const { theme } = useTheme();
  return (
    <View style={[styles.root, fill ? styles.fill : null, { backgroundColor: theme.surface0 }, style]}>
      {mark ? (
        <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={styles.mark}>
          {mark}
        </View>
      ) : null}
      <View role="status" style={styles.text}>
        <Txt variant="title" style={styles.centred}>
          {title}
        </Txt>
        {message ? (
          <Txt tone="secondary" style={styles.centred}>
            {message}
          </Txt>
        ) : null}
      </View>
      {retryLabel && onRetry ? (
        <View style={styles.actions}>
          <Button label={retryLabel} variant="secondary" onPress={onRetry} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { alignItems: "center", justifyContent: "center", gap: 12, padding: 24 },
  fill: { flex: 1 },
  mark: { width: 96, height: 96, alignItems: "center", justifyContent: "center" },
  text: { gap: 8, alignItems: "center" },
  centred: { textAlign: "center", maxWidth: 340 },
  actions: { marginTop: 8, alignSelf: "stretch", maxWidth: 340, width: "100%" },
});
