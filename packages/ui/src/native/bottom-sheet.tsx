import * as React from "react";
import { AccessibilityInfo, Animated, KeyboardAvoidingView, Modal, PanResponder, Platform, Pressable, ScrollView, type StyleProp, StyleSheet, useWindowDimensions,View, type ViewStyle  } from "react-native";

import { CloseButton, type Controlled, useOpen } from "./dialog";
import { useReducedMotion, useTheme } from "./theme";
import { Txt } from "./txt";

export type BottomSheetProps = Controlled & {
  /** What the sheet is about — its accessible name, shown unless `hideTitle`. */
  title: string;
  /** Visually hide the title (it stays the accessible name). */
  hideTitle?: boolean;
  /** The heights it rests at, as shares of the screen (`[0.45, 0.9]`), lowest first. Default `[0.5]`. */
  snapPoints?: readonly number[];
  /** The index of `snapPoints` it opens at. Default 0. */
  initialSnap?: number;
  /** The content; it scrolls when taller than the sheet. */
  children?: React.ReactNode;
  /** A footer pinned at the bottom (a main action), above the keyboard and the safe area. */
  footer?: React.ReactNode;
  /** The close button's name — passed translated; absent: drag down, the scrim and the back button close it. */
  closeLabel?: string;
  /** Styles merged last, on the sheet. */
  style?: StyleProp<ViewStyle>;
};

/**
 * A sheet from the bottom edge that rests at snap points: drag its handle up or down (the speed of the flick counts),
 * down past the lowest one closes it; it rises with the keyboard, keeps clear of the safe area, and a light tick marks
 * each snap. Under reduced motion it appears without sliding.
 */
export function BottomSheet({ title, hideTitle, snapPoints = [0.5], initialSnap = 0, children, footer, closeLabel, style, ...controlled }: BottomSheetProps) {
  const [open, setOpen] = useOpen(controlled);
  const { theme, radius, insets, haptics } = useTheme();
  const reduce = useReducedMotion();
  const screen = useWindowDimensions().height;
  const heights = snapPoints.map((p) => Math.round(Math.min(0.96, Math.max(0.1, p)) * screen));
  const max = heights[heights.length - 1]!;
  const [snap, setSnap] = React.useState(initialSnap);
  // translateY: 0 = the highest snap fully shown; `max` = hidden below the edge.
  const [y] = React.useState(() => new Animated.Value(max));
  const offsetOf = React.useCallback((i: number) => max - heights[Math.min(heights.length - 1, Math.max(0, i))]!, [max, heights]);
  const go = React.useCallback(
    (to: number, then?: () => void) => {
      if (reduce) {
        y.setValue(to);
        then?.();
        return;
      }
      Animated.spring(y, { toValue: to, useNativeDriver: true, damping: 24, stiffness: 260, mass: 0.9 }).start(() => then?.());
    },
    [reduce, y],
  );
  React.useEffect(() => {
    if (open) {
      y.setValue(max);
      go(offsetOf(initialSnap));
      AccessibilityInfo.announceForAccessibility(title);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps -- runs when it opens
  const close = () =>
    go(max, () => {
      setOpen(false);
      setSnap(initialSnap);
    });
  const drag = React.useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 4,
        onPanResponderMove: (_, g) => y.setValue(Math.max(0, offsetOf(snap) + g.dy)),
        onPanResponderRelease: (_, g) => {
          const at = offsetOf(snap) + g.dy + g.vy * 120;
          if (at > offsetOf(0) + heights[0]! * 0.35) return close();
          let best = 0;
          heights.forEach((_, i) => {
            if (Math.abs(offsetOf(i) - at) < Math.abs(offsetOf(best) - at)) best = i;
          });
          if (best !== snap) haptics.impact("light");
          setSnap(best);
          go(offsetOf(best));
        },
      }),
    [snap, heights, offsetOf], // eslint-disable-line react-hooks/exhaustive-deps -- close/go are stable enough per render
  );
  return (
    <Modal visible={open} transparent animationType="none" onRequestClose={close} statusBarTranslucent>
      <Pressable aria-hidden accessible={false} style={[StyleSheet.absoluteFill, { backgroundColor: theme.scrim }]} onPress={close} />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.bottom} pointerEvents="box-none">
        <Animated.View
          role="dialog"
          aria-modal
          aria-label={title}
          style={[
            styles.sheet,
            { height: max, backgroundColor: theme.surface1, borderColor: theme.borderDefault, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, transform: [{ translateY: y }] },
            style,
          ]}
        >
          <View {...drag.panHandlers} style={styles.grab}>
            <View aria-hidden style={[styles.handle, { backgroundColor: theme.borderStrong }]} />
            <View style={[styles.head, hideTitle && !closeLabel ? styles.hidden : null]}>
              <Txt variant="title" style={[styles.headText, hideTitle ? styles.hidden : null]}>
                {title}
              </Txt>
              {closeLabel ? <CloseButton label={closeLabel} onPress={close} /> : null}
            </View>
          </View>
          <ScrollView style={styles.flex} contentContainerStyle={[styles.scroll, { paddingBottom: (footer ? 12 : 24) + (footer ? 0 : insets.bottom) + (max - heights[snap]!) }]} keyboardShouldPersistTaps="handled">
            {children}
          </ScrollView>
          {footer ? <View style={[styles.footer, { borderTopColor: theme.borderSubtle, paddingBottom: 12 + insets.bottom, marginBottom: max - heights[snap]! }]}>{footer}</View> : null}
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  headText: { flex: 1, gap: 4 },
  bottom: { flex: 1, justifyContent: "flex-end" },
  sheet: { borderWidth: StyleSheet.hairlineWidth, borderBottomWidth: 0, overflow: "hidden" },
  grab: { paddingTop: 8, paddingHorizontal: 20, paddingBottom: 8, gap: 10 },
  handle: { alignSelf: "center", width: 40, height: 4, borderRadius: 2 },
  hidden: { height: 0, opacity: 0, overflow: "hidden" },
  flex: { flex: 1 },
  scroll: { paddingHorizontal: 20, gap: 12 },
  footer: { paddingHorizontal: 20, paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth, gap: 8 },
});
