/* eslint-disable @typescript-eslint/no-explicit-any -- the test mutates a parsed JSON document of arbitrary shape */
import { describe, expect, it } from "vitest";

import { parseManifest, verifyManifest } from "../src/index";
import { publicKeyOf, signManifest } from "../src/sign";
import { body, entry, json, K1, K2, PUBLIC_KEYS, signed } from "./fixtures";

describe("verifyManifest", () => {
  it("accepts a document signed by a baked key, either one", () => {
    expect(verifyManifest(json(signed()), PUBLIC_KEYS).ok).toBe(true);
    const second = signed(body({ keyId: "k2" }), K2.seed);
    expect(verifyManifest(json(second), PUBLIC_KEYS)).toMatchObject({ ok: true });
  });

  it("derives the public key of a seed", () => {
    expect(publicKeyOf(K1.seed)).toBe(K1.publicKey);
  });

  it("rejects a document whose content was changed after signing (a hijacked address)", () => {
    const m = signed();
    m.services.orochia!.dev!.apiBase = "https://evil.example.com";
    expect(verifyManifest(json(m), PUBLIC_KEYS)).toEqual({ ok: false, reason: "bad-signature" });
  });

  it("rejects a document signed by a key that is not the one it names", () => {
    const forged = signManifest(body(), K2.seed); // says k1, signed with k2's secret
    expect(verifyManifest(json(forged), PUBLIC_KEYS)).toEqual({ ok: false, reason: "bad-signature" });
  });

  it("rejects an attacker's own key and an unknown key id", () => {
    const attacker = signManifest(body({ keyId: "k9" }), K1.seed);
    expect(verifyManifest(json(attacker), PUBLIC_KEYS)).toEqual({ ok: false, reason: "unknown-key" });
    expect(verifyManifest(json(signed()), { k1: K2.publicKey })).toEqual({ ok: false, reason: "bad-signature" });
  });

  it("is not fooled by a key id that is an Object.prototype property", () => {
    const m = signManifest(body({ keyId: "constructor" }), K1.seed);
    expect(verifyManifest(json(m), PUBLIC_KEYS)).toEqual({ ok: false, reason: "unknown-key" });
  });

  it("rejects a malformed signature or key without throwing", () => {
    expect(verifyManifest(json({ ...signed(), signature: "***" }), PUBLIC_KEYS)).toEqual({ ok: false, reason: "bad-signature" });
    expect(verifyManifest(json(signed()), { k1: "not-base64!" })).toEqual({ ok: false, reason: "bad-signature" });
  });

  it("rejects what is not a manifest: bad JSON, a wrong shape, a future schema", () => {
    expect(verifyManifest("{nope", PUBLIC_KEYS)).toEqual({ ok: false, reason: "malformed" });
    expect(verifyManifest("[]", PUBLIC_KEYS)).toEqual({ ok: false, reason: "malformed" });
    expect(verifyManifest(json({ ...signed(), schemaVersion: 2 as 1 }), PUBLIC_KEYS)).toEqual({ ok: false, reason: "malformed" });
  });
});

describe("parseManifest", () => {
  const good = () => JSON.parse(json(signed()));
  const bad = (mutate: (m: Record<string, any>) => void) => {
    const m = good();
    mutate(m);
    return parseManifest(m);
  };
  it("accepts a well-formed document, with the optional parts", () => {
    expect(parseManifest(good())).not.toBeNull();
    expect(
      bad((m) => {
        m.services.orochia.dev = { ...entry(), authBase: "https://a.orochia.com", mediaBase: "https://m.orochia.com", message: { en: "x", fr: "y" } };
      }),
    ).not.toBeNull();
  });
  it("refuses every malformed field", () => {
    expect(parseManifest(null)).toBeNull();
    expect(bad((m) => (m.keyId = ""))).toBeNull();
    expect(bad((m) => (m.signature = 3))).toBeNull();
    expect(bad((m) => (m.issuedAt = "yesterday"))).toBeNull();
    expect(bad((m) => (m.issuedAt = 5))).toBeNull();
    expect(bad((m) => (m.services = []))).toBeNull();
    expect(bad((m) => (m.services.orochia = []))).toBeNull();
    expect(bad((m) => (m.services.orochia.staging = entry()))).toBeNull();
    expect(bad((m) => (m.services.orochia.dev = "x"))).toBeNull();
    expect(bad((m) => delete m.services.orochia.dev.apiBase)).toBeNull();
    expect(bad((m) => delete m.services.orochia.dev.webBase)).toBeNull();
    expect(bad((m) => (m.services.orochia.dev.authBase = ""))).toBeNull();
    expect(bad((m) => (m.services.orochia.dev.mediaBase = 4))).toBeNull();
    expect(bad((m) => (m.services.orochia.dev.minAppVersion = "1"))).toBeNull();
    expect(bad((m) => (m.services.orochia.dev.minAppVersion = 1))).toBeNull();
    expect(bad((m) => (m.services.orochia.dev.latestAppVersion = "x"))).toBeNull();
    expect(bad((m) => (m.services.orochia.dev.status = "down"))).toBeNull();
    expect(bad((m) => (m.services.orochia.dev.message = "soon"))).toBeNull();
    expect(bad((m) => (m.services.orochia.dev.message = { en: "x" }))).toBeNull();
    expect(bad((m) => (m.services.orochia.dev.message = { en: "x", fr: "y".repeat(281) }))).toBeNull();
  });
});
