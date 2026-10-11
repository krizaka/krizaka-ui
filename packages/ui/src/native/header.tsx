import * as React from "react";
import { Animated, type NativeScrollEvent, type NativeSyntheticEvent, Pressable, type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";

import { useReducedMotion, useTheme } from "./theme";
import { Txt } from "./txt";

export type HeaderProps = {
  /** The screen's title — a heading, shown large under the bar until the content scrolls under it. */
  title: string;
  /** A line under the large title (a count, a date). */
  subtitle?: string;
  /** The scroll position of the screen's list (`useCollapsingHeader().scrollY`): the large title folds into the bar. Absent: always large. */
  scrollY?: Animated.Value;
  /** `large` (default: the top of a section) or `inline` (a detail screen: the title in the bar only). */
  size?: "large" | "inline";
  /** The back button's words (“Back”) — passed translated; with `onBack` it shows. */
  backLabel?: string;
  /** Called by the back button. */
  onBack?: () => void;
  /** Buttons at the right of the bar (`IconButton`s). */
  actions?: React.ReactNode;
  /** Under the title: a `SearchField`, `Tabs`. */
  children?: React.ReactNode;
  /** Styles merged last. */
  style?: StyleProp<ViewStyle>;
};

const BAR = 44;
const LARGE = 52;

/**
 * A screen's header: the bar (back, title, actions) under the status bar's safe area, and a large title that folds into
 * the bar as the content scrolls — the iOS idiom, readable on Android. Feed it the list's scroll with
 * `useCollapsingHeader()`. The title is the screen's heading for screen readers either way.
 */
export function Header({ title, subtitle, scrollY, size = "large", backLabel, onBack, actions, children, style }: HeaderProps) {
  const { theme, insets } = useTheme();
  const reduce = useReducedMotion();
  const large = size === "large";
  const fixed = React.useMemo(() => new Animated.Value(large ? 0 : 1), [large]);
  const progress = scrollY && large ? scrollY.interpolate({ inputRange: [0, LARGE], outputRange: [0, 1], extrapolate: "clamp" }) : fixed;
  const smallOpacity = progress.interpolate({ inputRange: [0.6, 1], outputRange: [0, 1], extrapolate: "clamp" });
  const largeOpacity = progress.interpolate({ inputRange: [0, 0.7], outputRange: [1, 0], extrapolate: "clamp" });
  const largeShift = reduce ? 0 : progress.interpolate({ inputRange: [0, 1], outputRange: [0, -10] });
  const largeHeight = progress.interpolate({ inputRange: [0, 1], outputRange: [LARGE + (subtitle ? 18 : 0), 0] });
  return (
    <View style={[{ paddingTop: insets.top, backgroundColor: theme.surface0 }, style]}>
      <View style={styles.bar}>
        <View style={styles.side}>
          {onBack && backLabel ? (
            <Pressable role="button" aria-label={backLabel} onPress={onBack} hitSlop={8} style={styles.back}>
              <Svg width={22} height={22} viewBox="0 0 24 24" aria-hidden>
                <Path d="M15 5l-7 7 7 7" stroke={theme.accentText} strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
              <Txt variant="label" tone="accent" numberOfLines={1}>
                {backLabel}
              </Txt>
            </Pressable>
          ) : null}
        </View>
        <Animated.View style={[styles.middle, { opacity: smallOpacity }]} aria-hidden={large}>
          <Txt variant="label" numberOfLines={1} role={large ? undefined : "heading"}>
            {title}
          </Txt>
        </Animated.View>
        <View style={[styles.side, styles.right]}>{actions}</View>
      </View>
      {large ? (
        <Animated.View style={{ height: largeHeight, overflow: "hidden" }}>
          <Animated.View style={[styles.large, { opacity: largeOpacity, transform: [{ translateY: largeShift }] }]}>
            <Txt variant="display" numberOfLines={1} role="heading" style={styles.largeTitle}>
              {title}
            </Txt>
            {subtitle ? (
              <Txt variant="caption" tone="secondary">
                {subtitle}
              </Txt>
            ) : null}
          </Animated.View>
        </Animated.View>
      ) : null}
      {children ? <View style={styles.children}>{children}</View> : null}
      <Animated.View aria-hidden style={[styles.rule, { backgroundColor: theme.borderSubtle, opacity: smallOpacity }]} />
    </View>
  );
}

/** The scroll position a `Header` folds with: `<ScrollView onScroll={onScroll} scrollEventThrottle={16}>` and `<Header scrollY={scrollY}>`. */
export function useCollapsingHeader(): { scrollY: Animated.Value; onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void } {
  const [scrollY] = React.useState(() => new Animated.Value(0));
  const onScroll = React.useMemo(() => Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false }), [scrollY]);
  return { scrollY, onScroll };
}

const styles = StyleSheet.create({
  bar: { height: BAR, flexDirection: "row", alignItems: "center", paddingHorizontal: 8 },
  side: { flex: 1, flexDirection: "row", alignItems: "center" },
  right: { justifyContent: "flex-end", gap: 4 },
  middle: { flex: 2, alignItems: "center" },
  back: { flexDirection: "row", alignItems: "center", gap: 2, minHeight: 44, paddingRight: 8 },
  large: { paddingHorizontal: 16, paddingBottom: 6 },
  largeTitle: { fontSize: 32, lineHeight: 40 },
  children: { paddingHorizontal: 16, paddingBottom: 8 },
  rule: { height: StyleSheet.hairlineWidth },
});
