// The small line glyphs the data and media primitives draw (play, volume, search, chevrons…): decorative, 24-unit
// box, `currentColor`, sized by the caller's class. Shared by the entries that need them; never exported on its own —
// a product draws its own icons with @krizaka/icons.
import type * as React from "react";

type GlyphProps = { className?: string };

function Glyph({ className = "h-4 w-4", fill, children }: GlyphProps & { fill?: boolean; children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={fill ? "currentColor" : "none"}
      stroke={fill ? "none" : "currentColor"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
    >
      {children}
    </svg>
  );
}

export const PlayGlyph = (p: GlyphProps) => (
  <Glyph {...p} fill>
    <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.4-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
  </Glyph>
);
export const PauseGlyph = (p: GlyphProps) => (
  <Glyph {...p} fill>
    <rect x="6" y="5" width="4" height="14" rx="1" />
    <rect x="14" y="5" width="4" height="14" rx="1" />
  </Glyph>
);
export const VolumeGlyph = ({ muted, ...p }: GlyphProps & { muted?: boolean }) => (
  <Glyph {...p}>
    <path d="M11 5 6 9H3v6h3l5 4V5Z" />
    {muted ? <path d="m22 9-6 6m0-6 6 6" /> : <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />}
  </Glyph>
);
export const FullscreenGlyph = ({ exit, ...p }: GlyphProps & { exit?: boolean }) => (
  <Glyph {...p}>
    {exit ? <path d="M9 4v5H4m11-5v5h5M9 20v-5H4m11 5v-5h5" /> : <path d="M4 9V4h5m6 0h5v5M4 15v5h5m11-5v5h-5" />}
  </Glyph>
);
export const CaptionsGlyph = (p: GlyphProps) => (
  <Glyph {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M10 10.5a2 2 0 1 0 0 3M17 10.5a2 2 0 1 0 0 3" />
  </Glyph>
);
export const PipGlyph = (p: GlyphProps) => (
  <Glyph {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <rect x="12" y="12" width="6" height="4" rx="1" />
  </Glyph>
);
export const SearchGlyph = (p: GlyphProps) => (
  <Glyph {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Glyph>
);
export const CloseGlyph = (p: GlyphProps) => (
  <Glyph {...p}>
    <path d="M18 6 6 18M6 6l12 12" />
  </Glyph>
);
export const ChevronGlyph = ({ direction = "down", ...p }: GlyphProps & { direction?: "left" | "right" | "up" | "down" }) => (
  <Glyph {...p}>
    <path d={{ left: "m15 6-6 6 6 6", right: "m9 6 6 6-6 6", up: "m6 15 6-6 6 6", down: "m6 9 6 6 6-6" }[direction]} />
  </Glyph>
);
export const CheckGlyph = (p: GlyphProps) => (
  <Glyph {...p}>
    <path d="M20 6 9 17l-5-5" />
  </Glyph>
);
export const PlusGlyph = (p: GlyphProps) => (
  <Glyph {...p}>
    <path d="M12 5v14M5 12h14" />
  </Glyph>
);
export const CalendarGlyph = (p: GlyphProps) => (
  <Glyph {...p}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </Glyph>
);
export const UploadGlyph = (p: GlyphProps) => (
  <Glyph {...p}>
    <path d="M12 16V4m0 0L7 9m5-5 5 5" />
    <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
  </Glyph>
);
export const FileGlyph = (p: GlyphProps) => (
  <Glyph {...p}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
    <path d="M14 3v5h5" />
  </Glyph>
);
export const CameraGlyph = (p: GlyphProps) => (
  <Glyph {...p}>
    <path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
    <circle cx="12" cy="13.5" r="3.5" />
  </Glyph>
);
export const FlipGlyph = (p: GlyphProps) => (
  <Glyph {...p}>
    <path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3" />
    <path d="M18 3v4h-4M6 21v-4h4" />
  </Glyph>
);
export const RetryGlyph = (p: GlyphProps) => (
  <Glyph {...p}>
    <path d="M4 12a8 8 0 1 0 2.3-5.7L4 8.5" />
    <path d="M4 4v4.5h4.5" />
  </Glyph>
);
export const SortGlyph = ({ direction, ...p }: GlyphProps & { direction?: "ascending" | "descending" }) => (
  <Glyph {...p}>
    {direction === "ascending" ? <path d="m7 14 5-5 5 5" /> : direction === "descending" ? <path d="m7 10 5 5 5-5" /> : <path d="m8 9 4-4 4 4M8 15l4 4 4-4" />}
  </Glyph>
);
export const ArrowGlyph = ({ direction = "right", ...p }: GlyphProps & { direction?: "left" | "right" }) => (
  <Glyph {...p}>
    <path d={direction === "left" ? "M19 12H5m0 0 6-6m-6 6 6 6" : "M5 12h14m0 0-6-6m6 6-6 6"} />
  </Glyph>
);
export const ExternalGlyph = (p: GlyphProps) => (
  <Glyph {...p}>
    <path d="M14 4h6v6M20 4l-9 9" />
    <path d="M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4" />
  </Glyph>
);
export const WarningGlyph = (p: GlyphProps) => (
  <Glyph {...p}>
    <path d="M12 4 2.5 20h19L12 4Z" />
    <path d="M12 10v4M12 17.2v.1" />
  </Glyph>
);
export const CopyGlyph = (p: GlyphProps) => (
  <Glyph {...p}>
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M15 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h3" />
  </Glyph>
);
export const PencilGlyph = (p: GlyphProps) => (
  <Glyph {...p}>
    <path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4zM13.5 6.5l4 4" />
  </Glyph>
);
