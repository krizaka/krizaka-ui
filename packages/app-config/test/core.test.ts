import { describe, expect, it } from "vitest";

import {
  type AppConfigRecord,
  buildPayload,
  compareVersions,
  defaultRecord,
  evaluateGuard,
  formatVersion,
  isAppConfigPayload,
  isPlatform,
  parseVersion,
  type Platform,
  toPlatform,
  updateModeFor,
  validateRecord,
} from "../src/index";
import cases from "./cases.json";

function record(platform: Platform, config: Record<string, unknown>): AppConfigRecord {
  return { ...defaultRecord(platform), ...config, revision: 1 } as AppConfigRecord;
}

describe("the shared fixture (Java and TypeScript obey the same cases)", () => {
  for (const c of cases.cases) {
    it(c.name, () => {
      const platform = c.platform as Platform;
      const rec = record(platform, c.config);
      const client = c.client as { version?: string; contract?: number; language?: string };
      const payload = buildPayload(rec, parseVersion(client.version), client.language);
      expect(payload).toMatchObject(c.expect.payload);
      const guard = evaluateGuard(rec, client);
      const expected = c.expect.guard as { status: number; code?: string; deprecation?: boolean; sunset?: string };
      expect(guard.status).toBe(expected.status);
      if (guard.status === 426) {
        expect(guard.code).toBe(expected.code);
        expect(guard.payload.updateMode).toBe("force");
      }
      if (expected.deprecation !== undefined) expect(guard.deprecation).toBe(expected.deprecation);
      if (expected.sunset) expect(guard.status === 200 && guard.sunset).toBe(expected.sunset);
    });
  }
});

describe("versions", () => {
  it("reads the numeric core", () => {
    for (const text of ["1.4.0", "1.4", "v1.4.0", "1.4.0-beta.2", "1.4.0+42", " 1.4.0 "]) expect(parseVersion(text)).toEqual([1, 4, 0]);
    expect(parseVersion("2")).toEqual([2, 0, 0]);
    for (const text of ["", "abc", "-1.0.0", "1.x.0", "latest", null, undefined]) expect(parseVersion(text)).toBeNull();
  });
  it("compares numerically and prints canonically", () => {
    expect(compareVersions([1, 9, 0], [1, 10, 0])).toBeLessThan(0);
    expect(compareVersions([2, 0, 0], [1, 99, 99])).toBeGreaterThan(0);
    expect(compareVersions([1, 2, 3], [1, 2, 3])).toBe(0);
    expect(formatVersion([1, 4, 0])).toBe("1.4.0");
  });
  it("knows the platforms", () => {
    expect(isPlatform("ios")).toBe(true);
    expect(isPlatform("playstation")).toBe(false);
    expect(isPlatform(3)).toBe(false);
    expect(toPlatform(" MacOS ")).toBe("macos");
    expect(toPlatform(null)).toBeNull();
  });
});

describe("rules", () => {
  it("falls back to zero for a stored version it cannot read, and never locks out", () => {
    const broken = record("ios", { minSupportedVersion: "garbage", latestVersion: "garbage" });
    expect(updateModeFor(broken, [1, 0, 0])).toBe("none");
    expect(buildPayload(broken, null).minSupportedVersion).toBe("0.0.0");
    expect(evaluateGuard(broken, { version: "1.0.0" }).status).toBe(200);
  });
  it("reads the contract header as a number, or ignores it", () => {
    const rec = record("ios", { contractMin: 2, contractMax: 3 });
    expect(evaluateGuard(rec, { contract: "1" })).toMatchObject({ status: 426, code: "contract-unsupported" });
    expect(evaluateGuard(rec, { contract: "abc" }).status).toBe(200);
    expect(evaluateGuard(rec, { contract: 0 }).status).toBe(200);
    expect(evaluateGuard(rec, { contract: null }).status).toBe(200);
    expect(evaluateGuard(rec, { contract: 2 }).deprecation).toBe(true);
  });
  it("answers the newest contract it speaks", () => {
    expect(evaluateGuard(record("web", { contractMax: 4, contractMin: 1 }), {}).contract).toBe(4);
  });
  it("falls back to English texts, and to nothing when there are none", () => {
    const rec = record("ios", { message: { en: "Hi" } });
    expect(buildPayload(rec, null, "fr").message).toBe("Hi");
    expect(buildPayload(rec, null, undefined).message).toBe("Hi");
    expect(buildPayload(defaultRecord("ios"), null).message).toBeNull();
  });
});

describe("validateRecord", () => {
  const ok = record("ios", { minSupportedVersion: "1.0.0", latestVersion: "1.2.0", storeUrl: "https://apps.apple.com/app/id1", flags: { a: true, b: 1, c: "x" }, message: { en: "x" } });
  it("accepts a good record", () => expect(validateRecord(ok)).toEqual([]));
  it("refuses a minimum above the latest", () => expect(validateRecord({ ...ok, minSupportedVersion: "2.0.0" })).toContain("latestVersion is older than minSupportedVersion"));
  it("refuses an unreadable version", () => expect(validateRecord({ ...ok, latestVersion: "soon" })).toContain("versions must look like 1.4.0"));
  it("refuses an empty contract range", () => {
    expect(validateRecord({ ...ok, contractMin: 3, contractMax: 2 })).toContain("contract range must satisfy 1 <= min <= max");
    expect(validateRecord({ ...ok, contractMin: 0 })).toContain("contract range must satisfy 1 <= min <= max");
  });
  it("refuses a non-https store URL", () => {
    expect(validateRecord({ ...ok, storeUrl: "http://x.example" })).toContain("storeUrl must be an absolute https URL");
    expect(validateRecord({ ...ok, storeUrl: "javascript:alert(1)" })).toHaveLength(1);
  });
  it("refuses texts with a long language or too long, and bad flags", () => {
    expect(validateRecord({ ...ok, message: { english: "x" } })[0]).toMatch(/two letters/);
    expect(validateRecord({ ...ok, maintenanceMessage: { en: "x".repeat(501) } })[0]).toMatch(/too long/);
    expect(validateRecord({ ...ok, flags: { "bad key": true } })[0]).toMatch(/flag key/);
    expect(validateRecord({ ...ok, flags: { a: {} as unknown as boolean } })[0]).toMatch(/must be a boolean/);
  });
});

describe("isAppConfigPayload", () => {
  const good = buildPayload(defaultRecord("ios"), null);
  it("accepts a payload and refuses anything else", () => {
    expect(isAppConfigPayload(good)).toBe(true);
    for (const bad of [null, "x", 3, {}, { ...good, platform: "x" }, { ...good, minSupportedVersion: "1" }, { ...good, latestVersion: 2 }, { ...good, updateMode: "later" }, { ...good, maintenance: null }, { ...good, maintenance: { on: "yes" } }, { ...good, contract: null }, { ...good, contract: { min: "1", max: 1 } }]) {
      expect(isAppConfigPayload(bad)).toBe(false);
    }
  });
});
