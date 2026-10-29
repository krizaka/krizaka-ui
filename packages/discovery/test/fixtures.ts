import { generateKeyPairSync } from "node:crypto";

import { bytesToBase64, type DiscoveryStorage, type Manifest, type ManifestBody, type ServiceEntry } from "../src/index";
import { signManifest } from "../src/sign";

export function keypair() {
  const { privateKey, publicKey } = generateKeyPairSync("ed25519");
  return {
    seed: privateKey.export({ format: "der", type: "pkcs8" }).subarray(-32).toString("base64"),
    publicKey: publicKey.export({ format: "der", type: "spki" }).subarray(-32).toString("base64"),
  };
}

export const K1 = keypair();
export const K2 = keypair();
export const PUBLIC_KEYS = { k1: K1.publicKey, k2: K2.publicKey };
export const SUFFIXES = ["krizaka.com", "yomizaka.com", "orazaka.com"];

export const entry = (over: Partial<ServiceEntry> = {}): ServiceEntry => ({
  apiBase: "https://dev.yomizaka.com",
  webBase: "https://dev.yomizaka.com",
  minAppVersion: "1.0.0",
  latestAppVersion: "1.2.0",
  status: "ok",
  ...over,
});

export function body(over: Partial<ManifestBody> = {}, yomizaka: Partial<ServiceEntry> = {}): ManifestBody {
  return {
    schemaVersion: 1,
    keyId: "k1",
    issuedAt: "2026-10-21T12:00:00Z",
    services: { yomizaka: { dev: entry(yomizaka) }, orazaka: { dev: entry({ apiBase: "https://dev.orazaka.com/edge", webBase: "https://dev.orazaka.com" }) } },
    ...over,
  };
}

export const signed = (b: ManifestBody = body(), seed = K1.seed): Manifest => signManifest(b, seed);
export const json = (m: Manifest) => JSON.stringify(m);
export { bytesToBase64 };

export function memory(): DiscoveryStorage & { data: Map<string, string> } {
  const data = new Map<string, string>();
  return {
    data,
    getItem: async (k) => data.get(k) ?? null,
    setItem: async (k, v) => void data.set(k, v),
    removeItem: async (k) => void data.delete(k),
  };
}

