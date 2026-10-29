import { describe, expect, it } from "vitest";

import { base64ToBytes, bytesToBase64, canonicalize, compareVersions, isAllowedUrl, normalizeBase, pickMessage } from "../src/index";

describe("canonicalize", () => {
  it("sorts keys, drops whitespace and keeps arrays in order", () => {
    expect(canonicalize({ b: 1, a: [3, 1, { z: true, y: null }], c: "é" })).toBe('{"a":[3,1,{"y":null,"z":true}],"b":1,"c":"é"}');
  });
  it("is independent of the key order of the input", () => {
    expect(canonicalize({ a: 1, b: { d: 1, c: 2 } })).toBe(canonicalize({ b: { c: 2, d: 1 }, a: 1 }));
  });
  it("refuses what has no canonical form: floats, NaN, undefined, functions", () => {
    expect(() => canonicalize({ a: 1.5 })).toThrow(/integer/);
    expect(() => canonicalize(Number.NaN)).toThrow(/integer/);
    expect(() => canonicalize({ a: undefined })).toThrow(/undefined/);
    expect(() => canonicalize(() => 1)).toThrow(/cannot be canonicalised/);
  });
});

describe("base64", () => {
  it("round-trips every length (padding 0, 1, 2)", () => {
    for (const n of [0, 1, 2, 3, 4, 5, 31, 32, 64]) {
      const bytes = Uint8Array.from({ length: n }, (_, i) => (i * 37 + 11) % 256);
      expect(base64ToBytes(bytesToBase64(bytes))).toEqual(bytes);
    }
  });
  it("matches Node's encoder", () => {
    const bytes = Uint8Array.from([0, 250, 3, 77, 255, 1, 2]);
    expect(bytesToBase64(bytes)).toBe(Buffer.from(bytes).toString("base64"));
  });
  it("refuses characters outside the alphabet and a bad length", () => {
    expect(() => base64ToBytes("ab$d")).toThrow(/base64/);
    expect(() => base64ToBytes("abcde")).toThrow(/base64/);
  });
});

describe("compareVersions", () => {
  it("compares numerically, not as text", () => {
    expect(compareVersions("1.10.0", "1.9.9")).toBe(1);
    expect(compareVersions("1.0.0", "1.0.0")).toBe(0);
    expect(compareVersions("0.9.0", "1.0.0")).toBe(-1);
    expect(compareVersions("2.0.1", "2.0.0")).toBe(1);
    expect(compareVersions("1.2.3", "1.3.0")).toBe(-1);
  });
  it("ranks a pre-release below its release and compares identifiers", () => {
    expect(compareVersions("1.0.0-beta.1", "1.0.0")).toBe(-1);
    expect(compareVersions("1.0.0", "1.0.0-rc.1")).toBe(1);
    expect(compareVersions("1.0.0-beta.2", "1.0.0-beta.10")).toBe(-1);
    expect(compareVersions("1.0.0-beta.1", "1.0.0-beta.1")).toBe(0);
    expect(compareVersions("1.0.0-alpha", "1.0.0-1")).toBe(1);
    expect(compareVersions("1.0.0-1", "1.0.0-alpha")).toBe(-1);
    expect(compareVersions("1.0.0-alpha", "1.0.0-beta")).toBe(-1);
    expect(compareVersions("1.0.0-beta", "1.0.0-alpha")).toBe(1);
    expect(compareVersions("1.0.0-beta", "1.0.0-beta.1")).toBe(-1);
    expect(compareVersions("1.0.0-beta.1", "1.0.0-beta")).toBe(1);
  });
  it("returns null for a version it cannot read", () => {
    expect(compareVersions("1.0", "1.0.0")).toBeNull();
    expect(compareVersions("1.0.0", "latest")).toBeNull();
  });
});

describe("host allow-list", () => {
  const suffixes = ["krizaka.com", "yomizaka.com"];
  it("accepts https on the domain, its subdomains and nothing else", () => {
    expect(isAllowedUrl("https://www.krizaka.com", suffixes)).toBe(true);
    expect(isAllowedUrl("https://krizaka.com/x", suffixes)).toBe(true);
    expect(isAllowedUrl("https://api.dev.yomizaka.com/edge", suffixes)).toBe(true);
    expect(isAllowedUrl("https://HOST.Yomizaka.COM", suffixes)).toBe(true);
  });
  it("refuses look-alikes: a longer name, a prefix, a different TLD", () => {
    expect(isAllowedUrl("https://evilkrizaka.com", suffixes)).toBe(false);
    expect(isAllowedUrl("https://krizaka.com.evil.io", suffixes)).toBe(false);
    expect(isAllowedUrl("https://krizaka.co", suffixes)).toBe(false);
    expect(isAllowedUrl("https://yomizaka.com.attacker.net/", suffixes)).toBe(false);
  });
  it("refuses http, credentials, an explicit port, a non-URL, an IP, a multi-tenant host", () => {
    expect(isAllowedUrl("http://www.krizaka.com", suffixes)).toBe(false);
    expect(isAllowedUrl("https://user@www.krizaka.com", suffixes)).toBe(false);
    expect(isAllowedUrl("https://user:pw@www.krizaka.com", suffixes)).toBe(false);
    expect(isAllowedUrl("https://www.krizaka.com:8443", suffixes)).toBe(false);
    expect(isAllowedUrl("not a url", suffixes)).toBe(false);
    expect(isAllowedUrl("https://10.0.0.1", suffixes)).toBe(false);
    expect(isAllowedUrl("https://krizaka-assets.b-cdn.net", suffixes)).toBe(false);
    expect(isAllowedUrl("https://x.com/?u=https://www.krizaka.com", suffixes)).toBe(false);
  });
  it("accepts an explicit default port, and refuses a query or a fragment in a base", () => {
    expect(isAllowedUrl("https://www.krizaka.com:443", suffixes)).toBe(true);
    expect(isAllowedUrl("https://www.krizaka.com/edge?x=1", suffixes)).toBe(false);
    expect(isAllowedUrl("https://www.krizaka.com/edge#x", suffixes)).toBe(false);
  });
  it("refuses a trailing-dot host and a suffix written with a dot or an uppercase letter that never matches", () => {
    expect(isAllowedUrl("https://www.krizaka.com./", suffixes)).toBe(false);
    expect(isAllowedUrl("https://www.krizaka.com", [])).toBe(false);
  });
  it("normalizes a base: no trailing slash, path kept", () => {
    expect(normalizeBase("https://dev.orazaka.com/edge/")).toBe("https://dev.orazaka.com/edge");
    expect(normalizeBase("https://www.krizaka.com/")).toBe("https://www.krizaka.com");
    expect(normalizeBase("https://www.krizaka.com")).toBe("https://www.krizaka.com");
    expect(normalizeBase("https://www.krizaka.com/edge///")).toBe("https://www.krizaka.com/edge");
    expect(normalizeBase("/".repeat(50_000))).toBe("");
  });
});

describe("pickMessage", () => {
  const message = { en: "Back soon", fr: "De retour bientôt" };
  it("picks the language, falls back to English, and to nothing", () => {
    expect(pickMessage(message, "fr")).toBe("De retour bientôt");
    expect(pickMessage(message, "fr-CA")).toBe("De retour bientôt");
    expect(pickMessage(message, "de")).toBe("Back soon");
    expect(pickMessage(message, undefined)).toBe("Back soon");
    expect(pickMessage(undefined, "fr")).toBeUndefined();
  });
});
