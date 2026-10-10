import * as React from "react";
import { StyleSheet, View, type ViewProps } from "react-native";

import { useTheme } from "./theme";
import { Txt } from "./txt";

export type EmptyStateProps = Omit<ViewProps, "children"> & {
  /** A decorative icon (hidden from screen readers). */
  icon?: React.ReactNode;
  /** What is empty, in a few words ("No notifications yet"). */
  title: string;
  /** Why, or what will fill it. */
  description?: string;
  /** What to do next: a Button. */
  action?: React.ReactNode;
};

/** What a list, a search or a screen says when it has nothing to show — every word is a prop. */
export function EmptyState({ icon, title, description, action, style, ...props }: EmptyStateProps) {
  const { theme } = useTheme();
  return (
    <View {...props} style={[styles.root, style]}>
      {icon ? (
        <View aria-hidden style={[styles.icon, { backgroundColor: theme.surface2 }]}>
          {icon}
        </View>
      ) : null}
      <Txt variant="label" role="heading" style={styles.center}>
        {title}
      </Txt>
      {description ? (
        <Txt tone="secondary" style={styles.center}>
          {description}
        </Txt>
      ) : null}
      {action ? <View style={styles.action}>{action}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 40, paddingHorizontal: 24 },
  icon: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center", marginBottom: 4 },
  center: { textAlign: "center", maxWidth: 360 },
  action: { marginTop: 8, flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 8 },
});
