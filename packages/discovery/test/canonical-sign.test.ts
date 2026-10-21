import { createPublicKey,generateKeyPairSync, sign as nodeSign, verify as nodeVerify } from "node:crypto";

import { describe, expect, it } from "vitest";

import { canonicalize } from "../src/index";
import { signManifest } from "../src/sign";
import { body, K1 } from "./fixtures";

describe("signing", () => {
  it("produces a signature Node's own Ed25519 verifies over the canonical bytes (interoperable, not self-referential)", () => {
    const m = signManifest(body(), K1.seed);
    const { signature, ...rest } = m;
    const raw = Buffer.concat([Buffer.from("302a300506032b6570032100", "hex"), Buffer.from(K1.publicKey, "base64")]);
    const key = createPublicKey({ key: raw, format: "der", type: "spki" });
    expect(nodeVerify(null, Buffer.from(canonicalize(rest)), key, Buffer.from(signature, "base64"))).toBe(true);
  });
  it("is deterministic (Ed25519), so a re-sign of the same data changes nothing", () => {
    expect(signManifest(body(), K1.seed).signature).toBe(signManifest(body(), K1.seed).signature);
  });
  it("accepts a signature made by Node's signer", async () => {
    const { privateKey, publicKey } = generateKeyPairSync("ed25519");
    const { verifyManifest } = await import("../src/index");
    const b = body();
    const sig = nodeSign(null, Buffer.from(canonicalize(b)), privateKey).toString("base64");
    const pub = publicKey.export({ format: "der", type: "spki" }).subarray(-32).toString("base64");
    expect(verifyManifest(JSON.stringify({ ...b, signature: sig }), { k1: pub }).ok).toBe(true);
  });
});
