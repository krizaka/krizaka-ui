// Pure: no React, no clock. A JSON Schema (an object of properties) read into the fields a form draws, and the checks that
// the schema states. Extracted from Orazaka's run form (`useInputSchema`): the same vocabulary — `required`, `enum` and
// `oneOf` of `const`, `x-i18n` words by language, `x-advanced` folded — without the studio's own parts.

/** What a field is drawn as. */
export type SchemaFieldKind = "text" | "textarea" | "number" | "integer" | "boolean" | "select" | "date" | "money" | "list";

/** One field of the form, derived from a property of the schema. */
export interface SchemaField {
  key: string;
  kind: SchemaFieldKind;
  /** The title in the page's language (`x-i18n`), else the schema's `title`, else the key. */
  title: string;
  /** A line of help under the field. */
  description: string | null;
  /** An example of what to type. */
  placeholder: string | null;
  required: boolean;
  /** `x-advanced`: folded under « more options ». */
  advanced: boolean;
  /** A closed list: `enum` or `oneOf` of `const`, with the labels of the language. */
  options: { value: string; label: string }[] | null;
  min: number | null;
  max: number | null;
  minLength: number | null;
  maxLength: number | null;
  maxItems: number | null;
  pattern: string | null;
  /** The ISO 4217 code of a `money` field (`x-money.currency`, default CAD). */
  currency: string;
  /** The value the form starts on, when the schema states one. */
  defaultValue: unknown;
}

interface Words {
  title?: string;
  description?: string;
  placeholder?: string;
  options?: Record<string, string | { label?: string }>;
}
type Raw = Record<string, unknown>;

// @fixed: the schema's own threshold between a line and a text area (Orazaka's studio form: over 500 characters)
const MULTILINE_OVER = 500;

const obj = (v: unknown): Raw | null => (v && typeof v === "object" && !Array.isArray(v) ? (v as Raw) : null);
const str = (v: unknown) => (typeof v === "string" && v.trim() !== "" ? v : null);
const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : null);

/** The words of a language: that language (`fr-CA` → `fr`), else English, else nothing. */
function wordsFor(i18n: unknown, locale: string): Words | null {
  const by = obj(i18n);
  if (!by) return null;
  return (obj(by[locale]) ?? obj(by[locale.split("-")[0] ?? ""]) ?? obj(by.en)) as Words | null;
}

function optionsOf(spec: Raw, words: Words | null): SchemaField["options"] {
  const label = (value: string) => {
    const w = words?.options?.[value];
    return typeof w === "string" ? w : (w?.label ?? null);
  };
  if (Array.isArray(spec.enum)) return spec.enum.map(String).map((value) => ({ value, label: label(value) ?? value }));
  const one = spec.oneOf;
  if (Array.isArray(one) && one.length > 0 && one.every((e) => obj(e) && "const" in (e as Raw))) {
    return (one as Raw[]).map((e) => ({ value: String(e.const), label: label(String(e.const)) ?? str(e.title) ?? String(e.const) }));
  }
  return null;
}

function kindOf(spec: Raw, options: SchemaField["options"]): SchemaFieldKind | null {
  const items = obj(spec.items);
  if (options) return "select";
  if (spec["x-money"] || spec.format === "money") return "money";
  switch (spec.type) {
    case "boolean":
      return "boolean";
    case "integer":
      return "integer";
    case "number":
      return "number";
    case "array":
      return items && (items.type === undefined || items.type === "string") ? "list" : null;
    case "string":
    case undefined:
      if (spec.format === "date") return "date";
      return (num(spec.maxLength) ?? 0) > MULTILINE_OVER ? "textarea" : "text";
    default:
      return null;
  }
}

/** The fields of a JSON Schema object, in the schema's order. A property the form cannot draw (a nested object…) is left out. */
export function fieldsFromSchema(schema: unknown, locale: string): SchemaField[] {
  let root = obj(schema);
  if (typeof schema === "string") {
    try {
      root = obj(JSON.parse(schema));
    } catch {
      root = null;
    }
  }
  const properties = obj(root?.properties);
  if (!properties) return [];
  const required = new Set(Array.isArray(root?.required) ? root.required.map(String) : []);
  const fields: SchemaField[] = [];
  for (const [key, raw] of Object.entries(properties)) {
    const spec = obj(raw);
    if (!spec) continue;
    const words = wordsFor(spec["x-i18n"], locale);
    const options = optionsOf(spec, words);
    const kind = kindOf(spec, options);
    if (!kind) continue;
    fields.push({
      key,
      kind,
      title: words?.title ?? str(spec.title) ?? key,
      description: words?.description ?? str(spec.description),
      placeholder: words?.placeholder ?? null,
      required: required.has(key),
      advanced: spec["x-advanced"] === true,
      options,
      min: num(spec.minimum),
      max: num(spec.maximum),
      minLength: num(spec.minLength),
      maxLength: num(spec.maxLength),
      maxItems: num(spec.maxItems),
      pattern: str(spec.pattern),
      currency: str(obj(spec["x-money"])?.currency) ?? "CAD",
      defaultValue: spec.default ?? null,
    });
  }
  return fields;
}

