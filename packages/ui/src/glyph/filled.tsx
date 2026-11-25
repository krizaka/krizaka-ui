import type * as React from "react";

import type { GlyphProps } from "./base";

// The one svg the play and pause glyphs share, in a module of their own: not the `Glyph` base, which stays with the
// shell's glyphs, so the chunk the shell imports never carries it (krizaka-internal#4833). No `focusable` attribute:
// it only matters to the engines that no longer ship (IE 11, EdgeHTML), and `aria-hidden` covers the rest.
export const Filled = ({ className = "h-4 w-4", children }: Readonly<GlyphProps & { children: React.ReactNode }>) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    {children}
  </svg>
);
