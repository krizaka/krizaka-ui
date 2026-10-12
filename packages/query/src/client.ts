/**
 * `createQueryClient` — a TanStack `QueryClient` with the Krizaka defaults: fresh for 30 s, retries that respect a
 * 429's `retryAt` and never insist on another 4xx, a 401 reported once to the app (`onUnauthorized`), and errors thrown
 * to the nearest error boundary — except for lists (`meta: { list: true }`) and background refetches, which keep the
 * data they have.
 */
import { type DefaultOptions, MutationCache, type Query, QueryCache, QueryClient } from "@tanstack/react-query";

import { isKrizakaApiError, type KrizakaApiError } from "./errors";

export const DEFAULT_STALE_TIME = 30_000;
export const DEFAULT_MAX_RETRIES = 3;
/** A 429 asking to wait longer than this is not retried: the UI says when to come back. */
export const DEFAULT_MAX_RETRY_WAIT = 30_000;

/** What `meta` a query may carry for the Krizaka defaults. */
export interface KrizakaQueryMeta extends Record<string, unknown> {
  /** A list: an error renders in place (an empty state with a retry) instead of reaching the error boundary. */
  list?: boolean;
}

export interface KrizakaQueryClientOptions {
  /** How long data stays fresh (ms). Default 30 s. */
  staleTime?: number;
  /** How long unused data stays in memory (ms) — at least the persister's `maxAge` on a device. TanStack's default. */
  gcTime?: number;
  /** Attempts after the first one, for a network error or a 5xx (ms). Default 3; `0` turns retries off. */
  maxRetries?: number;
  /** The longest 429 wait still retried automatically (ms). Default 30 s. */
  maxRetryWait?: number;
  /** A 401 from any query or mutation: refresh the session or go to sign-in. Called once per failing call. */
  onUnauthorized?: (error: KrizakaApiError) => void;
  /** Every query and mutation error (logging, a toast for mutations). */
  onError?: (error: unknown) => void;
  /** Overrides the "throw to the error boundary unless a list" default. */
  throwOnError?: boolean | ((error: Error, query: Query<unknown, Error, unknown, readonly unknown[]>) => boolean);
  /** Merged last, over the Krizaka defaults. */
  defaultOptions?: DefaultOptions;
}

/** Whether a failed attempt is retried: a 429 within `maxWait`, a network error or a 5xx — never another 4xx. */
export function shouldRetry(failureCount: number, error: unknown, { maxRetries = DEFAULT_MAX_RETRIES, maxWait = DEFAULT_MAX_RETRY_WAIT, now = Date.now() } = {}): boolean {
  if (failureCount >= maxRetries) return false;
  if (!isKrizakaApiError(error)) return true;
  if (error.status === 429) return (error.retryInMs(now) ?? 0) <= maxWait;
  if (error.code === "invalid-response") return false;
  return error.status === 0 || error.status >= 500;
}

/** The wait before the next attempt: what a 429 asked for, otherwise 1 s, 2 s, 4 s… capped at 30 s. */
export function retryDelay(attempt: number, error: unknown, now = Date.now()): number {
  if (isKrizakaApiError(error) && error.retryAt !== undefined) return error.retryInMs(now) ?? 0;
  return Math.min(1000 * 2 ** attempt, 30_000);
}

/** The default `throwOnError`: only a first load fails loudly, and never a list. */
export function throwUnlessList(_error: Error, query: { state: { data: unknown }; meta?: Record<string, unknown> }): boolean {
  return query.state.data === undefined && (query.meta as KrizakaQueryMeta | undefined)?.list !== true;
}

export function createQueryClient(options: KrizakaQueryClientOptions = {}): QueryClient {
  const { staleTime = DEFAULT_STALE_TIME, gcTime, maxRetries = DEFAULT_MAX_RETRIES, maxRetryWait = DEFAULT_MAX_RETRY_WAIT, onUnauthorized, onError, throwOnError = throwUnlessList } = options;
  const report = (error: unknown) => {
    if (isKrizakaApiError(error) && error.status === 401) onUnauthorized?.(error);
    onError?.(error);
  };
  const retry = (failureCount: number, error: unknown) => shouldRetry(failureCount, error, { maxRetries, maxWait: maxRetryWait });
  return new QueryClient({
    queryCache: new QueryCache({ onError: report }),
    mutationCache: new MutationCache({ onError: report }),
    defaultOptions: {
      ...options.defaultOptions,
      queries: {
        staleTime,
        ...(gcTime === undefined ? {} : { gcTime }),
        retry,
        retryDelay,
        throwOnError,
        ...options.defaultOptions?.queries,
      },
      mutations: {
        // a mutation is not idempotent: only a 429 (refused, so not applied) is tried again
        retry: (failureCount, error) => isKrizakaApiError(error) && error.status === 429 && retry(failureCount, error),
        retryDelay,
        ...options.defaultOptions?.mutations,
      },
    },
  });
}
