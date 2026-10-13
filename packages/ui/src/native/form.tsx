// React Native: the same forms as the web (`createKrizakaForm`, the same schemas, the same errors' keys), on the native
// fields — TextField, Checkbox, DateField, Chip.Group, the system's Switch. A form is a View; Submit is the platform's
// Button; a refused submit announces its first error. Thin adapters: a new native control changes one here, never a form.
import { type BrandId, Button, Checkbox as CheckboxControl, Chip, DateField as DateFieldControl, type DateFieldLabels, ProductMark, Spinner, TextField as TextFieldControl, type TextFieldProps as TextFieldControlProps, Txt, useTheme } from "@krizaka/ui/native";
import * as React from "react";
import { AccessibilityInfo, KeyboardAvoidingView, Platform, Pressable, ScrollView, type StyleProp, StyleSheet, Switch as SwitchControl, type TextInput, View, type ViewStyle } from "react-native";

import {
  type FieldCheck,
  firstVisibleError,
  FormContext,
  type FormContextValue,
  type KrizakaField,
  type KrizakaFieldArray,
  makeCreateKrizakaForm,
  useFormContext,
  useFormStatus,
  useFormValue,
  useKrizakaField,
  useKrizakaFieldArray,
} from "../form/core";
import { formMessage } from "../form/errors";
import { currencySymbol, moneyInputText, parseMoney } from "../form/money";

type Base = {
  /** The field's name in the schema (typed by the form). */
  name: string;
  /** The visible label, passed translated (also the accessible name). */
  label: string;
  /** A help text under the control; the error takes its place when there is one. */
  hint?: string;
  /** Not available. */
  disabled?: boolean;
  /** Styles merged last, on the field. */
  style?: StyleProp<ViewStyle>;
};

export type FormProps = {
  /** The fields, the error and the button. */
  children?: React.ReactNode;
  /** The form's accessible name ("Create your account"), passed translated. */
  "aria-label"?: string;
  /** The form is the screen's scrolling content: it moves above the keyboard (iOS), keeps the focused field in view, and
   * a tap on a button works while the keyboard is open. Give the form `flex: 1` room (a screen). */
  scroll?: boolean;
  /** Styles merged last, on the form's view — or its scrolled content (a column with a 16-pt gap by default). */
  style?: StyleProp<ViewStyle>;
};

type ChainEntry = { key: string; focus: () => void; setLast: (last: boolean) => void };
type Chain = { register: (entry: ChainEntry) => () => void; next: (key: string) => void };
const ChainContext = React.createContext<Chain | null>(null);

/** The return key walks the text fields in the order they appeared; the last one's sends the form. */
function useChain(ctx: FormContextValue): Chain {
  const entries = React.useRef<ChainEntry[]>([]);
  return React.useMemo<Chain>(() => {
    const mark = () => entries.current.forEach((e, i) => e.setLast(i === entries.current.length - 1));
    return {
      register: (entry) => {
        entries.current = [...entries.current.filter((e) => e.key !== entry.key), entry];
        mark();
        return () => {
          entries.current = entries.current.filter((e) => e.key !== entry.key);
          mark();
        };
      },
      next: (key) => {
        const i = entries.current.findIndex((e) => e.key === key);
        const following = entries.current[i + 1];
        if (following) following.focus();
        else void submitAndAnnounce(ctx);
      },
    };
  }, [ctx]);
}

/** A text input of the form in the return-key chain: its ref, its return key (`next`, or `go` for the last), what it does. */
function useChained(override: { returnKeyType?: unknown; onSubmitEditing?: unknown }) {
  const chain = React.useContext(ChainContext);
  const key = React.useId();
  const ref = React.useRef<TextInput>(null);
  const [last, setLast] = React.useState(false);
  React.useLayoutEffect(() => chain?.register({ key, focus: () => ref.current?.focus(), setLast }), [chain, key]);
  if (!chain || override.returnKeyType !== undefined || override.onSubmitEditing !== undefined) return { inputRef: ref };
  return {
    inputRef: ref,
    returnKeyType: last ? ("go" as const) : ("next" as const),
    submitBehavior: last ? ("blurAndSubmit" as const) : ("submit" as const),
    onSubmitEditing: () => chain.next(key),
  };
}

async function submitAndAnnounce(ctx: FormContextValue) {
  if (await ctx.submit()) return;
  const message = firstVisibleError(ctx);
  if (message) AccessibilityInfo.announceForAccessibility(message);
}

