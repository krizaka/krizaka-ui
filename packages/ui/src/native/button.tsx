import * as React from "react";
import { ActivityIndicator, Pressable, type PressableProps, type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";

import { alpha, type Theme, useTheme } from "./theme";
import { Txt } from "./txt";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

type Look = { bg: string; fg: string; border: string };

/** The same five looks as the web `buttonVariants`, from the theme's roles. */
function look(variant: ButtonVariant, t: Theme): Look {
  switch (variant) {
    case "primary":
      return { bg: t.accent, fg: t.onAccent, border: t.accent };
    case "outline":
      return { bg: "transparent", fg: t.textPrimary, border: t.borderDefault };
    case "ghost":
      return { bg: "transparent", fg: t.textSecondary, border: "transparent" };
    case "danger":
      // As on the web: the border and the tint carry the danger, the label stays a text role (legible in light).
      return { bg: alpha(t.danger, 0.1), fg: t.textPrimary, border: alpha(t.danger, 0.5) };
    default:
      return { bg: t.surface2, fg: t.textPrimary, border: t.borderDefault };
  }
}

const HEIGHT: Record<ButtonSize, number> = { sm: 32, md: 40, lg: 48 };
const PADDING: Record<ButtonSize, number> = { sm: 12, md: 16, lg: 24 };

type BaseProps = Omit<PressableProps, "children" | "style"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** `rounded` (default) or `pill`. */
  shape?: "rounded" | "pill";
  /** Disables, shows a spinner in place of the icon and says busy. */
  loading?: boolean;
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
  const colors = look(variant, theme);
  const inactive = Boolean(disabled || loading);
  const frame = (pressed: boolean): ViewStyle => ({
    height: HEIGHT[size],
    borderRadius: shape === "pill" ? radius.full : radius.sm,
    backgroundColor: colors.bg,
    borderColor: colors.border,
    opacity: inactive ? 0.4 : pressed ? 0.85 : 1,
    transform: [{ scale: pressed ? 0.98 : 1 }],
  });
  return { colors, inactive, frame };
}

/** The action. `variant` × `size` × `shape`, `loading`, `icon`; the haptics, if any, belong to the app's `onPress`. */
export function Button({ label, icon, variant, size = "md", shape, loading = false, disabled, style, ...props }: ButtonProps) {
  const { colors, inactive, frame } = useButton({ variant, size, shape, loading, disabled });
  return (
    <Pressable
      role="button"
      aria-label={label}
      aria-disabled={inactive}
      aria-busy={loading}
      {...props}
      disabled={inactive}
      style={({ pressed }) => [styles.base, { paddingHorizontal: PADDING[size] }, frame(pressed), style]}
    >
      <View style={styles.row}>
        {loading ? <ActivityIndicator aria-hidden size="small" color={colors.fg} /> : icon}
        <Txt variant="label" numberOfLines={1} style={{ color: colors.fg, fontSize: size === "sm" ? 12 : 14 }}>
          {label}
        </Txt>
      </View>
    </Pressable>
  );
}

export type IconButtonProps = BaseProps & {
  /** The accessible name — required, passed translated. */
  label: string;
  icon: React.ReactNode;
};

/** A square button holding only an icon: `label` is required, it is its accessible name. */
export function IconButton({ label, icon, variant, size = "md", shape, loading = false, disabled, style, ...props }: IconButtonProps) {
  const { colors, inactive, frame } = useButton({ variant, size, shape, loading, disabled });
  const side = HEIGHT[size];
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
      {loading ? <ActivityIndicator aria-hidden size="small" color={colors.fg} /> : icon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: "center", justifyContent: "center", borderWidth: 1 },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
});
