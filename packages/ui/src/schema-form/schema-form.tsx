"use client";
// Client (the answers, what has been touched). A form drawn from a JSON Schema: the fields come from `fieldsFromSchema`
// (pure), are drawn on the package's own fields (`Field`, `Input`, `Select`, `Textarea`, `Switch`, `MoneyInput`), checked
// by the schema's rules, and handed to the host as a typed payload. The host keeps what is its own — uploads, pickers —
// through `renderField`. Words are props; the block never fetches and never reads the clock.
import * as React from "react";

import { Button } from "../button/button";
import { cn } from "../cn";
import { Field, Input, Select, Textarea } from "../field/field";
import { MoneyInput } from "../money-input/money-input";
import { Switch } from "../switch/switch";
import { checkValues, fieldsFromSchema, initialValues, payloadOf, type SchemaField, type SchemaFormMessages } from "./schema";

/** What a custom field receives to draw itself. */
export interface SchemaFieldContext {
  /** An id to wire the label (`htmlFor`) and the description. */
  id: string;
  /** The raw answer: a string, a boolean, or integer cents for a money field. */
  value: unknown;
  setValue: (value: unknown) => void;
  /** The refusal to show, or `null`. */
  error: string | null;
  disabled: boolean;
}

export interface SchemaFormWords {
  /** The submit button: « Run ». */
  submit: string;
  /** The fold of the `x-advanced` fields: « More options ». */
  advanced: string;
}

export interface SchemaFormProps extends Omit<React.ComponentProps<"form">, "onSubmit" | "children"> {
  /** The JSON Schema object (or its JSON text): `properties`, `required`, `x-i18n`, `x-advanced`. */
  schema: unknown;
  /** BCP 47 language for the `x-i18n` words and the money: `"fr-CA"`. */
  locale: string;
  /** The words, passed translated. */
  words: SchemaFormWords;
  /** The checks' words, passed translated. */
  messages: SchemaFormMessages;
  /** Answers to start from, by field key (over the schema's defaults). */
  values?: Record<string, unknown>;
  /** Called with the typed payload once every field passes. */
  onSubmit: (payload: Record<string, unknown>) => void;
  /** The form is being submitted: the fields are blocked and the button shows progress (no second submit). */
  submitting?: boolean;
  /** Draws a field in the host's way (an upload, a picker); return `undefined` for the default. */
  renderField?: (field: SchemaField, context: SchemaFieldContext) => React.ReactNode;
  /** Beside the submit button: a cost line, a note. */
  footer?: React.ReactNode;
}

function FieldControl({ field, ctx, locale }: Readonly<{ field: SchemaField; ctx: SchemaFieldContext; locale: string }>) {
  const { id, value, setValue, error, disabled } = ctx;
  const describedBy = [field.description ? `${id}-help` : null, error ? `${id}-error` : null].filter(Boolean).join(" ") || undefined;
  const common = { id, disabled, "aria-describedby": describedBy, "aria-required": field.required || undefined } as const;
  const text = typeof value === "string" ? value : "";
  switch (field.kind) {
    case "boolean":
      return <Switch id={id} disabled={disabled} aria-describedby={describedBy} checked={value === true} onCheckedChange={setValue} />;
    case "select":
      return (
        <Select {...common} invalid={!!error} value={text} onChange={(e) => setValue(e.target.value)}>
          {!field.required && <option value="" />}
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
      );
    case "textarea":
      return <Textarea {...common} invalid={!!error} value={text} maxLength={field.maxLength ?? undefined} placeholder={field.placeholder ?? undefined} onChange={(e) => setValue(e.target.value)} />;
    case "money":
      return <MoneyInput {...common} invalid={!!error} value={typeof value === "number" ? value : null} onValueChange={setValue} currency={field.currency} locale={locale} />;
    case "number":
    case "integer":
      return <Input {...common} invalid={!!error} type="text" inputMode={field.kind === "integer" ? "numeric" : "decimal"} value={text} placeholder={field.placeholder ?? undefined} onChange={(e) => setValue(e.target.value)} />;
    case "date":
      return <Input {...common} invalid={!!error} type="date" value={text} onChange={(e) => setValue(e.target.value)} />;
    default:
      return <Input {...common} invalid={!!error} type="text" value={text} maxLength={field.maxLength ?? undefined} placeholder={field.placeholder ?? undefined} onChange={(e) => setValue(e.target.value)} />;
  }
}

