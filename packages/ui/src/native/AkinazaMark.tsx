import React from "react";
import { View } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Path, RadialGradient, Rect, Stop } from "react-native-svg";

import { AKINAZA as G } from "../marks/akinaza-geometry";
import { markA11y, type NativeMarkProps, useMarkMotion } from "./mark-motion";
import { useSvgId, useTheme } from "./theme";

/**
 * The Akinaza mark for React Native — the geometry of the web mark (marks/akinaza-geometry.ts), "the open shop": the
 * awning cut at its corner, its stripes, the shop front, two windows and the open door, a warm light. The orbit and its
 * one node, a coin, turn; the door's light breathes; still when the system reduces motion.
 */
export function AkinazaMark({ size = 48, animated = true, title, neutral }: NativeMarkProps) {
  const { theme } = useTheme();
  const { Animated, layer, spinStyle, pulseStyle } = useMarkMotion(size, animated, 32_000);
  const id = useSvgId("akm");
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
        <Path d={G.awning} fill={fill} />
        <Path d={G.stripes} stroke={G.stripe.color} strokeOpacity={G.stripe.opacity} strokeWidth={G.stripe.width} strokeLinecap="round" fill="none" />
        <Path d={G.front} fill={fill} />
        <Path d={G.windows} fill={G.stripe.color} fillOpacity={G.stripe.opacity} />
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
          <Defs>
            <LinearGradient id={`${id}c`} x1="50%" y1="100%" x2="50%" y2="0%">
              {G.coreGradient.stops.map(([offset, color]) => (
                <Stop key={offset} offset={offset} stopColor={color} />
              ))}
            </LinearGradient>
          </Defs>
          <Rect x={G.door.x} y={G.door.y} width={G.door.w} height={G.door.h} rx={G.door.rx} fill={`url(#${id}c)`} />
        </Svg>
      </Animated.View>
    </View>
  );
}
