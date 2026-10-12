import React from "react";
import { View } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Path, RadialGradient, Stop } from "react-native-svg";

import { YAZAKIA as G } from "../marks/yazakia-geometry";
import { markA11y, type NativeMarkProps, useMarkMotion } from "./mark-motion";
import { useSvgId, useTheme } from "./theme";

/**
 * The Yazakia mark for React Native — the geometry of the web mark (marks/yazakia-geometry.ts): the orbit and the
 * pair turn slowly around the emblem, the core where the two arms meet breathes; still when the system reduces motion.
 */
export function YazakiaMark({ size = 48, animated = true, title, neutral }: NativeMarkProps) {
  const { theme } = useTheme();
  const { Animated, layer, spinStyle, pulseStyle } = useMarkMotion(size, animated);
  const id = useSvgId("yzm");
  const viewBox = size < 48 ? G.croppedViewBox : G.viewBox;
  const stroke = neutral ?? theme.textMuted;
  const gradient = (
    <LinearGradient id={`${id}a`} gradientUnits="userSpaceOnUse" x1={G.gradient.x1} y1={G.gradient.y1} x2={G.gradient.x2} y2={G.gradient.y2}>
      {G.gradient.stops.map(([offset, color]) => (
        <Stop key={offset} offset={offset} stopColor={color} />
      ))}
    </LinearGradient>
  );
  const fill = `url(#${id}a)`;
  return (
    <View style={{ width: size, height: size }} {...markA11y(title)}>
      <Svg viewBox={viewBox} style={layer}>
        <Defs>
          <RadialGradient id={`${id}g`} cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={G.glow.color} stopOpacity={G.glow.opacity} />
            <Stop offset="100%" stopColor={G.glow.color} stopOpacity={0} />
          </RadialGradient>
          {gradient}
        </Defs>
        {size >= 48 ? <Circle cx={G.center} cy={G.center} r={190} fill={`url(#${id}g)`} /> : null /* cropped: the halo would show its square */}
        <Circle cx={G.center} cy={G.center} r={G.ring.r} stroke={stroke} strokeWidth={G.ring.width} opacity={0.35} fill="none" />
        {G.arms.map((d) => (
          <Path key={d} d={d} stroke={fill} strokeWidth={G.stroke} strokeLinecap="round" fill="none" />
        ))}
        <Path d={G.stem} stroke={fill} strokeWidth={G.stroke} strokeLinecap="round" fill="none" />
        {G.heads.map((h) => (
          <Circle key={h.cx} cx={h.cx} cy={h.cy} r={h.r} fill={fill} />
        ))}
      </Svg>
      <Animated.View style={[layer, spinStyle]}>
        <Svg viewBox={viewBox} style={layer}>
          <Defs>{gradient}</Defs>
          <Circle cx={G.center} cy={G.center} r={G.orbit.r} stroke={stroke} strokeWidth={G.orbit.width} strokeDasharray={G.orbit.dash} opacity={0.6} fill="none" />
          {G.pair.at.map(([cx, cy]) => (
            <Circle key={cx} cx={cx} cy={cy} r={G.pair.r} fill={fill} />
          ))}
        </Svg>
      </Animated.View>
      <Animated.View style={[layer, pulseStyle]}>
        <Svg viewBox={viewBox} style={layer}>
          <Defs>{gradient}</Defs>
          <Circle cx={G.core.cx} cy={G.core.cy} r={G.core.r} fill={fill} />
          <Circle cx={G.core.cx} cy={G.core.cy} r={G.core.inner} fill={G.highlight} />
        </Svg>
      </Animated.View>
    </View>
  );
}
