import { Circle, Path } from "react-native-svg";

import { SOVKORA as G } from "../marks/sovkora-geometry";
import { NativeMarkFrame, NativeOrbit, NativeRing } from "./mark-frame";
import type { NativeMarkProps } from "./mark-motion";

/**
 * The Sovkora mark for React Native — the geometry of the web mark (marks/sovkora-geometry.ts): the three shards turn
 * slowly around the core, which breathes; still when the system reduces motion.
 */
export function SovkoraMark(props: Readonly<NativeMarkProps>) {
  return (
    <NativeMarkFrame
      {...props}
      geometry={G}
      prefix="ozm"
      gradient={G.gradient}
      draw={({ fill, stroke }) => ({
        still: (
          <>
            <NativeOrbit geometry={G} stroke={stroke} />
            <NativeRing geometry={G} stroke={stroke} />
          </>
        ),
        spin: G.shards.map((d) => <Path key={d} d={d} fill={fill} stroke={fill} strokeWidth={G.shardStroke} strokeLinejoin="round" />),
        pulse: (
          <>
            <Circle cx={G.center} cy={G.center} r={G.core.r} fill={fill} />
            <Circle cx={G.center} cy={G.center} r={G.core.inner} fill={G.highlight} />
          </>
        ),
      })}
    />
  );
}
