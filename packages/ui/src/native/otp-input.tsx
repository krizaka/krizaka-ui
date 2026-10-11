import * as React from "react";
import { Pressable, type StyleProp, StyleSheet, TextInput, View, type ViewStyle } from "react-native";

import { useTheme } from "./theme";
import { Txt } from "./txt";

export type OtpInputProps = {
  /** The accessible name (“Verification code”) — passed translated. */
  label: string;
  /** How many characters. Default 6. */
  length?: number;
  /** The code (controlled). */
  value?: string;
  /** Called on every change with the code typed so far. */
  onValueChange?: (code: string) => void;
  /** Called once all the characters are there (check it here); a tick confirms. */
  onComplete?: (code: string) => void;
  /** `numeric` (default) or `text` (letters and digits). */
  mode?: "numeric" | "text";
  /** The code was refused: the boxes turn to danger, and an error tick. */
  invalid?: boolean;
  /** Cannot be typed in (checking). */
  disabled?: boolean;
  /** Focus it when shown. */
  autoFocus?: boolean;
  /** Styles merged last. */
  style?: StyleProp<ViewStyle>;
};

/**
 * A one-time code in boxes — one real input underneath, so the keyboard's suggestion of the code from a message
 * (iOS `oneTimeCode`, Android `sms-otp`) and pasting fill every box at once; the caret shows in the next empty box.
 */
export function OtpInput({ label, length = 6, value, onValueChange, onComplete, mode = "numeric", invalid, disabled, autoFocus, style }: OtpInputProps) {
  const { theme, radius, haptics } = useTheme();
  const [own, setOwn] = React.useState("");
  const code = value ?? own;
  const [focused, setFocused] = React.useState(false);
  const input = React.useRef<TextInput>(null);
  React.useEffect(() => {
    if (invalid) haptics.notification("error");
  }, [invalid, haptics]);
  const change = (raw: string) => {
    const next = (mode === "numeric" ? raw.replace(/\D/g, "") : raw.replace(/\s/g, "").toUpperCase()).slice(0, length);
    if (value === undefined) setOwn(next);
    onValueChange?.(next);
    if (next.length === length && code.length !== length) {
      haptics.notification("success");
      onComplete?.(next);
    }
  };
  return (
    <Pressable onPress={() => input.current?.focus()} disabled={disabled} accessible={false} style={[styles.root, style]}>
      <View style={styles.boxes} aria-hidden>
        {Array.from({ length }, (_, i) => {
          const active = focused && i === Math.min(code.length, length - 1);
          return (
            <View
              key={i}
              style={[
                styles.box,
                {
                  borderRadius: radius.md,
                  backgroundColor: theme.surface2,
                  borderColor: invalid ? theme.danger : active ? theme.ring : theme.borderDefault,
                  borderWidth: invalid || active ? 2 : 1,
                },
              ]}
            >
              <Txt variant="title">{code[i] ?? ""}</Txt>
            </View>
          );
        })}
      </View>
      <TextInput
        ref={input}
        aria-label={label}
        aria-invalid={invalid || undefined}
        value={code}
        onChangeText={change}
        maxLength={length}
        editable={!disabled}
        autoFocus={autoFocus}
        keyboardType={mode === "numeric" ? "number-pad" : "default"}
        textContentType="oneTimeCode"
        autoComplete={mode === "numeric" ? "sms-otp" : "one-time-code"}
        autoCapitalize="characters"
        autoCorrect={false}
        caretHidden
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={styles.hidden}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { alignSelf: "flex-start" },
  boxes: { flexDirection: "row", gap: 8 },
  box: { width: 46, height: 56, alignItems: "center", justifyContent: "center" },
  hidden: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, opacity: 0.011, color: "transparent" },
});
