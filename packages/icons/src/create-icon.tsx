import { forwardRef, type SVGProps } from "react";

import { type Glyph, NODE_RADIUS, STROKE_WIDTH } from "./glyph";

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "ref" | "children"> {
  /** Width and height (px or any CSS length). Default 24. */
  size?: number | string;
  /** The stroke, in grid units (the grid is 24). Default 1.75. */
  strokeWidth?: number;
  /** An accessible name: the icon becomes an image. Without it the icon is decorative (hidden from assistive technology). */
  title?: string;
  /** The colour of the node (the signature dot): e.g. `var(--kz-accent)`. Default: the icon's colour (`currentColor`). */
  nodeColor?: string;
}

export type Icon = ReturnType<typeof createIcon>;

/** Builds an icon component from a glyph. Server-safe: no hook, no directive. */
export function createIcon(displayName: string, glyph: Glyph) {
  const Component = forwardRef<SVGSVGElement, IconProps>(function KrizakaIcon(
    { size = 24, strokeWidth = STROKE_WIDTH, title, nodeColor = "currentColor", ...props },
    ref,
  ) {
    const a11y = title ? { role: "img", "aria-label": title } : { "aria-hidden": true as const, focusable: "false" as const };
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        data-kz-icon={displayName}
        {...a11y}
        {...props}
      >
        {title ? <title>{title}</title> : null}
        {glyph.p?.map((d) => <path key={d} d={d} />)}
        {glyph.c?.map(([cx, cy, r]) => <circle key={`${cx},${cy},${r}`} cx={cx} cy={cy} r={r} />)}
        {glyph.n?.map(([cx, cy]) => <circle key={`n${cx},${cy}`} data-node="" cx={cx} cy={cy} r={NODE_RADIUS} fill={nodeColor} stroke="none" />)}
      </svg>
    );
  });
  Component.displayName = displayName;
  return Component;
}
