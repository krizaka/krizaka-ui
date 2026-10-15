import React from "react";
import { View } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Path, RadialGradient, Stop } from "react-native-svg";

import { KACHIZAKA as G } from "../marks/kachizaka-geometry";
import { markA11y, type NativeMarkProps, useMarkMotion } from "./mark-motion";
import { useSvgId, useTheme } from "./theme";

/**
 * The Kachizaka mark for React Native — the geometry of the web mark (marks/kachizaka-geometry.ts), "the sealed cup":
 * a trophy cut at its rim, two handles, a stem and a base, the seal (a star in light) on the bowl. The orbit and its
 * one node, the ball, turn; the seal breathes; still when the system reduces motion.
 */
export function KachizakaMark({ size = 48, animated = true, title, neutral }: NativeMarkProps) {
  const { theme } = useTheme();
  const { Animated, layer, spinStyle, pulseStyle } = useMarkMotion(size, animated, 28_000);
  const id = useSvgId("kzm");
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
        <Path d={G.handles} stroke={fill} strokeWidth={G.handleWidth} strokeLinecap="round" fill="none" />
        <Path d={G.base} fill={fill} />
        <Path d={G.cup} fill={fill} />
      </Svg>
      <Animated.View style={[layer, spinStyle]}>
        <Svg viewBox={viewBox} style={layer}>
          <Defs>{gradient}</Defs>
          <Circle cx={G.center} cy={G.center} r={G.orbit.r} stroke={stroke} strokeWidth={G.orbit.width} strokeDasharray={G.orbit.dash} opacity={0.6} fill="none" />
          <Circle cx={G.node.at[0]} cy={G.node.at[1]} r={G.node.r} fill={fill} />
        </Svg>
      </Animated.View>
      <Animated.View style={[layer, pulseStyle]}>
        <Svg viewBox={viewBox} style={layer}>
          <Path d={G.star} fill={G.starColor} />
        </Svg>
      </Animated.View>
    </View>
  );
}
