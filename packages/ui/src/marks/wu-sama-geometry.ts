/**
 * The Wu-sama mark's geometry — the founder's byline mark. **Original mark, inspired by, not derived from**: it is the
 * Krizaka hexagon (a pointy-top regular hexagon in the 400×400 frame of the family), split at its top and bottom
 * vertices into two halves like the Krizaka shield that opens at one vertex, around a W of five straight legs whose
 * points are measured on that hexagon (`u`, its half-width, and `radius`) — see `wu-sama-geometry` tests. It is not
 * the Wu-Tang Clan's mark: no bat-wing silhouette, no curve, no black-and-yellow composition. The gold is one fixed
 * mid-tone amber (≥ 3:1 on the page surfaces of both themes), a hip-hop nod and not that clan's yellow.
 */
const round = (n: number) => Math.round(n * 10) / 10;
const center = 200;
const radius = 150;
/** Half the hexagon's width. */
const u = (radius * Math.sqrt(3)) / 2;
const gap = 10;

/** T, UR, LR, B, LL, UL. */
const hexagon = [
  [center, center - radius],
  [round(center + u), center - radius / 2],
  [round(center + u), center + radius / 2],
  [center, center + radius],
  [round(center - u), center + radius / 2],
  [round(center - u), center - radius / 2],
] as const;
const [T, UR, LR, B, LL, UL] = hexagon;

/** The point of the edge a→b whose x is `x`. */
const onEdge = (a: readonly [number, number], b: readonly [number, number], x: number) => [x, round(a[1] + ((x - a[0]) / (b[0] - a[0])) * (b[1] - a[1]))] as const;
const pt = ([x, y]: readonly [number, number]) => `${x},${y}`;

const left = [onEdge(T, UL, center - gap), UL, LL, onEdge(B, LL, center - gap)] as const;
const right = [onEdge(T, UR, center + gap), UR, LR, onEdge(B, LR, center + gap)] as const;

/** The W: tips and valleys at fixed fractions of the hexagon's half-width and radius; the middle summit on the axis. */
const wPoints = [
  [round(center - 0.63 * u), round(center - 0.4 * radius)],
  [round(center - 0.37 * u), round(center + 0.55 * radius)],
  [center, round(center - 0.03 * radius)],
  [round(center + 0.37 * u), round(center + 0.55 * radius)],
  [round(center + 0.63 * u), round(center - 0.4 * radius)],
] as const;
const peak = wPoints[2];

export const WU_SAMA = {
  viewBox: "0 0 400 400",
  croppedViewBox: "34 34 332 332",
  center,
  radius,
  gap,
  hexagon,
  /** The two halves of the hexagon (open at the top and bottom vertices), stroked in ink. */
  shell: { left: `M${left.map(pt).join(" L")}`, right: `M${right.map(pt).join(" L")}`, stroke: 22 },
  /** The W, stroked in gold. */
  w: `M${wPoints.map(pt).join(" L")}`,
  wStroke: 26,
  /** The node: the family's lit node, a small diamond at the W's middle summit, in ink. */
  node: `M${center},${round(peak[1] - 24)} L${center + 18},${peak[1]} L${center},${round(peak[1] + 24)} L${center - 18},${peak[1]}Z`,
  /** One mid-tone amber, hsl(40 94% 37%): 3.3:1 on white and 5.8:1 on the dark surface. */
  gold: "hsl(40 94% 37%)",
} as const;
