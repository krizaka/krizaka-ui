import { a11y, type MarkProps, neutral, useIds, withAlpha } from "./shared";
import { YOMIZAKA as G } from "./yomizaka-geometry";

const CSS = `
.ymm-orbit { transform-origin: 200px 200px; animation: ymm-orbit 32s linear infinite; }
.ymm-scan { animation: ymm-scan 3.6s cubic-bezier(.45,0,.55,1) infinite; }
.ymm-lens { transform-box: fill-box; transform-origin: center; animation: ymm-lens 3.6s ease-in-out infinite; }
@keyframes ymm-orbit { to { transform: rotate(360deg); } }
@keyframes ymm-scan { 0% { transform: translateY(0); opacity: 0; } 12%, 80% { opacity: 1; } 100% { transform: translateY(${G.scan.travel}px); opacity: 0; } }
@keyframes ymm-lens {
  0%, 100% { filter: drop-shadow(0 0 6px ${withAlpha(G.pulse.color, G.pulse.low)}); }
  50% { filter: drop-shadow(0 0 16px ${withAlpha(G.pulse.color, G.pulse.high)}); }
}
@media (prefers-reduced-motion: reduce) { .ymm-orbit, .ymm-scan, .ymm-lens { animation: none; } .ymm-scan { opacity: 0; } }
`;

/**
 * The Yomizaka mark, "the reading": a filled page with the Krizaka cut at its corner, three lines of text in light, and
 * a lens — the eye that reads — resting on its lower half, its handle running out of the page. Page and lens in the
 * Yomizaka gradient (ink → indigo, the brand's mark gradient of @krizaka/tokens, the same in dark and light); the
 * lens' core is a pale indigo light that breathes; a line of light scans the page from top to bottom; one node, a
 * page, rides the dashed orbit. The family's grammar (orbit, ring, bold emblem, bright core). Below 48 px it crops to
 * the emblem.
 */
export function YomizakaLogo({ size = 32, animated = true, title, className }: MarkProps) {
  const id = useIds("ymm", ["gradient", "core", "glow", "page"] as const);
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
        <clipPath id={id.page}>
          <path d={G.page} />
        </clipPath>
      </defs>
      {size >= 48 ? <circle cx={G.center} cy={G.center} r="190" fill={`url(#${id.glow})`} /> : null /* cropped: the halo would show its square */}
      <circle cx={G.center} cy={G.center} r={G.ring.r} stroke={neutral("--kz-border-default", 30)} strokeWidth={G.ring.width} opacity=".35" />
      <g className={animated ? "ymm-orbit" : undefined}>
        <circle cx={G.center} cy={G.center} r={G.orbit.r} stroke={neutral("--kz-border-strong", 40)} strokeWidth={G.orbit.width} strokeDasharray={G.orbit.dash} opacity=".6" />
        <circle cx={G.node.at[0]} cy={G.node.at[1]} r={G.node.r} fill={fill} />
      </g>
      <path d={G.page} fill={fill} />
      <path d={G.lines} stroke={G.line.color} strokeOpacity={G.line.opacity} strokeWidth={G.line.width} strokeLinecap="round" />
      {animated ? (
        <g clipPath={`url(#${id.page})`}>
          <path className="ymm-scan" d={G.scan.d} stroke={G.scan.color} strokeOpacity={G.scan.opacity} strokeWidth={G.scan.width} strokeLinecap="round" />
        </g>
      ) : null}
      <path d={G.handle} stroke={fill} strokeWidth={G.handleWidth} strokeLinecap="round" />
      <g className={animated ? "ymm-lens" : undefined}>
        <circle cx={G.lens.cx} cy={G.lens.cy} r={G.lens.r} stroke={fill} strokeWidth={G.lens.width} fill={`url(#${id.core})`} />
        <circle cx={G.lens.glint.cx} cy={G.lens.glint.cy} r={G.lens.glint.r} fill={G.highlight} />
      </g>
    </svg>
  );
}