function FormRoot({ value, children, style, scroll, "aria-label": label }: FormProps & { value: FormContextValue }) {
  const chain = useChain(value);
  const body = scroll ? (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.screen}>
      <ScrollView role="form" aria-label={label} keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets keyboardDismissMode="interactive" contentContainerStyle={[styles.form, style]}>
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  ) : (
    <View role="form" aria-label={label} style={[styles.form, style]}>
      {children}
    </View>
  );
  return (
    <FormContext.Provider value={value}>
      <ChainContext.Provider value={chain}>{body}</ChainContext.Provider>
    </FormContext.Provider>
  );
}

function Suggestion({ field }: { field: KrizakaField }) {
  const suggestion = field.errorDetail?.suggestion;
  if (!field.error || !suggestion) return null;
  return (
    <Pressable role="button" onPress={() => field.setValue(suggestion.value)} hitSlop={8} style={styles.suggestion}>
      <Txt variant="label" tone="accent">
        {suggestion.label}
      </Txt>
    </Pressable>
  );
}

export type SubmitProps = {
  /** The button's words, passed translated ("Create my account"). */
  label: string;
  /** The look. Default `primary`. */
  variant?: "primary" | "gradient" | "secondary" | "outline" | "ghost" | "danger";
  /** The product whose animated mark turns in the button while the form is sent (the brand's loader); the system's spinner otherwise. */
  brand?: BrandId;
  /** Styles merged last, on the button. */
  style?: StyleProp<ViewStyle>;
};

/** Sends the form: busy while it is sent (the product's mark turning, or a spinner); a refused submit announces its first error. */
export function Submit({ label, variant = "primary", brand, style }: SubmitProps) {
  const ctx = useFormContext();
  const { submitting } = useFormStatus();
  const mark = submitting && brand ? <ProductMark id={brand} size={18} animated /> : undefined;
  return <Button label={label} variant={variant} loading={submitting && !brand} disabled={submitting} aria-busy={submitting} icon={mark} style={style} onPress={() => void submitAndAnnounce(ctx)} />;
}

export type FormErrorProps = {
  /** A headline above the message, passed translated. */
  title?: string;
  /** Styles merged last. */
  style?: StyleProp<ViewStyle>;
};

/** The whole form's error — a refusal that belongs to no field (a conflict, too many tries, no network). */
export function FormError({ title, style }: FormErrorProps) {
  const ctx = useFormContext();
  const { theme, radius } = useTheme();
  if (!ctx.error) return null;
  return (
    <View role="alert" aria-live="assertive" style={[styles.alert, { borderRadius: radius.lg, borderColor: theme.danger, backgroundColor: theme.dangerSoft }, style]}>
      {title ? <Txt variant="label">{title}</Txt> : null}
      <Txt tone="secondary">{formMessage(ctx.error, ctx.i18n)}</Txt>
    </View>
  );
}

export type TextFieldProps = Base &
  Pick<TextFieldControlProps, "secureTextEntry" | "keyboardType" | "autoComplete" | "autoCapitalize" | "autoCorrect" | "textContentType" | "returnKeyType" | "onSubmitEditing" | "placeholder" | "maxLength" | "inputRef"> & {
    /** Cleans what is typed before it is stored (`(v) => v.toLowerCase()`). */
    transform?: (raw: string) => string;
    /** Checks the value on the server as it is typed (availability): an error key, or nothing when it is fine. */
    validateAsync?: FieldCheck<string>;
    /** The wait, in ms, before `validateAsync`. Default 350. */
    asyncDebounceMs?: number;
    /** The words once `validateAsync` accepted the value ("@eric is free"), passed translated. */
    availableHint?: string;
    /** The name of the wait while it checks ("Checking"), passed translated. */
    checkingLabel?: string;
  };

/** A text field of the form: its label, the input, the hint or the error, an optional check on the server. */
export function TextField({ name, label, hint, disabled, style, transform, validateAsync, asyncDebounceMs, availableHint, checkingLabel = "Checking", ...input }: TextFieldProps) {
  const f = useKrizakaField<string>(name, { validateAsync, asyncDebounceMs });
  const chained = useChained(input);
  const { theme } = useTheme();
  const end = f.validating ? <Spinner size="sm" label={checkingLabel} /> : f.available ? <Txt aria-hidden style={{ color: theme.successText }}>✓</Txt> : null;
  return (
    <View style={[styles.field, style]}>
      <TextFieldControl
        label={label}
        hint={f.available && availableHint ? (hint ? `${availableHint} · ${hint}` : availableHint) : hint}
        error={f.error}
        disabled={disabled}
        value={f.value ?? ""}
        onValueChange={(text) => f.setValue(transform ? transform(text) : text)}
        onBlur={f.onBlur}
        end={end}
        {...chained}
        {...input}
      />
      <Suggestion field={f} />
    </View>
  );
}

