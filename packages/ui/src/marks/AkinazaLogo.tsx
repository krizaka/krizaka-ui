import { AKINAZA as G } from "./akinaza-geometry";
import { a11y, familyMotion, type MarkProps, neutral, useIds } from "./shared";

const CSS = familyMotion("akm", { ...G.motion, ...G.pulse });

/**
 * The Akinaza mark, "the cut log": a log seen end-on in forest green, its year rings in light, cut at 45° by the beaver
 * (the Krizaka chamfer) with the fresh face in copper, and a copper heart that breathes — a shop built ring by ring.
 * One node, a coin, rides the dashed orbit. Below 48 px it crops to the emblem.
 */
export function AkinazaLogo({ size = 32, animated = true, title, className }: MarkProps) {
  const id = useIds("akm", ["glow"] as const);
  const m = (cls: string) => (animated ? `akm-${cls}` : undefined);
  return (
    <svg width={size} height={size} viewBox={size < 48 ? G.croppedViewBox : G.viewBox} fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...a11y(title)}>
      <style>{CSS}</style>
      <defs>
        <radialGradient id={id.glow} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={G.glow.color} stopOpacity={G.glow.opacity} />
          <stop offset="100%" stopColor={G.glow.color} stopOpacity="0" />
        </radialGradient>
      </defs>
      {size >= 48 ? <circle cx={G.center} cy={G.center} r="190" fill={`url(#${id.glow})`} /> : null /* cropped: the halo would show its square */}
      <circle cx={G.center} cy={G.center} r={G.ring.r} stroke={neutral("--kz-border-default", 30)} strokeWidth={G.ring.width} opacity=".35" />
      <g className={m("orbit")}>
        <circle cx={G.center} cy={G.center} r={G.orbit.r} stroke={neutral("--kz-border-strong", 40)} strokeWidth={G.orbit.width} strokeDasharray={G.orbit.dash} opacity=".6" />
        <circle cx={G.node.at[0]} cy={G.node.at[1]} r={G.node.r} fill={G.copper} />
      </g>
      <path d={G.log} fill={G.forest} />
      <path d={G.cut} fill={G.copper} />
      {G.rings.r.map((r) => (
        <circle key={r} cx={G.rings.cx} cy={G.rings.cy} r={r} stroke={G.highlight} strokeOpacity={G.rings.opacity} strokeWidth={G.rings.width} />
      ))}
      <g className={m("core")}>
        <circle cx={G.heart.cx} cy={G.heart.cy} r={G.heart.r} fill={G.copper} />
        <circle cx={G.heart.cx} cy={G.heart.cy} r={G.heart.inner} fill={G.highlight} />
      </g>
    </svg>
  );
}
