import * as React from "react";
import { type NativeScrollEvent, type NativeSyntheticEvent, Pressable, ScrollView, type StyleProp, StyleSheet, Text, View, type ViewStyle } from "react-native";

import { useTheme } from "./theme";

/** A value of a wheel: what is stored, and its words (passed translated or formatted for the locale). */
export type WheelOption = { value: string; label: string; disabled?: boolean };

const ITEM = 44;
const FrameContext = React.createContext({ visible: 5, unset: false });

export type WheelPickerProps = {
  /** The group's accessible name ("Departure time"), passed translated. */
  label: string;
  /** The wheels (`Wheel`), and dividers (`WheelDivider`) between them. */
  children: React.ReactNode;
  /** How many values are visible: 3, 5 (default) or 7. */
  visible?: 3 | 5 | 7;
  /** Marks the group invalid (a danger edge). */
  invalid?: boolean;
  /** Nothing is chosen yet: the values under the band stay quiet (secondary) until a wheel is turned. */
  unset?: boolean;
  /** Styles merged last. */
  style?: StyleProp<ViewStyle>;
};

/** The frame of one or several wheels: a raised surface, the lit band across them — the web `WheelPicker`. */
export function WheelPicker({ label, children, visible = 5, invalid, unset = false, style }: WheelPickerProps) {
  const { theme, radius } = useTheme();
  return (
    <FrameContext.Provider value={React.useMemo(() => ({ visible, unset }), [visible, unset])}>
      <View
        role="group"
        aria-label={label}
        style={[styles.root, { height: ITEM * visible, borderRadius: radius.xl, backgroundColor: theme.surface1, borderColor: invalid ? theme.danger : theme.borderDefault }, style]}
      >
        <View pointerEvents="none" style={[styles.band, { top: (ITEM * (visible - 1)) / 2, height: ITEM, borderRadius: radius.lg, backgroundColor: theme.surface3, borderColor: theme.borderSubtle }]} />
        {children}
      </View>
    </FrameContext.Provider>
  );
}

/** A divider between two wheels (`:` between the hours and the minutes). */
export function WheelDivider({ children }: { children: string }) {
  const { theme } = useTheme();
  return (
    <Text aria-hidden style={[styles.divider, { color: theme.textSecondary }]}>
      {children}
    </Text>
  );
}

export type WheelProps = {
  /** The column's accessible name ("Hour", "Month"), passed translated. */
  label: string;
  /** The values, in order. */
  options: readonly WheelOption[];
  /** The chosen value (controlled). */
  value?: string | null;
  /** The chosen value at first, uncontrolled. Default: the first one. */
  defaultValue?: string;
  /** Called with the value that comes to rest under the band. */
  onValueChange?: (value: string) => void;
  /** Not available. */
  disabled?: boolean;
  /** Styles merged last, on the column (a width). */
  style?: StyleProp<ViewStyle>;
};

const nearestEnabled = (options: readonly WheelOption[], index: number) => {
  for (let d = 0; d < options.length; d++) {
    if (options[index + d] && !options[index + d]!.disabled) return index + d;
    if (options[index - d] && !options[index - d]!.disabled) return index - d;
  }
  return index;
};

/**
 * One column of a `WheelPicker`: values that snap under the band, a tick of the hand (`selection` haptic) at each one
 * passed. For VoiceOver and TalkBack it is an adjustable control: swipe up or down to change it, its value read as words.
 */
