import { useEffect, useState } from "react";
import { AccessibilityInfo, Animated, Easing } from "react-native";

export interface NativeMarkProps {
  /** Width and height in points. */
  size?: number;
  /** The orbit turns and the core breathes; always still when the system asks to reduce motion. */
  animated?: boolean;
  /** An accessible name (the mark becomes an image); without it the mark is decorative. */
  title?: string;
  /** The neutral strokes (orbit, ring). Default: the theme's muted text colour. */
  neutral?: string;
}

/** An image with a name, or hidden from assistive technology. */
export const markA11y = (title?: string) =>
  title
    ? { accessible: true, accessibilityRole: "image" as const, accessibilityLabel: title }
    : { accessibilityElementsHidden: true, importantForAccessibility: "no-hide-descendants" as const };

/**
 * The motion shared by the native marks, on the native driver: a slow turn (30 s) and a breath (3.2 s). Nothing
 * starts when `animated` is false or the system reduces motion.
 */
export function useMarkMotion(size: number, animated: boolean, spinMs = 30_000) {
  const [spin] = useState(() => new Animated.Value(0));
  const [pulse] = useState(() => new Animated.Value(0));
  useEffect(() => {
    if (!animated) return;
    let loops: Animated.CompositeAnimation[] = [];
    let cancelled = false;
    void AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
      if (reduce || cancelled) return;
      loops = [
        Animated.loop(Animated.timing(spin, { toValue: 1, duration: spinMs, easing: Easing.linear, useNativeDriver: true })),
        Animated.loop(
          Animated.sequence([
            Animated.timing(pulse, { toValue: 1, duration: 1600, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
            Animated.timing(pulse, { toValue: 0, duration: 1600, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          ]),
        ),
      ];
      loops.forEach((l) => l.start());
    });
    return () => {
      cancelled = true;
      loops.forEach((l) => l.stop());
    };
  }, [animated, spin, pulse, spinMs]);
  return {
    Animated,
    layer: { position: "absolute" as const, width: size, height: size },
    spinStyle: { transform: [{ rotate: spin.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] }) }] },
    pulseStyle: { opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) },
  };
}
