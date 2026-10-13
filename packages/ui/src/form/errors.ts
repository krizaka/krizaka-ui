// Platform-neutral and server-safe: no React, no DOM, no React Native. The errors of a Krizaka form — a schema's issues,
// a server's Problem Details, an availability check — as one shape, `FormFieldError`, whose words come from a key of the
// app's catalogue (`form.errors.tooShort`), never from the validation engine's English.

/** A value a message placeholder takes (`{minimum}`, `{suggestion}`). */
export type FormMessageValue = string | number;

/** An error of a field or of the whole form: the key of its words in the app's catalogue, and what fills them in. */
export interface FormFieldError {
  /** The i18n key: `form.errors.required`, or the key a schema names (`z.string().min(3, "signUp.username.short")`). */
  key: string;
  /** The placeholders of the message (`{ minimum: 3 }`). */
  values?: Readonly<Record<string, FormMessageValue>>;
  /** The server's own words, in English: shown only when the catalogue has no message for the key. */
  message?: string;
  /** A value to offer instead (a free username): a button under the error sets it. Its label is passed translated. */
  suggestion?: { readonly label: string; readonly value: unknown };
  /** Shown at once, while the person types (an availability check), not only once they leave the field. */
  immediate?: boolean;
  /** Where it comes from: the schema (default), a field's check, or the server's answer (kept until the field changes). */
  source?: "schema" | "check" | "server";
}

/** The English defaults of the generic errors, by code — the words a form shows when the app's catalogue has none. */
export const formMessages: Readonly<Record<string, string>> = {
  required: "This field is required.",
  tooShort: "Use at least {minimum} characters.",
  tooLong: "Use at most {maximum} characters.",
  tooSmall: "Enter {minimum} or more.",
  tooBig: "Enter {maximum} or less.",
  tooFew: "Choose at least {minimum}.",
  tooMany: "Choose at most {maximum}.",
  invalidEmail: "Enter an e-mail address, like name@example.com.",
  invalidUrl: "Enter a web address, like https://example.com.",
  invalidDate: "Enter a real date.",
  invalidNumber: "Enter a number.",
  invalidFormat: "Check the format of this field.",
  invalidChoice: "Choose one of the options.",
  invalid: "Check this field.",
  // The whole form (a server's answer without fields): the codes of @krizaka/query's KrizakaApiError.
  network: "No connection. Check your network and try again.",
  "rate-limited": "Too many tries. Wait a moment and try again.",
  unauthorized: "Your session has ended. Sign in again.",
  forbidden: "You are not allowed to do this.",
  conflict: "This was changed meanwhile. Reload and try again.",
  "validation-failed": "Some fields need your attention.",
  unavailable: "The service is unavailable for a moment. Try again shortly.",
  server: "Something went wrong on our side. Try again.",
};

/** How a form finds its words: the app's translate function, and the prefixes of its keys. */
export interface FormI18n {
  /** The app's translate function (`(key, values) => t(key, values)`): a string, or `undefined` when the key is missing. */
  t?: (key: string, values?: Readonly<Record<string, FormMessageValue>>) => string | undefined;
  /** The prefix of the generic field errors. Default `form.errors` (→ `form.errors.tooShort`). */
  prefix?: string;
  /** The prefix of the server's codes for the whole form, as `KrizakaApiError.messageKey()`. Default `apiErrors`. */
  apiPrefix?: string;
  /** The locale of numbers, money and dates. Default `en`. */
  locale?: string;
}

const KEY = /^[\w-]+(\.[\w-]+)+$/;

const fill = (text: string, values?: Readonly<Record<string, FormMessageValue>>) =>
  values ? text.replace(/\{(\w+)\}/g, (all, name: string) => (values[name] === undefined ? all : String(values[name]))) : text;

/** The words of an error: the app's catalogue, else the English default of its code, else the server's words, else the key. */
export function formMessage(error: FormFieldError | string, i18n: FormI18n = {}): string {
  const e = typeof error === "string" ? { key: error } : error;
  const translated = i18n.t?.(e.key, e.values);
  if (translated && translated !== e.key) return translated;
  const code = e.key.slice(e.key.lastIndexOf(".") + 1);
  const fallback = formMessages[code];
  // The server's words beat a generic default (a refusal without a code), never a default for its own code.
  if (e.message && (code === "invalid" || !fallback)) return e.message;
  if (fallback && (e.key.startsWith(`${i18n.prefix ?? "form.errors"}.`) || e.key.startsWith(`${i18n.apiPrefix ?? "apiErrors"}.`))) return fill(fallback, e.values);
  return e.message ?? (KEY.test(e.key) ? fill(fallback ?? formMessages.invalid!, e.values) : e.key);
}

/** One issue of a Standard Schema (zod 4, valibot, arktype): zod adds its `code` and limits, read when present. */
export interface SchemaIssue {
  readonly message: string;
  readonly path?: ReadonlyArray<PropertyKey | { readonly key: PropertyKey }>;
  readonly code?: string;
  readonly minimum?: number | bigint;
  readonly maximum?: number | bigint;
  readonly origin?: string;
  readonly format?: string;
  readonly input?: unknown;
  readonly expected?: string;
}

/** A field's name from an issue's path, as the form writes it: `links[0].url`. */
export function pathName(path: SchemaIssue["path"]): string {
  let name = "";
  for (const part of path ?? []) {
    const key = typeof part === "object" && part !== null ? part.key : part;
    if (typeof key === "number") name += `[${key}]`;
    else name += name ? `.${String(key)}` : String(key);
  }
  return name;
}

const num = (value: number | bigint | undefined) => (value === undefined ? undefined : Number(value));

