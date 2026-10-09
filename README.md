<div align="center">

<img src="https://raw.githubusercontent.com/krizaka/.github/main/profile/assets/krizaka.svg" alt="Krizaka" width="72">

# krizaka-ui

**The Krizaka front-end platform.** The shared packages every Krizaka product builds on, published on npm under
`@krizaka/*`.

[![CI](https://github.com/krizaka/krizaka-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/krizaka/krizaka-ui/actions/workflows/ci.yml)
[![Storybook](https://img.shields.io/badge/storybook-latest-ff4785)](https://krizaka.github.io/krizaka-ui/latest/)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue)](LICENSE)

</div>

## Packages

| Package | Version | What it is |
| :-- | :-- | :-- |
| [`@krizaka/tokens`](packages/tokens) | [![npm](https://img.shields.io/npm/v/@krizaka/tokens?color=3b82f6&label=npm)](https://www.npmjs.com/package/@krizaka/tokens) | The semantic `--kz-*` tokens: CSS (dark, light, media invariants), typed constants, React Native themes. |
| [`@krizaka/tailwind`](packages/tailwind) | [![npm](https://img.shields.io/npm/v/@krizaka/tailwind?color=3b82f6&label=npm)](https://www.npmjs.com/package/@krizaka/tailwind) | The Tailwind CSS v4 preset: the tokens as utilities, illustration-only `light:`/`dark:`, the Krizaka easing. |
| [`@krizaka/ui`](packages/ui) | [![npm](https://img.shields.io/npm/v/@krizaka/ui?color=3b82f6&label=npm)](https://www.npmjs.com/package/@krizaka/ui) | The Krizaka marks and motion signature, for React and React Native. |
| [`@krizaka/intl`](packages/intl) | [![npm](https://img.shields.io/npm/v/@krizaka/intl/beta?color=3b82f6&label=npm)](https://www.npmjs.com/package/@krizaka/intl) | Money (from integer minor units), numbers, dates, relative times and plurals on `Intl`: zero dependency. |
| [`@krizaka/config`](packages/config) | [![npm](https://img.shields.io/npm/v/@krizaka/config?color=3b82f6&label=npm)](https://www.npmjs.com/package/@krizaka/config) | ESLint (base, Next.js, the four UI rules), tsconfig bases, Prettier, and `krizaka-ratchet`, the UI debt counter. |

## Catalogue

[**krizaka.github.io/krizaka-ui/latest**](https://krizaka.github.io/krizaka-ui/latest/) — every primitive in dark and
light, under each product identity, audited by axe. Built from [`apps/storybook`](apps/storybook) on every push to
`main`.

## Develop

```bash
pnpm install
pnpm turbo run check   # lint, type-check, tests, build, size budgets, publint
pnpm --filter storybook dev   # the catalogue on http://localhost:6006
pnpm changeset         # describe a change that ships
```

pnpm + Turborepo, released with Changesets. The rules are in [AGENTS.md](AGENTS.md).

## License

[Apache-2.0](LICENSE)
