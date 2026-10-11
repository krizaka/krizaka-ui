import { ORAZAKA as G } from "./orazaka-geometry";
import { a11y, type MarkProps, neutral, useIds, withAlpha } from "./shared";

const CSS = `
.ozm-orbit { transform-origin: 200px 200px; animation: ozm-orbit 35s linear infinite; }
.ozm-core { transform-box: fill-box; transform-origin: center; animation: ozm-core 3.2s ease-in-out infinite; }
@keyframes ozm-orbit { to { transform: rotate(360deg); } }
@keyframes ozm-core {
  0%, 100% { filter: drop-shadow(0 0 6px ${withAlpha(G.pulse.color, G.pulse.low)}); opacity: .9; }
  50% { filter: drop-shadow(0 0 14px ${withAlpha(G.pulse.color, G.pulse.high)}); opacity: 1; }
}
@media (prefers-reduced-motion: reduce) { .ozm-orbit, .ozm-core { animation: none; } }
`;

/**
 * The Orazaka mark: three solid hexagonal shards in the Orazaka orange (the brand's mark
 * gradient of @krizaka/tokens, deep orange → orange, hue 26 — the same in dark and light) orbiting slowly around a core that breathes —
 * the family's grammar (dashed orbit, ring, bold emblem, bright core). Below 48 px it crops to the emblem.
 */
export function OrazakaLogo({ size = 32, animated = true, title, className }: MarkProps) {
  const id = useIds("ozm", ["gradient", "glow"] as const);
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
        <radialGradient id={id.glow} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={G.glow.color} stopOpacity={G.glow.opacity} />
          <stop offset="100%" stopColor={G.glow.color} stopOpacity="0" />
        </radialGradient>
      </defs>
      {size >= 48 ? <circle cx={G.center} cy={G.center} r="190" fill={`url(#${id.glow})`} /> : null /* cropped: the halo would show its square */}
      <circle cx={G.center} cy={G.center} r={G.orbit.r} stroke={neutral("--kz-border-strong", 40)} strokeWidth={G.orbit.width} strokeDasharray={G.orbit.dash} opacity=".6" />
      <circle cx={G.center} cy={G.center} r={G.ring.r} stroke={neutral("--kz-border-default", 30)} strokeWidth={G.ring.width} opacity=".35" />
      <g className={animated ? "ozm-orbit" : undefined}>
        {G.shards.map((d) => (
          <path key={d} d={d} fill={fill} stroke={fill} strokeWidth={G.shardStroke} strokeLinejoin="round" />
        ))}
      </g>
      <g className={animated ? "ozm-core" : undefined}>
        <circle cx={G.center} cy={G.center} r={G.core.r} fill={fill} />
        <circle cx={G.center} cy={G.center} r={G.core.inner} fill={G.highlight} />
      </g>
    </svg>
  );
}
