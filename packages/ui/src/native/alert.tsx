import * as React from "react";
import { AccessibilityInfo, StyleSheet, View, type ViewProps } from "react-native";

import { alpha, useTheme } from "./theme";
import { Txt } from "./txt";

export type AlertTone = "info" | "success" | "warning" | "danger";

export type AlertProps = Omit<ViewProps, "children"> & {
  /** The tone: `danger` and `warning` are announced at once (`role="alert"`), `info` and `success` politely. */
  tone?: AlertTone;
  /** A decorative icon (hidden from screen readers), drawn in the tone's colour by the app. */
  icon?: React.ReactNode;
  /** The headline, in bold above the text. */
  title?: string;
  /** The text: what happened, what it means. */
  children?: React.ReactNode;
  /** What to do: a Button. */
  action?: React.ReactNode;
};

/** A message in the flow of the screen (not a toast): a soft tint of its tone, an icon, a title, a text, an action. */
export function Alert({ tone = "info", icon, title, children, action, style, ...props }: AlertProps) {
  const { theme, radius } = useTheme();
  const colour = theme[tone];
  const urgent = tone === "danger" || tone === "warning";
  // iOS reads no live region: an urgent alert is announced once when it appears (Android also has `aria-live`).
  const words = [title, typeof children === "string" ? children : null].filter(Boolean).join(". ");
  React.useEffect(() => {
    if (urgent && words) AccessibilityInfo.announceForAccessibility(words);
  }, [urgent, words]);
  return (
    <View
      role={urgent ? "alert" : "status"}
      aria-live={urgent ? "assertive" : "polite"}
      {...props}
      style={[styles.root, { borderRadius: radius.lg, borderColor: alpha(colour, 0.45), backgroundColor: alpha(colour, 0.1) }, style]}
    >
      {icon ? (
        <View aria-hidden style={styles.icon}>
          {icon}
        </View>
      ) : null}
      <View style={styles.content}>
        {title ? <Txt variant="label">{title}</Txt> : null}
        {typeof children === "string" ? <Txt tone="secondary">{children}</Txt> : children}
        {action ? <View style={styles.action}>{action}</View> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flexDirection: "row", alignItems: "flex-start", gap: 12, padding: 14, borderWidth: 1 },
  icon: { width: 20, height: 20, marginTop: 1, alignItems: "center", justifyContent: "center" },
  content: { flex: 1, minWidth: 0, gap: 4 },
  action: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 6 },
});
