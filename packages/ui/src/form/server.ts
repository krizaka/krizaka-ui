/**
 * @krizaka/ui/form/server — the server side of a Krizaka form, for a Server Action or a route handler (no "use client",
 * no React): `validateForm` parses with the form's own schema and answers the errors with the same keys the form shows,
 * `formProblem` turns a thrown error (a `KrizakaApiError` of @krizaka/query) into the serialisable refusal a form reads.
 */
import { type FormFieldError, type FormProblem, issuesToFields, type SchemaIssue } from "./errors";

export type { FormFieldError, FormProblem } from "./errors";

/** What a Server Action answers a form: done (with what it made), or a refusal (`fields` under their fields). */
export type FormActionResult<T = unknown> = { ok: true; data?: T } | { ok: false; problem: FormProblem };

type Schema<O> = { readonly "~standard": { validate: (value: unknown) => { value?: O; issues?: readonly SchemaIssue[] } | Promise<{ value?: O; issues?: readonly SchemaIssue[] }> } };

/**
 * Parses what a form sent with its schema (never trust the client): the value, or a `validation-failed` problem whose
 * fields carry the keys the form would show (`form.errors.tooShort`, the schema's own keys).
 */
export async function validateForm<O>(schema: Schema<O>, input: unknown, options: { prefix?: string } = {}): Promise<{ ok: true; value: O } | { ok: false; problem: FormProblem }> {
  const result = await schema["~standard"].validate(input);
  if (!result.issues?.length) return { ok: true, value: result.value as O };
  const fields: Record<string, FormFieldError> = issuesToFields(result.issues, options.prefix);
  const general = fields[""];
  delete fields[""];
  return { ok: false, problem: { status: 422, code: general ? general.key : "validation-failed", fields } };
}

/** A thrown error as a refusal a form reads — a `KrizakaApiError` keeps its status, code, fields and retry time. */
export function formProblem(error: unknown): FormProblem {
  if (error && typeof error === "object") {
    const e = error as { status?: unknown; code?: unknown; detail?: unknown; fields?: unknown; retryAt?: unknown };
    if (typeof e.status === "number" || typeof e.code === "string") {
      return {
        ...(typeof e.status === "number" ? { status: e.status } : {}),
        ...(typeof e.code === "string" ? { code: e.code } : {}),
        ...(typeof e.detail === "string" ? { detail: e.detail } : {}),
        ...(e.fields && typeof e.fields === "object" ? { fields: JSON.parse(JSON.stringify(e.fields)) as FormProblem["fields"] } : {}),
        ...(typeof e.retryAt === "number" ? { retryAt: e.retryAt } : {}),
      };
    }
  }
  return { status: 500, code: "server" };
}
