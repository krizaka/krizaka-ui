import {
  createDiscovery,
  type Discovery,
  type DiscoveryOptions,
  type Environment,
  KRIZAKA_HOST_SUFFIXES,
  KRIZAKA_MANIFEST_URLS,
  KRIZAKA_PUBLIC_KEYS,
  type ServiceBases,
} from "@krizaka/discovery";

import { discoveryStorage, type KeyValueStorage } from "./storage";

const URL_ERROR = "EXPO_PUBLIC_APP_URL must be an absolute http(s) URL";

/** `EXPO_PUBLIC_APP_URL`: an address that wins over discovery (a machine on the network, a tunnel). A malformed value fails at start. */
export function appUrlOverrideFrom(raw: string | undefined): string | undefined {
  const value = raw?.trim();
  if (!value) return undefined;
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(URL_ERROR);
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error(URL_ERROR);
  return value.replace(/\/$/, "");
}

/** `EXPO_PUBLIC_APP_ENV`: which entry of the manifest this build follows. */
export function appEnvironmentFrom(raw: string | undefined): Environment {
  const value = raw?.trim() || "dev";
  if (value !== "dev" && value !== "prod") throw new Error("EXPO_PUBLIC_APP_ENV must be dev or prod");
  return value;
}

export interface AppDiscoveryOptions {
  /** The product's key in the manifest (`yomizaka`). */
  product: string;
  /** The product's own domain, trusted next to Krizaka's (`yomizaka.com`). */
  hostSuffix: string;
  appVersion: string;
  /** Used until a verified manifest says otherwise. */
  baked: ServiceBases;
  /** The address hard-coded before discovery existed, if any: the last resort. Defaults to `baked`. */
  legacy?: ServiceBases;
  storage: KeyValueStorage;
  /** The two build inputs, read by the app: Metro inlines `process.env.EXPO_PUBLIC_*` only where it is written. */
  env: { url?: string; environment?: string };
  /** Tests and tooling pass their own fetch, keys, timeouts. */
  discovery?: Partial<DiscoveryOptions>;
}

/** An app's discovery client: Krizaka's manifest, keys and host allow-list, plus this product's. */
export function createAppDiscovery(options: AppDiscoveryOptions): Discovery {
  const override = appUrlOverrideFrom(options.env.url);
  return createDiscovery({
    environment: appEnvironmentFrom(options.env.environment),
    appVersion: options.appVersion,
    manifestUrls: KRIZAKA_MANIFEST_URLS,
    publicKeys: KRIZAKA_PUBLIC_KEYS,
    allowedHostSuffixes: [...KRIZAKA_HOST_SUFFIXES, options.hostSuffix],
    defaults: { [options.product]: options.baked },
    legacy: { [options.product]: options.legacy ?? options.baked },
    ...(override ? { overrides: { [options.product]: { apiBase: override, webBase: override } } } : {}),
    storage: discoveryStorage(options.storage),
    ...options.discovery,
  });
}
