import { MarkFrame, MarkOrbit, MarkRing } from "./frame";
import { type MarkProps, useIds, withAlpha } from "./shared";
import { SOVKORA as G } from "./sovkora-geometry";

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

/** The emblem of the Sovkora marks (today's and the 2.0 one): the three shards that orbit, and the core that breathes. */
export function SovkoraEmblem({ fill, highlight, orbit, core }: Readonly<{ fill: string; highlight: string; orbit?: string; core?: string }>) {
  return (
    <>
      <g className={orbit}>
        {G.shards.map((d) => (
          <path key={d} d={d} fill={fill} stroke={fill} strokeWidth={G.shardStroke} strokeLinejoin="round" />
        ))}
      </g>
      <g className={core}>
        <circle cx={G.center} cy={G.center} r={G.core.r} fill={fill} />
        <circle cx={G.center} cy={G.center} r={G.core.inner} fill={highlight} />
      </g>
    </>
  );
}

/**
 * The Sovkora mark: three solid hexagonal shards in the Sovkora orange (the brand's mark
 * gradient of @krizaka/tokens, deep orange → orange, hue 26 — the same in dark and light) orbiting slowly around a core that breathes —
 * the family's grammar (dashed orbit, ring, bold emblem, bright core). Below 48 px it crops to the emblem.
 */
export function SovkoraLogo({ size = 32, animated = true, title, className }: Readonly<MarkProps>) {
  const id = useIds("ozm", ["gradient", "glow"] as const);
  return (
    <MarkFrame size={size} title={title} className={className} geometry={G} css={CSS} glowId={id.glow} gradient={{ id: id.gradient, ...G.gradient }}>
      <MarkOrbit geometry={G} />
      <MarkRing geometry={G} />
      <SovkoraEmblem fill={`url(#${id.gradient})`} highlight={G.highlight} orbit={animated ? "ozm-orbit" : undefined} core={animated ? "ozm-core" : undefined} />
    </MarkFrame>
  );
}
