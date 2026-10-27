# ADR-007 — The shop composer: sections, variants and blocks as data, look presets, our own editor

- **Status:** proposed — 2026-10-26 (design lead, delegated; Oussama chooses between the open points at the end)
- **Scope:** `@krizaka/ui` (a new `shop` family of section entries, `@krizaka/ui/shop-composer`), `@krizaka/tokens`
  (the look presets as data), then Akinaza's public shop page and its studio (Boutique › Page)
- **Issue:** [akinaza#398](https://github.com/krizaka/akinaza/issues/398); library side
  [krizaka-ui#742](https://github.com/krizaka/krizaka-ui/issues/742)
- **Builds on:** ADR-001 (a third-party engine only behind a `@krizaka/*` facade), ADR-004 (the Cahier: paper and ink
  on the public pages), ADR-006 (§4 the themes as data, §7 the needs-driven rule, §8 demo data only)
- **Supersedes:** Akinaza's `docs/design/storefront-templates.md` §3–§6 (option C, templates as order + variants). Its
  idea survives: a template becomes a **starter document** plus a **preset** (§4 below).
- **Enforced by (to land with the slices):** `packages/ui/src/shop/schema.test.ts` (every document parses, every
  migration round-trips), `packages/ui/src/shop/catalogue.test.tsx` (every type × variant renders in both themes, at
  390 and 1440 px, with a fixed media box), `packages/tokens/test/shop-presets.test.ts` (AA on every preset × mode),
  Akinaza's `shop-page.media.test.ts` (no photo twice on a page)

## Context

Oussama, 2026-10-26, on the demo salon: the page does not make you want to book. The photos are too big, the same
photo comes back twice, the spacing is too large, and the page is not aligned with the rest. The old TV and the photo
wall are good; the photos and the shop can do much better. And two needs: the owner customises the page (which
sections, in what order, **how each one is drawn**), and the two demo shops become the showcase of Krizaka UI.

**Measured on dev.akinaza.com, 2026-10-26** (headless Chromium, 1440 × 900 and 390 × 844, dark and light):

| Finding | Salon Cèdre & Ciseaux | Pattes de Saint-Henri |
| :-- | :-- | :-- |
| Page height, desktop | 7,355 px (8.2 screens) | 6,750 px (7.5 screens) |
| Page height, phone | 10,695 px (**12.7 screens**) | 10,020 px (11.9 screens) |
| Services | 5 cards, each a 3:2 photo ≈ 270 × 180 px, list of inclusions, one card alone on a second row | 4 cards, same |
| Distinct photos / photo slots | **3 / 9**: the basin, the bottles and the tray repeat between the cards and « Pictures of the trade » | the gallery's first photo **is the salon's cover**; the two others are **screenshots of the app** |
| The cover | a rainy alley — the same picture as the dog walker's gallery | the skyline from Mont-Royal; no dog |
| Spacing | ~120 px of air above and below every section: the hours, one 60 px row, fill a 316 px band; the services 1,265 px | same |
| Alignment | headings share one edge, but the content does not: the hours sit in 36 rem, the wall in 60 % of the row with the TV floating beside it, the fifth service card alone on its row, the policies in a box beside a box | same |
| Data | « Camille » twice in the team; the hours row says « Closed » twice | — |
| Phone | the services section alone is 2,657 px (3.1 screens) | 2,130 px (2.5 screens) |

The cause is structural, not only visual: a page is a fixed `Storefront.tsx` whose sections each choose their own
width, rhythm and media; the shop's services all get a photo whether it has one or not (so the trade's defaults are
spent twice); and the owner can only reorder and hide. Option C of #261 (templates as order + variants) was the right
direction but stopped at a variant per section, without blocks, drafts or a look of its own.

What owners already know: Shopify's OS 2.0 themes (a page is a JSON template — `sections` keyed by id, an `order`, each
section a `type` with `settings`, its `blocks` and `block_order`, `disabled` to hide without losing; at most 25
sections and 50 blocks; a section is addable only if its schema has a preset). Puck (MIT, React) stores
`{ root, content, zones }` and lets an editor drop any registered component in any zone. Craft.js and GrapesJS are
general page builders, GrapesJS HTML-first.

