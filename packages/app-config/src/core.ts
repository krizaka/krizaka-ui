/**
 * The contract, pure: versions, the payload, and the rules that decide what happens to a client.
 * Twin of the Java building block `krizaka-app-config`; `test/cases.json` is the fixture both obey.
 */

export const PLATFORMS = ["ios", "android", "macos", "windows", "linux", "web"] as const;
export type Platform = (typeof PLATFORMS)[number];

export const UPDATE_MODES = ["none", "soft", "force"] as const;
export type UpdateMode = (typeof UPDATE_MODES)[number];

/** The headers an app sends and the backend answers with. */
export const CLIENT_HEADERS = {
  version: "X-Client-Version",
  platform: "X-Client-Platform",
  contract: "X-Contract-Version",
  build: "X-Client-Build",
  deprecation: "Deprecation",
  sunset: "Sunset",
} as const;

/** The public endpoint's path. */
export const APP_CONFIG_PATH = "/api/v1/app-config";

export type FlagValue = boolean | number | string;

/** What `GET /api/v1/app-config` returns and what a `426` carries as `appConfig`. */
export interface AppConfigPayload {
  platform: Platform;
  minSupportedVersion: string;
  latestVersion: string;
  updateMode: UpdateMode;
  storeUrl: string | null;
  maintenance: { on: boolean; message: string | null };
  contract: { min: number; max: number; sunset: string | null };
  flags: Record<string, FlagValue>;
  message: string | null;
  locale: string;
}

/** The parameters of one platform, as the database holds them (the admin edits this shape). */
export interface AppConfigRecord {
  platform: Platform;
  minSupportedVersion: string;
  latestVersion: string;
  updateOverride: UpdateMode | null;
  storeUrl: string | null;
  maintenanceOn: boolean;
  maintenanceMessage: Record<string, string>;
  message: Record<string, string>;
  contractMin: number;
  contractMax: number;
  contractSunset: string | null;
  flags: Record<string, FlagValue>;
  revision: number;
  updatedAt: string;
  updatedBy: string;
}

/** What a client says about itself (headers or query). */
export interface ClientInfo {
  platform?: string | null;
  version?: string | null;
  contract?: string | number | null;
  language?: string | null;
}

export type Version = readonly [major: number, minor: number, patch: number];

const VERSION = /^v?(\d{1,6})(?:\.(\d{1,6}))?(?:\.(\d{1,6}))?(?:[-+].*)?$/;

/** `1.4`, `v1.4.0`, `1.4.0-beta.2` and `1.4.0+42` all read as `[1, 4, 0]`; anything else is `null`. */
export function parseVersion(text: string | null | undefined): Version | null {
  const match = VERSION.exec((text ?? "").trim());
  return match ? [Number(match[1]), Number(match[2] ?? 0), Number(match[3] ?? 0)] : null;
}

export function compareVersions(a: Version, b: Version): number {
  return a[0] - b[0] || a[1] - b[1] || a[2] - b[2];
}

export function formatVersion(version: Version): string {
  return version.join(".");
}

const ZERO: Version = [0, 0, 0];

export function isPlatform(value: unknown): value is Platform {
  return typeof value === "string" && (PLATFORMS as readonly string[]).includes(value.trim().toLowerCase());
}

export function toPlatform(value: string | null | undefined): Platform | null {
  const wanted = (value ?? "").trim().toLowerCase();
  return isPlatform(wanted) ? wanted : null;
}

/** The permissive parameters a platform starts with: nobody is locked out. */
export function defaultRecord(platform: Platform): AppConfigRecord {
  return {
    platform,
    minSupportedVersion: "0.0.0",
    latestVersion: "0.0.0",
    updateOverride: null,
    storeUrl: null,
    maintenanceOn: false,
    maintenanceMessage: {},
    message: {},
    contractMin: 1,
    contractMax: 1,
    contractSunset: null,
    flags: {},
    revision: 1,
    updatedAt: new Date(0).toISOString(),
    updatedBy: "seed",
  };
}

const LANGUAGE = /^[a-z]{2}$/;
const FLAG_KEY = /^[A-Za-z][A-Za-z0-9._-]{0,63}$/;
const MAX_TEXT = 500;

function checkTexts(field: string, texts: Record<string, string>): string[] {
  return Object.entries(texts).flatMap(([language, text]) => {
    if (!LANGUAGE.test(language)) return [`${field} language must be two letters: ${language}`];
    return text.length > MAX_TEXT ? [`${field}.${language} is too long`] : [];
  });
}

/** The safety bounds of an edit; an empty list means the record can be published. */
export function validateRecord(record: AppConfigRecord): string[] {
  const problems: string[] = [];
  const min = parseVersion(record.minSupportedVersion);
  const latest = parseVersion(record.latestVersion);
  if (!min || !latest) problems.push("versions must look like 1.4.0");
  else if (compareVersions(latest, min) < 0) problems.push("latestVersion is older than minSupportedVersion");
  if (!Number.isInteger(record.contractMin) || record.contractMin < 1 || record.contractMax < record.contractMin) {
    problems.push("contract range must satisfy 1 <= min <= max");
  }
  if (record.storeUrl !== null && !/^https:\/\/[^\s/]+/.test(record.storeUrl)) problems.push("storeUrl must be an absolute https URL");
  problems.push(...checkTexts("message", record.message), ...checkTexts("maintenanceMessage", record.maintenanceMessage));
  for (const [key, value] of Object.entries(record.flags)) {
    if (!FLAG_KEY.test(key)) problems.push(`flag key not allowed: ${key}`);
    if (!["boolean", "number", "string"].includes(typeof value)) problems.push(`flag ${key} must be a boolean, number or string`);
  }
  return problems;
}

