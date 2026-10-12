import { marks } from "@krizaka/tokens/native";

/**
 * The Yororis mark's geometry — drawn by the web mark (YororisLogo) and the native one (YororisMark). The family's
 * grammar (packages/tokens/BRAND.md, "Marks"): 400×400 view box, dashed orbit and ring, a bold filled emblem in the
 * brand gradient, a bright core; below 48 px the view box crops to the emblem.
 *
 * The emblem is "the hold": a "Y" whose two arms are two filled leaves — open hands — that rise from one stem and cup
 * a warm core. The core is not where the arms join, it rests *inside* them: held, given room, listened to. A vein of
 * light runs along each leaf (depth, like the Orochia serpent's scales). One node, the moment, rides the dashed orbit:
 * it comes round, then it goes (a presence that stops). The leaves wear the brand's mark gradient (`marks.yororis` of
 * @krizaka/tokens): sand → sage, mid-tones that read ≥ 3:1 on the page surfaces of both themes (tested in
 * @krizaka/tokens), so one mark serves dark and light; the core is a warm sand light that rises from the mark's sand.
 */
const sand = marks.yororis[0]![1];
/** The calm end of the gradient (sage): the halo and the core's glow. */
const sage = marks.yororis[marks.yororis.length - 1]![1];

export const YORORIS = {
  viewBox: "0 0 400 400",
  croppedViewBox: "80 80 240 240",
  center: 200,
  /** The two leaves — open hands, mirrored around x = 200 — filled, rising from the stem. */
  leaves: [
    "M200 262 C142 256 104 206 110 122 C138 130 154 152 160 180 C168 218 182 238 204 246 Z",
    "M200 262 C258 256 296 206 290 122 C262 130 246 152 240 180 C232 218 218 238 196 246 Z",
  ],
  /** A vein of light along each leaf (dashed, it drifts slowly when animated). */
  veins: "M122 142 C128 196 156 232 192 248 M278 142 C272 196 244 232 208 248",
  vein: { color: "#fbf6ea", opacity: 0.45, width: 3, dash: "2 14" },
  /** The stem, from the junction down. */
  stem: "M200 244 L200 312",
  stroke: 30,
  gradient: { x1: 110, y1: 300, x2: 290, y2: 100, stops: marks.yororis },
  /** The core's warm light: from the mark's sand (below) to a light sand (above). */
  coreGradient: { stops: [["0%", sand], ["100%", "#e6c993"]] as const },
  /** The core, held in the hollow of the leaves (not on the junction): the one who is listened to. It breathes. */
  core: { cx: 200, cy: 184, r: 32, inner: 11 },
  highlight: "#fbf6ea",
  /** The moment: one node on the orbit, that turns with it. */
  moment: { r: 9, at: [200, 40] as const },
  glow: { color: sage, opacity: 0.18 },
  /** The core's breathing shadow (web), in the core's warm sand. */
  pulse: { color: sand, low: 0.3, high: 0.6 },
  orbit: { r: 160, dash: "8 8", width: 1.5 },
  ring: { r: 134, width: 1 },
} as const;
