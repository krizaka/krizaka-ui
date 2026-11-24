import type { GlyphProps } from "./base";
import { Filled } from "./filled";

export const PlayGlyph = (p: Readonly<GlyphProps>) => (
  <Filled {...p}>
    <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.4-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
  </Filled>
);
