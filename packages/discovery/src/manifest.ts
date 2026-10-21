import type { LocalizedMessage } from "./message";
import { isVersion } from "./version";

export const SCHEMA_VERSION = 1;

export type Environment = "dev" | "prod";
export type ServiceStatus = "ok" | "maintenance";

/** The addresses of one service. A base has no trailing slash and may carry a path (`https://dev.orazaka.com/edge`). */
export interface ServiceBases {
  apiBase: string;
  webBase: string;
  /** Where sign-in lives, when it is not the API. */
  authBase?: string;
  /** Where the media are served, when they are not under the API. A name on a domain Krizaka owns. */
  mediaBase?: string;
}

/** One product in one environment, as the manifest publishes it. */
export interface ServiceEntry extends ServiceBases {
  /** Builds older than this show « please update ». */
  minAppVersion: string;
  /** The newest build in the stores (a soft « update available »). */
  latestAppVersion: string;
  status: ServiceStatus;
  message?: LocalizedMessage;
}

export interface ManifestBody {
  schemaVersion: typeof SCHEMA_VERSION;
  /** Which of the baked public keys signed it. */
  keyId: string;
  /** ISO instant of the signing: it only grows (a lower one than the cached document is a replay). */
  issuedAt: string;
  services: Record<string, Partial<Record<Environment, ServiceEntry>>>;
}

export interface Manifest extends ManifestBody {
  /** Base64 Ed25519 signature over `canonicalize({ ...body })`. */
  signature: string;
}

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const text = (v: unknown, max = 2048): v is string => typeof v === "string" && v.length > 0 && v.length <= max;

function validEntry(value: unknown): value is ServiceEntry {
  if (!isRecord(value)) return false;
  if (!text(value.apiBase) || !text(value.webBase)) return false;
  if (value.authBase !== undefined && !text(value.authBase)) return false;
  if (value.mediaBase !== undefined && !text(value.mediaBase)) return false;
  if (!text(value.minAppVersion) || !isVersion(value.minAppVersion)) return false;
  if (!text(value.latestAppVersion) || !isVersion(value.latestAppVersion)) return false;
  if (value.status !== "ok" && value.status !== "maintenance") return false;
  if (value.message !== undefined) {
    if (!isRecord(value.message) || !text(value.message.en, 280) || !text(value.message.fr, 280)) return false;
  }
  return true;
}

/** The shape of a manifest, nothing about its signature or its addresses' hosts (those are checked where they are used). */
export function parseManifest(value: unknown): Manifest | null {
  if (!isRecord(value) || value.schemaVersion !== SCHEMA_VERSION) return null;
  if (!text(value.keyId, 64) || !text(value.signature, 128)) return null;
  if (!text(value.issuedAt, 40) || Number.isNaN(Date.parse(value.issuedAt))) return null;
  if (!isRecord(value.services)) return null;
  for (const environments of Object.values(value.services)) {
    if (!isRecord(environments)) return null;
    for (const [environment, entry] of Object.entries(environments)) {
      if ((environment !== "dev" && environment !== "prod") || !validEntry(entry)) return null;
    }
  }
  return value as unknown as Manifest;
}
