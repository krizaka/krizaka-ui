import { AKINAZA as G } from "./akinaza-geometry";
import { a11y, type MarkProps, neutral, useIds, withAlpha } from "./shared";

const CSS = `
.akm-orbit { transform-origin: 200px 200px; animation: akm-orbit 32s linear infinite; }
.akm-door { animation: akm-door 3.8s ease-in-out infinite; }
@keyframes akm-orbit { to { transform: rotate(360deg); } }
@keyframes akm-door {
  0%, 100% { filter: drop-shadow(0 0 4px ${withAlpha(G.pulse.color, G.pulse.low)}); }
  50% { filter: drop-shadow(0 0 14px ${withAlpha(G.pulse.color, G.pulse.high)}); }
}
@media (prefers-reduced-motion: reduce) { .akm-orbit, .akm-door { animation: none; } }
`;

/**
 * The Akinaza mark, "the open shop": a filled awning with the Krizaka cut at its corner, scalloped, its stripes in
 * light; under it the shop front, two windows and the open door — a warm light that breathes. In the Akinaza gradient
 * (forest → copper, the brand's mark gradient of @krizaka/tokens, the same in dark and light); one node, a coin, rides
 * the dashed orbit. The family's grammar (orbit, ring, bold emblem, bright core). Below 48 px it crops to the emblem.
 */
export function AkinazaLogo({ size = 32, animated = true, title, className }: MarkProps) {
  const id = useIds("akm", ["gradient", "core", "glow"] as const);
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
      <g className={animated ? "akm-orbit" : undefined}>
        <circle cx={G.center} cy={G.center} r={G.orbit.r} stroke={neutral("--kz-border-strong", 40)} strokeWidth={G.orbit.width} strokeDasharray={G.orbit.dash} opacity=".6" />
        <circle cx={G.node.at[0]} cy={G.node.at[1]} r={G.node.r} fill={fill} />
      </g>
      <path d={G.awning} fill={fill} />
      <path d={G.stripes} stroke={G.stripe.color} strokeOpacity={G.stripe.opacity} strokeWidth={G.stripe.width} strokeLinecap="round" />
      <path d={G.front} fill={fill} />
      <path d={G.windows} fill={G.stripe.color} fillOpacity={G.stripe.opacity} />
      <rect className={animated ? "akm-door" : undefined} x={G.door.x} y={G.door.y} width={G.door.w} height={G.door.h} rx={G.door.rx} fill={`url(#${id.core})`} />
    </svg>
  );
}
