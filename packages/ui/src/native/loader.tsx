import * as React from "react";
import { AccessibilityInfo, Animated, Easing, type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

import type { BrandId } from "../marks/ProductLogo";
import { ProductMark } from "./ProductMark";
import { alpha, useReducedMotion, useTheme } from "./theme";
import { Txt } from "./txt";

/** The hexagon of the marks, pointy top, radius 9 around (12, 12): the web glyph's geometry. */
const HEX = "M12 3 19.79 7.5 19.79 16.5 12 21 4.21 16.5 4.21 7.5Z";
const PERIMETER = 54;

export type LoaderGlyphProps = {
  /** loading · success · error. */
  state?: "loading" | "success" | "error";
  /** Between 0 and 1: the trace grows to it. Absent: indeterminate (the trace turns). */
  value?: number | null;
  /** The side, in points. Default 20. */
  size?: number;
  /** The stroke colour. Default: the accent (success and error: their tones). */
  color?: string;
};

/** The Krizaka loader glyph (decorative): a hexagon traced by a segment of light around a node; done, a check or a cross. */
export function LoaderGlyph({ state = "loading", value, size = 20, color }: LoaderGlyphProps) {
  const { theme } = useTheme();
  const reduce = useReducedMotion();
  const [spin] = React.useState(() => new Animated.Value(0));
  const known = typeof value === "number" && Number.isFinite(value);
  React.useEffect(() => {
    if (state !== "loading" || known || reduce) return;
    const loop = Animated.loop(Animated.timing(spin, { toValue: 1, duration: 1400, easing: Easing.linear, useNativeDriver: true }));
    loop.start();
    return () => loop.stop();
  }, [state, known, reduce, spin]);
  const stroke = color ?? (state === "success" ? theme.success : state === "error" ? theme.danger : theme.accent);
  const fill = state !== "loading" ? 1 : known ? Math.min(1, Math.max(0, value)) : 0.3;
  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });
  return (
    <Animated.View aria-hidden style={{ width: size, height: size, transform: state === "loading" && !known ? [{ rotate }] : [] }}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d={HEX} stroke={stroke} strokeOpacity={0.22} strokeWidth={2.2} strokeLinejoin="round" />
        <Path d={HEX} stroke={stroke} strokeWidth={2.2} strokeLinejoin="round" strokeLinecap="round" strokeDasharray={`${fill * PERIMETER} ${PERIMETER}`} />
        {state === "loading" ? <Circle cx={12} cy={12} r={2.6} fill={stroke} /> : null}
        {state === "success" ? <Path d="M8.3 12.3l2.6 2.6 4.9-5.3" stroke={stroke} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" /> : null}
        {state === "error" ? <Path d="M9.4 9.4l5.2 5.2M14.6 9.4l-5.2 5.2" stroke={stroke} strokeWidth={2.2} strokeLinecap="round" /> : null}
      </Svg>
    </Animated.View>
  );
}

