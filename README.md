<div align="center">

<img src="https://raw.githubusercontent.com/krizaka/.github/main/profile/assets/krizaka.svg" alt="Krizaka" width="72">

# krizaka-ui

**The Krizaka front-end platform.** The shared packages every Krizaka product builds on, published on npm under
`@krizaka/*`.

[![CI](https://github.com/krizaka/krizaka-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/krizaka/krizaka-ui/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue)](LICENSE)

</div>

## Packages

| Package | Version | What it is |
| :-- | :-- | :-- |
| [`@krizaka/ui`](packages/ui) | [![npm](https://img.shields.io/npm/v/@krizaka/ui?color=3b82f6&label=npm)](https://www.npmjs.com/package/@krizaka/ui) | The Krizaka marks and motion signature, for React and React Native. |

## Develop

```bash
pnpm install
pnpm turbo run check   # lint, type-check, tests, build, size budgets, publint
pnpm changeset         # describe a change that ships
```

pnpm + Turborepo, released with Changesets. The rules are in [AGENTS.md](AGENTS.md).

## License

[Apache-2.0](LICENSE)
