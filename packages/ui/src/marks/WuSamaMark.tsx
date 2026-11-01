import { InkDefs } from "./InkMark";
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
      <InkDefs ids={id} geometry={G} />
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
