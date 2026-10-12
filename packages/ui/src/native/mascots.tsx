import React, { useEffect, useState } from "react";
import { AccessibilityInfo, Animated, Easing, View, type ViewStyle } from "react-native";
import Svg, { Circle, Defs, Ellipse, G, LinearGradient, Path, Rect, Stop } from "react-native-svg";

import { archEye, BIRDS, brow, lidEye, LIGHT, type MascotBird, type MascotMood, type MascotPalette, type MascotTone, MOOD_PARTS, OWN_PALETTES, PARCEL, SHADE, upperLid } from "../mascots/geometry";
import { markA11y } from "./mark-motion";
import { useSvgId, useTheme } from "./theme";

export interface MascotProps {
  /** Which bird of the flock: `falcon` (watch), `owl` (reading), `duck` (building), `flamingo` (answers), `pigeon` (delivery), `lovebird` (introductions). */
  bird?: MascotBird;
  /** What the moment is: `welcome`, `thinking`, `success`, `empty` or `error`. */
  mood?: MascotMood;
  /** `brand` (default): the theme's accent. `own`: the bird's signature colours of the Krizaka story. */
  tone?: MascotTone;
  /** Width and height in points. */
  size?: number;
  /** A light idle bob; always still when the system asks to reduce motion. */
  animated?: boolean;
  /** An accessible name (the bird becomes an image); without it the mascot is decorative. */
  title?: string;
  /** The outer view's style. */
  style?: ViewStyle;
}

/** The idle bob, on the native driver; nothing starts when `animated` is false or the system reduces motion. */
function useBob(animated: boolean) {
  const [y] = useState(() => new Animated.Value(0));
  useEffect(() => {
    if (!animated) return;
    let loop: Animated.CompositeAnimation | undefined;
    let cancelled = false;
    void AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
      if (reduce || cancelled) return;
      const step = (toValue: number) => Animated.timing(y, { toValue, duration: 1800, easing: Easing.inOut(Easing.ease), useNativeDriver: true });
      loop = Animated.loop(Animated.sequence([step(-2.5), step(0)]));
      loop.start();
    });
    return () => {
      cancelled = true;
      loop?.stop();
    };
  }, [animated, y]);
  return y;
}

/**
 * One of the six Krizaka birds in one mood, for React Native — the geometry of the web `Mascot`
 * (mascots/geometry.ts), in the theme's accent by default.
 */
