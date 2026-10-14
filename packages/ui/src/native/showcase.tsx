import * as React from "react";
import { Animated, AppState, Easing, FlatList, type LayoutChangeEvent, Pressable, type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";

import { useReducedMotion, useTheme } from "./theme";
import { Txt } from "./txt";

export type ShowcaseLabels = {
  /** The previous button's name. */
  previous: string;
  /** The next button's name. */
  next: string;
  /** The pause button's name while it plays. */
  pause: string;
  /** The same button's name while it is paused. */
  play: string;
  /** A progress segment's name: `(3, 17) => "Go to image 3"`. */
  goTo: (n: number, total: number) => string;
  /** The position in words: `(1, 17) => "Image 1 of 17"`. */
  counter: (n: number, total: number) => string;
  /** The slide's accessible name: `(1, 17) => "1 of 17"`. */
  slide: (n: number, total: number) => string;
};

export const showcaseLabels: ShowcaseLabels = {
  previous: "Previous slide",
  next: "Next slide",
  pause: "Pause the slideshow",
  play: "Play the slideshow",
  goTo: (n) => `Go to slide ${n}`,
  counter: (n, total) => `Slide ${n} of ${total}`,
  slide: (n, total) => `${n} of ${total}`,
};

export type ShowcaseProps<T> = {
  /** The slideshow's accessible name, translated. */
  label: string;
  /** The slides. */
  items: readonly T[];
  /** A stable key for an item. */
  getId: (item: T) => string;
  /** One slide's content (it fills the width). */
  renderItem: (item: T, state: { index: number; active: boolean }) => React.ReactNode;
  /** A slide's title, shown before the counter. */
  getTitle?: (item: T) => string;
  /** Milliseconds a slide stays. @default 6000 */
  interval?: number;
  /** Advances by itself — never with Reduce Motion on. @default true */
  autoplay?: boolean;
  /** After the last slide, back to the first. @default true */
  loop?: boolean;
  /** Called when the slide changes; `user` is true when the person asked for it. */
  onIndexChange?: (index: number, user: boolean) => void;
  /** The words of the controls, translated. */
  labels?: ShowcaseLabels;
  /** Styles merged on the root. */
  style?: StyleProp<ViewStyle>;
};

/** An auto-advancing slideshow: swipeable pages, a segmented progress bar that fills over the interval (each segment a button), a counter, previous / next and a pause button. */
export function Showcase<T>({ label, items, getId, renderItem, getTitle, interval = 6000, autoplay = true, loop = true, onIndexChange, labels = showcaseLabels, style }: ShowcaseProps<T>) {
  const { theme } = useTheme();
  const reduced = useReducedMotion();
  const total = items.length;
  const [current, setCurrent] = React.useState(0);
  const [width, setWidth] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const [dragging, setDragging] = React.useState(false);
  const [background, setBackground] = React.useState(false);
  const [announce, setAnnounce] = React.useState(false);
  const list = React.useRef<FlatList<T>>(null);
  const [fill] = React.useState(() => new Animated.Value(0));
  const progress = React.useRef(0);

  React.useEffect(() => {
    const id = fill.addListener(({ value }) => {
      progress.current = value;
    });
    const subscription = AppState.addEventListener("change", (state) => setBackground(state !== "active"));
    return () => {
      fill.removeListener(id);
      subscription.remove();
    };
  }, [fill]);

  const go = (to: number, user: boolean) => {
    if (total === 0) return;
    const next = loop ? (to + total) % total : Math.min(Math.max(to, 0), total - 1);
    if (next === current) return;
    setAnnounce(user);
    setCurrent(next);
    list.current?.scrollToOffset({ offset: next * width, animated: !reduced });
    onIndexChange?.(next, user);
  };

  const playing = autoplay && !reduced && total > 1;
  const running = playing && !paused && !dragging && !background && !(!loop && current === total - 1);

  React.useEffect(() => {
    fill.setValue(0);
    progress.current = 0;
  }, [current, fill]);

  React.useEffect(() => {
    if (!running) return;
    const animation = Animated.timing(fill, { toValue: 1, duration: Math.max(1, interval * (1 - progress.current)), easing: Easing.linear, useNativeDriver: false });
    animation.start(({ finished }) => {
      if (finished) go(current + 1, false);
    });
    return () => animation.stop();
    // `go` closes over the current slide: the effect restarts with it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, current, interval]);

  const item = items[current];
  const title = item !== undefined ? getTitle?.(item) : undefined;
  const control = [styles.control, { borderColor: theme.borderDefault, backgroundColor: theme.surface1 }];
  const icon = (d: string) => (
    <Svg width={16} height={16} viewBox="0 0 24 24" aria-hidden>
      <Path d={d} stroke={theme.textSecondary} strokeWidth={2.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );

  return (
    <View role="group" aria-label={label} style={[styles.root, style]}>
      <View aria-live={announce ? "polite" : "off"} onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)}>
        <FlatList
          ref={list}
          horizontal
          pagingEnabled
          focusable
          showsHorizontalScrollIndicator={false}
          data={items as T[]}
          keyExtractor={getId}
          getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
          onScrollBeginDrag={() => setDragging(true)}
          onScrollEndDrag={() => setDragging(false)}
          onMomentumScrollEnd={(e) => {
            const next = Math.round(e.nativeEvent.contentOffset.x / Math.max(width, 1));
            if (next !== current && next >= 0 && next < total) {
              setAnnounce(true);
              setCurrent(next);
              onIndexChange?.(next, true);
            }
          }}
          renderItem={({ item: slide, index }) => (
            <View role="group" aria-label={labels.slide(index + 1, total)} style={{ width }}>
              {Math.abs(index - current) <= 1 ? renderItem(slide, { index, active: index === current }) : null}
            </View>
          )}
        />
      </View>
      <View style={styles.segments}>
        {items.map((slide, i) => (
          <Pressable key={getId(slide)} role="button" aria-label={labels.goTo(i + 1, total)} aria-current={i === current ? true : undefined} onPress={() => go(i, true)} style={styles.segment}>
            <View style={[styles.track, { backgroundColor: theme.surface3 }]}>
              {i < current || (i === current && !playing) ? <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.accent }]} /> : null}
              {i === current && playing ? <Animated.View style={[styles.fill, { backgroundColor: theme.accent, width: fill.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] }) }]} /> : null}
            </View>
          </Pressable>
        ))}
      </View>
      <View style={styles.bar}>
        <Txt variant="caption" tone="secondary" numberOfLines={1} style={styles.counter}>
          {title ? `${title} · ` : ""}
          {labels.counter(current + 1, total)}
        </Txt>
        <Pressable role="button" aria-label={labels.previous} disabled={!loop && current === 0} hitSlop={6} onPress={() => go(current - 1, true)} style={control}>
          {icon("M15 5l-7 7 7 7")}
        </Pressable>
        {playing ? (
          <Pressable role="button" aria-label={paused ? labels.play : labels.pause} hitSlop={6} onPress={() => setPaused(!paused)} style={control}>
            {icon(paused ? "M8 5.5v13l10-6.5Z" : "M8 5v14M16 5v14")}
          </Pressable>
        ) : null}
        <Pressable role="button" aria-label={labels.next} disabled={!loop && current === total - 1} hitSlop={6} onPress={() => go(current + 1, true)} style={control}>
          {icon("M9 5l7 7-7 7")}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: 8 },
  segments: { flexDirection: "row", gap: 4 },
  segment: { flex: 1, height: 24, justifyContent: "center" },
  track: { height: 4, borderRadius: 2, overflow: "hidden" },
  fill: { position: "absolute", left: 0, top: 0, bottom: 0 },
  bar: { flexDirection: "row", alignItems: "center", gap: 8 },
  counter: { flex: 1 },
  control: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, alignItems: "center", justifyContent: "center" },
});
