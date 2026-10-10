import * as React from "react";
import { Animated, StyleSheet, Text, type ViewProps } from "react-native";

import { alpha, type Theme, useReducedMotion, useTheme } from "./theme";

export type BadgeTone = "neutral" | "accent" | "success" | "warning" | "danger" | "scrim";

type Look = { bg: string; fg: string; border: string; dot: string };

// As on the web: the status tones are soft (a tint, a coloured dot); the text stays a text role.
function look(tone: BadgeTone, t: Theme): Look {
  switch (tone) {
    case "accent":
      return { bg: t.accentSoft, fg: t.textPrimary, border: alpha(t.accent, 0.4), dot: t.accent };
    case "success":
    case "warning":
    case "danger":
      return { bg: alpha(t[tone], 0.15), fg: t.textPrimary, border: alpha(t[tone], 0.4), dot: t[tone] };
    case "scrim":
      return { bg: t.scrim, fg: t.textOnMedia, border: "transparent", dot: t.textOnMedia };
    default:
      return { bg: t.surface3, fg: t.textSecondary, border: "transparent", dot: t.textSecondary };
  }
}

export type BadgeProps = ViewProps & {
  tone?: BadgeTone;
  size?: "sm" | "md";
  /** A small dot before the text, in the tone's colour. */
  dot?: boolean;
  /** The dot breathes (still when the system reduces motion). */
  pulse?: boolean;
  children?: React.ReactNode;
};

/** A short status in capitals: a tone, a size, an optional (pulsing) dot. */
export function Badge({ tone = "neutral", size = "sm", dot, pulse, style, children, ...props }: BadgeProps) {
  const { theme } = useTheme();
  const colors = look(tone, theme);
  const reduce = useReducedMotion();
  const [opacity] = React.useState(() => new Animated.Value(1));
  React.useEffect(() => {
    if (!dot || !pulse || reduce) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.35, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => {
      loop.stop();
      opacity.setValue(1);
    };
  }, [dot, pulse, reduce, opacity]);
  return (
    <Animated.View
      {...props}
      style={[styles.root, size === "md" ? styles.md : styles.sm, { backgroundColor: colors.bg, borderColor: colors.border }, style]}
    >
      {dot ? <Animated.View aria-hidden style={[styles.dot, { backgroundColor: colors.dot, opacity }]} /> : null}
      {typeof children === "string" || typeof children === "number" ? (
        <Text style={[styles.text, { color: colors.fg, fontSize: size === "md" ? 11 : 10 }]}>{children}</Text>
      ) : (
        children
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { flexDirection: "row", alignItems: "center", alignSelf: "flex-start", gap: 4, borderRadius: 9999, borderWidth: 1 },
  sm: { paddingHorizontal: 8, paddingVertical: 2 },
  md: { paddingHorizontal: 10, paddingVertical: 4 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  text: { fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.8 },
});
