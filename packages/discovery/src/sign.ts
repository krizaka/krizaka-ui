import { ed25519 } from "@noble/curves/ed25519.js";

import { canonicalize } from "./canonical";
import { base64ToBytes, bytesToBase64, utf8 } from "./encoding";
import type { Manifest, ManifestBody } from "./manifest";

/** The base64 public key of a base64 32-byte secret seed (the form the company vault keeps). */
export function publicKeyOf(seedBase64: string): string {
  return bytesToBase64(ed25519.getPublicKey(base64ToBytes(seedBase64)));
}

/** Signs a manifest body with a base64 32-byte seed. Build tooling only: a phone never holds a secret. */
export function signManifest(body: ManifestBody, seedBase64: string): Manifest {
  const signature = bytesToBase64(ed25519.sign(utf8(canonicalize(body)), base64ToBytes(seedBase64)));
  return { ...body, signature };
}

export { canonicalize };
export type { Manifest, ManifestBody };