/** `active` once it has lasted `delay` ms, then held at least `minDuration` ms: a wait never flashes nor blinks. */
export function useDelayedWait(active: boolean, delay = 250, minDuration = 600): boolean {
  const [shown, setShown] = React.useState(false);
  const since = React.useRef(0);
  React.useEffect(() => {
    if (active && !shown) {
      const timer = setTimeout(() => {
        since.current = Date.now();
        setShown(true);
      }, delay);
      return () => clearTimeout(timer);
    }
    if (!active && shown) {
      const timer = setTimeout(() => setShown(false), Math.max(0, minDuration - (Date.now() - since.current)));
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [active, shown, delay, minDuration]);
  return shown;
}

export type LoaderProps = {
  /** What is loading, in words (“Loading your jobs”) — passed translated; shown and announced. */
  label: string;
  /** loading (default) · success · error: the ending shows for `endDuration` ms, then the loader goes. */
  status?: "loading" | "success" | "error";
  /** The words of a success — passed translated. Default: the label. */
  successLabel?: string;
  /** The words of a failure — passed translated. */
  errorLabel?: string;
  /** Between 0 and 1: a determinate wait, the percentage shows. */
  value?: number | null;
  /** The time left, in words (“About 20 s left”). */
  eta?: string;
  /** Milliseconds before anything shows. Default 250. */
  delay?: number;
  /** Once shown, the least milliseconds it stays. Default 600. */
  minDuration?: number;
  /** Milliseconds the ending stays. Default 1600; `0` never shows it. */
  endDuration?: number;
  /** inline (default) · block (a region's centre) · overlay (over its parent, frosted) · page (the whole screen). */
  variant?: "inline" | "block" | "overlay" | "page";
  /**
   * The product whose animated mark waits in place of the Krizaka glyph (`orazaka`, `yomizaka`, `akinaza`,
   * `krizaka`). Still when the system reduces motion; the ending stays the check or the cross.
   */
  product?: BrandId;
  /** Styles merged last. */
  style?: StyleProp<ViewStyle>;
};

const GLYPH = { inline: 20, block: 36, overlay: 36, page: 56 } as const;

/** A wait from start to end — the web `Loader`: delayed, never blinking, announced when it shows and when it ends. */
export function Loader({ label, status = "loading", successLabel, errorLabel, value, eta, delay = 250, minDuration = 600, endDuration = 1600, variant = "inline", product, style }: LoaderProps) {
  const { theme, radius } = useTheme();
  const waiting = useDelayedWait(status === "loading", delay, minDuration);
  const [ending, setEnding] = React.useState<"success" | "error" | null>(null);
  const seen = React.useRef(false);
  React.useEffect(() => {
    if (waiting) {
      seen.current = true;
      return;
    }
    if (!seen.current || status === "loading") return;
    seen.current = false;
    if (endDuration <= 0) return;
    const show = setTimeout(() => setEnding(status), 0);
    const hide = Number.isFinite(endDuration) ? setTimeout(() => setEnding(null), endDuration) : undefined;
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, [waiting, status, endDuration]);
  const phase = waiting ? "loading" : ending;
  const words = phase === "success" ? (successLabel ?? label) : phase === "error" ? (errorLabel ?? label) : label;
  React.useEffect(() => {
    if (phase) AccessibilityInfo.announceForAccessibility(words);
  }, [phase, words]);
  if (!phase) return null;
  const known = phase === "loading" && typeof value === "number" && Number.isFinite(value);
  const detail = phase === "loading" ? [known ? `${Math.round(Math.min(1, Math.max(0, value)) * 100)} %` : null, eta].filter(Boolean).join(" · ") : "";
  const stacked = variant !== "inline";
  const box = (
    <View style={[stacked ? styles.stacked : styles.inline, variant === "overlay" ? { backgroundColor: alpha(theme.surface1, 0.92), borderColor: theme.borderDefault, borderRadius: radius.lg, ...styles.card } : null]}>
      {product && phase === "loading" ? <ProductMark id={product} size={GLYPH[variant]} animated /> : <LoaderGlyph state={phase} value={known ? value : null} size={GLYPH[variant]} />}
      <View style={stacked ? styles.center : styles.text}>
        <Txt variant={variant === "page" ? "title" : "label"} style={stacked ? styles.centered : null}>
          {words}
        </Txt>
        {detail ? (
          <Txt variant="caption" tone="secondary" style={stacked ? styles.centered : null}>
            {detail}
          </Txt>
        ) : null}
      </View>
    </View>
  );
  const a11y = { accessible: true, role: "progressbar" as const, "aria-label": words, "aria-busy": phase === "loading", accessibilityLiveRegion: "polite" as const };
  if (variant === "overlay" || variant === "page")
    return (
      <View {...a11y} style={[StyleSheet.absoluteFill, styles.cover, variant === "page" ? { backgroundColor: alpha(theme.surface0, 0.86) } : null, style]}>
        {box}
      </View>
    );
  return (
    <View {...a11y} style={[variant === "block" ? styles.block : null, style]}>
      {box}
    </View>
  );
}

const styles = StyleSheet.create({
  inline: { flexDirection: "row", alignItems: "center", gap: 10 },
  stacked: { alignItems: "center", gap: 10 },
  card: { paddingHorizontal: 24, paddingVertical: 20, borderWidth: StyleSheet.hairlineWidth },
  text: { flexShrink: 1, gap: 2 },
  center: { alignItems: "center", gap: 2 },
  centered: { textAlign: "center" },
  block: { paddingVertical: 40, alignItems: "center" },
  cover: { alignItems: "center", justifyContent: "center", zIndex: 10 },
});
