import type { ReactNode } from "react";

import { KRIZAKA } from "./krizaka-geometry";
import { a11y, type MarkProps, neutral, useIds } from "./shared";

/** What an ink mark draws on the family frame: the Krizaka geometry, its node and core moved where its figure opens. */
export interface InkGeometry {
  readonly viewBox: string;
  readonly croppedViewBox: string;
  readonly offset: number;
  readonly ink: typeof KRIZAKA.ink;
  readonly blue: typeof KRIZAKA.blue;
  readonly glow: typeof KRIZAKA.glow;
  readonly orbit: typeof KRIZAKA.orbit;
  readonly ring: typeof KRIZAKA.ring;
  readonly highlight: string;
  readonly node: { readonly cx: number; readonly cy: number; readonly r: number; readonly inner: number };
  readonly core: { readonly cx: number; readonly cy: number; readonly r: number; readonly inner: number };
}

interface InkMarkProps extends MarkProps {
  /** The class prefix of `css` (`<prefix>-spin` turns the orbit, `<prefix>-pulse` makes the node and core breathe). */
  readonly prefix: string;
  readonly css: string;
  readonly geometry: InkGeometry;
  /** The figure, drawn with the ink gradient `url(#ink)` it is given. */
  readonly figure: (ink: string) => ReactNode;
}

/** The ink, blue and glow gradients of the marks in Krizaka's colours, under the instance's own ids. */
export function InkDefs({ ids: id, geometry: G }: Readonly<{ ids: Record<"ink" | "blue" | "glow", string>; geometry: Pick<InkGeometry, "ink" | "blue" | "glow"> }>) {
  return (
  <defs>
    <linearGradient id={id.ink} gradientUnits="userSpaceOnUse" x1={G.ink.x1} y1={G.ink.y1} x2={G.ink.x2} y2={G.ink.y2}>
      <stop offset="0%" stopColor={neutral("--kz-text-secondary", 60)} />
      <stop offset="100%" stopColor={neutral("--kz-text-primary", 92)} />
    </linearGradient>
    <linearGradient id={id.blue} gradientUnits="userSpaceOnUse" x1={G.blue.x1} y1={G.blue.y1} x2={G.blue.x2} y2={G.blue.y2}>
      {G.blue.stops.map(([offset, color]) => (
        <stop key={offset} offset={offset} stopColor={color} />
      ))}
    </linearGradient>
    <radialGradient id={id.glow} cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor={G.glow.color} stopOpacity={G.glow.opacity} />
      <stop offset="100%" stopColor={G.glow.color} stopOpacity="0" />
    </radialGradient>
  </defs>
  );
}

/**
 * The frame of the marks in Krizaka's colours (the company and its services: Krizaka, Kridoc): halo, dashed orbit, ring,
 * an ink figure, the blue node where it opens and the blue core. Below 48 px it crops to the emblem.
 */
export function InkMark({ size = 32, animated = true, title, className, prefix, css, geometry: G, figure }: InkMarkProps) {
  const id = useIds(prefix, ["ink", "blue", "glow"] as const);
  const m = (cls: string) => (animated ? `${prefix}-${cls}` : undefined);
  const dots = [G.node, G.core];
  return (
    <svg width={size} height={size} viewBox={size < 48 ? G.croppedViewBox : G.viewBox} fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...a11y(title)}>
      <style>{css}</style>
      <InkDefs ids={id} geometry={G} />
      {size >= 48 ? <circle cx="200" cy="200" r="190" fill={`url(#${id.glow})`} /> : null /* cropped: the halo would show its square */}
      <circle className={m("spin")} cx="200" cy="200" r={G.orbit.r} stroke={neutral("--kz-border-strong", 40)} strokeWidth={G.orbit.width} strokeDasharray={G.orbit.dash} opacity=".6" />
      <circle cx="200" cy="200" r={G.ring.r} stroke={neutral("--kz-border-default", 30)} strokeWidth={G.ring.width} opacity=".35" />
      <g transform={`translate(${G.offset} ${G.offset})`}>
        {figure(`url(#${id.ink})`)}
        {dots.map((d) => (
          <g key={`${d.cx},${d.cy}`} className={m("pulse")}>
            <circle cx={d.cx} cy={d.cy} r={d.r} fill={`url(#${id.blue})`} />
            <circle cx={d.cx} cy={d.cy} r={d.inner} fill={G.highlight} />
          </g>
        ))}
      </g>
    </svg>
  );
}
