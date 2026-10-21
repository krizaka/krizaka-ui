import { describe, expect, it } from "vitest";

import { base64ToBytes,isAllowedUrl, KRIZAKA_HOST_SUFFIXES, KRIZAKA_MANIFEST_URLS, KRIZAKA_PUBLIC_KEYS } from "../src/index";

describe("the family's constants", () => {
  it("has two 32-byte public keys: the signing key and the standby", () => {
    expect(Object.keys(KRIZAKA_PUBLIC_KEYS)).toEqual(["k1", "k2"]);
    for (const key of Object.values(KRIZAKA_PUBLIC_KEYS)) expect(base64ToBytes(key)).toHaveLength(32);
    expect(KRIZAKA_PUBLIC_KEYS.k1).not.toBe(KRIZAKA_PUBLIC_KEYS.k2);
  });
  it("serves the manifest from krizaka.com first, then from the Bunny copy", () => {
    expect(KRIZAKA_MANIFEST_URLS[0]).toBe("https://www.krizaka.com/.well-known/krizaka/services.json");
    expect(KRIZAKA_MANIFEST_URLS.every((url) => url.startsWith("https://"))).toBe(true);
    expect(isAllowedUrl(KRIZAKA_MANIFEST_URLS[0], KRIZAKA_HOST_SUFFIXES)).toBe(true);
  });
});
