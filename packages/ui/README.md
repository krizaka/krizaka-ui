<div align="center">

<img src="https://raw.githubusercontent.com/krizaka/.github/main/profile/assets/krizaka.svg" alt="Krizaka" width="72">

# @krizaka/ui

**The Krizaka front-end platform's components, shared by every product.**
The primitives (button, badge, avatar, field, theme, countdown…) on the semantic `--kz-*` tokens, the animated marks
of Krizaka, Orazaka and Orochia, and the Krizaka motion signature — one easing, one way to enter, reveal, roll, shine
and open.

[![npm](https://img.shields.io/npm/v/@krizaka/ui?color=3b82f6&label=npm)](https://www.npmjs.com/package/@krizaka/ui)
[![CI](https://github.com/krizaka/krizaka-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/krizaka/krizaka-ui/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue)](LICENSE)

</div>

## Install

```bash
npm install @krizaka/ui
```

The marks and the motion: React 18 or 19, no framework, no CSS library — the marks carry their own styles, the motion
is one CSS file. The primitives: **React 19** and Tailwind CSS v4 with the Krizaka preset (below).


## Primitives

> 2.0 beta: the first layer (atoms). Cards, dialogs, tabs, toasts and menus follow in the next betas.

### Install

```bash
npm install @krizaka/ui@beta @krizaka/tailwind@beta @krizaka/tokens@beta tailwindcss
```

```css
/* app/globals.css — the preset (tokens as utilities), then the classes the primitives use */
@import "tailwindcss";
@import "@krizaka/tailwind";
@import "@krizaka/ui/tailwind.css";
```

```tsx
import { Button, IconButton } from "@krizaka/ui/button";
import { Badge } from "@krizaka/ui/badge";
import { Field, Input } from "@krizaka/ui/field";
import { ThemeProvider, ThemeScript, ThemeToggle } from "@krizaka/ui/theme";

<Button variant="primary" loading={saving}>{t("save")}</Button>
<Button asChild variant="outline"><Link href="/docs">{t("docs")}</Link></Button>
<Badge tone="danger" dot pulse>{t("endsSoon")}</Badge>
<Field.Root>
  <Field.Label htmlFor="email">{t("email")}</Field.Label>
  <Input id="email" invalid={!!error} aria-describedby="email-error" />
  {error && <Field.Error id="email-error">{error}</Field.Error>}
</Field.Root>
```

**React 19 is required by the primitives** (`ref` is a prop, no `forwardRef`). The package keeps `react >= 18` as its
peer range, because the marks and the motion still run on React 18: one `package.json` cannot hold both ranges.
`tailwindcss` and `@krizaka/tailwind` are optional peers — a native app or a marks-only site never installs them.

### The component contract (12 points)

1. **Composed when there is structure** (`Field.*`, `Avatar.Group`), **flat for an atom** (`Button`, `Badge`, `Input`).
2. **Variants exported next to the component** (`buttonVariants`, `badgeVariants`): a `<Link>` or a Server Component
   is styled without importing the component.
3. **`asChild`** (Radix `Slot`) rather than `as`: props, `className` and `ref` are merged into the child.
4. **`className` is always merged last** (tailwind-merge, through `cn`): the product's override wins.
5. **Words are props** (`label`, `closeLabel`, `units`, `title`) — there is no `t()` in the kit. Each app re-exports the
   primitives with its words from its own `components/ui/`.
6. **Controlled and uncontrolled**: `value`/`defaultValue` + `onValueChange`, `open`/`defaultOpen` + `onOpenChange`.
7. **State is exposed as `data-*`** (`data-tone`, `data-loading`, `data-invalid`, `data-urgent`, `data-mode`): a
   product styles a state without a new variant.
8. **Server by default**: `"use client"` only on the entries with a hook or a portal (`avatar`, `theme`, `countdown`).
   One build entry per component; the directive is kept per entry.
9. **React 19 minimum for the primitives**; the marks stay `react >= 18`.
10. **Accessibility is delegated**: non-trivial interactions on Radix UI (`radix-ui`), the command palette on cmdk,
    toasts on sonner — no hand-written focus trap.
11. **Every primitive ships** types, a story (every variant, dark and light, screenshot-tested), an RTL + axe test and
    an entry here.
12. **Motion**: `prefers-reduced-motion` is honoured (`motion-safe:`); no component animates a layout property.

Colours are roles of the preset (`bg-surface-2`, `text-fg-secondary`, `border-border-default`, `text-accent`,
`text-danger`), never a palette step nor `light:`: a theme — dark, light or a product's — is a set of tokens.

### Entries

| Entry | Exports | Runs |
| :-- | :-- | :-- |
| `@krizaka/ui/cn` | `cn(...classes)` — clsx + tailwind-merge (the engine `tailwind-variants` ships) | server |
| `@krizaka/ui/slot` | `Slot`, `VisuallyHidden` (Radix) | server |
| `@krizaka/ui/button` | `Button` (`variant` primary·secondary·outline·ghost·danger, `size` sm·md·lg·icon, `shape` rounded·pill, `loading`, `asChild`), `IconButton` (`label` required), `buttonVariants` | server |
| `@krizaka/ui/badge` | `Badge` (`tone` neutral·accent·success·warning·danger·scrim, `size` sm·md, `dot`, `pulse`), `badgeVariants` | server |
| `@krizaka/ui/avatar` | `Avatar` (`src`, `alt`, `fallback`, `size` xs·sm·md·lg·xl), `Avatar.Group` (`max`) | client |
| `@krizaka/ui/field` | `Field.Root/Label/Hint/Error`, `Input`, `Textarea`, `Select` (native, styled) — `invalid` | server |
| `@krizaka/ui/theme` | `ThemeScript` (in `<head>`, no flash), `ThemeProvider`, `useTheme()` → `{ mode, setMode, theme, setTheme }`, `ThemeToggle` (`label`) | client |
| `@krizaka/ui/skeleton` | `Skeleton` (`shape` text·circle·rect) | server |
| `@krizaka/ui/empty-state` | `EmptyState` (`icon`, `title`, `description`, `action`) | server |
| `@krizaka/ui/spinner` | `Spinner` (`label`, `size`) | server |
| `@krizaka/ui/countdown` | `Countdown` (`target`, `label`, `units`, `size`, `urgentBelowMs`, `skewMs`), `useCountdown`, `splitDuration` | client |
| `@krizaka/ui` | the marks, `MotionObserver`, `RotatingWord`, `cx` (unchanged) | client |
| `@krizaka/ui/native` | the marks for React Native (unchanged) | native |
| `@krizaka/ui/motion.css`, `@krizaka/ui/tailwind.css` | the motion signature; the `@source` of the primitives' classes | CSS |

The theme is one mechanism for every product: dark by default, `html.light` for light, `html.theme-<name>` for a named
theme, persisted as `kz-theme` (and `kz-theme-name`).

```tsx
// app/layout.tsx
<html lang={locale} suppressHydrationWarning>
  <head><ThemeScript /></head>
  <body><ThemeProvider>{children}</ThemeProvider></body>
</html>

<ThemeToggle label={(mode) => t(`theme.${mode}`)} />
```

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
