import React from "react";
import { View } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Path, RadialGradient, Stop } from "react-native-svg";

import { YOMIZAKA as G } from "../marks/yomizaka-geometry";
import { markA11y, type NativeMarkProps, useMarkMotion } from "./mark-motion";
import { useSvgId, useTheme } from "./theme";

/**
 * The Yomizaka mark for React Native — the geometry of the web mark (marks/yomizaka-geometry.ts), "the watch": the owl's
 * two lenses under one calm brow. The orbit and its node turn, the pupils breathe; still when the system reduces motion.
 */
export function YomizakaMark({ size = 48, animated = true, title, neutral }: NativeMarkProps) {
  const { theme } = useTheme();
  const { Animated, layer, spinStyle, pulseStyle } = useMarkMotion(size, animated, G.motion.spin * 1000);
  const id = useSvgId("ymm");
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
        <Path d={G.brow} stroke={fill} strokeWidth={G.stroke} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {G.lenses.map((l) => (
          <Circle key={l.cx} cx={l.cx} cy={l.cy} r={l.r} stroke={fill} strokeWidth={G.stroke} fill="none" />
        ))}
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
          <Defs>{gradient}</Defs>
          {G.pupils.map((p) => (
            <React.Fragment key={p.cx}>
              <Circle cx={p.cx} cy={p.cy} r={p.r} fill={fill} />
              <Circle cx={p.cx} cy={p.cy} r={p.inner} fill={G.highlight} />
            </React.Fragment>
          ))}
        </Svg>
      </Animated.View>
    </View>
  );
}
