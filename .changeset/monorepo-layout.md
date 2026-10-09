---
"@krizaka/ui": patch
---

build: monorepo — the package moves to `packages/ui` of the krizaka-ui monorepo (pnpm, Turborepo, Changesets).
Same exports, same `dist`; `repository.directory` now points at `packages/ui` and releases are published by
Changesets with provenance.
