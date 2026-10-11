import * as React from "react";
import { ActivityIndicator, Pressable, type PressableProps, type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";
import Svg, { Defs, Line, LinearGradient, Path, Rect, Stop } from "react-native-svg";

import { Material } from "./material";
import { CUT_SIZE, type Theme, useTheme } from "./theme";
import { Txt } from "./txt";

export type ButtonVariant = "primary" | "gradient" | "secondary" | "outline" | "soft" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

type Look = {
  bg: string;
  fg: string;
  border: string;
  gradient?: readonly [string, string];
  /** The material (BRAND.md §6): the sheen of a raised surface, the shade of a fill, the edge of light on top. */
  sheen?: string;
  shade?: string;
  edge?: string;
};

/** The same seven looks as the web `buttonVariants`, from the theme's roles. */
function look(variant: ButtonVariant, t: Theme): Look {
  switch (variant) {
    case "primary":
      // The accent, lit along its top edge and shaded at the bottom (on-accent stays ≥ 4.5:1, tested in tokens).
      return { bg: t.accent, fg: t.onAccent, border: t.accent, shade: t.fillShade, edge: t.edgeOnFill };
    case "gradient":
      // The brand's signature: accent → accent-2, left to right; on-accent reads on both stops (tested in tokens).
      return { bg: t.accent, fg: t.onAccent, border: "transparent", gradient: [t.accent, t.accent2], edge: t.edgeOnFill };
    case "outline":
      return { bg: "transparent", fg: t.textPrimary, border: t.borderDefault };
    case "soft":
      return { bg: t.accentSoft, fg: t.textPrimary, border: "transparent" };
    case "ghost":
      return { bg: "transparent", fg: t.textSecondary, border: "transparent" };
    case "danger":
      // As on the web: the border and the tint carry the danger, the label stays a text role (legible in light).
      return { bg: t.dangerSoft, fg: t.textPrimary, border: t.danger };
    default:
      // A raised surface: the sheen and the edge of light.
      return { bg: t.surface2, fg: t.textPrimary, border: t.borderDefault, sheen: t.surfaceSheen, edge: t.edgeLight };
  }
}

const HEIGHT: Record<ButtonSize, number> = { sm: 32, md: 40, lg: 48 };
const PADDING: Record<ButtonSize, number> = { sm: 12, md: 16, lg: 24 };

type BaseProps = Omit<PressableProps, "children" | "style"> & {
  /** The look: `primary`, `gradient` (accent → accent-2), `secondary` (default), `outline`, `soft` (a tint of the accent), `ghost`, `danger` — as on the web. */
  variant?: ButtonVariant;
  /** sm · md (default) · lg: 32, 40 or 48 points high. */
  size?: ButtonSize;
  /**
   * `auto` (default: the griffe on the call to action — `primary` and `gradient` cut at 45°, as on the web; the others
   * rounded), `rounded`, `pill`, or `cut` (any look).
   */
  shape?: "auto" | "rounded" | "pill" | "cut";
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

function useButton({ variant = "secondary", size = "md", shape = "auto", loading, disabled }: BaseProps) {
  const { theme, radius } = useTheme();
  const colors = look(variant, theme);
  const inactive = Boolean(disabled || loading);
  // React Native has no corner-shape: a cut button draws its own frame (CutFrame), the view stays square and clear.
  const cut = shape === "cut" || (shape === "auto" && (variant === "primary" || variant === "gradient"));
  const frame = (pressed: boolean): ViewStyle => ({
    height: HEIGHT[size],
    borderRadius: cut ? 0 : shape === "pill" ? radius.full : radius.sm,
    backgroundColor: cut ? "transparent" : colors.bg,
    borderColor: cut ? "transparent" : colors.border,
    opacity: inactive ? 0.4 : pressed ? 0.9 : 1,
    // A press compresses it (as on the web): what answers the hand.
    transform: [{ scale: pressed ? 0.97 : 1 }],
  });
  const radiusValue = cut ? CUT_SIZE : shape === "pill" ? radius.full : radius.sm;
  return { colors, inactive, frame, radiusValue, cut };
}

/** The four corners cut at 45° (the griffe, BRAND.md §6.1), drawn: the fill (or the brand gradient), the border, the shade
 * at the bottom and the edge of light along the top — between the cuts — and the node lit in the top-right cut. */
function CutFrame({ colors, id }: { colors: Look; id: string }) {
  const [box, setBox] = React.useState({ w: 0, h: 0 });
  const c = CUT_SIZE;
  const { w, h } = box;
  const d = `M${c} 0.5 H${w - c} L${w - 0.5} ${c} V${h - c} L${w - c} ${h - 0.5} H${c} L0.5 ${h - c} V${c} Z`;
  return (
    <View
      aria-hidden
      testID="kz-cut-frame"
      pointerEvents="none"
      style={StyleSheet.absoluteFill}
      onLayout={(e) => setBox({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })}
    >
      {w > 0 ? (
        <Svg width={w} height={h}>
          <Defs>
            {colors.gradient ? (
              <LinearGradient id={`${id}-fill`} x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0" stopColor={colors.gradient[0]} />
                <Stop offset="1" stopColor={colors.gradient[1]} />
              </LinearGradient>
            ) : null}
            {colors.shade ? (
              <LinearGradient id={`${id}-shade`} x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0.35" stopColor={colors.shade} stopOpacity={0} />
                <Stop offset="1" stopColor={colors.shade} />
              </LinearGradient>
            ) : null}
          </Defs>
          <Path d={d} fill={colors.gradient ? `url(#${id}-fill)` : colors.bg} stroke={colors.border === "transparent" ? "none" : colors.border} strokeWidth={1} />
          {colors.shade ? <Path d={d} fill={`url(#${id}-shade)`} /> : null}
          {colors.edge ? <Line x1={c + 1} y1={1.5} x2={w - c - 1} y2={1.5} stroke={colors.edge} strokeWidth={1} /> : null}
          <Rect x={w - 9} y={4} width={3} height={3} rotation={45} originX={w - 7.5} originY={5.5} fill={colors.fg} opacity={0.55} />
        </Svg>
      ) : null}
    </View>
  );
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
  const { colors, inactive, frame, radiusValue, cut } = useButton({ variant, size, shape, loading, disabled });
  const gradientId = `kz-button-${React.useId().replace(/:/g, "")}`;
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
      {cut ? (
        <CutFrame colors={colors} id={gradientId} />
      ) : (
        <>
          <Fill colors={colors} id={gradientId} />
          <Material sheen={colors.sheen} shade={colors.shade} edge={colors.edge} radius={Math.min(radiusValue, HEIGHT[size] / 2)} />
        </>
      )}
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
  /** The icon (from the app's icon set); the button shows nothing else. */
  icon: React.ReactNode;
};

/** A square button holding only an icon: `label` is required, it is its accessible name. */
export function IconButton({ label, icon, variant, size = "md", shape, loading = false, disabled, style, ...props }: IconButtonProps) {
  const { colors, inactive, frame, radiusValue, cut } = useButton({ variant, size, shape, loading, disabled });
  const gradientId = `kz-button-${React.useId().replace(/:/g, "")}`;
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
      {cut ? (
        <CutFrame colors={colors} id={gradientId} />
      ) : (
        <>
          <Fill colors={colors} id={gradientId} />
          <Material sheen={colors.sheen} shade={colors.shade} edge={colors.edge} radius={Math.min(radiusValue, side / 2)} />
        </>
      )}
      {loading ? <ActivityIndicator aria-hidden size="small" color={colors.fg} /> : icon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: "center", justifyContent: "center", borderWidth: 1, overflow: "hidden" },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
});
