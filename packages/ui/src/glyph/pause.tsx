import type { GlyphProps } from "./base";
import { Filled } from "./filled";

const bar = (x: number) => <rect x={x} y="5" width="4" height="14" rx="1" />;

export const PauseGlyph = (p: Readonly<GlyphProps>) => (
  <Filled {...p}>
    {bar(6)}
    {bar(14)}
  </Filled>
);
