import { ORAZAKA } from "../orazaka-geometry";
import { a11y, type MarkProps, neutral, useIds } from "../shared";

/** The 2.0 colours (amber, #b45309 → #f59e0b, hues 26 → 38), on today's geometry. Brand/Evolution only. */
const G = { ...ORAZAKA, amber: { ...ORAZAKA.gradient, stops: [["0%", "#b45309"], ["100%", "#f59e0b"]] as const }, highlight: "#fffbeb", glow: { color: "#f59e0b", opacity: 0.16 } };

const CSS = `
.ozv2-orbit { transform-origin: 200px 200px; animation: ozv2-orbit 35s linear infinite; }
.ozv2-core { transform-box: fill-box; transform-origin: center; animation: ozv2-core 3.2s ease-in-out infinite; }
@keyframes ozv2-orbit { to { transform: rotate(360deg); } }
@keyframes ozv2-core {
  0%, 100% { filter: drop-shadow(0 0 6px hsla(38, 92%, 50%, .3)); opacity: .9; }
  50% { filter: drop-shadow(0 0 14px hsla(38, 92%, 50%, .6)); opacity: 1; }
}
@media (prefers-reduced-motion: reduce) { .ozv2-orbit, .ozv2-core { animation: none; } }
`;

/**
 * The Orazaka mark of 2.0.0-beta.5 → 2.0.x: the family's grammar in amber (#b45309 → #f59e0b). Replaced in 2.1.0 by the
 * brand's orange (hue 26): its light stop was the hue of --kz-warning and read at 2:1 on a light page.
 */
export function OrazakaLogoV2({ size = 32, animated = true, title, className }: MarkProps) {
  const id = useIds("ozv2", ["amber", "glow"] as const);
  const fill = `url(#${id.amber})`;
  return (
    <svg width={size} height={size} viewBox={size < 48 ? G.croppedViewBox : G.viewBox} fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...a11y(title)}>
      <style>{CSS}</style>
      <defs>
        <linearGradient id={id.amber} gradientUnits="userSpaceOnUse" x1={G.amber.x1} y1={G.amber.y1} x2={G.amber.x2} y2={G.amber.y2}>
          {G.amber.stops.map(([offset, color]) => (
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
      <g className={animated ? "ozv2-orbit" : undefined}>
        {G.shards.map((d) => (
          <path key={d} d={d} fill={fill} stroke={fill} strokeWidth={G.shardStroke} strokeLinejoin="round" />
        ))}
      </g>
      <g className={animated ? "ozv2-core" : undefined}>
        <circle cx={G.center} cy={G.center} r={G.core.r} fill={fill} />
        <circle cx={G.center} cy={G.center} r={G.core.inner} fill={G.highlight} />
      </g>
    </svg>
  );
}
