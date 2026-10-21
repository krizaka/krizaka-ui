# @krizaka/discovery

## 0.1.0

### Minor Changes

- [#451](https://github.com/krizaka/krizaka-ui/pull/451) [`aa3ca9b`](https://github.com/krizaka/krizaka-ui/commit/aa3ca9b566b8303780c94b8c35344450c87d39bf) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - New package `@krizaka/discovery` (0.1.0): service discovery for the mobile apps. The apps stop hard-coding their backend addresses and read a signed manifest (`https://www.krizaka.com/.well-known/krizaka/services.json`): Ed25519 over canonical JSON, a baked host allow-list, a secure cache, the fallback order cached → baked default → legacy host, `getService("orochia").apiBase`, a background refresh, and the `minAppVersion` / maintenance gates. React bindings in `/react`, the signer for build tooling in `/sign`. Decision: krizaka/.github ADR-003.
  
  `@krizaka/app-config`: `baseUrl` may be a function, read at each check, so a backend address moved by the discovery manifest is followed without recreating the client.
