import { MarkFrame, MarkOrbit, MarkRing } from "../frame";
import { type MarkProps, useIds } from "../shared";
import { SOVKORA } from "../sovkora-geometry";
import { SovkoraEmblem } from "../SovkoraLogo";

/** The 2.0 colours (amber, #b45309 → #f59e0b, hues 26 → 38), on today's geometry. Brand/Evolution only. */
const G = { ...SOVKORA, amber: { ...SOVKORA.gradient, stops: [["0%", "#b45309"], ["100%", "#f59e0b"]] as const }, highlight: "#fffbeb", glow: { color: "#f59e0b", opacity: 0.16 } };

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
 * The Sovkora mark of 2.0.0-beta.5 → 2.0.x: the family's grammar in amber (#b45309 → #f59e0b). Replaced in 2.1.0 by the
 * brand's orange (hue 26): its light stop was the hue of --kz-warning and read at 2:1 on a light page.
 */
export function SovkoraLogoV2({ size = 32, animated = true, title, className }: Readonly<MarkProps>) {
  const id = useIds("ozv2", ["amber", "glow"] as const);
  return (
    <MarkFrame size={size} title={title} className={className} geometry={G} css={CSS} glowId={id.glow} gradient={{ id: id.amber, ...G.amber }}>
      <MarkOrbit geometry={G} />
      <MarkRing geometry={G} />
      <SovkoraEmblem fill={`url(#${id.amber})`} highlight={G.highlight} orbit={animated ? "ozv2-orbit" : undefined} core={animated ? "ozv2-core" : undefined} />
    </MarkFrame>
  );
}
