import * as React from "react";
import { Pressable, type StyleProp, StyleSheet, TextInput, type TextInputProps, View, type ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";

import { BottomSheet } from "./bottom-sheet";
import { useTheme } from "./theme";
import { Txt } from "./txt";

type FieldContextValue = { id: string; label: string; invalid: boolean; describedBy?: string };
const FieldContext = React.createContext<FieldContextValue | null>(null);

export type FieldProps = {
  /** The label above the control — passed translated; it names the control. */
  label: string;
  /** A hint under the control (the format, a limit). */
  hint?: string;
  /** The error, under the control; marks it invalid and is announced. */
  error?: string;
  /** Marks the label as required (`*` is decorative: the control says it). */
  required?: boolean;
  /** The control: `Input`, `Textarea`, `Select`. */
  children: React.ReactNode;
  /** Styles merged last. */
  style?: StyleProp<ViewStyle>;
};

/** A label, a control, a hint and an error — the web `Field`: the control inside is named by the label and described by the words under it. */
export function Field({ label, hint, error, required, children, style }: FieldProps) {
  const id = React.useId();
  const value = React.useMemo(() => ({ id, label: required ? `${label}, *` : label, invalid: Boolean(error), describedBy: error ?? hint }), [id, label, required, error, hint]);
  return (
    <FieldContext.Provider value={value}>
      <View style={[styles.field, style]}>
        <Txt variant="label" nativeID={`${id}-label`}>
          {label}
          {required ? <Txt tone="danger"> *</Txt> : null}
        </Txt>
        {children}
        {error ? (
          <Txt variant="caption" tone="danger" role="alert">
            {error}
          </Txt>
        ) : hint ? (
          <Txt variant="caption" tone="secondary">
            {hint}
          </Txt>
        ) : null}
      </View>
    </FieldContext.Provider>
  );
}

function useControlFrame(invalidProp?: boolean) {
  const field = React.useContext(FieldContext);
  const { theme, radius } = useTheme();
  const [focused, setFocused] = React.useState(false);
  const invalid = invalidProp ?? field?.invalid ?? false;
  const frame: ViewStyle = {
    borderRadius: radius.md,
    borderWidth: focused || invalid ? 2 : StyleSheet.hairlineWidth * 2,
    borderColor: invalid ? theme.danger : focused ? theme.ring : theme.borderDefault,
    backgroundColor: theme.surface2,
    // The material: what you fill is a well.
    borderTopColor: invalid ? theme.danger : focused ? theme.ring : theme.edgeWell,
  };
  return { field, theme, invalid, frame, focus: { onFocus: () => setFocused(true), onBlur: () => setFocused(false) } };
}

export type InputProps = Omit<TextInputProps, "style"> & {
  /** Marks it invalid (inside a `Field`, its `error` does). */
  invalid?: boolean;
  /** Before the text: a currency, an icon (decorative). */
  leading?: React.ReactNode;
  /** After the text: a unit, a button. */
  trailing?: React.ReactNode;
  /** Styles merged last, on the frame. */
  style?: StyleProp<ViewStyle>;
};

/** A text input on the platform's keyboard, 44 points high, named by its `Field` — the web `Input`. Follows Dynamic Type. */
export const Input = React.forwardRef<TextInput, InputProps>(function Input({ invalid, leading, trailing, style, onFocus, onBlur, ...props }, ref) {
  const { field, theme, invalid: bad, frame, focus } = useControlFrame(invalid);
  return (
    <View style={[styles.frame, frame, style]}>
      {leading ? <View aria-hidden>{leading}</View> : null}
      <TextInput
        ref={ref}
        aria-label={field?.label}
        aria-invalid={bad || undefined}
        accessibilityHint={field?.describedBy}
        placeholderTextColor={theme.textMuted}
        {...props}
        onFocus={(e) => {
          focus.onFocus();
          onFocus?.(e);
        }}
        onBlur={(e) => {
          focus.onBlur();
          onBlur?.(e);
        }}
        style={[styles.input, { color: theme.textPrimary }]}
      />
      {trailing}
    </View>
  );
});

export type TextareaProps = InputProps & {
  /** Lines shown before it scrolls. Default 4. */
  rows?: number;
};

/** Several lines of text — the web `Textarea`. */
export const Textarea = React.forwardRef<TextInput, TextareaProps>(function Textarea({ rows = 4, ...props }, ref) {
  return <Input ref={ref} multiline textAlignVertical="top" {...props} style={[{ minHeight: 22 * rows + 20, alignItems: "flex-start", paddingVertical: 10 }, props.style]} />;
});

export type SelectOption<T extends string> = { value: T; label: string; disabled?: boolean };

export type SelectProps<T extends string> = {
  /** The choices — `label` passed translated. */
  options: readonly SelectOption<T>[];
  /** The chosen value (controlled); `null` for none. */
  value: T | null;
  /** Called with the chosen value. */
  onValueChange: (value: T) => void;
  /** Shown while nothing is chosen. */
  placeholder?: string;
  /** Marks it invalid. */
  invalid?: boolean;
  /** Cannot be opened. */
  disabled?: boolean;
  /** The sheet's title — default: the field's label. */
  title?: string;
  /** Styles merged last, on the frame. */
  style?: StyleProp<ViewStyle>;
};

/**
 * A choice in a list — the web `Select`. It opens a bottom sheet of options (React Native has no system picker without a
 * native module); the chosen one is checked, a light tick confirms it.
 */
export function Select<T extends string>({ options, value, onValueChange, placeholder, invalid, disabled, title, style }: SelectProps<T>) {
  const { field, theme, frame } = useControlFrame(invalid);
  const { haptics } = useTheme();
  const [open, setOpen] = React.useState(false);
  const chosen = options.find((o) => o.value === value);
  const name = title ?? field?.label ?? placeholder ?? "";
  return (
    <>
      <Pressable
        role="combobox"
        aria-label={field?.label}
        aria-expanded={open}
        aria-disabled={disabled}
        disabled={disabled}
        accessibilityHint={field?.describedBy}
        onPress={() => setOpen(true)}
        style={[styles.frame, frame, disabled ? styles.disabled : null, style]}
      >
        <Txt style={styles.flex} tone={chosen ? "text" : "muted"} numberOfLines={1}>
          {chosen?.label ?? placeholder ?? ""}
        </Txt>
        <Svg width={16} height={16} viewBox="0 0 24 24" aria-hidden>
          <Path d="m6 9 6 6 6-6" stroke={theme.textSecondary} strokeWidth={2.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      </Pressable>
      <BottomSheet open={open} onOpenChange={setOpen} title={name} snapPoints={[Math.min(0.85, 0.2 + options.length * 0.075)]}>
        <View role="radiogroup" aria-label={name}>
          {options.map((option) => {
            const selected = option.value === value;
            return (
              <Pressable
                key={option.value}
                role="radio"
                aria-checked={selected}
                aria-disabled={option.disabled}
                disabled={option.disabled}
                onPress={() => {
                  haptics.selection();
                  onValueChange(option.value);
                  setOpen(false);
                }}
                style={({ pressed }) => [styles.option, { backgroundColor: pressed ? theme.surface2 : "transparent", opacity: option.disabled ? 0.4 : 1 }]}
              >
                <Txt style={styles.flex} variant={selected ? "label" : "body"}>
                  {option.label}
                </Txt>
                {selected ? (
                  <Svg width={18} height={18} viewBox="0 0 24 24" aria-hidden>
                    <Path d="M5 12.5l4.5 4.5L19 7.5" stroke={theme.accent} strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </Svg>
                ) : null}
              </Pressable>
            );
          })}
        </View>
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  field: { gap: 6, width: "100%" },
  frame: { flexDirection: "row", alignItems: "center", gap: 8, minHeight: 44, paddingHorizontal: 12 },
  input: { flex: 1, fontSize: 15, paddingVertical: 10, minHeight: 40 },
  flex: { flex: 1 },
  disabled: { opacity: 0.5 },
  option: { flexDirection: "row", alignItems: "center", gap: 12, minHeight: 48, paddingHorizontal: 8, borderRadius: 10 },
});
