import * as React from "react";
import { type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";

import { Txt } from "./txt";

/** Controlled or not: the value given, else its own state. */
export function useControllable<T>(value: T | undefined, initial: T, onChange?: (next: T) => void): [T, (next: T) => void] {
  const [own, setOwn] = React.useState(initial);
  const current = value === undefined ? own : value;
  const set = React.useCallback(
    (next: T) => {
      if (value === undefined) setOwn(next);
      onChange?.(next);
    },
    [value, onChange],
  );
  return [current, set];
}

export type Labelled = {
  /** The words beside the control — passed translated; they name it. */
  label: string;
  /** One line under the label. */
  description?: string;
  /** Cannot be changed now. */
  disabled?: boolean;
  /** Styles merged last, on the row. */
  style?: StyleProp<ViewStyle>;
};

/** A control beside its label (and a line under it): the row of a setting. */
export function Row({ label, description, control, disabled, style }: Labelled & { control: React.ReactNode }) {
  return (
    <View aria-disabled={disabled || undefined} style={[styles.row, disabled ? styles.disabled : null, style]}>
      <View style={styles.text}>
        <Txt>{label}</Txt>
        {description ? (
          <Txt variant="caption" tone="secondary">
            {description}
          </Txt>
        ) : null}
      </View>
      {control}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 12, minHeight: 44 },
  text: { flex: 1, gap: 2 },
  disabled: { opacity: 0.45 },
});
