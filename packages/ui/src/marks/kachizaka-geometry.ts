import { marks } from "@krizaka/tokens/native";

/**
 * The Kachizaka mark's geometry — drawn by the web mark (KachizakaLogo) and the native one (KachizakaMark). The family's
 * grammar (packages/tokens/BRAND.md, "Marks"): 400×400 view box, dashed orbit and ring, a bold filled emblem in the
 * brand gradient, a bright core; below 48 px the view box crops to the emblem.
 *
 * The emblem is **the sealed cup**: a filled trophy whose rim wears the Krizaka cut at its upper-right corner, two
 * handles, a stem and a base; on the bowl a star in light — the seal, the rules locked at kick-off — breathes. The
 * gradient is the brand's mark gradient (`marks.kachizaka` of @krizaka/tokens): cobalt at the base → gold at the rim,
 * mid-tones that read ≥ 3:1 on the page surfaces of both themes (tested in @krizaka/tokens), so one mark serves dark
 * and light. One node, the ball, rides the dashed orbit.
 */
/** The gold end of the gradient: the halo and the seal's breath. */
const gold = marks.kachizaka[marks.kachizaka.length - 1]![1];

export const KACHIZAKA = {
  viewBox: "0 0 400 400",
  croppedViewBox: "80 80 240 240",
  center: 200,
  /** The bowl: a rim 136 → 264 at y 104, cut 32 at its upper-right corner (the Krizaka chamfer), rounding down to the stem. */
  cup: "M136 104 H232 L264 136 V164 C264 214 236 242 200 246 C164 242 136 214 136 164 Z",
  /** The stem and the base, one shape. */
  base: "M190 244 H210 V272 H240 C244 272 248 276 248 280 V300 H152 V280 C152 276 156 272 160 272 H190 Z",
  /** The two handles, stroked in the gradient. */
  handles: "M138 128 C100 124 100 196 150 202 M262 128 C300 124 300 196 250 202",
  handleWidth: 14,
  /** The seal: a five-pointed star in light on the bowl, centred (200, 172), radii 30 / 13. */
  star: "M200 142 L207.6 161.5 L228.5 162.7 L212.4 176 L217.6 196.3 L200 185 L182.4 196.3 L187.6 176 L171.5 162.7 L192.4 161.5 Z",
  starColor: "#fffbea",
  gradient: { x1: 136, y1: 300, x2: 264, y2: 104, stops: marks.kachizaka },
  /** The ball: one node on the orbit, that turns with it. */
  node: { r: 9, at: [200, 40] as const },
  glow: { color: gold, opacity: 0.18 },
  /** The seal's breathing shadow (web), in the gold. */
  pulse: { color: gold, low: 0.35, high: 0.75 },
  orbit: { r: 160, dash: "8 8", width: 1.5 },
  ring: { r: 134, width: 1 },
} as const;