export type TextAreaProps = Base & {
  /** An example, passed translated. */
  placeholder?: string;
  /** The most characters. */
  maxLength?: number;
};

/** A longer text of the form (a bio, a description, a report). */
export function TextArea({ name, label, hint, disabled, style, ...input }: TextAreaProps) {
  const f = useKrizakaField<string>(name);
  return <TextFieldControl multiline label={label} hint={hint} error={f.error} disabled={disabled} value={f.value ?? ""} onValueChange={(t) => f.setValue(t)} onBlur={f.onBlur} style={style} {...input} />;
}

export type CheckboxProps = Omit<Base, "label" | "hint"> & {
  /** The words next to the box: text, or a `Txt` with links inside (then name it with `accessibleLabel`). */
  label: React.ReactNode;
  /** The accessible name when `label` is not plain text, passed translated. */
  accessibleLabel?: string;
};

/** A box of the form (`boolean`): terms to accept, an option. */
export function Checkbox({ name, label, accessibleLabel, disabled, style }: CheckboxProps) {
  const f = useKrizakaField<boolean>(name);
  return (
    <CheckboxControl
      label={accessibleLabel}
      checked={f.value === true}
      onCheckedChange={(c) => {
        f.setValue(c);
        f.onBlur();
      }}
      error={f.error}
      disabled={disabled}
      style={style}
    >
      {label}
    </CheckboxControl>
  );
}

/** An on/off setting of the form (`boolean`): its label and hint beside the system's switch. */
export function Switch({ name, label, hint, disabled, style }: Base) {
  const f = useKrizakaField<boolean>(name);
  const { theme } = useTheme();
  return (
    <View style={[styles.switchRow, style]}>
      <View style={styles.switchText}>
        <Txt variant="label">{label}</Txt>
        {f.error ? (
          <Txt variant="caption" tone="danger" role="alert">
            {f.error}
          </Txt>
        ) : hint ? (
          <Txt variant="caption" tone="secondary">
            {hint}
          </Txt>
        ) : null}
      </View>
      <SwitchControl
        aria-label={label}
        accessibilityHint={f.error ?? hint}
        value={f.value === true}
        disabled={disabled}
        onValueChange={(on) => {
          f.setValue(on);
          f.onBlur();
        }}
        trackColor={{ false: theme.surface3, true: theme.accent }}
        thumbColor={theme.textOnMedia}
        {...{ activeThumbColor: theme.textOnMedia }}
        ios_backgroundColor={theme.surface3}
      />
    </View>
  );
}

/** A choice of the form: the value stored and its words (passed translated). */
export type FormOption = { value: string; label: string; disabled?: boolean };

export type RadioGroupProps = Base & {
  /** The choices, as chips (one chosen). */
  options: readonly FormOption[];
  /** Scrolls the chips sideways instead of wrapping them (many choices). */
  scrollable?: boolean;
};

/** One choice among a few, as chips (a radio group). On native, `Select` is the same control. */
export function RadioGroup({ name, label, hint, disabled, style, options, scrollable }: RadioGroupProps) {
  const f = useKrizakaField<string>(name);
  return (
    <View style={[styles.field, style]}>
      <Txt variant="caption" tone="secondary" style={styles.groupLabel}>
        {label}
      </Txt>
      <Chip.Group
        type="single"
        aria-label={label}
        value={f.value ?? ""}
        disabled={disabled}
        scrollable={scrollable}
        onValueChange={(v) => {
          f.setValue(v);
          f.onBlur();
        }}
      >
        {options.map((o) => (
          <Chip key={o.value} value={o.value} disabled={o.disabled}>
            {o.label}
          </Chip>
        ))}
      </Chip.Group>
      {f.error ? (
        <Txt variant="caption" tone="danger" role="alert">
          {f.error}
        </Txt>
      ) : hint ? (
        <Txt variant="caption" tone="secondary">
          {hint}
        </Txt>
      ) : null}
    </View>
  );
}

/** One choice among several (the web's `<select>`): chips on native, scrolled sideways when they are many. */
export function Select(props: RadioGroupProps) {
  return <RadioGroup scrollable={props.options.length > 4} {...props} />;
}

export type DateFieldProps = Base & {
  /** The names of the boxes (`day`, `month`, `year`), passed translated. */
  labels?: Partial<DateFieldLabels>;
  /** `bday` for a date of birth. */
  autoComplete?: "bday" | "off";
};