/** The key and values of an issue: the schema's own key when it names one, else the generic code of what failed. */
export function issueError(issue: SchemaIssue, prefix = "form.errors"): FormFieldError {
  if (KEY.test(issue.message)) return { key: issue.message };
  const key = (code: string, values?: Record<string, FormMessageValue>) => ({ key: `${prefix}.${code}`, ...(values ? { values } : {}) });
  const collection = issue.origin === "array" || issue.origin === "set";
  switch (issue.code) {
    case "invalid_type":
      return issue.input === undefined || issue.input === null || issue.input === "" ? key("required") : issue.expected === "number" ? key("invalidNumber") : issue.expected === "date" ? key("invalidDate") : key("invalid");
    case "too_small": {
      const minimum = num(issue.minimum)!;
      if (issue.origin === "string") return minimum <= 1 ? key("required") : key("tooShort", { minimum });
      if (collection) return minimum <= 1 ? key("required") : key("tooFew", { minimum });
      return key("tooSmall", { minimum });
    }
    case "too_big": {
      const maximum = num(issue.maximum)!;
      return issue.origin === "string" ? key("tooLong", { maximum }) : collection ? key("tooMany", { maximum }) : key("tooBig", { maximum });
    }
    case "invalid_format":
      if (issue.format === "email") return key("invalidEmail");
      if (issue.format === "url") return key("invalidUrl");
      if (issue.format === "date" || issue.format === "datetime") return key("invalidDate");
      return key("invalidFormat");
    case "invalid_value":
      // `z.literal(true)`: a box that must be ticked.
      return issue.input === false || issue.input === undefined ? key("required") : key("invalidChoice");
    case "invalid_union":
    case "invalid_key":
    case "invalid_element":
      return key("invalidChoice");
    default:
      return key("invalid");
  }
}

/** The first error of each field of a schema's issues (an issue without a path is the whole form's: `""`). */
export function issuesToFields(issues: readonly SchemaIssue[], prefix?: string): Record<string, FormFieldError> {
  const fields: Record<string, FormFieldError> = {};
  for (const issue of issues) {
    const name = pathName(issue.path);
    if (!(name in fields)) fields[name] = { ...issueError(issue, prefix), source: "schema" };
  }
  return fields;
}

/**
 * A refusal the form shows, serialisable (a Server Action returns it): the shape of `KrizakaApiError` of @krizaka/query —
 * a `KrizakaApiError` *is* a `FormProblem`. `fields` go under their fields, the rest above the submit button.
 */
export interface FormProblem {
  /** The HTTP status (0 when no response arrived). */
  status?: number;
  /** The stable code of the refusal (`rate-limited`, `conflict`, `ACCOUNT_EXISTS`): the key of its words. */
  code?: string;
  /** The server's sentence, in English: shown only when the catalogue has no message for the code. */
  detail?: string;
  /** The refused fields, by name: a server's `{ code, message }`, or an error the form already knows (`key`). */
  fields?: Readonly<Record<string, { code?: string; message: string } | FormFieldError | string>>;
  /** Epoch ms before which the same call is refused (a 429). */
  retryAt?: number;
}

/** True for what a form can read as a problem: a `KrizakaApiError`, a `FormProblem`, an `{ ok: false, problem }` result. */
export function isFormProblem(value: unknown): value is FormProblem {
  return typeof value === "object" && value !== null && ("fields" in value || "code" in value || "status" in value);
}

/** A problem as field errors (by name) and the whole form's error (or `null` when every refusal has its field). */
export function problemToErrors(
  problem: FormProblem,
  i18n: FormI18n = {},
  known?: (name: string) => boolean,
  codeFields: Readonly<Record<string, string>> = {},
): { fields: Record<string, FormFieldError>; form: FormFieldError | null } {
  const prefix = i18n.prefix ?? "form.errors";
  const fields: Record<string, FormFieldError> = {};
  let unplaced = false;
  // A refusal named by a code that belongs to a field (`UNDERAGE` → `dateOfBirth`): under that field, in its words.
  const owner = problem.code ? codeFields[problem.code] : undefined;
  if (owner && (!known || known(owner)) && !problem.fields?.[owner]) {
    fields[owner] = { key: `${prefix}.${problem.code}`, ...(problem.detail ? { message: problem.detail } : {}), source: "server" };
    if (!problem.fields || Object.keys(problem.fields).length === 0) return { fields, form: null };
  }
  for (const [name, refusal] of Object.entries(problem.fields ?? {})) {
    if (known && !known(name)) {
      unplaced = true;
      continue;
    }
    const error: FormFieldError =
      typeof refusal === "string"
        ? { key: refusal }
        : "key" in refusal
          ? refusal
          : { key: refusal.code ? (KEY.test(refusal.code) ? refusal.code : `${prefix}.${refusal.code}`) : `${prefix}.invalid`, message: refusal.message };
    fields[name] = { ...error, source: "server" };
  }
  const placed = Object.keys(fields).length > 0;
  if (placed && !unplaced) return { fields, form: null };
  const code = problem.code ?? (problem.status === 0 ? "network" : problem.status && problem.status >= 500 ? "server" : "invalid");
  const retryIn = problem.retryAt ? Math.max(1, Math.ceil((problem.retryAt - Date.now()) / 1000)) : undefined;
  return {
    fields,
    form: { key: KEY.test(code) ? code : `${i18n.apiPrefix ?? "apiErrors"}.${code}`, ...(problem.detail ? { message: problem.detail } : {}), ...(retryIn ? { values: { seconds: retryIn } } : {}), source: "server" },
  };
}
