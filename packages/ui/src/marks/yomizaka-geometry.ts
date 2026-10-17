import { marks } from "@krizaka/tokens/native";

/**
 * The Yomizaka mark's geometry — drawn by the web mark (YomizakaLogo) and the native one (YomizakaMark). The family's
 * grammar (packages/tokens/BRAND.md, "Marks"): 400×400 view box, dashed orbit and ring, a bold emblem at the family
 * stroke (22) in the brand gradient, a lit core; below 48 px the view box crops to the emblem.
 *
 * The emblem is **the watch** (2026-10-17): the owl — the bird that reads documents and knows faces — drawn as two
 * lenses under one calm brow, its pupils glancing down the line it reads. The brow is a soft double curve (never a
 * sharp V: the owl is attentive, not stern). The pupils are the lit cores: they breathe. The gradient is the brand's
 * mark gradient (`marks.yomizaka` of @krizaka/tokens): ink → indigo, ≥ 3:1 on the page surfaces of both themes.
 */
/** The indigo end of the gradient: the halo and the pupils' breath. */
const indigo = marks.yomizaka[marks.yomizaka.length - 1]![1];

export const YOMIZAKA = {
  viewBox: "0 0 400 400",
  croppedViewBox: "80 80 240 240",
  center: 200,
  stroke: 22,
  /** The brow: two soft arcs that meet over the beak — calm, never a sharp V. */
  brow: "M106 153 C130 125 176 129 200 159 C224 129 270 125 294 153",
  /** The two lenses (rings at the family stroke). */
  lenses: [
    { cx: 146, cy: 223, r: 40 },
    { cx: 254, cy: 223, r: 40 },
  ],
  /** The pupils, glancing down-right (reading): the lit cores. */
  pupils: [
    { cx: 154, cy: 229, r: 15, inner: 5.1 },
    { cx: 262, cy: 229, r: 15, inner: 5.1 },
  ],
  highlight: "#f4f5ff",
  gradient: { x1: 110, y1: 300, x2: 290, y2: 100, stops: marks.yomizaka },
  /** One node, a page, rides the orbit. */
  node: { r: 9, at: [200, 40] as const },
  glow: { color: indigo, opacity: 0.18 },
  pulse: { color: indigo, low: 0.3, high: 0.6 },
  motion: { spin: 32, breath: 3.6 },
  orbit: { r: 160, dash: "8 8", width: 1.5 },
  ring: { r: 134, width: 1 },
} as const;
