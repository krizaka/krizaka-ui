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

> 2.0 beta: the atoms, the structure of a page and what opens over it (cards, dialogs, sheets, toasts, popovers,
> menus, tooltips), then navigation and input (tabs, chips, switches, sliders, checkboxes, radios, the command palette,
> the two-step confirm button, progress).

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
import { Card } from "@krizaka/ui/card";
import { AlertDialog, Dialog } from "@krizaka/ui/dialog";
import { toast, Toaster } from "@krizaka/ui/toast";

<Button variant="primary" loading={saving}>{t("save")}</Button>
<Button asChild variant="outline"><Link href="/docs">{t("docs")}</Link></Button>
<Badge tone="danger" dot pulse>{t("endsSoon")}</Badge>
<Field.Root>
  <Field.Label htmlFor="email">{t("email")}</Field.Label>
  <Input id="email" invalid={!!error} aria-describedby="email-error" />
  {error && <Field.Error id="email-error">{error}</Field.Error>}
</Field.Root>

<Card.Root asChild interactive reveal={index}>
  <Link href={href}>
    <Card.Media><Card.Image src={cover} fallback={<PlayIcon />} /></Card.Media>
    <Card.Body><Card.Title>{title}</Card.Title></Card.Body>
  </Link>
</Card.Root>

<Dialog.Root>
  <Dialog.Trigger asChild><Button>{t("edit")}</Button></Dialog.Trigger>
  <Dialog.Content closeLabel={t("close")} placement="bottom">
    <Dialog.Header><Dialog.Title>{t("editTitle")}</Dialog.Title></Dialog.Header>
    <Dialog.Body>…</Dialog.Body>
  </Dialog.Content>
</Dialog.Root>

<AlertDialog tone="danger" trigger={<Button variant="danger">{t("delete")}</Button>} title={t("deleteTitle")}
  confirmLabel={t("delete")} cancelLabel={t("cancel")} onConfirm={() => deleteVideo(id)} />