export function Mascot({ bird = "owl", mood = "welcome", tone = "brand", size = 96, animated = true, title, style }: MascotProps) {
  const { theme } = useTheme();
  const id = useSvgId("kzb");
  const bob = useBob(animated);
  const g = BIRDS[bird];
  const brand: MascotPalette = { from: theme.accent2, to: theme.accent, wing: theme.accent, detail: theme.accent2, beak: theme.warning, eye: theme.textPrimary };
  const p = tone === "own" ? OWN_PALETTES[bird] : brand;
  const outline = theme.borderStrong;
  const body = `url(#${id})`;
  const line = { stroke: outline, strokeWidth: 1.4, strokeLinejoin: "round" as const };
  const eyeR = g.eyes.white || g.eyes.pupil * 1.2;
  const look = mood === "thinking" ? 1.4 : 0;
  const rot = (deg: number, [x, y]: readonly [number, number]) => `rotate(${deg} ${x} ${y})`;
  const [wl, wr] = g.wings;
  return (
    <View style={[{ width: size, height: size }, style]} {...markA11y(title)}>
      <Animated.View style={{ transform: [{ translateY: bob }] }}>
        <Svg width={size} height={size} viewBox="0 0 120 120">
          <Defs>
            <LinearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={p.from} />
              <Stop offset="100%" stopColor={p.to} />
            </LinearGradient>
          </Defs>
          <Ellipse cx={g.shadow[0]} cy={g.shadow[1]} rx={g.shadow[2]} ry={g.shadow[3]} fill={SHADE} opacity={0.14} />
          {mood === "empty" && <Path d={MOOD_PARTS.tray} stroke={outline} strokeWidth={1.6} strokeDasharray="3 3" fill="none" />}
          {g.legs.map((d) => (
            <Path key={d} d={d} stroke={p.beak} strokeWidth={2.6} strokeLinecap="round" fill="none" />
          ))}
          {g.back?.map((d) => (d.endsWith("Z") ? <Path key={d} d={d} fill={p.detail} {...line} /> : <Path key={d} d={d} stroke={outline} strokeWidth={1.4} fill="none" />))}
          {g.parcel?.map((d, i) => <Path key={d} d={d} fill={PARCEL[i]} {...line} />)}
          <Path d={g.body} fill={body} {...line} />
          <Path d={g.belly} fill={LIGHT} opacity={0.28} />
          {[wl, wr].map((w, i) => {
            const turn = mood === "success" ? (i === 0 ? 28 : -28) : mood === "welcome" && i === 1 ? -20 : 0;
            return (
              <G key={i} transform={turn ? rot(turn, w.pivot) : undefined}>
                <Path d={w.d} fill={p.wing} {...line} />
                <Path d={w.d} fill={SHADE} opacity={0.16} />
              </G>
            );
          })}
          {g.neck && <Path d={g.neck.d} stroke={body} strokeWidth={g.neck.width} strokeLinecap="round" fill="none" />}
          {g.head.r > 0 && <Circle cx={g.head.cx} cy={g.head.cy} r={g.head.r} fill={body} {...line} />}
          {g.details.map((d) => (
            <Path key={d} d={d} fill={p.detail} {...line} />
          ))}
          {g.visor && <Rect x={g.visor.x} y={g.visor.y} width={g.visor.w} height={g.visor.h} rx={4} fill={theme.surface0} {...line} />}
          {g.eyes.at.map((at, i) =>
            mood === "empty" && g.eyes.white > 0 ? (
              <G key={i}>
                <Circle cx={at[0]} cy={at[1]} r={g.eyes.white} fill={LIGHT} {...line} />
                <Circle cx={at[0]} cy={at[1] + g.eyes.pupil * 0.7} r={g.eyes.pupil} fill={SHADE} />
                <Path d={upperLid(at, g.eyes.white)} fill={p.detail} {...line} />
              </G>
            ) : mood === "success" || mood === "empty" ? (
              <Path key={i} d={mood === "success" ? archEye(at, eyeR * 0.85) : lidEye(at, eyeR * 0.8)} stroke={g.visor ? p.eye : outline} strokeWidth={2.2} strokeLinecap="round" fill="none" />
            ) : (
              <G key={i}>
                {g.eyes.white > 0 && <Circle cx={at[0]} cy={at[1]} r={g.eyes.white} fill={LIGHT} {...line} />}
                <Circle cx={at[0] + look} cy={at[1] - look} r={g.eyes.pupil} fill={g.visor ? p.eye : SHADE} />
              </G>
            ),
          )}
          {g.glasses && g.eyes.at.map(([x, y]) => <Circle key={x} cx={x} cy={y} r={6.5} fill="none" stroke={outline} strokeWidth={1.3} />)}
          {mood === "error" &&
            g.eyes.at.map((at, i) => <Path key={i} d={brow(at, eyeR, g.eyes.at.length === 1 ? 1 : i === 0 ? -1 : 1)} stroke={outline} strokeWidth={2} strokeLinecap="round" />)}
          <Path d={g.beak} fill={p.beak} {...line} />
          {mood === "thinking" && MOOD_PARTS.dots.map(([cx, cy, r], i) => <Circle key={cx} cx={cx} cy={cy} r={r} fill={theme.textSecondary} opacity={0.5 + i * 0.25} />)}
          {(mood === "success" || mood === "error") && (
            <Circle cx={MOOD_PARTS.badge.cx} cy={MOOD_PARTS.badge.cy} r={MOOD_PARTS.badge.r} fill={mood === "success" ? theme.success : theme.danger} />
          )}
          {mood === "success" && <Path d={MOOD_PARTS.check} stroke={theme.surface0} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" fill="none" />}
          {mood === "error" && <Path d={MOOD_PARTS.bang.line} stroke={theme.surface0} strokeWidth={2.8} strokeLinecap="round" />}
          {mood === "error" && <Circle cx={MOOD_PARTS.bang.dot[0]} cy={MOOD_PARTS.bang.dot[1]} r={1.6} fill={theme.surface0} />}
        </Svg>
      </Animated.View>
    </View>
  );
}
