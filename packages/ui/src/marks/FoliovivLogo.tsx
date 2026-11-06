import { FOLIOVIV as G } from "./folioviv-geometry";
import { MarkFrame, MarkOrbit, MarkRing } from "./frame";
import { familyMotion, type MarkProps, useIds } from "./shared";

const CSS = familyMotion("akm", { ...G.motion, ...G.pulse });

/**
 * The Folioviv mark, "the cut log": a log seen end-on in forest green, its year rings in light, cut at 45° by the beaver
 * (the Krizaka chamfer) with the fresh face in copper, and a copper heart that breathes — a shop built ring by ring.
 * One node, a coin, rides the dashed orbit. Below 48 px it crops to the emblem.
 */
export function FoliovivLogo({ size = 32, animated = true, title, className }: Readonly<MarkProps>) {
  const id = useIds("akm", ["glow"] as const);
  const m = (cls: string) => (animated ? `akm-${cls}` : undefined);
  return (
    <MarkFrame size={size} title={title} className={className} geometry={G} css={CSS} glowId={id.glow}>
      <MarkRing geometry={G} />
      <g className={m("orbit")}>
        <MarkOrbit geometry={G} />
        <circle cx={G.node.at[0]} cy={G.node.at[1]} r={G.node.r} fill={G.copper} />
      </g>
      <path d={G.log} fill={G.forest} />
      <path d={G.cut} fill={G.copper} />
      {G.rings.r.map((r) => (
        <circle key={r} cx={G.rings.cx} cy={G.rings.cy} r={r} stroke={G.highlight} strokeOpacity={G.rings.opacity} strokeWidth={G.rings.width} />
      ))}
      <g className={m("core")}>
        <circle cx={G.heart.cx} cy={G.heart.cy} r={G.heart.r} fill={G.copper} />
        <circle cx={G.heart.cx} cy={G.heart.cy} r={G.heart.inner} fill={G.highlight} />
      </g>
    </MarkFrame>
  );
}