// once, in the root layout — then toast.success(t("saved")) anywhere on the client
<Toaster label={t("notifications")} closeLabel={t("dismiss")} />
```

**React 19 is required by the primitives** (`ref` is a prop, no `forwardRef`). The package keeps `react >= 18` as its
peer range, because the marks and the motion still run on React 18: one `package.json` cannot hold both ranges.
`tailwindcss` and `@krizaka/tailwind` are optional peers — a native app or a marks-only site never installs them.

### The component contract (12 points)

1. **Composed when there is structure** (`Card.*`, `Dialog.*`, `Field.*`, `Avatar.Group`), **flat for an atom**
   (`Button`, `Badge`, `Input`, `Stat`).
2. **Variants exported next to the component** (`buttonVariants`, `badgeVariants`): a `<Link>` or a Server Component
   is styled without importing the component.
3. **`asChild`** (Radix `Slot`) rather than `as`: props, `className` and `ref` are merged into the child.
4. **`className` is always merged last** (tailwind-merge, through `cn`): the product's override wins.
5. **Words are props** (`label`, `closeLabel`, `units`, `title`) — there is no `t()` in the kit. Each app re-exports the
   primitives with its words from its own `components/ui/`.
6. **Controlled and uncontrolled**: `value`/`defaultValue` + `onValueChange`, `open`/`defaultOpen` + `onOpenChange`.
7. **State is exposed as `data-*`** (`data-tone`, `data-loading`, `data-invalid`, `data-urgent`, `data-mode`): a
   product styles a state without a new variant.
8. **Server by default**: `"use client"` only on the entries with a hook or a portal (`avatar`, `theme`, `countdown`,
   `dialog`, `toast`, `popover`, `dropdown-menu`, `tooltip`).
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
| `@krizaka/ui/card` | `Card.Root` (`asChild`, `reveal`, `radius` md·lg·xl, `tone` default·elevated·glass, `interactive`), `Card.Media` (`aspect` video·square·portrait·auto), `Card.Image` (`fallback`), `Card.Overlay` (`corner`), `Card.Body` (`padding`), `Card.Title` (`as`), `Card.Description`, `Card.Stat` (`label`), `Card.Footer`; `card` (the slots) | server |
| `@krizaka/ui/dialog` | `Dialog.Root/Trigger/Content/Header/Title/Description/Body/Footer/Close` (`placement` center·bottom·right, `size` sm·md·lg, `closeLabel` required unless `hideClose`, `dismissible={false}`: no close on Escape or outside click), `Sheet` (= `placement="bottom"`), `AlertDialog` (`title`, `description`, `confirmLabel`, `cancelLabel`, `tone` danger·primary, async `onConfirm`, `trigger`) | client |
| `@krizaka/ui/toast` | `Toaster` (sonner styled by roles: `label`, `closeLabel`, `position`, `closeButton`; `richColors` off), `toast` (`.success/.warning/.error/.info/.custom`…) | client |
| `@krizaka/ui/popover` | `Popover.Root/Trigger/Anchor/Content/Close` | client |
| `@krizaka/ui/dropdown-menu` | `DropdownMenu.Root/Trigger/Content/Item/CheckboxItem/Label/Separator/Group` (`Item` `tone` default·danger), `menu` (the slots) | client |
| `@krizaka/ui/tooltip` | `Tooltip` (`content`, `delayDuration` 300, `side`, `open`/`defaultOpen`), `TooltipProvider` | client |
| `@krizaka/ui/stat` | `Stat` (`label`, `value`, `hint`, `trend` up·down·flat, `trendLabel`) | server |
| `@krizaka/ui/page-header` | `PageHeader` (`title`, `description`, `actions`, `breadcrumb`, `as` h1·h2) | server |
| `@krizaka/ui/alert` | `Alert` (`tone` info·success·warning·danger, `icon`, `title`, `action`; `role="alert"` for danger and warning, `status` otherwise), `alertVariants` | server |
| `@krizaka/ui/separator` | `Separator` (`orientation`, `decorative`, Radix), `separatorVariants` | server |
| `@krizaka/ui/kbd` | `Kbd` (`size` sm·md), `kbdVariants` | server |
| `@krizaka/ui/tabs` | `Tabs.Root/List/Trigger/Content` (`variant` underline·segmented·pills on the root, `orientation`, `value`/`defaultValue` + `onValueChange`), `tabs` (the slots) | client |
| `@krizaka/ui/chip` | `Chip` (`selected`/`defaultSelected` + `onSelectedChange`, `size` sm·md; `removable` + `removeLabel` + `onRemove`), `Chip.Group` (`type` single·multiple, `label`, `required` for single), `chip` (the slots) | client |
| `@krizaka/ui/switch` | `Switch` (`checked`/`defaultChecked` + `onCheckedChange`, `label` unless a visible label names it, `size` sm·md, `invalid`), `switchVariants` | client |
| `@krizaka/ui/slider` | `Slider` (`value`: a number or a `[min, max]` range, `onValueChange`, `onValueCommit`, `label`, `thumbLabels`, `formatValue` → aria-valuetext, `showLabel`, `origin`), `slider` (the slots) | client |
| `@krizaka/ui/checkbox` | `Checkbox` (`checked` true·false·"indeterminate" + `onCheckedChange`, `invalid`, its words as children) — sits in a `Field` | client |
| `@krizaka/ui/radio-group` | `RadioGroup.Root` (`label`, `orientation`, `invalid`), `RadioGroup.Item` (a dot and its words), `RadioGroup.Card` (a whole card is the radio) | client |
| `@krizaka/ui/command` | `Command.Root` (`label`, `shouldFilter`…) `/Input` (`placeholder`, `trailing`) `/List` (`label`) `/Empty` (`emptyLabel`) `/Loading/Group/Item/Separator/Shortcut` on cmdk; `CommandDialog` (`label`, `open`/`onOpenChange`, `footer`, `contentProps`) | client |
| `@krizaka/ui/confirm-button` | `ConfirmButton` (two presses: `confirmLabel`, `onConfirm`, `timeoutMs` 4000, `label` for an icon, `armedContent`; the `Button` variants), `confirmArmed` | client |
| `@krizaka/ui/progress` | `Progress` (`variant` bar·ring, `size` sm·md·lg, `value`/`max`, indeterminate without a value, `label`, `valueText`, a ring's centre as children) | server |
| `@krizaka/ui/section-backdrop` | `SectionBackdrop` (`as`, `direction` down·up, `dome`, `grid`, `media` blurred for depth of field, `animated`): a page section on the brand's section gradient — see `@krizaka/tokens` BRAND.md, "Visual language" | server |
| `@krizaka/ui` | the marks, `MotionObserver`, `RotatingWord`, `cx` (unchanged) | client |
| `@krizaka/ui/native` | React Native: `ThemeProvider`/`useTheme`, `Txt`, `Button`, `IconButton`, `Card.*`, `Badge`, `Chip` (+ `Group`), `Avatar` (+ `Group`), `Skeleton`, `EmptyState`, `Spinner`, `Countdown`, `Segmented`, `Progress`, `Toaster`/`toast`, the marks — see [React Native](#react-native) | native |
| `@krizaka/ui/motion.css`, `@krizaka/ui/tailwind.css` | the motion signature; the `@source` of the primitives' classes | CSS |
| `@krizaka/ui/registry/<name>`, `@krizaka/ui/registry/examples/<name>/<example>` | the registry (JSON) and the examples — see [Registry](#registry--the-code-drives-the-documentation) | data · client |

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

## Registry — the code drives the documentation

Every component is also published as data: **[krizaka.com/docs/ui](https://www.krizaka.com/docs/ui)** is generated
from it at every build of the site (one page per component: when to use it, live examples with their code for the web
and React Native, props, accessibility), and, later, a `npx @krizaka/cli add <name>` may copy a primitive into a
product that forks it knowingly. Built by `scripts/build-registry.mjs` after tsup, from three sources in the code:

- **`meta.ts`** beside each component (`src/<name>/meta.ts`, `src/cn.meta.ts`; a React-Native-only component:
  `src/native/meta/<name>.ts`), typed by `src/meta.ts`: title, summary, status (`stable` · `beta`), category,
  platforms (`web` · `native` · `both`), when to use it, when not (and what to use instead), best practices,
  accessibility (keyboard, roles), related components, and per platform the names to import, the named examples and,
  for React Native, what differs from the web API. A typed module rather than JSDoc tags: the fields are lists and
  links between components, which the compiler checks; the file is plain data that Node reads without a build.
- **Named examples**: `registry/examples/<name>/<example>.tsx` (web) and `registry/examples/<name>/native/<example>.tsx`
  (React Native) — one per significant variant, ≤ 40 lines, importing what a product imports (`@krizaka/ui/<entry>`,
  `@krizaka/ui/native`, `react-native`). The stories render them, so Storybook's visual tests and the docs show the
  same code. An example that opens over the page takes `defaultOpen` (the story opens it; the docs leave it closed).
- **Props** of the web and native components, read by `react-docgen-typescript` from the JSDoc of their props types:
  own props only (inherited DOM, Radix and `Pressable` props are left out).

`scripts/registry.test.mjs` fails when a component has no `meta.ts`, an empty section, an unknown related component, a
platform that does not match its exports, an example missing or longer than 40 lines, or a prop without a
description; `src/registry.test.tsx` (Vitest, axe) and `src/native/examples.test.tsx` (Jest) render every example.

| Path | What |
| :-- | :-- |
| `@krizaka/ui/registry/index` | `{ name, version, items: [{ name, type, title, summary, status, category, platforms, examples: { web, native }, dependencies, registryDependencies }] }` |
| `@krizaka/ui/registry/<name>` | the `meta.ts` fields, `web` and `native` (`{ entry, import, props, examples: [{ name, title, description, path, module, code }] }`, `native` adds `differences` and, per example, `screenshots: { dark, light }`), and for a web primitive `files: [{ path, content }]`, `dependencies`, `registryDependencies`, `demo` (its first example) and `props` |
| `@krizaka/ui/registry/examples/<name>/<example>` | an example, compiled (ESM, `"use client"`, `default` export); its source ships beside it (`.tsx`), and a React Native example its screenshots (`<example>.dark.png`, `<example>.light.png`: the Linux baselines of its story — React Native has no live preview on the web) |

- `files` are the sources (paths from `src/`); `dependencies` are npm `name@range` (React aside); `registryDependencies`
  are the other primitives it imports (`cn`, `button`…). `type` is `primitive` (a web entry) or `native` (React Native
  only: `segmented`, `txt`).
- `props` is one entry per exported component — `{ component, description, props: [{ name, type, default, description,
  required }] }`.

```ts
import button from "@krizaka/ui/registry/button" with { type: "json" };
import Primary from "@krizaka/ui/registry/examples/button/primary";
```

A site that renders the examples adds them to Tailwind's sources: `@source "../node_modules/@krizaka/ui/registry/examples";`.

## React Native

`@krizaka/ui/native` is the platform for the React Native apps
([orochia-mobile](https://github.com/krizaka/orochia-mobile)): the same primitives as the web, **the same prop names
where the concept is the same**, the same tokens — `StyleSheet` only, no NativeWind, no dependency beyond
`react-native` (≥ 0.76) and `react-native-svg` (≥ 15), which the apps already have. The `@krizaka/tokens/native` values
are inlined in the bundle: the app installs nothing else. `react-dom`, `react-native` and `react-native-svg` are
optional peers: a web app never installs the native ones, a native app never installs `react-dom`.

```bash
npm install @krizaka/ui   # react, react-native and react-native-svg come from the app
```

### Theme

Once, at the root. `mode` is `dark` · `light` · `system` (followed through `useColorScheme`); `overrides` are a
product's roles over the platform's, per theme — e.g. `nativeTheme` from `@krizaka/orochia-design-system/tokens`.
Without a provider, `useTheme()` follows the system with the platform's roles. No storage dependency: the app
persists the choice in `onModeChange`.

```tsx
import { ThemeProvider, Toaster, useTheme } from "@krizaka/ui/native";
import { nativeTheme } from "@krizaka/orochia-design-system/tokens";

