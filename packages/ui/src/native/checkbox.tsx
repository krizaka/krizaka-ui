import * as React from "react";
import { Pressable, type StyleProp, StyleSheet, Text, View, type ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";

import { useTheme } from "./theme";

export type CheckboxProps = {
  /** The words next to the box, pressable with it: text, or a `Txt` with links inside (terms, privacy). */
  children?: React.ReactNode;
  /** The accessible name when `children` is not plain text (a sentence with links), passed translated. */
  label?: string;
  /** Ticked (controlled). */
  checked?: boolean;
  /** Ticked at first, uncontrolled. */
  defaultChecked?: boolean;
  /** Called with the new state when the row is pressed. */
  onCheckedChange?: (checked: boolean) => void;
  /** An error under the row (a box that must be ticked): read with it and announced. */
  error?: string;
  /** Not available. */
  disabled?: boolean;
  /** Styles merged last, on the row. */
  style?: StyleProp<ViewStyle>;
};

/**
 * A checkbox for React Native: a 44-pt row — the box and its words, pressed as one — with an error under it. The web
 * `Checkbox` with `children`.
 */
export function Checkbox({ children, label, checked, defaultChecked = false, onCheckedChange, error, disabled, style }: CheckboxProps) {
  const { theme, radius } = useTheme();
  const [own, setOwn] = React.useState(defaultChecked);
  const on = checked ?? own;
  const toggle = () => {
    if (checked === undefined) setOwn(!on);
    onCheckedChange?.(!on);
  };
  return (
    <View style={[styles.root, style]}>
      <Pressable
        role="checkbox"
        aria-checked={on}
        aria-disabled={disabled || undefined}
        aria-label={label ?? (typeof children === "string" ? children : undefined)}
        accessibilityHint={error}
        disabled={disabled}
        onPress={toggle}
        hitSlop={4}
        style={[styles.row, disabled ? styles.disabled : null]}
      >
        <View
          style={[
            styles.box,
            { borderRadius: radius.xs + 2, borderColor: error ? theme.danger : on ? theme.accent : theme.borderStrong, backgroundColor: on ? theme.accent : theme.surface1 },
          ]}
        >
          {on ? (
            <Svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={theme.onAccent} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <Path d="M20 6 9 17l-5-5" />
            </Svg>
          ) : null}
        </View>
        {children !== undefined ? (
          <View style={styles.text}>{typeof children === "string" ? <Text style={[styles.label, { color: theme.textPrimary }]}>{children}</Text> : children}</View>
        ) : null}
      </Pressable>
      {error ? (
        <Text role="alert" aria-live="polite" style={[styles.error, { color: theme.dangerText }]}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: 2, alignSelf: "stretch" },
  row: { flexDirection: "row", alignItems: "center", gap: 12, minHeight: 44 },
  box: { width: 22, height: 22, borderWidth: 1.5, alignItems: "center", justifyContent: "center" },
  text: { flex: 1 },
  label: { fontSize: 15, lineHeight: 21 },
  error: { fontSize: 12, lineHeight: 16, paddingLeft: 34 },
  disabled: { opacity: 0.4 },
});
