import * as React from "react";
import { Pressable, type StyleProp, StyleSheet, TextInput, type TextInputProps, View, type ViewStyle } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

import { useTheme } from "./theme";
import { Txt } from "./txt";

export type SearchFieldProps = Omit<TextInputProps, "value" | "defaultValue" | "onChangeText" | "style" | "onSubmitEditing"> & {
  /** The accessible name of the input ("Search videos"), passed translated. */
  label: string;
  /** The query (controlled). */
  value?: string;
  /** The query at first, uncontrolled. */
  defaultValue?: string;
  /** Called on every key with the query. */
  onValueChange?: (query: string) => void;
  /** Called with the query once typing pauses (`debounce` ms): fetch the results here. */
  onSearch?: (query: string) => void;
  /** The pause, in ms, before `onSearch`. Default 300. */
  debounce?: number;
  /** Called when the keyboard's search key is pressed. */
  onSubmit?: (query: string) => void;
  /** The clear button's name ("Clear search"), passed translated. */
  clearLabel: string;
  /** The words of a cancel button beside the field (“Cancel”, iOS search bars) — passed translated; with `onCancel` it shows while the field has the focus or a query. */
  cancelLabel?: string;
  /** Called by the cancel button: the query is cleared and the keyboard closes. */
  onCancel?: () => void;
  /** Styles merged last, on the field's frame. */
  style?: StyleProp<ViewStyle>;
};

/**
 * A search box: the glyph, the input with the keyboard's search key, a clear button, and a debounced `onSearch` —
 * the web `SearchField` without the shortcut and the suggestions (a screen of results is the native idiom).
 */
export function SearchField({ label, value, defaultValue = "", onValueChange, onSearch, debounce = 300, onSubmit, clearLabel, cancelLabel, onCancel, style, placeholder, onFocus, onBlur, ...props }: SearchFieldProps) {
  const [focused, setFocused] = React.useState(false);
  const input = React.useRef<TextInput>(null);
  const { theme, radius } = useTheme();
  const [own, setOwn] = React.useState(defaultValue);
  const query = value ?? own;
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  React.useEffect(() => () => clearTimeout(timer.current), []);
  const change = (next: string) => {
    if (value === undefined) setOwn(next);
    onValueChange?.(next);
    clearTimeout(timer.current);
    if (onSearch) timer.current = setTimeout(() => onSearch(next), debounce);
  };
  const field = (
    <View style={[styles.frame, { borderRadius: radius.md, borderColor: theme.borderDefault, backgroundColor: theme.surface2 }, style]}>
      <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={theme.textSecondary} strokeWidth={2} strokeLinecap="round" aria-hidden>
        <Circle cx={11} cy={11} r={7} />
        <Path d="m20 20-3.5-3.5" />
      </Svg>
      <TextInput
        ref={input}
        role="searchbox"
        aria-label={label}
        value={query}
        placeholder={placeholder}
        placeholderTextColor={theme.textMuted}
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize="none"
        clearButtonMode="never"
        onChangeText={change}
        onSubmitEditing={() => {
          clearTimeout(timer.current);
          onSearch?.(query);
          onSubmit?.(query);
        }}
        style={[styles.input, { color: theme.textPrimary }]}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        {...props}
      />
      {query ? (
        <Pressable role="button" aria-label={clearLabel} hitSlop={10} onPress={() => change("")} style={styles.clear}>
          <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={theme.textSecondary} strokeWidth={2.4} strokeLinecap="round" aria-hidden>
            <Path d="M18 6 6 18M6 6l12 12" />
          </Svg>
        </Pressable>
      ) : null}
    </View>
  );
  if (!cancelLabel || !onCancel) return field;
  return (
    <View style={styles.bar}>
      <View style={styles.grow}>{field}</View>
      {focused || query ? (
        <Pressable
          role="button"
          onPress={() => {
            change("");
            input.current?.blur();
            onCancel();
          }}
          hitSlop={8}
          style={styles.cancel}
        >
          <Txt variant="label" tone="accent">
            {cancelLabel}
          </Txt>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { flexDirection: "row", alignItems: "center", gap: 8, height: 44, paddingLeft: 12, paddingRight: 6, borderWidth: StyleSheet.hairlineWidth },
  input: { flex: 1, height: "100%", fontSize: 15, paddingVertical: 0 },
  bar: { flexDirection: "row", alignItems: "center", gap: 10 },
  grow: { flex: 1 },
  cancel: { minHeight: 44, justifyContent: "center" },
  clear: { width: 32, height: 32, alignItems: "center", justifyContent: "center" },
});
