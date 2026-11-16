import { marks } from "@krizaka/tokens/native";

/**
 * The Kridoc mark's geometry — mark C, "the crane" (chosen by the founder on 2026-11-15, krizaka-internal#3839): a crane
 * in profile, its neck the family stroke (22) curving to a head with a lit eye, its beak open to the left, two wings
 * folded out to the right (the lower one shaded). The family's grammar (packages/tokens/BRAND.md, "Marks"): 400×400 view
 * box, dashed orbit and ring, one node on the orbit, a lit core; below 48 px the view box crops to the emblem.
 *
 * The colours are the kridoc brand's mark gradient (`marks.kridoc` of @krizaka/tokens, sapphire #2c6ae8 → #156fd5), the
 * same in both themes; the eye's light is #eef4ff. The old document glyph is gone.
 */
const sapphire = marks.kridoc[0]![1];

export const KRIDOC = {
  viewBox: "0 0 400 400",
  croppedViewBox: "80 80 240 240",
  center: 200,
  stroke: 22,
  /** The neck: up from the base, curving over to the head. */
  neck: "M178 298 L178 162 C178 136 162 122 140 126",
  /** The beak, open to the left. */
  beak: "M146 116 L140 140 L88 158 Z",
  /** The upper wing. */
  wingUp: "M186 192 L186 238 L294 104 Z",
  /** The lower wing; drawn a second time in black at low opacity, the shade. */
  wingDown: "M186 212 L186 252 L296 298 Z",
  /** The half-width of the filled shapes' outline (rounds their corners). */
  edge: 5.7,
  shade: 0.2,
  /** The eye: a lit core on the head. */
  core: { cx: 152, cy: 130, r: 12, inner: 4.4 },
  highlight: "#eef4ff",
  gradient: { x1: 110, y1: 300, x2: 290, y2: 100, stops: marks.kridoc },
  /** One node rides the orbit. */
  node: { r: 9, at: [200, 40] as const },
  glow: { color: sapphire, opacity: 0.16 },
  pulse: { color: sapphire, low: 0.3, high: 0.6 },
  motion: { spin: 32, breath: 3.6 },
  orbit: { r: 160, dash: "8 8", width: 1.5 },
  ring: { r: 134, width: 1 },
} as const;
