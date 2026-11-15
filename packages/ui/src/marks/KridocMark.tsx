import { MarkFrame, MarkOrbit, MarkRing } from "./frame";
import { KRIDOC as G } from "./kridoc-geometry";
import { familyMotion, type MarkProps, useIds } from "./shared";

const CSS = familyMotion("kdm", { ...G.motion, ...G.pulse });

/**
 * The Kridoc mark (the managed storage, sold as « Kridoc by Krizaka»), mark C: a crane in the sapphire gradient, a lit
 * eye that breathes, one node on the dashed orbit. Drawn by `ProductLogo id="kridoc"`; below 48 px it crops to the emblem.
 */
export function KridocMark({ size = 32, animated = true, title, className }: Readonly<MarkProps>) {
  const id = useIds("kdm", ["gradient", "glow"] as const);
  const fill = `url(#${id.gradient})`;
  const m = (cls: string) => (animated ? `kdm-${cls}` : undefined);
  const solid = { strokeWidth: G.edge, strokeLinejoin: "round" } as const;
  return (
    <MarkFrame size={size} title={title} className={className} geometry={G} css={CSS} glowId={id.glow} gradient={{ id: id.gradient, ...G.gradient }}>
      <MarkRing geometry={G} />
      <g className={m("orbit")}>
        <MarkOrbit geometry={G} />
        <circle cx={G.node.at[0]} cy={G.node.at[1]} r={G.node.r} fill={fill} />
      </g>
      <path d={G.neck} stroke={fill} strokeWidth={G.stroke} strokeLinecap="round" strokeLinejoin="round" />
      <path d={G.beak} fill={fill} stroke={fill} {...solid} />
      <path d={G.wingUp} fill={fill} stroke={fill} {...solid} />
      <path d={G.wingDown} fill={fill} stroke={fill} {...solid} />
      <path d={G.wingDown} fill="#000" stroke="#000" opacity={G.shade} {...solid} />
      <g className={m("core")}>
        <circle cx={G.core.cx} cy={G.core.cy} r={G.core.r} fill={fill} />
        <circle cx={G.core.cx} cy={G.core.cy} r={G.core.inner} fill={G.highlight} />
      </g>
    </MarkFrame>
  );
}
