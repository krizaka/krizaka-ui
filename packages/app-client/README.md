# @krizaka/app-client

What every Krizaka **Expo app** shares, written once: the bearer session, the discovery client and the API client.
Decision: [ADR-004](https://github.com/krizaka/.github/blob/main/docs/adr/ADR-004-expo-app-shell.md).

```bash
npm install @krizaka/app-client
```

ESM only, Node ≥ 22 / React Native (Hermes). The package imports no native module: the app passes the adapters.

```ts
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";
import { createAppDiscovery, createSessionStore, createApiClient, secureStorage } from "@krizaka/app-client";
import { createAppConfigClient } from "@krizaka/app-config/client";

const storage = secureStorage(SecureStore);
const session = createSessionStore({ storage, key: "yomizaka.session" });

export const discovery = createAppDiscovery({
  product: "yomizaka",
  hostSuffix: "yomizaka.com",
  appVersion: Constants.expoConfig?.version ?? "0.0.0",
  baked: { apiBase: "https://www.yomizaka.com", webBase: "https://www.yomizaka.com" },
  storage,
  env: { url: process.env.EXPO_PUBLIC_APP_URL, environment: process.env.EXPO_PUBLIC_APP_ENV },
});

const appConfig = createAppConfigClient({ /* baseUrl: () => discovery.getService("yomizaka").apiBase, … */ });

export const api = createApiClient({
  baseUrl: () => discovery.getService("yomizaka").apiBase,
  session,
  fetch: appConfig.fetch,
  language: () => "fr-CA",
  productName: "Yomizaka",
  timeoutMs: 20_000,
});
```

| Export | What it does |
| :-- | :-- |
| `createSessionStore` | The bearer token in secure storage; `onChange` fires when a session starts or ends |
| `secureStorage`, `browserStorage`, `discoveryStorage` | The storage port: Keychain / Keystore, the web preview, the manifest in pieces |
| `createAppDiscovery` | Krizaka's manifest, keys and host allow-list plus the product's address; `EXPO_PUBLIC_APP_URL` wins for local work |
| `createApiClient`, `ApiError` | JSON with the bearer, no cookie, a timeout, a 401 drops the session |