/** The words of the checks, passed translated. `{min}`, `{max}` are filled. */
export interface SchemaFormMessages {
  required: string;
  /** « At least {min} characters. » */
  tooShort: string;
  /** « At most {max} characters. » */
  tooLong: string;
  /** « Not below {min}. » */
  belowMin: string;
  /** « Not above {max}. » */
  aboveMax: string;
  /** « Not a number. » */
  notANumber: string;
  /** « Not in the expected form. » */
  badPattern: string;
  /** « At most {max} items. » */
  tooMany: string;
}

const fill = (template: string, vars: Record<string, number>) => template.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? ""));

/** A list typed as « a, b, c »: its items. */
export const listItems = (text: string) => text.split(",").map((s) => s.trim()).filter(Boolean);

const asNumber = (text: string) => Number(text.replace(",", "."));

function checkNumber(field: SchemaField, text: string, m: SchemaFormMessages): string | null {
  const n = asNumber(text);
  if (!Number.isFinite(n) || (field.kind === "integer" && !Number.isInteger(n))) return m.notANumber;
  if (field.min !== null && n < field.min) return fill(m.belowMin, { min: field.min });
  if (field.max !== null && n > field.max) return fill(m.aboveMax, { max: field.max });
  return null;
}

function checkText(field: SchemaField, text: string, m: SchemaFormMessages): string | null {
  if (field.minLength !== null && text.length < field.minLength) return fill(m.tooShort, { min: field.minLength });
  if (field.maxLength !== null && text.length > field.maxLength) return fill(m.tooLong, { max: field.maxLength });
  if (field.pattern !== null && !new RegExp(field.pattern, "u").test(text)) return m.badPattern;
  return null;
}

/** The raw answer of a field as the form holds it (a string, a boolean, or cents), checked against the schema's rules. Returns the message, or null. */
export function checkField(field: SchemaField, value: unknown, m: SchemaFormMessages): string | null {
  if (field.kind === "boolean") return null;
  const empty = field.kind === "money" ? value === null || value === undefined : textOf(value) === "";
  if (empty) return field.required ? m.required : null;
  if (field.kind === "money") return null;
  const text = textOf(value);
  if (field.kind === "number" || field.kind === "integer") return checkNumber(field, text, m);
  if (field.kind === "list") return field.maxItems !== null && listItems(text).length > field.maxItems ? fill(m.tooMany, { max: field.maxItems }) : null;
  return checkText(field, text, m);
}

/** The messages of every field that fails; an empty object is a valid form. */
export function checkValues(fields: readonly SchemaField[], values: Record<string, unknown>, m: SchemaFormMessages): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const field of fields) {
    const message = checkField(field, values[field.key], m);
    if (message) errors[field.key] = message;
  }
  return errors;
}

const textOf = (v: unknown) => (typeof v === "string" ? v.trim() : "");

/** The answer a field starts on, from what was given or the schema's default. */
function startOf(f: SchemaField, v: unknown): unknown {
  if (f.kind === "boolean") return v === true;
  if (f.kind === "money") return typeof v === "number" ? v : null;
  if (f.kind === "list" && Array.isArray(v)) return v.join(", ");
  if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") return String(v);
  return "";
}

/** What a form holds at the start: the schema's defaults, then the given values. */
export function initialValues(fields: readonly SchemaField[], given: Record<string, unknown> = {}): Record<string, unknown> {
  return Object.fromEntries(fields.map((f) => [f.key, startOf(f, given[f.key] ?? f.defaultValue)]));
}

/** The typed value of a non-empty answer. */
function typed(f: SchemaField, text: string): unknown {
  if (f.kind === "number" || f.kind === "integer") return asNumber(text);
  return f.kind === "list" ? listItems(text) : text;
}

/** The typed payload the host receives: numbers as numbers, lists as arrays, money as integer cents, empty answers left out. */
export function payloadOf(fields: readonly SchemaField[], values: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const f of fields) {
    const v = values[f.key];
    if (f.kind === "boolean") out[f.key] = v === true;
    else if (f.kind === "money") {
      if (typeof v === "number") out[f.key] = v;
    } else if (textOf(v) !== "") out[f.key] = typed(f, textOf(v));
  }
  return out;
}
