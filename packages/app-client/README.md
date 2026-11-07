# @krizaka/app-client

What every Krizaka **Expo app** shares, written once: the bearer session, the discovery client and the API client.
Decision: ADR-004.

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
const session = createSessionStore({ storage, key: "verikora.session" });

export const discovery = createAppDiscovery({
  product: "verikora",
  hostSuffix: "verikora.com",
  appVersion: Constants.expoConfig?.version ?? "0.0.0",
  baked: { apiBase: "https://www.verikora.com", webBase: "https://www.verikora.com" },
  storage,
  env: { url: process.env.EXPO_PUBLIC_APP_URL, environment: process.env.EXPO_PUBLIC_APP_ENV },
});

const appConfig = createAppConfigClient({ /* baseUrl: () => discovery.getService("verikora").apiBase, … */ });

export const api = createApiClient({
  baseUrl: () => discovery.getService("verikora").apiBase,
  session,
  fetch: appConfig.fetch,
  language: () => "fr-CA",
  productName: "Verikora",
  timeoutMs: 20_000,
});
```

| Export | What it does |
| :-- | :-- |
| `createSessionStore` | The bearer token in secure storage; `onChange` fires when a session starts or ends |
| `secureStorage`, `browserStorage`, `discoveryStorage` | The storage port: Keychain / Keystore, the web preview, the manifest in pieces |
| `createAppDiscovery` | Krizaka's manifest, keys and host allow-list plus the product's address; `EXPO_PUBLIC_APP_URL` wins for local work |
| `createApiClient`, `ApiError` | JSON with the bearer, no cookie, a timeout, a 401 drops the session |
| `@krizaka/app-client/server`: `sessionTokenOf`, `signInClientOf` | The backend's side: the token of a request (the app's `Authorization: Bearer` before the web's cookie) and the client a sign-in body declares (`native` gets the token in the response body) — pure, headers in, for a Next.js route |
| `@krizaka/app-client/react`: `createAuth`, `useSessionStatus`, `AUTH` | The auth context of an app's screens: `loading`, then `signedIn` / `signedOut`, followed when a session starts or ends (a 401 included); `signIn` / `signOut` are the product's API calls |

```tsx
import { createAuth } from "@krizaka/app-client/react";

export const { AuthProvider, useAuth } = createAuth(session, { signIn: verikora.signIn, signOut: verikora.signOut });
// in a screen: const { status, signIn, signOut } = useAuth();
```
