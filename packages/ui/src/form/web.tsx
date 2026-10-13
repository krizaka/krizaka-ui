// Client. The form's fields for the web: thin adapters from a form field (useKrizakaField) to the platform's current
// primitives — Field + Input, Checkbox, Switch, RadioGroup (dots, cards, tactile keys, segments), Combobox, the date
// pickers (calendar, typed, wheels), TagInput, Dropzone, Slider. A new look for a primitive changes an adapter here,
// never a form.
import { Alert } from "@krizaka/ui/alert";
import { Button, type ButtonProps } from "@krizaka/ui/button";
import { Checkbox as CheckboxControl } from "@krizaka/ui/checkbox";
import { Combobox as ComboboxControl, type ComboboxLabels, type ComboboxOption } from "@krizaka/ui/combobox";
import { DateField as DatePartsControl, DatePicker, type DatePickerLabels, DateWheel } from "@krizaka/ui/date-picker";
import { Field, Input, Select as SelectControl, Textarea } from "@krizaka/ui/field";
import { Dropzone, formatBytes } from "@krizaka/ui/file-upload";
import { RadioGroup as RadioGroupControl } from "@krizaka/ui/radio-group";
import { Slider as SliderControl, type SliderMark, type SliderValue } from "@krizaka/ui/slider";
import { Spinner } from "@krizaka/ui/spinner";
import { Switch as SwitchControl } from "@krizaka/ui/switch";
import { TagInput as TagInputControl, type TagInputProps } from "@krizaka/ui/tag-input";
import * as React from "react";

import type { DatePart } from "../date-picker/parts";
import {
  type FieldCheck,
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
} from "./core";
import { formMessage } from "./errors";
import { currencySymbol, moneyInputText, parseMoney } from "./money";

type Base = {
  /** The field's name in the schema: `email`, `address.city`, `links[0].url` (typed by the form). */
  name: string;
  /** The visible label, passed translated (also the control's accessible name). */
  label: string;
  /** A help text under the control, read with it; the error takes its place when there is one. */
  hint?: string;
  /** Not available. */
  disabled?: boolean;
  /** Classes merged on the field's root. */
  className?: string;
};

const ids = (f: KrizakaField, hint?: string) => [hint && !f.error ? f.hintId : null, f.error ? f.errorId : null].filter(Boolean).join(" ") || undefined;

function Caption({ field, hint, ok }: { field: KrizakaField; hint?: string; ok?: string }) {
  const suggestion = field.errorDetail?.suggestion;
  if (field.error)
    return (
      <Field.Error id={field.errorId}>
        <span>
          {field.error}
          {suggestion ? (
            <>
              {" "}
              <button type="button" className="font-semibold text-accent-text underline underline-offset-2" onClick={() => field.setValue(suggestion.value)}>
                {suggestion.label}
              </button>
            </>
          ) : null}
        </span>
      </Field.Error>
    );
  const text = field.available && ok ? (hint ? `${ok} · ${hint}` : ok) : hint;
  return text ? <Field.Hint id={field.hintId}>{text}</Field.Hint> : null;
}

const Check = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 text-fg-success" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export type FormProps = Omit<React.ComponentProps<"form">, "onSubmit" | "noValidate"> & {
  /** The fields, the error and the button. */
  children?: React.ReactNode;
};

/** The `<form>` of a form (`form.Form`): `noValidate` (the schema validates), the first error focused after a refused submit. */
function FormRoot({ value, className, children, ...props }: FormProps & { value: FormContextValue }) {
  const ref = React.useRef<HTMLFormElement>(null);
  return (
    <FormContext.Provider value={value}>
      <form
        ref={ref}
        noValidate
        className={className ?? "flex flex-col gap-4"}
        onSubmit={async (event) => {
          event.preventDefault();
          if (!(await value.submit())) requestAnimationFrame(() => ref.current?.querySelector<HTMLElement>('[aria-invalid="true"], [data-invalid] input')?.focus());
        }}
        {...props}
      >
        {children}
      </form>
    </FormContext.Provider>
  );
}

