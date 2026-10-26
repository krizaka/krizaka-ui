import { isAllowedUrl, normalizeBase } from "./hosts";
import type { Environment, Manifest, ServiceBases, ServiceEntry } from "./manifest";
import type { LocalizedMessage } from "./message";
import type { DiscoveryStorage } from "./storage";
import { type PublicKeys, verifyManifest } from "./verify";
import { compareVersions } from "./version";


/** Where a resolved address came from, best first. */
export type ServiceSource = "override" | "live" | "cache" | "default" | "legacy";

export interface ResolvedService extends ServiceBases {
  /** `authBase` falls back to `apiBase`. */
  authBase: string;
  source: ServiceSource;
}

/** What the app must do before it talks to a service. Only a verified document (live or cached) can ask for more than `ok`. */
export type Gate =
  | { state: "ok"; updateAvailable: boolean; latestAppVersion?: string }
  | { state: "update-required"; minAppVersion: string; latestAppVersion: string; message?: LocalizedMessage }
  | { state: "maintenance"; message?: LocalizedMessage };

export interface DiscoveryOptions {
  /** The channel this build belongs to; it picks the entry of each product. */
  environment: Environment;
  /** The running build's version (`x.y.z`). Unreadable → the gates stay open: a bug of ours never locks people out. */
  appVersion: string;
  /** The manifest, then its fallback copies. https only. */
  manifestUrls: readonly string[];
  /** Baked public keys (key id → base64). */
  publicKeys: PublicKeys;
  /** Baked domain suffixes the app trusts (`krizaka.com`, its product's domain). */
  allowedHostSuffixes: readonly string[];
  /** Baked default addresses per product: used until a verified document says otherwise. */
  defaults?: Record<string, ServiceBases>;
  /** The addresses hard-coded before discovery existed: the last resort. */
  legacy?: Record<string, ServiceBases>;
  /** Local development: addresses that win over everything (a LAN address, a tunnel); no network for that product. */
  overrides?: Record<string, ServiceBases>;
  storage?: DiscoveryStorage;
  fetch?: typeof fetch;
  /** Per manifest URL, milliseconds. Default 3000. */
  timeoutMs?: number;
  /** Storage key. Default `krizaka.discovery.v1`. */
  storageKey?: string;
}

export type RefreshResult = { ok: true; url: string; changed: boolean } | { ok: false; reason: string };

export interface Discovery {
  /** Loads the cache, then fetches when there is nothing cached (bounded by the timeout) or refreshes in the background. Never rejects. */
  start(): Promise<void>;
  /** Fetches, verifies and caches. Never rejects: a failure is a reason, and the previous state stays. */
  refresh(): Promise<RefreshResult>;
  /** `getService("yomizaka").apiBase`. Never throws for a product with a default, a legacy address or an override. */
  getService(product: string): ResolvedService;
  getGate(product: string): Gate;
  /** The document in force (live, else cached), for diagnostics. */
  document(): Manifest | null;
  subscribe(listener: () => void): () => void;
  /** A number that changes when anything a reader can see changes (for `useSyncExternalStore`). */
  version(): number;
  /** Refreshes every `intervalMs` (default 15 min); the returned function stops it. */
  startBackgroundRefresh(intervalMs?: number): () => void;
}

const MAX_BYTES = 64 * 1024;

function bases(value: ServiceBases, suffixes: readonly string[] | null): ServiceBases | null {
  const out: ServiceBases = { apiBase: value.apiBase, webBase: value.webBase };
  if (value.authBase !== undefined) out.authBase = value.authBase;
  if (value.mediaBase !== undefined) out.mediaBase = value.mediaBase;
  for (const url of [out.apiBase, out.webBase, out.authBase, out.mediaBase]) {
    if (url !== undefined && suffixes !== null && !isAllowedUrl(url, suffixes)) return null;
  }
  return {
    apiBase: normalizeBase(out.apiBase),
    webBase: normalizeBase(out.webBase),
    ...(out.authBase !== undefined ? { authBase: normalizeBase(out.authBase) } : {}),
    ...(out.mediaBase !== undefined ? { mediaBase: normalizeBase(out.mediaBase) } : {}),
  };
}

const resolved = (b: ServiceBases, source: ServiceSource): ResolvedService => ({ ...b, authBase: b.authBase ?? b.apiBase, source });

