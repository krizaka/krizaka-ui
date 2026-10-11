import * as React from "react";
import { Switch as RNSwitch } from "react-native";

import { type Labelled, Row, useControllable } from "./control-row";
import { useTheme } from "./theme";

export type SwitchProps = Labelled & {
  /** On (controlled). */
  checked?: boolean;
  /** On at first, uncontrolled. */
  defaultChecked?: boolean;
  /** Called with the new state; a light tick confirms it. */
  onCheckedChange?: (checked: boolean) => void;
};

/** An on/off setting that applies at once — the platform's switch in the accent, a row with its label: the web `Switch`. */
export function Switch({ checked, defaultChecked = false, onCheckedChange, ...row }: SwitchProps) {
  const { theme, haptics } = useTheme();
  const [on, setOn] = useControllable(checked, defaultChecked, onCheckedChange);
  return (
    <Row
      {...row}
      control={
        <RNSwitch
          aria-label={row.label}
          value={on}
          disabled={row.disabled}
          onValueChange={(next) => {
            haptics.selection();
            setOn(next);
          }}
          trackColor={{ false: theme.surface3, true: theme.accent }}
          thumbColor={theme.surface0}
          ios_backgroundColor={theme.surface3}
        />
      }
    />
  );
}
