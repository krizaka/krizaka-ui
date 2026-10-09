<div align="center">

<img src="https://raw.githubusercontent.com/krizaka/.github/main/profile/assets/krizaka.svg" alt="Krizaka" width="72">

# @krizaka/ui

**The Krizaka brand layer, shared by every product.**
The animated marks of Krizaka, Orazaka and Orochia, and the Krizaka motion signature — one easing, one way to enter,
reveal, roll, shine and open.

[![npm](https://img.shields.io/npm/v/@krizaka/ui?color=3b82f6&label=npm)](https://www.npmjs.com/package/@krizaka/ui)
[![CI](https://github.com/krizaka/krizaka-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/krizaka/krizaka-ui/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue)](LICENSE)

</div>

## Install

```bash
npm install @krizaka/ui
```

React 18 or 19. No framework, no CSS library required: the marks carry their own styles, the motion is one CSS file.


## React Native

The marks have one geometry; `@krizaka/ui/native` draws it with `react-native-svg` for the apps
([orochia-mobile](https://github.com/krizaka/orochia-mobile)). The orbit turns and the flame breathes on the native
driver, and stay still when the system asks to reduce motion. `react-dom`, `react-native` and `react-native-svg` are
optional peers: a web app never installs the native ones, a native app never installs `react-dom`.

```tsx
import { OrochiaMark } from "@krizaka/ui/native";

<OrochiaMark size={72} title="Orochia" neutral={theme.border} />
```

## The marks

```tsx
import { KrizakaLogo, OrazakaLogo, OrochiaLogo, ProductLogo } from "@krizaka/ui";

<OrochiaLogo size={36} />                       // decorative (aria-hidden)
<KrizakaLogo size={48} title="Krizaka" />       // an image with an accessible name
<ProductLogo id="orazaka" animated={false} />   // by id, still
```

Neutral strokes follow the host's `--kz-*` tokens when they exist (`--kz-border-strong`, `--kz-text-muted`…) and the
text colour otherwise, so a mark reads on dark and light surfaces alike. Every instance has its own gradient ids.
Motion stops with `animated={false}` and always under `prefers-reduced-motion`.

## The motion signature

```tsx
import "@krizaka/ui/motion.css";
import { MotionObserver, RotatingWord } from "@krizaka/ui";

// once, at the root of the app
<MotionObserver />

<h1>Creators you <RotatingWord words={["love", "follow", "support"]} /></h1>
<section data-reveal style={{ "--kz-delay": "120ms" }}>…</section>
<a className="kz-sheen">Get started</a>
```

| Class / attribute | What it does |
| :--- | :--- |
| `--kz-ease` | The one easing: `cubic-bezier(0.16, 1, 0.3, 1)` |
| `kz-page` | A page entering (put it on a route wrapper) |
| `data-reveal` (+ `--kz-delay`) | Rises into place when it enters the viewport (`MotionObserver`) |
| `RotatingWord` / `kz-word` | A word that rolls through alternatives |
| `kz-sheen` | A light sweeping across a primary action on hover |
| `kz-spotlight` | A soft bloom following the pointer across a card |
| `kz-lift` | A card rising under the pointer |
| `kz-gradient-text`, `kz-marquee` | Drifting gradient text, endless bands |
| `kz-overlay`, `kz-dialog`, `kz-pop`, `kz-fade` | Backdrops, dialogs (from the bottom on phones), menus, views swapped in place |

With Tailwind CSS v4, give every transition the same easing:

```css
@theme inline {
  --default-transition-timing-function: var(--kz-ease);
}
```

## With Tailwind CSS v4

The components are styled with the [`@krizaka/tailwind`](https://www.npmjs.com/package/@krizaka/tailwind) utilities.
Import the preset, then `@krizaka/ui/tailwind.css`: it points Tailwind at the package (`@source "./dist"`), so the
classes the components use are generated in your stylesheet.

```css
@import "tailwindcss";
@import "@krizaka/tailwind";
@import "@krizaka/ui/tailwind.css";
```

Every component, in dark and light and under each product identity:
[krizaka.github.io/krizaka-ui/latest](https://krizaka.github.io/krizaka-ui/latest/).

## Develop

This package lives in the [`krizaka-ui`](https://github.com/krizaka/krizaka-ui) monorepo (pnpm + Turborepo), in
`packages/ui`. From the repository root:

```bash
pnpm install
pnpm turbo run check --filter=@krizaka/ui   # lint, type-check, tests, build, size, publint
```

Releases go through [Changesets](https://github.com/changesets/changesets): a pull request adds a
`.changeset/*.md`; merging the "Version Packages" pull request publishes to npm with provenance and tags
`@krizaka/ui@x.y.z`.

## Used by

[krizaka.com](https://github.com/krizaka/krizaka-com) ·
[Orochia](https://github.com/krizaka/orochia) (through [`@krizaka/orochia-design-system`](https://github.com/krizaka/orochia-design-system)) ·
[Orazaka](https://github.com/krizaka/orazaka)

---

Apache-2.0 · Part of [Krizaka](https://www.krizaka.com) — open source, closed to compromise.
