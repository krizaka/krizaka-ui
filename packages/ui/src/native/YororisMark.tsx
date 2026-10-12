import React from "react";
import { View } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Path, RadialGradient, Stop } from "react-native-svg";

import { YORORIS as G } from "../marks/yororis-geometry";
import { markA11y, type NativeMarkProps, useMarkMotion } from "./mark-motion";
import { useSvgId, useTheme } from "./theme";

/**
 * The Yororis mark for React Native — the geometry of the web mark (marks/yororis-geometry.ts), "the hold": two filled
 * leaves cupping a warm core. The orbit and its one node, the moment, turn slowly; the core breathes; still when the
 * system reduces motion.
 */
export function YororisMark({ size = 48, animated = true, title, neutral }: NativeMarkProps) {
  const { theme } = useTheme();
  const { Animated, layer, spinStyle, pulseStyle } = useMarkMotion(size, animated, 36_000);
  const id = useSvgId("yrm");
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
        <Path d={G.stem} stroke={fill} strokeWidth={G.stroke} strokeLinecap="round" fill="none" />
        {G.leaves.map((d) => (
          <Path key={d} d={d} fill={fill} />
        ))}
        <Path d={G.veins} stroke={G.vein.color} strokeOpacity={G.vein.opacity} strokeWidth={G.vein.width} strokeLinecap="round" strokeDasharray={G.vein.dash} fill="none" />
      </Svg>
      <Animated.View style={[layer, spinStyle]}>
        <Svg viewBox={viewBox} style={layer}>
          <Defs>{gradient}</Defs>
          <Circle cx={G.center} cy={G.center} r={G.orbit.r} stroke={stroke} strokeWidth={G.orbit.width} strokeDasharray={G.orbit.dash} opacity={0.6} fill="none" />
          <Circle cx={G.moment.at[0]} cy={G.moment.at[1]} r={G.moment.r} fill={fill} />
        </Svg>
      </Animated.View>
      <Animated.View style={[layer, pulseStyle]}>
        <Svg viewBox={viewBox} style={layer}>
          <Defs>
            <LinearGradient id={`${id}c`} x1="50%" y1="100%" x2="50%" y2="0%">
              {G.coreGradient.stops.map(([offset, color]) => (
                <Stop key={offset} offset={offset} stopColor={color} />
              ))}
            </LinearGradient>
          </Defs>
          <Circle cx={G.core.cx} cy={G.core.cy} r={G.core.r} fill={`url(#${id}c)`} />
          <Circle cx={G.core.cx} cy={G.core.cy} r={G.core.inner} fill={G.highlight} />
        </Svg>
      </Animated.View>
    </View>
  );
}
