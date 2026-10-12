/**
 * The Krizaka flock — the geometry of the mascots, drawn by the web `Mascot` (`./mascot.tsx`) and the native one
 * (`../native/mascots.tsx`). Five birds that have carried the Krizaka story since the first site (the sentry falcon,
 * the owl that reads, the developer duck, the flamingo that answers, the carrier pigeon), the lovebird that
 * introduces (2026-10, with Yazakia: "l'inséparable présente") and the crane that listens (2026-10, with Yororis:
 * "la grue écoute"), redrawn on one 120 × 120 grid so that any bird can wear any mood.
 *
 * Colours are roles, never fixed: `brand` (the default) paints a bird in the host's accent (`--kz-accent`,
 * `--kz-accent-2`), so the same falcon is blue on krizaka.com, orange in Orazaka and violet in Orochia; `own` gives
 * each bird the signature palette it has in the Krizaka story (the brand layer's exception, like the marks). Shades
 * and highlights are black and white at a low opacity over the role, so they hold in both themes.
 */

export const MASCOT_BIRDS = ["falcon", "owl", "duck", "flamingo", "pigeon", "lovebird", "crane"] as const;
export type MascotBird = (typeof MASCOT_BIRDS)[number];

export const MASCOT_MOODS = ["welcome", "thinking", "success", "empty", "error"] as const;
export type MascotMood = (typeof MASCOT_MOODS)[number];

export type MascotTone = "brand" | "own";

type Point = readonly [number, number];

export interface BirdGeometry {
  /** The ground shadow: centre x, y and radii. */
  readonly shadow: readonly [number, number, number, number];
  /** Legs and feet, stroked in the beak colour. */
  readonly legs: readonly string[];
  /** Drawn behind the body (tail, parcel strings). */
  readonly back?: readonly string[];
  readonly body: string;
  readonly belly: string;
  /** Left then right wing, and the point each one turns around. */
  readonly wings: readonly [{ readonly d: string; readonly pivot: Point }, { readonly d: string; readonly pivot: Point }];
  /** A neck, stroked in the body colour with this width (the flamingo). */
  readonly neck?: { readonly d: string; readonly width: number };
  /** The head: a circle. */
  readonly head: { readonly cx: number; readonly cy: number; readonly r: number };
  /** Ear tufts, a crest, a visor's frame: filled with the detail colour. */
  readonly details: readonly string[];
  /** A band behind the eyes (the falcon's visor), in the page's surface. */
  readonly visor?: { readonly x: number; readonly y: number; readonly w: number; readonly h: number };
  /** Glasses (the duck): stroked rings around the eyes. */
  readonly glasses?: boolean;
  readonly beak: string;
  /** The eyes: centres, the radius of the white, the radius of the pupil (no white when `white` is 0). */
  readonly eyes: { readonly at: readonly Point[]; readonly white: number; readonly pupil: number };
  /** The parcel the pigeon carries: its three faces. */
  readonly parcel?: readonly [string, string, string];
}

const mirror = (d: string) => d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (_, x: string, y: string) => `${120 - Number(x)} ${y}`);

const falconWing = "M29 58 C17 68 19 88 37 86 C31 76 31 66 29 58 Z";
const pigeonWing = "M36 58 C20 50 16 80 38 84 C34 74 34 66 36 58 Z";