export type SubmitProps = Omit<ButtonProps, "type" | "loading"> & {
  /** The button's words, passed translated ("Create my account"). */
  children: React.ReactNode;
};

/** The submit button: busy while the form is sent (not pressable twice), never disabled for an invalid form. */
export function Submit({ variant = "primary", children, ...props }: SubmitProps) {
  const { submitting } = useFormStatus();
  return (
    <Button type="submit" variant={variant} loading={submitting} {...props}>
      {children}
    </Button>
  );
}

export type FormErrorProps = {
  /** A headline above the message ("We could not create your account"), passed translated. */
  title?: string;
  /** Classes merged on the alert. */
  className?: string;
};

/** The whole form's error — a refusal of the server that belongs to no field (a conflict, too many tries, no network). */
export function FormError({ title, className }: FormErrorProps) {
  const ctx = useFormContext();
  if (!ctx.error) return null;
  return (
    <Alert tone="danger" title={title} className={className}>
      {formMessage(ctx.error, ctx.i18n)}
    </Alert>
  );
}

export type TextFieldProps = Base & {
  /** `text` (default), `email`, `password`, `url`, `tel`, `search`: the right keyboard on a phone. */
  type?: "text" | "email" | "password" | "url" | "tel" | "search";
  /** The browser's autofill (`email`, `username`, `new-password`, `name`). */
  autoComplete?: string;
  /** An example of a value, passed translated — never the label. */
  placeholder?: string;
  /** The keyboard on a phone (`numeric`, `decimal`). */
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  /** The most characters. */
  maxLength?: number;
  /** Cleans what is typed before it is stored (`(v) => v.toLowerCase().replace(/\s+/g, "_")`). */
  transform?: (raw: string) => string;
  /** Checks the value on the server as it is typed (availability): an error key, or nothing when it is fine. */
  validateAsync?: FieldCheck<string>;
  /** The wait, in ms, between the last key and `validateAsync`. Default 350. */
  asyncDebounceMs?: number;
  /** The words once `validateAsync` accepted the value ("@eric is free"), passed translated. */
  availableHint?: string;
  /** The name of the wait while it checks ("Checking"), passed translated. */
  checkingLabel?: string;
  /** Something before the text (an `@`, an icon). */
  start?: React.ReactNode;
};

/** A text field of the form: label, input, hint or error, an optional check on the server. */
export function TextField({ name, label, hint, disabled, className, type = "text", transform, validateAsync, asyncDebounceMs, availableHint, checkingLabel = "Checking", start, ...input }: TextFieldProps) {
  const f = useKrizakaField<string>(name, { validateAsync, asyncDebounceMs });
  const end = f.validating ? <Spinner size="sm" label={checkingLabel} /> : f.available ? <Check /> : null;
  return (
    <Field.Root className={className}>
      <Field.Label htmlFor={f.id}>{label}</Field.Label>
      <span className="relative flex items-center">
        {start ? <span className="pointer-events-none absolute left-3 text-fg-muted">{start}</span> : null}
        <Input
          id={f.id}
          name={name}
          type={type}
          value={f.value ?? ""}
          disabled={disabled}
          invalid={Boolean(f.error)}
          aria-describedby={ids(f, hint ?? availableHint)}
          onChange={(event) => f.setValue(transform ? transform(event.target.value) : event.target.value)}
          onBlur={f.onBlur}
          className={[start ? "pl-9" : "", end ? "pr-10" : ""].join(" ").trim() || undefined}
          {...input}
        />
        {end ? <span className="absolute right-3 flex">{end}</span> : null}
      </span>
      <Caption field={f} hint={hint} ok={availableHint} />
    </Field.Root>
  );
}

export type TextAreaProps = Base & {
  /** An example of a value, passed translated. */
  placeholder?: string;
  /** The visible lines. Default 4. */
  rows?: number;
  /** The most characters. */
  maxLength?: number;
};

