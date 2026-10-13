import * as React from "react";
import { AccessibilityInfo, Animated, Image, Modal, PanResponder, Pressable, StyleSheet, useWindowDimensions,View  } from "react-native";

import { modalName } from "./overlay";
import { useReducedMotion, useTheme } from "./theme";
import { Txt } from "./txt";

export type ViewerImage = {
  /** The image's URI. */
  uri: string;
  /** What it shows — passed translated; its accessible name. */
  alt: string;
  /** A caption under it. */
  caption?: string;
};

export type ImageViewerProps = {
  /** The images, in order. */
  images: readonly ViewerImage[];
  /** The image open (its index); `null` closes the viewer. */
  index: number | null;
  /** Called when the person moves to another image or closes the viewer (`null`). */
  onIndexChange: (index: number | null) => void;
  /** The close button's words (“Close”) — passed translated. */
  closeLabel: string;
  /** The position for screen readers and the counter: `(n, total) => "2 of 5"`. */
  positionLabel?: (position: number, total: number) => string;
};

const MAX_SCALE = 4;

/**
 * Images full screen, on black: pinch to zoom (to 4×), double tap to zoom in and out, drag a zoomed image, swipe left
 * and right between images, swipe down to close. Screen readers get the image's words, its position, and the close
 * button; their swipes move between images (accessibility actions).
 */