export const BIRDS: Readonly<Record<MascotBird, BirdGeometry>> = {
  falcon: {
    shadow: [60, 110, 26, 3.5],
    legs: ["M51 94 L48 108 M44 108 L52 108", "M69 94 L72 108 M68 108 L76 108"],
    body: "M30 62 C30 42 90 42 90 62 C90 88 78 98 60 98 C42 98 30 88 30 62 Z",
    belly: "M41 66 C41 55 79 55 79 66 C79 82 71 90 60 90 C49 90 41 82 41 66 Z",
    wings: [
      { d: falconWing, pivot: [29, 58] },
      { d: mirror(falconWing), pivot: [91, 58] },
    ],
    head: { cx: 60, cy: 38, r: 22 },
    details: ["M46 20 L52 10 L56 19 Z", "M74 20 L68 10 L64 19 Z"],
    visor: { x: 41, y: 29, w: 38, h: 13 },
    beak: "M54 45 L66 45 L60 57 Z",
    eyes: { at: [[50, 35.5], [70, 35.5]], white: 0, pupil: 3.2 },
  },
  owl: {
    shadow: [60, 110, 24, 3.5],
    legs: ["M53 100 L51 107 M47 107 L55 107", "M67 100 L69 107 M65 107 L73 107"],
    body: "M28 52 C28 20 92 20 92 52 C92 86 82 102 60 102 C38 102 28 86 28 52 Z",
    belly: "M42 66 C42 52 78 52 78 66 C78 86 72 94 60 94 C48 94 42 86 42 66 Z",
    wings: [
      { d: "M29 58 C18 68 20 88 36 90 C32 78 32 68 29 58 Z", pivot: [29, 58] },
      { d: mirror("M29 58 C18 68 20 88 36 90 C32 78 32 68 29 58 Z"), pivot: [91, 58] },
    ],
    head: { cx: 60, cy: 42, r: 0 },
    details: ["M31 20 L47 31 L31 41 Z", "M89 20 L73 31 L89 41 Z"],
    beak: "M55 50 L65 50 L60 59 Z",
    eyes: { at: [[47, 41], [73, 41]], white: 10, pupil: 4 },
  },
  duck: {
    shadow: [60, 110, 30, 3.5],
    legs: [],
    back: ["M88 80 C100 76 104 66 96 62 C98 70 94 74 88 74 Z"],
    body: "M26 80 C26 62 94 62 94 80 C94 100 82 106 60 106 C38 106 26 100 26 80 Z",
    belly: "M38 84 C38 72 82 72 82 84 C82 96 74 101 60 101 C46 101 38 96 38 84 Z",
    wings: [
      { d: "M27 74 C14 80 18 98 35 96 C31 88 29 80 27 74 Z", pivot: [27, 74] },
      { d: mirror("M27 74 C14 80 18 98 35 96 C31 88 29 80 27 74 Z"), pivot: [93, 74] },
    ],
    head: { cx: 60, cy: 42, r: 23 },
    details: ["M57 20 C54 11 63 8 66 14 C62 13 60 16 61 20 Z"],
    glasses: true,
    beak: "M43 51 C43 46 55 45 60 45 C65 45 77 46 77 51 C77 56 66 60 60 60 C54 60 43 56 43 51 Z",
    eyes: { at: [[51, 37], [69, 37]], white: 0, pupil: 2.6 },
  },
  flamingo: {
    shadow: [60, 110, 20, 3],
    legs: ["M56 86 L55 97 L58 108 M53 108 L62 108", "M65 86 L66 108 M62 108 L71 108"],
    body: "M38 70 C38 54 88 54 88 70 C88 86 76 90 62 90 C48 90 38 86 38 70 Z",
    belly: "M46 72 C46 63 80 63 80 72 C80 82 72 85 63 85 C54 85 46 82 46 72 Z",
    wings: [
      { d: "M42 64 C30 68 32 84 47 84 C43 76 43 70 42 64 Z", pivot: [42, 64] },
      { d: "M84 64 C96 68 94 84 79 84 C83 76 83 70 84 64 Z", pivot: [84, 64] },
    ],
    neck: { d: "M58 60 C58 42 40 34 46 22", width: 7 },
    head: { cx: 48, cy: 18, r: 11 },
    details: [],
    beak: "M38 16 C28 18 29 28 24 33 C33 28 38 23 40 20 Z",
    eyes: { at: [[46, 15]], white: 3.2, pupil: 1.8 },
  },
  pigeon: {
    shadow: [60, 112, 22, 3],
    legs: ["M52 94 L51 99 M48 99 L54 99", "M68 94 L69 99 M66 99 L72 99"],
    back: ["M53 98 L52 103", "M67 98 L68 103", "M30 68 C16 72 14 62 28 56 C17 57 15 49 32 48 Z"],
    body: "M34 64 C34 44 86 44 86 64 C86 86 74 96 60 96 C46 96 34 86 34 64 Z",
    belly: "M43 68 C43 57 77 57 77 68 C77 82 70 88 60 88 C50 88 43 82 43 68 Z",
    wings: [
      { d: pigeonWing, pivot: [36, 58] },
      { d: mirror(pigeonWing), pivot: [84, 58] },
    ],
    head: { cx: 60, cy: 36, r: 19 },
    details: ["M54 18 C56 12 64 12 66 18 C63 16 57 16 54 18 Z"],
    beak: "M55 41 L65 41 L60 50 Z",
    eyes: { at: [[52, 33], [68, 33]], white: 5, pupil: 2.4 },
    parcel: ["M60 100 L71 105 L60 110 L49 105 Z", "M49 105 L60 110 L60 118 L49 113 Z", "M71 105 L60 110 L60 118 L71 113 Z"],
  },
  /**
   * The lovebird — the inseparable that introduces two people. A plump little parrot: a short tail, a round head
   * with its coloured face (the detail colour), the white eye-rings of the species and a short hooked beak.
   */
  lovebird: {
    shadow: [60, 110, 23, 3.5],
    legs: ["M53 96 L52 106 M48 106 L56 106", "M67 96 L68 106 M64 106 L72 106"],
    back: ["M74 90 C82 98 88 104 95 103 C91 98 86 91 82 84 Z"],
    body: "M32 66 C32 46 88 46 88 66 C88 90 76 100 60 100 C44 100 32 90 32 66 Z",
    belly: "M42 70 C42 59 78 59 78 70 C78 85 70 92 60 92 C50 92 42 85 42 70 Z",
    wings: [
      { d: "M33 60 C20 68 22 88 40 90 C35 80 34 70 33 60 Z", pivot: [33, 60] },
      { d: mirror("M33 60 C20 68 22 88 40 90 C35 80 34 70 33 60 Z"), pivot: [87, 60] },
    ],
    head: { cx: 60, cy: 38, r: 21 },
    details: ["M43 40 C42 28 51 22 60 22 C69 22 78 28 77 40 C76 50 68 55 60 55 C52 55 44 50 43 40 Z"],
    beak: "M55 44 C55 40 65 40 65 44 C65 50 62 54 60 55 C58 54 55 50 55 44 Z",
    eyes: { at: [[51, 36], [69, 36]], white: 4.6, pupil: 2.4 },
  },
  /**
   * The crane — the one that listens: posed, unhurried, drawn in one line. A tall wader seen in profile, standing still
   * on two straight legs, the neck a single stroke up to a small head with its crown (the detail colour) and a long,
   * straight beak; the folded wings low on its back. The flamingo bends and answers; the crane stands and listens.
   */
  crane: {
    shadow: [62, 110, 20, 3],
    legs: ["M56 87 L55 108 M51 108 L59 108", "M67 87 L68 108 M64 108 L73 108"],
    body: "M40 66 C38 54 84 54 86 68 C88 82 76 88 62 88 C48 88 40 80 40 66 Z",
    belly: "M48 70 C48 62 78 62 79 70 C80 79 72 84 63 84 C54 84 48 79 48 70 Z",
    wings: [
      { d: "M44 62 C33 68 35 82 49 83 C45 76 45 69 44 62 Z", pivot: [44, 62] },
      { d: "M82 62 C93 67 96 82 80 84 C83 76 83 69 82 62 Z", pivot: [82, 62] },
    ],
    neck: { d: "M52 62 C48 47 52 37 48 26", width: 6 },
    head: { cx: 47, cy: 21, r: 8.5 },
    details: ["M41 16.5 C42 11 52 11 53 16.5 C50 14.6 44 14.6 41 16.5 Z"],
    beak: "M40.5 18.5 L19 22.5 L40.5 25.5 Z",
    eyes: { at: [[45.5, 19.5]], white: 2.8, pupil: 1.6 },
  },
};