/** A date of the form (`YYYY-MM-DD`): day, month and year typed in the locale's order — the schema checks it. */
export function DateField({ name, label, hint, disabled, style, labels, autoComplete }: DateFieldProps) {
  const f = useKrizakaField<string>(name);
  const chained = useChained({});
  return <DateFieldControl {...chained} returnKeyType={chained.returnKeyType} label={label} hint={hint} error={f.error} disabled={disabled} style={style} labels={labels} autoComplete={autoComplete} locale={f.locale} value={f.value ?? ""} onValueChange={(v) => f.setValue(v)} onBlur={f.onBlur} />;
}

export type MoneyProps = Base & {
  /** The currency (ISO 4217): its sign beside the amount, its decimals. */
  currency: string;
  /** An example of an amount, passed translated. */
  placeholder?: string;
};

/** An amount of the form, stored as integer minor units (cents), typed on the decimal keypad the locale's way. */
export function Money({ name, label, hint, disabled, style, currency, placeholder }: MoneyProps) {
  const f = useKrizakaField<number | null>(name);
  const [text, setText] = React.useState(() => moneyInputText(f.value, currency, f.locale));
  const [editing, setEditing] = React.useState(false);
  const chained = useChained({});
  return (
    <TextFieldControl
      {...chained}
      label={label}
      hint={hint}
      error={f.error}
      disabled={disabled}
      style={style}
      placeholder={placeholder}
      keyboardType="decimal-pad"
      value={editing ? text : moneyInputText(f.value, currency, f.locale)}
      end={<Txt tone="secondary">{currencySymbol(currency, f.locale)}</Txt>}
      onFocus={() => {
        setText(moneyInputText(f.value, currency, f.locale));
        setEditing(true);
      }}
      onValueChange={(next) => {
        setText(next);
        const units = parseMoney(next, currency, f.locale);
        f.setValue(units === undefined ? null : units === null ? Number.NaN : units);
      }}
      onBlur={() => {
        setEditing(false);
        f.onBlur();
      }}
    />
  );
}

export type FormFieldProps<T = unknown> = {
  /** The field's name in the schema (typed by the form). */
  name: string;
  /** Checks the value on the server as it changes. */
  validateAsync?: FieldCheck<T>;
  /** The wait, in ms, before `validateAsync`. */
  asyncDebounceMs?: number;
  /** Draws the field: its value, setter, error (`useKrizakaField`). */
  children: (field: KrizakaField<T>) => React.ReactNode;
};

/** A field drawn by the app (a control the package does not have). */
export function FormField({ name, validateAsync, asyncDebounceMs, children }: FormFieldProps) {
  return <>{children(useKrizakaField(name, { validateAsync, asyncDebounceMs }))}</>;
}

export type FieldArrayProps<T = unknown> = {
  /** The array's name in the schema (typed by the form). */
  name: string;
  /** Draws the items: `items`, `push`, `remove`, `move`, `fieldName(i, "url")`. */
  children: (array: KrizakaFieldArray<T>) => React.ReactNode;
};

/** A list of fields that grows and shrinks: each item's fields named `links[0].url`. */
export function FieldArray({ name, children }: FieldArrayProps) {
  return <>{children(useKrizakaFieldArray(name))}</>;
}

export type WatchProps<T = unknown> = {
  /** The field to follow (typed by the form). */
  name: string;
  /** Draws from its current value. */
  children: (value: T) => React.ReactNode;
};

/** Renders from a field's current value (a part shown only when a choice is made). */
export function Watch({ name, children }: WatchProps) {
  return <>{children(useFormValue(name))}</>;
}

const fields = { TextField, TextArea, Checkbox, Switch, RadioGroup, Select, DateField, Money, Field: FormField, FieldArray, Watch, Submit, FormError };

/** A form, defined once — the same schema and defaults as the web (`packages/core` of a product) — on native fields. */
export const createKrizakaForm = makeCreateKrizakaForm(fields, FormRoot);

export { useFormContext, useFormStatus, useFormValue, useKrizakaField, useKrizakaFieldArray };
export type { FieldCheck, KrizakaField, KrizakaFieldArray };
export { isRealDate, latestBirthDate } from "../date-picker/parts";
export type { FormActionResult, FormOutput, FormSchema, FormValues, KrizakaFormFactory, KrizakaFormInstance } from "../form/core";
export { type FormFieldError, type FormI18n, formMessage, formMessages, type FormProblem } from "../form/errors";

const styles = StyleSheet.create({
  form: { gap: 16, alignSelf: "stretch" },
  screen: { flex: 1, alignSelf: "stretch" },
  field: { gap: 6, alignSelf: "stretch" },
  suggestion: { alignSelf: "flex-start", minHeight: 32, justifyContent: "center" },
  alert: { borderWidth: 1, padding: 12, gap: 4 },
  switchRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 16, minHeight: 44 },
  switchText: { flex: 1, gap: 2 },
  groupLabel: { fontWeight: "600" },
});
