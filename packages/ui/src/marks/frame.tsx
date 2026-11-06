import type { ReactNode } from "react";

import { a11y, type MarkProps, neutral } from "./shared";

/** What every mark of the family shares: its view boxes, its centre, its halo, and the orbit and ring it is drawn around. */
export interface FrameGeometry {
  viewBox: string;
  croppedViewBox: string;
  center: number;
  glow: { color: string; opacity: number };
  orbit: { r: number; dash: string; width: number };
  ring: { r: number; width: number };
}

/** A brand gradient across the view box (`url(#id)` fills the emblem). */
export interface MarkGradient {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  stops: readonly (readonly [string, string])[];
}

type FrameProps = Required<Pick<MarkProps, "size">> &
  Pick<MarkProps, "title" | "className"> & {
    geometry: FrameGeometry;
    /** The mark's own motion (`familyMotion` or a legacy sheet). */
    css: string;
    /** The id of the halo's radial gradient. */
    glowId: string;
    gradient?: MarkGradient;
    children: ReactNode;
  };

/**
 * The frame of a product mark, one for the family: the `<svg>` (cropped to the emblem below 48 px), its motion, the
 * brand gradient and the halo, the halo itself (left out when cropped: it would show its square). The mark draws the rest.
 */
export function MarkFrame({ size, title, className, geometry: g, css, glowId, gradient, children }: Readonly<FrameProps>) {
  return (
    <svg width={size} height={size} viewBox={size < 48 ? g.croppedViewBox : g.viewBox} fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...a11y(title)}>
      <style>{css}</style>
      <defs>
        {gradient ? (
          <linearGradient id={gradient.id} gradientUnits="userSpaceOnUse" x1={gradient.x1} y1={gradient.y1} x2={gradient.x2} y2={gradient.y2}>
            {gradient.stops.map(([offset, color]) => (
              <stop key={offset} offset={offset} stopColor={color} />
            ))}
          </linearGradient>
        ) : null}
        <radialGradient id={glowId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={g.glow.color} stopOpacity={g.glow.opacity} />
          <stop offset="100%" stopColor={g.glow.color} stopOpacity="0" />
        </radialGradient>
      </defs>
      {size >= 48 ? <circle cx={g.center} cy={g.center} r="190" fill={`url(#${glowId})`} /> : null}
      {children}
    </svg>
  );
}

/** The dashed orbit of the family, in the host's strong border. */
export function MarkOrbit({ geometry: g }: Readonly<{ geometry: FrameGeometry }>) {
  return <circle cx={g.center} cy={g.center} r={g.orbit.r} stroke={neutral("--kz-border-strong", 40)} strokeWidth={g.orbit.width} strokeDasharray={g.orbit.dash} opacity=".6" />;
}

/** The quiet ring of the family, in the host's default border. */
export function MarkRing({ geometry: g }: Readonly<{ geometry: FrameGeometry }>) {
  return <circle cx={g.center} cy={g.center} r={g.ring.r} stroke={neutral("--kz-border-default", 30)} strokeWidth={g.ring.width} opacity=".35" />;
}
