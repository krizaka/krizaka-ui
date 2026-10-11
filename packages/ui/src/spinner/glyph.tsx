// The Krizaka loader glyph, server-safe: a hexagon (the marks' shape) traced by a segment of light around a node that
// breathes; determinate, it fills to its value; done, the trace closes and a check (or a cross) draws itself. Animated by
// motion.css (`kz-loader-*`); still under prefers-reduced-motion — a segment at rest and the node lit, never blank.
import type * as React from "react";

/** The hexagon, pointy top, radius 9 around (12, 12). */
const HEX = "M12 3 19.79 7.5 19.79 16.5 12 21 4.21 16.5 4.21 7.5Z";

/** What the glyph shows: a wait (with an optional value), or how it ended. */
export type LoaderGlyphState = "loading" | "success" | "error";

export interface LoaderGlyphProps extends Omit<React.ComponentProps<"svg">, "children"> {
  /** loading · success · error. */
  state?: LoaderGlyphState;
  /** Between 0 and 1: a determinate wait, the trace grows to it. Absent: indeterminate. */
  value?: number | null;
}

/** The glyph alone (decorative): the Spinner, the Loader and the Button's `loading` draw it. */
export function LoaderGlyph({ state = "loading", value, ...props }: LoaderGlyphProps) {
  const known = typeof value === "number" && Number.isFinite(value);
  const fill = state !== "loading" ? 100 : known ? Math.round(Math.min(1, Math.max(0, value)) * 100) : null;
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden data-state={state} data-progress={fill === null ? undefined : fill} {...props}>
      <path d={HEX} stroke="currentColor" strokeOpacity="0.22" strokeWidth="2.2" strokeLinejoin="round" />
      <path
        d={HEX}
        pathLength={100}
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
        strokeLinecap="round"
        className="kz-loader-trace"
        strokeDasharray={fill === null ? undefined : `${fill} ${100 - fill}`}
      />
      {state === "loading" && <circle cx="12" cy="12" r="2.6" fill="currentColor" className="kz-loader-node" />}
      {state === "success" && <path d="M8.3 12.3l2.6 2.6 4.9-5.3" pathLength={20} stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="kz-loader-mark" />}
      {state === "error" && <path d="M9.4 9.4l5.2 5.2M14.6 9.4l-5.2 5.2" pathLength={20} stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="kz-loader-mark" />}
    </svg>
  );
}
