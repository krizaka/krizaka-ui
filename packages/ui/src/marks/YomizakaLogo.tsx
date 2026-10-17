import { a11y, familyMotion, type MarkProps, neutral, useIds } from "./shared";
import { YOMIZAKA as G } from "./yomizaka-geometry";

const CSS = familyMotion("ymm", { ...G.motion, ...G.pulse });

/**
 * The Yomizaka mark, "the watch": the owl — two lenses at the family stroke under one calm brow, its pupils glancing
 * down the line it reads — in the Yomizaka gradient (ink → indigo, the same in dark and light). The pupils are the lit
 * cores and breathe; one node, a page, rides the dashed orbit. Below 48 px it crops to the emblem.
 */
export function YomizakaLogo({ size = 32, animated = true, title, className }: MarkProps) {
  const id = useIds("ymm", ["gradient", "glow"] as const);
  const fill = `url(#${id.gradient})`;
  const m = (cls: string) => (animated ? `ymm-${cls}` : undefined);
  return (
    <svg width={size} height={size} viewBox={size < 48 ? G.croppedViewBox : G.viewBox} fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...a11y(title)}>
      <style>{CSS}</style>
      <defs>
        <linearGradient id={id.gradient} gradientUnits="userSpaceOnUse" x1={G.gradient.x1} y1={G.gradient.y1} x2={G.gradient.x2} y2={G.gradient.y2}>
          {G.gradient.stops.map(([offset, color]) => (
            <stop key={offset} offset={offset} stopColor={color} />
          ))}
        </linearGradient>
        <radialGradient id={id.glow} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={G.glow.color} stopOpacity={G.glow.opacity} />
          <stop offset="100%" stopColor={G.glow.color} stopOpacity="0" />
        </radialGradient>
      </defs>
      {size >= 48 ? <circle cx={G.center} cy={G.center} r="190" fill={`url(#${id.glow})`} /> : null /* cropped: the halo would show its square */}
      <circle cx={G.center} cy={G.center} r={G.ring.r} stroke={neutral("--kz-border-default", 30)} strokeWidth={G.ring.width} opacity=".35" />
      <g className={m("orbit")}>
        <circle cx={G.center} cy={G.center} r={G.orbit.r} stroke={neutral("--kz-border-strong", 40)} strokeWidth={G.orbit.width} strokeDasharray={G.orbit.dash} opacity=".6" />
        <circle cx={G.node.at[0]} cy={G.node.at[1]} r={G.node.r} fill={fill} />
      </g>
      <path d={G.brow} stroke={fill} strokeWidth={G.stroke} strokeLinecap="round" strokeLinejoin="round" />
      {G.lenses.map((l) => (
        <circle key={l.cx} cx={l.cx} cy={l.cy} r={l.r} stroke={fill} strokeWidth={G.stroke} />
      ))}
      <g className={m("core")}>
        {G.pupils.map((p) => (
          <g key={p.cx}>
            <circle cx={p.cx} cy={p.cy} r={p.r} fill={fill} />
            <circle cx={p.cx} cy={p.cy} r={p.inner} fill={G.highlight} />
          </g>
        ))}
      </g>
    </svg>
  );
}
