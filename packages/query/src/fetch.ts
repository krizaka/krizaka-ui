/**
 * `krizakaFetch` — `fetch` with the Krizaka contract: the response is validated by a schema (zod, valibot, any
 * Standard Schema), a refusal becomes a `KrizakaApiError` (Problem Details), the app's base URL, credentials and
 * bearer token are applied once (`configureKrizakaFetch`). It is shaped like `fetch` — URL first — so it reads the
 * same in a Server Component's prefetch and in a `queryFn`.
 */
import { ERROR_CODES, KrizakaApiError, problemFromResponse } from "./errors";

/** The Standard Schema contract (https://standardschema.dev) — what zod ≥ 3.24, valibot and arktype implement. */
export interface StandardSchemaV1<Input = unknown, Output = Input> {
  readonly "~standard": {
    readonly version: 1;
    readonly vendor: string;
    readonly validate: (value: unknown) => StandardResult<Output> | Promise<StandardResult<Output>>;
    readonly types?: { readonly input: Input; readonly output: Output } | undefined;
  };
}
type StandardResult<Output> =
  | { readonly value: Output; readonly issues?: undefined }
  | { readonly issues: ReadonlyArray<{ readonly message: string; readonly path?: ReadonlyArray<PropertyKey | { readonly key: PropertyKey }> | undefined }> };

/** The output type of a schema. */
export type InferOutput<S> = S extends StandardSchemaV1<unknown, infer O> ? O : unknown;

export type QueryParams = Record<string, string | number | boolean | null | undefined | ReadonlyArray<string | number | boolean>>;

export interface KrizakaFetchConfig {
  /** Prefixed to relative URLs (`https://api.example.com`); none on the web, where `/api/…` is same-origin. */
  baseUrl?: string;
  /** Web: `include` for a cross-origin API that reads the session cookie. Default: the browser's (`same-origin`). */
  credentials?: RequestCredentials;
  /** Native (and server-to-server): the bearer token, injected as `Authorization` unless the call sets one. */
  getToken?: () => string | null | undefined | Promise<string | null | undefined>;
  /** Headers added to every call (a call's own headers win). */
  headers?: Record<string, string>;
  /** The `fetch` to use (a test double, an instrumented fetch). Default: the global one. */
  fetch?: typeof fetch;
}

export interface KrizakaFetchInit<S extends StandardSchemaV1 | undefined = undefined> extends Omit<RequestInit, "body"> {
  /** Validates the response body; its output is what the call resolves to. */
  schema?: S;
  /** A JSON body: serialised, with `Content-Type: application/json`. */
  json?: unknown;
  body?: RequestInit["body"];
  /** Appended to the URL's query string (null and undefined skipped, arrays repeated). */
  query?: QueryParams;
}

let config: KrizakaFetchConfig = {};

/** Sets the app's defaults once (at start-up); returns a function that restores the previous ones. */
export function configureKrizakaFetch(next: KrizakaFetchConfig): () => void {
  const previous = config;
  config = { ...next };
  return () => {
    config = previous;
  };
}

function buildUrl(input: string | URL, query: QueryParams | undefined): string {
  let url = typeof input === "string" ? input : input.toString();
  if (config.baseUrl && !/^[a-z][a-z0-9+.-]*:/i.test(url)) url = config.baseUrl.replace(/\/+$/, "") + (url.startsWith("/") ? url : `/${url}`);
  if (!query) return url;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === null || value === undefined) continue;
    for (const item of Array.isArray(value) ? value : [value]) params.append(key, String(item));
  }
  const search = params.toString();
  if (!search) return url;
  return `${url}${url.includes("?") ? "&" : "?"}${search}`;
}

async function readBody(response: Response): Promise<unknown> {
  if (response.status === 204 || response.status === 205) return undefined;
  const text = await response.text();
  if (!text) return undefined;
  const type = response.headers.get("content-type") ?? "";
  if (/[/+]json\b/i.test(type)) {
    try {
      return JSON.parse(text) as unknown;
    } catch {
      return text;
    }
  }
  return text;
}

const issuePath = (path: ReadonlyArray<PropertyKey | { readonly key: PropertyKey }> | undefined) =>
  (path ?? []).map((part) => String(typeof part === "object" ? part.key : part)).join(".");

/** Validates a value with a Standard Schema; a mismatch is a `KrizakaApiError` (`invalid-response`). */
export async function parseWith<S extends StandardSchemaV1>(schema: S, value: unknown, status = 200): Promise<InferOutput<S>> {
  const result = await schema["~standard"].validate(value);
  if (result.issues) {
    const fields = Object.fromEntries(result.issues.map((issue) => [issuePath(issue.path) || "$", { message: issue.message }]));
    throw new KrizakaApiError({ status, code: ERROR_CODES.invalidResponse, title: "Invalid response", detail: result.issues[0]?.message, fields, body: value });
  }
  return result.value as InferOutput<S>;
}

/**
 * Calls the API and resolves to the validated body (or the raw body without a schema).
 * Throws `KrizakaApiError`: the server's refusal (status ≥ 400, Problem Details read), no response (`network`,
 * status 0) or a body the schema refuses (`invalid-response`). An abort is rethrown as is (Query cancels quietly).
 */
export async function krizakaFetch<S extends StandardSchemaV1 | undefined = undefined>(
  input: string | URL,
  init: KrizakaFetchInit<S> = {},
): Promise<S extends StandardSchemaV1 ? InferOutput<S> : unknown> {
  const { schema, json, query, headers: own, body, ...rest } = init;
  const headers = new Headers(config.headers);
  new Headers(own).forEach((value, key) => headers.set(key, value));
  if (!headers.has("accept")) headers.set("accept", "application/json, application/problem+json");
  if (json !== undefined && !headers.has("content-type")) headers.set("content-type", "application/json");
  if (config.getToken && !headers.has("authorization")) {
    const token = await config.getToken();
    if (token) headers.set("authorization", `Bearer ${token}`);
  }
  const request: RequestInit = { ...rest, headers, body: json !== undefined ? JSON.stringify(json) : body };
  if (rest.credentials === undefined && config.credentials) request.credentials = config.credentials;

  let response: Response;
  try {
    response = await (config.fetch ?? fetch)(buildUrl(input, query), request);
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") throw error;
    throw new KrizakaApiError({ status: 0, code: ERROR_CODES.network, title: "Network error", detail: error instanceof Error ? error.message : undefined, cause: error });
  }
  const data = await readBody(response);
  if (!response.ok) throw problemFromResponse(response.status, response.headers, data);
  return (schema ? await parseWith(schema, data, response.status) : data) as S extends StandardSchemaV1 ? InferOutput<S> : unknown;
}
