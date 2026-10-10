# @krizaka/tailwind

**The Krizaka Tailwind CSS v4 preset.** It turns the semantic `--kz-*` tokens of
[`@krizaka/tokens`](../tokens) into utilities (`bg-surface-1`, `text-fg-secondary`, `border-border-default`,
`text-accent`, `rounded-xl`…), gives the illustration-only `light:` / `dark:` variants, makes the Krizaka easing the
default of every transition, and brings the motion signature of [`@krizaka/ui`](../ui).

[![npm](https://img.shields.io/npm/v/@krizaka/tailwind?color=3b82f6&label=npm)](https://www.npmjs.com/package/@krizaka/tailwind)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue)](../../LICENSE)

The utilities are declared with `@theme inline`: a class reads its variable **at use time**, so dark, light and a
product theme change the values without recompiling a single class.

## Install

```bash
npm install -D tailwindcss @krizaka/tailwind @krizaka/tokens @krizaka/ui
```

`tailwindcss` (^4.1), `@krizaka/tokens` and `@krizaka/ui` are peer dependencies: the app owns their versions, which
`@krizaka/tokens`, `@krizaka/ui` and `@krizaka/tailwind` share (one Changesets `fixed` group).

## Wiring an app

Four lines in the app's global stylesheet (Orochia web, `app/globals.css`), in this order:

```css
@import "tailwindcss";
@import "@krizaka/tailwind";                           /* tokens + utilities + variants + motion */
@import "@krizaka/ui/tailwind.css";                    /* `@source "./dist"`: Tailwind scans the primitives */
@import "@krizaka/orochia-design-system/theme.css";    /* Orochia identity: --kz-* overrides + @source of the kit */
@source "../../../packages";                           /* the packages of the Orochia workspace */
```

The first two lines are enough to get the whole vocabulary. `@krizaka/ui/tailwind.css` arrives with the
`@krizaka/ui` 2.0 primitives; until then, leave that line out.

## Utilities by role

| Role | Utilities (any colour utility: `bg-`, `text-`, `border-`, `ring-`, `from-`, `fill-`…) | Token |
| :-- | :-- | :-- |
| Surfaces | `surface-0` page · `surface-1` card · `surface-2` raised · `surface-3` active | `--kz-surface-*` |
| Media | `media` (background before load) · `scrim`, `scrim-strong` (veil on an image) · `overlay` (dialog backdrop) | `--kz-media`, `--kz-scrim*`, `--kz-overlay` |
| Borders | `border-subtle` · `border-default` · `border-strong` → `border-border-default` | `--kz-border-*` |
| Text | `fg` · `fg-secondary` · `fg-muted` · `fg-on-media` → `text-fg-secondary` | `--kz-text-*` |
| Accent | `accent` · `accent-hover` · `accent-soft` · `accent-2` (gradients) · `on-accent` · `ring` | `--kz-accent*`, `--kz-on-accent`, `--kz-ring` |
| Status | `success` · `warning` · `danger` · `info` (fills, borders, dots, icons — ≥ 3:1) | `--kz-success` … |
| Status text | `fg-success` · `fg-warning` · `fg-danger` · `fg-info` → `text-fg-danger` (small text, ≥ 4.5:1 on every surface, both themes) | `--kz-*-text` |
| Radius | `rounded-sm` · `rounded-md` · `rounded-lg` · `rounded-xl` · `rounded-full` | `--kz-radius-*` |
| Shadow | `shadow-sm` · `shadow-md` · `shadow-lg` | `--kz-shadow-*` |
| Font | `font-sans` · `font-display` · `font-mono` | `--kz-font-*` |
| Motion | `ease-kz`; every `transition*` defaults to 200 ms on `--kz-ease` | `--kz-ease` |

Opacity modifiers work on every colour: `bg-surface-1/70`, `shadow-accent/20`.

The preset also sets the Tailwind v3 border rendering (`border` draws `--kz-border-default`, not `currentColor`),
the pointer cursor on enabled buttons, and the placeholder colour (`--kz-text-muted`).

## The rule

> **`light:` and `dark:` are for illustrations. A theme is a set of tokens.**

A component never switches classes with the theme: `bg-zinc-950/70 light:bg-white` is `bg-surface-1/70`,
`text-zinc-400 light:text-slate-500` is `text-fg-secondary`, `bg-black/60 text-white` on an image is
`bg-scrim text-fg-on-media` (identical in both themes). The variants exist only for what no token can express — an
illustration or an image that has a light and a dark version — and are refused by lint in the products.

| Variant | Matches |
| :-- | :-- |
| `light:` | `html.light`, **outside** any `.theme-dark` island |
| `dark:` | `:root:not(.light)`, and anything inside `.theme-dark` |

`.theme-dark` keeps a player, an editor or a media dark in both themes.

## A product theme

A product never redefines a palette: it overrides roles, in its design system's `theme.css`.

```css
/* @krizaka/orochia-design-system/theme.css — Obsidian Velvet Noir, expressed as roles */
@source "./dist";

:root, .theme-dark {
  --kz-surface-0: #060709;
  --kz-surface-1: #0c0e14;
  --kz-surface-2: #121520;
  --kz-surface-3: #1a1e2c;
  --kz-border-default: #1f2438;
  --kz-accent:       #8b5cf6;   /* velvet  */
  --kz-accent-hover: #7c3aed;
  --kz-accent-soft:  rgb(139 92 246 / 0.12);
  --kz-accent-2:     #ec4899;   /* sensual — from-accent to-accent-2 gradients become velvet → magenta */
  --kz-ring:         #a78bfa;
  --kz-font-display: Outfit, var(--kz-font-sans);
}
html.light {
  /* Luminous Ivory Cashmere & Rose */
  --kz-surface-0: hsl(210 20% 98%);
  --kz-accent:       #7c3aed;
  --kz-accent-2:     #db2777;
  --kz-accent-soft:  rgb(124 58 237 / 0.08);
}

/* Product tokens: prefixed, never generic */
:root { --orochia-story-ring: linear-gradient(135deg, var(--kz-accent), var(--kz-accent-2)); }
```

Every utility above follows, without one line in the components: `bg-accent` is velvet, the `kz-spotlight` and the
`kz-lift` shadow of the motion signature mix the accent. An extra theme (`html.theme-cyberpunk { --kz-accent: … }`)
costs a CSS block, never a component.

## License

[Apache-2.0](./LICENSE) © Krizaka
