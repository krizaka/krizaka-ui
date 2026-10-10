<div align="center">

<img src="https://raw.githubusercontent.com/krizaka/.github/main/profile/assets/krizaka.svg" alt="Krizaka" width="72">

# krizaka-ui

**The Krizaka front-end platform.** The shared packages every Krizaka product builds on, published on npm under
`@krizaka/*`.

[![CI](https://github.com/krizaka/krizaka-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/krizaka/krizaka-ui/actions/workflows/ci.yml)
[![Docs](https://img.shields.io/badge/docs-krizaka.com%2Fdocs%2Fui-ff6a00)](https://www.krizaka.com/docs/ui)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue)](LICENSE)

</div>

## Packages

| Package | Version | What it is |
| :-- | :-- | :-- |
| [`@krizaka/tokens`](packages/tokens) | [![npm](https://img.shields.io/npm/v/@krizaka/tokens?color=3b82f6&label=npm)](https://www.npmjs.com/package/@krizaka/tokens) | The semantic `--kz-*` tokens: CSS (dark, light, media invariants), typed constants, React Native themes. |
| [`@krizaka/tailwind`](packages/tailwind) | [![npm](https://img.shields.io/npm/v/@krizaka/tailwind?color=3b82f6&label=npm)](https://www.npmjs.com/package/@krizaka/tailwind) | The Tailwind CSS v4 preset: the tokens as utilities, illustration-only `light:`/`dark:`, the Krizaka easing. |
| [`@krizaka/ui`](packages/ui) | [![npm](https://img.shields.io/npm/v/@krizaka/ui?color=3b82f6&label=npm)](https://www.npmjs.com/package/@krizaka/ui) | The Krizaka marks and motion signature, for React and React Native. |
| [`@krizaka/intl`](packages/intl) | [![npm](https://img.shields.io/npm/v/@krizaka/intl/beta?color=3b82f6&label=npm)](https://www.npmjs.com/package/@krizaka/intl) | Money (from integer minor units), numbers, dates, relative times and plurals on `Intl`: zero dependency. |
| [`@krizaka/i18n`](packages/i18n) | [![npm](https://img.shields.io/npm/v/@krizaka/i18n/beta?color=3b82f6&label=npm)](https://www.npmjs.com/package/@krizaka/i18n) | Typed message keys and placeholders from `en.json`, `format`, plurals, `<Rich>`, a React provider, and the `krizaka-i18n` CLI (catalogue check, hard-coded strings). |
| [`@krizaka/config`](packages/config) | [![npm](https://img.shields.io/npm/v/@krizaka/config?color=3b82f6&label=npm)](https://www.npmjs.com/package/@krizaka/config) | ESLint (base, Next.js, the four UI rules), tsconfig bases, Prettier, and `krizaka-ratchet`, the UI debt counter. |

## Documentation

**[krizaka.com/docs/ui](https://www.krizaka.com/docs/ui)** — the one place to read about the platform and share a link:
one page per component, generated at every build of the site from the registry this repository publishes with
`@krizaka/ui`. The **code drives the documentation**: each component's `meta.ts` (summary, when to use it and when
not, accessibility, web / React Native / both, status, related components), its named examples
(`packages/ui/registry/examples`, rendered live with their code) and its props (from the types) — a primitive without
them fails the tests. [`apps/storybook`](apps/storybook) is an internal tool: it renders the same examples to audit
them (axe) and compare their screenshots in dark and light in CI; it is not deployed.

## Develop

```bash
pnpm install
pnpm turbo run check   # lint, type-check, tests, build, size budgets, publint
pnpm --filter storybook dev   # the internal catalogue on http://localhost:6006
pnpm changeset         # describe a change that ships
```

pnpm + Turborepo, released with Changesets. The rules are in [AGENTS.md](AGENTS.md).

## License

[Apache-2.0](LICENSE)