export function ImageViewer({ images, index, onIndexChange, closeLabel, positionLabel = (n, total) => `${n} / ${total}` }: ImageViewerProps) {
  const { theme, insets, haptic } = useTheme();
  const reduce = useReducedMotion();
  const { width, height } = useWindowDimensions();
  const open = index !== null && images[index] !== undefined;
  const [scale] = React.useState(() => new Animated.Value(1));
  const [pan] = React.useState(() => new Animated.ValueXY({ x: 0, y: 0 }));
  const [dismiss] = React.useState(() => new Animated.Value(0));
  const state = React.useRef({ scale: 1, x: 0, y: 0, pinch: 0, base: 1, lastTap: 0 });
  const reset = React.useCallback(() => {
    state.current = { ...state.current, scale: 1, x: 0, y: 0 };
    scale.setValue(1);
    pan.setValue({ x: 0, y: 0 });
    dismiss.setValue(0);
  }, [scale, pan, dismiss]);
  React.useEffect(() => {
    reset();
    if (open) AccessibilityInfo.announceForAccessibility(`${images[index]!.alt}, ${positionLabel(index + 1, images.length)}`);
  }, [index]); // eslint-disable-line react-hooks/exhaustive-deps -- once per image
  const go = (to: number) => {
    if (to < 0 || to >= images.length) return;
    haptic("selection");
    onIndexChange(to);
  };
  const animateTo = (value: Animated.Value, to: number) => (reduce ? value.setValue(to) : Animated.spring(value, { toValue: to, useNativeDriver: true, damping: 20 }).start());
  const distance = (touches: readonly { pageX: number; pageY: number }[]) => Math.hypot(touches[0]!.pageX - touches[1]!.pageX, touches[0]!.pageY - touches[1]!.pageY);
  // PanResponder's handlers run on gestures, never during render: the compiler's ref and purity checks misread them.
  /* eslint-disable react-hooks/refs, react-hooks/purity */
  const responder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 4 || Math.abs(g.dy) > 4,
        onPanResponderGrant: (e) => {
          const now = Date.now();
          const s = state.current;
          if (e.nativeEvent.touches.length === 1 && now - s.lastTap < 280) {
            const next = s.scale > 1 ? 1 : 2.5;
            s.scale = next;
            s.x = 0;
            s.y = 0;
            animateTo(scale, next);
            pan.setValue({ x: 0, y: 0 });
          }
          s.lastTap = now;
          s.pinch = 0;
        },
        onPanResponderMove: (e, g) => {
          const s = state.current;
          const touches = e.nativeEvent.touches;
          if (touches.length === 2) {
            const d = distance(touches);
            if (!s.pinch) {
              s.pinch = d;
              s.base = s.scale;
            }
            s.scale = Math.min(MAX_SCALE, Math.max(1, s.base * (d / s.pinch)));
            scale.setValue(s.scale);
            return;
          }
          if (s.scale > 1) pan.setValue({ x: s.x + g.dx, y: s.y + g.dy });
          else if (Math.abs(g.dy) > Math.abs(g.dx)) dismiss.setValue(Math.max(0, g.dy));
          else pan.setValue({ x: g.dx, y: 0 });
        },
        onPanResponderRelease: (_, g) => {
          const s = state.current;
          if (s.pinch) {
            s.pinch = 0;
            if (s.scale <= 1.02) reset();
            return;
          }
          if (s.scale > 1) {
            s.x += g.dx;
            s.y += g.dy;
            return;
          }
          if (g.dy > 120 || g.vy > 1.2) return onIndexChange(null);
          if (g.dx < -width / 4 || g.vx < -0.8) go((index ?? 0) + 1);
          else if (g.dx > width / 4 || g.vx > 0.8) go((index ?? 0) - 1);
          animateTo(dismiss, 0);
          Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: true }).start();
        },
      }),
    [index, width, images.length], // eslint-disable-line react-hooks/exhaustive-deps -- the gesture reads refs
  );
  /* eslint-enable react-hooks/refs, react-hooks/purity */
  if (!open) return null;
  const image = images[index]!;
  const backdrop = dismiss.interpolate({ inputRange: [0, height / 2], outputRange: [1, 0.3], extrapolate: "clamp" });
  return (
    <Modal {...modalName(image.alt)} visible transparent animationType={reduce ? "none" : "fade"} onRequestClose={() => onIndexChange(null)} statusBarTranslucent>
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: theme.media, opacity: backdrop }]} />
      <View
        style={StyleSheet.absoluteFill}
        accessible
        role="img"
        aria-label={`${image.alt}, ${positionLabel(index + 1, images.length)}`}
        accessibilityActions={[{ name: "increment" }, { name: "decrement" }, { name: "escape" }]}
        onAccessibilityAction={(e) => {
          const name = e.nativeEvent.actionName;
          if (name === "increment") go(index + 1);
          if (name === "decrement") go(index - 1);
          if (name === "escape") onIndexChange(null);
        }}
        {...responder.panHandlers}
      >
        <Animated.View style={{ width, height, transform: [{ translateX: pan.x }, { translateY: Animated.add(pan.y, dismiss) }, { scale }] }}>
          <Image source={{ uri: image.uri }} resizeMode="contain" style={{ width, height }} accessibilityIgnoresInvertColors />
        </Animated.View>
      </View>
      <View pointerEvents="box-none" style={[styles.top, { paddingTop: insets.top + 8 }]}>
        <View aria-hidden style={[styles.counter, { backgroundColor: theme.scrimStrong }]}>
          <Txt variant="label" tone="onMedia">
            {positionLabel(index + 1, images.length)}
          </Txt>
        </View>
        <Pressable role="button" aria-label={closeLabel} hitSlop={12} onPress={() => onIndexChange(null)} style={[styles.close, { backgroundColor: theme.scrimStrong }]}>
          <Txt tone="onMedia" style={styles.cross} aria-hidden>
            ×
          </Txt>
        </Pressable>
      </View>
      {image.caption ? (
        <View pointerEvents="none" style={[styles.caption, { paddingBottom: insets.bottom + 16, backgroundColor: theme.scrimStrong }]}>
          <Txt tone="onMedia">{image.caption}</Txt>
        </View>
      ) : null}
    </Modal>
  );
}

/** Preloads the neighbours of the image open, so a swipe shows the next one at once. */
export function prefetchNeighbours(images: readonly ViewerImage[], index: number | null) {
  if (index === null) return;
  for (const i of [index - 1, index + 1]) if (images[i]) void Image.prefetch(images[i]!.uri).catch(() => undefined);
}

const styles = StyleSheet.create({
  top: { position: "absolute", top: 0, left: 0, right: 0, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16 },
  counter: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  close: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  cross: { fontSize: 24, lineHeight: 26 },
  caption: { position: "absolute", left: 0, right: 0, bottom: 0, paddingTop: 12, paddingHorizontal: 16 },
});
