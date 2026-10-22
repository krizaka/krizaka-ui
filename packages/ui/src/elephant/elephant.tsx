import type { SVGProps } from "react";

import { ELEPHANT as G } from "./geometry";

export interface ElephantProps extends Omit<SVGProps<SVGSVGElement>, "width" | "height" | "title"> {
  /** `standing` with the ear folded down, or `flying` with the ear spread like a wing. */
  pose?: "standing" | "flying";
  /** Width and height in pixels. */
  size?: number;
  /** The wing flaps gently (a flying elephant only). Off with `false`; always off under prefers-reduced-motion. */
  animated?: boolean;
  /** An accessible name (the mark becomes an image); without it the mark is decorative. */
  title?: string;
}

const CSS = `
.kz-elephant-flap { transform-box: view-box; transform-origin: ${G.motion.origin}; animation: kz-elephant-flap ${G.motion.flap}s ease-in-out infinite; }
@keyframes kz-elephant-flap { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(-${G.motion.angle}deg); } }
@media (prefers-reduced-motion: reduce) { .kz-elephant-flap { animation: none; } }
`;

const line = { strokeWidth: G.stroke, strokeLinecap: "square", strokeLinejoin: "miter", fill: "none" } as const;

/**
 * The elephant: a small, playful mark from the neighbour joke — « the elephant with those ears can fly ». Not a product
 * logo: a quiet figure for the hero of a page or the closing of a chat. Sage body, sand ear, flat colours that read on
 * both themes; decorative by default.
 */
export function Elephant({ pose = "standing", size = 64, animated = true, title, className, ...rest }: ElephantProps) {
  const flying = pose === "flying";
  const p = flying ? G.flying : G.standing;
  const a11y = title ? { role: "img" as const, "aria-label": title } : { "aria-hidden": true as const };
  return (
    <svg width={size} height={size} viewBox={G.viewBox} xmlns="http://www.w3.org/2000/svg" className={className} data-pose={pose} {...a11y} {...rest}>
      {flying && animated ? <style>{CSS}</style> : null}
      {flying ? <path d={G.flying.wind} stroke={G.sage} opacity=".45" {...line} /> : null}
      <path d={p.body} stroke={G.sage} {...line} />
            <path d={p.trunk} stroke={G.sage} {...line} />
      <path d={p.tail} stroke={G.sage} {...line} />
      <g className={flying && animated ? "kz-elephant-flap" : undefined}>
        <path d={p.ear} stroke={G.sand} {...line} />
      </g>
      <circle cx={G.eye.cx} cy={G.eye.cy} r={G.eye.r} fill={G.sage} />
    </svg>
  );
}
