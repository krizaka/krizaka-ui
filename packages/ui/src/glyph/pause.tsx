import type { GlyphProps } from "./base";

// Its own filled svg, not the `Glyph` base (see play.tsx, krizaka-internal#4833).
export const PauseGlyph = ({ className = "h-4 w-4" }: Readonly<GlyphProps>) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden focusable="false">
    <rect x="6" y="5" width="4" height="14" rx="1" />
    <rect x="14" y="5" width="4" height="14" rx="1" />
  </svg>
);
