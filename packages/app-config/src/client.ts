import {
  APP_CONFIG_PATH,
  type AppConfigPayload,
  CLIENT_HEADERS,
  isAppConfigPayload,
  type Platform,
} from "./core";

/** What the app must show, decided from the payload. Maintenance outranks an update. */
export type Decision =
  | { kind: "ok" }
  | { kind: "soft"; config: AppConfigPayload }
  | { kind: "force"; config: AppConfigPayload }
  | { kind: "maintenance"; config: AppConfigPayload };

export type AppConfigStatus = "idle" | "loading" | "ready" | "failed";

export interface AppConfigState {
  status: AppConfigStatus;
  config: AppConfigPayload | null;
  decision: Decision;
  /** The 426 payload that forced the screen, if a request got one. */
  upgradeRequired: AppConfigPayload | null;
}

/** A place to remember which version's soft prompt the person already dismissed. */
export interface DismissStorage {
  getItem(key: string): string | null | Promise<string | null>;
  setItem(key: string, value: string): void | Promise<void>;
}

export interface AppConfigClientOptions {
  /** The backend's origin, e.g. `https://dev.orazaka.com`. A function is read at each check, so an address found by
   *  `@krizaka/discovery` (and moved by its manifest) is followed without rebuilding the client. */
  baseUrl: string | (() => string);
  platform: Platform;
  /** The version the app runs (`1.4.0`), from the build, never typed twice. */
  version: string;
  /** The API contract the app speaks. Defaults to 1. */
  contract?: number;
  build?: string;
  fetch?: typeof fetch;
  /** The language to ask texts in (`fr`); defaults to the backend's `Accept-Language` reading. */
  language?: () => string | undefined;
  storage?: DismissStorage;
  now?: () => number;
  /** A check requested sooner than this after the last one is skipped (resume storms). Default 300 s. */
  minIntervalMs?: number;
}

// @fixed: interface setting — a resume within five minutes of the last check is not worth a request.
const DEFAULT_MIN_INTERVAL_MS = 300_000;
const DISMISS_KEY = "krizaka.app-config.soft-dismissed";

/** Maintenance first, then a forced update, then a soft one. */
export function decide(config: AppConfigPayload | null, softDismissedFor?: string | null): Decision {
  if (!config) return { kind: "ok" };
  if (config.maintenance.on) return { kind: "maintenance", config };
  if (config.updateMode === "force") return { kind: "force", config };
  if (config.updateMode === "soft" && softDismissedFor !== config.latestVersion) return { kind: "soft", config };
  return { kind: "ok" };
}

/** The headers every request of the app carries. */
export function clientHeaders(info: { platform: Platform; version: string; contract?: number; build?: string }): Record<string, string> {
  return {
    [CLIENT_HEADERS.platform]: info.platform,
    [CLIENT_HEADERS.version]: info.version,
    [CLIENT_HEADERS.contract]: String(info.contract ?? 1),
    ...(info.build ? { [CLIENT_HEADERS.build]: info.build } : {}),
  };
}

/** Whether a response is the backend telling the app to update. */
export function isUpgradeRequired(response: { status: number }): boolean {
  return response.status === 426;
}

/** The `appConfig` member of an already parsed `426` body, or `null` (for a transport that is not `fetch`, e.g. XHR). */
export function upgradePayloadOf(body: unknown): AppConfigPayload | null {
  const appConfig = (body as { appConfig?: unknown } | null)?.appConfig;
  return isAppConfigPayload(appConfig) ? normalise(appConfig) : null;
}

/** The `appConfig` of a `426` response, or `null` when the body is not one (the app still must update). */
export async function readUpgradeRequired(response: Response): Promise<AppConfigPayload | null> {
  try {
    return upgradePayloadOf(await response.clone().json());
  } catch {
    return null;
  }
}

function normalise(payload: AppConfigPayload): AppConfigPayload {
  return { ...payload, flags: payload.flags ?? {}, message: payload.message ?? null, storeUrl: payload.storeUrl ?? null, locale: payload.locale ?? "en" };
}

/** `https://x//` → `https://x` (a loop, not a regular expression: no backtracking on a long run of slashes). */
function withoutTrailingSlashes(url: string): string {
  let end = url.length;
  while (end > 0 && url.endsWith("/", end)) end -= 1;
  return url.slice(0, end);
}

