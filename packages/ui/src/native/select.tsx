import * as React from "react";
import { Pressable, ScrollView, type StyleProp, StyleSheet, Text, TextInput, View, type ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";

import { Sheet } from "./sheet";
import { useTheme } from "./theme";

/** An option: the value stored and its words (passed translated), a line under them. */
export type SelectOption = { value: string; label: string; description?: string; disabled?: boolean };

function Chevron({ color }: { color: string }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <Path d="m6 9 6 6 6-6" />
    </Svg>
  );
}

function Tick({ color }: { color: string }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <Path d="M20 6 9 17l-5-5" />
    </Svg>
  );
}

type FieldShared = {
  /** The visible label, passed translated (the field's name). */
  label: string;
  /** Shown while nothing is chosen ("Choose a category"), passed translated. */
  placeholder?: string;
  /** A help text under the field. */
  hint?: string;
  /** An error under the field: a danger edge, read and announced. Replaces the hint. */
  error?: string;
  /** Not available. */
  disabled?: boolean;
  /** Called when the sheet closes (the field is left). */
  onBlur?: () => void;
  /** Styles merged last, on the field. */
  style?: StyleProp<ViewStyle>;
};

/** The field that opens the sheet: a well with the label above, the value (or the placeholder), a chevron. */
function Trigger({ shared, text, onPress, open }: { shared: FieldShared; text: string | null; onPress: () => void; open: boolean }) {
  const { theme, radius } = useTheme();
  const { label, placeholder, hint, error, disabled } = shared;
  const caption = error ?? hint;
  return (
    <View style={[styles.field, shared.style]}>
      <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text>
      <Pressable
        role="button"
        aria-label={`${label}, ${text ?? placeholder ?? ""}`.replace(/, $/, "")}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-disabled={disabled || undefined}
        accessibilityHint={caption}
        disabled={disabled}
        onPress={onPress}
        style={[styles.trigger, { borderRadius: radius.md, backgroundColor: theme.surface2, borderColor: error ? theme.danger : open ? theme.accent : theme.borderDefault }, disabled ? styles.disabled : null]}
      >
        <Text numberOfLines={1} style={[styles.triggerText, { color: text ? theme.textPrimary : theme.textSecondary }]}>
          {text ?? placeholder ?? ""}
        </Text>
        <Chevron color={theme.textSecondary} />
      </Pressable>
      {caption ? (
        <Text role={error ? "alert" : undefined} aria-live={error ? "polite" : undefined} style={[styles.caption, { color: error ? theme.dangerText : theme.textSecondary }]}>
          {caption}
        </Text>
      ) : null}
    </View>
  );
}

