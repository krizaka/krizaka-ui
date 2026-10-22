import type { SessionStore } from "./session";

/** An API refusal: the HTTP status and the body the server answered (its `error`, `code`, `minimum`…). */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly body: Record<string, unknown>,
  ) {
    super(typeof body.error === "string" ? body.error : `HTTP ${status}`);
    this.name = "ApiError";
  }
}

export interface ApiCall {
  method?: string;
  body?: unknown;
  signal?: AbortSignal;
  headers?: Record<string, string>;
}

export interface ApiClientOptions {
  /** Read at each call: an address moved by the manifest is followed without rebuilding the client. */
  baseUrl: () => string;
  session: SessionStore;
  /** `appConfig.fetch` of `@krizaka/app-config`: it adds the `X-Client-*` headers and shows the update screen on a 426. */
  fetch: typeof fetch;
  /** The `Accept-Language` value. */
  language: () => string;
  /** The product's name for the timeout message (`Yomizaka did not answer in time`). */
  productName: string;
  /** How long a call may wait before it fails like a network error. */
  timeoutMs: number;
}

export interface ApiClient {
  call<T>(path: string, init?: ApiCall): Promise<T>;
  /** Called when the server no longer accepts the stored session (expired, suspended account). */
  setSignedOutHandler(handler: (() => void) | null): void;
}

/**
 * Calls a product's API as JSON with the bearer session, never a cookie: React Native's fetch would otherwise keep and
 * replay cookies, and a stale one once won over the next account's token. A 401 on a signed-in call drops the session.
 * A call with no answer within `timeoutMs` fails like a network error (a `TypeError`); one cancelled by its caller's
 * `signal` rejects as cancelled.
 */
export function createApiClient(options: ApiClientOptions): ApiClient {
  const { session } = options;
  let onSignedOut: (() => void) | null = null;
  return {
    setSignedOutHandler(handler) {
      onSignedOut = handler;
    },
    async call<T>(path: string, init: ApiCall = {}): Promise<T> {
      const token = await session.readToken();
      const controller = new AbortController();
      const cancel = () => controller.abort();
      init.signal?.addEventListener("abort", cancel);
      let timedOut = false;
      const timer = setTimeout(() => {
        timedOut = true;
        controller.abort();
      }, options.timeoutMs);
      let res: Response;
      try {
        res = await options.fetch(`${options.baseUrl()}${path}`, {
          method: init.method ?? "GET",
          headers: {
            Accept: "application/json",
            "Accept-Language": options.language(),
            ...(init.body !== undefined ? { "Content-Type": "application/json" } : {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...init.headers,
          },
          body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
          credentials: "omit",
          signal: controller.signal,
        });
      } catch (error) {
        if (timedOut) throw new TypeError(`${options.productName} did not answer in time`);
        throw error;
      } finally {
        clearTimeout(timer);
        init.signal?.removeEventListener("abort", cancel);
      }
      const body = (await res.json().catch(() => ({}))) as Record<string, unknown>;
      if (res.status === 401 && token) {
        await session.clearToken();
        onSignedOut?.();
      }
      if (!res.ok) throw new ApiError(res.status, body);
      return body as T;
    },
  };
}