/** A longer text of the form (a bio, a description, a report). */
export function TextArea({ name, label, hint, disabled, className, rows = 4, ...input }: TextAreaProps) {
  const f = useKrizakaField<string>(name);
  return (
    <Field.Root className={className}>
      <Field.Label htmlFor={f.id}>{label}</Field.Label>
      <Textarea id={f.id} name={name} rows={rows} value={f.value ?? ""} disabled={disabled} invalid={Boolean(f.error)} aria-describedby={ids(f, hint)} onChange={(e) => f.setValue(e.target.value)} onBlur={f.onBlur} {...input} />
      <Caption field={f} hint={hint} />
    </Field.Root>
  );
}

export type CheckboxProps = Omit<Base, "label"> & {
  /** The words next to the box, clickable with it — text, or a sentence with links (terms, privacy). */
  label: React.ReactNode;
};

/** A box of the form (`boolean`): terms to accept, an option. */
export function Checkbox({ name, label, hint, disabled, className }: CheckboxProps) {
  const f = useKrizakaField<boolean>(name);
  return (
    <div className={className ?? "flex flex-col gap-1.5"}>
      <CheckboxControl id={f.id} name={name} checked={f.value === true} disabled={disabled} invalid={Boolean(f.error)} aria-describedby={ids(f, hint)} onCheckedChange={(c) => f.setValue(c === true)} onBlur={f.onBlur}>
        {label}
      </CheckboxControl>
      <Caption field={f} hint={hint} />
    </div>
  );
}

/** An on/off setting of the form (`boolean`): the label and its hint beside the switch. */
export function Switch({ name, label, hint, disabled, className }: Base) {
  const f = useKrizakaField<boolean>(name);
  return (
    <div className={className ?? "flex items-start justify-between gap-4"}>
      <div className="flex min-w-0 flex-col gap-0.5">
        <Field.Label htmlFor={f.id} className="text-sm font-medium text-fg">
          {label}
        </Field.Label>
        <Caption field={f} hint={hint} />
      </div>
      <SwitchControl id={f.id} name={name} checked={f.value === true} disabled={disabled} invalid={Boolean(f.error)} aria-describedby={ids(f, hint)} onCheckedChange={(c) => f.setValue(c)} onBlur={f.onBlur} />
    </div>
  );
}

/** A choice of the form: the value stored, its words (passed translated), a line under them. */
export type FormOption = { value: string; label: string; description?: string; disabled?: boolean };

export type RadioGroupProps = Base & {
  /** The choices, all visible (two to five). */
  options: readonly FormOption[];
  /**
   * `list` (a dot and its words, default), `cards` (a whole card is the radio: an amount, a plan, an audience),
   * `buttons` (tactile keys that press in: a size, a tip; `description` is the key's second line) or `segmented`
   * (two to four short choices on one line).
   */
  variant?: "list" | "cards" | "buttons" | "segmented";
  /** `vertical` (default) or `horizontal`. */
  orientation?: "vertical" | "horizontal";
};

/** One choice among a few, all visible. */
export function RadioGroup({ name, label, hint, disabled, className, options, variant = "list", orientation = "vertical" }: RadioGroupProps) {
  const f = useKrizakaField<string>(name);
  return (
    <Field.Root className={className} role="group" aria-labelledby={`${f.id}-label`}>
      <span id={`${f.id}-label`} className="text-xs font-semibold text-fg-secondary">
        {label}
      </span>
      <RadioGroupControl.Root
        aria-labelledby={`${f.id}-label`}
        value={f.value ?? ""}
        onValueChange={(v) => f.setValue(v)}
        onBlur={f.onBlur}
        orientation={orientation}
        disabled={disabled}
        invalid={Boolean(f.error)}
        aria-describedby={ids(f, hint)}
        name={name}
        variant={variant}
        className={variant === "segmented" ? "self-start" : undefined}
      >
        {options.map((o) =>
          variant === "cards" ? (
            <RadioGroupControl.Card key={o.value} value={o.value} disabled={o.disabled}>
              <span className="font-semibold">{o.label}</span>
              {o.description ? <span className="text-xs text-fg-secondary">{o.description}</span> : null}
            </RadioGroupControl.Card>
          ) : variant === "buttons" ? (
            <RadioGroupControl.Button key={o.value} value={o.value} disabled={o.disabled} hint={o.description}>
              {o.label}
            </RadioGroupControl.Button>
          ) : variant === "segmented" ? (
            <RadioGroupControl.Segment key={o.value} value={o.value} disabled={o.disabled}>
              {o.label}
            </RadioGroupControl.Segment>
          ) : (
            <RadioGroupControl.Item key={o.value} value={o.value} disabled={o.disabled}>
              {o.label}
              {o.description ? <span className="block text-xs text-fg-secondary">{o.description}</span> : null}
            </RadioGroupControl.Item>
          ),
        )}
      </RadioGroupControl.Root>
      <Caption field={f} hint={hint} />
    </Field.Root>
  );
}

