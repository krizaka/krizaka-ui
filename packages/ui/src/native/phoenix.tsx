import React, { useEffect, useState } from "react";
import { AccessibilityInfo, Animated, Easing, View, type ViewStyle } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Path, RadialGradient, Stop } from "react-native-svg";

import { PHOENIX, PHOENIX_PALETTES,type PhoenixPalette } from "../mascots/phoenix-geometry";
import { markA11y } from "./mark-motion";
import { useSvgId, useTheme } from "./theme";

export interface PhoenixProps {
  /** `own` (default): the violet wing and the gold wing of the Krizaka story. `brand`: the theme's accent and accent-2. */
  tone?: "own" | "brand";
  /** Width and height in points. */
  size?: number;
  /** A slow float; always still when the system asks to reduce motion. */
  animated?: boolean;
  /** An accessible name (the phoenix becomes an image); without it, it is decorative. */
  title?: string;
  /** The outer view's style. */
  style?: ViewStyle;
}

function useFloat(animated: boolean) {
  const [y] = useState(() => new Animated.Value(0));
  useEffect(() => {
    if (!animated) return;
    let loop: Animated.CompositeAnimation | undefined;
    let cancelled = false;
    void AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
      if (reduce || cancelled) return;
      const step = (toValue: number) => Animated.timing(y, { toValue, duration: 2500, easing: Easing.inOut(Easing.ease), useNativeDriver: true });
      loop = Animated.loop(Animated.sequence([step(-6), step(0)]));
      loop.start();
    });
    return () => {
      cancelled = true;
      loop?.stop();
    };
  }, [animated, y]);
  return y;
}

/** The phoenix of the Krizaka story — the comeback — for React Native: the web `Phoenix`'s geometry. */
export function Phoenix({ tone = "own", size = 120, animated = true, title, style }: PhoenixProps) {
  const { theme } = useTheme();
  const id = useSvgId("kzp");
  const y = useFloat(animated);
  const p: PhoenixPalette =
    tone === "brand"
      ? { left: [theme.accent2, theme.accent], right: [theme.accent, theme.accent2], core: ["#ffffff", theme.accent], body: theme.surface3, edge: theme.borderStrong, crest: theme.accent }
      : PHOENIX_PALETTES.own;
  return (
    <View style={[{ width: size, height: size }, style]} {...markA11y(title)}>
      <Animated.View style={{ transform: [{ translateY: y }] }}>
        <Svg width={size} height={size} viewBox="0 0 120 120">
          <Defs>
            <LinearGradient id={`${id}l`} x1="1" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={p.left[0]} />
              <Stop offset="100%" stopColor={p.left[1]} />
            </LinearGradient>
            <LinearGradient id={`${id}r`} x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor={p.right[0]} />
              <Stop offset="100%" stopColor={p.right[1]} />
            </LinearGradient>
            <RadialGradient id={`${id}c`}>
              <Stop offset="0%" stopColor={p.core[0]} />
              <Stop offset="100%" stopColor={p.core[1]} stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Path d={PHOENIX.wingL} fill={`url(#${id}l)`} />
          <Path d={PHOENIX.wingR} fill={`url(#${id}r)`} />
          <Path d={PHOENIX.tailL} fill={`url(#${id}l)`} opacity={0.7} />
          <Path d={PHOENIX.tailR} fill={`url(#${id}r)`} opacity={0.7} />
          <Path d={PHOENIX.body} fill={p.body} stroke={p.edge} strokeOpacity={0.5} />
          <Circle cx={60} cy={58} r={12} fill={`url(#${id}c)`} />
          <Circle cx={60} cy={58} r={3.5} fill="#ffffff" />
          <Path d={PHOENIX.crest} stroke={p.crest} strokeWidth={2} strokeLinecap="round" />
        </Svg>
      </Animated.View>
    </View>
  );
}
