import React from "react";
import { Circle, Path } from "react-native-svg";

import { VERIKORA as G } from "../marks/verikora-geometry";
import { NativeMarkFrame, NativeOrbit, NativeRing } from "./mark-frame";
import type { NativeMarkProps } from "./mark-motion";

/**
 * The Verikora mark for React Native — the geometry of the web mark (marks/verikora-geometry.ts), "the watch": the owl's
 * two lenses under one calm brow. The orbit and its node turn, the pupils breathe; still when the system reduces motion.
 */
export function VerikoraMark(props: Readonly<NativeMarkProps>) {
  return (
    <NativeMarkFrame
      {...props}
      geometry={G}
      prefix="ymm"
      spinMs={G.motion.spin * 1000}
      gradient={G.gradient}
      gradientOnStill
      draw={({ fill, stroke }) => ({
        still: (
          <>
            <NativeRing geometry={G} stroke={stroke} />
            <Path d={G.brow} stroke={fill} strokeWidth={G.stroke} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {G.lenses.map((l) => (
              <Circle key={l.cx} cx={l.cx} cy={l.cy} r={l.r} stroke={fill} strokeWidth={G.stroke} fill="none" />
            ))}
          </>
        ),
        spin: (
          <>
            <NativeOrbit geometry={G} stroke={stroke} />
            <Circle cx={G.node.at[0]} cy={G.node.at[1]} r={G.node.r} fill={fill} />
          </>
        ),
        pulse: G.pupils.map((p) => (
          <React.Fragment key={p.cx}>
            <Circle cx={p.cx} cy={p.cy} r={p.r} fill={fill} />
            <Circle cx={p.cx} cy={p.cy} r={p.inner} fill={G.highlight} />
          </React.Fragment>
        )),
      })}
    />
  );
}
