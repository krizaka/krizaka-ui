import { a11y, type MarkProps, neutral, useIds, withAlpha } from "./shared";
import { YORORIS as G } from "./yororis-geometry";

const CSS = `
.yrm-orbit { transform-origin: 200px 200px; animation: yrm-orbit 36s linear infinite; }
.yrm-vein { animation: yrm-vein 4.8s linear infinite; }
.yrm-core { transform-box: fill-box; transform-origin: center; animation: yrm-core 4.2s ease-in-out infinite; }
@keyframes yrm-orbit { to { transform: rotate(360deg); } }
@keyframes yrm-vein { to { stroke-dashoffset: 64; } }
@keyframes yrm-core {
  0%, 100% { filter: drop-shadow(0 0 6px ${withAlpha(G.pulse.color, G.pulse.low)}); opacity: .9; }
  50% { filter: drop-shadow(0 0 16px ${withAlpha(G.pulse.color, G.pulse.high)}); opacity: 1; }
}
@media (prefers-reduced-motion: reduce) { .yrm-orbit, .yrm-vein, .yrm-core { animation: none; } }
`;

/**
 * The Yororis mark, "the hold": a "Y" whose arms are two filled leaves — open hands — rising from one stem and cupping
 * a warm core that breathes: held, given room, listened to. Leaves in the Yororis gradient (sand → sage, the brand's
 * mark gradient of @krizaka/tokens, the same in dark and light), a vein of light along each, the core in a warm sand
 * light; the moment, one node on the dashed orbit, comes round slowly. The family's grammar (orbit, ring, bold emblem,
 * bright core) with the slowest breath of the family. Below 48 px it crops to the emblem.
 */
export function YororisLogo({ size = 32, animated = true, title, className }: MarkProps) {
  const id = useIds("yrm", ["gradient", "core", "glow"] as const);
  const fill = `url(#${id.gradient})`;
  return (
    <svg width={size} height={size} viewBox={size < 48 ? G.croppedViewBox : G.viewBox} fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...a11y(title)}>
      <style>{CSS}</style>
      <defs>
        <linearGradient id={id.gradient} gradientUnits="userSpaceOnUse" x1={G.gradient.x1} y1={G.gradient.y1} x2={G.gradient.x2} y2={G.gradient.y2}>
          {G.gradient.stops.map(([offset, color]) => (
            <stop key={offset} offset={offset} stopColor={color} />
          ))}
        </linearGradient>
        <linearGradient id={id.core} x1="50%" y1="100%" x2="50%" y2="0%">
          {G.coreGradient.stops.map(([offset, color]) => (
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
      <g className={animated ? "yrm-orbit" : undefined}>
        <circle cx={G.center} cy={G.center} r={G.orbit.r} stroke={neutral("--kz-border-strong", 40)} strokeWidth={G.orbit.width} strokeDasharray={G.orbit.dash} opacity=".6" />
        <circle cx={G.moment.at[0]} cy={G.moment.at[1]} r={G.moment.r} fill={fill} />
      </g>
      <path d={G.stem} stroke={fill} strokeWidth={G.stroke} strokeLinecap="round" />
      {G.leaves.map((d) => (
        <path key={d} d={d} fill={fill} />
      ))}
      <path className={animated ? "yrm-vein" : undefined} d={G.veins} stroke={G.vein.color} strokeOpacity={G.vein.opacity} strokeWidth={G.vein.width} strokeLinecap="round" strokeDasharray={G.vein.dash} />
      <g className={animated ? "yrm-core" : undefined}>
        <circle cx={G.core.cx} cy={G.core.cy} r={G.core.r} fill={`url(#${id.core})`} />
        <circle cx={G.core.cx} cy={G.core.cy} r={G.core.inner} fill={G.highlight} />
      </g>
    </svg>
  );
}
