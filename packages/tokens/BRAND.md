# The Krizaka brand system

One identity for the parent and its products: **one colour per brand**, one family of marks, one icon language and one
visual language for pages. The values live in `src/brands/<id>.brand.json` (DTCG) and ship as
`@krizaka/tokens/brands/<id>.css`, `brands` (web, raw CSS) and `brands` (`@krizaka/tokens/native`, ThemeProvider
overrides). A product never re-invents its values: it imports its brand.

## 1. Colours — one per brand

| Brand | Identity | Why |
| :-- | :-- | :-- |
| **Krizaka** (parent) | **Ink + Krizaka blue.** The neutral surfaces and text of the platform carry the brand; one blue, the core of the Krizaka mark, is the only accent. | The parent frames its products without competing with them: ink is neutral next to orange and violet, and blue is the complement of the Orazaka orange. It is also the platform default (`tokens.css` = the Krizaka brand). |
| **Orazaka** (sovereign AI) | **Orange**, taken from its own mark: the gradient `#f59e0b → #b45309` (hues 38 → 26). | The accent sits at hue 26 — the *orange* end of the mark, not its amber end: hue 38 is `--kz-warning`, and a primary button must never read as a warning. The light theme uses the mark's deep stop **exactly** (`#b45309`). `info` stays blue (an orange "info" would read as a warning). |
| **Orochia** (creators) | **Velvet violet → magenta**, the serpent of its mark (unchanged). | The values of `@krizaka/orochia-design-system`, already adjusted to AA. |

### Palette (the accent family)

`on-accent` is the text and icon colour on the accent; `accent-text` is the accent **as text** (links, active labels),
≥ 4.5:1 on every surface; `accent-2` closes gradients.

| Role | Krizaka dark | Krizaka light | Orazaka dark | Orazaka light | Orochia dark | Orochia light |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| `accent` | `hsl(217 92% 53%)` #196df5 | `hsl(217 92% 50%)` #0a64f5 | `hsl(26 92% 55%)` #f67e23 | `hsl(26 90.5% 37.1%)` #b45309 | #7c3aed | #7c3aed |
| `accent-hover` | `hsl(217 88% 45%)` | `hsl(217 88% 42%)` | `hsl(26 92% 62%)` (lightens) | `hsl(26 90% 31%)` | #6d28d9 | #6d28d9 |
| `on-accent` | white (4.6:1) | white (5.1:1) | near-black `hsl(240 6% 5%)` (7.4:1) | white (5.1:1) | white (5.7:1) | white (5.7:1) |
| `accent-text` | `hsl(217 92% 68%)` #629cf8 | `hsl(217 92% 42%)` #0954ce | `hsl(26 92% 60%)` #f78c3b | `hsl(26 90% 32%)` #9b4808 | #a78bfa | #6d28d9 |
| `accent-2` | = accent | = accent | #f59e0b (the mark's light stop) | `hsl(32 95% 33%)` | #db2777 | #db2777 |
| `ring` | = accent | = accent | = accent | = accent | #a78bfa | #7c3aed |
| `info` | = accent | = accent | `hsl(217 92% 60%)` | `hsl(217 92% 50%)` | = accent | = accent |

Every pair is a test (`test/tokens.test.ts`, "brands"): `on-accent` ≥ 4.5:1 on `accent`, `accent-hover` and
`accent-2`; `accent-text` ≥ 4.5:1 on surfaces 0–3 and on every section-gradient stop; `ring` ≥ 3:1 on the page;
`text-primary` / `text-secondary` ≥ 4.5:1 on every section-gradient stop — in dark **and** light.

### Use

```css
/* A product app: its brand on the whole app, both themes. */
@import "tailwindcss";
@import "@krizaka/tailwind";
@import "@krizaka/tokens/brands/orazaka.css";
```

```tsx
// A page that shows several brands (krizaka.com, the catalogue): the scoped classes.
import "@krizaka/tokens/brands/scoped.css";
<section className="brand-orochia">…</section>

// React Native
import { brands } from "@krizaka/tokens/native";
<ThemeProvider overrides={brands.orazaka}>…</ThemeProvider>
```