/** What a mood adds around the bird: a badge, a thought, an empty tray. */
export const MOOD_PARTS = {
  /** The badge of `success` and `error`, top right. */
  badge: { cx: 98, cy: 22, r: 11 },
  check: "M92.5 22.5 L96.8 26.6 L103.6 18.4",
  bang: { line: "M98 15.5 L98 23.5", dot: [98, 28] as Point },
  /** `thinking`: three dots rising to the right of the head. */
  dots: [
    [88, 26, 2.6],
    [96, 19, 3.2],
    [105, 11, 3.8],
  ] as const,
  /** `empty`: an open tray beside the bird. */
  tray: "M90 96 L110 96 L107 108 L93 108 Z",
  /** `success`: two sparkles. */
  sparkles: ["M16 26 L18 31 L23 33 L18 35 L16 40 L14 35 L9 33 L14 31 Z", "M104 52 L105.2 55 L108 56 L105.2 57 L104 60 L102.8 57 L100 56 L102.8 55 Z"],
} as const;

/** The happy eye of `success`: an arch. */
export const archEye = ([x, y]: Point, r: number) => `M${x - r} ${y + r * 0.45} Q${x} ${y - r * 1.15} ${x + r} ${y + r * 0.45}`;
/** The lowered lid of `empty`: a line across the eye. */
export const lidEye = ([x, y]: Point, r: number) => `M${x - r} ${y + 0.4} L${x + r} ${y + 0.4}`;
/** The heavy lid of `empty` over an eye with a white: its upper half. */
export const upperLid = ([x, y]: Point, r: number) => `M${x - r} ${y} A${r} ${r} 0 0 1 ${x + r} ${y} Z`;
/** The worried brow of `error`, above one eye (`side` -1 left, 1 right). */
export const brow = ([x, y]: Point, r: number, side: number) =>
  `M${x - r * 1.1} ${y - r * 1.25 - (side < 0 ? 0 : r * 0.7)} L${x + r * 1.1} ${y - r * 1.5 - (side < 0 ? r * 0.7 : 0)}`;

