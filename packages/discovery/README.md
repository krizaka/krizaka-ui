# @krizaka/discovery

Service discovery for the Krizaka **mobile apps**: they load their backend addresses from a **signed manifest** instead
of hard-coding them, so moving a product (`dev.orochia.com` → `www.orochia.com`, a new edge) never forces a store
republish. Decision and threat model: [ADR-003](https://github.com/krizaka/.github/blob/main/docs/adr/ADR-003-mobile-service-discovery.md).

```bash
npm install @krizaka/discovery
```

ESM only, Node ≥ 22 / React Native (Hermes). One dependency: [`@noble/curves`](https://github.com/paulmillr/noble-curves).

## The manifest

`https://www.krizaka.com/.well-known/krizaka/services.json` — public, `max-age=300`, CORS `GET`:

```json
{
  "schemaVersion": 1,
  "keyId": "k1",
  "issuedAt": "2026-10-21T14:00:00Z",
  "services": {
    "orochia": {
      "dev": {
        "apiBase": "https://dev.orochia.com",
        "webBase": "https://dev.orochia.com",
        "minAppVersion": "1.0.0",
        "latestAppVersion": "1.0.0",
        "status": "ok"
      }
    }
  },
  "signature": "…base64 Ed25519 over the canonical JSON of the rest…"
}
```

## In an app

```ts
import { chunkedStorage, createDiscovery } from "@krizaka/discovery";

export const discovery = createDiscovery({
  environment: "dev",                                   // the build's channel
  appVersion: Constants.expoConfig?.version ?? "0.0.0",
  manifestUrls: [
    "https://www.krizaka.com/.well-known/krizaka/services.json",
    "https://krizaka-assets.b-cdn.net/discovery/services.json",   // the fallback copy
  ],
  publicKeys: { k1: "…", k2: "…" },                     // baked, base64
  allowedHostSuffixes: ["krizaka.com", "orochia.com"],  // baked
  defaults: { orochia: { apiBase: "https://dev.orochia.com", webBase: "https://dev.orochia.com" } },
  legacy: { orochia: { apiBase: "https://dev.orochia.com", webBase: "https://dev.orochia.com" } },
  storage: chunkedStorage(secureStoreAdapter),          // Keychain / Keystore, in pieces under the 2 KB limit
});

await discovery.start();                                // cache first, else a fetch bounded by 3 s
discovery.getService("orochia").apiBase;                // live → cache → default → legacy
discovery.getGate("orochia");                           // ok | update-required | maintenance
```

```tsx
import { DiscoveryGate, DiscoveryProvider, useService } from "@krizaka/discovery/react";

<DiscoveryProvider discovery={discovery} subscribeForeground={onForeground}>
  <DiscoveryGate product="orochia" update={(g) => <UpdateScreen {...g} />} maintenance={(g) => <MaintenanceScreen {...g} />}>
    <App />
  </DiscoveryGate>
</DiscoveryProvider>;
```

`subscribeForeground` and `refreshEveryMs` keep the manifest fresh; pass a stable function. `overrides` (a LAN address in
development) win over everything and bypass the network for that product.

## What it refuses

A bad or unknown-key signature, a malformed document, a document **older** than the one in force, an address that is not
`https`, carries credentials or a port, or is not under a baked suffix, a body over 64 KB. A refusal keeps the previous
state; nothing here ever throws at start-up.

## Signing (build tooling only)

```ts
import { signManifest } from "@krizaka/discovery/sign";
const signed = signManifest({ schemaVersion: 1, keyId: "k1", issuedAt, services }, seedBase64);
```

The private seed stays in the company vault; krizaka-com's `npm run services:sign` reads it and commits the signature.
