# ADR-006 — Krizaka UI 2027: the calm product register, the inverted Z, the themes as data, fewer components

- **Status:** proposed, 2026-10-25 (design session of [krizaka-ui#668](https://github.com/krizaka/krizaka-ui/issues/668), Oussama's orientation)
- **Scope:** `@krizaka/tokens`, `@krizaka/fonts`, `@krizaka/ui` (the product register of `blocks.css`, the marks, the
  catalogue of entries), ui.krizaka.com, and every product and site that consumes them
- **Amends:** ADR-003 (the quiet hover) and ADR-004 (the faces and the radius), **in the product register only**. The
  Cahier sites keep both ADRs unchanged.
- **Slices:** #669 tokens · #670 fonts · #671 the mark · #657 themes and Appearance · #672 SlotPicker · #627 tags and
  filters · #673 agent proposal · #674, #675, #676 the reduction

## Context

On 2026-10-25 Oussama set the direction for Krizaka UI's next year (#668). It is calm, restrained and tactile, sober
enough for Yomizaka's document checks and Akinaza's invoices, and warm enough for consumer use. His reference is a
self-contained HTML mockup that he built and tested himself (3,834 lines, French). It is private: it holds company
data, so nothing is copied from it but its design.

He asked for four things together:

1. set the direction;
2. refine and cut the open issues before building;
3. **reduce the components** (« on en a un peu trop »): keep the most pertinent, and create only what a product needs
   now or will need;
4. then adjust Krizaka UI, release it, dispatch it to the apps, and continue the products.

The mockup meets decisions already in force:

- **ADR-003 (2026-10-20):** the steel blue, one button shape, a quiet hover where « nothing lifts ».
- **ADR-004 (2026-10-20):** the Cahier. Young Serif, Atkinson Hyperlegible Next and Courier Prime; radius 2 / 0; paper
  and ruling; Plus Jakarta Sans retired as « the trio of a thousand templates ».
- **The product register (2026-10-22):** products wear plain Krizaka UI in their brand colour, with the Cahier's
  organising grammar but without its paper. Krizaka Cahier is for krizaka.com, the blog and the tool sites. The one
  exception is Akinaza's public shop pages, which are an artistic notebook.

This ADR reconciles the two. Where they conflict, it says so and chooses.

**How the mockup is read.** Oussama (2026-10-25) calls the mockup a guideline he likes, its text included, not a
specification to follow to the letter.

**What is kept is its spirit:**
- calm, restrained and tactile;
- the quiet slate ink and the hairlines;
- cards that answer the hand;
- the tone of its words: short, concrete, a craftsman's vocabulary (« atelier », « carnet », « créneau »), never
  hype. That tone guides the copy of the docs and the examples. The products' words stay in their own catalogues.

**Where this ADR departs from it**, each with its reason in §1:
- the muted ink and the field borders (contrast);
- the accent (ADR-003);
- the page grid and the paper themes inside products (the product register);
- the brand-named themes (the brand files);
- the receipt, the fiscal balancer and the swatches (no product need);
- the slide to approve and the default-on sound (accessibility);
- the wording on filing returns and on Yomizaka keeping books (what the products do);
- the inline birds (never a copy).

Everything else is adopted as drawn.

## 1. Decisions at a glance

| # | Point of #668 | Decision | Why |
| :-- | :-- | :-- | :-- |
| 1 | Calm slate ink (`#222a3a` / `#242c3d` / `#576275`) | **Adopted**, product register, light | 13.9 / 13.5 / 5.9 : 1 on `#fbfbfa` |
| 2 | Muted ink `#8c96a8` | **Adapted** → `#646d80` | 2.9:1 fails text contrast; `#646d80` is ≥ 4.5:1 on surfaces 0–2 |
| 3 | 1 px translucent hairlines (8 %) | **Adapted**: cards and separators only; a new `--kz-border-control` ≥ 3:1 for fields | An 8 % hairline is 1.16:1, and a field needs a visible edge (WCAG 1.4.11) |
| 4 | Hover: accent-tinted border, soft shadow, 1 px lift | **Adapted**: on interactive cards only, product register, still under reduced motion | Amends ADR-003 for the products; static cards never move; sites keep the quiet hover |
| 5 | Radius 14 on cards, 4 / 8 / 12 on controls | **Adapted**: product register `xs` 4 · `sm`/`md` 8 · `lg`/`xl`/`2xl` 14 | The sites keep the Cahier's 2 / 0 (ADR-004) |
| 6 | Accent `#1c52d8` | **Refused** as Krizaka's accent | It is the electric « AI » blue ADR-003 left five days ago (`#196df5`, hue 217–223); the steel blue stays, and products keep their brand accent |
| 7 | The 32 px page grid | **Refused in products**, kept as the Cahier paper (sites, Akinaza public pages) | The product register has no paper |
| 8 | Plus Jakarta Sans 550 for titles | **Adopted in the product register only**, from `@krizaka/fonts` (§2) | It is Oussama's tested taste; on the sites Young Serif stays |
| 9 | Atkinson Hyperlegible, Courier Prime, Caveat | **Already ours**: Atkinson Hyperlegible Next, Courier Prime, Krizaka Cahier (derived from Caveat) | Nothing to add; never Google Fonts |
| 10 | 8 atelier themes | **Adapted** into the data of Appearance (#657), split by register (§4) | One theme system; brand-named themes would fork the brand files |
| 11 | The inverted Z | **Adopted**, in a drawn wordmark; three mark options for Oussama (§5) | Today's mark has no Z; `Ƶ` is another letter |
| 12 | SlotPicker multi-week | **Adopted** as an extension of `slot-picker` (#672) | Akinaza's booking (akinaza#315) |
| 13 | Tag input and filter chips with counts | **Adopted**, by merging `tag-input` into `tag-selector` and through #627 | Akinaza D10 (akinaza#337), Yomizaka's organisation |
| 14 | KZ-07 receipt (GST / QST) | **Adapted**: no receipt component; Akinaza's `TotalsSummary` (#629) on `description-list` | It is one product's invoice view; French and English through messages |
| 15 | KZ-11 « fiscal balancer » | **Refused** as a component | Krizaka's own bookkeeping regime, not a product feature; `Meter` and `Stat` already draw a bar and three figures |
| 16 | KZ-12 swatches | **Refused** as a component; docs-site material (ui.krizaka.com foundations) | No product needs it |
| 17 | KZ-13 agent proposal and diff | **Adopted**, as generic `ProposalReview` + `DiffView` (#673) | Orazaka's approvals (orazaka-web-client#270, #275; orazaka#109) |
| 18 | « Slide to approve » | **Refused** | No keyboard or screen-reader path; the mockup's own is a click toggle; the button with a confirm is the path |
| 19 | Sound feedback (Web Audio) | **Adapted**: off by default, opt-in through an Appearance row, never under reduced motion; no haptics | A sound nobody asked for is noise; there is no vibration in the mockup |
| 20 | KZ-10's « télétransmission vers Revenu Québec » | **Refused wording** | Akinaza prepares returns and never files them |
| 21 | « Yomizaka agent » keeping books | **Refused** | Yomizaka verifies documents; it does not keep books |
| 22 | Mascots redrawn inline | **Refused**: the birds come from `@krizaka/ui/mascots` | Never a copy of a mark or a bird |
| 23 | Akinaza « services and accounting », restaurants in examples | **Refused** where it applies | Akinaza is for service shops, never restaurants, bars or cafés; it prepares GST / QST, it does not file |

## 2. Fonts

**The rule does not change:** the family loads its faces from `@krizaka/fonts` through `next/font/local` (preloaded,
fingerprinted, CLS 0). It never loads Google Fonts, and no font file is committed in an app.

| Role | Cahier sites (ADR-004) | Product register (this ADR) |
| :-- | :-- | :-- |
| display | Young Serif, one weight | **Plus Jakarta Sans**, 550 / 650 / 700; −0.015 em from 24 px, −0.022 em from 40 px |
| text | Atkinson Hyperlegible Next | Atkinson Hyperlegible Next |
| meta and identifiers | Courier Prime | **Courier Prime** (references, times, « KZ-03 »-style indexes) |
| code | Courier Prime | the system monospace |
| eyebrows | Courier Prime, lower case | the sans (#633) |
| the pen | Krizaka Cahier | **never** (sites and Akinaza's public pages only) |

- **What changes in the package:** Plus Jakarta Sans goes from `legacyFonts` to a new role, `product-display`
  (variable, latin + latin-ext). Its files are already in `packages/fonts/files/`. Slice: #670.
- **The disagreement, said plainly:** on 2026-10-20, ADR-004 named Plus Jakarta Sans one of the three tells of an
  « AI-generated » interface. It comes back here because Oussama tested it and wants it.
- **What keeps it from reading as a template:**
  - the other two tells stay gone: Inter and JetBrains Mono, the centred hero with an uppercase mono eyebrow, the
    counting band;
  - it is set at 550 to 700, never 800;
  - it stays out of the Cahier sites.
- **If it still reads as a template** in the Yomizaka captures of #669, going back is one token,
  `--kz-font-display: var(--kz-font-sans)`. That is reversible, so it is worth trying.

## 3. Tokens (slice #669)

All in `@krizaka/tokens`, read through `--kz-*`.

**Where the values apply:**
- The **product register**: `data-surface="product"` and the `.brand-<product>` roots of `blocks.css`.
- **Not** the Cahier sites, which keep ADR-004 (a test guards it).

| Role | Light | Dark | Contrast (tested) |
| :-- | :-- | :-- | :-- |
| `surface-0 / 1 / 2` | `#fbfbfa` / `#ffffff` / `#f4f4f2` | `#111318` / `#171a21` / `#1e222b` | — |
| `text-title` (new) | `#222a3a` | `#f3f5f9` | ≥ 13:1 |
| `text-primary` | `#242c3d` | `#e8ebf1` | ≥ 12:1 |
| `text-secondary` | `#576275` | `#a9b1bf` | ≥ 5.5 / 7.3 : 1 |
| `text-muted` | `#646d80` (mockup `#8c96a8` refused) | `#959eae` | ≥ 4.5:1 on 0–2 |
| `border-subtle` / `border-default` | `rgb(28 40 65 / .04 / .08)` | `rgb(255 255 255 / .04 / .08)` | decoration only |
| `border-control` (new) | `#7d8799` | `#646d7e` | ≥ 3:1 on 0–2 |
| `border-hover` (new) | the brand accent at 22 % | the brand accent at 30 % | decoration |
| `shadow-hover` (new) | `0 10px 25px -5px rgb(0 0 0 / .04)` | `0 10px 25px -5px rgb(0 0 0 / .5)` | — |
| `radius-xs / sm / md` | 4 / 8 / 8 px | same | — |
| `radius-lg / xl / 2xl` | 14 px | same | — |
| density | `html[data-density="compact"]`: spacing and row heights, one step down | same | — |
| `accent` | **the brand's**, unchanged; Krizaka's steel blue stays (ADR-003) | same | ≥ 4.5:1 as text (`accent-text`) |

- **Headings in the product register:** `PageHeader`'s title and `Stat`'s value at 700 (#655, folded into #669).
- **The hover:**
  - Only a card that is a link or a button moves: it lifts 1 px in 150 ms, takes `border-hover` and `shadow-hover`, and
    stays still under `prefers-reduced-motion`.
  - Buttons keep their colour-only hover.
  - Nothing follows the pointer: `pointer-light` is deprecated (§7).

**Blast radius, measured on 2026-10-25** (shallow clones of `main`; files with a `rounded-*` utility, files that set
`border-radius` or `--kz-radius`, files with a hover lift):

| App | `rounded-*` | radius | lift | Expected |
| :-- | --: | --: | --: | :-- |
| a former product | 425 | 5 | 5 | the largest: its own cards keep their local radius until its dispatch |
| orazaka-web-client | 157 | 5 | 0 | follows; `kz-sheen` removed |
| yomizaka | 37 | 1 | 0 | follows with no code change: the first consumer |
| akinaza | 33 | 0 | 0 | follows; its public pages keep the paper |
| the former products | 19 / 10 / 6 | 0 / 0 / 8 | 0 / 0 / 1 | follow |
| krizaka-com / krizaka-blog | 2 / 0 | 36 / 19 | 1 / 0 | **unchanged** (Cahier register) |

- Inside `@krizaka/ui`, the primitives read the radius roles (219 `rounded-*` uses in `src`, 55 radius rules in
  `blocks.css`), so the products follow on their bump.
- The Storybook baselines of the product stories (252 story files) are regenerated in #669. This is a **minor** by
  intent: no token is renamed or removed; values change and four roles are added.

## 4. Themes: one system, the data of Appearance (#657)

The mockup's eight `data-theme`s are **data of the Appearance block** (#657), never a second theme system. In
Appearance, a choice is made of three things:
- **mode and surfaces**;
- **accent**;
- **density**.

The mockup bakes a surface and an accent into one theme; Appearance splits them, so a product's brand accent survives
every surface choice.

| Mockup | Becomes | Where |
| :-- | :-- | :-- |
| `cahier-clair` (Séyès, default) | **Séyès** paper, the default **on the Cahier sites** | sites, Akinaza public pages |
| `papier-kraft` | **Kraft** paper (with #600) | sites, Akinaza public pages |
| `washi-mineral` | **Washi** paper | sites, Akinaza public pages |
| `blueprint-2028` | **Blueprint**, a navy dark surface set | products (optional), sites |
| `carbone-matrix` | **Carbone**, a near-black surface set | products (optional), sites |
| `orazaka-ember` | Orazaka's brand dark, already in `brands/orazaka` | Orazaka |
| `akinaza-terracotta` | **refused as a theme**: Akinaza's brand is forest green and copper; the warm clay may tint its public paper | — |
| `yomizaka-indigo` | Yomizaka's brand (`hsl(242 52% 46%)`), already in `brands/yomizaka`; the mockup's `#6d5ec9` is not adopted | Yomizaka |

**The set a product offers:**
- **required:** System, Light and Dark, in its brand;
- **optional:** Blueprint and Carbone;
- **accents:** its brand accent by default, plus any accent of `@krizaka/tokens` that passes on every surface it offers;
- **density:** standard or compact;
- **sound:** off, or on;
- **paper themes:** never inside a signed-in product.

**The checks:**
- Every combination is tested: text ≥ 4.5:1 and decoration ≥ 3:1, in both modes.
- Carbone's green with white text measures 2.3:1, so its `on-accent` is dark.
- The Orazaka console's own themes retire into this set: Electric blue is refused (ADR-003), Sovereign becomes Carbone,
  Cyberpunk is refused, and Solarized is refused.
- The choice persists in browser storage and, where there is an account, in the account.

## 5. The inverted Z (slice #671)

**Oussama's decision:** the Z of Krizaka is mirrored in the mark and the wordmark.

**What we found:**
- **Today's mark has no Z.** `KrizakaLogo` is an open hexagonal shield with a node and a core.
- **The family has no wordmark.** Every bar and footer sets « Krizaka » as text.
- **`Ƶ` (U+01B5) is the wrong character.** It is « Z with stroke », another letter, and screen readers and search
  engines would read it as such. A mirrored Z has no character, so it is drawn.

**The plan:**
1. **`KrizakaWordmark`** (web and native): the name drawn as paths with the Z mirrored, `role="img"`, accessible name
   « Krizaka », and a lockup with the mark. It is shown from a 20 px cap height; below that, only the mark.
2. **The mark:** three options rendered for Oussama (an `oussama-action` on #671):
   - **A** (recommended): the mark is unchanged and the Z lives in the wordmark. The hexagon is the family's shared
     grammar, so a Z in the parent's mark alone would break the family's coherence.
   - **B**: a small mirrored Z replaces the core.
   - **C**: the shield's stroke is redrawn as a mirrored Z.
3. **A legibility test** at 16, 24 and 32 px: five readers, « Krizaka » versus « Krisaka ». The result goes in the PR.
4. **The name stays « Krizaka »** with a normal Z in running text, alt texts, titles, metadata, JSON-LD, `llms.txt` and
   SEO. This is non-negotiable for search and for screen readers.
5. **`tools/export-brand.mjs`** re-renders `brand/krizaka/` on Bunny with the wordmark and the lockup in
   `manifest.json`. The favicon stays the mark. The product marks are untouched.

## 6. Domain pieces: generic or product?

| Piece | Verdict | Home | Consumer |
| :-- | :-- | :-- | :-- |
| SlotPicker multi-week | **generic** | `@krizaka/ui/slot-picker` (#672) | Akinaza booking (akinaza#315) |
| Fiscal balancer (regime switch, GST / QST bar, ticker) | **not a component** | Akinaza, if ever, composes `Meter` + `Stat` | none filed |
| Receipt with GST / QST | **product** | Akinaza `TotalsSummary` (#629) | Akinaza invoices |
| Agent proposal + diff | **generic** | `@krizaka/ui/proposal` (#673) | Orazaka (orazaka-web-client#270, #275; orazaka#109) |
| Ruled notebook with margin notes (KZ-05) | **Cahier**, sites only | `page paper="lines"` + `footnote` | sites, Akinaza public pages |
| Page index with leaders (KZ-06) | exists | `page-index` | sites, docs |
| Avatar chips (KZ-09) | exists | `avatar` + `profile-card`, illustrated defaults (#661) | every product |

**Accessibility of the approval:**
- The path is a button: Approve, with a two-step `ConfirmButton` when the action is irreversible; Reject; Edit.
- Confidence and diff are written in words and signs, never colour alone.
- A gesture may only ever be an extra over the button.
- Sound is off by default and never plays under reduced motion.

## 7. Fewer components: the « needs-driven » rule

**The rule.** An entry of `@krizaka/ui` exists because at least one of these is true:
- **(a)** a product or a family site imports it;
- **(b)** a filed product issue needs it, named in its `meta.ts`;
- **(c)** another kept entry is built on it.

Anything else is deprecated.

A new entry is opened only from a product issue that names its first consumer, and it ships with that consumer's
adoption issue. Two entries that do the same job merge into the one that already has users.

**Semver:**
- A deprecation lands in a **minor**: JSDoc `@deprecated` with the replacement, `meta.ts` `status: "deprecated"`, and
  a development warning.
- The removal lands in the **next major** (4.0), with an ast-grep codemod where the mapping is mechanical.

**The audit (2026-10-25):**
- **What was counted:** every one of the 187 `@krizaka/ui/*` entries (CSS files aside), against shallow clones of
  `main` of 24 repositories: the products, the mobile apps, the kits, krizaka-com, the blog, ui.krizaka.com,
  krizaka-build, krizaka-ts, krizaka-motion and the templates.
- **What was checked for each:** the internal dependencies, and the open issues of 18 repositories.

| | Entries |
| :-- | --: |
| Today | **187** |
| Kept | 145 (3 of them on watch: `pricing-page`, `contact-page`, `docs-layout`) |
| Merged into another entry | 14 (#675) |
| Deprecated, then removed | 28 (#674) |
| After 4.0 | **145** (−22 %) |

The full table is appendix A. The batches:
- **#674:** deprecations in 3.55;
- **#675:** merges in 3.57, `choice-grid` and `tag-selector` first;
- **#676:** removal in 4.0, with `MIGRATION-4.md`, the codemods, and the size before and after.

## 8. Data in examples

The examples, stories, docs, tests and screenshots of Krizaka UI are public. They use **demo data only**:
- a fictitious business, the « Eric » persona, and round demo amounts;
- the illustrated defaults of #661 for faces.

They **never** carry:
- the company's address or NEQ;
- a ledger line, a vendor, an account number or a real amount;
- the founder's advance or a tax credit;
- a path in the company's vault;
- a real person's name or face.

The reference mockup stays private. The CI's secret guard is not enough on its own, so a reviewer checks every new
example against this list.

## 9. The rollout

| Release | Content | Then |
| :-- | :-- | :-- |
| `@krizaka/ui` 3.55, tokens and fonts minors | #669 tokens, #670 fonts, #674 deprecations, #659 focus ring | Yomizaka and Akinaza bump |
| 3.56 | #640 the family top bar, #636 phone list rows, #648 binder tabs, #651 `StatGrid variant="strip"`, #641 usage | **Yomizaka P0 adoption**, Akinaza |
| 3.57 | #657 Appearance and the themes, #672 SlotPicker, #627 tags and filters, #653 templates, #650 profile banner, #675 merges | **Akinaza P1 adoption**, Orazaka web |
| 3.58 | #671 the wordmark (after Oussama's choice), #673 proposal | krizaka.com, the blog, a former product |
| 4.0 | #676 the removals and the codemods | every app |

There is one dispatch issue per app: Yomizaka, Akinaza, Orazaka web, krizaka.com, the blog, a former product. Each bumps
`@krizaka/ui`, adopts what its release brings, and deletes its local copy.

## Consequences

- The products change look on their bump to 3.55, with no code change. The sites do not.
- The catalogue shrinks by 42 entries by 4.0, and every new one names its consumer.
- Two ADRs are amended for the product register (ADR-003's hover, ADR-004's faces and radius).
- Plus Jakarta Sans is back, with an easy way out (§2).
- Risk: two registers to keep apart. The tests of #669 guard that the Cahier sites never inherit the product values.

## Appendix A — the component audit (2026-10-25)

Counts are the number of files importing the entry in each repository's `main`.

**Products:**
- Yo yomizaka · Ak akinaza · Oz orazaka-web-client;
- the mobile apps: OzM orazaka-mobile-client;
- the kits: OzKit orazaka-ui-kit.

**Sites:**
- www krizaka-com · blog · ui (ui.krizaka.com, `apps/site`) · java (krizaka-build/site) · ts · motion;
- tplN / tplE / tplT: the templates.

**Mobile:** the mobile apps import the native primitives from `@krizaka/ui/native` itself (Button 42, Text 37,
ThemeProvider 29, Screen 29, Card 29, Badge 24, EmptyState 20, Header 19…). All of them are kept.

| Entry (`@krizaka/ui/…`) | Products (files importing it) | Sites | Decision | Into / reason |
| :-- | :-- | :-- | :-- | :-- |
| `cn` | Oz 29 OzKit 6 Or 4 Yr 3 OrDS 3 Ka 1 | www 5 ui 3 java 3 blog 2 ts 2 | **keep** | keep: products |
| `slot` | — | — | **keep** | keep: utility |
| `button` | Oz 76 Ak 34 Yo 33 Ya 19 Yr 11 Ka 9 Or 8 OrDS 7 OzKit 5 | motion 17 blog 9 www 8 ui 8 java 3 ts 2 tplT 1 | **keep** | keep: products |
| `badge` | Yo 33 Ak 25 Oz 22 Ya 16 Ka 12 Or 5 Yr 4 OzKit 2 OrDS 1 | motion 4 ui 2 www 1 blog 1 | **keep** | keep: products |
| `field` | Oz 16 Ak 6 Or 4 Yo 2 Ya 1 Ka 1 OzKit 1 | ui 2 blog 1 | **keep** | keep: products |
| `skeleton` | Oz 3 Yo 2 Or 2 OzKit 2 Ak 1 | — | **keep** | keep: products |
| `empty-state` | Yo 8 Ak 5 Ya 5 Oz 2 Or 2 Yr 1 Ka 1 | — | **keep** | keep: absorbs mascot-state (#623) |
| `spinner` | Ya 2 Oz 1 Or 1 | ui 1 | **keep** | keep: products |
| `avatar` | Yr 5 Ak 3 Oz 2 Or 2 Ya 2 Yo 1 Ka 1 | www 2 motion 2 | **keep** | keep: products |
| `avatar/defaults` | — | — | **keep** | keep: #661 |
| `theme` | Oz 17 Yo 9 Ya 7 Yr 6 Ak 5 Or 5 Ka 3 OrDS 2 | ui 5 blog 3 java 3 ts 3 www 2 motion 1 tplN 1 tplT 1 | **keep** | keep: the theme data of Appearance (#657) |
| `captcha` | — | — | **keep** | keep: www hand-rolls CaptchaWidget, moves onto it (dispatch) |
| `countdown` | Or 2 Yr 1 OrDS 1 | — | **keep** | keep: products |
| `card` | Oz 23 Ak 18 Yo 14 Ka 7 Or 2 Ya 1 Yr 1 | motion 4 ui 3 www 2 blog 2 | **keep** | keep: products |
| `dialog` | Oz 15 Yo 4 Ak 3 Or 2 Ya 2 OzKit 1 OrDS 1 | www 3 motion 3 ui 1 | **keep** | keep: products |
| `toast` | Oz 8 Or 3 | motion 2 | **keep** | keep: products |
| `popover` | Or 2 Oz 1 | — | **keep** | keep: products |
| `dropdown-menu` | Yo 2 Ak 1 Oz 1 Or 1 | — | **keep** | keep: products |
| `tooltip` | Or 2 Oz 1 Ya 1 | — | **keep** | keep: products |
| `glossary-term` | — | — | **keep** | keep: akinaza#260 |
| `stat` | Oz 4 Ak 3 Ya 3 Yo 2 Or 2 Yr 1 Ka 1 | motion 4 blog 2 www 1 | **keep** | keep: `StatGrid variant="strip"` (#651), absorbs kpi-explained |
| `kpi-explained` | — | — | **merge** (#675) | into stat (`Stat explain`, akinaza#260) |
| `page-header` | Ak 14 Yo 10 Ya 7 Or 1 Yr 1 | — | **keep** | keep: products |
| `notification-preferences` | — | — | **keep** | keep: a former product's issue, the settings of every app |
| `agenda` | Ak 1 | — | **keep** | keep: products |
| `quota-meter` | — | — | **merge** (#675) | into meter (`Meter` with a quota label) |
| `alert` | Yo 38 Ak 32 Ya 15 Oz 12 Yr 10 Ka 8 | blog 1 | **keep** | keep: products |
| `separator` | — | blog 1 | **keep** | keep: blog, #602 |
| `skip-link` | Ak 1 Yr 1 | blog 1 java 1 ts 1 | **keep** | keep: products |
| `kbd` | Ak 1 Or 1 OzKit 1 | ui 4 www 2 java 1 ts 1 | **keep** | keep: products |
| `tabs` | Oz 7 Yo 5 Ka 2 Or 1 OrDS 1 | ui 3 motion 2 blog 1 | **keep** | keep: gains `variant="binder"` (#648, KZ-08) |
| `router` | Yo 2 Oz 1 | ts 1 | **keep** | keep: products |
| `chip` | Yo 2 Oz 2 Or 1 OrDS 1 | www 5 motion 5 ui 1 java 1 | **keep** | keep: absorbs chip-row |
| `chip-link` | Ak 5 Yo 1 Or 1 | www 2 | **keep** | keep: products |
| `chip-row` | — | — | **merge** (#675) | into chip (`Chip.Group`) |
| `switch` | Oz 7 Yo 4 Ak 2 Or 1 Ya 1 Yr 1 OrDS 1 | motion 3 www 2 ui 1 | **keep** | keep: products |
| `slider` | Or 1 OrDS 1 | motion 3 ui 1 | **keep** | keep: products |
| `checkbox` | Ak 2 Yr 2 Yo 1 Oz 1 Or 1 | ui 1 | **keep** | keep: KZ-01 row checkbox is ChoiceCards |
| `radio-group` | Yo 4 Oz 3 Or 1 | — | **keep** | keep: products |
| `command` | OzKit 2 Ak 1 Oz 1 Or 1 | www 2 ui 1 | **keep** | keep: products |
| `confirm-button` | Ak 3 Ya 3 Yr 2 Oz 1 Or 1 OrDS 1 | — | **keep** | keep: KZ-08 and the approval slice |
| `progress` | Yo 2 Oz 2 Or 1 | motion 4 www 2 ui 1 | **keep** | keep: products |
| `waveform` | Yr 1 | www 2 motion 1 | **keep** | keep: products |
| `section-backdrop` | Oz 1 Or 1 Ya 1 | www 2 | **keep** | keep: products |
| `mascots` | Yo 10 Ak 10 Oz 9 Ka 7 Ya 6 Yr 4 Or 2 | www 9 java 1 | **keep** | keep: products |
| `mascot-state` | — | — | **merge** (#675) | into empty-state (`illustration` slot, #623) |
| `iso` | Or 1 | — | **keep** | keep: products |
| `motion` | Oz 3 Yo 2 Ak 2 Ya 1 Yr 1 Ka 1 | motion 7 www 1 blog 1 ui 1 java 1 ts 1 tplN 1 | **keep** | keep: products |
| `loader` | Oz 3 Or 2 | ui 1 | **keep** | keep: products |
| `nav-bar` | Oz 3 Yo 2 Ak 2 Or 1 Ya 1 Yr 1 Ka 1 | motion 3 www 2 ui 2 ts 2 blog 1 java 1 | **keep** | keep: products |
| `nav-bar/me` | — | — | **merge** (#675) | into nav-bar (the signed-in slot already in NavBar) |
| `account-settings` | Yo 4 Ak 2 | — | **keep** | keep: absorbs choice-grid; Appearance (#657) |
| `drop-overlay` | Yo 1 | — | **keep** | keep: products |
| `upload-queue` | Yo 1 | — | **keep** | keep: products |
| `language-switch` | Yo 3 Ak 3 Ya 3 Or 2 Ka 2 Oz 1 Yr 1 | ui 2 www 1 blog 1 java 1 ts 1 | **keep** | keep: products |
| `language-switch/server` | — | — | **keep** | keep: inside nav-bar |
| `site-footer` | Oz 3 Ya 3 Ka 3 Yo 2 Ak 2 Yr 2 Or 1 | blog 2 www 1 ui 1 java 1 ts 1 motion 1 | **keep** | keep: products |
| `sites` | Yr 3 Ya 2 Yo 1 Ak 1 Oz 1 Ka 1 | www 5 ui 4 blog 3 java 2 ts 2 motion 1 | **keep** | keep: products |
| `number-ticker` | Oz 3 Ka 2 Or 1 Ya 1 | www 4 motion 4 blog 1 java 1 ts 1 | **keep** | keep: products |
| `terminal-replay` | — | — | **deprecate** (#674) | no user, no filed need |
| `glow-card` | Oz 2 Or 1 | motion 1 | **keep** | keep: www, Oz, Or (no bloom, ADR-003) |
| `engine-flow` | — | www 9 motion 3 ui 1 | **keep** | keep: www, motion (#658) |
| `marquee` | Or 1 | motion 1 | **keep** | keep: products |
| `comparison-table` | Ya 2 Ka 2 | blog 1 java 1 | **keep** | keep: products |
| `step-showcase` | Ya 2 Yr 2 Ak 1 Oz 1 Or 1 Ka 1 | — | **keep** | keep: products |
| `showcase` | — | — | **deprecate** (#674) | no user; LinkCard/CardGrid cover it |
| `stepper` | Yo 3 Oz 1 Or 1 Yr 1 | blog 1 motion 1 | **keep** | keep: absorbs step-progress (KZ-10) |
| `meter` | Ak 3 Or 3 Yo 1 Oz 1 Ya 1 Ka 1 | www 2 ui 1 | **keep** | keep: absorbs quota-meter and goal-gauge |
| `pagination` | Or 1 | ui 1 | **keep** | keep: products |
| `data-table` | Oz 14 Yo 11 Ak 8 Ya 6 Or 3 Yr 3 Ka 3 | motion 4 www 2 ui 2 ts 2 | **keep** | keep: phone list rows (#636) |
| `genui` | Oz 1 | — | **keep** | keep: products |
| `virtual` | — | — | **keep** | keep: inside data-table |
| `recipes` | — | — | **keep** | keep: inside the primitives |
| `markdown` | Oz 2 | — | **keep** | keep: products |
| `filter-bar` | Yo 4 | — | **keep** | keep: products |
| `form` | Yo 16 Ak 15 Ya 6 Yr 5 Ka 4 Oz 3 | ts 2 ui 1 | **keep** | keep: products |
| `form/server` | — | ui 1 | **keep** | keep: server entry of form |
| `text-style` | — | — | **keep** | keep: Akinaza |
| `text-style/server` | — | — | **merge** (#675) | into text-style (one server-safe entry) |
| `combobox` | Oz 1 | — | **keep** | keep: products |
| `tag-input` | — | — | **merge** (#675) | into tag-selector (`creatable`, KZ-04) |
| `date-picker` | — | — | **keep** | keep: inside form; #629 invoice dates |
| `map` | Ak 1 | ui 3 motion 3 www 1 | **keep** | keep: products |
| `search-field` | Yo 2 Oz 2 Ak 1 | ui 1 | **keep** | keep: products |
| `vertical-video` | Or 1 | — | **keep** | keep: products |
| `video-player` | Ya 2 | www 2 ui 1 | **keep** | keep: products |
| `retro-tv` | — | — | **deprecate** (#674) | no user; the retro set waits for #548 to name a need |
| `file-upload` | Yo 4 Oz 1 | — | **keep** | keep: products |
| `media-capture` | — | — | **deprecate** (#674) | no web user (the native capture stays) |
| `video-trimmer` | — | — | **deprecate** (#674) | no user |
| `audio-player` | Ya 2 | — | **keep** | keep: products |
| `image-cropper` | — | — | **deprecate** (#674) | no user |
| `document-viewer` | Yo 4 | — | **keep** | keep: products |
| `list` | Yo 6 Oz 3 | — | **keep** | keep: products |
| `description-list` | Yo 7 Ak 6 Ya 5 Ka 5 Yr 2 Oz 1 | — | **keep** | keep: products |
| `meta-row` | Or 2 Ka 1 | — | **keep** | keep: products |
| `app-header` | Or 2 Yo 1 Ak 1 Oz 1 | — | **keep** | keep: the family bar (#640) |
| `opening-hours` | Ak 1 | — | **keep** | keep: products |
| `service-card` | Ak 1 | — | **keep** | keep: products |
| `slot-picker` | Ak 1 | — | **keep** | keep: extend multi-week (KZ-03, akinaza#315) |
| `cover-hero` | Ak 1 | — | **keep** | keep: products |
| `media-gallery` | Ak 1 | — | **keep** | keep: products |
| `sticky-action` | Ak 2 | — | **keep** | keep: products |
| `rail-nav` | Oz 7 Or 3 Yo 1 Ak 1 | — | **keep** | keep: products |
| `activity-feed` | Ya 1 Yr 1 | — | **keep** | keep: products |
| `tree-view` | — | — | **deprecate** (#674) | no user, no filed need |
| `kanban` | — | — | **deprecate** (#674) | no user, no filed need |
| `page` | Ya 11 Yo 6 Ak 6 Ka 6 Oz 1 Or 1 Yr 1 | www 9 blog 7 motion 5 ui 1 java 1 ts 1 tplN 1 | **keep** | keep: products |
| `page-hero` | Yo 5 Ak 4 Ya 3 Ka 2 Or 1 | blog 5 www 4 motion 3 | **keep** | keep: products |
| `card-grid` | Or 2 Ka 2 Yo 1 Ak 1 Yr 1 | www 2 blog 2 ui 1 java 1 ts 1 motion 1 | **keep** | keep: products |
| `pointer-light` | — | — | **deprecate** (#674) | ADR-003 retired the light under the pointer; no user |
| `link-card` | Or 2 Ka 2 Yo 1 Oz 1 Yr 1 | www 1 blog 1 ui 1 java 1 ts 1 motion 1 | **keep** | keep: products |
| `argument-card` | — | www 1 java 1 ts 1 | **keep** | keep: sites (Cahier) |
| `mascot-quote` | Ya 2 Yo 1 Or 1 Ka 1 | www 1 java 1 | **keep** | keep: products |
| `decision-list` | Ya 2 Yr 1 | www 1 | **keep** | keep: products |
| `specimen-tag` | — | www 4 | **keep** | keep: sites (Cahier) |
| `bird-plate` | — | — | **keep** | keep: Cahier, #548 / #421 (sites) |
| `taped-photo` | — | www 4 | **keep** | keep: sites (Cahier) |
| `elephant` | — | — | **deprecate** (#674) | no user since a former product's pivot |
| `flock` | — | www 3 | **keep** | keep: sites (Cahier) |
| `anatomy-plate` | — | — | **deprecate** (#674) | no user (Cahier plate never adopted) |
| `page-index` | — | motion 1 | **keep** | keep: sites (Cahier) |
| `chapter` | — | blog 3 | **keep** | keep: sites (Cahier) |
| `footnote` | Yo 2 | www 2 motion 1 | **keep** | keep: products |
| `stuck` | — | — | **keep** | keep: Cahier, akinaza#308 public pages, www#373 |
| `doodle` | — | — | **keep** | keep: Cahier, #548, www#373 |
| `signature` | — | — | **deprecate** (#674) | no user |
| `code-block` | Oz 3 OzKit 1 | motion 6 www 2 ui 2 blog 1 java 1 ts 1 | **keep** | keep: products |
| `action-bar` | Yr 1 | www 2 | **keep** | keep: products |
| `next-actions` | — | — | **keep** | keep: #653 (Akinaza Today) |
| `glossary` | — | — | **merge** (#675) | into glossary-term (one `glossary` entry) |
| `cta-panel` | Ak 1 Or 1 Ya 1 | www 2 | **keep** | keep: products |
| `toc` | — | www 3 blog 2 | **keep** | keep: sites (Cahier) |
| `app-shell` | Yo 3 Or 2 Ak 1 Ya 1 Yr 1 Ka 1 | tplT 2 | **keep** | keep: products |
| `dashboard-layout` | Ya 7 Ak 2 Yr 1 | — | **keep** | keep: products |
| `account-menu` | Yo 3 Or 2 Ak 1 Oz 1 | — | **keep** | keep: products |
| `settings-layout` | Ak 10 Oz 8 Yo 4 Yr 3 Ya 1 | — | **keep** | keep: products |
| `auth-layout` | Ka 5 Yo 3 Ak 3 Ya 3 Oz 2 Or 2 Yr 2 | — | **keep** | keep: products |
| `detail-layout` | Yo 3 Ak 2 Ya 1 Yr 1 | — | **keep** | keep: products |
| `split-view` | Ak 1 | — | **keep** | keep: products |
| `marketing-layout` | — | — | **merge** (#675) | into landing-page |
| `docs-layout` | — | — | **keep** | keep, on watch: #548 (SiteCahier) moves the tool sites (fumadocs today) onto it, else deprecated in the next pass |
| `docs-nav` | Or 1 | — | **keep** | keep: products |
| `scroll-stage` | — | — | **deprecate** (#674) | no user |
| `choice-grid` | Yr 1 | — | **merge** (#675) | into account-settings `ChoiceCards` (rows or tiles, radio or checkbox; fixes #634) |
| `profile-card` | — | — | **keep** | keep: absorbs ProfileBanner (#650), KZ-09 |
| `stage-banner` | — | blog 2 | **keep** | keep: sites (Cahier) |
| `goal-gauge` | — | — | **merge** (#675) | into meter (`Meter steps`) |
| `continue-prompt` | — | — | **deprecate** (#674) | no user |
| `achievement` | — | motion 1 | **keep** | keep: sites (Cahier) |
| `promise-card` | — | — | **deprecate** (#674) | no user; ArgumentCard covers it |
| `landscape` | — | — | **deprecate** (#674) | no user; www draws its scene from brand-films |
| `landing-page` | Ak 2 Ya 2 Yr 2 Ka 2 Yo 1 Oz 1 | java 1 ts 1 | **keep** | keep: absorbs marketing-layout |
| `product-page` | — | — | **deprecate** (#674) | no page on it; LandingPage is the product site template |
| `how-it-works-page` | Ya 1 | — | **keep** | keep: products |
| `gallery-page` | — | — | **deprecate** (#674) | no page on it; CataloguePage covers it |
| `docs-hub-page` | Oz 1 Or 1 | — | **keep** | keep: products |
| `docs-article-page` | Oz 1 Or 1 | — | **keep** | keep: absorbs longform-page |
| `component-page` | — | — | **deprecate** (#674) | no page on it, not even ui.krizaka.com |
| `catalogue-page` | — | — | **keep** | keep: #653 (Yomizaka checks, Akinaza clients) |
| `longform-page` | — | — | **merge** (#675) | into docs-article-page (with chapter) |
| `changelog-page` | Or 3 Ya 3 Yr 3 Ka 3 | ui 3 java 3 www 2 | **keep** | keep: products |
| `contact-page` | — | — | **keep** | keep: www /contact moves onto it (dispatch), else deprecated in the next pass |
| `legal-page` | — | www 1 | **keep** | keep: sites (Cahier) |
| `status-page` | — | — | **deprecate** (#674) | no page on it, no filed need |
| `error-page` | Yo 1 Ak 1 Yr 1 Ka 1 | www 1 blog 1 | **keep** | keep: products |
| `pricing-page` | — | — | **keep** | keep, on watch: Yomizaka and Akinaza sell (pricing pages); deprecated in the next pass if still unused |
| `chat` | Ya 3 Oz 2 Yr 1 OzKit 1 | motion 4 www 2 | **keep** | keep: products |
| `swipe-deck` | — | — | **deprecate** (#674) | no user (a former product paused) |
| `match-dialog` | — | — | **deprecate** (#674) | no user (a former product paused) |
| `tag-selector` | Yo 2 | — | **keep** | keep: absorbs tag-input (KZ-04) |
| `step-progress` | — | motion 2 | **merge** (#675) | into stepper (`variant="progress"`) |
| `verified-badge` | — | ui 1 motion 1 | **keep** | keep: sites (Cahier) |
| `media-grid` | Or 5 | — | **keep** | keep: absorbs photo-grid |
| `photo-grid` | Ya 1 | — | **merge** (#675) | into media-grid (`kind="photo"`) |
| `native` | OzM 45 OrM 43 YaM 17 Yo 15 Ak 13 Ka 2 | ui 4 blog 2 tplE 2 | **keep** | keep: products |
| `native/vertical-video` | — | — | **deprecate** (#674) | no app imports it (to confirm with #663) |
| `native/video-player` | — | — | **keep** | keep: a former product's issue |
| `native/media-capture` | — | — | **deprecate** (#674) | no app imports it |
| `native/media-picker` | OzM 2 | — | **keep** | keep: products |
| `native/list` | Yo 3 | ui 1 | **keep** | keep: products |
| `native/form` | — | — | **keep** | keep: #380, a former product's issue |
| `native/map` | — | ui 1 | **keep** | keep: ui docs; Akinaza explore (akinaza#235) |
| `native/markdown` | — | — | **deprecate** (#674) | no app imports it |
| `update-prompt` | — | — | **deprecate** (#674) | no web user (native UpdatePrompt stays) |
| `force-update-screen` | — | — | **deprecate** (#674) | no web user (native twin stays) |
| `maintenance-screen` | — | — | **deprecate** (#674) | no web user (native twin stays) |
