import * as React from "react";
import { AccessibilityInfo, Animated, Easing, type StyleProp, Text, type TextStyle } from "react-native";

import { useReducedMotion } from "./theme";
import { Txt, type TxtTone, type TxtVariant } from "./txt";

export type NumberTickerProps = {
  /** The value to show. */
  value: number;
  /** The locale of the digits and separators (`"fr"`: 1 204,5) — the app's locale. */
  locale?: string;
  /** How to write it (`{ style: "currency", currency: "EUR" }`): Intl.NumberFormat options. */
  format?: Intl.NumberFormatOptions;
  /** `mount` (default): climbs from zero once, when shown. `change`: rolls from the previous value on every change. */
  trigger?: "mount" | "change";
  /** Milliseconds of the roll. Default 1100. */
  duration?: number;
  /** Announce each new value (`trigger="change"`): a live total the person should hear. */
  announce?: boolean;
  /** The type scale. Default `display`. */
  variant?: TxtVariant;
  /** The text role. Default `text`. */
  tone?: TxtTone;
  /** Styles merged last. */
  style?: StyleProp<TextStyle>;
};

/**
 * A figure that climbs to its value — the web `NumberTicker`: tabular digits (no jitter), the final value for screen
 * readers from the first frame, still under reduced motion.
 */
export function NumberTicker({ value, locale, format, trigger = "mount", duration = 1100, announce, variant = "display", tone = "text", style }: NumberTickerProps) {
  const reduce = useReducedMotion();
  const writer = React.useMemo(() => new Intl.NumberFormat(locale, format), [locale, format]);
  const [shown, setShown] = React.useState(() => (reduce ? value : trigger === "mount" ? 0 : value));
  const [anim] = React.useState(() => new Animated.Value(trigger === "mount" ? 0 : value));
  const first = React.useRef(true);
  React.useEffect(() => {
    const isFirst = first.current;
    first.current = false;
    if (reduce || (!isFirst && trigger === "mount") || (isFirst && trigger === "change")) {
      anim.setValue(value);
      setShown(value);
      if (!isFirst && announce) AccessibilityInfo.announceForAccessibility(writer.format(value));
      return;
    }
    const id = anim.addListener(({ value: v }) => setShown(v));
    const run = Animated.timing(anim, { toValue: value, duration, easing: Easing.out(Easing.cubic), useNativeDriver: false });
    run.start(({ finished }) => {
      if (finished) setShown(value);
    });
    if (!isFirst && announce) AccessibilityInfo.announceForAccessibility(writer.format(value));
    return () => {
      run.stop();
      anim.removeListener(id);
    };
  }, [value, reduce, trigger, duration, announce, anim, writer]);
  const digits = Number.isInteger(value) ? Math.round(shown) : shown;
  return (
    <Txt variant={variant} tone={tone} aria-label={writer.format(value)} style={[{ fontVariant: ["tabular-nums"] }, style]}>
      <Text aria-hidden>{writer.format(digits)}</Text>
    </Txt>
  );
}