export function Wheel({ label, options, value: valueProp, defaultValue, onValueChange, disabled, style }: WheelProps) {
  const { theme, haptic } = useTheme();
  const { visible, unset } = React.useContext(FrameContext);
  const [own, setOwn] = React.useState(defaultValue ?? options[0]?.value ?? "");
  const value = valueProp ?? own;
  const index = Math.max(0, options.findIndex((o) => o.value === value));
  const scroller = React.useRef<ScrollView>(null);
  const passing = React.useRef(index);
  const [shown, setShown] = React.useState(index);
  // The band follows the value set from outside (an accessibility action, a reset): adjusted while rendering.
  const [seen, setSeen] = React.useState(index);
  if (seen !== index) {
    setSeen(index);
    setShown(index);
  }

  const commit = (i: number) => {
    const target = nearestEnabled(options, Math.min(options.length - 1, Math.max(0, i)));
    const option = options[target];
    if (!option) return;
    if (target !== i) scroller.current?.scrollTo({ y: target * ITEM, animated: true });
    if (valueProp === undefined) setOwn(option.value);
    if (option.value !== value) onValueChange?.(option.value);
  };

  // The list follows the value set from outside (an accessibility action, a reset).
  React.useEffect(() => {
    passing.current = index;
    scroller.current?.scrollTo({ y: index * ITEM, animated: false });
  }, [index]);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.y / ITEM);
    if (i !== passing.current && i >= 0 && i < options.length) {
      passing.current = i;
      setShown(i);
      haptic("selection");
    }
  };
  const settle = (e: NativeSyntheticEvent<NativeScrollEvent>) => commit(Math.round(e.nativeEvent.contentOffset.y / ITEM));
  const step = (by: number) => {
    let i = index + by;
    while (options[i]?.disabled) i += by;
    if (options[i]) commit(i);
  };
  const pad = ((visible - 1) / 2) * ITEM;
  return (
    <View
      accessible
      role="spinbutton"
      aria-label={label}
      aria-valuetext={options[index]?.label}
      aria-valuenow={index}
      aria-valuemin={0}
      aria-valuemax={Math.max(0, options.length - 1)}
      aria-disabled={disabled || undefined}
      accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
      onAccessibilityAction={(e) => step(e.nativeEvent.actionName === "increment" ? 1 : -1)}
      style={[styles.column, disabled ? styles.disabled : null, style]}
    >
      <ScrollView
        ref={scroller}
        aria-hidden
        importantForAccessibility="no-hide-descendants"
        scrollEnabled={!disabled}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM}
        decelerationRate="fast"
        contentOffset={{ x: 0, y: index * ITEM }}
        contentContainerStyle={{ paddingVertical: pad }}
        scrollEventThrottle={16}
        onScroll={onScroll}
        onMomentumScrollEnd={settle}
        onScrollEndDrag={(e) => {
          // Without momentum (a slow release), the drag's end is the rest.
          if (Math.abs(e.nativeEvent.velocity?.y ?? 0) < 0.05) settle(e);
        }}
      >
        {options.map((o, i) => {
          const distance = Math.abs(i - shown);
          return (
            <Pressable key={o.value} focusable={false} tabIndex={-1} disabled={disabled || o.disabled} onPress={() => commit(i)} style={[styles.item, { height: ITEM }]}>
              <Text
                numberOfLines={1}
                style={[
                  styles.itemText,
                  {
                    color: o.disabled ? theme.textMuted : i === shown && !unset ? theme.textPrimary : theme.textSecondary,
                    fontWeight: i === shown && !unset ? "600" : "400",
                    opacity: distance === 0 ? 1 : distance === 1 ? 0.7 : 0.4,
                    transform: [{ scale: distance === 0 ? 1 : 0.92 }],
                    textDecorationLine: o.disabled ? "line-through" : "none",
                  },
                ]}
              >
                {o.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flexDirection: "row", alignItems: "stretch", borderWidth: StyleSheet.hairlineWidth, paddingHorizontal: 6, gap: 4, overflow: "hidden", alignSelf: "flex-start" },
  band: { position: "absolute", left: 6, right: 6, borderWidth: StyleSheet.hairlineWidth },
  column: { minWidth: 56, flexGrow: 1 },
  item: { alignItems: "center", justifyContent: "center", paddingHorizontal: 8 },
  itemText: { fontSize: 18, fontVariant: ["tabular-nums"] },
  divider: { alignSelf: "center", fontSize: 18, fontWeight: "600" },
  disabled: { opacity: 0.4 },
});
