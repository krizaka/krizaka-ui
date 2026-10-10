import { KRIZAKA as G } from "./krizaka-geometry";
import { a11y, type MarkProps, neutral, useIds } from "./shared";

const CSS = `
.kzm-spin { transform-origin: 200px 200px; animation: kzm-spin 30s linear infinite; }
.kzm-pulse { transform-box: fill-box; transform-origin: center; animation: kzm-pulse 3.2s ease-in-out infinite; }
@keyframes kzm-spin { to { transform: rotate(360deg); } }
@keyframes kzm-pulse {
  0%, 100% { filter: drop-shadow(0 0 6px hsla(217, 92%, 53%, .25)); opacity: .9; }
  50% { filter: drop-shadow(0 0 14px hsla(217, 92%, 53%, .55)); opacity: 1; }
}
@media (prefers-reduced-motion: reduce) { .kzm-spin, .kzm-pulse { animation: none; } }
`;

/**
 * The Krizaka mark: an ink hexagonal shield, open at one vertex where a blue node breaks out, around a blue core —
 * the parent of the family (Orochia's coiled serpent, Orazaka's shards). The orbit turns, the node and the core
 * breathe. The shield reads the host's text roles, so it is ink in both themes. Below 48 px it crops to the emblem.
 */
export function KrizakaLogo({ size = 32, animated = true, title, className }: MarkProps) {
  const id = useIds("kzm", ["ink", "blue", "glow"] as const);
  const m = (cls: string) => (animated ? cls : undefined);
  return (
    <svg width={size} height={size} viewBox={size < 48 ? G.croppedViewBox : G.viewBox} fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...a11y(title)}>
      <style>{CSS}</style>
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
      {size >= 48 ? <circle cx="200" cy="200" r="190" fill={`url(#${id.glow})`} /> : null /* cropped: the halo would show its square */}
      <circle className={m("kzm-spin")} cx="200" cy="200" r={G.orbit.r} stroke={neutral("--kz-border-strong", 40)} strokeWidth={G.orbit.width} strokeDasharray={G.orbit.dash} opacity=".6" />
      <circle cx="200" cy="200" r={G.ring.r} stroke={neutral("--kz-border-default", 30)} strokeWidth={G.ring.width} opacity=".35" />
      <g transform={`translate(${G.offset} ${G.offset})`}>
        <path d={G.shield} stroke={`url(#${id.ink})`} strokeWidth={G.stroke} strokeLinecap="round" strokeLinejoin="round" />
        <g className={m("kzm-pulse")}>
          <circle cx={G.node.cx} cy={G.node.cy} r={G.node.r} fill={`url(#${id.blue})`} />
          <circle cx={G.node.cx} cy={G.node.cy} r={G.node.inner} fill={G.highlight} />
        </g>
        <g className={m("kzm-pulse")}>
          <circle cx={G.core.cx} cy={G.core.cy} r={G.core.r} fill={`url(#${id.blue})`} />
          <circle cx={G.core.cx} cy={G.core.cy} r={G.core.inner} fill={G.highlight} />
        </g>
      </g>
    </svg>
  );
}