/** The options as rows of the sheet: radios (one) or checkboxes (several), each 48 pt. */
function Options({ options, isChosen, onPick, multiple }: { options: readonly SelectOption[]; isChosen: (v: string) => boolean; onPick: (o: SelectOption) => void; multiple?: boolean }) {
  const { theme, radius, haptic } = useTheme();
  return (
    <ScrollView role={multiple ? "list" : "radiogroup"} keyboardShouldPersistTaps="handled" style={styles.options}>
      {options.map((o) => {
        const chosen = isChosen(o.value);
        return (
          <Pressable
            key={o.value}
            role={multiple ? "checkbox" : "radio"}
            aria-checked={chosen}
            aria-label={o.description ? `${o.label}, ${o.description}` : o.label}
            aria-disabled={o.disabled || undefined}
            disabled={o.disabled}
            onPress={() => {
              haptic("selection");
              onPick(o);
            }}
            style={({ pressed }) => [styles.option, { borderRadius: radius.md, backgroundColor: chosen ? theme.accentSoft : pressed ? theme.surface3 : "transparent" }, o.disabled ? styles.disabled : null]}
          >
            <View style={styles.optionText}>
              <Text style={[styles.optionLabel, { color: theme.textPrimary, fontWeight: chosen ? "700" : "500" }]}>{o.label}</Text>
              {o.description ? <Text style={[styles.caption, { color: theme.textSecondary }]}>{o.description}</Text> : null}
            </View>
            {chosen ? <Tick color={theme.accentText} /> : null}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

export type SelectProps = FieldShared & {
  /** The choices. */
  options: readonly SelectOption[];
  /** The chosen value (controlled); `null` or `""` for none. */
  value?: string | null;
  /** The chosen value at first, uncontrolled. */
  defaultValue?: string | null;
  /** Called with the value picked. */
  onValueChange?: (value: string) => void;
  /** The sheet's title. Default: the label. */
  sheetTitle?: string;
};

/** One choice among many — the web `<select>`: a field that opens a sheet of options; picking one closes it. */
export function Select({ options, value: valueProp, defaultValue = null, onValueChange, sheetTitle, ...shared }: SelectProps) {
  const [own, setOwn] = React.useState<string | null>(defaultValue);
  const value = valueProp !== undefined ? valueProp : own;
  const [open, setOpen] = React.useState(false);
  const close = () => {
    setOpen(false);
    shared.onBlur?.();
  };
  return (
    <>
      <Trigger shared={shared} text={options.find((o) => o.value === value)?.label ?? null} open={open} onPress={() => setOpen(true)} />
      <Sheet open={open} onOpenChange={(o) => (o ? setOpen(true) : close())} title={sheetTitle ?? shared.label}>
        <Options
          options={options}
          isChosen={(v) => v === value}
          onPick={(o) => {
            if (valueProp === undefined) setOwn(o.value);
            onValueChange?.(o.value);
            close();
          }}
        />
      </Sheet>
    </>
  );
}

export type ComboboxLabels = {
  /** The search box's name and placeholder ("Search"). */
  search: string;
  /** While a search runs ("Searching…"). */
  loading: string;
  /** When nothing matches ("No results"). */
  empty: string;
  /** The button that closes a multiple choice ("Done"). */
  done: string;
};

export const comboboxLabels: ComboboxLabels = { search: "Search", loading: "Searching…", empty: "No results", done: "Done" };

export type ComboboxProps = FieldShared & {
  /** The options, filtered by what is typed. */
  options?: readonly SelectOption[];
  /** Fetches the options for a query (debounced 250 ms, aborted by a newer one). */
  onSearch?: (query: string, signal: AbortSignal) => Promise<readonly SelectOption[]>;
  /** Several values (`string[]`, checkboxes, a Done button); one by default. */
  multiple?: boolean;
  /** The chosen value(s) (controlled): a string, or strings with `multiple`. */
  value?: string | readonly string[] | null;
  /** Called with the value — or the values — chosen. */
  onValueChange?: (value: string | string[]) => void;
  /** The words, passed translated; English by default. */
  labels?: Partial<ComboboxLabels>;
};

/** A choice among many, searched: a field that opens a sheet with a search box and the matching options. */
export function Combobox({ options = [], onSearch, multiple, value, onValueChange, labels: given, ...shared }: ComboboxProps) {
  const labels = { ...comboboxLabels, ...given };
  const { theme, radius } = useTheme();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [found, setFound] = React.useState<readonly SelectOption[] | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [seen, setSeen] = React.useState<Record<string, SelectOption>>({});
  const chosen: string[] = value == null ? [] : typeof value === "string" ? (value ? [value] : []) : [...value];
  React.useEffect(() => {
    if (!onSearch || !open) return;
    const controller = new AbortController();
    const timer = setTimeout(() => {
      setLoading(true);
      onSearch(query, controller.signal)
        .then((result) => {
          if (!controller.signal.aborted) setFound(result);
        })
        .catch(() => undefined)
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false);
        });
    }, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, onSearch, open]);
  const q = query.trim().toLowerCase();
  const list = onSearch ? (found ?? []) : options.filter((o) => !q || o.label.toLowerCase().includes(q));
  const labelOf = (v: string) => options.find((o) => o.value === v)?.label ?? seen[v]?.label ?? v;
  const close = () => {
    setOpen(false);
    setQuery("");
    shared.onBlur?.();
  };
  return (
    <>
      <Trigger shared={shared} text={chosen.length ? chosen.map(labelOf).join(", ") : null} open={open} onPress={() => setOpen(true)} />
      <Sheet open={open} onOpenChange={(o) => (o ? setOpen(true) : close())} title={shared.label}>
        <TextInput
          aria-label={labels.search}
          placeholder={labels.search}
          placeholderTextColor={theme.textMuted}
          value={query}
          onChangeText={setQuery}
          autoFocus
          autoCorrect={false}
          returnKeyType="search"
          style={[styles.search, { borderRadius: radius.md, backgroundColor: theme.surface2, borderColor: theme.borderDefault, color: theme.textPrimary }]}
        />
        {loading ? <Text style={[styles.caption, { color: theme.textSecondary }]}>{labels.loading}</Text> : null}
        {!loading && list.length === 0 ? <Text style={[styles.caption, { color: theme.textSecondary }]}>{labels.empty}</Text> : null}
        <Options
          options={list}
          multiple={multiple}
          isChosen={(v) => chosen.includes(v)}
          onPick={(o) => {
            setSeen((known) => ({ ...known, [o.value]: o }));
            if (multiple) onValueChange?.(chosen.includes(o.value) ? chosen.filter((v) => v !== o.value) : [...chosen, o.value]);
            else {
              onValueChange?.(o.value);
              close();
            }
          }}
        />
        {multiple ? (
          <Pressable role="button" onPress={close} style={[styles.done, { borderRadius: radius.md, backgroundColor: theme.accent }]}>
            <Text style={[styles.doneText, { color: theme.onAccent }]}>{labels.done}</Text>
          </Pressable>
        ) : null}
      </Sheet>
    </>
  );
}

const styles = StyleSheet.create({
  field: { gap: 6, alignSelf: "stretch" },
  label: { fontSize: 12, lineHeight: 16, fontWeight: "600" },
  trigger: { minHeight: 48, flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 14, borderWidth: 1 },
  triggerText: { flex: 1, fontSize: 16 },
  caption: { fontSize: 12, lineHeight: 16 },
  options: { flexGrow: 0 },
  option: { minHeight: 48, flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 12, paddingVertical: 8 },
  optionText: { flex: 1, gap: 2 },
  optionLabel: { fontSize: 16 },
  search: { height: 44, paddingHorizontal: 12, borderWidth: 1, fontSize: 16 },
  done: { height: 48, alignItems: "center", justifyContent: "center" },
  doneText: { fontSize: 15, fontWeight: "700" },
  disabled: { opacity: 0.4 },
});
