import { a11y, type MarkProps, neutral, useIds, withAlpha } from "./shared";
import { YAZAKIA as G } from "./yazakia-geometry";

const CSS = `
.yzm-orbit { transform-origin: 200px 200px; animation: yzm-orbit 30s linear infinite; }
.yzm-core { transform-box: fill-box; transform-origin: center; animation: yzm-core 3.2s ease-in-out infinite; }
@keyframes yzm-orbit { to { transform: rotate(360deg); } }
@keyframes yzm-core {
  0%, 100% { filter: drop-shadow(0 0 6px ${withAlpha(G.pulse.color, G.pulse.low)}); opacity: .9; }
  50% { filter: drop-shadow(0 0 14px ${withAlpha(G.pulse.color, G.pulse.high)}); opacity: 1; }
}
@media (prefers-reduced-motion: reduce) { .yzm-orbit, .yzm-core { animation: none; } }
`;

/**
 * The Yazakia mark: a "Y" drawn as two people who lean in and meet — two arms ending in round heads, joined at a
 * core that breathes, one stem below — in the Yazakia gradient (emerald → turquoise, the brand's mark gradient of
 * @krizaka/tokens, the same in dark and light). The pair, two nodes on the dashed orbit, turns slowly around it — the
 * family's grammar (orbit, ring, bold emblem, bright core). Below 48 px it crops to the emblem.
 */
export function YazakiaLogo({ size = 32, animated = true, title, className }: MarkProps) {
  const id = useIds("yzm", ["gradient", "glow"] as const);
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
      <g className={animated ? "yzm-orbit" : undefined}>
        <circle cx={G.center} cy={G.center} r={G.orbit.r} stroke={neutral("--kz-border-strong", 40)} strokeWidth={G.orbit.width} strokeDasharray={G.orbit.dash} opacity=".6" />
        {G.pair.at.map(([cx, cy]) => (
          <circle key={cx} cx={cx} cy={cy} r={G.pair.r} fill={fill} />
        ))}
      </g>
      {G.arms.map((d) => (
        <path key={d} d={d} stroke={fill} strokeWidth={G.stroke} strokeLinecap="round" />
      ))}
      <path d={G.stem} stroke={fill} strokeWidth={G.stroke} strokeLinecap="round" />
      {G.heads.map((h) => (
        <circle key={h.cx} cx={h.cx} cy={h.cy} r={h.r} fill={fill} />
      ))}
      <g className={animated ? "yzm-core" : undefined}>
        <circle cx={G.core.cx} cy={G.core.cy} r={G.core.r} fill={fill} />
        <circle cx={G.core.cx} cy={G.core.cy} r={G.core.inner} fill={G.highlight} />
      </g>
    </svg>
  );
}
