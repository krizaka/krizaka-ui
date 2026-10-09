# @krizaka/ui

## 1.2.0

### Patch Changes

- [#2](https://github.com/krizaka/krizaka-ui/pull/2) [`a46f9d4`](https://github.com/krizaka/krizaka-ui/commit/a46f9d423f1c151f37a10237f8cd5a27a25466ba) Thanks [@oussamaABID](https://github.com/oussamaABID)! - build: monorepo — the package moves to `packages/ui` of the krizaka-ui monorepo (pnpm, Turborepo, Changesets).
  Same exports, same `dist`; `repository.directory` now points at `packages/ui` and releases are published by
  Changesets with provenance.

- [#5](https://github.com/krizaka/krizaka-ui/pull/5) [`dae54c9`](https://github.com/krizaka/krizaka-ui/commit/dae54c96626ad15cf3c55ec9129c3011358a230d) Thanks [@oussamaABID](https://github.com/oussamaABID)! - motion.css reads the accent: the `kz-spotlight` glow and the `kz-lift` shadow mix `--kz-accent` (`color-mix` in oklab)
  instead of a hard-coded violet, with the former violet as fallback for hosts without tokens.