export type SelectProps = Base & {
  /** The choices, in the platform's own menu (a country, a category). */
  options: readonly FormOption[];
  /** The first line while nothing is chosen ("Choose a category"), passed translated. */
  placeholder?: string;
};

/** One choice among many, in the platform's menu (`<select>`: accessible and right on phones). */
export function Select({ name, label, hint, disabled, className, options, placeholder }: SelectProps) {
  const f = useKrizakaField<string>(name);
  return (
    <Field.Root className={className}>
      <Field.Label htmlFor={f.id}>{label}</Field.Label>
      <SelectControl id={f.id} name={name} value={f.value ?? ""} disabled={disabled} invalid={Boolean(f.error)} aria-describedby={ids(f, hint)} onChange={(e) => f.setValue(e.target.value)} onBlur={f.onBlur}>
        {placeholder !== undefined ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.map((o) => (
          <option key={o.value} value={o.value} disabled={o.disabled}>
            {o.label}
          </option>
        ))}
      </SelectControl>
      <Caption field={f} hint={hint} />
    </Field.Root>
  );
}

export type ComboboxProps = Base & {
  /** The options, filtered as the person types. */
  options?: readonly ComboboxOption[];
  /** Fetches the options for a query (debounced, aborted by a newer one). */
  onSearch?: (query: string, signal: AbortSignal) => Promise<readonly ComboboxOption[]>;
  /** Several values (`string[]`), shown as chips; one (`string`) by default. */
  multiple?: boolean;
  /** Offers to create the query as a value. */
  creatable?: boolean;
  /** The input's placeholder, passed translated. */
  placeholder?: string;
  /** The words of the control, passed translated. */
  labels?: Partial<ComboboxLabels>;
};

/** A choice among many, typed to filter or fetched: one value (`string`) or several (`string[]`). */
export function Combobox({ name, label, hint, disabled, className, options = [], onSearch, multiple, creatable, placeholder, labels }: ComboboxProps) {
  const f = useKrizakaField<string | string[]>(name);
  // The options chosen from a search, by value: their labels once the search has moved on.
  const [seen, setSeen] = React.useState<Record<string, ComboboxOption>>({});
  const option = (value: string) => options.find((o) => o.value === value) ?? seen[value] ?? { value, label: value };
  const remember = (o: ComboboxOption) => setSeen((known) => (known[o.value] === o ? known : { ...known, [o.value]: o }));
  const shared = { id: f.id, label, hint, error: f.error, disabled, placeholder, labels, options, onSearch, creatable, name };
  return (
    <div className={className} onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node | null) && f.onBlur()}>
      {multiple ? (
        <ComboboxControl
          {...shared}
          multiple
          value={((f.value as string[] | undefined) ?? []).map(option)}
          onValueChange={(next) => {
            next.forEach(remember);
            f.setValue(next.map((o) => o.value));
          }}
        />
      ) : (
        <ComboboxControl
          {...shared}
          value={f.value ? option(f.value as string) : null}
          onValueChange={(next) => {
            if (next) remember(next);
            f.setValue(next?.value ?? "");
          }}
        />
      )}
    </div>
  );
}

