# @krizaka/app-config

## 0.2.0

### Minor Changes

- [#451](https://github.com/krizaka/krizaka-ui/pull/451) [`aa3ca9b`](https://github.com/krizaka/krizaka-ui/commit/aa3ca9b566b8303780c94b8c35344450c87d39bf) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - New package `@krizaka/discovery` (0.1.0): service discovery for the mobile apps. The apps stop hard-coding their backend addresses and read a signed manifest (`https://www.krizaka.com/.well-known/krizaka/services.json`): Ed25519 over canonical JSON, a baked host allow-list, a secure cache, the fallback order cached → baked default → legacy host, a retired export, a background refresh, and the `minAppVersion` / maintenance gates. React bindings in `/react`, the signer for build tooling in `/sign`. Decision: krizaka/.github ADR-003.
  
  `@krizaka/app-config`: `baseUrl` may be a function, read at each check, so a backend address moved by the discovery manifest is followed without recreating the client.

## 0.1.0

### Minor Changes

- [#297](https://github.com/krizaka/krizaka-ui/pull/297) [`74961d3`](https://github.com/krizaka/krizaka-ui/commit/74961d3a1d8c5745bc0a97b4a757315a070158a6) Thanks [@oussamaABID](https://github.com/oussamaABID)! - New package: the app-version contract shared by every Krizaka backend and client — `GET /api/v1/app-config`, `426 Upgrade Required` below the minimum, N-1 contracts with `Deprecation`/`Sunset`, soft/force/maintenance decisions, the Next.js server helpers, a framework-free client with a global 426 interceptor and `useAppConfig`. Twin of the Java building block `krizaka-app-config`; both pass the same fixture.
