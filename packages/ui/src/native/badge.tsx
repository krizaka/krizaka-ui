import * as React from "react";
import { Animated, StyleSheet, Text, type ViewProps } from "react-native";

import { badgeRecipe } from "../badge/recipe";
import { nativeRecipe } from "../recipes/native";
import { type Theme, useReducedMotion, useTheme } from "./theme";

export type BadgeTone = "neutral" | "accent" | "success" | "warning" | "danger" | "scrim";

const RECIPE = nativeRecipe(badgeRecipe);

/** What a badge wears: read from the same recipe as the web's `badgeVariants` (badge/recipe.ts), on the theme's roles. */
function look(tone: BadgeTone, size: "sm" | "md", t: Theme) {
  const { frame, text, dot } = RECIPE.resolve({ tone, size }, t).base!;
  const fg = text.color ?? t.textPrimary;
  return {
    bg: frame.backgroundColor ?? "transparent",
    border: frame.borderColor ?? "transparent",
    // The dot is the tone's colour, or the text's own (`bg-current` on the web).
    dot: dot ?? fg,
    paddingHorizontal: frame.paddingHorizontal ?? 8,
    paddingVertical: frame.paddingVertical ?? 2,
    text: { color: fg, fontSize: text.fontSize ?? 10, fontWeight: text.fontWeight, letterSpacing: text.letterSpacing, textTransform: text.textTransform },
  };
}

export type BadgeProps = ViewProps & {
  /** neutral (default) · accent · success · warning · danger · scrim (on a media). */
  tone?: BadgeTone;
  /** sm (default) · md. */
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
  const colors = look(tone, size, theme);
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
      style={[styles.root, { paddingHorizontal: colors.paddingHorizontal, paddingVertical: colors.paddingVertical, backgroundColor: colors.bg, borderColor: colors.border }, style]}
    >
      {dot ? <Animated.View aria-hidden style={[styles.dot, { backgroundColor: colors.dot, opacity }]} /> : null}
      {typeof children === "string" || typeof children === "number" ? (
        <Text style={colors.text}>{children}</Text>
      ) : (
        children
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { flexDirection: "row", alignItems: "center", alignSelf: "flex-start", gap: 4, borderRadius: 9999, borderWidth: 1 },
  dot: { width: 6, height: 6, borderRadius: 3 },
});