export type DateFieldProps = Base & {
  /**
   * `calendar` (default: a date near today — a publication, an appointment), `parts` (day · month · year typed: a
   * memorable date, a birth date) or `wheel` (three wheels bounded by `min` / `max`: a birth date on a phone).
   */
  entry?: "calendar" | "parts" | "wheel";
  /** The earliest date (ISO), for the calendar and the wheels. */
  min?: string;
  /** The latest date (ISO), for the calendar and the wheels (`latestBirthDate(18)` for an age gate). */
  max?: string;
  /** The words of the calendar, or the names of the parts (`day`, `month`, `year`), passed translated. */
  labels?: Partial<DatePickerLabels> & Partial<Record<DatePart, string>>;
  /** `bday` for a date of birth: typed boxes are autofilled; the wheels rest on 1 January 2000 until turned. */
  autoComplete?: "bday" | "off";
};

/** A date of the form (`YYYY-MM-DD`, `""` for none): a calendar, day · month · year typed, or wheels. */
export function DateField({ name, label, hint, disabled, className, entry = "calendar", min, max, labels, autoComplete }: DateFieldProps) {
  const f = useKrizakaField<string>(name);
  const onBlur = (e: React.FocusEvent<HTMLElement>) => !e.currentTarget.contains(e.relatedTarget as Node | null) && f.onBlur();
  if (entry === "calendar")
    return (
      <div className={className} onBlur={onBlur}>
        <DatePicker label={label} hint={hint} error={f.error} disabled={disabled} name={name} locale={f.locale} min={min} max={max} labels={labels} value={f.value || null} onValueChange={(v) => f.setValue(v ?? "")} />
      </div>
    );
  if (entry === "wheel")
    return (
      <div className={className} onBlur={onBlur}>
        <DateWheel label={label} hint={hint} error={f.error} disabled={disabled} name={name} locale={f.locale} min={min} max={max} labels={labels} defaultView={autoComplete === "bday" ? "2000-01-01" : undefined} value={f.value || null} onValueChange={(v) => f.setValue(v)} />
      </div>
    );
  return <DatePartsControl label={label} hint={hint} error={f.error} disabled={disabled} name={name} locale={f.locale} labels={labels} autoComplete={autoComplete} className={className} value={f.value ?? ""} onValueChange={(v) => f.setValue(v)} onBlur={f.onBlur} />;
}

export type TagsProps = Base & Pick<TagInputProps, "suggestions" | "normalize" | "max" | "separators" | "placeholder" | "labels">;

/** Free words of the form as chips (`string[]`): tags, keywords. */
export function TagInput({ name, label, hint, disabled, className, ...props }: TagsProps) {
  const f = useKrizakaField<string[]>(name);
  return (
    <div className={className} onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node | null) && f.onBlur()}>
      <TagInputControl label={label} hint={hint} error={f.error} disabled={disabled} name={name} value={f.value ?? []} onValueChange={(tags) => f.setValue(tags)} {...props} />
    </div>
  );
}

export type FileUploadProps = Omit<Base, "hint"> & {
  /** The title in the zone ("Drop your video here"), passed translated. */
  title: string;
  /** The button that opens the file picker, passed translated. */
  browseLabel: string;
  /** What is accepted, in words ("MP4 or MOV, up to 4 GB"). */
  hint?: string;
  /** The types accepted (`video/*`, `image/png,.pdf`). */
  accept?: string;
  /** The largest file, in bytes. */
  maxSize?: number;
  /** Several files (`File[]`, up to `maxFiles`); one by default (still a `File[]` of one). */
  multiple?: boolean;
  /** The most files. */
  maxFiles?: number;
  /** The name of a file's remove button (`(name) => "Remove " + name`), passed translated. */
  removeLabel: (fileName: string) => string;
  /** The words of a refused file (`(r) => r.file.name + " is too large"`). */
  refusalLabel?: React.ComponentProps<typeof Dropzone>["refusalLabel"];
};

