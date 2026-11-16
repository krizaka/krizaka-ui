// The spec of a sketch (krizaka-internal#4006): the API the blog writes its figures against. Extend it, never rename.

/** A point of the drawing, in the spec's units: `[x, y]`. */
export type Pt = [number, number];

/** One thing drawn on the screen. Coordinates are in the spec's units, the origin at the screen's top left. */
export type SketchShape =
  /** A box: a card, a panel, an image. `soft` tints it, `accent` washes it in the pen's blue, `dashed` says « optional ». */
  | { kind: "box"; x: number; y: number; w: number; h: number; fill?: "none" | "soft" | "accent"; dashed?: boolean }
  /** A button: `primary` is filled with the pen's blue, `secondary` is an outline. The label is one or two short words. */
  | { kind: "button"; x: number; y: number; w: number; h: number; variant: "primary" | "secondary"; label?: string }
  /** Scribbled text lines: `count` lines `w` wide, the last one shorter. */
  | { kind: "lines"; x: number; y: number; w: number; count: number }
  /** A few written words (short words only: the meaning lives in the legend). `x`, `y` is the baseline's start. */
  | { kind: "text"; x: number; y: number; text: string; size?: "sm" | "md" }
  /** A pen line, or an arrow whose head is at `to`. */
  | { kind: "line" | "arrow"; from: Pt; to: Pt }
  /** An `@krizaka/icons` glyph by its name (`search`, `user`, `calendar`…), its top left at `x`, `y`, `size` units wide (24). */
  | { kind: "icon"; x: number; y: number; name: string; size?: number }
  /** A masked or sensitive area: hatched with the pen, never shown. */
  | { kind: "hatch"; x: number; y: number; w: number; h: number };

/** A numbered callout: the circled number at `from` (or at `at`), a line — an arrow with `arrow` — from it to `at`. */
export type SketchCallout = { n: number; at: Pt; from?: Pt; arrow?: boolean };

/** A whole sketch: the screen's size in units, its outline, the seed of the pen's wobble, the shapes and the callouts. */
export type SketchSpec = {
  width: number;
  height: number;
  /** A plain frame around the screen, a phone's outline, or nothing. @default "desktop" */
  frame?: "desktop" | "phone" | "none";
  /** The seed of the pen's wobble: the same spec and seed always draw the same SVG. @default 1 */
  seed?: number;
  shapes: SketchShape[];
  callouts?: SketchCallout[];
};

/** One line of the legend: the callout's number, its name, and what the item is for. */
export type SketchLegendItem = { n: number; label: string; text: string };
