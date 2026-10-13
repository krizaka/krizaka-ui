import * as React from "react";
import { type StyleProp, StyleSheet, Text, TextInput, View, type ViewStyle } from "react-native";

import { useTheme } from "./theme";

type Part = "day" | "month" | "year";
const LENGTH: Record<Part, number> = { day: 2, month: 2, year: 4 };

export type DateFieldLabels = {
  /** The name of the day's box. */
  day: string;
  /** The name of the month's box. */
  month: string;
  /** The name of the year's box. */
  year: string;
};

export const dateFieldLabels: DateFieldLabels = { day: "Day", month: "Month", year: "Year" };

/** The order of day, month and year in a locale (`en-US` → month, day, year; `fr` → day, month, year). */
export function datePartsOrder(locale: string): Part[] {
  try {
    const parts = new Intl.DateTimeFormat(locale, { day: "2-digit", month: "2-digit", year: "numeric" }).formatToParts(new Date(2001, 10, 22));
    const order = parts.map((p) => p.type).filter((t): t is Part => t === "day" || t === "month" || t === "year");
    if (order.length === 3) return order;
  } catch {
    // An engine without Intl's parts: day, month, year.
  }
  return ["day", "month", "year"];
}

/** The ISO-ordered value of what was typed: `""` when nothing is, `YYYY-MM-DD` otherwise (not necessarily a real date). */
export function composeDate(parts: Record<Part, string>): string {
  if (!parts.day && !parts.month && !parts.year) return "";
  const pad = (v: string) => (v.length === 1 ? `0${v}` : v);
  return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}`;
}

const split = (value: string | undefined): Record<Part, string> => {
  const m = /^(\d*)-(\d*)-(\d*)$/.exec(value ?? "");
  return m ? { year: m[1]!, month: m[2]!, day: m[3]! } : { day: "", month: "", year: "" };
};

export type DateFieldProps = {
  /** The visible label of the date, passed translated (the group's accessible name). */
  label: string;
  /** A help text under the boxes ("For example, 27 3 1990"). */
  hint?: string;
  /** An error under the boxes: a danger border and caption, read with them and announced. Replaces the hint. */
  error?: string;
  /** The date, `YYYY-MM-DD` (controlled); `""` for none. What is typed comes back in the same order, real date or not: the schema decides. */
  value?: string;
  /** The date at first, uncontrolled. */
  defaultValue?: string;
  /** Called on every key with the date typed so far (`""` when the boxes are empty). */
  onValueChange?: (value: string) => void;
  /** Called when focus leaves the last box. */
  onBlur?: () => void;
  /** The locale that orders the boxes (day · month · year, or month · day · year). Default `en-US`. */
  locale?: string;
  /** The names of the boxes, passed translated; English by default. */
  labels?: Partial<DateFieldLabels>;
  /** `bday` for a date of birth: the system offers to fill it. */
  autoComplete?: "bday" | "off";
  /** Not available. */
  disabled?: boolean;
  /** Styles merged last, on the field. */
  style?: StyleProp<ViewStyle>;
};

/**
 * A date typed as day, month and year — a memorable date (a birth date, an expiry) that a calendar would make slow to
 * reach: numeric keypads, the boxes in the locale's order, the next box focused once one is full. No native module.
 */
export function DateField({ label, hint, error, value, defaultValue, onValueChange, onBlur, locale = "en-US", labels: given, autoComplete, disabled, style }: DateFieldProps) {
  const { theme, radius } = useTheme();
  const labels = { ...dateFieldLabels, ...given };
  const order = React.useMemo(() => datePartsOrder(locale), [locale]);
  const [parts, setParts] = React.useState(() => split(value ?? defaultValue));
  const [focused, setFocused] = React.useState<Part | null>(null);
  const refs = { day: React.useRef<TextInput>(null), month: React.useRef<TextInput>(null), year: React.useRef<TextInput>(null) };
  // A value set from outside (a reset, a suggestion) replaces what is in the boxes.
  if (value !== undefined && value !== composeDate(parts) && composeDate(split(value)) === value) setParts(split(value));
  const caption = error ?? hint;

  const change = (part: Part, text: string) => {
    const digits = text.replace(/\D/g, "").slice(0, LENGTH[part]);
    const next = { ...parts, [part]: digits };
    setParts(next);
    onValueChange?.(composeDate(next));
    const following = order[order.indexOf(part) + 1];
    if (digits.length === LENGTH[part] && following) refs[following].current?.focus();
  };

  return (
    <View role="group" aria-label={label} style={[styles.root, disabled ? styles.disabled : null, style]}>
      <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text>
      <View style={styles.row}>
        {order.map((part, i) => (
          <View key={part} style={part === "year" ? styles.yearBox : styles.box}>
            <Text style={[styles.part, { color: theme.textSecondary }]}>{labels[part]}</Text>
            <TextInput
              ref={refs[part]}
              aria-label={`${label}, ${labels[part]}`}
              accessibilityHint={caption}
              value={parts[part]}
              editable={!disabled}
              keyboardType="number-pad"
              inputMode="numeric"
              maxLength={LENGTH[part]}
              autoComplete={autoComplete === "bday" ? (`birthdate-${part}` as const) : "off"}
              returnKeyType={i === order.length - 1 ? "done" : "next"}
              onSubmitEditing={() => {
                const following = order[i + 1];
                if (following) refs[following].current?.focus();
              }}
              onChangeText={(text) => change(part, text)}
              onFocus={() => setFocused(part)}
              onBlur={() => {
                setFocused(null);
                if (i === order.length - 1) onBlur?.();
              }}
              style={[
                styles.input,
                { color: theme.textPrimary, backgroundColor: theme.surface2, borderRadius: radius.md, borderColor: error ? theme.danger : focused === part ? theme.accent : theme.borderDefault },
              ]}
            />
          </View>
        ))}
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
  row: { flexDirection: "row", gap: 10 },
  box: { width: 64, gap: 4 },
  yearBox: { width: 88, gap: 4 },
  part: { fontSize: 11, lineHeight: 14 },
  input: { height: 44, borderWidth: 1, paddingHorizontal: 10, fontSize: 16, fontVariant: ["tabular-nums"], textAlign: "center" },
  caption: { fontSize: 12, lineHeight: 16 },
  disabled: { opacity: 0.5 },
});