/** Files of the form (`File[]`): a drop zone, then the chosen files, each removable. */
export function FileUpload({ name, label, hint, disabled, className, title, browseLabel, accept, maxSize, multiple, maxFiles, removeLabel, refusalLabel }: FileUploadProps) {
  const f = useKrizakaField<File[]>(name);
  const files = f.value ?? [];
  return (
    <div className={className ?? "flex flex-col gap-2"} role="group" aria-label={label} onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node | null) && f.onBlur()}>
      <span className="text-xs font-semibold text-fg-secondary">{label}</span>
      <Dropzone
        title={title}
        browseLabel={browseLabel}
        hint={hint}
        accept={accept}
        maxSize={maxSize}
        multiple={multiple}
        maxFiles={maxFiles}
        disabled={disabled}
        refusalLabel={refusalLabel}
        onFiles={(chosen) => f.setValue(multiple ? [...files, ...chosen].slice(0, maxFiles ?? Infinity) : chosen.slice(0, 1))}
      />
      {files.length > 0 ? (
        <ul className="flex flex-col gap-1.5">
          {files.map((file, i) => (
            <li key={`${file.name}-${i}`} className="flex items-center justify-between gap-3 rounded-lg border border-border-default bg-surface-1 px-3 py-2 text-sm">
              <span className="min-w-0 truncate text-fg">{file.name}</span>
              <span className="flex shrink-0 items-center gap-2">
                <span className="font-mono text-xs text-fg-secondary">{formatBytes(file.size, f.locale)}</span>
                <Button type="button" size="sm" variant="ghost" onClick={() => f.setValue(files.filter((_, j) => j !== i))}>
                  {removeLabel(file.name)}
                </Button>
              </span>
            </li>
          ))}
        </ul>
      ) : null}
      {f.error ? <Field.Error id={f.errorId}>{f.error}</Field.Error> : null}
    </div>
  );
}

export type MoneyProps = Base & {
  /** The currency (ISO 4217: `USD`, `EUR`, `JPY`): its sign before the amount, its decimals. */
  currency: string;
  /** An example of an amount, passed translated. */
  placeholder?: string;
};

/** An amount of the form, stored as integer minor units (cents: `1250` = 12.50), typed the locale's way. */
export function Money({ name, label, hint, disabled, className, currency, placeholder }: MoneyProps) {
  const f = useKrizakaField<number | null>(name);
  const [text, setText] = React.useState(() => moneyInputText(f.value, currency, f.locale));
  const [editing, setEditing] = React.useState(false);
  const shown = editing ? text : moneyInputText(f.value, currency, f.locale);
  return (
    <Field.Root className={className}>
      <Field.Label htmlFor={f.id}>{label}</Field.Label>
      <span className="relative flex items-center">
        <span className="pointer-events-none absolute left-3 text-sm text-fg-secondary" aria-hidden>
          {currencySymbol(currency, f.locale)}
        </span>
        <Input
          id={f.id}
          name={name}
          inputMode="decimal"
          value={shown}
          placeholder={placeholder}
          disabled={disabled}
          invalid={Boolean(f.error)}
          aria-describedby={ids(f, hint)}
          className="pl-9 tabular-nums"
          onFocus={() => {
            setText(moneyInputText(f.value, currency, f.locale));
            setEditing(true);
          }}
          onChange={(e) => {
            setText(e.target.value);
            const units = parseMoney(e.target.value, currency, f.locale);
            f.setValue(units === undefined ? null : units === null ? Number.NaN : units);
          }}
          onBlur={() => {
            setEditing(false);
            f.onBlur();
          }}
        />
      </span>
      <Caption field={f} hint={hint} />
    </Field.Root>
  );
}

