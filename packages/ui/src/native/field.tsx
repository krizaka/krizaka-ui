import * as React from "react";
import { type StyleProp, StyleSheet, Text, TextInput, type TextInputProps, View, type ViewStyle } from "react-native";

import { useTheme } from "./theme";

export type TextFieldProps = Omit<TextInputProps, "value" | "defaultValue" | "onChangeText" | "style" | "editable"> & {
  /** The visible label above the input, passed translated (also its accessible name). */
  label: string;
  /** A help text under the input ("At least 8 characters"), read with it. */
  hint?: string;
  /** An error under the input: a danger border and caption, read with it and announced. Replaces the hint. */
  error?: string;
  /** The text (controlled). */
  value?: string;
  /** The text at first, uncontrolled. */
  defaultValue?: string;
  /** Called on every key with the text. */
  onValueChange?: (text: string) => void;
  /** Not available: dimmed, not focusable. */
  disabled?: boolean;
  /** Something at the end of the input: a spinner while a value is checked, a check once it is, a show-password button. */
  end?: React.ReactNode;
  /** The input itself, to focus it (`ref.current?.focus()`) or move to the next field. */
  inputRef?: React.Ref<TextInput>;
  /** Styles merged last, on the field (label, input, caption). */
  style?: StyleProp<ViewStyle>;
};

/**
 * A text field for React Native: its label, the input (every `TextInput` prop: `secureTextEntry`, `keyboardType`,
 * `autoComplete`, `returnKeyType`…), a hint or an error under it — the web `Field` + `Input`. `multiline` makes it a
 * text area.
 */
export function TextField({ label, hint, error, value, defaultValue, onValueChange, disabled, end, inputRef, style, multiline, onFocus, onBlur, ...props }: TextFieldProps) {
  const { theme, radius } = useTheme();
  const [focused, setFocused] = React.useState(false);
  const caption = error ?? hint;
  const border = error ? theme.danger : focused ? theme.accent : theme.borderDefault;
  return (
    <View style={[styles.root, disabled ? styles.disabled : null, style]}>
      <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text>
      <View style={[styles.frame, multiline ? styles.multiline : null, { borderRadius: radius.md, borderColor: border, backgroundColor: theme.surface2 }]}>
        <TextInput
          ref={inputRef}
          aria-label={label}
          aria-disabled={disabled || undefined}
          accessibilityHint={caption}
          value={value}
          defaultValue={defaultValue}
          editable={!disabled}
          multiline={multiline}
          textAlignVertical={multiline ? "top" : "center"}
          placeholderTextColor={theme.textMuted}
          onChangeText={onValueChange}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          style={[styles.input, multiline ? styles.inputMultiline : null, { color: theme.textPrimary }]}
          {...props}
        />
        {end ? <View style={styles.end}>{end}</View> : null}
      </View>
      {caption ? (
        <Text role={error ? "alert" : undefined} aria-live={error ? "polite" : undefined} style={[styles.caption, { color: error ? theme.dangerText : theme.textSecondary }]}>
          {caption}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: 6, alignSelf: "stretch" },
  label: { fontSize: 12, lineHeight: 16, fontWeight: "600" },
  frame: { flexDirection: "row", alignItems: "center", minHeight: 44, paddingHorizontal: 12, borderWidth: 1 },
  multiline: { alignItems: "flex-start", minHeight: 96, paddingVertical: 10 },
  input: { flex: 1, minHeight: 42, fontSize: 15, paddingVertical: 0 },
  inputMultiline: { minHeight: 76 },
  end: { marginLeft: 8 },
  caption: { fontSize: 12, lineHeight: 16 },
  disabled: { opacity: 0.5 },
});
