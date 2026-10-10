import * as React from "react";
import { StyleSheet, Text, type TextProps } from "react-native";

import { type Theme, useTheme } from "./theme";

export type TxtVariant = "display" | "title" | "body" | "caption" | "label" | "mono";
export type TxtTone = "text" | "secondary" | "muted" | "accent" | "success" | "warning" | "danger" | "onAccent" | "onMedia";

const TONE: Record<TxtTone, keyof Theme> = {
  text: "textPrimary",
  secondary: "textSecondary",
  muted: "textMuted",
  accent: "accent",
  success: "success",
  warning: "warning",
  danger: "danger",
  onAccent: "onAccent",
  onMedia: "textOnMedia",
};

export type TxtProps = TextProps & {
  /** The type scale: display · title · body (default) · caption · label · mono (tabular figures). */
  variant?: TxtVariant;
  /** A text role of the theme (default `text`). */
  tone?: TxtTone;
};

/** Text in the platform's scale, coloured by a role of the current theme. `title` and `display` are headers for screen readers. */
export function Txt({ variant = "body", tone = "text", style, ...props }: TxtProps) {
  const { theme, fonts } = useTheme();
  const family = variant === "display" || variant === "title" ? fonts.display : variant === "mono" ? fonts.mono : fonts.sans;
  return (
    <Text
      role={variant === "display" || variant === "title" ? "heading" : undefined}
      {...props}
      style={[styles[variant], { color: theme[TONE[tone]] }, family ? { fontFamily: family } : null, style]}
    />
  );
}

export const textStyles = StyleSheet.create({
  display: { fontSize: 30, lineHeight: 36, fontWeight: "900", letterSpacing: -0.5 },
  title: { fontSize: 18, lineHeight: 24, fontWeight: "800" },
  body: { fontSize: 15, lineHeight: 21 },
  caption: { fontSize: 12, lineHeight: 16 },
  label: { fontSize: 14, lineHeight: 18, fontWeight: "700" },
  mono: { fontSize: 14, lineHeight: 18, fontWeight: "700", fontVariant: ["tabular-nums"] },
});
const styles = textStyles;
