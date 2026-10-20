import { a11y, type MarkProps, neutral, useIds } from "./shared";
import { WU_SAMA as G } from "./wu-sama-geometry";

/**
 * The Wu-sama mark — the founder's byline mark, for the person and not the company (the company keeps `KrizakaLogo`).
 * Oussama's nickname is Wu-sama: it shares Krizaka's hexagonal shield contour and color palette (ink shield, open
 * vertex with lit blue node), with the W rendered in Krizaka blue at the center. Below 48 px it crops to the emblem.
 */
export function WuSamaMark({ size = 32, title, className }: Omit<MarkProps, "animated"> & { animated?: boolean }) {
  const id = useIds("wsm", ["ink", "blue", "glow"] as const);
  return (
    <svg width={size} height={size} viewBox={size < 48 ? G.croppedViewBox : G.viewBox} fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...a11y(title)}>
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
      {size >= 48 ? <circle cx="200" cy="200" r="190" fill={`url(#${id.glow})`} /> : null}
      {size >= 48 ? (
        <>
          <circle cx="200" cy="200" r={G.orbit.r} stroke={neutral("--kz-border-strong", 40)} strokeWidth={G.orbit.width} strokeDasharray={G.orbit.dash} opacity=".6" />
          <circle cx="200" cy="200" r={G.ring.r} stroke={neutral("--kz-border-default", 30)} strokeWidth={G.ring.width} opacity=".35" />
        </>
      ) : null}
      <g transform={`translate(${G.offset} ${G.offset})`}>
        <path d={G.shield} stroke={`url(#${id.ink})`} strokeWidth={G.stroke} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={G.node.cx} cy={G.node.cy} r={G.node.r} fill={`url(#${id.blue})`} />
        <circle cx={G.node.cx} cy={G.node.cy} r={G.node.inner} fill={G.highlight} />
        <path d={G.w} stroke={`url(#${id.blue})`} strokeWidth={G.wStroke} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}
