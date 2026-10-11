// The Krizaka material on React Native (BRAND.md §6), drawn with react-native-svg: React Native has no CSS gradient
// and no inset shadow. Light comes from above — a raised surface catches it on its top (the sheen) and along a 1-pt
// edge; a fill is shaded a little at the bottom. Decorative, behind the content, never under the pointer.
import * as React from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";

import { useSvgId } from "./theme";

export type MaterialProps = {
  /** The colour at the top of the surface, fading to transparent (`theme.surfaceSheen`), or `null` for none. */
  sheen?: string | null;
  /** The colour at the bottom of a fill, from transparent (`theme.fillShade`), or `null` for none. */
  shade?: string | null;
  /** The 1-pt edge of light along the top (`theme.edgeLight`, `theme.edgeOnFill`), or `null` for none. */
  edge?: string | null;
  /** The surface's corner radius: the edge stops short of the corners. */
  radius?: number;
};

/** Layers the sheen, the shade and the edge over a surface (absolutely positioned, first child of the surface). */
export function Material({ sheen, shade, edge, radius = 0 }: MaterialProps) {
  const id = useSvgId("kz-material");
  if (!sheen && !shade && !edge) return null;
  return (
    <View aria-hidden pointerEvents="none" style={StyleSheet.absoluteFill}>
      {sheen || shade ? (
        <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
          <Defs>
            {sheen ? (
              <LinearGradient id={`${id}-sheen`} x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={sheen} />
                <Stop offset="0.7" stopColor={sheen} stopOpacity={0} />
              </LinearGradient>
            ) : null}
            {shade ? (
              <LinearGradient id={`${id}-shade`} x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0.35" stopColor={shade} stopOpacity={0} />
                <Stop offset="1" stopColor={shade} />
              </LinearGradient>
            ) : null}
          </Defs>
          {sheen ? <Rect width="100%" height="100%" fill={`url(#${id}-sheen)`} /> : null}
          {shade ? <Rect width="100%" height="100%" fill={`url(#${id}-shade)`} /> : null}
        </Svg>
      ) : null}
      {edge ? <View style={[styles.edge, { left: radius / 2, right: radius / 2, backgroundColor: edge }]} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  edge: { position: "absolute", top: 0, height: StyleSheet.hairlineWidth > 0.5 ? StyleSheet.hairlineWidth : 1 },
});
