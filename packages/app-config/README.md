# @krizaka/app-config

App version compatibility between Krizaka apps (React Native, the Mac app, the web) and their backends. One contract,
two implementations: this package (Next.js backends and clients) and the Java building block
[`krizaka-app-config`](https://github.com/krizaka/krizaka-platform-kit/tree/main/krizaka-app-config), both passing the
same fixture (`test/cases.json`) and sharing one JSON schema (`contract/app-config.schema.json`). Zero dependency.

| Entry | For |
|:---|:---|
| `@krizaka/app-config` | the contract, pure: versions, the payload, `evaluateGuard`, `validateRecord`, `schemaSql` |
| `@krizaka/app-config/server` | Next.js backends: `createAppConfigHandler`, `checkClientVersion`, `withClientVersionGuard`, `cachedStore`, `memoryStore` |
| `@krizaka/app-config/client` | apps: `createAppConfigClient` (launch + resume checks, soft dismissal, the global 426 interceptor `client.fetch`), `decide` |
| `@krizaka/app-config/react` | `useAppConfig`, `appStateResume(AppState)`, `visibilityResume(document)` |

The screens are in `@krizaka/ui`: `UpdatePrompt`, `ForceUpdateScreen`, `MaintenanceScreen` (web and `/native`).
Documentation: <https://ui.krizaka.com/packages/app-config>.
