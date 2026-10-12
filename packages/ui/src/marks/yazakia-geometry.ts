import { marks } from "@krizaka/tokens/native";

/**
 * The Yazakia mark's geometry — drawn by the web mark (YazakiaLogo) and the native one (YazakiaMark). The family's
 * grammar (packages/tokens/BRAND.md, "Marks"): 400×400 view box, dashed orbit and ring, a bold emblem in the brand
 * gradient, a bright core; below 48 px the view box crops to the emblem.
 *
 * The emblem is a "Y" drawn as two people who lean in and meet: two arms, each ending in a round head, join at a core
 * and run down into one stem — the mutual introduction the product makes. Two nodes, the pair, ride the dashed orbit
 * on either side. The gradient is the brand's mark gradient (`marks.yazakia` of @krizaka/tokens): emerald → turquoise,
 * mid-tones that read ≥ 3:1 on the page surfaces of both themes (tested in @krizaka/tokens), so one mark serves dark
 * and light.
 */
/** The bright end of the gradient (turquoise): the halo and the core's glow. */
const turquoise = marks.yazakia[marks.yazakia.length - 1]![1];

export const YAZAKIA = {
  viewBox: "0 0 400 400",
  croppedViewBox: "80 80 240 240",
  center: 200,
  /** The two arms, from each head to the core, mirrored around x = 200. */
  arms: ["M128 126 C130 178 168 206 200 214", "M272 126 C270 178 232 206 200 214"],
  /** The stem, from the core down. */
  stem: "M200 214 L200 280",
  /** The width of the arms and the stem: the weight of Orochia's body. */
  stroke: 36,
  /** The two heads, at the ends of the arms. */
  heads: [
    { cx: 128, cy: 124, r: 28 },
    { cx: 272, cy: 124, r: 28 },
  ],
  gradient: { x1: 110, y1: 300, x2: 290, y2: 100, stops: marks.yazakia },
  /** Where the arms meet: the core that breathes. */
  core: { cx: 200, cy: 214, r: 24, inner: 8.5 },
  highlight: "#f0fdfa",
  /** The pair: two nodes on the orbit, opposite each other, that turn with it. */
  pair: { r: 8, at: [[40, 200], [360, 200]] as const },
  glow: { color: turquoise, opacity: 0.16 },
  /** The core's breathing shadow (web), in the mark's turquoise. */
  pulse: { color: turquoise, low: 0.3, high: 0.6 },
  orbit: { r: 160, dash: "8 8", width: 1.5 },
  ring: { r: 134, width: 1 },
} as const;
