import * as React from "react";
import { ActivityIndicator, Pressable, type PressableProps, type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";

import { buttonRecipe } from "../button/recipe";
import { nativeRecipe,type NativeText } from "../recipes/native";
import { type Theme, useTheme } from "./theme";
import { Txt } from "./txt";

export type ButtonVariant = "primary" | "gradient" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

/** What a button wears: read from the same recipe as the web's `buttonVariants` (button/recipe.ts), on the theme's roles. */
type Look = { bg: string; fg: string; border: string; gradient?: readonly [string, string]; height: number; paddingHorizontal: number; fontSize: number; fontWeight?: NativeText["fontWeight"] };

const RECIPE = nativeRecipe(buttonRecipe);

function look(variant: ButtonVariant, size: ButtonSize, t: Theme): Look {
  const { frame, text, gradient } = RECIPE.resolve({ variant, size }, t).base!;
  return {
    // The brand's signature, accent → accent-2, is drawn over this fill; on-accent reads on both stops (tested in tokens).
    bg: frame.backgroundColor ?? gradient?.[0] ?? "transparent",
    fg: text.color ?? t.textPrimary,
    border: frame.borderColor ?? "transparent",
    gradient,
    height: frame.height ?? 40,
    paddingHorizontal: frame.paddingHorizontal ?? 16,
    fontSize: text.fontSize ?? 14,
    fontWeight: text.fontWeight,
  };
}

type BaseProps = Omit<PressableProps, "children" | "style"> & {
  /** The look: `primary`, `gradient` (accent → accent-2), `secondary` (default), `outline`, `ghost`, `danger` — as on the web. */
  variant?: ButtonVariant;
  /** sm · md (default) · lg: 32, 40 or 48 points high. */
  size?: ButtonSize;
  /** `rounded` (default) or `pill`. */
  shape?: "rounded" | "pill";
  /** Disables, shows a spinner in place of the icon and says busy. */
  loading?: boolean;
  /** Styles merged last, over the button's frame. */
  style?: StyleProp<ViewStyle>;
};

export type ButtonProps = BaseProps & {
  /** The visible text — passed translated. It is also the accessible name. */
  label: string;
  /** Before the label (an icon component from the app's icon set). */
  icon?: React.ReactNode;
};

function useButton({ variant = "secondary", size = "md", shape = "rounded", loading, disabled }: BaseProps) {
  const { theme, radius } = useTheme();
  const colors = look(variant, size, theme);
  const inactive = Boolean(disabled || loading);
  const frame = (pressed: boolean): ViewStyle => ({
    height: colors.height,
    borderRadius: shape === "pill" ? radius.full : radius.sm,
    backgroundColor: colors.bg,
    borderColor: colors.border,
    opacity: inactive ? 0.4 : pressed ? 0.85 : 1,
    transform: [{ scale: pressed ? 0.98 : 1 }],
  });
  return { colors, inactive, frame };
}

/** The gradient fill behind the content (react-native-svg: no native gradient in React Native). */
function Fill({ colors, id }: { colors: Look; id: string }) {
  if (!colors.gradient) return null;
  return (
    <Svg aria-hidden pointerEvents="none" style={StyleSheet.absoluteFill} width="100%" height="100%">
      <Defs>
        <LinearGradient id={id} x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor={colors.gradient[0]} />
          <Stop offset="1" stopColor={colors.gradient[1]} />
        </LinearGradient>
      </Defs>
      <Rect width="100%" height="100%" fill={`url(#${id})`} />
    </Svg>
  );
}

/** The action. `variant` × `size` × `shape`, `loading`, `icon`; the haptics, if any, belong to the app's `onPress`. */
export function Button({ label, icon, variant, size = "md", shape, loading = false, disabled, style, ...props }: ButtonProps) {
  const { colors, inactive, frame } = useButton({ variant, size, shape, loading, disabled });
  const gradientId = `kz-button-${React.useId().replace(/:/g, "")}`;
  return (
    <Pressable
      role="button"
      aria-label={label}
      aria-disabled={inactive}
      aria-busy={loading}
      {...props}
      disabled={inactive}
      style={({ pressed }) => [styles.base, { paddingHorizontal: colors.paddingHorizontal }, frame(pressed), style]}
    >
      <Fill colors={colors} id={gradientId} />
      <View style={styles.row}>
        {loading ? <ActivityIndicator aria-hidden size="small" color={colors.fg} /> : icon}
        <Txt variant="label" numberOfLines={1} style={{ color: colors.fg, fontSize: colors.fontSize, fontWeight: colors.fontWeight }}>
          {label}
        </Txt>
      </View>
    </Pressable>
  );
}

export type IconButtonProps = BaseProps & {
  /** The accessible name — required, passed translated. */
  label: string;
  /** The icon (from the app's icon set); the button shows nothing else. */
  icon: React.ReactNode;
};

/** A square button holding only an icon: `label` is required, it is its accessible name. */
export function IconButton({ label, icon, variant, size = "md", shape, loading = false, disabled, style, ...props }: IconButtonProps) {
  const { colors, inactive, frame } = useButton({ variant, size, shape, loading, disabled });
  const gradientId = `kz-button-${React.useId().replace(/:/g, "")}`;
  const side = colors.height;
  return (
    <Pressable
      role="button"
      aria-label={label}
      aria-disabled={inactive}
      aria-busy={loading}
      hitSlop={side < 44 ? (44 - side) / 2 : undefined}
      {...props}
      disabled={inactive}
      style={({ pressed }) => [styles.base, frame(pressed), { width: side }, style]}
    >
      <Fill colors={colors} id={gradientId} />
      {loading ? <ActivityIndicator aria-hidden size="small" color={colors.fg} /> : icon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: "center", justifyContent: "center", borderWidth: 1, overflow: "hidden" },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
});