export type SliderProps = Base & {
  /** The lowest value. Default 0. */
  min?: number;
  /** The highest value. Default 100. */
  max?: number;
  /** The step. Default 1. */
  step?: number;
  /** The value as words ("15 %", "3 min"), shown and read. */
  formatValue?: (value: number) => string;
  /** For a range (`[number, number]`): each thumb's name, passed translated. */
  thumbLabels?: [string, string];
  /** A graduation per step (`true`) or at the values given. */
  ticks?: boolean | readonly number[];
  /** Words under the track at some values. */
  marks?: readonly SliderMark[];
};

/** A number (or a range) of the form, chosen by feel: a share, a volume, a price range — the value floats while it is touched. */
export function Slider({ name, label, hint, disabled, className, min, max, step, formatValue, thumbLabels, ticks, marks }: SliderProps) {
  const f = useKrizakaField<SliderValue>(name);
  return (
    <div className={className ?? "flex flex-col gap-1.5"}>
      <SliderControl label={label} showLabel floatingValue value={f.value} min={min} max={max} step={step} ticks={ticks} marks={marks} disabled={disabled} formatValue={formatValue} thumbLabels={thumbLabels} aria-describedby={ids(f, hint)} onValueChange={(v) => f.setValue(v)} onValueCommit={() => f.onBlur()} />
      <Caption field={f} hint={hint} />
    </div>
  );
}

export type FormFieldProps<T = unknown> = {
  /** The field's name in the schema (typed by the form). */
  name: string;
  /** Checks the value on the server as it changes. */
  validateAsync?: FieldCheck<T>;
  /** The wait, in ms, before `validateAsync`. */
  asyncDebounceMs?: number;
  /** Draws the field: its value, setter, error and ids (`useKrizakaField`). */
  children: (field: KrizakaField<T>) => React.ReactNode;
};

/** A field drawn by the app (a control the package does not have): the form's value, errors and ids, any markup. */
export function FormField({ name, validateAsync, asyncDebounceMs, children }: FormFieldProps) {
  return <>{children(useKrizakaField(name, { validateAsync, asyncDebounceMs }))}</>;
}

export type FieldArrayProps<T = unknown> = {
  /** The array's name in the schema (typed by the form). */
  name: string;
  /** Draws the items: `items`, `push`, `remove`, `move`, `fieldName(i, "url")` for the fields of an item. */
  children: (array: KrizakaFieldArray<T>) => React.ReactNode;
};

/** A list of fields that grows and shrinks (links, tiers, guests): each item's fields named `links[0].url`. */
export function FieldArray({ name, children }: FieldArrayProps) {
  return <>{children(useKrizakaFieldArray(name))}</>;
}

export type WatchProps<T = unknown> = {
  /** The field to follow (typed by the form). */
  name: string;
  /** Draws from its current value: show a part of the form only when a box is ticked. */
  children: (value: T) => React.ReactNode;
};

/** Renders from a field's current value (a part shown only when a box is ticked, a total). */
export function Watch({ name, children }: WatchProps) {
  return <>{children(useFormValue(name))}</>;
}

const fields = { TextField, TextArea, Checkbox, Switch, RadioGroup, Select, Combobox, DateField, TagInput, FileUpload, Money, Slider, Field: FormField, FieldArray, Watch, Submit, FormError };

/**
 * A form, defined once: its schema (zod 4) and default values — the same schema the server parses with. In a component,
 * `signUp.useForm({ onSubmit })` gives the form and its fields, typed by the schema: `<form.Form>`, `<form.TextField
 * name="email" …/>`, `<form.Submit>`. Errors are i18n keys (`form.errors.tooShort`), never the engine's English.
 */
export const createKrizakaForm = makeCreateKrizakaForm(fields, FormRoot);

/** The form sent by a Server Action: `useFormWithAction(signUp, createAccount)` — `signUp.useFormWithAction(createAccount)`. */
export function useFormWithAction<F extends { useFormWithAction: (...args: never[]) => unknown }>(form: F, ...args: Parameters<F["useFormWithAction"]>): ReturnType<F["useFormWithAction"]> {
  return form.useFormWithAction(...args) as ReturnType<F["useFormWithAction"]>;
}