/** `none`, `soft` or `force` for the version the client runs. The operator's override wins. */
export function updateModeFor(record: AppConfigRecord, client: Version | null): UpdateMode {
  if (record.updateOverride) return record.updateOverride;
  if (!client) return "none";
  if (compareVersions(client, parseVersion(record.minSupportedVersion) ?? ZERO) < 0) return "force";
  return compareVersions(client, parseVersion(record.latestVersion) ?? ZERO) < 0 ? "soft" : "none";
}

function pickLanguage(wanted: string | null | undefined, ...texts: Record<string, string>[]): string {
  const language = (wanted ?? "en").toLowerCase();
  return texts.some((t) => language in t) ? language : "en";
}

/** The public payload for a client, its texts in the best language available. */
export function buildPayload(record: AppConfigRecord, client: Version | null, language?: string | null): AppConfigPayload {
  const chosen = pickLanguage(language, record.message, record.maintenanceMessage);
  const text = (texts: Record<string, string>) => texts[chosen] ?? texts.en ?? null;
  return {
    platform: record.platform,
    minSupportedVersion: formatVersion(parseVersion(record.minSupportedVersion) ?? ZERO),
    latestVersion: formatVersion(parseVersion(record.latestVersion) ?? ZERO),
    updateMode: updateModeFor(record, client),
    storeUrl: record.storeUrl,
    maintenance: { on: record.maintenanceOn, message: text(record.maintenanceMessage) },
    contract: { min: record.contractMin, max: record.contractMax, sunset: record.contractSunset },
    flags: record.flags,
    message: text(record.message),
    locale: chosen,
  };
}

export type GuardCode = "upgrade-required" | "contract-unsupported";

/** What the 426 filter does with a request. */
export type GuardResult = {
  /** `Deprecation: true` — the contract the client speaks is served but on its way out. */
  deprecation: boolean;
  /** The newest contract the backend speaks (`X-Contract-Version` of the answer). */
  contract: number;
} & (
  | {
      status: 200;
      /** The `Sunset` HTTP date, when announced. */
      sunset?: string;
    }
  | {
      status: 426;
      code: GuardCode;
      /** The `appConfig` of a 426: the payload with `updateMode: "force"`. */
      payload: AppConfigPayload;
    }
);

function contractOf(value: string | number | null | undefined): number | null {
  const n = typeof value === "number" ? value : Number.parseInt(String(value ?? "").trim(), 10);
  return Number.isInteger(n) && n >= 1 ? n : null;
}

function sunsetDate(day: string): string {
  const [y, m, d] = day.split("-").map(Number) as [number, number, number];
  return new Date(Date.UTC(y, m - 1, d + 1)).toUTCString();
}

/** The 426 filter's decision: below the minimum or an unserved contract is refused; N-1 is deprecated. */
export function evaluateGuard(record: AppConfigRecord, client: ClientInfo): GuardResult {
  const version = parseVersion(client.version);
  const contract = contractOf(client.contract);
  const base = { deprecation: false, contract: record.contractMax };
  const tooOld = version !== null && compareVersions(version, parseVersion(record.minSupportedVersion) ?? ZERO) < 0;
  const contractGone = contract !== null && contract < record.contractMin;
  if (tooOld || contractGone) {
    const payload: AppConfigPayload = { ...buildPayload(record, version, client.language), updateMode: "force" };
    return { ...base, status: 426, code: tooOld ? "upgrade-required" : "contract-unsupported", payload };
  }
  if (contract !== null && contract < record.contractMax) {
    return { ...base, status: 200, deprecation: true, ...(record.contractSunset ? { sunset: sunsetDate(record.contractSunset) } : {}) };
  }
  return { ...base, status: 200 };
}

const SEMVER = /^\d+\.\d+\.\d+$/;

/** A structural check of a payload read from the network: anything else is ignored (fail open). */
export function isAppConfigPayload(value: unknown): value is AppConfigPayload {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  const maintenance = v.maintenance as Record<string, unknown> | undefined;
  const contract = v.contract as Record<string, unknown> | undefined;
  return (
    isPlatform(v.platform) &&
    typeof v.minSupportedVersion === "string" &&
    SEMVER.test(v.minSupportedVersion) &&
    typeof v.latestVersion === "string" &&
    SEMVER.test(v.latestVersion) &&
    (UPDATE_MODES as readonly unknown[]).includes(v.updateMode) &&
    typeof maintenance === "object" &&
    typeof maintenance?.on === "boolean" &&
    typeof contract === "object" &&
    typeof contract?.min === "number" &&
    typeof contract?.max === "number"
  );
}
