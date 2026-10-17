import React from "react";
import { View } from "react-native";
import Svg, { Circle, Defs, Path, RadialGradient, Stop } from "react-native-svg";

import { AKINAZA as G } from "../marks/akinaza-geometry";
import { markA11y, type NativeMarkProps, useMarkMotion } from "./mark-motion";
import { useSvgId, useTheme } from "./theme";

/**
 * The Akinaza mark for React Native — the geometry of the web mark (marks/akinaza-geometry.ts), "the cut log": a log
 * end-on, its rings in light, cut at 45° with a copper face, a copper heart. The orbit and the coin turn, the heart
 * breathes; still when the system reduces motion.
 */
export function AkinazaMark({ size = 48, animated = true, title, neutral }: NativeMarkProps) {
  const { theme } = useTheme();
  const { Animated, layer, spinStyle, pulseStyle } = useMarkMotion(size, animated, G.motion.spin * 1000);
  const id = useSvgId("akm");
  const viewBox = size < 48 ? G.croppedViewBox : G.viewBox;
  const stroke = neutral ?? theme.textMuted;
  return (
    <View style={{ width: size, height: size }} {...markA11y(title)}>
      <Svg viewBox={viewBox} style={layer}>
        <Defs>
          <RadialGradient id={`${id}g`} cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={G.glow.color} stopOpacity={G.glow.opacity} />
            <Stop offset="100%" stopColor={G.glow.color} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        {size >= 48 ? <Circle cx={G.center} cy={G.center} r={190} fill={`url(#${id}g)`} /> : null /* cropped: the halo would show its square */}
        <Circle cx={G.center} cy={G.center} r={G.ring.r} stroke={stroke} strokeWidth={G.ring.width} opacity={0.35} fill="none" />
        <Path d={G.log} fill={G.forest} />
        <Path d={G.cut} fill={G.copper} />
        {G.rings.r.map((r) => (
          <Circle key={r} cx={G.rings.cx} cy={G.rings.cy} r={r} stroke={G.highlight} strokeOpacity={G.rings.opacity} strokeWidth={G.rings.width} fill="none" />
        ))}
      </Svg>
      <Animated.View style={[layer, spinStyle]}>
        <Svg viewBox={viewBox} style={layer}>
          <Circle cx={G.center} cy={G.center} r={G.orbit.r} stroke={stroke} strokeWidth={G.orbit.width} strokeDasharray={G.orbit.dash} opacity={0.6} fill="none" />
          <Circle cx={G.node.at[0]} cy={G.node.at[1]} r={G.node.r} fill={G.copper} />
        </Svg>
      </Animated.View>
      <Animated.View style={[layer, pulseStyle]}>
        <Svg viewBox={viewBox} style={layer}>
          <Circle cx={G.heart.cx} cy={G.heart.cy} r={G.heart.r} fill={G.copper} />
          <Circle cx={G.heart.cx} cy={G.heart.cy} r={G.heart.inner} fill={G.highlight} />
        </Svg>
      </Animated.View>
    </View>
  );
}
