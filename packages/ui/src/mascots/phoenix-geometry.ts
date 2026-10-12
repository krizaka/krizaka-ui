/** The phoenix's geometry (120 × 120), drawn by the web `Phoenix` and the native one. */
export const PHOENIX = {
  wingL: "M56 62 C40 40 22 36 8 40 C22 46 30 56 34 70 C40 64 48 62 56 62 Z",
  wingR: "M64 62 C80 40 98 36 112 40 C98 46 90 56 86 70 C80 64 72 62 64 62 Z",
  tailL: "M52 66 C46 82 40 94 30 104 C44 98 52 90 58 78 Z",
  tailR: "M68 66 C74 82 80 94 90 104 C76 98 68 90 62 78 Z",
  body: "M60 34 L68 60 L60 82 L52 60 Z",
  crest: "M60 34 L56 24 M60 34 L64 24",
} as const;

export interface PhoenixPalette {
  /** The left wing's gradient (top → bottom). */
  readonly left: readonly [string, string];
  /** The right wing's gradient. */
  readonly right: readonly [string, string];
  /** The core's glow: centre, edge. */
  readonly core: readonly [string, string];
  /** The body and its edge. */
  readonly body: string;
  readonly edge: string;
  /** The crest. */
  readonly crest: string;
}

/** The phoenix of the Krizaka story: a violet wing, a gold wing (the brand layer's own colours, like the marks). */
export const PHOENIX_PALETTES: { readonly own: PhoenixPalette } = {
  own: {
    left: ["#c084fc", "#7c3aed"],
    right: ["#fde68a", "#f59e0b"],
    core: ["#fff7ed", "#fb923c"],
    body: "#1f1530",
    edge: "#e9d5ff",
    crest: "#fbbf24",
  },
};
