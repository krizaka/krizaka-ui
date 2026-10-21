import { ed25519 } from "@noble/curves/ed25519.js";

import { canonicalize } from "./canonical";
import { base64ToBytes, utf8 } from "./encoding";
import { type Manifest, parseManifest } from "./manifest";

/** The public keys baked in an app: key id → base64 of the 32 raw bytes. */
export type PublicKeys = Record<string, string>;

export type VerifyResult = { ok: true; manifest: Manifest } | { ok: false; reason: "malformed" | "unknown-key" | "bad-signature" };

/**
 * Parses JSON text and checks it: the schema, then the Ed25519 signature of the canonical body under the key the
 * document names (and the app baked). Never throws: a document that fails is a reason, and the caller keeps what it had.
 */
export function verifyManifest(raw: string, keys: PublicKeys): VerifyResult {
  let manifest: Manifest | null;
  try {
    manifest = parseManifest(JSON.parse(raw));
  } catch {
    return { ok: false, reason: "malformed" };
  }
  if (!manifest) return { ok: false, reason: "malformed" };
  const key = Object.hasOwn(keys, manifest.keyId) ? keys[manifest.keyId] : undefined;
  if (!key) return { ok: false, reason: "unknown-key" };
  try {
    const { signature, ...body } = manifest;
    const valid = ed25519.verify(base64ToBytes(signature), utf8(canonicalize(body)), base64ToBytes(key), { zip215: false });
    return valid ? { ok: true, manifest } : { ok: false, reason: "bad-signature" };
  } catch {
    return { ok: false, reason: "bad-signature" };
  }
}
