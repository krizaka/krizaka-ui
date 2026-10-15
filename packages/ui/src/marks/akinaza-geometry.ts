import { marks } from "@krizaka/tokens/native";

/**
 * The Akinaza mark's geometry — drawn by the web mark (AkinazaLogo) and the native one (AkinazaMark). The family's
 * grammar (packages/tokens/BRAND.md, "Marks"): 400×400 view box, dashed orbit and ring, a bold filled emblem in the
 * brand gradient, a bright core; below 48 px the view box crops to the emblem.
 *
 * The emblem is **the open shop** (商い, *akinai*: trade): a filled awning whose upper-right corner wears the Krizaka
 * cut, scalloped below, its stripes in light; under it the shop front and its open door — the bright core, a warm
 * light that breathes (the shop is open). The gradient is the brand's mark gradient (`marks.akinaza` of
 * @krizaka/tokens): forest at the foot → copper at the awning, mid-tones that read ≥ 3:1 on the page surfaces of both
 * themes (tested in @krizaka/tokens). One node, a coin, rides the dashed orbit.
 */
/** The copper end of the gradient: the halo. */
const copper = marks.akinaza[marks.akinaza.length - 1]![1];

export const AKINAZA = {
  viewBox: "0 0 400 400",
  croppedViewBox: "80 80 240 240",
  center: 200,
  /** The awning: 124 → 276 at y 108, cut 28 at its upper-right corner, four scallops below (y 150, 19 deep). */
  awning: "M124 108 H248 L276 136 V150 A19 19 0 0 1 238 150 A19 19 0 0 1 200 150 A19 19 0 0 1 162 150 A19 19 0 0 1 124 150 Z",
  /** The awning's stripes, in light. */
  stripes: "M162 116 V146 M200 116 V146 M238 116 V140",
  stripe: { color: "#fff7ed", opacity: 0.55, width: 8 },
  /** The shop front: walls 140 → 260 from y 178 to the ground, the door cut out (178 → 222, from y 222). */
  front: "M140 178 H260 V300 H222 V222 H178 V300 H140 Z",
  /** The open door: the bright core, a warm light. */
  door: { x: 182, y: 226, w: 36, h: 74, rx: 4 },
  coreGradient: { stops: [["0%", "#fde7c7"], ["100%", "#fffaf2"]] as const },
  /** A window each side, in light. */
  windows: "M154 196 H168 V212 H154 Z M232 196 H246 V212 H232 Z",
  gradient: { x1: 140, y1: 300, x2: 276, y2: 108, stops: marks.akinaza },
  /** A coin: one node on the orbit, that turns with it. */
  node: { r: 9, at: [200, 40] as const },
  glow: { color: copper, opacity: 0.16 },
  /** The door's breathing light (web), in the copper. */
  pulse: { color: copper, low: 0.3, high: 0.65 },
  orbit: { r: 160, dash: "8 8", width: 1.5 },
  ring: { r: 134, width: 1 },
} as const;
