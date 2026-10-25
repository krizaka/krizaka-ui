import * as React from "react";
import { Animated, StyleSheet, View, type ViewProps } from "react-native";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";

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

export type ProfileBannerProps = Omit<ViewProps, "children"> & {
  /** The cover: an `Image` (decorative). Absent: a tint of the brand's accent. */
  banner?: React.ReactNode;
  /** The avatar overlapping the cover (`Avatar` with the family's default). */
  avatar: React.ReactNode;
  /** A line above the name: what it is (« Client »). */
  eyebrow?: string;
  /** The name: the screen's heading. */
  title: string;
  /** Beside the name: a `Badge`. */
  status?: React.ReactNode;
  /** Under the name: its facts. */
  meta?: string;
  /** The actions, under the name. */
  actions?: React.ReactNode;
};

/**
 * The top of a person's or a place's screen — the web's `ProfileBanner`: a slim cover, the avatar overlapping its lower
 * edge, then the name (the screen's heading), its facts and the actions. No text on the cover.
 */
export function ProfileBanner({ banner, avatar, eyebrow, title, status, meta, actions, style, ...props }: ProfileBannerProps) {
  const { theme, radius } = useTheme();
  const id = `kz-banner-${React.useId().replace(/:/g, "")}`;
  return (
    <View style={[bannerStyles.root, style]} {...props}>
      <View aria-hidden style={[bannerStyles.cover, { borderRadius: radius.lg, backgroundColor: theme.accentSoft }]}>
        {banner ?? (
          <Svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100">
            <Defs>
              <LinearGradient id={id} x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor={theme.accent} stopOpacity={0.3} />
                <Stop offset="0.5" stopColor={theme.accentSoft} />
                <Stop offset="1" stopColor={theme.surface2} />
              </LinearGradient>
            </Defs>
            <Rect x="0" y="0" width="100" height="100" fill={`url(#${id})`} />
          </Svg>
        )}
      </View>
      <View style={[bannerStyles.avatar, { borderColor: theme.surface0, backgroundColor: theme.surface3, borderRadius: radius.lg }]}>{avatar}</View>
      <View style={bannerStyles.text}>
        {eyebrow ? (
          <Txt variant="mono" tone="accent">
            {eyebrow}
          </Txt>
        ) : null}
        <View style={bannerStyles.titleRow}>
          <Txt variant="title" role="heading" style={bannerStyles.title}>
            {title}
          </Txt>
          {status}
        </View>
        {meta ? <Txt tone="secondary">{meta}</Txt> : null}
      </View>
      {actions ? <View style={bannerStyles.actions}>{actions}</View> : null}
    </View>
  );
}

const bannerStyles = StyleSheet.create({
  root: { gap: 10 },
  cover: { height: 112, width: "100%", overflow: "hidden" },
  avatar: { width: 80, height: 80, marginTop: -50, marginLeft: 4, borderWidth: 4, overflow: "hidden", alignItems: "center", justifyContent: "center" },
  text: { gap: 2, paddingHorizontal: 4 },
  titleRow: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 8 },
  title: { flexShrink: 1 },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: 8, paddingHorizontal: 4 },
});
