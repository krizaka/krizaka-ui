import * as React from "react";
import { AccessibilityInfo, Animated, type NativeScrollEvent, type NativeSyntheticEvent, RefreshControl, type RefreshControlProps, StyleSheet, View } from "react-native";

import type { BrandId } from "../marks/ProductLogo";
import { ProductMark } from "./ProductMark";
import { useReducedMotion, useTheme } from "./theme";

export type PullToRefreshProps = Omit<RefreshControlProps, "colors" | "tintColor" | "progressBackgroundColor" | "titleColor" | "title"> & {
  /** The words of the pull (“Pull to refresh”) — passed translated; shown on iOS under the spinner. */
  label?: string;
};

/**
 * The platform's pull to refresh in the theme's accent: the `refreshControl` of a ScrollView or a FlatList. `List`
 * draws it already with `onRefresh`.
 */
export function PullToRefresh({ label, ...props }: PullToRefreshProps) {
  const { theme } = useTheme();
  return <RefreshControl {...props} tintColor={theme.accent} colors={[theme.accent]} progressBackgroundColor={theme.surface2} title={label} titleColor={theme.textSecondary} />;
}

/** What `BrandedRefresh` hands to the scrollable: spread it on a `ScrollView` / `FlatList` (`{...scroll}`). */
export type BrandedRefreshScrollProps = {
  refreshControl: React.ReactElement<RefreshControlProps>;
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  scrollEventThrottle: number;
};

export type BrandedRefreshProps = {
  /** The product whose mark is drawn as the person pulls and turns while it refreshes. */
  product: BrandId;
  /** Whether the data is refreshing: keep it true until the new data is there. */
  refreshing: boolean;
  /** Called when the person pulls past the threshold. */
  onRefresh: () => void;
  /** The words announced when the refresh starts (“Refreshing your videos”) — passed translated. */
  label: string;
  /** The scrollable, given the props to spread: `{(scroll) => <ScrollView {...scroll}>…</ScrollView>}`. */
  children: (scroll: BrandedRefreshScrollProps) => React.ReactElement;
  /** The pull (in points) at which the mark is complete. Default 72. */
  threshold?: number;
};

/** How far the mark has come: 0 at rest, 1 at the threshold (a pull, iOS) or while refreshing. */
export const pullProgress = (offset: number, threshold: number) => Math.min(1, Math.max(0, -offset / threshold));

/**
 * The product's mark as the pull-to-refresh: it grows and turns into place as the person pulls (iOS, where the content
 * overscrolls) and keeps its own motion while it refreshes (iOS and Android). The platform's control still does the
 * gesture, so the system announces it too; ours announces `label` when the refresh starts. Under reduced motion the mark
 * is still and appears without the growing.
 */
export function BrandedRefresh({ product, refreshing, onRefresh, label, children, threshold = 72 }: BrandedRefreshProps) {
  const { theme } = useTheme();
  const reduce = useReducedMotion();
  const [pull] = React.useState(() => new Animated.Value(0));
  React.useEffect(() => {
    if (refreshing) AccessibilityInfo.announceForAccessibility(label);
  }, [refreshing, label]);
  const onScroll = React.useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => pull.setValue(pullProgress(event.nativeEvent.contentOffset.y, threshold)),
    [pull, threshold],
  );
  const shown = refreshing ? 1 : pull;
  const scale = refreshing || reduce ? 1 : pull.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] });
  const rotate = refreshing || reduce ? "0deg" : pull.interpolate({ inputRange: [0, 1], outputRange: ["-90deg", "0deg"] });
  return (
    <View style={styles.root}>
      {children({
        // The platform's control does the gesture and the haptics, drawn transparent: the mark is ours.
        refreshControl: <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="transparent" colors={["transparent"]} progressBackgroundColor="transparent" />,
        onScroll,
        scrollEventThrottle: 16,
      })}
      <Animated.View pointerEvents="none" aria-hidden style={[styles.mark, { opacity: shown, transform: [{ scale }, { rotate }] }]}>
        <ProductMark id={product} size={32} animated={refreshing} neutral={theme.textMuted} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  mark: { position: "absolute", top: 12, left: 0, right: 0, alignItems: "center" },
});
