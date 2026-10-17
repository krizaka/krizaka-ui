import { marks } from "@krizaka/tokens/native";

/**
 * The Akinaza mark's geometry — drawn by the web mark (AkinazaLogo) and the native one (AkinazaMark). The family's
 * grammar (packages/tokens/BRAND.md, "Marks"): 400×400 view box, dashed orbit and ring, a bold solid emblem, a lit core;
 * below 48 px the view box crops to the emblem.
 *
 * The emblem is **the cut log** (2026-10-17): a log seen end-on, its year rings in light, cut at 45° by the beaver —
 * the cut is the Krizaka chamfer, its fresh face in copper — and a copper heart that breathes: a shop built ring by
 * ring, year after year. Forest and copper stay **apart** (blended they turn brown): they are the two stops of the
 * brand's mark gradient (`marks.akinaza` of @krizaka/tokens), each ≥ 3:1 on the page surfaces of both themes.
 *
 * Literal geometry (no clip, so web and native draw the same thing): the log is a circle r 96 centred (194, 206) — set
 * off the centre so the cut log sits optically centred — minus the segment beyond the 45° chord at 70 from its centre;
 * the copper face is the band between that chord and a parallel one at 58, bounded by the circle.
 */
const forest = marks.akinaza[0]![1];
/** The copper end: the cut, the heart, the halo and its breath. */
const copper = marks.akinaza[marks.akinaza.length - 1]![1];

export const AKINAZA = {
  viewBox: "0 0 400 400",
  croppedViewBox: "80 80 240 240",
  center: 200,
  forest,
  copper,
  log: "M197 110 L290 203 A96 96 0 1 1 197 110 Z",
  /** The fresh face of the cut: a copper band along the chord. */
  cut: "M197 110 L290 203 A96 96 0 0 1 289.1 219.1 L180.9 110.9 A96 96 0 0 1 197 110 Z",
  /** The year rings, in light, inside the band. */
  rings: { cx: 194, cy: 206, r: [52, 28], width: 7, opacity: 0.42 },
  heart: { cx: 194, cy: 206, r: 16, inner: 5.4 },
  highlight: "#fff7ed",
  gradient: { x1: 110, y1: 300, x2: 290, y2: 100, stops: marks.akinaza },
  /** A coin: one node on the orbit, that turns with it. */
  node: { r: 9, at: [200, 40] as const },
  glow: { color: copper, opacity: 0.16 },
  pulse: { color: copper, low: 0.3, high: 0.65 },
  motion: { spin: 32, breath: 3.8 },
  orbit: { r: 160, dash: "8 8", width: 1.5 },
  ring: { r: 134, width: 1 },
} as const;
