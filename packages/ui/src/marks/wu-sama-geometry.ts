import { marks } from "@krizaka/tokens/native";

/**
 * The Wu-sama mark's geometry — the founder's byline mark.
 * It shares the Krizaka shield contour (pointy-top hexagonal shield with open vertex and lit node)
 * and brand colors, holding a W of five straight legs in Krizaka blue at its center.
 */
export const WU_SAMA = {
  viewBox: "0 0 400 400",
  croppedViewBox: "86 82 228 228",
  offset: 20,
  /** The shield: the Krizaka pointy-top hexagon (r 92 around 180,180), open at its upper-right edge. */
  shield: "M259.7,134 L259.7,226 L180,272 L100.3,226 L100.3,134 L180,88 L212,106.5",
  stroke: 22,
  ink: { x1: 70, y1: 290, x2: 290, y2: 70 },
  blue: { x1: 180, y1: 180, x2: 300, y2: 60, stops: marks.krizaka },
  /** The vertex where the shield opens: a lit node in Krizaka blue. */
  node: { cx: 259.7, cy: 134, r: 19, inner: 6 },
  /** The W: five straight legs in Krizaka blue. */
  w: "M132,142 L154,216 L180,166 L206,216 L228,142",
  wStroke: 18,
  highlight: "#dbeafe",
  glow: { color: "#196df5", opacity: 0.16 },
  orbit: { r: 160, dash: "8 8", width: 1.5 },
  ring: { r: 134, width: 1 },
} as const;
