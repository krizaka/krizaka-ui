import * as React from "react";
import { Animated, StyleSheet, View, type ViewProps } from "react-native";

import { useEntrance } from "./story-motion";
import { useTheme } from "./theme";
import { Txt } from "./txt";

export interface ProfileStat {
  /** What it measures (“Response rate”) — passed translated. */
  label: string;
  /** The value, between 0 and `max`. */
  value: number;
  /** The top of the range (default 100). */
  max?: number;
  /** The value in words (“92 %”); default: the percentage. */
  valueText?: string;
}

export type ProfileCardProps = Omit<ViewProps, "children"> & {
  /** The portrait: an `Avatar`, an image, a mark. Decorative — the name carries the meaning. */
  visual: React.ReactNode;
  /** The name (the card's heading). */
  name: string;
  /** The headline gauge's label (“Profile complete”); without it, no headline gauge. */
  statLabel?: string;
  /** The headline gauge's value, 0–100 (default 100). */
  value?: number;
  /** The headline value in words; default: the percentage. */
  valueText?: string;
  /** More gauges under the headline one, each with its value in words. */
  stats?: readonly ProfileStat[];
  /** One line under the gauges. */
  caption?: string;
  /** Under everything: actions (a `Button`), chips. */
  children?: React.ReactNode;
  /** The gauges fill once on mount; still when the system reduces motion. */
  animated?: boolean;
};

const ratioOf = (value: number, max = 100) => Math.min(1, Math.max(0, value / (max || 1)));

function Bar({ label, ratio, words, animated, delay }: { label: string; ratio: number; words: string; animated: boolean; delay: number }) {
  const { theme } = useTheme();
  const t = useEntrance(animated, delay, 900);
  const [width, setWidth] = React.useState(0);
  const translateX = t.interpolate({ inputRange: [0, 1], outputRange: [-width * ratio, 0] });
  return (
    <View
      accessible
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(ratio * 100)}
      aria-valuetext={words}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      style={[styles.track, { backgroundColor: theme.surface3 }]}
    >
      <Animated.View style={[styles.fill, { width: `${ratio * 100}%`, backgroundColor: theme.accent, transform: [{ translateX }] }]} />
    </View>
  );
}

/** A profile at a glance for React Native: portrait, name, a headline gauge, stats in words, a line, actions. */
export function ProfileCard({ visual, name, statLabel, value = 100, valueText, stats, caption, children, animated = true, style, ...props }: ProfileCardProps) {
  const { theme, radius } = useTheme();
  const ratio = ratioOf(value);
  return (
    <View {...props} style={[styles.root, { backgroundColor: theme.surface1, borderColor: theme.borderSubtle, borderRadius: radius.xl }, style]}>
      <View aria-hidden style={[styles.disc, { backgroundColor: theme.surface2, borderColor: theme.accentSoft }]}>
        {visual}
      </View>
      <View style={styles.head}>
        <Txt variant="title" style={styles.name}>
          {name}
        </Txt>
        {statLabel ? (
          <Txt variant="caption" tone="secondary">
            {statLabel} <Txt variant="caption">{valueText ?? `${Math.round(ratio * 100)} %`}</Txt>
          </Txt>
        ) : null}
      </View>
      {statLabel ? <Bar label={statLabel} ratio={ratio} words={valueText ?? `${Math.round(ratio * 100)} %`} animated={animated} delay={200} /> : null}
      {stats?.map((s, i) => {
        const r = ratioOf(s.value, s.max);
        const words = s.valueText ?? `${Math.round(r * 100)} %`;
        return (
          <View key={s.label} style={styles.stat}>
            <View aria-hidden style={styles.statHead}>
              <Txt variant="caption" tone="secondary">
                {s.label}
              </Txt>
              <Txt variant="caption">{words}</Txt>
            </View>
            <Bar label={s.label} ratio={r} words={words} animated={animated} delay={320 + i * 120} />
          </View>
        );
      })}
      {caption ? (
        <Txt variant="caption" tone="secondary" style={styles.caption}>
          {caption}
        </Txt>
      ) : null}
      {children ? <View style={styles.extra}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { alignItems: "center", gap: 12, padding: 20, borderWidth: StyleSheet.hairlineWidth },
  disc: { width: 104, height: 104, borderRadius: 52, borderWidth: 1, alignItems: "center", justifyContent: "center", overflow: "hidden" },
  head: { flexDirection: "row", alignSelf: "stretch", alignItems: "center", justifyContent: "space-between", gap: 8 },
  name: { flexShrink: 1, fontSize: 17 },
  track: { alignSelf: "stretch", height: 6, borderRadius: 3, overflow: "hidden" },
  fill: { height: "100%", borderRadius: 3 },
  stat: { alignSelf: "stretch", gap: 5 },
  statHead: { flexDirection: "row", justifyContent: "space-between", gap: 8 },
  caption: { textAlign: "center" },
  extra: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 8, alignSelf: "stretch" },
});
