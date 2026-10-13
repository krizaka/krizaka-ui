import * as React from "react";
import { Pressable, type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";

import { useTheme } from "./theme";
import { Txt } from "./txt";

export type FabProps = {
  /** The action in words (“New challenge”) — passed translated: the accessible name, and shown when `extended`. */
  label: string;
  /** The icon (decorative). */
  icon: React.ReactNode;
  /** What it does. */
  onPress: () => void;
  /** Shows the words beside the icon (collapse it while the list scrolls down). */
  extended?: boolean;
  /** Which corner. Default `end` (bottom right in left-to-right). */
  placement?: "end" | "center" | "start";
  /** Extra distance from the bottom, above a tab bar (its height). Default 0. */
  offset?: number;
  /** Styles merged last. */
  style?: StyleProp<ViewStyle>;
};

/**
 * The screen's main action, floating above the content in the accent — one per screen (create, compose, record). It
 * keeps clear of the safe area and the tab bar (`offset`), shows its words when `extended`, a light tap confirms.
 */
export function Fab({ label, icon, onPress, extended, placement = "end", offset = 0, style }: FabProps) {
  const { theme, insets, haptic } = useTheme();
  const position: ViewStyle =
    placement === "center" ? { alignSelf: "center" } : placement === "start" ? { left: 16 + insets.left } : { right: 16 + insets.right };
  return (
    <View pointerEvents="box-none" style={[styles.layer, placement === "center" ? styles.centre : null]}>
      <Pressable
        role="button"
        aria-label={label}
        onPress={() => {
          haptic("impact");
          onPress();
        }}
        style={({ pressed }) => [
          styles.fab,
          extended ? styles.extended : null,
          position,
          { bottom: 16 + insets.bottom + offset, backgroundColor: pressed ? theme.accentHover : theme.accent, borderTopColor: theme.edgeOnFill, shadowColor: theme.scrimStrong },
          style,
        ]}
      >
        <View aria-hidden>{icon}</View>
        {extended ? (
          <Txt variant="label" tone="onAccent" aria-hidden numberOfLines={1} style={styles.label}>
            {label}
          </Txt>
        ) : null}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  layer: { position: "absolute", top: 0, right: 0, bottom: 0, left: 0 },
  centre: { alignItems: "center" },
  fab: { borderTopWidth: 1, borderColor: "transparent", position: "absolute", minWidth: 56, height: 56, borderRadius: 28, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8, shadowOpacity: 0.3, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 6 },
  extended: { paddingHorizontal: 20 },
  label: { flexShrink: 0 },
});
