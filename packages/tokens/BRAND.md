# The Krizaka brand system

One identity for the parent and its products: **one colour per brand**, one family of marks, one icon language, one
typography (§5) and one visual language for pages. The values live in `src/brands/<id>.brand.json` (DTCG) and ship as
`@krizaka/tokens/brands/<id>.css`, `brands` (web, raw CSS) and `brands` (`@krizaka/tokens/native`, ThemeProvider
overrides). A product never re-invents its values: it imports its brand.

## 1. Colours — one per brand

| Brand | Identity | Why |
| :-- | :-- | :-- |
| **Krizaka** (parent) | **Ink + Krizaka steel blue** (hue 208, saturation ≤ 60 %). The neutral surfaces and text of the platform carry the brand; one muted steel blue, the core of the Krizaka mark, is the only accent. | The parent frames its products without competing with them: ink is neutral next to orange and violet, and the steel sits at 182° from the Orazaka orange (26), its exact complement. It replaced the saturated electric blue (hue 217, 92 %) of every AI product in 3.31 (krizaka-ui#393, [ADR-003](../../docs/adr/ADR-003-steel-blue-and-quiet-surfaces.md)). It is also the platform default (`tokens.css` = the Krizaka brand). |
| **Orazaka** (sovereign AI) | **Orange**, hue 26 — the accent and the mark share it. | Hue 38 (amber) is `--kz-warning`: a primary button, and since 2.1.0 the mark, must never read as a warning. The light theme's accent is the deep orange `#b45309`, also the first stop of the mark. `info` stays blue (an orange "info" would read as a warning). |
| **Orochia** (creators) | **Velvet violet → magenta**, the serpent of its mark (unchanged). | The values of `@krizaka/orochia-design-system`, already adjusted to AA. |
| **Yasakia** (dating, talk first) | **Emerald → turquoise.** The accent is the turquoise (hue 174); the emerald (hue 152–156) is the mark's first stop and `accent-2`. | Green is the family's free colour and takes the opposite view of the red and pink of dating apps. `--kz-success` is emerald (hue 160): a primary button must never read as a success, so the accent sits 14° away on the turquoise (a test) and the emerald stays in the mark and the gradients. Dark: light turquoise under near-black text (11:1); light: deep turquoise under white (5.9:1). `info` stays blue. |
| **Yororis** (a listening space) | **Sand → sage.** A warm neutral that slides into a soft grey green: calm. The accent is the sage (hue 98–100); the sand (hue 34–36) is the mark's first stop, the core's light and `accent-2`. | Apart from every other brand (Yasakia's emerald and turquoise, the blue, the orange, the violet) and from every status: the sage sits ≥ 60° from `--kz-success` (160) and `--kz-warning` (38). The sand shares the warning's hue family, so it is told apart by its chroma — at most half the warning's saturation (≤ 40 % vs 92 %, a test) — and it never fills a primary button alone. Dark: light sage under near-black text (8.6:1); light: deep sage under white (6.9:1). `info` stays blue. |
| **Yomizaka** (documents, read and checked) | **Ink indigo** (藍, *ai*): the colour of writing and reading, a blue that leans to violet. The accent is the indigo (hue 240–242); the ink blue (hue 232) is the mark's first stop and `accent-2`. | The wheel is full, so the indigo is placed by test: ≥ 20° from the Krizaka steel (208) and from the Orochia violet (262, vivid), ≥ 60° from every other brand and every status. Dark: periwinkle under near-black text (6.3:1); light: deep indigo under white (8.7:1). `info` stays the Krizaka blue. |
| **Kachizaka** (predictions among friends, points only) | **Electric cobalt + victorious gold.** The **gold** (hue 48) carries the accent — the only gold of the family; the cobalt (hue 226) is `accent-2`, the section ground, the light theme's accent text and focus ring. | The cobalt alone sits close to the Krizaka steel (208: Δh 18°) — so it never leads; the pair does. Gold: ≥ 10° from warning (38), ≥ 20° from every brand accent (Orazaka 26 → 22°). Near-black text on gold and on cobalt in both themes (12.9:1 / 11.6:1 on the accent). `info` stays the Krizaka blue. |
| **Akinaza** (the shop OS, Québec) | **Laurentian forest green + warm copper.** The green (hue 130) carries the accent; the copper (hue 20–22, saturation ≤ 62 %) is `accent-2` and the mark's end. | Green ≥ 20° from Yororis' sage (98), Yasakia's emerald (152), success (160) and every accent. The copper sits 4–6° from Orazaka's orange but is a matte metal (≤ 65 % vs ≥ 90 %, a test) and never stands alone. Dark: light green under near-black (8.9:1); light: deep green under white (6.7:1). |

### Palette (the accent family)

`on-accent` is the text and icon colour on the accent; `accent-text` is the accent **as text** (links, active labels),
≥ 4.5:1 on every surface; `accent-2` closes gradients.

| Role | Krizaka dark | Krizaka light | Orazaka dark | Orazaka light | Orochia dark | Orochia light | Yasakia dark | Yasakia light |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| `accent` | `hsl(208 46% 45%)` #3e76a8 | `hsl(208 54% 36%)` #2a5e8d | `hsl(26 92% 55%)` #f67e23 | `hsl(26 90.5% 37.1%)` #b45309 | #7c3aed | #7c3aed | `hsl(174 72% 50%)` #24dbc9 | `hsl(175 85% 24%)` #097169 |
| `accent-hover` | `hsl(208 48% 39%)` | `hsl(208 58% 29%)` | `hsl(26 92% 62%)` (lightens) | `hsl(26 90% 31%)` | #6d28d9 | #6d28d9 | `hsl(174 72% 58%)` (lightens) | `hsl(175 85% 20%)` |
| `on-accent` | white (4.8:1) | white (6.7:1) | near-black `hsl(240 6% 5%)` (7.4:1) | white (5.1:1) | white (5.7:1) | white (5.7:1) | near-black (11.2:1) | white (5.9:1) |
| `accent-text` | `hsl(206 58% 72%)` #8ebde1 | `hsl(208 54% 33%)` #275782 | `hsl(26 92% 60%)` #f78c3b | `hsl(26 90% 32%)` #9b4808 | #a78bfa | #6d28d9 | `hsl(174 72% 56%)` #3ee0cf | `hsl(175 85% 23%)` #096d64 |
| `accent-2` | = accent | = accent | #f59e0b (closes the buttons' gradient) | `hsl(32 95% 33%)` | #db2777 | #db2777 | emerald `hsl(152 70% 45%)` #22c378 | `hsl(152 76% 26%)` #107546 |
| `ring` | = accent | = accent | = accent | = accent | #a78bfa | #7c3aed | = accent | = accent |
| `info` | = accent | = accent | `hsl(207 50% 58%)` | `hsl(208 54% 36%)` | = accent | = accent | `hsl(207 50% 58%)` | `hsl(208 54% 36%)` |

Yororis (a table of its own so the row above stays readable):

| Role | Yororis dark | Yororis light |
| :-- | :-- | :-- |
| `accent` | `hsl(98 24% 62%)` #98b587 | `hsl(100 28% 30%)` #456237 |
| `accent-hover` | `hsl(98 26% 70%)` (lightens) | `hsl(100 30% 25%)` |
| `on-accent` | near-black (8.6:1) | white (6.9:1) |
| `accent-text` | `hsl(98 28% 68%)` #a7c497 | `hsl(100 28% 28%)` #415b33 |
| `accent-2` | sand `hsl(36 38% 62%)` #c3a579 | `hsl(34 38% 33%)` #745834 |
| `ring` | = accent | = accent |
| `info` | `hsl(207 50% 58%)` | `hsl(208 54% 36%)` |

Yomizaka:

| Role | Yomizaka dark | Yomizaka light |
| :-- | :-- | :-- |
| `accent` | `hsl(240 80% 74%)` #8888f2 | `hsl(242 52% 46%)` #3c38b2 |
| `accent-hover` | `hsl(240 82% 80%)` (lightens) | `hsl(242 55% 40%)` |
| `on-accent` | near-black (6.3:1) | white (8.7:1) |
| `accent-text` | `hsl(240 85% 78%)` #9797f7 | `hsl(242 52% 44%)` #3a36ab |
| `accent-2` | ink `hsl(232 72% 74%)` #8d9aec | `hsl(232 56% 40%)` #2d3c9f |
| `ring` | = accent | = accent |
| `info` | `hsl(207 50% 58%)` | `hsl(208 54% 36%)` |

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
| Yasakia | **One conversation**: one **solid** speech bubble with a tail on each side — the conversation belongs to both people, talk first — and the **spark** inside it, a diamond of light, that breathes. The tails are turned 180° about the centre: symmetric by rotation, never by mirror, so the mark can never read as a face. One node rides the orbit. | New (3rd product, 2026-10). Emerald `hsl(156 92% 32%)` #079d61 → turquoise `hsl(178 90% 32%)` #089b96, every stop ≥ 3:1 on surfaces 0–2 in dark and light (a test). **2026-10-17:** the two overlapping bubbles (2.9) read as a cat's face (two ears); replaced after a review of three directions per brand (`company/orchestration/refs/logos-2026-10-17`). |
| Yororis | **Held**: two open hands — two **sage** arcs of one circle at the family stroke — cup a warm **sand** core without closing on it: held, given room, free to go. One node, the moment, rides the dashed orbit — it comes round, then it goes. The slowest breath of the family (4.2 s). | New (4th product, 2026-10). Sand `hsl(34 46% 44%)` #a4773d and sage `hsl(104 28% 42%)` #5d894d, each ≥ 3:1 on surfaces 0–2 in dark and light (a test). **2026-10-17:** the two leaves and a stem gave way to the hands alone, the two colours kept apart rather than blended. |
| Yomizaka | **The watch**: the owl — the bird that reads documents and knows faces — as two lenses at the family stroke under **one calm brow** (two soft curves, never a sharp V: attentive, not stern), its pupils glancing down the line it reads; the pupils are the lit cores and breathe. One node, a page, rides the orbit. | New (5th product, 2026-10). Ink `hsl(232 50% 55%)` #5362c6 → indigo `hsl(248 50% 58%)` #6d5ec9, every stop ≥ 3:1 on surfaces 0–2 in dark and light (a test). **2026-10-17:** the page and magnifier (clip-art) gave way to the owl. |
| Kachizaka | **The podium**: three **solid** steps, their outer corners wearing the Krizaka cut, the winner in **gold** and the others in **cobalt**, under a gold diamond — the family's lit node — that breathes: a friendly leaderboard where only points change hands. One node, the ball, rides the orbit. | New (2026-10). Cobalt `hsl(226 80% 56%)` and gold `hsl(44 92% 33%)`, each ≥ 3:1 on surfaces 0–2 in dark and light (a test), **kept apart** (blended, cobalt → gold turns grey). Mascot: **the magpie** — it keeps the score. **2026-10-17:** the trophy gave way to the podium. |
| Akinaza | **The cut log**: a **solid** forest-green log seen end-on, its year rings in light, cut at 45° by the beaver — the cut is the Krizaka chamfer, its fresh face in **copper** — and a copper heart that breathes: a shop built ring by ring. One node, a coin, rides the orbit. | New (2026-10). Forest `hsl(140 48% 34%)` and copper `hsl(22 60% 46%)`, each ≥ 3:1 on surfaces 0–2 in dark and light (a test), kept apart. Mascot: **the beaver**, the artisan. **2026-10-17:** the shop front (awning, windows, door) gave way to the cut log. |

**`WuSamaMark`** (web, `@krizaka/ui`) is not a product's mark but the founder's byline mark — Oussama's nickname, Wu-sama: a gold W of five straight legs inside the Krizaka hexagon, split at its top and bottom vertices, a small ink node at the middle summit. It is **an original mark, inspired by, not derived from** the culture its name nods to: built from the hexagon's own measures (`wu-sama-geometry.ts`, with tests that pin them), never from the Wu-Tang Clan's registered logo (no bat-wing W, no curve, no black-and-yellow copy). Ink on the host's text role, one fixed mid-tone amber `hsl(40 94% 37%)` (≥ 3:1 on both themes' surfaces), no motion. The company and the official accounts keep `KrizakaLogo`.

Web: `KrizakaLogo`, `OrazakaLogo`, `OrochiaLogo`, `YasakiaLogo`, `YororisLogo`, `YomizakaLogo`, `KachizakaLogo`, `AkinazaLogo`, `ProductLogo id` (`@krizaka/ui`). Native: `KrizakaMark`,
`OrazakaMark`, `OrochiaMark`, `YasakiaMark`, `YororisMark`, `YomizakaMark`, `KachizakaMark`, `AkinazaMark`, `ProductMark id` (`@krizaka/ui/native`). The geometry is shared
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

Rules (also `rules` of `@krizaka/fonts`, on ui.krizaka.com/foundations/typography): display speaks, text reads, mono labels;
display from 20 px at 600–800, text from 12 px at 400–700; one display line per block; tabular figures for amounts; the
scale, not one-off sizes; products may override the display role only.


## 6. Surfaces & materials — the signature of the components

Session DSV (2026-10). The primitives had the right roles but read flat and interchangeable. The Krizaka signature is
one idea, applied everywhere and always in tokens: **light comes from above.**

| Lever | Rule | Tokens → utilities |
| :-- | :-- | :-- |
| **What you press rises** | A raised surface (button, card, chip, key, the active segment) carries a **sheen** — its top a little lighter — a **1-px edge of light** along its top, and an **ink-tinted shadow** in two or three layers. | `--kz-surface-sheen`, `--kz-edge-light`, `--kz-shadow-raised` → `bg-sheen inset-shadow-edge shadow-raised` |
| **What you fill sinks** | A field, a track, a checkbox is a **well**: an inner shade at its top. | `--kz-edge-well` → `inset-shadow-well` |
| **What floats is glass** | Menus, popovers, tooltips, dialogs, toasts, the sticky header of a table: frosted glass at 88 % — the text stays AA over anything that passes under (tested against the page's own text). | `--kz-glass-*` → `glass shadow-floating` / `shadow-overlay` |
| **Only what acts glows** | The accent fill is lit along its top edge and shaded at its bottom (on-accent stays ≥ 4.5:1 there, tested in every brand) and sits on the **brand's glow** — composed where it is used, so a `.brand-<id>` section has its own. Selection, the checked box, the current page glow too; nothing else. | `--kz-fill-shade`, `--kz-edge-on-fill` → `bg-fill-shade inset-shadow-edge-fill shadow-glow` |
| **The node marks a state** | The core of the marks, a small lit diamond: a badge's dot, the chosen radio, the switch's thumb when on, today in a calendar, an error's mark. | `node`, `node-lit` |
| **The focus is the brand's ring** | A crisp ring of `--kz-ring`, 2 px off the element, in a halo of the same colour — it follows the corners, cut ones included. On a field it lies on the border. | `--kz-ring-*` → `focus-visible:focus-ring`, `focus-ring-inset` |
| **Motion answers the hand** | A short spring (`ease-spring`), never more than 200 ms: a press compresses (0.97), a toggle springs across, a check pops in. Under `prefers-reduced-motion` every duration is 0 ms: instant, never absent. | `--kz-ease-spring`, `--kz-duration-*` |
| **Type in three voices** | Display for titles (tracking tightened), text for reading, **mono for labels**: badges, table headers, menu labels, stat labels, weekdays. | `font-mono`, `tracking-[0.06em]` |
| **Density** | Comfortable by default; `data-density="compact"` on a subtree tightens every control (a console, a dense table). | `--kz-control-*` |
| **Status tints** | One tint per status, the primary text and the status text AA on it: badges, alerts, rows. A rail of the status colour that glows marks alerts and toasts. | `--kz-*-soft` |

Restraint is part of it: a page has one call to action in the accent; the rest is quiet material.

### 6.1 The griffe — the 45° cut corner, drawn, never on a control

The angle of the hexagon, the chamfer of the icons: **the cut corner is the claw mark of the brand** — in what is
*drawn*: the marks, the signature icons of `@krizaka/icons`, the isometric scenes, a mascot's frame. It is **not** on
the controls any more (krizaka-ui#393, [ADR-003](../../docs/adr/ADR-003-steel-blue-and-quiet-surfaces.md)): a chamfered
button read as a gimmick next to the products' own identities. A `Button` has one shape, an 8 px radius
(`--kz-radius-sm`, the radius of a field, so a button beside an input lines up), and `pill` on demand; `shape="cut"`
is a deprecated alias of it until 4.0. `--kz-cut-size` / `cut.size` (native) stay for a drawn shape that needs one.

### 6.2 The quiet hover

A hover changes **a colour, never a position** (krizaka-ui#393): a card's surface and hairline go one step up in
150 ms, a button takes its hover colour. Nothing lifts, scales, leans toward the pointer or lights up under it
(`PointerLight`, the spotlight, the sheen and `magnetic` are retired, deprecated no-ops until 4.0). The keyboard focus
is a 2 px ring of `--kz-ring`. The only things that still move under the pointer are an arrow leaning where it leads and
a tooltip sliding in. A test (`packages/ui/src/quiet-hover.test.ts`) refuses a hover that moves.

Captures of the material, the three brands in dark and light, are in the pull request that introduced it
(krizaka/krizaka-ui, "signature visual language"); the living reference is the showcase at the top of
[ui.krizaka.com](https://ui.krizaka.com).
