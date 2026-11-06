import type { ReactNode } from "react";
import { View } from "react-native";
import Svg, { Circle, Defs, LinearGradient, RadialGradient, Stop } from "react-native-svg";

import type { FrameGeometry } from "../marks/frame";
import { markA11y, type NativeMarkProps, useMarkMotion } from "./mark-motion";
import { useSvgId, useTheme } from "./theme";

/** A brand gradient across the view box, as the geometry states it. */
interface NativeGradient {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  stops: readonly (readonly [string, string])[];
}

/** What a mark draws on each layer: `fill` is its gradient (`url(#…)`), `stroke` the neutral of the orbit and the ring. */
export interface MarkLayers {
  /** The still layer, over the halo. */
  still: ReactNode;
  /** The layer that turns (the orbit and its node, or the emblem). */
  spin: ReactNode;
  /** The layer that breathes (the lit core). */
  pulse: ReactNode;
}

type FrameProps = NativeMarkProps & {
  geometry: FrameGeometry;
  /** The prefix of the instance's SVG ids. */
  prefix: string;
  /** One turn of the spinning layer, in ms (the family's 30 s by default). */
  spinMs?: number;
  gradient?: NativeGradient;
  /** The gradient is declared on the still layer too (it draws with it there). */
  gradientOnStill?: boolean;
  draw: (paint: { fill: string; stroke: string }) => MarkLayers;
};

/**
 * The frame of a product mark for React Native, one for the family: three stacked layers (still, spinning, breathing)
 * on the native driver, the halo (left out when cropped below 48 pt: it would show its square) and the brand gradient
 * declared where it is used. The mark gives its geometry and what each layer draws.
 */
export function NativeMarkFrame({ size = 48, animated = true, title, neutral, geometry: g, prefix, spinMs, gradient, gradientOnStill, draw }: Readonly<FrameProps>) {
  const { theme } = useTheme();
  const { Animated, layer, spinStyle, pulseStyle } = useMarkMotion(size, animated, spinMs);
  const id = useSvgId(prefix);
  const viewBox = size < 48 ? g.croppedViewBox : g.viewBox;
  const defs = gradient ? (
    <LinearGradient id={`${id}a`} gradientUnits="userSpaceOnUse" x1={gradient.x1} y1={gradient.y1} x2={gradient.x2} y2={gradient.y2}>
      {gradient.stops.map(([offset, color]) => (
        <Stop key={offset} offset={offset} stopColor={color} />
      ))}
    </LinearGradient>
  ) : null;
  const layers = draw({ fill: `url(#${id}a)`, stroke: neutral ?? theme.textMuted });
  return (
    <View style={{ width: size, height: size }} {...markA11y(title)}>
      <Svg viewBox={viewBox} style={layer}>
        <Defs>
          <RadialGradient id={`${id}g`} cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={g.glow.color} stopOpacity={g.glow.opacity} />
            <Stop offset="100%" stopColor={g.glow.color} stopOpacity={0} />
          </RadialGradient>
          {gradientOnStill ? defs : null}
        </Defs>
        {size >= 48 ? <Circle cx={g.center} cy={g.center} r={190} fill={`url(#${id}g)`} /> : null}
        {layers.still}
      </Svg>
      <Animated.View style={[layer, spinStyle]}>
        <Svg viewBox={viewBox} style={layer}>
          {defs ? <Defs>{defs}</Defs> : null}
          {layers.spin}
        </Svg>
      </Animated.View>
      <Animated.View style={[layer, pulseStyle]}>
        <Svg viewBox={viewBox} style={layer}>
          {defs ? <Defs>{defs}</Defs> : null}
          {layers.pulse}
        </Svg>
      </Animated.View>
    </View>
  );
}

/** The dashed orbit of the family. */
export function NativeOrbit({ geometry: g, stroke }: Readonly<{ geometry: FrameGeometry; stroke: string }>) {
  return <Circle cx={g.center} cy={g.center} r={g.orbit.r} stroke={stroke} strokeWidth={g.orbit.width} strokeDasharray={g.orbit.dash} opacity={0.6} fill="none" />;
}

/** The quiet ring of the family. */
export function NativeRing({ geometry: g, stroke }: Readonly<{ geometry: FrameGeometry; stroke: string }>) {
  return <Circle cx={g.center} cy={g.center} r={g.ring.r} stroke={stroke} strokeWidth={g.ring.width} opacity={0.35} fill="none" />;
}
