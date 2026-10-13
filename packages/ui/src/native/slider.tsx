import * as React from "react";
import { type LayoutChangeEvent, PanResponder, type StyleProp, StyleSheet, Text, View, type ViewStyle } from "react-native";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";

import { useSvgId, useTheme } from "./theme";

export type SliderValue = number | [number, number];

export type SliderProps<V extends SliderValue = number> = {
  /** The accessible name of the thumb (or of both thumbs of a range), passed translated. */
  label: string;
  /** For a range: each thumb's own name (["Minimum", "Maximum"]), passed translated. */
  thumbLabels?: [string, string];
  /** One number (a thumb) or two (a range), controlled. */
  value?: V;
  /** The value at first, uncontrolled. */
  defaultValue?: V;
  /** Called on every step the thumb passes. */
  onValueChange?: (value: V) => void;
  /** Called once the thumb is released (or an accessibility action is done). */
  onValueCommit?: (value: V) => void;
  /** The lowest value. Default 0. */
  min?: number;
  /** The highest value. Default 100. */
  max?: number;
  /** The step. Default 1. */
  step?: number;
  /** The value as words (read, and shown): "1.5×", "15 %". */
  formatValue?: (value: number) => string;
  /** Shows the label and the value above the track. */
  showLabel?: boolean;
  /** Shows the value floating over the thumb while it is dragged (`"always"`: at all times). */
  floatingValue?: boolean | "always";
  /** A graduation at every step (`true`, up to 40) or at the values given. */
  ticks?: boolean | readonly number[];
  /** Words under the track at some values. Horizontal only. */
  marks?: readonly { value: number; label: string }[];
  /** `gradient` (accent → accent-2, default) or `solid`. */
  tone?: "gradient" | "solid";
  /** `horizontal` (default) or `vertical` (give the slider a height). */
  orientation?: "horizontal" | "vertical";
  /** Not available. */
  disabled?: boolean;
  /** Styles merged last. */
  style?: StyleProp<ViewStyle>;
};

const THUMB = 26;
const toArray = (v: SliderValue | undefined) => (v === undefined ? undefined : typeof v === "number" ? [v] : [...v]);

/**
 * A slider for React Native — the web `Slider`: one value or a range, drawn by the theme, dragged anywhere on the track.
 * Each step the thumb passes ticks under the thumb (`selection` haptic); for VoiceOver and TalkBack each thumb is an
 * adjustable control (swipe up or down by a step), its value read as words.
 */