Utilities (`@krizaka/tailwind`): `bg-accent`, `text-on-accent`, `text-fg-accent` (accent as text — use it, not
`text-accent`, for words), `from-brand-from via-brand-via to-brand-to`.

## 2. Marks — one family

The Orochia mark is the reference and does not change. Krizaka and Orazaka take its grammar (2.0.0-beta.5; before and
after in Storybook, *Brand/Evolution*):

- a **400 × 400** frame, a **dashed orbit** (r 160) that turns, a **ring** (r 134), a halo in the brand colour;
- **one bold emblem** (stroke 22 or solid shapes of the same weight) drawn as an *open* figure;
- a **bright core** (Orochia's flame and eye, Krizaka's blue core and node, Orazaka's core) that breathes;
- below **48 px** the view box crops to the emblem and the halo is dropped (navigation, tab bars).

| Mark | Emblem | Change and reason |
| :-- | :-- | :-- |
| Krizaka | An **ink** hexagonal shield, open at its upper-right vertex where a **blue node** breaks out, around a blue core. | Before: hairline strokes and five hard-coded blues that vanished below 48 px and did not crop. Now the weight, crop and grammar of Orochia; ink + one blue, the brand palette. |
| Orazaka | Three **solid** hexagonal shards in the mark's own orange gradient, orbiting a core. | Before: two grey outlines and one amber, 3.5-unit strokes — the mark read grey and thin next to Orochia. Same idea and colours, now solid, all orange, with the family's crop. |
| Orochia | The serpent coiled into an "O" around the flame. | Unchanged. |

Web: `KrizakaLogo`, `OrazakaLogo`, `OrochiaLogo`, `ProductLogo id` (`@krizaka/ui`). Native: `KrizakaMark`,
`OrazakaMark`, `OrochiaMark`, `ProductMark id` (`@krizaka/ui/native`). The geometry is shared
(`packages/ui/src/marks/*-geometry.ts`) and its colours are tested against the brand themes.

## 3. Icons — the signature

`@krizaka/icons` (see its README): a 24 grid, a 1.75 stroke, round caps; **cut corners** (45° chamfers) where other
sets round them — the angle of the hexagon; and on every product icon a **node**, the core of the marks, that can
carry the brand accent (`nodeColor="var(--kz-accent)"`). Utility glyphs (arrows, close, plus, check, menu) stay bare.

## 4. Visual language for pages

What M2/M3/M4 (the homes of Orochia, Orazaka and krizaka.com) apply. Restrained, premium: depth and light, not noise.

- **Sections glide from one temperature to the next.** Each section's background is the brand's section gradient
  (`--kz-brand-gradient-from → via → to`), tinted at the top and ending on the page surface, so the next section starts
  where the previous one stopped. Alternate `direction="down"` / `"up"` and brands (`.brand-<id>` on krizaka.com) to
  give each part of a page its own temperature. Wide, soft gradients only — never a hard band.
  `SectionBackdrop` (`@krizaka/ui/section-backdrop`) does it.
- **A light dome over the hero**: a blurred ellipse of the accent above the content (`dome`, on by default).
- **Luminous isometric illustrations**, original: objects built from our own vocabulary — the icons' cut-corner
  shapes, the marks' hexagons and nodes, the chat bubble — extruded in isometric projection, lit from inside in the
  brand colour (a core that glows, edges in `accent-text`), standing on a **perspective grid** (`grid`) that fades
  into the page. One hero object per page, two or three satellites, no stock 3D.
- **Depth of field**: a foreground element blurred (`media`, 18 px) between the reader and the content; the subject
  stays sharp. Never blur text.
- **Slow motion**: the light drifts over 40 s, marks turn over 30–35 s, reveals rise once (`[data-reveal]`). Nothing
  loops fast; everything stops under `prefers-reduced-motion`.
- **Text on these backgrounds** uses the text roles (`text-fg`, `text-fg-secondary`, `text-fg-accent`): AA is tested
  on every gradient stop, in both themes.
