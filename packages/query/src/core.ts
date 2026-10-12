/**
 * The framework-free half of @krizaka/query (no React, no directive): safe in a Server Component, a route handler, a
 * test. Built as its own chunk so `.`, `./server` and the client components share one `KrizakaApiError` class.
 */
export {
  createQueryClient,
  DEFAULT_MAX_RETRIES,
  DEFAULT_MAX_RETRY_WAIT,
  DEFAULT_STALE_TIME,
  type KrizakaQueryClientOptions,
  type KrizakaQueryMeta,
  retryDelay,
  shouldRetry,
  throwUnlessList,
} from "./client";
export {
  type ApiFieldError,
  codeForStatus,
  ERROR_CODES,
  isKrizakaApiError,
  KrizakaApiError,
  type KrizakaApiErrorInit,
  problemFromResponse,
  readRetryAt,
} from "./errors";
export {
  configureKrizakaFetch,
  type InferOutput,
  krizakaFetch,
  type KrizakaFetchConfig,
  type KrizakaFetchInit,
  parseWith,
  type QueryParams,
  type StandardSchemaV1,
} from "./fetch";
export { defineKeys, type ResourceKeys } from "./keys";
export {
  createLiveInvalidator,
  type EventSourceFactory,
  type EventSourceLike,
  eventSourceLive,
  type EventSourceLiveOptions,
  type LiveEvent,
  type LiveOptions,
  type LiveRule,
  type LiveRules,
  type LiveSource,
  type LiveStatus,
  OPEN_CHANNEL,
} from "./live";
