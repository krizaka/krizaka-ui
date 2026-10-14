// A client-side rate limiter: how many calls in a window (TanStack Pacer's RateLimiter counts them), and a hold the
// server can put on it — a 429's `Retry-After`, or the `retryAt` / `retryAfterSeconds` of a Problem Details body
// (RFC 9457, the shape @krizaka/query's KrizakaApiError reads). Nothing is sent from here: it only says "not yet".
import { RateLimiter as PacerRateLimiter } from "@tanstack/pacer/rate-limiter";

/** What a refused call carries: a Problem Details body, or a `Response` / `Headers` with a `Retry-After`. */
export type RetryHint =
  | Response
  | Headers
  | {
      /** Epoch ms, or an ISO date. */
      retryAt?: number | string;
      retryAfterSeconds?: number;
      /** Seconds (the `Retry-After` header's value) or an HTTP date. */
      retryAfter?: number | string;
      headers?: Headers;
    };

export type RateLimiterOptions = {
  /** Calls allowed per window. Default 1. */
  limit?: number;
  /** The window, in ms. Default 1000. */
  windowMs?: number;
};

const NOW = () => Date.now();

/** The epoch ms before which the same call is refused, or `undefined` when the hint says nothing. */
export function retryAtOf(hint: RetryHint, now: number = NOW()): number | undefined {
  const headers = hint instanceof Headers ? hint : hint instanceof Response ? hint.headers : "headers" in hint ? hint.headers : undefined;
  const fromHeader = headers?.get("retry-after");
  const body = hint instanceof Headers || hint instanceof Response ? {} : hint;
  const header = fromHeader ?? body.retryAfter;
  if (typeof body.retryAt === "number") return body.retryAt;
  if (typeof body.retryAt === "string") {
    const at = Date.parse(body.retryAt);
    if (!Number.isNaN(at)) return at;
  }
  if (typeof body.retryAfterSeconds === "number") return now + body.retryAfterSeconds * 1000;
  if (typeof header === "number") return now + header * 1000;
  if (typeof header === "string") {
    const seconds = Number(header);
    if (Number.isFinite(seconds)) return now + seconds * 1000;
    const at = Date.parse(header);
    if (!Number.isNaN(at)) return at;
  }
  return undefined;
}

/** Tells a caller when it may go: `tryAcquire()` now, or `wait()` until it can. */
export class RateLimiter {
  readonly #limiter: PacerRateLimiter<() => void>;
  readonly #window: number;
  #blockedUntil = 0;

  constructor({ limit = 1, windowMs = 1000 }: RateLimiterOptions = {}) {
    this.#window = windowMs;
    this.#limiter = new PacerRateLimiter<() => void>(() => {}, { limit, window: windowMs, windowType: "sliding" });
  }

  /**
   * A limiter already held by what a server said (a 429's Problem Details or `Retry-After`): it lets nothing through
   * until then. A hint that says nothing gives a limiter that is not held.
   */
  static fromProblemDetails(hint: RetryHint, options: RateLimiterOptions & { now?: number } = {}): RateLimiter {
    const limiter = new RateLimiter(options);
    const at = retryAtOf(hint, options.now ?? NOW());
    if (at !== undefined) limiter.blockUntil(at);
    return limiter;
  }

  /** Holds the limiter until `epochMs` (a later hold wins, an earlier one is ignored). */
  blockUntil(epochMs: number): void {
    this.#blockedUntil = Math.max(this.#blockedUntil, epochMs);
  }

  /** Calls left in the current window (0 while held). */
  get remaining(): number {
    return this.#blockedUntil > NOW() ? 0 : this.#limiter.getRemainingInWindow();
  }

  /** How long to wait before the next call is allowed: 0 when it may go now. */
  msUntilAvailable(): number {
    const held = Math.max(0, this.#blockedUntil - NOW());
    const windowed = this.#limiter.getRemainingInWindow() > 0 ? 0 : this.#limiter.getMsUntilNextWindow();
    return Math.max(held, windowed);
  }

  /** Takes one call from the window. `false` (and nothing taken) while held or when the window is full. */
  tryAcquire(): boolean {
    if (this.#blockedUntil > NOW()) return false;
    return this.#limiter.maybeExecute();
  }

  /** Resolves when a call may go, and takes it. Rejects with the signal's reason if it is aborted first. */
  async wait(signal?: AbortSignal): Promise<void> {
    for (;;) {
      signal?.throwIfAborted();
      if (this.tryAcquire()) return;
      const ms = Math.max(1, this.msUntilAvailable() || this.#window);
      await new Promise<void>((resolve, reject) => {
        const onAbort = () => {
          clearTimeout(timer);
          reject(signal?.reason);
        };
        const timer = setTimeout(() => {
          signal?.removeEventListener("abort", onAbort);
          resolve();
        }, ms);
        signal?.addEventListener("abort", onAbort, { once: true });
      });
    }
  }

  /** Forgets the window and the hold. */
  reset(): void {
    this.#blockedUntil = 0;
    this.#limiter.reset();
  }
}
