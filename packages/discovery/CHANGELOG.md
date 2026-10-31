# @krizaka/discovery

## 0.1.2

### Patch Changes

- [#781](https://github.com/krizaka/krizaka-ui/pull/781) [`209618f`](https://github.com/krizaka/krizaka-ui/commit/209618fc4e32e620ae426b0598f1f7889ba7a1d9) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - Fix 37 SonarCloud bugs in the published packages (comparators, regular expressions, number parsing). No API change. @krizaka/tokens and @krizaka/tailwind follow @krizaka/ui (fixed group).

## 0.1.1

### Patch Changes

- [#714](https://github.com/krizaka/krizaka-ui/pull/714) [`972f53c`](https://github.com/krizaka/krizaka-ui/commit/972f53c41f865139041c5df510e1c18a6bc72967) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - Paused products (2026-10-25): the former products leave the family. The family switcher and the
  footer (`sites`) list only Krizaka, Orazaka, Yomizaka and Akinaza; `siteById` still finds a paused site (`pausedSites`), so
  a page that names one as `current` keeps rendering. Nothing published is removed: their marks (retired exports, the native `*Mark`s, their `ProductLogo` / `ProductMark` ids — the new
  `PausedBrandId`, `PausedSiteId`), their brand themes (a retired export
  and the `.brand-*` scopes, now headed DEPRECATED), the charts' a retired export palette and the email themes stay, marked
  `@deprecated`, and are removed in the next major. The examples, metas and docs speak of the products in focus only.

## 0.1.0

### Minor Changes

- [#451](https://github.com/krizaka/krizaka-ui/pull/451) [`aa3ca9b`](https://github.com/krizaka/krizaka-ui/commit/aa3ca9b566b8303780c94b8c35344450c87d39bf) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - New package `@krizaka/discovery` (0.1.0): service discovery for the mobile apps. The apps stop hard-coding their backend addresses and read a signed manifest (`https://www.krizaka.com/.well-known/krizaka/services.json`): Ed25519 over canonical JSON, a baked host allow-list, a secure cache, the fallback order cached → baked default → legacy host, a retired export, a background refresh, and the `minAppVersion` / maintenance gates. React bindings in `/react`, the signer for build tooling in `/sign`. Decision: krizaka/.github ADR-003.
  
  `@krizaka/app-config`: `baseUrl` may be a function, read at each check, so a backend address moved by the discovery manifest is followed without recreating the client.
