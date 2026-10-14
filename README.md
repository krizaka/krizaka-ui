<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/krizaka/.github/main/profile/assets/krizaka-dark.svg">
  <img src="https://raw.githubusercontent.com/krizaka/.github/main/profile/assets/krizaka-light.svg" alt="Krizaka" width="96">
</picture>

# krizaka-ui

**The Krizaka front-end platform.** The shared packages every Krizaka product builds on, published on npm under
`@krizaka/*`.

**2.x is stable**: web primitives and their React Native counterparts, the Krizaka · Orazaka · Orochia · Yasakia · Yororis marks and the
signature icons — charts are next. Documented at [krizaka.com/docs/ui](https://www.krizaka.com/docs/ui).

[![CI](https://github.com/krizaka/krizaka-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/krizaka/krizaka-ui/actions/workflows/ci.yml)
[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/krizaka/krizaka-ui/badge)](https://scorecard.dev/viewer/?uri=github.com/krizaka/krizaka-ui)
[![@krizaka/ui](https://img.shields.io/npm/v/@krizaka/ui?label=%40krizaka%2Fui&color=196df5)](https://www.npmjs.com/package/@krizaka/ui)
[![Docs](https://img.shields.io/badge/docs-krizaka.com%2Fdocs%2Fui-196df5)](https://www.krizaka.com/docs/ui)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue)](LICENSE)

</div>

## Packages

| Package | Version | What it is |
| :-- | :-- | :-- |
| [`@krizaka/tokens`](packages/tokens) | [![npm](https://img.shields.io/npm/v/@krizaka/tokens?color=196df5&label=npm)](https://www.npmjs.com/package/@krizaka/tokens) | The semantic `--kz-*` tokens: CSS (dark, light, media invariants), typed constants, React Native themes. |
| [`@krizaka/tailwind`](packages/tailwind) | [![npm](https://img.shields.io/npm/v/@krizaka/tailwind?color=196df5&label=npm)](https://www.npmjs.com/package/@krizaka/tailwind) | The Tailwind CSS v4 preset: the tokens as utilities, illustration-only `light:`/`dark:`, the Krizaka easing. |
| [`@krizaka/ui`](packages/ui) | [![npm](https://img.shields.io/npm/v/@krizaka/ui?color=196df5&label=npm)](https://www.npmjs.com/package/@krizaka/ui) | The primitives — button, card, dialog, toast, tabs, command palette, countdown… — for the web (one entry each) and React Native (`/native`), with the Krizaka marks, the motion signature and the registry behind the documentation. |
| [`@krizaka/icons`](packages/icons) | [![npm](https://img.shields.io/npm/v/@krizaka/icons?color=196df5&label=npm)](https://www.npmjs.com/package/@krizaka/icons) | The Krizaka signature icons (70), drawn in code: React and React Native, tree-shakable. |
| [`@krizaka/intl`](packages/intl) | [![npm](https://img.shields.io/npm/v/@krizaka/intl?color=196df5&label=npm)](https://www.npmjs.com/package/@krizaka/intl) | Money (from integer minor units), numbers, dates, relative times and plurals on `Intl`: zero dependency. |
| [`@krizaka/i18n`](packages/i18n) | [![npm](https://img.shields.io/npm/v/@krizaka/i18n?color=196df5&label=npm)](https://www.npmjs.com/package/@krizaka/i18n) | Typed message keys and placeholders from `en.json`, `format`, plurals, `<Rich>`, a React provider, and the `krizaka-i18n` CLI (catalogue check, hard-coded strings). |
| [`@krizaka/realtime`](packages/realtime) | [![npm](https://img.shields.io/npm/v/@krizaka/realtime?color=196df5&label=npm)](https://www.npmjs.com/package/@krizaka/realtime) | Server realtime behind one interface: a bus (publish / subscribe) and presence, on memory, PostgreSQL LISTEN/NOTIFY or Redis / Valkey, plus Server-Sent Events. |
| [`@krizaka/query`](packages/query) | [![npm](https://img.shields.io/npm/v/@krizaka/query?color=196df5&label=npm)](https://www.npmjs.com/package/@krizaka/query) | Server state for every app: TanStack Query v5 behind the Krizaka facade — typed fetch with Problem Details errors, typed keys, live invalidation from realtime events, App Router hydration, offline cache on Expo. |
| [`@krizaka/push`](packages/push) | [![npm](https://img.shields.io/npm/v/@krizaka/push?color=196df5&label=npm)](https://www.npmjs.com/package/@krizaka/push) | Mobile push through the Expo Push Service (FCM / APNs), without an SDK: batches, dead tokens, never throws. |
| [`@krizaka/config`](packages/config) | [![npm](https://img.shields.io/npm/v/@krizaka/config?color=196df5&label=npm)](https://www.npmjs.com/package/@krizaka/config) | ESLint (base, Next.js, the four UI rules), tsconfig bases, Prettier, and `krizaka-ratchet`, the UI debt counter. |

## Documentation

**[krizaka.com/docs/ui](https://www.krizaka.com/docs/ui)** — the one place to read about the platform and share a link:
one page per component, generated at every build of the site from the registry this repository publishes with
`@krizaka/ui`. The **code drives the documentation**: each component's `meta.ts` (summary, when to use it and when
not, accessibility, web / React Native / both, status, related components), its named examples
(`packages/ui/registry/examples`, rendered live with their code) and its props (from the types) — a primitive without
them fails the tests. [`apps/storybook`](apps/storybook) is an internal tool: it renders the same examples to audit
them (axe) and compare their screenshots in dark and light in CI; it is not deployed — there is no public Storybook.

## For the products

```bash
npm install @krizaka/ui @krizaka/tailwind tailwindcss   # the primitives and the preset (tokens come with it)
```

```css
/* app/globals.css */
@import "tailwindcss";
@import "@krizaka/tailwind";
@import "@krizaka/ui/tailwind.css";
@import "@krizaka/tokens/brands/orochia.css"; /* the product's identity: krizaka · orazaka · orochia · yasakia · yororis */
```

Import one primitive per entry (`import { Button } from "@krizaka/ui/button"`), React Native from
`@krizaka/ui/native`. A product design system is a **theme and its composites**, never a copy of a primitive.

Keep up with the platform through Renovate — one pull request per platform release, patches merged on green CI —
by extending the preset of this repository ([`renovate/krizaka.json`](renovate/krizaka.json)):

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["config:recommended", "github>krizaka/krizaka-ui//renovate/krizaka"]
}
```

or, without the preset, the same rules inline in the product's `renovate.json`:

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["config:recommended"],
  "packageRules": [
    { "matchPackageNames": ["@krizaka/**", "com.krizaka:**"], "groupName": "krizaka", "labels": ["dependencies", "krizaka"] },
    { "matchPackageNames": ["@krizaka/**", "com.krizaka:**"], "matchUpdateTypes": ["patch"], "automerge": true, "platformAutomerge": true }
  ]
}
```

Supported versions, deprecations and codemods: [SUPPORT.md](SUPPORT.md) — majors N and N-1, fixes for 6 months after
the next major.

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
