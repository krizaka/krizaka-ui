import { MarkFrame, MarkOrbit, MarkRing } from "./frame";
import { familyMotion, type MarkProps, useIds } from "./shared";
import { VERIKORA as G } from "./verikora-geometry";

const CSS = familyMotion("ymm", { ...G.motion, ...G.pulse });

/**
 * The Verikora mark, "the watch": the owl — two lenses at the family stroke under one calm brow, its pupils glancing
 * down the line it reads — in the Verikora gradient (ink → indigo, the same in dark and light). The pupils are the lit
 * cores and breathe; one node, a page, rides the dashed orbit. Below 48 px it crops to the emblem.
 */
export function VerikoraLogo({ size = 32, animated = true, title, className }: Readonly<MarkProps>) {
  const id = useIds("ymm", ["gradient", "glow"] as const);
  const fill = `url(#${id.gradient})`;
  const m = (cls: string) => (animated ? `ymm-${cls}` : undefined);
  return (
    <MarkFrame size={size} title={title} className={className} geometry={G} css={CSS} glowId={id.glow} gradient={{ id: id.gradient, ...G.gradient }}>
      <MarkRing geometry={G} />
      <g className={m("orbit")}>
        <MarkOrbit geometry={G} />
        <circle cx={G.node.at[0]} cy={G.node.at[1]} r={G.node.r} fill={fill} />
      </g>
      <path d={G.brow} stroke={fill} strokeWidth={G.stroke} strokeLinecap="round" strokeLinejoin="round" />
      {G.lenses.map((l) => (
        <circle key={l.cx} cx={l.cx} cy={l.cy} r={l.r} stroke={fill} strokeWidth={G.stroke} />
      ))}
      <g className={m("core")}>
        {G.pupils.map((p) => (
          <g key={p.cx}>
            <circle cx={p.cx} cy={p.cy} r={p.r} fill={fill} />
            <circle cx={p.cx} cy={p.cy} r={p.inner} fill={G.highlight} />
          </g>
        ))}
      </g>
    </MarkFrame>
  );
}
