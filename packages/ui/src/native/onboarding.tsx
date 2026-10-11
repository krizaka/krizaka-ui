import * as React from "react";
import { type NativeScrollEvent, type NativeSyntheticEvent, ScrollView, type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";

import { Button } from "./button";
import { useTheme } from "./theme";
import { Txt } from "./txt";

export type OnboardingSlide = {
  /** The picture: a `Mascot`, an illustration, a product mark (decorative). */
  visual?: React.ReactNode;
  /** The promise, in a few words — passed translated. */
  title: string;
  /** One or two sentences. */
  description: string;
};

export type OnboardingProps = {
  /** The slides, three or four. */
  slides: readonly OnboardingSlide[];
  /** The words of the buttons — passed translated. */
  labels: {
    /** To the next slide (“Next”). */
    next: string;
    /** On the last slide (“Get started”). */
    done: string;
    /** Skips to the end (“Skip”). */
    skip: string;
    /** The position, for screen readers: `(n, total) => "Step 2 of 3"`. */
    position: (n: number, total: number) => string;
  };
  /** Called by “Get started” and “Skip”: remember it and leave. */
  onDone: () => void;
  /** Styles merged last. */
  style?: StyleProp<ViewStyle>;
};

/**
 * A first launch in a few slides: swipe or tap Next, Skip at any time, dots that say where you are, the safe areas
 * kept. Each slide is announced with its position; the buttons do everything a swipe does.
 */
export function Onboarding({ slides, labels, onDone, style }: OnboardingProps) {
  const { theme, insets, haptics } = useTheme();
  const [width, setWidth] = React.useState(0);
  const [page, setPage] = React.useState(0);
  const scroller = React.useRef<ScrollView>(null);
  const last = page === slides.length - 1;
  const go = (to: number) => {
    scroller.current?.scrollTo({ x: to * width, animated: true });
    setPage(to);
    haptics.selection();
  };
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (width > 0) setPage(Math.round(e.nativeEvent.contentOffset.x / width));
  };
  return (
    <View style={[styles.root, { backgroundColor: theme.surface0, paddingTop: insets.top + 8, paddingBottom: insets.bottom + 16 }, style]} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      <View style={styles.top}>
        {!last ? <Button label={labels.skip} variant="ghost" size="sm" onPress={onDone} /> : <View style={styles.spacer} />}
      </View>
      <ScrollView ref={scroller} tabIndex={0} horizontal pagingEnabled showsHorizontalScrollIndicator={false} onMomentumScrollEnd={onScroll} style={styles.flex}>
        {slides.map((slide, i) => (
          <View key={i} style={[styles.slide, { width: width || undefined }]} accessible aria-label={`${labels.position(i + 1, slides.length)}. ${slide.title}. ${slide.description}`} aria-hidden={i !== page}>
            {slide.visual ? <View style={styles.visual}>{slide.visual}</View> : null}
            <Txt variant="display" style={styles.centred}>
              {slide.title}
            </Txt>
            <Txt tone="secondary" style={[styles.centred, styles.description]}>
              {slide.description}
            </Txt>
          </View>
        ))}
      </ScrollView>
      <View style={styles.dots} aria-hidden>
        {slides.map((_, i) => (
          <View key={i} style={[styles.dot, { width: i === page ? 22 : 8, backgroundColor: i === page ? theme.accent : theme.borderStrong }]} />
        ))}
      </View>
      <View style={styles.bottom}>
        <Button label={last ? labels.done : labels.next} variant={last ? "gradient" : "primary"} size="lg" onPress={() => (last ? onDone() : go(page + 1))} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  top: { flexDirection: "row", justifyContent: "flex-end", paddingHorizontal: 16, minHeight: 32 },
  spacer: { height: 32 },
  flex: { flex: 1 },
  slide: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32, gap: 12 },
  visual: { marginBottom: 12 },
  centred: { textAlign: "center" },
  description: { maxWidth: 340 },
  dots: { flexDirection: "row", justifyContent: "center", gap: 6, marginVertical: 16 },
  dot: { height: 8, borderRadius: 4 },
  bottom: { paddingHorizontal: 24 },
});