<ThemeProvider mode={mode} onModeChange={saveMode} overrides={nativeTheme} fonts={{ display: "Outfit-Bold" }}>
  <App />
  <Toaster closeLabel={t("common.close")} offset={insets.top + 8} />
</ThemeProvider>;

const { theme, scheme, mode, setMode, radius } = useTheme(); // theme.surface1, theme.textPrimary, theme.accent…
```

### Components

| Native | Props (same names as the web unless noted) | Differences with the web |
| :-- | :-- | :-- |
| `Txt` | `variant` display·title·body·caption·label·mono, `tone` text·secondary·muted·accent·success·warning·danger·onAccent·onMedia | Native only (the web uses classes). `title`/`display` are headings. |
| `Button`, `IconButton` | `variant` primary·secondary·outline·ghost·danger, `size` sm·md·lg, `shape` rounded·pill, `loading`, `disabled`, `onPress`; `IconButton`: `label` required, `icon` | The text is `label` (a string), not children; `icon` before it; no `asChild`. Haptics stay in the app's `onPress`. |
| `Card.Root/Media/Image/Overlay/Body/Title/Description/Footer` | `tone` default·elevated, `radius`, `Media aspect`, `Image src`/`fallback`, `Overlay corner`, `Body padding` | `Root onPress` makes the card a button (the web uses `asChild` + a link). No `Stat`, no `reveal`. |
| `Badge` | `tone` neutral·accent·success·warning·danger·scrim, `size` sm·md, `dot`, `pulse` | — |
| `Chip`, `Chip.Group` | `selected`/`defaultSelected`/`onSelectedChange`, `value`, `size`, `removable` + `removeLabel` + `onRemove`; Group: `type` single·multiple, `value`/`defaultValue`/`onValueChange` | A toggle chip is a `checkbox` (web: a pressed button). `Group scrollable`: one horizontal row. |
| `Avatar`, `Avatar.Group` | `src`, `alt`, `fallback`, `size` xs·sm·md·lg·xl; Group `max` | `size` also takes points; the default fallback is the initial of `alt`. |
| `Skeleton` | `shape` text·circle·rect | `width`, `height` as props (no classes). |
| `EmptyState` | `icon`, `title`, `description`, `action` | `title`/`description` are strings. |
| `Spinner` | `label`, `size` sm·md·lg | The platform's `ActivityIndicator`. |
| `Countdown` | `target`, `skewMs`, `units`, `urgentBelowMs`, `size`, `label` | Same clock (`countdown/core`): one interval for every countdown on screen. |
| `Segmented` | `options` (`value`, `label`, `disabled`), `value`, `onValueChange`, `size` | The web `Tabs variant="segmented"` (a tab list). To filter, `Chip.Group`. |
| `Progress` | `variant` bar·ring, `size`, `value`/`max`, `label`, `valueText`, a ring's centre as children | The fill is the `accent` → `accent2` gradient (react-native-svg); it animates to each new value. |
| `Toaster`, `toast` | `toast(title, { description, tone, icon, action, onPress, id, duration, onDismiss })`, `toast.success/warning/error/info`, `toast.dismiss(id?)`; `Toaster closeLabel position offset duration max` | No sonner: a light queue of its own. `offset` takes the safe-area inset (no safe-area dependency). |
| `KrizakaMark`, `OrazakaMark`, `OrochiaMark`, `ProductMark` (`id`) | `size`, `animated`, `title`, `neutral` (default `theme.textMuted`) | The brand marks, drawn with react-native-svg from the web marks' geometry. |

Every animation (skeleton, badge dot, urgent countdown, progress, toast entrance, the marks) stops when the system
asks to reduce motion (`useReducedMotion()`). Accessibility goes through `role` and `aria-*` (RN ≥ 0.71): headings,
`button`, `checkbox`/`radio`/`radiogroup`, `tab`/`tablist`, `progressbar` with its value, `timer`, a polite live
region for the toasts.

```tsx
import { Button, Card, Countdown, OrochiaMark } from "@krizaka/ui/native";

