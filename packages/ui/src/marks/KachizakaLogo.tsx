import { KACHIZAKA as G } from "./kachizaka-geometry";
import { a11y, type MarkProps, neutral, useIds, withAlpha } from "./shared";

const CSS = `
.kzm-orbit { transform-origin: 200px 200px; animation: kzm-orbit 28s linear infinite; }
.kzm-seal { transform-box: fill-box; transform-origin: center; animation: kzm-seal 3.2s ease-in-out infinite; }
@keyframes kzm-orbit { to { transform: rotate(360deg); } }
@keyframes kzm-seal {
  0%, 100% { transform: scale(1); filter: drop-shadow(0 0 4px ${withAlpha(G.pulse.color, G.pulse.low)}); }
  50% { transform: scale(1.06); filter: drop-shadow(0 0 12px ${withAlpha(G.pulse.color, G.pulse.high)}); }
}
@media (prefers-reduced-motion: reduce) { .kzm-orbit, .kzm-seal { animation: none; } }
`;

/**
 * The Kachizaka mark, "the sealed cup": a filled trophy whose rim wears the Krizaka cut, two handles, a stem and a
 * base, in the Kachizaka gradient (cobalt → gold, the brand's mark gradient of @krizaka/tokens, the same in dark and
 * light); on the bowl a star in light — the seal of the rules, locked at kick-off — breathes; one node, the ball, rides
 * the dashed orbit. The family's grammar (orbit, ring, bold emblem, bright core). Below 48 px it crops to the emblem.
 */
export function KachizakaLogo({ size = 32, animated = true, title, className }: MarkProps) {
  const id = useIds("kzm", ["gradient", "glow"] as const);
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
      <circle cx={G.center} cy={G.center} r={G.ring.r} stroke={neutral("--kz-border-default", 30)} strokeWidth={G.ring.width} opacity=".35" />
      <g className={animated ? "kzm-orbit" : undefined}>
        <circle cx={G.center} cy={G.center} r={G.orbit.r} stroke={neutral("--kz-border-strong", 40)} strokeWidth={G.orbit.width} strokeDasharray={G.orbit.dash} opacity=".6" />
        <circle cx={G.node.at[0]} cy={G.node.at[1]} r={G.node.r} fill={fill} />
      </g>
      <path d={G.handles} stroke={fill} strokeWidth={G.handleWidth} strokeLinecap="round" />
      <path d={G.base} fill={fill} />
      <path d={G.cup} fill={fill} />
      <path className={animated ? "kzm-seal" : undefined} d={G.star} fill={G.starColor} />
    </svg>
  );
}
