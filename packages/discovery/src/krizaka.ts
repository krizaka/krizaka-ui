/**
 * The Krizaka family's own constants, so an app does not copy them: where the manifest lives, the public keys that
 * verify it (`k1` signs today; `k2` is the standby kept offline, used the day `k1` must be dropped), and the one
 * domain every app trusts. An app adds its product's own domain to the suffixes.
 */
export const KRIZAKA_MANIFEST_URLS = [
  "https://www.krizaka.com/.well-known/krizaka/services.json",
  // The fallback copy on Bunny, published by the same signing step: reachable when the www app is down.
  "https://krizaka-assets.b-cdn.net/discovery/services.json",
] as const;

/** Key id → base64 of the 32-byte Ed25519 public key. */
export const KRIZAKA_PUBLIC_KEYS: Readonly<Record<string, string>> = {
  k1: "WL9GWmDdcGOPo94X3wuwHQLEl8CGLol9BjB7vJ3cljs=",
  k2: "IK9fNYmx6Y4bm/NJ2X/WfIgjWP5PpszDxMJtonF2RQI=",
};

/** The domain every Krizaka app trusts (the products' own domains are added by each app). */
export const KRIZAKA_HOST_SUFFIXES = ["krizaka.com"] as const;
