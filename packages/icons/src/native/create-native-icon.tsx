import Svg, { Circle, Path } from "react-native-svg";

import { type Glyph, NODE_RADIUS, STROKE_WIDTH } from "../glyph";

export interface NativeIconProps {
  /** Width and height, in points. Default 24. */
  size?: number;
  /** The stroke colour (and the node's, unless `nodeColor`). Pass a theme role: `theme.textPrimary`. */
  color?: string;
  /** The stroke, in grid units (the grid is 24). Default 1.75. */
  strokeWidth?: number;
  /** An accessible name: the icon becomes an image. Without it the icon is hidden from assistive technology. */
  title?: string;
  /** The colour of the node (the signature dot): e.g. `theme.accent`. Default: `color`. */
  nodeColor?: string;
}

/** Builds a React Native icon (react-native-svg) from a glyph — the same drawing as the web icon. */
export function createNativeIcon(displayName: string, glyph: Glyph) {
  function KrizakaNativeIcon({ size = 24, color = "#000", strokeWidth = STROKE_WIDTH, title, nodeColor }: NativeIconProps) {
    const a11y = title
      ? { accessible: true, accessibilityRole: "image" as const, accessibilityLabel: title }
      : { accessibilityElementsHidden: true, importantForAccessibility: "no-hide-descendants" as const };
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...a11y}>
        {glyph.p?.map((d) => (
          <Path key={d} d={d} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        ))}
        {glyph.c?.map(([cx, cy, r]) => (
          <Circle key={`${cx},${cy},${r}`} cx={cx} cy={cy} r={r} stroke={color} strokeWidth={strokeWidth} fill="none" />
        ))}
        {glyph.n?.map(([cx, cy]) => (
          <Circle key={`n${cx},${cy}`} cx={cx} cy={cy} r={NODE_RADIUS} fill={nodeColor ?? color} />
        ))}
      </Svg>
    );
  }
  KrizakaNativeIcon.displayName = displayName;
  return KrizakaNativeIcon;
}