/** A form from a JSON Schema: typed fields, the schema's rules, `x-i18n` words, `x-advanced` folded. */
export function SchemaForm({ schema, locale, words, messages, values: given, onSubmit, submitting = false, renderField, footer, className, ...props }: Readonly<SchemaFormProps>) {
  const base = React.useId();
  const fields = React.useMemo(() => fieldsFromSchema(schema, locale), [schema, locale]);
  const [answers, setAnswers] = React.useState(() => initialValues(fields, given));
  const [shown, setShown] = React.useState<Set<string>>(() => new Set());
  const errors = React.useMemo(() => checkValues(fields, answers, messages), [fields, answers, messages]);
  const formRef = React.useRef<HTMLFormElement>(null);
  const draw = (field: SchemaField) => {
    const id = `${base}-${field.key}`;
    const error = shown.has(field.key) ? (errors[field.key] ?? null) : null;
    const ctx: SchemaFieldContext = { id, value: answers[field.key], setValue: (v) => setAnswers((a) => ({ ...a, [field.key]: v })), error, disabled: submitting };
    const custom = renderField?.(field, ctx);
    const inline = field.kind === "boolean";
    return (
      <Field.Root key={field.key} data-field={field.key} data-kind={field.kind} onBlur={() => setShown((s) => (s.has(field.key) ? s : new Set(s).add(field.key)))}>
        <div className={cn(inline && "flex items-center justify-between gap-3")}>
          <Field.Label htmlFor={id}>
            {field.title}
            {field.required && <span aria-hidden> *</span>}
          </Field.Label>
          {inline && (custom ?? <FieldControl field={field} ctx={ctx} locale={locale} />)}
        </div>
        {!inline && (custom ?? <FieldControl field={field} ctx={ctx} locale={locale} />)}
        {field.description && <Field.Hint id={`${id}-help`}>{field.description}</Field.Hint>}
        {error && <Field.Error id={`${id}-error`}>{error}</Field.Error>}
      </Field.Root>
    );
  };
  const main = fields.filter((f) => !f.advanced);
  const more = fields.filter((f) => f.advanced);
  return (
    <form
      ref={formRef}
      noValidate
      data-schema-form=""
      className={cn("flex flex-col gap-4", className)}
      onSubmit={(event) => {
        event.preventDefault();
        if (submitting) return;
        const failing = Object.keys(errors);
        if (failing.length > 0) {
          setShown(new Set(fields.map((f) => f.key)));
          const first = fields.find((f) => errors[f.key]);
          if (first) formRef.current?.querySelector<HTMLElement>(`[data-field="${first.key}"] :is(input,select,textarea,button[role=switch])`)?.focus();
          return;
        }
        onSubmit(payloadOf(fields, answers));
      }}
      {...props}
    >
      <div className="flex flex-col gap-3">{main.map(draw)}</div>
      {more.length > 0 && (
        <details className="rounded-lg border border-border px-3 py-2" open={more.some((f) => shown.has(f.key) && errors[f.key]) || undefined}>
          <summary className="cursor-pointer select-none text-sm font-medium text-fg-secondary">{words.advanced}</summary>
          <div className="mt-3 flex flex-col gap-3">{more.map(draw)}</div>
        </details>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0 text-xs text-fg-secondary">{footer}</div>
        <Button type="submit" variant="primary" size="md" loading={submitting}>
          {words.submit}
        </Button>
      </div>
    </form>
  );
}
