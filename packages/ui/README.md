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
| `@krizaka/ui` | the marks, `MotionObserver`, `RotatingWord`, `cx` (unchanged) | client |
| `@krizaka/ui/native` | the marks for React Native (unchanged) | native |
| `@krizaka/ui/motion.css`, `@krizaka/ui/tailwind.css` | the motion signature; the `@source` of the primitives' classes | CSS |
| `@krizaka/ui/registry/<name>`, `@krizaka/ui/registry/demos/<name>` | the registry (JSON) and the demos — see [Registry](#registry) | data · client |

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

## Registry

Every primitive is also published as data, for documentation sites (krizaka.com's `/docs/ui`: live preview, copyable
code, props table) and, later, a `npx @krizaka/cli add <name>` that copies a primitive into a product which forks it
knowingly. Built by `scripts/build-registry.mjs` after tsup, from `src/<name>/` (all primitives; not the marks, the
motion or `native`):

| Path | What |
| :-- | :-- |
| `@krizaka/ui/registry/index` | `{ name, version, items: [{ name, type, description, dependencies, registryDependencies }] }` |
| `@krizaka/ui/registry/<name>` | `{ name, type: "primitive", description, files: [{ path, content }], dependencies, registryDependencies, demo: { path, content }, props }` |
| `@krizaka/ui/registry/demos/<name>` | the demo, compiled (ESM, `"use client"`, `default` export) — its source ships beside it as `registry/demos/<name>.tsx` |

- `files` are the sources (paths from `src/`); `dependencies` are npm `name@range` (React aside); `registryDependencies`
  are the other primitives it imports (`cn`, `button`…).
- `props` is one entry per exported component — `{ component, description, props: [{ name, type, default, description,
  required }] }` — read by `react-docgen-typescript` from the JSDoc of the props types: the component's own props,
  its variants included; inherited DOM and Radix props are left out. A test fails on a prop without a description.
- A demo is ≤ 40 lines, imports the primitives as a product does (`@krizaka/ui/<name>`) and is the default story of
  the primitive: Storybook and the docs show the same code. A demo that opens over the page takes `defaultOpen` (the
  story opens it for the screenshot; the docs leave it closed).

```ts
import card from "@krizaka/ui/registry/card" with { type: "json" };
import CardDemo from "@krizaka/ui/registry/demos/card";
```

A site that renders the demos adds them to Tailwind's sources: `@source "../node_modules/@krizaka/ui/registry/demos";`.

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
| `kz-progress` | The indeterminate progress bar's travelling segment |

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
