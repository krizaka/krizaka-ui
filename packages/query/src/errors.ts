/**
 * One error for every failed call: `KrizakaApiError`, read from an RFC 9457 Problem Details body (what the JVM
 * services answer through `krizaka-web`) or from the `{ error, code, retryAfterSeconds }` body of a Next.js route
 * handler. The `code` is the contract a client branches on and the key of its message — never the server's words.
 */

/** A field the server refused (`errors[]` of a `validation-failed` problem, or a zod `fieldErrors`). */
export interface ApiFieldError {
  /** The stable slug of the refusal (`not-blank`, `too-long`…), when the server gives one. */
  code?: string;
  /** The server's message, in English: a fallback, never the text shown first. */
  message: string;
}

export interface KrizakaApiErrorInit {
  status: number;
  type?: string;
  title?: string;
  detail?: string;
  code?: string;
  retryAt?: number;
  fields?: Record<string, ApiFieldError>;
  requestId?: string;
  body?: unknown;
  cause?: unknown;
}

/** The codes `krizakaFetch` gives when the server named none. */
export const ERROR_CODES = Object.freeze({
  network: "network",
  invalidResponse: "invalid-response",
  badRequest: "bad-request",
  unauthorized: "unauthorized",
  forbidden: "forbidden",
  notFound: "not-found",
  conflict: "conflict",
  validationFailed: "validation-failed",
  rateLimited: "rate-limited",
  server: "server",
  unavailable: "unavailable",
});

const BY_STATUS: Record<number, string> = {
  400: ERROR_CODES.badRequest,
  401: ERROR_CODES.unauthorized,
  403: ERROR_CODES.forbidden,
  404: ERROR_CODES.notFound,
  409: ERROR_CODES.conflict,
  422: ERROR_CODES.validationFailed,
  429: ERROR_CODES.rateLimited,
  503: ERROR_CODES.unavailable,
};

/** The code of a status the server did not qualify. */
export function codeForStatus(status: number): string {
  if (status === 0) return ERROR_CODES.network;
  return BY_STATUS[status] ?? (status >= 500 ? ERROR_CODES.server : ERROR_CODES.badRequest);
}

/** A failed call: status, Problem Details fields, the code to branch on and, for a 429, when to come back. */
export class KrizakaApiError extends Error {
  /** HTTP status; `0` when no response arrived (network, abort). */
  readonly status: number;
  /** The problem type URI (`https://krizaka.com/problems/auction-closed`), `about:blank` when none. */
  readonly type: string;
  readonly title: string;
  readonly detail?: string;
  /** The stable slug to branch on and to look the message up with (`messageKey`). */
  readonly code: string;
  /** Epoch ms before which the same call is refused (a 429's `Retry-After`, `retryAt` or `retryAfterSeconds`). */
  readonly retryAt?: number;
  /** The refused fields, by name — what a form shows under each field. */
  readonly fields?: Readonly<Record<string, ApiFieldError>>;
  /** The server's correlation id, to quote in a support request. */
  readonly requestId?: string;
  /** The raw body, for what this class does not read. */
  readonly body?: unknown;

  constructor(init: KrizakaApiErrorInit) {
    const code = init.code ?? codeForStatus(init.status);
    super(init.detail ?? init.title ?? code, init.cause === undefined ? undefined : { cause: init.cause });
    this.name = "KrizakaApiError";
    this.status = init.status;
    this.type = init.type ?? "about:blank";
    this.title = init.title ?? code;
    this.detail = init.detail;
    this.code = code;
    this.retryAt = init.retryAt;
    this.fields = init.fields;
    this.requestId = init.requestId;
    this.body = init.body;
  }

  /** The i18n key of this error's message: `apiErrors.rate-limited` (the app's catalogue holds the words). */
  messageKey(prefix = "apiErrors"): string {
    return `${prefix}.${this.code}`;
  }

  /** Milliseconds until the call may be made again (0 when it may now; undefined when the server said nothing). */
  retryInMs(now = Date.now()): number | undefined {
    return this.retryAt === undefined ? undefined : Math.max(0, this.retryAt - now);
  }
}

