import type * as React from "react";

export type GlyphProps = { className?: string };

export function Glyph({ className = "h-4 w-4", fill, children }: Readonly<GlyphProps & { fill?: boolean; children: React.ReactNode }>) {
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
