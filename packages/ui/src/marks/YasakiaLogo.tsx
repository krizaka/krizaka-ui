import { a11y, type MarkProps, neutral, useIds, withAlpha } from "./shared";
import { YASAKIA as G } from "./yasakia-geometry";

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
 * The Yasakia mark: two voices — two solid speech bubbles that overlap, the left a shade deeper — in the Yasakia
 * gradient (emerald → turquoise, the brand's mark gradient of @krizaka/tokens, the same in dark and light). Where they
 * overlap, what the two share, is the bright core: a lens lit from above that breathes. The pair, two nodes on the
 * dashed orbit, turns slowly around it — the family's grammar (orbit, ring, bold emblem, bright core). Below 48 px it
 * crops to the emblem.
 */
export function YasakiaLogo({ size = 32, animated = true, title, className }: MarkProps) {
  const id = useIds("yzm", ["gradient", "light", "glow"] as const);
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
        <linearGradient id={id.light} gradientUnits="userSpaceOnUse" x1="0" y1={G.lens.y1} x2="0" y2={G.lens.y2}>
          <stop offset="0%" stopColor={G.highlight.color} stopOpacity={G.highlight.from} />
          <stop offset="100%" stopColor={G.highlight.color} stopOpacity={G.highlight.to} />
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
      {G.voices.map((v, i) => (
        <g key={v.body}>
          <path d={v.body} fill={fill} />
          <path d={v.tail} fill={fill} />
          {i === 0 ? <path d={`${v.body} ${v.tail}`} fill={G.shade.color} opacity={G.shade.opacity} /> : null}
        </g>
      ))}
      <g className={animated ? "yzm-core" : undefined}>
        <path d={G.lens.d} fill={fill} />
        <path d={G.lens.d} fill={`url(#${id.light})`} />
      </g>
    </svg>
  );
}

/** @deprecated Yazakia was renamed Yasakia (2026-10): use `YasakiaLogo`. Kept for one minor version. */
export const YazakiaLogo = YasakiaLogo;