/** True for a `KrizakaApiError` — also across two copies of the package (a duplicated install). */
export function isKrizakaApiError(error: unknown): error is KrizakaApiError {
  return error instanceof KrizakaApiError || (error instanceof Error && error.name === "KrizakaApiError" && "code" in error && "status" in error);
}

const SLUG = /^[a-z0-9]+(?:[-_.][a-z0-9]+)*$/i;
const str = (value: unknown) => (typeof value === "string" && value.length > 0 ? value : undefined);

/** `Retry-After` (seconds or an HTTP date), or a body's `retryAt` (ISO date, epoch ms) / `retryAfterSeconds`. */
export function readRetryAt(header: string | null | undefined, body: Record<string, unknown>, now = Date.now()): number | undefined {
  if (typeof body.retryAt === "number") return body.retryAt;
  if (typeof body.retryAt === "string") {
    const at = Date.parse(body.retryAt);
    if (!Number.isNaN(at)) return at;
  }
  if (typeof body.retryAfterSeconds === "number") return now + body.retryAfterSeconds * 1000;
  if (header) {
    const seconds = Number(header);
    if (header.trim() !== "" && Number.isFinite(seconds)) return now + seconds * 1000;
    const at = Date.parse(header);
    if (!Number.isNaN(at)) return at;
  }
  return undefined;
}

function readFields(body: Record<string, unknown>): Record<string, ApiFieldError> | undefined {
  const fields: Record<string, ApiFieldError> = {};
  const add = (name: unknown, message: unknown, code?: unknown) => {
    const field = str(name);
    if (field && !(field in fields)) fields[field] = { message: str(message) ?? "", ...(str(code) ? { code: str(code) } : {}) };
  };
  // krizaka-web (JVM): errors: [{ field, code, message }]
  if (Array.isArray(body.errors)) {
    for (const entry of body.errors) if (entry && typeof entry === "object") add((entry as Record<string, unknown>).field, (entry as Record<string, unknown>).message, (entry as Record<string, unknown>).code);
  }
  // our own shape: fields: { name: "message" | { code, message } }
  if (body.fields && typeof body.fields === "object") {
    for (const [name, value] of Object.entries(body.fields as Record<string, unknown>)) {
      if (typeof value === "string") add(name, value);
      else if (value && typeof value === "object") add(name, (value as Record<string, unknown>).message, (value as Record<string, unknown>).code);
    }
  }
  // a zod `flatten()` in `details`: { fieldErrors: { name: ["message"] } }
  const flat = (body.details as { fieldErrors?: unknown } | undefined)?.fieldErrors;
  if (flat && typeof flat === "object") {
    for (const [name, messages] of Object.entries(flat as Record<string, unknown>)) if (Array.isArray(messages)) add(name, messages[0]);
  }
  return Object.keys(fields).length > 0 ? fields : undefined;
}

/** Reads a failed response's status, headers and (parsed) body into a `KrizakaApiError`. */
export function problemFromResponse(status: number, headers: { get(name: string): string | null }, body: unknown, now = Date.now()): KrizakaApiError {
  const record = body && typeof body === "object" && !Array.isArray(body) ? (body as Record<string, unknown>) : {};
  const type = str(record.type);
  const typeSlug = type && type !== "about:blank" ? type.split(/[/#]/).pop() : undefined;
  const code = [str(record.code), typeSlug].find((value) => value !== undefined && SLUG.test(value));
  // a route handler's { error: "message" } is the detail; a Problem's title is the title
  const detail = str(record.detail) ?? str(record.error) ?? str(record.message) ?? (typeof body === "string" ? str(body) : undefined);
  return new KrizakaApiError({
    status,
    type,
    title: str(record.title),
    detail,
    code,
    retryAt: readRetryAt(headers.get("retry-after"), record, now),
    fields: readFields(record),
    requestId: str(record.requestId) ?? headers.get("x-request-id") ?? undefined,
    body,
  });
}
