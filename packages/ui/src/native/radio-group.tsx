import * as React from "react";
import { Pressable, type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";

import { Row, useControllable } from "./control-row";
import { useTheme } from "./theme";

export type RadioOption<T extends string> = { value: T; label: string; description?: string; disabled?: boolean };

export type RadioGroupProps<T extends string> = {
  /** The group's name (“Visibility”) — passed translated. */
  label: string;
  /** The choices. */
  options: readonly RadioOption<T>[];
  /** The chosen value (controlled). */
  value?: T;
  /** The chosen value at first, uncontrolled. */
  defaultValue?: T;
  /** Called with the chosen value. */
  onValueChange?: (value: T) => void;
  /** Styles merged last. */
  style?: StyleProp<ViewStyle>;
};

/** One choice among a few, all visible — the web `RadioGroup`: a radio group, each row pressable. */
export function RadioGroup<T extends string>({ label, options, value, defaultValue, onValueChange, style }: RadioGroupProps<T>) {
  const { theme, haptics } = useTheme();
  const [chosen, setChosen] = useControllable<T | undefined>(value, defaultValue, (next) => next !== undefined && onValueChange?.(next));
  return (
    <View role="radiogroup" aria-label={label} style={[styles.group, style]}>
      {options.map((option) => {
        const on = option.value === chosen;
        return (
          <Pressable
            key={option.value}
            role="radio"
            aria-checked={on}
            aria-disabled={option.disabled}
            aria-label={option.label}
            disabled={option.disabled}
            onPress={() => {
              if (!on) haptics.selection();
              setChosen(option.value);
            }}
          >
            <Row
              label={option.label}
              description={option.description}
              disabled={option.disabled}
              control={
                <View style={[styles.radio, { borderColor: on ? theme.accent : theme.borderStrong }]}>
                  {on ? <View style={[styles.dot, { backgroundColor: theme.accent }]} /> : null}
                </View>
              }
            />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  group: { gap: 4 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  dot: { width: 10, height: 10, borderRadius: 5 },
});
