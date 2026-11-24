import type { GlyphProps } from "./base";

// Its own filled svg, not the `Glyph` base: the base stays with the shell's glyphs alone, so a bundler that splits by
// importer keeps it in their chunk instead of a module of its own on every route (krizaka-internal#4833).
export const PlayGlyph = ({ className = "h-4 w-4" }: Readonly<GlyphProps>) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden focusable="false">
    <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.4-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
  </svg>
);
