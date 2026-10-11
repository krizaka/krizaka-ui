import * as React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Svg, { Path } from "react-native-svg";

import { type Labelled, Row, useControllable } from "./control-row";
import { useTheme } from "./theme";

export type CheckboxProps = Labelled & {
  /** Checked (controlled); `"indeterminate"` for a parent of mixed children. */
  checked?: boolean | "indeterminate";
  /** Checked at first, uncontrolled. */
  defaultChecked?: boolean;
  /** Called with the new state. */
  onCheckedChange?: (checked: boolean) => void;
  /** The box alone (in a card, a table): `label` stays its accessible name. */
  hideLabel?: boolean;
};

/** A choice that applies on confirmation — a box and its label, the whole row pressable: the web `Checkbox`. */
export function Checkbox({ checked, defaultChecked = false, onCheckedChange, label, description, disabled, hideLabel, style }: CheckboxProps) {
  const { theme, radius, haptics } = useTheme();
  const [value, setValue] = useControllable<boolean | "indeterminate">(checked, defaultChecked, (next) => onCheckedChange?.(next === true));
  const on = value === true;
  const mixed = value === "indeterminate";
  const box = (
    <View style={[styles.box, { borderRadius: radius.sm / 1.5, borderColor: on || mixed ? theme.accent : theme.borderStrong, backgroundColor: on || mixed ? theme.accent : "transparent" }]}>
              {on || mixed ? (
                <Svg width={16} height={16} viewBox="0 0 24 24" aria-hidden>
                  <Path d={mixed ? "M6 12h12" : "M5 12.5l4.5 4.5L19 7.5"} stroke={theme.onAccent} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              ) : null}
            </View>
  );
  return (
    <Pressable
      role="checkbox"
      aria-checked={mixed ? "mixed" : on}
      aria-disabled={disabled}
      aria-label={label}
      disabled={disabled}
      onPress={() => {
        haptics.selection();
        setValue(!on);
      }}
    >
      {hideLabel ? (
        <View style={[styles.alone, style]}>{box}</View>
      ) : (
        <Row label={label} description={description} disabled={disabled} style={style} control={box} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  alone: { minWidth: 44, minHeight: 44, alignItems: "center", justifyContent: "center" },
  box: { width: 22, height: 22, borderWidth: 2, alignItems: "center", justifyContent: "center" },
});
