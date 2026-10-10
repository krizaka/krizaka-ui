/**
 * A glyph of the Krizaka signature icons, on a 24-unit grid: stroked paths (`p`), stroked circles (`c`, [cx, cy, r])
 * and nodes (`n`, [cx, cy]) — filled dots of radius NODE_RADIUS, the core of the Krizaka marks.
 */
export type Glyph = {
  readonly p?: readonly string[];
  readonly c?: readonly (readonly [number, number, number])[];
  readonly n?: readonly (readonly [number, number])[];
};

/** The radius of a node, in grid units. */
export const NODE_RADIUS = 1.6;

/** The default stroke, in grid units. */
export const STROKE_WIDTH = 1.75;
