# The Krizaka brand system

One identity for the parent and its products: **one colour per brand**, one family of marks, one icon language, one
typography (§5) and one visual language for pages. The values live in `src/brands/<id>.brand.json` (DTCG) and ship as
`@krizaka/tokens/brands/<id>.css`, `brands` (web, raw CSS) and `brands` (`@krizaka/tokens/native`, ThemeProvider
overrides). A product never re-invents its values: it imports its brand.

## 1. Colours — one per brand

| Brand | Identity | Why |
| :-- | :-- | :-- |
| **Krizaka** (parent) | **Ink + Krizaka blue.** The neutral surfaces and text of the platform carry the brand; one blue, the core of the Krizaka mark, is the only accent. | The parent frames its products without competing with them: ink is neutral next to orange and violet, and blue is the complement of the Orazaka orange. It is also the platform default (`tokens.css` = the Krizaka brand). |
| **Orazaka** (sovereign AI) | **Orange**, hue 26 — the accent and the mark share it. | Hue 38 (amber) is `--kz-warning`: a primary button, and since 2.1.0 the mark, must never read as a warning. The light theme's accent is the deep orange `#b45309`, also the first stop of the mark. `info` stays blue (an orange "info" would read as a warning). |
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
| `accent-2` | = accent | = accent | #f59e0b (closes the buttons' gradient) | `hsl(32 95% 33%)` | #db2777 | #db2777 |
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
| Orazaka | Three **solid** hexagonal shards in the brand's orange gradient, orbiting a core. | Before: two grey outlines and one amber, 3.5-unit strokes — the mark read grey and thin next to Orochia. Same idea, now solid, with the family's crop. **2.1.0:** amber (`#b45309 → #f59e0b`, hues 26 → 38) becomes the brand's orange — deep orange `hsl(26 90.5% 37.1%)` #b45309 → orange `hsl(26 92% 45%)` #dc6509, one hue: the old light stop was the warning's hue and read at 2:1 on a light page; every stop now reads ≥ 3:1 on surfaces 0–2 in dark and light (a test). |
| Orochia | The serpent coiled into an "O" around the flame. | Unchanged. |

Web: `KrizakaLogo`, `OrazakaLogo`, `OrochiaLogo`, `ProductLogo id` (`@krizaka/ui`). Native: `KrizakaMark`,
`OrazakaMark`, `OrochiaMark`, `ProductMark id` (`@krizaka/ui/native`). The geometry is shared
(`packages/ui/src/marks/*-geometry.ts`); the emblem gradients are **brand tokens** — `$extensions["com.krizaka"].mark` of
each `src/brands/<id>.brand.json`, exported as `marks.<id>` (`@krizaka/tokens`, `/native`) — read by the geometry, never
copied. A mark is the same in both themes: its stops are chosen to read on dark and light pages.

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
  into the page. One hero object per page, two or three satellites, no stock 3D. `@krizaka/ui/iso` draws them
  (`IsoHub` from data, or its primitives): stages that stack at the entrance, a dome that breathes, light that flows.
- **Depth of field**: a foreground element blurred (`media`, 18 px) between the reader and the content; the subject
  stays sharp. Never blur text.
- **Slow motion**: the light drifts over 40 s, marks turn over 30–35 s, reveals rise once (`[data-reveal]`). Nothing
  loops fast; everything stops under `prefers-reduced-motion`.
- **Text on these backgrounds** uses the text roles (`text-fg`, `text-fg-secondary`, `text-fg-accent`): AA is tested
  on every gradient stop, in both themes.

## 5. Typography — three families, one voice

`@krizaka/fonts` (2026-10, session TY) ships them, self-hosted; `@krizaka/tokens` names them (`--kz-font-display`,
`--kz-font-text` = `--kz-font-sans`, `--kz-font-mono`) and sets the scale (`type.*` → `text-display-xl`, `text-body-md`…
in `@krizaka/tailwind`, `typeScale` in `/native`). Only faces under the **SIL Open Font License 1.1**: redistributable,
bundled in apps, subset by us (no Reserved Font Name on any of the three).

| Role | Family | Why this one |
| :-- | :-- | :-- |
| **Display** — headlines, figures, names | **Plus Jakarta Sans** (500–800) | Already the headline face of krizaka.com — no gratuitous change to the parent brand. Compact, slightly squared bowls and flat terminals: it echoes the cut corners of the marks and icons, and stays dense and premium at 800. |
| **Text** — reading and interface | **Inter** (400–700, cut at the text optical size) | Drawn for screens: tall x-height, open apertures, tabular figures for amounts. Already the default of the tokens and Orazaka's text; krizaka.com's body already asked for its character variants (`cv02`–`cv04`). |
| **Mono** — code, identifiers, overlines | **JetBrains Mono** (400–700) | Already on every Krizaka surface. Unambiguous 0/O and 1/l/I at 12 px; rectangular forms that sit next to the chamfers. |

What we weighed:

- **Continuity first.** The inventory (krizaka.com: Jakarta + JetBrains Mono; Orochia: Jakarta text + Outfit display;
  Orazaka: Inter + Outfit as a stand-in "Krizaka Display" + JetBrains Mono; the tokens: Inter; the mobile apps: system
  faces) has three faces in common use. The decision keeps all three and gives each one job, so every surface moves by
  one role at most: krizaka.com changes its body (Jakarta → Inter), Orazaka its headlines (Outfit → Jakarta), Orochia its
  body (Jakarta → Inter) — and **keeps Outfit as its product display face**, a theme override of `--kz-font-display`
  like its violet.
- **Outfit as the Krizaka display** was the alternative: rounder and friendlier, it reads as Orochia's voice, and moving
  the parent's headlines to it is the visible change we wanted to avoid.
- **Screen and French.** Every file covers latin and latin-ext (é è à ç ô œ « » ’ — French is in the latin file; the
  browser fetches latin-ext only when a page needs it). Each family has a local fallback whose metrics are adjusted to
  it (`… Fallback`, size-adjust and ascent/descent overrides): the text does not move when the font arrives (CLS 0).

**Signature.** The Krizaka signature in type is the **wordmark**, drawn, inside the logo (`KrizakaLogo`) — never the name
set in a font. No typeface is drawn from scratch: a cut-corner stylistic set (a chamfered `K`, `z`, `a` as alternates
of the display face, under the OFL as a modified version with its own name) is a foundry project for later, tracked as
an issue, not a dependency of anything today.

Rules (also `rules` of `@krizaka/fonts`, on krizaka.com/docs/ui/typography): display speaks, text reads, mono labels;
display from 20 px at 600–800, text from 12 px at 400–700; one display line per block; tabular figures for amounts; the
scale, not one-off sizes; products may override the display role only.

