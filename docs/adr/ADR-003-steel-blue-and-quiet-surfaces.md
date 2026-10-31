# ADR-003 — A steel blue, one button shape, a quiet hover

- **Status:** accepted — 2026-10-20
- **Scope:** `@krizaka/tokens` (the Krizaka accent, its section gradient, every brand's `info`), `@krizaka/ui` (Button,
  the cards of the blocks, GlowCard, PointerLight, MotionObserver, motion.css, blocks.css, story.css), and every site
  and app of the family that consumes them
- **Issue:** [krizaka-ui#393](https://github.com/krizaka/krizaka-ui/issues/393) (P0, reported by Oussama)
- **Enforced by:** `packages/tokens/test/tokens.test.ts` (« gives Krizaka a steel blue »), `packages/ui/src/quiet-hover.test.ts`,
  the Button tests, and the hover check of the Storybook test runner (`apps/storybook/.storybook/test-runner.ts`)

## Context

Three things read as cheap on every Krizaka surface, said by the founder on 2026-10-20 as « a very irritating UI/UX bug
for our users »:

1. **The chamfered buttons** (`shape="cut"`, a 45° `corner-shape: bevel`) on every call to action. A gimmick: it made
   the most important control of a page look like a game's.
2. **The blue.** `hsl(217 92% 53%)` (`#196df5`): a saturated electric blue, the default accent of every AI product.
   Nothing in it said Krizaka.
3. **The hovers.** A light that followed the pointer over every card (`PointerLight`, `.kz-spotlight`, GlowCard's
   bloom), cards that rose 3–4 px with a coloured shadow, buttons that leaned toward the pointer (`magnetic`) and a
   sheen across them (`shimmer`). Decorative noise; it also made a grid of cards shimmer as the mouse crossed it.

The direction of the brand is « ultra premium = restrained and clean, not decorative ».

## Decision

### The blue: « Krizaka steel », hue 208

Five candidates were drawn as swatches and rendered on the real pages (www.krizaka.com's hero and products, the home of
ui.krizaka.com), in dark and light:

| | Dark accent | Light accent | Reading |
| :-- | :-- | :-- | :-- |
| 0 — current | `hsl(217 92% 53%)` #196df5 | `hsl(217 92% 50%)` | electric, « AI » |
| A — ink cobalt | `hsl(222 52% 50%)` | `hsl(222 56% 42%)` | deeper, still the generic blue |
| B — prussian steel | `hsl(206 44% 44%)` | `hsl(206 52% 34%)` | right in light, a little grey in dark |
| C — slate lake | `hsl(198 38% 40%)` | `hsl(198 48% 30%)` | distinctive but teal; a status could be confused |
| D — denim | `hsl(213 50% 48%)` | `hsl(213 56% 40%)` | pleasant, close to A |
| **E — steel (chosen)** | **`hsl(208 46% 45%)` #3e76a8** | **`hsl(208 54% 36%)` #2a5e8d** | B's restraint, enough light in dark |

![The candidates as swatches](https://krizaka-assets.b-cdn.net/pr-assets/krizaka-ui/kui-393-buttons-blue-hover/adr-003-swatches.png)
![On the real pages, dark](https://krizaka-assets.b-cdn.net/pr-assets/krizaka-ui/kui-393-buttons-blue-hover/adr-003-pages-dark.png)
![On the real pages, light](https://krizaka-assets.b-cdn.net/pr-assets/krizaka-ui/kui-393-buttons-blue-hover/adr-003-pages-light.png)

**Why E.** Hue 208 is the exact complement of the Orazaka orange (26 + 182): the parent still frames its products
without competing with them, now by construction. A saturation under 60 % turns « tech blue » into ink and steel, the
material of the shield in the mark. It stays a blue (the family recognises its parent), ≥ 20° from Yomizaka's indigo and
apart from a former product's violet; a former product's cobalt (226) still never leads alone.

| Role | Dark | Light |
| :-- | :-- | :-- |
| `accent` | `hsl(208 46% 45%)` — white on it 4.8:1 | `hsl(208 54% 36%)` — white 6.7:1 |
| `accent-hover` | `hsl(208 48% 39%)` | `hsl(208 58% 29%)` |
| `accent-text` | `hsl(206 58% 72%)` #8ebde1 | `hsl(208 54% 33%)` #275782 |
| `accent-soft` | 12 % of the accent | 8 % |
| `ring` | = accent (≥ 3:1 on surfaces 0–2) | = accent |
| section gradient | `hsl(210 30% 10%)` → `hsl(220 14% 7%)` | `hsl(208 36% 93%)` → `hsl(210 30% 97%)` |
| products' `info` | `hsl(207 50% 58%)` | `hsl(208 54% 36%)` |

The Krizaka mark follows (its node and core are `marks.krizaka` = accent → accent-text; its highlight `#ddeaf4`), so
the brand export (`tools/export-brand.mjs`) is re-run. The products' own colours (Orazaka orange, a former product violet,
the former products, Yomizaka, a former product, Akinaza) do not change.

### One button shape

An **8 px radius** (`--kz-radius-sm`, the radius of a field: a button beside an input lines up with it), the pill on
demand. The native Button already used `radius.sm`, so web and phone now match. `shape="cut"` is a **deprecated alias**
of the default (no breaking change) and warns once in development; it goes in 4.0.

`shimmer` and `magnetic` were gimmicks: both are **deprecated no-ops** (accepted and ignored) until 4.0. MotionObserver
no longer follows the pointer at all.

### A quiet hover

A hover changes **a colour, never a position**: a card's surface goes one step up (`surface-1 → surface-2`) and its
hairline strengthens (`border-default → border-strong`) in 150 ms; a button takes its hover colour. Nothing lifts,
scales or glows; no light follows the pointer. The keyboard focus is a 2 px ring of `--kz-ring` around the whole card.

- `PointerLight` / `usePointerLight`, `CardGrid light` and `hover`, `LinkCard hover`, `ArgumentCard hover`,
  `GlowCard glow="spotlight"`: deprecated no-ops until 4.0.
- GlowCard keeps a **still** hairline ring of the brand gradient (fuller with `alive`), never turning.
- Also quieted: `Card interactive`, ServiceCard, the image zoom of Card and MediaGallery, RadioGroup's key, the slider
  thumb (a ring instead of a scale), the video player's play button, the template collections, the isometric scenes and
  the story choices.
- What may still move under the pointer: an arrow leaning where it leads, a tooltip sliding in.

## Consequences

- One minor release (3.31.0) of `@krizaka/ui`, `tokens`, `tailwind`; every screenshot baseline under the Krizaka brand
  changes once.
- Every consumer bumps the three together and removes the local rules that re-add a chamfer, a lift or a pointer light
  (krizaka-com AGENTS.md §4/§4.1 is rewritten). `shape="cut"` in a consumer keeps working, with a warning in development.
- The 4.0 major removes `shape="cut"`, `shimmer`, `magnetic`, `PointerLight`, and the `hover` / `light` props.

## Refused

- **Keeping the chamfer only on the primary action** — the founder found it not beautiful, not just overused.
- **A violet or teal accent** — violet is a former product's; teal/green sits near a former product, Akinaza and the success status.
- **A hover that lifts by 1 px** — still movement; a grid of cards still shifts under a passing mouse.
