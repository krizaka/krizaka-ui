import * as React from "react";
import { Animated, PanResponder, Pressable, type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";

import { type Theme, useReducedMotion, useTheme } from "./theme";
import { Txt } from "./txt";

export type SwipeAction = {
  /** The action's words — passed translated; also its accessibility action. */
  label: string;
  /** What it does; the row closes first. */
  onPress: () => void;
  /** The tone: `danger` (delete), `accent` (pin, reply), `neutral` (archive, mute). Default `neutral`. */
  tone?: "neutral" | "accent" | "success" | "warning" | "danger";
  /** A decorative icon above the words. */
  icon?: React.ReactNode;
};

export type SwipeableRowProps = {
  /** The row's content (a `ListItem`). */
  children: React.ReactNode;
  /** Revealed by a swipe to the left, at the right edge (the first is the outermost). */
  trailing?: readonly SwipeAction[];
  /** Revealed by a swipe to the right, at the left edge. */
  leading?: readonly SwipeAction[];
  /** A full swipe past this share of the row runs the outermost action (delete, archive). Default 0.6; `false` never. */
  fullSwipe?: number | false;
  /** Width of each action, in points. Default 80. */
  actionWidth?: number;
  /**
   * The row's own action, for screen readers: the row is one element whose actions are the swipe actions, and
   * activating it calls this (pass the `onPress` of the `ListItem` inside).
   */
  onActivate?: () => void;
  /** The test id of the row's moving part (the accessibility element). */
  testID?: string;
  /** Styles merged last. */
  style?: StyleProp<ViewStyle>;
};

const toneColor = (t: Theme, tone: SwipeAction["tone"]) =>
  ({ neutral: t.surface3, accent: t.accent, success: t.success, warning: t.warning, danger: t.danger })[tone ?? "neutral"];
const toneText = (tone: SwipeAction["tone"]) => (tone === "neutral" || tone === undefined ? "text" : "onAccent") as "text" | "onAccent";

/**
 * A row whose actions show under a swipe — mail-style: swipe left for the trailing actions, right for the leading ones,
 * a full swipe runs the outermost one, a tick marks the threshold. Screen readers get the same actions from the
 * rotor (accessibility actions): nothing is reachable only by a gesture.
 */
export function SwipeableRow({ children, trailing = [], leading = [], fullSwipe = 0.6, actionWidth = 80, onActivate, testID, style }: SwipeableRowProps) {
  const { theme, haptics } = useTheme();
  const reduce = useReducedMotion();
  const [x] = React.useState(() => new Animated.Value(0));
  const [width, setWidth] = React.useState(0);
  const rest = React.useRef(0);
  const armed = React.useRef(false);
  const settle = (to: number) => {
    rest.current = to;
    if (reduce) x.setValue(to);
    else Animated.spring(x, { toValue: to, useNativeDriver: true, damping: 22, stiffness: 240 }).start();
  };
  const run = (action: SwipeAction) => {
    settle(0);
    action.onPress();
  };
  // PanResponder's handlers run on gestures, never during render: the compiler's ref and purity checks misread them.
  /* eslint-disable react-hooks/refs */
  const pan = React.useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 8 && Math.abs(g.dx) > Math.abs(g.dy) * 1.5,
        onPanResponderMove: (_, g) => {
          let next = rest.current + g.dx;
          if (next < 0 && trailing.length === 0) next = 0;
          if (next > 0 && leading.length === 0) next = 0;
          x.setValue(next);
          const past = fullSwipe !== false && width > 0 && Math.abs(next) > width * fullSwipe;
          if (past !== armed.current) {
            armed.current = past;
            if (past) haptics.impact("medium");
          }
        },
        onPanResponderRelease: (_, g) => {
          const at = rest.current + g.dx;
          if (armed.current) {
            armed.current = false;
            const action = at < 0 ? trailing[0] : leading[0];
            if (action) return run(action);
          }
          const open = at < 0 ? -trailing.length * actionWidth : leading.length * actionWidth;
          settle(Math.abs(at) > actionWidth / 2 ? open : 0);
        },
        onPanResponderTerminate: () => settle(0),
      }),
    [trailing, leading, fullSwipe, width, actionWidth], // eslint-disable-line react-hooks/exhaustive-deps -- run/settle are stable in effect
  );
  /* eslint-enable react-hooks/refs */
  const side = (actions: readonly SwipeAction[], edge: "left" | "right") => (
    <View aria-hidden style={[styles.side, edge === "left" ? { left: 0 } : { right: 0, flexDirection: "row-reverse" }]}>
      {actions.map((action, i) => (
        // eslint-disable-next-line react-hooks/refs -- runs on a press, never during render
        <Pressable key={i} focusable={false} tabIndex={-1} onPress={() => run(action)} style={[styles.action, { width: actionWidth, backgroundColor: toneColor(theme, action.tone) }]}>
          {action.icon}
          <Txt variant="caption" tone={toneText(action.tone)} style={styles.actionText} numberOfLines={1}>
            {action.label}
          </Txt>
        </Pressable>
      ))}
    </View>
  );
  const all = [...leading, ...trailing];
  return (
    <View style={[styles.root, style]} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      {leading.length > 0 ? side(leading, "left") : null}
      {trailing.length > 0 ? side(trailing, "right") : null}
      <Animated.View
        {...pan.panHandlers}
        accessible
        testID={testID}
        accessibilityActions={[...(onActivate ? [{ name: "activate" }] : []), ...all.map((a) => ({ name: a.label, label: a.label }))]}
        onAccessibilityAction={(e) => {
          if (e.nativeEvent.actionName === "activate") return onActivate?.();
          const action = all.find((a) => a.label === e.nativeEvent.actionName);
          if (action) action.onPress();
        }}
        style={[styles.front, { backgroundColor: theme.surface0, transform: [{ translateX: x }] }]}
      >
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { overflow: "hidden" },
  side: { position: "absolute", top: 0, bottom: 0, flexDirection: "row" },
  action: { alignItems: "center", justifyContent: "center", gap: 4, paddingHorizontal: 6 },
  actionText: { fontWeight: "700" },
  front: {},
});