export function createDiscovery(options: DiscoveryOptions): Discovery {
  const { environment, appVersion, manifestUrls, publicKeys, allowedHostSuffixes: suffixes } = options;
  const storageKey = options.storageKey ?? `krizaka.discovery.v1.${environment}`;
  const timeoutMs = options.timeoutMs ?? 3000;
  const fetchImpl = options.fetch ?? globalThis.fetch;
  for (const url of manifestUrls) {
    if (!url.startsWith("https://")) throw new Error(`discovery: manifest URL must be https (${url})`);
  }
  const check = (label: string, source: Record<string, ServiceBases> | undefined, host: readonly string[] | null) => {
    const out: Record<string, ServiceBases> = {};
    for (const [product, value] of Object.entries(source ?? {})) {
      const ok = bases(value, host);
      if (!ok) throw new Error(`discovery: the ${label} address of ${product} is not on an allowed host`);
      out[product] = ok;
    }
    return out;
  };
  const defaults = check("default", options.defaults, suffixes);
  const legacy = check("legacy", options.legacy, suffixes);
  const overrides = check("override", options.overrides, null);

  let doc: Manifest | null = null;
  let docSource: "live" | "cache" = "cache";
  let counter = 0;
  let started: Promise<void> | null = null;
  let inflight: Promise<RefreshResult> | null = null;
  const listeners = new Set<() => void>();
  const changed = () => {
    counter += 1;
    for (const listener of [...listeners]) listener();
  };

  const entryOf = (product: string): ServiceEntry | undefined => doc?.services[product]?.[environment];

  async function readCache(): Promise<void> {
    if (!options.storage) return;
    try {
      const raw = await options.storage.getItem(storageKey);
      if (!raw) return;
      const result = verifyManifest(raw, publicKeys);
      if (result.ok) {
        doc = result.manifest;
        docSource = "cache";
      }
    } catch {
      /* unreadable storage: behave as if empty */
    }
  }

  async function fetchOne(url: string): Promise<string> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetchImpl(url, { headers: { accept: "application/json" }, cache: "no-store", signal: controller.signal });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const body = await response.text();
      if (body.length > MAX_BYTES) throw new Error("manifest too large");
      return body;
    } finally {
      clearTimeout(timer);
    }
  }

  async function doRefresh(): Promise<RefreshResult> {
    let last = "no manifest URL";
    for (const url of manifestUrls) {
      let body: string;
      try {
        body = await fetchOne(url);
      } catch (error) {
        last = error instanceof Error ? error.message : "network error";
        continue;
      }
      const result = verifyManifest(body, publicKeys);
      if (!result.ok) {
        last = result.reason;
        continue;
      }
      if (doc && Date.parse(result.manifest.issuedAt) < Date.parse(doc.issuedAt)) {
        last = "older than the document in force";
        continue;
      }
      const different = !doc || doc.signature !== result.manifest.signature || docSource !== "live";
      doc = result.manifest;
      docSource = "live";
      try {
        await options.storage?.setItem(storageKey, body);
      } catch {
        /* a cache that cannot be written is not an error */
      }
      if (different) changed();
      return { ok: true, url, changed: different };
    }
    return { ok: false, reason: last };
  }

  const refresh = (): Promise<RefreshResult> => {
    inflight ??= doRefresh().finally(() => {
      inflight = null;
    });
    return inflight;
  };

  return {
    start() {
      started ??= (async () => {
        await readCache();
        if (doc) {
          changed();
          void refresh();
        } else {
          changed();
          let timer: ReturnType<typeof setTimeout> | undefined;
          const deadline = new Promise<void>((resolve) => {
            timer = setTimeout(resolve, timeoutMs);
          });
          await Promise.race([refresh(), deadline]);
          clearTimeout(timer);
        }
      })();
      return started;
    },
    refresh,
    getService(product) {
      const override = overrides[product];
      if (override) return resolved(override, "override");
      const entry = entryOf(product);
      if (entry) {
        const live = bases(entry, suffixes);
        if (live) return resolved(live, docSource);
      }
      const fallback = defaults[product];
      if (fallback) return resolved(fallback, "default");
      const last = legacy[product];
      if (last) return resolved(last, "legacy");
      throw new Error(`discovery: no address for ${product}`);
    },
    getGate(product) {
      const entry = overrides[product] ? undefined : entryOf(product);
      if (!entry || !bases(entry, suffixes)) return { state: "ok", updateAvailable: false };
      if (compareVersions(appVersion, entry.minAppVersion) === -1) {
        return { state: "update-required", minAppVersion: entry.minAppVersion, latestAppVersion: entry.latestAppVersion, ...(entry.message ? { message: entry.message } : {}) };
      }
      if (entry.status === "maintenance") return { state: "maintenance", ...(entry.message ? { message: entry.message } : {}) };
      return { state: "ok", updateAvailable: compareVersions(appVersion, entry.latestAppVersion) === -1, latestAppVersion: entry.latestAppVersion };
    },
    document: () => doc,
    subscribe(listener) {
      listeners.add(listener);
      return () => void listeners.delete(listener);
    },
    version: () => counter,
    startBackgroundRefresh(intervalMs = 15 * 60 * 1000) {
      const timer = setInterval(() => void refresh(), intervalMs);
      return () => clearInterval(timer);
    },
  };
}
