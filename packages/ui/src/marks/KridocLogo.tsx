import { KRIDOC as G } from "./kridoc-geometry";
import { a11y, type MarkProps, neutral, useIds } from "./shared";

const CSS = `
.kdm-spin { transform-origin: 200px 200px; animation: kdm-spin 30s linear infinite; }
.kdm-pulse { transform-box: fill-box; transform-origin: center; animation: kdm-pulse 3.2s ease-in-out infinite; }
@keyframes kdm-spin { to { transform: rotate(360deg); } }
@keyframes kdm-pulse { 0%, 100% { opacity: .9; } 50% { opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .kdm-spin, .kdm-pulse { animation: none; } }
`;

/**
 * The Kridoc mark (the managed storage, sold as « Kridoc by Krizaka »): an ink page with its corner folded, open at the
 * fold where a blue node — the share link — breaks out, and a blue seal on the page. Krizaka's colours: a service of the
 * company. The orbit turns, the node and the seal breathe. Below 48 px it crops to the emblem.
 */
export function KridocLogo({ size = 32, animated = true, title, className }: MarkProps) {
  const id = useIds("kdm", ["ink", "blue", "glow"] as const);
  const m = (cls: string) => (animated ? cls : undefined);
  const ink = `url(#${id.ink})`;
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
      <circle className={m("kdm-spin")} cx="200" cy="200" r={G.orbit.r} stroke={neutral("--kz-border-strong", 40)} strokeWidth={G.orbit.width} strokeDasharray={G.orbit.dash} opacity=".6" />
      <circle cx="200" cy="200" r={G.ring.r} stroke={neutral("--kz-border-default", 30)} strokeWidth={G.ring.width} opacity=".35" />
      <g transform={`translate(${G.offset} ${G.offset})`}>
        <path d={G.page} stroke={ink} strokeWidth={G.stroke} strokeLinecap="round" strokeLinejoin="round" />
        <path d={G.fold} stroke={ink} strokeWidth={G.stroke} strokeLinecap="round" strokeLinejoin="round" />
        {G.lines.map((d) => (
          <path key={d} d={d} stroke={ink} strokeWidth={G.stroke * 0.6} strokeLinecap="round" />
        ))}
        <g className={m("kdm-pulse")}>
          <circle cx={G.node.cx} cy={G.node.cy} r={G.node.r} fill={`url(#${id.blue})`} />
          <circle cx={G.node.cx} cy={G.node.cy} r={G.node.inner} fill={G.highlight} />
        </g>
        <g className={m("kdm-pulse")}>
          <circle cx={G.core.cx} cy={G.core.cy} r={G.core.r} fill={`url(#${id.blue})`} />
          <circle cx={G.core.cx} cy={G.core.cy} r={G.core.inner} fill={G.highlight} />
        </g>
      </g>
    </svg>
  );
}
