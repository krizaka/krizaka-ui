# @krizaka/tokens

**The Krizaka semantic design tokens.** One vocabulary, `--kz-*`, written once in [DTCG](https://www.designtokens.org/)
JSON and compiled to CSS (dark, light, media invariants), typed constants and React Native themes. It is the vocabulary
krizaka.com already runs on (1 974 usages, zero raw palette colour), now shared by every product.

[![npm](https://img.shields.io/npm/v/@krizaka/tokens?color=3b82f6&label=npm)](https://www.npmjs.com/package/@krizaka/tokens)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue)](../../LICENSE)

## The rule

> **A component never reads a palette colour, only a role.**
> `bg-zinc-950/70 light:bg-white` → `var(--kz-surface-1)`; `text-zinc-400 light:text-slate-500` →
> `var(--kz-text-secondary)`; `bg-black/60 text-white` on an image → `var(--kz-scrim)` + `var(--kz-text-on-media)`.

A theme is a set of **values**, never a set of classes. A component is written once against the roles below; dark,
light and a product theme (an override of `--kz-accent`, `--kz-font-display`…) only change the values. No `light:`
variant, no `dark:` variant, no `zinc-*` / `slate-*` / `#hex` in a component.

## Install

```bash
npm install @krizaka/tokens
```

| Entry | For | Gives |
| :-- | :-- | :-- |
| `@krizaka/tokens/tokens.css` | Web (imported once, usually through `@krizaka/tailwind`) | The `--kz-*` custom properties. |
| `@krizaka/tokens` | TS / JS on the web (canvas, charts, e-mails, inline styles) | `tokens` (`var(--kz-…)` references, camelCase keys), `values.dark` / `values.light` (raw CSS, aliases resolved), `TokenName`. |
| `@krizaka/tokens/native` | React Native / Expo | `themes.dark` / `themes.light` (hex, `rgba()` when translucent), `radius` (dp), `typography`, `motion.ease`, type `Theme`. |

```css
@import "@krizaka/tokens/tokens.css";

.card { background: var(--kz-surface-1); border: 1px solid var(--kz-border-default); border-radius: var(--kz-radius-lg); }
```

```ts
import { tokens, values } from "@krizaka/tokens";
element.style.color = tokens.textSecondary;  // "var(--kz-text-secondary)" — follows the theme
chart.gridColor = values.dark.borderSubtle;   // "hsl(0 0% 100% / 0.06)"

import { themes, radius, type Theme } from "@krizaka/tokens/native";
const t: Theme = scheme === "light" ? themes.light : themes.dark;
<View style={{ backgroundColor: t.surface1, borderRadius: radius.lg }} />;
```

### Themes

| Selector | Gets |
| :-- | :-- |
| `:root`, `.theme-dark` | Dark — the default. `.theme-dark` re-declares the dark values, so a player, an editor or a media stays dark inside a light page without one `light:` class in its subtree. |
| `html.light` | Light. Toggle the `light` class on `<html>`. |
| `.theme-light` | Light on a subtree (a theme preview inside a dark page): the light values and the aliases, the counterpart of `.theme-dark`. |
| `:root` (invariants) | Identical in both themes: what sits **on** a media (scrims, text on media, dialog overlay), statuses, `on-accent`, radii, easing, font stacks. |

`color-scheme` follows the theme, so scrollbars and native controls match.

## Roles

Values are the CSS written in `dist/tokens.css`; `→` marks an alias, which follows its target in every theme and
under every product override.

### Colour

| Token | Key | Usage | Dark | Light |
| :-- | :-- | :-- | :-- | :-- |
| `--kz-surface-0` | `surface0` | Page background | `hsl(240 6% 5%)` | `hsl(0 0% 98%)` |
| `--kz-surface-1` | `surface1` | Card, panel | `hsl(240 5% 9%)` | `hsl(0 0% 100%)` |
| `--kz-surface-2` | `surface2` | Raised element, field, hover | `hsl(240 5% 13%)` | `hsl(240 6% 95%)` |
| `--kz-surface-3` | `surface3` | Active element, chip, track | `hsl(240 4% 17%)` | `hsl(240 5% 90%)` |
| `--kz-media` | `media` | A media's background before it loads | `hsl(240 5% 11%)` | `hsl(240 6% 92%)` |
| `--kz-border-subtle` | `borderSubtle` | Quiet separator | `hsl(0 0% 100% / 0.06)` | `hsl(240 6% 0% / 0.06)` |
| `--kz-border-default` | `borderDefault` | Card and field outline | `hsl(0 0% 100% / 0.10)` | `hsl(240 6% 0% / 0.10)` |
| `--kz-border-strong` | `borderStrong` | Hover outline, non-keyboard focus | `hsl(0 0% 100% / 0.16)` | `hsl(240 6% 0% / 0.16)` |
| `--kz-text-primary` | `textPrimary` | Headings, body text (≥ 4.5:1 on every surface) | `hsl(0 0% 96%)` | `hsl(240 6% 10%)` |
| `--kz-text-secondary` | `textSecondary` | Supporting text, labels (≥ 4.5:1 on every surface) | `hsl(240 4% 64%)` | `hsl(240 4% 41%)` |
| `--kz-text-muted` | `textMuted` | Metadata, placeholders, disabled (≥ 3:1 on every surface) | `hsl(240 4% 47%)` | `hsl(240 4% 52%)` |
| `--kz-text-on-media` | `textOnMedia` | Text on an image or a video | `hsl(0 0% 100%)` | = dark |
| `--kz-accent` | `accent` | Primary action, link, selection — the product's identity | `hsl(217 92% 53%)` | `hsl(217 92% 50%)` |
| `--kz-accent-hover` | `accentHover` | Accent on hover | `hsl(217 88% 45%)` | `hsl(217 88% 42%)` |
| `--kz-accent-soft` | `accentSoft` | Tinted background (selection, badge) | `hsl(217 92% 53% / 0.10)` | `hsl(217 92% 50% / 0.08)` |
| `--kz-accent-2` | `accent2` | Second accent (gradients) | → `accent` | → `accent` |
| `--kz-on-accent` | `onAccent` | Text and icon on the accent (≥ 4.5:1) | `hsl(0 0% 100%)` | = dark |
| `--kz-ring` | `ring` | Keyboard focus ring | → `accent` | → `accent` |
| `--kz-success` | `success` | Status: success | `hsl(160 84% 39%)` | = dark |
| `--kz-warning` | `warning` | Status: warning | `hsl(38 92% 50%)` | = dark |
| `--kz-danger` | `danger` | Status: error, destructive action | `hsl(0 84% 60%)` | = dark |
| `--kz-info` | `info` | Status: information | → `accent` | → `accent` |
| `--kz-scrim` | `scrim` | Veil behind a badge or a caption on an image | `hsl(0 0% 0% / 0.60)` | = dark |
| `--kz-scrim-strong` | `scrimStrong` | Stronger veil (long text on an image) | `hsl(0 0% 0% / 0.80)` | = dark |
| `--kz-overlay` | `overlay` | Dialog backdrop | `hsl(0 0% 0% / 0.70)` | = dark |

### Shape, depth, motion, type

| Token | Key | Usage | Dark | Light |
| :-- | :-- | :-- | :-- | :-- |
| `--kz-radius-sm` | `radiusSm` | Field, chip | `8px` | = dark |
| `--kz-radius-md` | `radiusMd` | Button, menu | `12px` | = dark |
| `--kz-radius-lg` | `radiusLg` | Card | `16px` | = dark |
| `--kz-radius-xl` | `radiusXl` | Dialog, sheet | `20px` | = dark |
| `--kz-radius-full` | `radiusFull` | Pill, avatar | `9999px` | = dark |
| `--kz-shadow-sm` | `shadowSm` | Field, button at rest (web only) | `0 1px 3px hsl(0 0% 0% / 0.12), 0 1px 2px hsl(0 0% 0% / 0.06)` | `0 1px 3px hsl(240 6% 0% / 0.06), 0 1px 2px hsl(240 6% 0% / 0.04)` |
| `--kz-shadow-md` | `shadowMd` | Menu, popover, card on hover (web only) | `0 4px 12px hsl(0 0% 0% / 0.15), 0 2px 4px hsl(0 0% 0% / 0.08)` | `0 4px 12px hsl(240 6% 0% / 0.08), 0 2px 4px hsl(240 6% 0% / 0.04)` |
| `--kz-shadow-lg` | `shadowLg` | Dialog, sheet (web only) | `0 8px 24px hsl(0 0% 0% / 0.18), 0 4px 8px hsl(0 0% 0% / 0.08)` | `0 8px 24px hsl(240 6% 0% / 0.10), 0 4px 8px hsl(240 6% 0% / 0.05)` |
| `--kz-ease` | `ease` | Default curve of the motion signature | `cubic-bezier(0.16, 1, 0.3, 1)` | = dark |
| `--kz-font-sans` | `fontSans` | Interface and running text | `Inter, system-ui, sans-serif` | = dark |
| `--kz-font-display` | `fontDisplay` | Headings; a product theme may override it | → `font-sans` | → `font-sans` |
| `--kz-font-mono` | `fontMono` | Code, aligned amounts | `"JetBrains Mono", ui-monospace, monospace` | = dark |

Contrast is **tested**, not assumed: `pnpm turbo run check` fails if `text-primary` / `text-secondary` drop under 4.5:1 or
`text-muted` under 3:1 on any surface, or `on-accent` under 4.5:1 on the accent, in either theme (WCAG 2.x).
One trade-off is known: no blue can carry white text at 4.5:1 *and* be read at 4.5:1 as text on `surface-0`. The
accent favours white text on it; for body-size links on dark, pair the accent with an underline or use it at
≥ 18.66px bold (3:1).

## Add or change a token

1. **Source** — edit `src/tokens/<category>.tokens.json` (DTCG: `$type`, `$value`, `$description`).
   - `$value` is the **dark** value (the default); the **light** value goes in
     `"$extensions": { "com.krizaka": { "light": … } }`. No extension = the same value in both themes.
   - An alias is `"{group.token}"` (`"{accent.$root}"` for a group's own token); it compiles to `var(--kz-…)` and
     may not carry a light value — it follows its target.
   - The CSS name is the path joined with `-` (`text.on-media` → `--kz-text-on-media`), the JS key its camelCase
     (`textOnMedia`). Colours are `hsl()`; radii are `px` (the native output converts them to dp).
2. **Build** — `pnpm --filter @krizaka/tokens build` writes `dist/` (never edit `dist/`), then
   `pnpm --filter @krizaka/tokens test`: update the `tokens.css` snapshot only when the change is intended
   (`vitest run -u`), and keep the contrast tests green.
3. **Changeset** — `pnpm changeset`: a new token is a **minor**, a changed value at least a **minor** (it changes
   every product), a removed or renamed token a **major**. `@krizaka/tokens` and `@krizaka/ui` are released together
   (`fixed` group).

## License

[Apache-2.0](LICENSE)