<Card.Root onPress={open}>
  <Card.Body>
    <Card.Title>{item.title}</Card.Title>
    <Countdown target={item.endsAt} skewMs={skew} units={units} label={t("item.endsIn")} size="sm" />
    <Button variant="primary" label={t("item.join")} onPress={join} />
  </Card.Body>
</Card.Root>

<OrochiaMark size={72} title="Orochia" neutral={theme.borderDefault} />
```

The native stories (`Native/*`, rendering the `registry/examples/<name>/native` examples) render through
react-native-web in the internal Storybook: audited by axe
and screenshot-compared in dark and light like the web ones. Tests run on Jest with React Native's preset and
Testing Library (`src/native/*.test.tsx`); `scripts/native-dist.mjs` checks that `dist/native.js` carries no
`"use client"`, no DOM and no import beyond React, `react-native` and `react-native-svg`.

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
| `kz-progress` | The indeterminate progress bar's travelling segment |
| `kz-backdrop`, `kz-backdrop-drift`, `-dome`, `-grid`, `-media` | The layers of `SectionBackdrop`: the brand's section gradient, the slow light drift (40 s), the dome, the perspective grid, the blurred foreground |

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

Every component, with when to use it, live examples and their code (web and React Native) and its props:
[krizaka.com/docs/ui](https://www.krizaka.com/docs/ui).

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
