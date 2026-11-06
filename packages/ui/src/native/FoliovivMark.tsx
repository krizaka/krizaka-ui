import { Circle, Path } from "react-native-svg";

import { FOLIOVIV as G } from "../marks/folioviv-geometry";
import { NativeMarkFrame, NativeOrbit, NativeRing } from "./mark-frame";
import type { NativeMarkProps } from "./mark-motion";

/**
 * The Folioviv mark for React Native — the geometry of the web mark (marks/folioviv-geometry.ts), "the cut log": a log
 * end-on, its rings in light, cut at 45° with a copper face, a copper heart. The orbit and the coin turn, the heart
 * breathes; still when the system reduces motion.
 */
export function FoliovivMark(props: Readonly<NativeMarkProps>) {
  return (
    <NativeMarkFrame
      {...props}
      geometry={G}
      prefix="akm"
      spinMs={G.motion.spin * 1000}
      draw={({ stroke }) => ({
        still: (
          <>
            <NativeRing geometry={G} stroke={stroke} />
            <Path d={G.log} fill={G.forest} />
            <Path d={G.cut} fill={G.copper} />
            {G.rings.r.map((r) => (
              <Circle key={r} cx={G.rings.cx} cy={G.rings.cy} r={r} stroke={G.highlight} strokeOpacity={G.rings.opacity} strokeWidth={G.rings.width} fill="none" />
            ))}
          </>
        ),
        spin: (
          <>
            <NativeOrbit geometry={G} stroke={stroke} />
            <Circle cx={G.node.at[0]} cy={G.node.at[1]} r={G.node.r} fill={G.copper} />
          </>
        ),
        pulse: (
          <>
            <Circle cx={G.heart.cx} cy={G.heart.cy} r={G.heart.r} fill={G.copper} />
            <Circle cx={G.heart.cx} cy={G.heart.cy} r={G.heart.inner} fill={G.highlight} />
          </>
        ),
      })}
    />
  );
}
