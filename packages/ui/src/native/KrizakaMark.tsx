import React from "react";
import { View } from "react-native";
import Svg, { Circle, Defs, G as Group, LinearGradient, Path, RadialGradient, Stop } from "react-native-svg";

import { KRIZAKA as G } from "../marks/krizaka-geometry";
import { markA11y, type NativeMarkProps, useMarkMotion } from "./mark-motion";
import { useSvgId, useTheme } from "./theme";

/**
 * The Krizaka mark for React Native — the geometry of the web mark (marks/krizaka-geometry.ts), drawn with
 * react-native-svg: the ink shield follows the theme's text roles, the node and the core are Krizaka blue. The orbit
 * turns and the core breathes on the native driver; still when the system reduces motion.
 */
export function KrizakaMark({ size = 48, animated = true, title, neutral }: NativeMarkProps) {
  const { theme } = useTheme();
  const { Animated, layer, spinStyle, pulseStyle } = useMarkMotion(size, animated);
  const id = useSvgId("kzm");
  const viewBox = size < 48 ? G.croppedViewBox : G.viewBox;
  const stroke = neutral ?? theme.textMuted;
  const blue = (
    <LinearGradient id={`${id}b`} gradientUnits="userSpaceOnUse" x1={G.blue.x1 + G.offset} y1={G.blue.y1 + G.offset} x2={G.blue.x2 + G.offset} y2={G.blue.y2 + G.offset}>
      {G.blue.stops.map(([offset, color]) => (
        <Stop key={offset} offset={offset} stopColor={color} />
      ))}
    </LinearGradient>
  );
  const dot = (c: { cx: number; cy: number; r: number; inner: number }) => (
    <>
      <Circle cx={c.cx} cy={c.cy} r={c.r} fill={`url(#${id}b)`} />
      <Circle cx={c.cx} cy={c.cy} r={c.inner} fill={G.highlight} />
    </>
  );
  return (
    <View style={{ width: size, height: size }} {...markA11y(title)}>
      <Svg viewBox={viewBox} style={layer}>
        <Defs>
          <RadialGradient id={`${id}g`} cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={G.glow.color} stopOpacity={G.glow.opacity} />
            <Stop offset="100%" stopColor={G.glow.color} stopOpacity={0} />
          </RadialGradient>
          <LinearGradient id={`${id}i`} gradientUnits="userSpaceOnUse" x1={G.ink.x1 + G.offset} y1={G.ink.y1 + G.offset} x2={G.ink.x2 + G.offset} y2={G.ink.y2 + G.offset}>
            <Stop offset="0%" stopColor={theme.textSecondary} />
            <Stop offset="100%" stopColor={theme.textPrimary} />
          </LinearGradient>
          {blue}
        </Defs>
        {size >= 48 ? <Circle cx={200} cy={200} r={190} fill={`url(#${id}g)`} /> : null /* cropped: the halo would show its square */}
        <Circle cx={200} cy={200} r={G.ring.r} stroke={stroke} strokeWidth={G.ring.width} opacity={0.35} fill="none" />
        <Group transform={`translate(${G.offset} ${G.offset})`}>
          <Path d={G.shield} stroke={`url(#${id}i)`} strokeWidth={G.stroke} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </Group>
      </Svg>
      <Animated.View style={[layer, spinStyle]}>
        <Svg viewBox={viewBox} style={layer}>
          <Circle cx={200} cy={200} r={G.orbit.r} stroke={stroke} strokeWidth={G.orbit.width} strokeDasharray={G.orbit.dash} opacity={0.6} fill="none" />
        </Svg>
      </Animated.View>
      <Animated.View style={[layer, pulseStyle]}>
        <Svg viewBox={viewBox} style={layer}>
          <Defs>{blue}</Defs>
          <Group transform={`translate(${G.offset} ${G.offset})`}>
            {dot(G.node)}
            {dot(G.core)}
          </Group>
        </Svg>
      </Animated.View>
    </View>
  );
}
