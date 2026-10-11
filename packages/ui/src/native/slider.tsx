import * as React from "react";
import { type GestureResponderEvent, type LayoutChangeEvent, PanResponder, type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";

import { useControllable } from "./control-row";
import { useTheme } from "./theme";
import { Txt } from "./txt";

export type SliderProps = {
  /** The accessible name (“Exposure”) — passed translated. */
  label: string;
  /** The value (controlled). */
  value?: number;
  /** The value at first, uncontrolled. */
  defaultValue?: number;
  /** Called while it moves. */
  onValueChange?: (value: number) => void;
  /** Called once the finger lifts: commit here (a request, an undo step). */
  onValueCommit?: (value: number) => void;
  /** The lowest value. Default 0. */
  min?: number;
  /** The highest value. Default 100. */
  max?: number;
  /** The step. Default 1. */
  step?: number;
  /** The value in words for screen readers and the readout (“+0.3 EV”). Default: the number. */
  valueText?: (value: number) => string;
  /** Show the label and the value above the track. */
  showValue?: boolean;
  /** Fill from the centre (a setting around zero: exposure, temperature). */
  centred?: boolean;
  /** Cannot be moved. */
  disabled?: boolean;
  /** Styles merged last. */
  style?: StyleProp<ViewStyle>;
};

/**
 * A value in a range — the web `Slider`: drag the thumb or tap the track; screen readers adjust it by a step (swipe up and
 * down), its value said in words. A light tick at each step change when the app gives haptics.
 */
export function Slider({ label, value, defaultValue, onValueChange, onValueCommit, min = 0, max = 100, step = 1, valueText, showValue, centred, disabled, style }: SliderProps) {
  const { theme, haptics } = useTheme();
  const [current, setCurrent] = useControllable(value, defaultValue ?? min, onValueChange);
  const [width, setWidth] = React.useState(0);
  const latest = React.useRef(current);
  React.useEffect(() => {
    latest.current = current;
  }, [current]);
  const snap = (raw: number) => Math.min(max, Math.max(min, Math.round((raw - min) / step) * step + min));
  const fromX = (x: number) => snap(min + (Math.min(width, Math.max(0, x)) / (width || 1)) * (max - min));
  const move = (next: number) => {
    if (next === latest.current) return;
    if (Math.abs(next - latest.current) >= step) haptics.selection();
    latest.current = next;
    setCurrent(next);
  };
  const start = React.useRef(0);
  // PanResponder's handlers run on gestures, never during render: the compiler's ref and purity checks misread them.
  /* eslint-disable react-hooks/refs */
  const pan = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !disabled,
        onMoveShouldSetPanResponder: (_, g) => !disabled && Math.abs(g.dx) > Math.abs(g.dy),
        onPanResponderTerminationRequest: () => false,
        onPanResponderGrant: (e: GestureResponderEvent) => {
          start.current = e.nativeEvent.locationX;
          move(fromX(start.current));
        },
        onPanResponderMove: (_, g) => move(fromX(start.current + g.dx)),
        onPanResponderRelease: () => onValueCommit?.(latest.current),
      }),
    [disabled, width, min, max, step], // eslint-disable-line react-hooks/exhaustive-deps -- move/fromX read refs and props of this render
  );
  /* eslint-enable react-hooks/refs */
  const ratio = (current - min) / (max - min || 1);
  const zero = centred ? (0 - min) / (max - min || 1) : 0;
  const words = valueText ? valueText(current) : String(current);
  return (
    <View style={[styles.slider, disabled ? styles.disabled : null, style]}>
      {showValue ? (
        <View style={styles.sliderHead} aria-hidden>
          <Txt variant="label" style={styles.flex}>
            {label}
          </Txt>
          <Txt variant="mono" tone="secondary">
            {words}
          </Txt>
        </View>
      ) : null}
      <View
        accessible
        role="slider"
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={current}
        aria-valuetext={words}
        aria-disabled={disabled}
        accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
        onAccessibilityAction={(e) => {
          const next = snap(current + (e.nativeEvent.actionName === "increment" ? step : -step));
          move(next);
          onValueCommit?.(next);
        }}
        onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)}
        style={styles.hit}
        {...pan.panHandlers}
      >
        <View style={[styles.track, { backgroundColor: theme.surface3 }]}>
          <View style={[styles.range, { left: `${Math.min(zero, ratio) * 100}%`, width: `${Math.abs(ratio - zero) * 100}%`, backgroundColor: theme.accent }]} />
        </View>
        <View pointerEvents="none" style={[styles.thumb, { left: ratio * width - 12, backgroundColor: theme.surface0, borderColor: theme.accent }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  disabled: { opacity: 0.45 },
  slider: { width: "100%", gap: 6 },
  sliderHead: { flexDirection: "row", alignItems: "baseline", gap: 8 },
  flex: { flex: 1 },
  hit: { height: 36, justifyContent: "center" },
  track: { height: 4, borderRadius: 2, overflow: "hidden" },
  range: { position: "absolute", top: 0, bottom: 0 },
  thumb: { position: "absolute", top: 6, width: 24, height: 24, borderRadius: 12, borderWidth: 2.5, shadowOpacity: 0.25, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 3 },
});