## The mock-ups

Five compositions built with the published `@krizaka/ui` 3.63.1 (`CoverHero`, `OpeningHours`, `ReviewSummary` /
`ReviewCard`, `RetroTv`, `Wall` / `Polaroid` / `PinnedNote` / `ShopSign`, `TapedPhoto`, `Avatar`, `Badge`, `Button`,
`StickyAction`); `services · menu`, `booking · strip`, `hero · split`, `gallery · mosaic` / `filmstrip` and the presets are
prototyped there with tokens only, as U1 and U3 will ship them. Fictional shops, generated photos (no face, no text), no
photo twice on a page. Captures at 1440 × 900 and 390 × 844, full page:

| Composition | Preset · density | Desktop | Phone |
| :-- | :-- | :-- | :-- |
| Salon **compact** — poster, next free times, the menu beside the hours, filmstrip, reviews | Vitrine · compact | [dark](https://krizaka-assets.b-cdn.net/pr-assets/krizaka-ui/shop-adr/salon-compact-desktop-dark.webp) · [light](https://krizaka-assets.b-cdn.net/pr-assets/krizaka-ui/shop-adr/salon-compact-desktop-light.webp) | [dark](https://krizaka-assets.b-cdn.net/pr-assets/krizaka-ui/shop-adr/salon-compact-phone-dark.webp) · [light](https://krizaka-assets.b-cdn.net/pr-assets/krizaka-ui/shop-adr/salon-compact-phone-light.webp) · [first screen](https://krizaka-assets.b-cdn.net/pr-assets/krizaka-ui/shop-adr/salon-compact-phone-dark-first-screen.webp) |
| Salon **editorial** — split hero, the quote, the two-column menu, a 21:9 photo, visit | Atelier · airy | [dark](https://krizaka-assets.b-cdn.net/pr-assets/krizaka-ui/shop-adr/salon-editorial-desktop-dark.webp) · [light](https://krizaka-assets.b-cdn.net/pr-assets/krizaka-ui/shop-adr/salon-editorial-desktop-light.webp) | [dark](https://krizaka-assets.b-cdn.net/pr-assets/krizaka-ui/shop-adr/salon-editorial-phone-dark.webp) · [light](https://krizaka-assets.b-cdn.net/pr-assets/krizaka-ui/shop-adr/salon-editorial-phone-light.webp) |
| Salon **gallery** — the sign and the old TV, mosaic, the menu, the wall | Atelier · compact | [dark](https://krizaka-assets.b-cdn.net/pr-assets/krizaka-ui/shop-adr/salon-gallery-desktop-dark.webp) · [light](https://krizaka-assets.b-cdn.net/pr-assets/krizaka-ui/shop-adr/salon-gallery-desktop-light.webp) | [dark](https://krizaka-assets.b-cdn.net/pr-assets/krizaka-ui/shop-adr/salon-gallery-phone-dark.webp) · [light](https://krizaka-assets.b-cdn.net/pr-assets/krizaka-ui/shop-adr/salon-gallery-phone-light.webp) |
| Dog walker **route** — poster, the areas, the menu with free times, filmstrip | Canal · compact | [dark](https://krizaka-assets.b-cdn.net/pr-assets/krizaka-ui/shop-adr/pets-route-desktop-dark.webp) · [light](https://krizaka-assets.b-cdn.net/pr-assets/krizaka-ui/shop-adr/pets-route-desktop-light.webp) | [dark](https://krizaka-assets.b-cdn.net/pr-assets/krizaka-ui/shop-adr/pets-route-phone-dark.webp) · [light](https://krizaka-assets.b-cdn.net/pr-assets/krizaka-ui/shop-adr/pets-route-phone-light.webp) · [first screen](https://krizaka-assets.b-cdn.net/pr-assets/krizaka-ui/shop-adr/pets-route-phone-dark-first-screen.webp) |
| Dog walker **journal** — taped hero, the notebook wall, the menu, the TV with notes | Carnet · airy | [dark](https://krizaka-assets.b-cdn.net/pr-assets/krizaka-ui/shop-adr/pets-journal-desktop-dark.webp) · [light](https://krizaka-assets.b-cdn.net/pr-assets/krizaka-ui/shop-adr/pets-journal-desktop-light.webp) | [dark](https://krizaka-assets.b-cdn.net/pr-assets/krizaka-ui/shop-adr/pets-journal-phone-dark.webp) · [light](https://krizaka-assets.b-cdn.net/pr-assets/krizaka-ui/shop-adr/pets-journal-phone-light.webp) |

Before: [salon desktop](https://krizaka-assets.b-cdn.net/pr-assets/krizaka-ui/shop-adr/before-salon-desktop-dark.webp), [salon phone](https://krizaka-assets.b-cdn.net/pr-assets/krizaka-ui/shop-adr/before-salon-phone-dark.webp),
[dog walker desktop](https://krizaka-assets.b-cdn.net/pr-assets/krizaka-ui/shop-adr/before-pets-desktop-dark.webp). The compact salon is 2,169 px on a desktop (today 7,355) and
2,470 px on a phone, 2.9 screens (today 10,695, 12.7).

## Decision

**A shop page is a document, not code: an ordered list of sections, each a `type` × `variant` with its settings and its
blocks, drawn by `@krizaka/ui` sections inside one frame and one rhythm, dressed by a look preset that cannot break
contrast, edited in our own composer, published from a draft.**

| # | Question | Decision | Why |
| :-- | :-- | :-- | :-- |
| 1 | Model | Shopify's shape (sections → blocks, type · variant · settings, disabled), **typed in zod**, versioned, references not copies | Owners know it; it is data the admin and the tests can read; no code per shop |
| 2 | Freedom | **Composition, not page building**: a fixed catalogue, one level of blocks, bounded counts, no free CSS, no free colour | Akinaza's UX_DECISIONS already refuses « arbitrary page building »; a salon page must stay a page that sells |
| 3 | Catalogue | 13 section types, 2–4 variants each, all in `@krizaka/ui/shop` (§3); **services · `menu`** (the compact price board) is the default | One author per section; every product's public page can reuse it |
| 4 | Look | **Presets as data** in `@krizaka/tokens` (accent, faces, paper, density, photo grade), two per trade; the visitor's dark/light still applies | AA is proven once per preset × mode, never per shop |
| 5 | Editor | **Our own composer on `@krizaka/ui`**; Puck not adopted (§5) | The model is a list, not a canvas; Puck brings a free canvas, 36 dependencies and a skin we would have to fight |
| 6 | Media | One ratio per variant, a fixed box, the right `sizes`; **a photo appears once per page**; a service without its own photo shows none in the menu; ≥ 12 distinct defaults per trade | The three findings of the critique |
| 7 | Lifecycle | One draft, many published versions, rollback, every write audited | The owner experiments without breaking the live page |

### 1. The model

```ts
// @krizaka/ui/shop — schema.ts (zod; the types are inferred, the product stores the JSON)
type ShopPage = {
  schema: 1;                       // the document's format; migrations are pure functions schema n → n+1
  preset: PresetRef;               // { id: "salon-atelier", version: 1 } (§4); the visitor's mode is not stored
  density?: "compact" | "airy";    // overrides the preset's
  sections: Section[];             // ordered; 1 ≤ n ≤ 16; at most one hero, always first
};
type Section = {
  key: string;                     // stable, generated (« s_8f2c »), survives reorder, the audit's anchor
  type: SectionType;               // "hero" | "services" | "gallery" | … (§3)
  variant: string;                 // checked against the type's variants
  disabled?: boolean;              // hidden, kept, still editable (Shopify's `disabled`)
  settings: Record<string, unknown>;   // validated by the type's own zod schema (`defineSection`)
  text?: Partial<Record<"title" | "lead", LocalizedText>>; // the owner's words, { fr, en }; absent = the product's message
  blocks?: Block[];                // ordered; at most 24; only the block types the section allows
};
type Block = { key: string; type: string; settings: Record<string, unknown>; text?: Record<string, LocalizedText> };
```

- **References, not copies.** A services section holds `{ source: "all" | "pick", ids?: ServiceId[], groupBy:
  "category" | "none" }`, never a price; a gallery holds media ids; a reviews section holds a rule (`best` · `latest`,
  `count`). The product resolves them at render; a changed price is changed everywhere.
- **Content stays the shop's.** No text lives in a section type or a preset. Owner words are `{ fr, en }` with the
  product's message as fallback (the page never shows an empty heading).
- **The schema lives in `@krizaka/ui/shop`** (`shopPageSchema`, `defineSection({ type, variants, settings, blocks,
  limits })`, `migrateShopPage`), because the renderer and the validator must agree; the **storage is the product's**.
- **Akinaza's storage** (slice A1): `shop_page_versions (id, shop_id, doc jsonb, schema int, status
  'draft' | 'published' | 'archived', based_on, created_by, created_at, published_at)`, at most one draft per shop
  (partial unique index), `shop_page.published_version_id` the pointer the public page reads (one indexed read);
  publish = validate, copy the draft into a new published row, move the pointer, archive beyond the last 20;
  rollback = publish an archived row again. The document is parsed **on write** (a route refuses an invalid one, 422
  with the path) and **on read** (an old schema is migrated in memory, then written back on the next save).
- **Audit:** every save, publish, rollback and preset change writes `audit_log` with the shop, the actor, the action and
  the section keys touched (not the whole document); `shop.page.updated` keeps reaching the open storefronts and the
  studio's preview.
- **Existing pages migrate**, they do not change: `shop_page.sections` + `template_id` become a first published
  document that renders the same order and today's variants (`services · cards`, `gallery · grid`); a test renders
  every demo and a sample of real rows before and after and compares the section order.

### 2. The frame and the rhythm (the critique's « not aligned »)

- Every section draws inside the page frame of the language: `--kz-page-max` (72 rem) between `--kz-page-gutter`; a
  section may be `bleed` (a full-width photo, a strip) but its heading and its text stay on the frame's edges. The hero's
  text uses the same left edge as every heading below.
- **One rhythm per page, set by density:** `compact` 40 px between sections (24 on a phone), `airy` 64 px (40);
  heading to content 16 px; a hairline between sections, never a box in a box. No section sets its own margin.
- A section with nothing to show is not drawn (today's rule), and the composer says why (« No reviews yet: the section
  appears after 5 verified reviews »).
- Budget: a compact page reads on **≤ 5 phone screens** with five services and five photos (the critique's salon is 12.7).

### 3. The catalogue

All in `@krizaka/ui/shop` (one entry per section type, server components, each with its examples, stories, both themes,
390 / 1440 px tests). « New » means the variant does not exist yet; « from » names the existing entry it is built on.

| Type | Variants | Blocks | From |
| :-- | :-- | :-- | :-- |
| `hero` | **`poster`** (cover photo or loop, name, promise, facts, the action) · `split` (title in the frame, a 4:5 photo) · `banner` (a 21:9 photo, the name under it) · `tv` (the shop's sign and its latest video in the old TV) | `fact` (open now, area, score) | `cover-hero`, `retro-tv`, `wall/shop-sign` |
| `services` | **`menu`** (the compact price board, below) · `cards` (today's, 4:3, capped at 6) · `index` (the Cahier's stamped cards) · `carousel` (snap strip, phone-first) | `service` (pick and order) | `service-card` (`index`, `density="list"`) |
| `booking` | `strip` (the next free times, one tap) · `panel` (the closing call) · `sticky` (the phone bar, never over content) | — | `slot-picker`, `cta-panel`, `sticky-action` |
| `gallery` | `mosaic` (1 large 4:5 + 4 square) · `filmstrip` (3:4 or 4:5, snap) · `wall` (polaroids, notes, sign) · `grid` (today's) | `photo`, `note` (wall), `sign` (wall) | `media-gallery`, `wall`, `taped-photo` |
| `video` | `tv` (`RetroTv`, cabinet or portable) · `shorts` (another channel's reels behind the facade) | `reel` | `retro-tv`, `embed-facade` |
| `reviews` | `summary-cards` (score stamp + 2–3 cards) · `quote` (one large review) · `strip` (score in the hero's facts only) | — | `reviews` |
| `bulletin` | `board` (pinned notes, newest first, down after the last day) · `banner` (one line above the hero) | `flyer` | `wall/pinned-note` |
| `team` | `row` (avatars and first names) · `cards` (`profile-card`, a line each) | `member` | `avatar`, `profile-card` |
| `visit` | `card` (hours, address, call) · `map` (zones or the address, the map behind a facade on a phone) · `split` (hours beside the map) | — | `opening-hours`, `map` |
| `story` | `quote` (a pull quote + a paragraph) · `owner` (avatar, a paragraph, call / write) | — | `mascot-quote`'s layout, `avatar` |
| `social` | `links` (plain anchors, `nofollow`, no referrer) · `facade` (the latest reel behind `EmbedFacade`) | `link` | `embed-facade` |
| `faq` | `list` (native `details`, FAQPage JSON-LD) | `question` | `markdown` (answer text) |
| `policies` | `inline` (cancellation, prices, booking window) | — | `description-list` |

**`services · menu` — the compact price board (the default of every preset).**
- One row per service: an optional 56 px **square** thumbnail (48 on a phone) — only the service's **own** photo, never a
  default —, the name, a « Popular » badge from real bookings, a dotted leader, the price right-aligned in tabular
  figures (« from » small before it), then the duration, the capacity and one line of description, truncated; a
  secondary « Choose » button (44 px target). The inclusions move to the service's own page.
- Grouped by the shop's categories under a lower-case typewriter note (the Cahier label), in one column beside the hours
  card on a desktop (`aside`, sticky) or two columns (`columns: 2`) when nothing is beside it.
- It is a real list (`ul` / `li`), the button names the service (« Choose Short cut »), the price is text.
- In the mock-up, the services section (menu + hours aside, five services) is 633 px on a desktop (today's: 1,265) and 811 px on a phone, under one screen (today's: 2,657).

**Limits** (the schema's, the database's, the composer's): 16 sections, one hero, 24 blocks a section, 12 photos in a
gallery, 6 cards in `services · cards`, 3 flyers on a board.

### 4. The look presets

A preset is data in `@krizaka/tokens` (`presets/shop/*.json`, built to CSS scoped by `[data-shop-preset]`), never a
second theme system: it is ADR-006 §4's « surfaces · accent · density » plus the faces and the photo treatment.

```ts
type ShopPreset = {
  id: string; version: number; trades: Trade[];
  paper: "plain" | "seyes" | "kraft" | "washi";         // ADR-006 §4's papers; public pages only
  accent: "brand" | AccentId;                            // an accent of @krizaka/tokens, never a free colour
  faces: { title: "display" | "product-display"; note: "mono" | "cahier" };  // roles of @krizaka/fonts
  density: "compact" | "airy";
  photo: { grade: "none" | "warm" | "cool"; grain: 0 | 1; radius: "none" | "xs" };
  variants: Partial<Record<SectionType, string>>;        // the default variant per type when a section is added
};
```

| Trade | Preset A | Preset B |
| :-- | :-- | :-- |
| salon | **Vitrine** — Akinaza green, Plus Jakarta titles, compact, no grade | **Atelier** — copper (Akinaza's `accent-2`), Young Serif, airy, warm grade |
| pets | **Canal** — forest green, Plus Jakarta, compact, the hand for notes | **Carnet** — kraft paper, Young Serif, airy, warm grade, grain |
| coaching | **Studio** — cyan, Plus Jakarta, compact | **Approche** — sky, Young Serif, washi |
| workshop | **Établi** — steel, Plus Jakarta, Séyès | **Atelier** — copper, Young Serif, kraft |
| cleaning | **Net** — sky, Plus Jakarta, compact | **Forfait** — cyan, Plus Jakarta, Séyès |
| consulting | **Bureau** — indigo, Plus Jakarta | **Cabinet** — ink, Young Serif, Séyès |

- **AA by construction:** a preset can only name tokens; `shop-presets.test.ts` computes every preset × mode × surface
  0–2: body and small text ≥ 4.5:1, the accent's text on its button ≥ 4.5:1, decoration and the accent on surfaces
  ≥ 3:1, the hue on paper ≥ 3:1. A preset that fails does not build. The owner picks a preset and, within it, one of the
  accents the preset lists (all pre-tested) — never a colour wheel.
- The visitor's dark / light choice is kept: a preset defines both modes (copper is `hsl(22 62% 64%)` on slate and
  `hsl(20 62% 36%)` on paper, both ≥ 4.5:1 with their `on-accent`).
- **No café, restaurant or bar preset**: Akinaza is for service shops (ADR-006 §5, row 23). The issue's « café » example
  is refused.
- #261's twelve templates become **starter documents** (a section list) + **one of these presets**; `template_id` is
  read once by the migration, then retired.

### 5. The editor: our own composer

**Choice:** `@krizaka/ui/shop-composer`, our own, built on what `@krizaka/ui` already has. **Not Puck**, and no other
builder behind a facade, for now.

| Criterion | Own composer | Puck 0.23 behind a facade | Craft.js / GrapesJS |
| :-- | :-- | :-- | :-- |
| Fits the model | exactly: a list of sections, a variant picker, a settings form | a free canvas (drop any component in any zone); we would disable most of it | general page builders; GrapesJS is HTML-first |
| Dependencies | none new (Radix, TanStack Form, zod already in) | 36 runtime deps: dnd-kit **0.4** (pre-1.0), TipTap 3 and 16 extensions, zustand, happy-dom | large, own state |
| Skin | ours (Cahier, both themes, product register) | its own chrome; a facade would restyle every panel | same problem |
| Keyboard | designed in (below) | dnd-kit's sortable keyboard; the rest to audit | weak |
| Data | our document, nothing to translate | `{ root, content, zones }`, `zones` being replaced by slot fields — a moving target to map | own formats |
| Cost | ~1 slice (list, picker, form, history, preview bridge) | a facade, a mapping, a fork of its UI anyway | higher |

**Revisit** if a product needs nested free composition (blocks inside blocks, free columns): then Puck goes behind
`@krizaka/ui/composer` (ADR-001's placement rule) and reads and writes the same document.

**What it is.** Three panes on a desktop, two steps on a phone (list → section):
- **The outline** (left): the sections in order — the section's name, its variant in a mono note, a visibility switch
  (`Switch`), a handle; « Add a section » opens the catalogue, the types the trade does not use folded away.
- **The live preview** (centre): the real public page in an `iframe` of the product's own route (`?draft=<id>`), the
  phone / desktop toggle, the selected section outlined; a `postMessage` bridge (origin-checked, one message type per
  action) highlights and scrolls, nothing else crosses.
- **The inspector** (right): the variant as a `ChoiceGrid` of thumbnails (drawn from the same section with demo data,
  not screenshots), then the section's settings as a TanStack Form (via `@krizaka/ui/form`) generated from its zod
  schema, the blocks as a sortable list.
- **History:** every change is a command on a reducer (undo / redo, ⌘Z / ⇧⌘Z, 100 steps), autosaved to the draft
  (debounced 800 ms, « Saved » said in a live region); « Publish » validates and shows what changes (sections added,
  removed, moved, variant changed — a `DiffView`-like list), « Discard the draft » asks.
- **Reorder** like `PhotoGrid`: drag is an extra; the path is the keyboard — focus a row, `Alt+↑` / `Alt+↓` (or the
  row's menu: « Move up », « Move down », « Move to top »), every move announced (« Reviews moved to position 3 of 8 »),
  focus kept on the moved row.
- **Roles:** owner and manager edit and publish (Akinaza's `catalogue` permission); staff read; the preset and the
  identity stay the owner's.

### 6. Media

| Variant | Ratio | Rendered width (desktop / phone) | `sizes` |
| :-- | :-- | :-- | :-- |
| hero · poster | 16:9 desktop, 4:5 phone (art-directed `picture`) | 100vw | `100vw` |
| hero · split | 4:5 | 32 rem / 100vw | `(min-width: 48rem) 32rem, 100vw` |
| hero · banner | 21:9 | 100vw, max 90 rem | `100vw` |
| services · menu | 1:1 | 56 / 48 px | `56px` |
| services · cards | 4:3 | 18 rem / 90vw | `(min-width: 64rem) 18rem, 90vw` |
| gallery · mosaic | 4:5 lead + 1:1 | 36 rem + 18 rem / 100vw + 50vw | per tile |
| gallery · filmstrip | 3:4 or 4:5 | 16 rem / 42vw | `(min-width: 40rem) 16rem, 42vw` |
| gallery · wall | the print's own (polaroid 1:1) | 200–220 px | `220px` |
| video · tv | 9:16 in the cabinet | 17 rem / 14 rem | — |

- **A photo appears once per page.** The product's resolver walks the sections in order and hands each media id at most
  once (the hero first, then the order of the page); a section that runs out shows fewer tiles, never a repeat. The
  same goes for the trade's defaults (by asset id) and for a shop's own media. A test renders every demo and every
  starter document and fails on a repeated `src`.
- **No default in the menu.** A service shows its own photo or nothing (the leader and the price carry the row); the
  trade's defaults go to the hero and the gallery only, labelled « illustrations » as today.
- **Defaults per trade:** `defaults/<trade>/` holds at least 1 cover (16:9 and 4:5 crops) and 12 distinct photos, so the
  longest starter page never repeats; never a screenshot of the product, never a person's face.
- **Demo photos in the banners' style** (`krizaka-defaults/banners`): cinematic, warm tungsten and golden-hour light,
  Montréal (Saint-Henri brick, the Lachine canal, Notre-Dame West, the outdoor stairs), generated locally, no face, no
  text, no logo, uploaded under `site/products/akinaza/demo/<slug>/` through krizaka-com's `cdn-assets upload`
  (hashed, immutable). The mock-ups of this ADR use a first batch made that way (one of fifteen was rejected: a dog
  drawn standing like a person — every batch is reviewed).
- Formats: AVIF then WebP, 3 widths per ratio; the hero's image is `fetchpriority="high"` and preloaded; every other
  image is lazy; every image sits in a box of its ratio (CLS 0).

### 7. Performance and accessibility

- **LCP** is the first section: the hero's image (or its text when there is none); no section above it, no reveal on
  it, the bulletin `banner` is text only. **CLS 0**: fixed boxes, fonts preloaded by `next/font/local`.
- Sections are **server components**; the client islands are the wall's motion, the TV's player, the facade's button and
  the booking strip's live times. The composer is a separate entry (`@krizaka/ui/shop-composer`), never in the public
  page's bundle; a size test pins the public page's client JS at no more than today's.
- **Third parties** only behind `EmbedFacade` (nothing loaded before the click; the CSP of #390 unchanged); the map
  behind a button on a phone.
- One `h1` (the hero, or the sign in `hero · tv`), sections are `section` with their `h2`, lists are lists, prices are
  text; keyboard order is the visual order; reduced motion stills the loops, the neon and the wall; the menu's buttons
  are ≥ 44 px; every variant passes axe in both themes in the catalogue tests.
- The composer: every action has a keyboard path (above), the preview `iframe` is titled, the variant picker is a radio
  group, errors are said next to the field and summarised at the top on publish.

### 8. The rollout

| Slice | Repository | Content | Then |
| :-- | :-- | :-- | :-- |
| **U1** [#742](https://github.com/krizaka/krizaka-ui/issues/742) | krizaka-ui | `@krizaka/ui/shop`: the schema, `defineSection`, migrations; the frame and rhythm; `hero` (4), `services` (4, **`menu` first**), `booking` (3), `gallery` (4) | A2 can render |
| **U2** [#744](https://github.com/krizaka/krizaka-ui/issues/744) | krizaka-ui | `video`, `reviews`, `bulletin`, `team`, `visit`, `story`, `social`, `faq`, `policies` | the whole catalogue |
| **U3** [#745](https://github.com/krizaka/krizaka-ui/issues/745) | krizaka-ui | the presets in `@krizaka/tokens` (12, two per trade), the contrast matrix test, the photo treatments | A2, A4 |
| **U4** [#746](https://github.com/krizaka/krizaka-ui/issues/746) | krizaka-ui | `@krizaka/ui/shop-composer`: outline, inspector, history, preview bridge, keyboard reorder | A3 |
| **A1** [akinaza#400](https://github.com/krizaka/akinaza/issues/400) | akinaza | `shop_page_versions`, the routes (draft, publish, rollback), audit, the migration of today's pages | A2, A3 |
| **A2** [akinaza#401](https://github.com/krizaka/akinaza/issues/401) | akinaza | the public page renders the document through `@krizaka/ui/shop`; the media resolver (once per page, no default in the menu); LCP / CLS / JS budget tests | A5 |
| **A3** [akinaza#402](https://github.com/krizaka/akinaza/issues/402) | akinaza | Boutique › Page › Composer in the studio (owner, manager), on U4 | A5 |
| **A4** [akinaza#403](https://github.com/krizaka/akinaza/issues/403) | akinaza | the demo photos (≥ 12 per demo shop + covers) in the banners' style, on the CDN, and `defaults/<trade>` refreshed | A5 |
| **A5** [akinaza#404](https://github.com/krizaka/akinaza/issues/404) | akinaza | the demo shops rebuilt as the showcase: the salon on `salon-vitrine` compact, the dog walker on `pets-canal`; a « See it another way » switch on the two demo shops only (the editorial, gallery and journal documents) | — |

Milestones: B70 (krizaka-ui) and B71 (akinaza). U1 and A1 start in parallel; nothing ships to a real shop before A2 renders the migrated page identically.

## Consequences

- The public page stops being a component and becomes a renderer of a document; `Storefront.tsx`'s section switch moves
  to the library's sections. The demo shops change look on A5; a real shop keeps its order until its owner opens the
  composer.
- `@krizaka/ui` gains 13 section entries under one family (ADR-006 §7: the first consumer is Akinaza, named in each
  `meta.ts`); `service-card`'s `density="list"` is folded into `services · menu` and deprecated in the next minor.
- The composer is ours to maintain (~one slice); in exchange no third-party editor's release can break the studio.
- Templates of #261 retire after the migration; `shop_page.template_id`, `sections_custom` and `style` are dropped one
  release later.
- Risks, said honestly: owners may ask for freedom the catalogue does not give (« a second gallery beside the
  services ») — the answer is a new variant in the library, not a free column; generated photos can look generated —
  each batch is reviewed on a phone in both themes before it replaces the last.

## Open points for Oussama

1. **The default composition of a new salon**: compact (the price board first, mock-up 1) or editorial (the story
   first, mock-up 2). The ADR proposes compact: the page's job is to get a booking.
2. **« See it another way » on the demo shops** (A5): a public switch between the five compositions, demo shops only —
   the showcase you asked for, but it shows visitors that the page is configurable. Yes or no.
3. **Owner accents**: one accent per preset (simplest, safest), or a short tested list per preset (the ADR's choice).
