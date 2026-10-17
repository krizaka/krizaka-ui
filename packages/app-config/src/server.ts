import {
  APP_CONFIG_PATH,
  type AppConfigRecord,
  buildPayload,
  CLIENT_HEADERS,
  defaultRecord,
  evaluateGuard,
  type GuardResult,
  parseVersion,
  type Platform,
  toPlatform,
} from "./core";

export { schemaSql } from "./schema";

/** Where a Next.js backend keeps the parameters; the tables are `schemaSql`. */
export interface AppConfigStore {
  get(platform: Platform): Promise<AppConfigRecord | undefined>;
}

/** A store over fixed records: tests and demos. */
export function memoryStore(records: readonly AppConfigRecord[] = []): AppConfigStore {
  const byPlatform = new Map(records.map((r) => [r.platform, r]));
  return { get: async (platform) => byPlatform.get(platform) };
}

export interface CacheOptions {
  /** How long a read value is reused. */
  ttlMs: number;
  now?: () => number;
}

/**
 * Reads through a short cache and never lets the store take the API down: on a failure the last value is
 * served, and with none the permissive defaults.
 */
export function cachedStore(store: AppConfigStore, { ttlMs, now = Date.now }: CacheOptions): AppConfigStore & { evict(platform?: Platform): void } {
  const cache = new Map<Platform, { record: AppConfigRecord; at: number }>();
  return {
    evict: (platform) => (platform ? cache.delete(platform) : cache.clear()),
    async get(platform) {
      const hit = cache.get(platform);
      if (hit && now() - hit.at < ttlMs) return hit.record;
      try {
        const record = (await store.get(platform)) ?? defaultRecord(platform);
        cache.set(platform, { record, at: now() });
        return record;
      } catch {
        return hit?.record ?? defaultRecord(platform);
      }
    },
  };
}

async function etagOf(text: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  const hex = Array.from(new Uint8Array(digest).slice(0, 12), (b) => b.toString(16).padStart(2, "0")).join("");
  return `"${hex}"`;
}

function problem(status: number, code: string, detail: string): Response {
  return Response.json({ title: "Bad Request", status, code, detail }, { status, headers: { "content-type": "application/problem+json" } });
}

function languageOf(header: string | null): string | null {
  const first = (header ?? "").split(",", 1).join("").trim();
  return first.length >= 2 ? first.slice(0, 2) : null;
}

export interface HandlerOptions {
  store: AppConfigStore;
  /** The public `max-age`, seconds. Defaults to 60. */
  maxAgeSeconds?: number;
}

/**
 * `GET /api/v1/app-config` for a route handler: public, cacheable, `ETag`, `304`. Mount it at
 * `app/api/v1/app-config/route.ts`: `export const GET = createAppConfigHandler({ store })`.
 */
export function createAppConfigHandler({ store, maxAgeSeconds = 60 }: HandlerOptions): (request: Request) => Promise<Response> {
  return async (request) => {
    const url = new URL(request.url);
    const platform = toPlatform(url.searchParams.get("platform") ?? request.headers.get(CLIENT_HEADERS.platform));
    if (!platform) return problem(400, "unknown-platform", "platform must be one of ios, android, macos, windows, linux, web.");
    const versionText = url.searchParams.get("version");
    const version = versionText ? parseVersion(versionText) : null;
    if (versionText && !version) return problem(400, "invalid-version", "version must look like 1.4.0.");
    const language = url.searchParams.get("locale") ?? languageOf(request.headers.get("accept-language"));
    const record = (await store.get(platform)) ?? defaultRecord(platform);
    const payload = buildPayload(record, version, language);
    const body = JSON.stringify(payload);
    const etag = await etagOf(body);
    const headers = {
      "cache-control": `public, max-age=${maxAgeSeconds}, stale-while-revalidate=${maxAgeSeconds * 5}`,
      etag,
      vary: "Accept-Language",
      [CLIENT_HEADERS.contract]: String(payload.contract.max),
    };
    if (request.headers.get("if-none-match") === etag) return new Response(null, { status: 304, headers });
    return new Response(body, { status: 200, headers: { ...headers, "content-type": "application/json" } });
  };
}

/** What the guard decided, ready to apply to a response. */
export interface GuardOutcome {
  /** The `426` to return, or `null` to continue. */
  refusal: Response | null;
  /** `X-Contract-Version`, `Deprecation`, `Sunset` — set them on the response you return. */
  headers: Record<string, string>;
  result: GuardResult | null;
}

export interface GuardOptions {
  store: AppConfigStore;
  /** The base of Problem Details `type`. Defaults to `https://krizaka.com/problems/`. */
  problemBase?: string;
}

/**
 * The `426 Upgrade Required` filter for a Next.js backend (a route handler, or the proxy/middleware). A request
 * without `X-Client-Platform` is not an app and passes untouched.
 */
export async function checkClientVersion(request: Request, { store, problemBase = "https://krizaka.com/problems/" }: GuardOptions): Promise<GuardOutcome> {
  const platform = toPlatform(request.headers.get(CLIENT_HEADERS.platform));
  if (!platform) return { refusal: null, headers: {}, result: null };
  const record = (await store.get(platform)) ?? defaultRecord(platform);
  const result = evaluateGuard(record, {
    platform,
    version: request.headers.get(CLIENT_HEADERS.version),
    contract: request.headers.get(CLIENT_HEADERS.contract),
    language: languageOf(request.headers.get("accept-language")),
  });
  const headers: Record<string, string> = { [CLIENT_HEADERS.contract]: String(result.contract) };
  if (result.deprecation) headers[CLIENT_HEADERS.deprecation] = "true";
  if (result.status === 200 && result.sunset) headers[CLIENT_HEADERS.sunset] = result.sunset;
  if (result.status !== 426) return { refusal: null, headers, result };
  const { code, payload } = result;
  const detail =
    code === "contract-unsupported"
      ? "This version of the app speaks an API contract that is no longer served. Update the app."
      : "This version of the app is no longer supported. Update the app.";
  const refusal = new Response(
    JSON.stringify({ type: problemBase + code, title: "Upgrade Required", status: 426, code, detail, instance: new URL(request.url).pathname, appConfig: payload }),
    {
      status: 426,
      headers: {
        ...headers,
        "content-type": "application/problem+json",
        "cache-control": "no-store",
        upgrade: `krizaka-app/${payload.minSupportedVersion}`,
        connection: "Upgrade",
      },
    },
  );
  return { refusal, headers, result };
}

/**
 * Wraps a route handler: an app below the minimum gets the `426` before the handler runs; otherwise the
 * handler's response carries the contract headers. `APP_CONFIG_PATH` itself should not be wrapped.
 */
export function withClientVersionGuard<A extends unknown[]>(
  options: GuardOptions,
  handler: (request: Request, ...args: A) => Response | Promise<Response>,
): (request: Request, ...args: A) => Promise<Response> {
  return async (request, ...args) => {
    const outcome = await checkClientVersion(request, options);
    if (outcome.refusal) return outcome.refusal;
    const response = await handler(request, ...args);
    for (const [name, value] of Object.entries(outcome.headers)) response.headers.set(name, value);
    return response;
  };
}

export { APP_CONFIG_PATH };