export function Slider<V extends SliderValue = number>({
  label,
  thumbLabels,
  value,
  defaultValue,
  onValueChange,
  onValueCommit,
  min = 0,
  max = 100,
  step = 1,
  formatValue = String,
  showLabel,
  floatingValue,
  ticks,
  marks,
  tone = "gradient",
  orientation = "horizontal",
  disabled,
  style,
}: SliderProps<V>) {
  const { theme, radius, haptic } = useTheme();
  const range = Array.isArray(value ?? defaultValue);
  const vertical = orientation === "vertical";
  const [inner, setInner] = React.useState<number[]>(() => toArray(defaultValue) ?? [min]);
  const current = toArray(value) ?? inner;
  const [length, setLength] = React.useState(0);
  const [dragging, setDragging] = React.useState<number | null>(null);
  const gradientId = useSvgId("kzs");
  const out = (next: number[]) => (range ? [next[0]!, next[1]!] : next[0]) as V;
  const snap = (v: number) => Math.min(max, Math.max(min, Math.round((v - min) / step) * step + min));
  const pct = (v: number) => (v - min) / (max - min || 1);

  // The latest state for the responder, created once.
  const live = React.useRef({ current, length, vertical, disabled });
  React.useLayoutEffect(() => {
    live.current = { current, length, vertical, disabled };
  });
  const active = React.useRef(0);
  const start = React.useRef(0);
  const set = (next: number[]) => {
    if (value === undefined) setInner(next);
    onValueChange?.(out(next));
  };
  const move = (thumb: number, to: number) => {
    const now = live.current.current;
    let v = snap(to);
    if (now.length === 2) v = thumb === 0 ? Math.min(v, now[1]!) : Math.max(v, now[0]!);
    if (v === now[thumb]) return;
    haptic("selection");
    const next = [...now];
    next[thumb] = v;
    set(next);
  };
  // A touch on the control (its padding is half a thumb on each end of the track) → a value.
  const at = (position: number) => {
    const { length: l, vertical: vert } = live.current;
    const p = Math.min(1, Math.max(0, (vert ? l + THUMB / 2 - position : position - THUMB / 2) / (l || 1)));
    return min + p * (max - min);
  };
  // What the responder (created once) calls: always this render's.
  const commit = () => onValueCommit?.(out(live.current.current));
  const handlers = React.useRef({ move, at, commit });
  React.useLayoutEffect(() => {
    handlers.current = { move, at, commit };
  });
  // The responder reads the refs in its gestures only, never while rendering.
  // eslint-disable-next-line react-hooks/refs
  const [responder] = React.useState(() =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => !live.current.disabled,
      onMoveShouldSetPanResponder: () => !live.current.disabled,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (e) => {
        const pos = live.current.vertical ? e.nativeEvent.locationY : e.nativeEvent.locationX;
        start.current = pos;
        const target = handlers.current.at(pos);
        const now = live.current.current;
        active.current = now.length === 2 && Math.abs(target - now[1]!) < Math.abs(target - now[0]!) ? 1 : 0;
        setDragging(active.current);
        handlers.current.move(active.current, target);
      },
      onPanResponderMove: (_, g) => handlers.current.move(active.current, handlers.current.at(start.current + (live.current.vertical ? g.dy : g.dx))),
      onPanResponderRelease: () => {
        setDragging(null);
        handlers.current.commit();
      },
      onPanResponderTerminate: () => setDragging(null),
    }),
  );

  const lo = range ? Math.min(...current) : min;
  const hi = range ? Math.max(...current) : current[0]!;
  const tickValues = ticks === true ? ((max - min) / step <= 40 ? Array.from({ length: Math.round((max - min) / step) + 1 }, (_, i) => min + i * step) : []) : ticks ? [...ticks] : [];
  const along = (p: number) => (vertical ? { bottom: p * length } : { left: p * length });
  const onLayout = (e: LayoutChangeEvent) => setLength(vertical ? e.nativeEvent.layout.height : e.nativeEvent.layout.width);
  const fill = vertical ? { bottom: pct(lo) * length, height: (pct(hi) - pct(lo)) * length, left: 0, right: 0 } : { left: pct(lo) * length, width: (pct(hi) - pct(lo)) * length, top: 0, bottom: 0 };

  return (
    <View style={[styles.root, vertical ? styles.rootVertical : null, disabled ? styles.disabled : null, style]}>
      {showLabel ? (
        <View style={styles.header}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text>
          <Text aria-hidden style={[styles.value, { color: theme.textSecondary }]}>
            {current.map(formatValue).join(" – ")}
          </Text>
        </View>
      ) : null}
      <View {...responder.panHandlers} style={vertical ? styles.controlVertical : styles.control}>
        <View onLayout={onLayout} pointerEvents="none" style={[vertical ? styles.trackVertical : styles.track, { borderRadius: radius.full, backgroundColor: theme.surface3 }]}>
          <View style={[styles.fill, fill, { borderRadius: radius.full, overflow: "hidden", backgroundColor: theme.accent }]}>
            {tone === "gradient" ? (
              <Svg width="100%" height="100%" aria-hidden>
                <Defs>
                  <LinearGradient id={gradientId} x1="0" y1={vertical ? "1" : "0"} x2={vertical ? "0" : "1"} y2="0">
                    <Stop offset="0" stopColor={theme.accent} />
                    <Stop offset="1" stopColor={theme.accent2} />
                  </LinearGradient>
                </Defs>
                <Rect width="100%" height="100%" fill={`url(#${gradientId})`} />
              </Svg>
            ) : null}
          </View>
          {tickValues.map((t) => (
            <View key={t} style={[vertical ? styles.tickVertical : styles.tick, along(pct(t)), { backgroundColor: t > lo && t < hi ? theme.onAccent : theme.borderStrong }]} />
          ))}
        </View>
        {current.map((v, i) => (
          <View
            key={i}
            accessible
            role="slider"
            aria-label={range ? (thumbLabels?.[i] ?? label) : label}
            aria-valuenow={v}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuetext={formatValue(v)}
            aria-disabled={disabled || undefined}
            accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
            onAccessibilityAction={(e) => {
              const next = snap(v + (e.nativeEvent.actionName === "increment" ? step : -step));
              move(i, next);
              const values = [...current];
              values[i] = next;
              onValueCommit?.(out(values));
            }}
            pointerEvents="none"
            style={[styles.thumb, vertical ? { bottom: pct(v) * length, left: (44 - THUMB) / 2, marginLeft: 0, marginTop: 0 } : { left: pct(v) * length - THUMB / 2, top: 0 }, { borderColor: theme.accent, backgroundColor: theme.textOnMedia, shadowColor: theme.scrimStrong }]}
          >
            {floatingValue === "always" || (floatingValue && dragging === i) ? (
              <View aria-hidden style={[vertical ? styles.bubbleVertical : styles.bubble, { backgroundColor: theme.textPrimary, borderRadius: radius.md }]}>
                <Text style={[styles.bubbleText, { color: theme.surface0 }]}>{formatValue(v)}</Text>
              </View>
            ) : null}
          </View>
        ))}
      </View>
      {marks?.length && !vertical ? (
        <View aria-hidden style={styles.marks}>
          {marks.map((m) => (
            <Text key={m.value} style={[styles.mark, { left: pct(m.value) * length, color: theme.textSecondary, transform: [{ translateX: m.value === min ? 0 : m.value === max ? -40 : -20 }], textAlign: m.value === min ? "left" : m.value === max ? "right" : "center" }]}>
              {m.label}
            </Text>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: 8, alignSelf: "stretch" },
  rootVertical: { alignSelf: "flex-start", alignItems: "center" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", gap: 12 },
  label: { fontSize: 12, fontWeight: "600" },
  value: { fontSize: 12, fontVariant: ["tabular-nums"] },
  control: { height: 44, justifyContent: "center", paddingHorizontal: THUMB / 2 },
  controlVertical: { flex: 1, minHeight: 160, width: 44, alignItems: "center", paddingVertical: THUMB / 2 },
  track: { height: 6 },
  trackVertical: { width: 6, flex: 1 },
  fill: { position: "absolute" },
  tick: { position: "absolute", top: 1, width: 1, height: 4, marginLeft: -0.5 },
  tickVertical: { position: "absolute", left: 1, height: 1, width: 4, marginBottom: -0.5 },
  thumb: {
    position: "absolute",
    width: THUMB,
    height: THUMB,
    borderRadius: THUMB / 2,
    borderWidth: 2.5,
    marginLeft: THUMB / 2,
    marginTop: (44 - THUMB) / 2,
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  bubble: { position: "absolute", bottom: THUMB + 6, left: -17, minWidth: 56, paddingHorizontal: 8, paddingVertical: 4, alignItems: "center" },
  bubbleVertical: { position: "absolute", left: THUMB + 8, top: -2, minWidth: 48, paddingHorizontal: 8, paddingVertical: 4, alignItems: "center" },
  bubbleText: { fontSize: 12, fontWeight: "700", fontVariant: ["tabular-nums"] },
  marks: { height: 16, marginHorizontal: THUMB / 2 },
  mark: { position: "absolute", width: 40, fontSize: 11, fontWeight: "500" },
  disabled: { opacity: 0.4 },
});
