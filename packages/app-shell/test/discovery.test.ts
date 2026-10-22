import { describe, expect, it } from "vitest";

import { appEnvironmentFrom, appUrlOverrideFrom, createAppDiscovery } from "../src/discovery";
import type { KeyValueStorage } from "../src/storage";

const storage: KeyValueStorage = { get: async () => null, set: async () => {}, remove: async () => {} };
const baked = { apiBase: "https://www.yomizaka.com", webBase: "https://www.yomizaka.com" };
const offline = (() => Promise.reject(new TypeError("offline"))) as unknown as typeof fetch;

const base = { product: "yomizaka", hostSuffix: "yomizaka.com", appVersion: "1.0.0", baked, storage, discovery: { fetch: offline } };

describe("appUrlOverrideFrom", () => {
  it.each([
    [undefined, undefined],
    ["  ", undefined],
    ["http://192.168.1.4:3000/", "http://192.168.1.4:3000"],
    ["https://tunnel.example.com", "https://tunnel.example.com"],
  ])("reads %j as %j", (raw, expected) => expect(appUrlOverrideFrom(raw)).toBe(expected));

  it.each(["not a url", "ftp://host.example.com"])("refuses %j at start", (raw) => {
    expect(() => appUrlOverrideFrom(raw)).toThrow("absolute http(s) URL");
  });
});

describe("appEnvironmentFrom", () => {
  it.each([
    [undefined, "dev"],
    ["", "dev"],
    ["prod", "prod"],
    [" dev ", "dev"],
  ])("reads %j as %j", (raw, expected) => expect(appEnvironmentFrom(raw)).toBe(expected));

  it("refuses an unknown environment", () => {
    expect(() => appEnvironmentFrom("staging")).toThrow("dev or prod");
  });
});

describe("createAppDiscovery", () => {
  it("answers the baked address when nothing was fetched", () => {
    const discovery = createAppDiscovery({ ...base, env: {} });
    expect(discovery.getService("yomizaka").apiBase).toBe(baked.apiBase);
  });

  it("lets the build input win over everything", () => {
    const discovery = createAppDiscovery({ ...base, env: { url: "http://192.168.1.4:3000/" } });
    expect(discovery.getService("yomizaka").apiBase).toBe("http://192.168.1.4:3000");
  });

  it("falls back to the baked address as the legacy one when none is given", () => {
    const legacy = { apiBase: "https://old.yomizaka.com", webBase: "https://old.yomizaka.com" };
    expect(createAppDiscovery({ ...base, legacy, env: {} }).getService("yomizaka")).toBeDefined();
  });

  it("fails at start on a malformed build input", () => {
    expect(() => createAppDiscovery({ ...base, env: { environment: "nope" } })).toThrow();
  });
});