export interface MascotPalette {
  /** Top and bottom of the body gradient. */
  readonly from: string;
  readonly to: string;
  /** Wings and details (tufts, crest). */
  readonly wing: string;
  readonly detail: string;
  /** Beak and feet. */
  readonly beak: string;
  /** The pupils (and the falcon's visor lights). */
  readonly eye: string;
}

/** The signature palettes of the Krizaka story (`tone="own"`), from the first drawings of each bird. */
export const OWN_PALETTES: Readonly<Record<MascotBird, MascotPalette>> = {
  falcon: { from: "#ff9f00", to: "#ff2a00", wing: "#d84315", detail: "#b4320d", beak: "#ffb300", eye: "#00c8d4" },
  owl: { from: "#a78bfa", to: "#6d28d9", wing: "#7c3aed", detail: "#5b21b6", beak: "#fbbf24", eye: "#1f2937" },
  duck: { from: "#f43f5e", to: "#be123c", wing: "#db2777", detail: "#9f1239", beak: "#fbbf24", eye: "#1f2937" },
  flamingo: { from: "#f9a8d4", to: "#db2777", wing: "#ec4899", detail: "#be185d", beak: "#fbbf24", eye: "#1f2937" },
  pigeon: { from: "#22d3ee", to: "#6366f1", wing: "#a855f7", detail: "#4338ca", beak: "#f59e0b", eye: "#1f2937" },
  lovebird: { from: "#6ee7b7", to: "#059669", wing: "#047857", detail: "#fb7185", beak: "#f97316", eye: "#1f2937" },
  // The sandhill crane (grue du Canada): sand-grey plumage, its red crown, dark legs and beak.
  crane: { from: "#ebe3d6", to: "#9c8f80", wing: "#7d7266", detail: "#dc2626", beak: "#44403c", eye: "#1f2937" },
};

/** Fixed light and shade, laid at a low opacity over a role (they read on both themes). */
export const LIGHT = "#ffffff";
export const SHADE = "#000000";
/** The parcel's faces (pigeon). */
export const PARCEL = ["#f59e0b", "#d97706", "#b45309"] as const;
