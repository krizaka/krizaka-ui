import { Glyph, type GlyphProps } from "./base";

export const PauseGlyph = (p: Readonly<GlyphProps>) => (
  <Glyph {...p} fill>
    <rect x="6" y="5" width="4" height="14" rx="1" />
    <rect x="14" y="5" width="4" height="14" rx="1" />
  </Glyph>
);