/** The caller's headers with ours added where it has not set them (names compare case-insensitively). A plain object stays one. */
function withDefaults(given: NonNullable<RequestInit["headers"]> | undefined, defaults: Readonly<Record<string, string>>): NonNullable<RequestInit["headers"]> {
  if (given instanceof Headers) {
    const merged = new Headers(given);
    for (const [name, value] of Object.entries(defaults)) if (!merged.has(name)) merged.set(name, value);
    return merged;
  }
  const own: Record<string, string> = Array.isArray(given) ? Object.fromEntries(given) : { ...given };
  const known = new Set(Object.keys(own).map((name) => name.toLowerCase()));
  for (const [name, value] of Object.entries(defaults)) if (!known.has(name.toLowerCase())) own[name] = value;
  return own;
}

export interface AppConfigClient {
  /** The headers every request carries — for a transport that is not `fetch` (XHR, a native module). */
  readonly headers: Readonly<Record<string, string>>;
  getState(): AppConfigState;
  subscribe(listener: () => void): () => void;
  /** Checks the backend. Skipped when a check ran less than `minIntervalMs` ago, unless `force`. Never throws. */
  check(options?: { force?: boolean }): Promise<void>;
  /** The person dismissed the soft prompt: not shown again for this `latestVersion`. */
  dismissSoft(): Promise<void>;
  /** A request got a 426 (the global interceptor calls this). */
  reportUpgradeRequired(payload: AppConfigPayload | null): void;
  /** `fetch` that sends the client headers and reports every 426 to this client. */
  fetch: typeof fetch;
  /** Checks again each time `resume` fires (app foreground, tab visible). Returns the unsubscribe. */
  attach(resume: (callback: () => void) => () => void): () => void;
}

export function createAppConfigClient(options: AppConfigClientOptions): AppConfigClient {
  const base = () => withoutTrailingSlashes(typeof options.baseUrl === "function" ? options.baseUrl() : options.baseUrl);
  const doFetch = options.fetch ?? ((...args: Parameters<typeof fetch>) => fetch(...args));
  const now = options.now ?? Date.now;
  const interval = options.minIntervalMs ?? DEFAULT_MIN_INTERVAL_MS;
  const headers = clientHeaders(options);
  const listeners = new Set<() => void>();
  let dismissed: string | null = null;
  let lastCheck = Number.NEGATIVE_INFINITY;
  let state: AppConfigState = { status: "idle", config: null, decision: { kind: "ok" }, upgradeRequired: null };

  const set = (patch: Partial<AppConfigState>) => {
    state = { ...state, ...patch };
    state = { ...state, decision: state.upgradeRequired ? { kind: "force", config: state.upgradeRequired } : decide(state.config, dismissed) };
    for (const listener of listeners) listener();
  };

  const client: AppConfigClient = {
    headers,
    getState: () => state,
    subscribe(listener) {
      listeners.add(listener);
      return () => void listeners.delete(listener);
    },
    async check({ force = false } = {}) {
      if (!force && now() - lastCheck < interval) return;
      lastCheck = now();
      set({ status: "loading" });
      try {
        if (options.storage && dismissed === null) dismissed = (await options.storage.getItem(DISMISS_KEY)) ?? "";
        const query = new URLSearchParams({ platform: options.platform, version: options.version });
        const language = options.language?.();
        if (language) query.set("locale", language);
        const response = await doFetch(`${base()}${APP_CONFIG_PATH}?${query}`, { headers });
        const body: unknown = response.ok ? await response.json() : null;
        if (!isAppConfigPayload(body)) {
          set({ status: "failed" });
          return;
        }
        set({ status: "ready", config: normalise(body) });
      } catch {
        // Fail open: an unreachable or broken config endpoint never locks the app.
        set({ status: "failed" });
      }
    },
    async dismissSoft() {
      const latest = state.config?.latestVersion;
      if (!latest) return;
      dismissed = latest;
      await options.storage?.setItem(DISMISS_KEY, latest);
      set({});
    },
    reportUpgradeRequired(payload) {
      const known = payload ?? state.config;
      // A 426 without a usable body still blocks: the person must update, whatever the store says.
      const fallback: AppConfigPayload = {
        platform: options.platform,
        minSupportedVersion: known?.minSupportedVersion ?? options.version,
        latestVersion: known?.latestVersion ?? options.version,
        updateMode: "force",
        storeUrl: known?.storeUrl ?? null,
        maintenance: { on: false, message: null },
        contract: known?.contract ?? { min: 1, max: 1, sunset: null },
        flags: known?.flags ?? {},
        message: known?.message ?? null,
        locale: known?.locale ?? "en",
      };
      set({ upgradeRequired: { ...fallback, updateMode: "force" } });
    },
    fetch: async (input, init) => {
      const response = await doFetch(input, { ...init, headers: withDefaults(init?.headers, headers) });
      if (isUpgradeRequired(response)) client.reportUpgradeRequired(await readUpgradeRequired(response));
      return response;
    },
    attach(resume) {
      return resume(() => void client.check());
    },
  };
  return client;
}
