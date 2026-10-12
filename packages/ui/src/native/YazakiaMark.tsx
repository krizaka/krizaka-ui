import React from "react";
import { View } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Path, RadialGradient, Stop } from "react-native-svg";

import { YAZAKIA as G } from "../marks/yazakia-geometry";
import { markA11y, type NativeMarkProps, useMarkMotion } from "./mark-motion";
import { useSvgId, useTheme } from "./theme";

/**
 * The Yazakia mark for React Native — the geometry of the web mark (marks/yazakia-geometry.ts): two voices, two
 * speech bubbles that overlap; the orbit and the pair turn slowly around them, the lens where they overlap breathes;
 * still when the system reduces motion.
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
        {G.voices.map((v, i) => (
          <React.Fragment key={v.body}>
            <Path d={v.body} fill={fill} />
            <Path d={v.tail} fill={fill} />
            {i === 0 ? <Path d={`${v.body} ${v.tail}`} fill={G.shade.color} opacity={G.shade.opacity} /> : null}
          </React.Fragment>
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
          <Defs>
            {gradient}
            <LinearGradient id={`${id}l`} gradientUnits="userSpaceOnUse" x1={0} y1={G.lens.y1} x2={0} y2={G.lens.y2}>
              <Stop offset="0%" stopColor={G.highlight.color} stopOpacity={G.highlight.from} />
              <Stop offset="100%" stopColor={G.highlight.color} stopOpacity={G.highlight.to} />
            </LinearGradient>
          </Defs>
          <Path d={G.lens.d} fill={fill} />
          <Path d={G.lens.d} fill={`url(#${id}l)`} />
        </Svg>
      </Animated.View>
    </View>
  );
}
