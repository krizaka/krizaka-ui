# @krizaka/tokens

## 3.67.0

No changes in this release.

## 3.66.0

No changes in this release.

## 3.65.0

No changes in this release.

## 3.64.1

### Patch Changes

- [#765](https://github.com/krizaka/krizaka-ui/pull/765) [`412d948`](https://github.com/krizaka/krizaka-ui/commit/412d948a3386262b80b68bae03630c1b81dc65ca) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - Release bump: 3.64.0 was already on npm (published before the B70 pull requests merged) when the shop surfaces were versioned as 3.64.0 on main. This patch publishes them: `@krizaka/ui/shop` and its sections (`shop/hero`, `services`, `booking`, `gallery`, `video`, `reviews`, `bulletin`, `team`, `visit`, `story`, `social`, `faq`, `policies`, `map-gate`, `demo`), `@krizaka/ui/shop-composer`, and the look presets of `@krizaka/tokens` (`shop-presets.css`, `shop-presets`) (krizaka-ui#742, [#744](https://github.com/krizaka/krizaka-ui/issues/744), [#745](https://github.com/krizaka/krizaka-ui/issues/745), [#746](https://github.com/krizaka/krizaka-ui/issues/746)).

## 3.64.0

### Minor Changes

- [#757](https://github.com/krizaka/krizaka-ui/pull/757) [`e092e2a`](https://github.com/krizaka/krizaka-ui/commit/e092e2af949fcf320d09b6081f329411d4cd7556) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - Shop look presets (ADR-007 §4, krizaka-ui#745): twelve presets, two per trade — salon Vitrine / Atelier, pets Canal / Carnet, coaching Studio / Approche, workshop Établi / Atelier, cleaning Net / Forfait, consulting Bureau / Cabinet; no café, restaurant or bar — as data in `@krizaka/tokens` (`src/presets/shop/*.preset.json`). `@krizaka/tokens/shop-presets.css` applies them under `[data-shop-preset="<id>"]` in both modes (an accent of the live brands or Akinaza's copper, the title face, the grain, the photo grade and radius) and `[data-shop-accent]` swaps the accent for another of the preset's tested list; `@krizaka/tokens/shop-presets` exports `shopPresets` for a studio. A preset names only tokens (a raw colour in a source is refused), and the build proves every preset × mode × accent of its list: body and small text ≥ 4.5:1, the accent's text and its button's label ≥ 4.5:1, the fill and the ring ≥ 3:1, the ink ≥ 7:1 and the hue ≥ 3:1 on the preset's paper. `ShopFrame` takes `accent` and `paper` (`seyes`, `kraft`, `washi`).

## 3.63.1

### Patch Changes

- [#736](https://github.com/krizaka/krizaka-ui/pull/736) [`8980b3a`](https://github.com/krizaka/krizaka-ui/commit/8980b3a52615885ecab4fa3c0adfba1e1f352c26) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - Release bump: 3.63.0 was already on npm when the analysis report, the stat strip, the usage blocks, the margin layout and the button fix were versioned. This patch publishes them (krizaka-ui#210, [#259](https://github.com/krizaka/krizaka-ui/issues/259), [#641](https://github.com/krizaka/krizaka-ui/issues/641), [#645](https://github.com/krizaka/krizaka-ui/issues/645), [#651](https://github.com/krizaka/krizaka-ui/issues/651)).

## 3.63.0

### Minor Changes

- [#733](https://github.com/krizaka/krizaka-ui/pull/733) [`740d2b6`](https://github.com/krizaka/krizaka-ui/commit/740d2b64eea28f3d69ec7445c9b5aa58c26abe99) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - `Page` and `Section` take two more papers, `paper="dot-grid"` (a dot every 24 px) and `paper="kraft"` (brown paper, its ink at 7:1 or more on the darkest point of its grain, in light and in « carnet de nuit »). New tokens `--kz-paper-dot`, `--kz-paper-kraft`, `--kz-paper-kraft-ink`, `--kz-paper-grain-opacity`. The grain is one inline SVG `feTurbulence` filter with a fixed seed, `PaperGrain` from `@krizaka/ui/page`, mounted once by the host; no image file (krizaka-ui#600).

## 3.62.0

### Minor Changes

- [#714](https://github.com/krizaka/krizaka-ui/pull/714) [`972f53c`](https://github.com/krizaka/krizaka-ui/commit/972f53c41f865139041c5df510e1c18a6bc72967) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - Paused products (2026-10-25): Orochia, Yasakia, Yororis and Kachizaka leave the family. The family switcher and the
  footer (`sites`) list only Krizaka, Orazaka, Yomizaka and Akinaza; `siteById` still finds a paused site (`pausedSites`), so
  a page that names one as `current` keeps rendering. Nothing published is removed: their marks (`OrochiaLogo`,
  `YasakiaLogo`, `YororisLogo`, `KachizakaLogo`, the native `*Mark`s, their `ProductLogo` / `ProductMark` ids — the new
  `PausedBrandId`, `PausedSiteId`), their brand themes (`@krizaka/tokens/brands/{orochia,yasakia,yororis,kachizaka}.css`
  and the `.brand-*` scopes, now headed DEPRECATED), the charts' `orochia` palette and the email themes stay, marked
  `@deprecated`, and are removed in the next major. The examples, metas and docs speak of the products in focus only.

## 3.61.0

No changes in this release.

## 3.60.0

No changes in this release.

## 3.59.0

No changes in this release.

## 3.58.0

### Minor Changes

- [#699](https://github.com/krizaka/krizaka-ui/pull/699) [`25ba3b0`](https://github.com/krizaka/krizaka-ui/commit/25ba3b0eedd8c362661537408118e71568cc7b14) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - Appearance for every product (ADR-006 §4, [#657](https://github.com/krizaka/krizaka-ui/issues/657)).
  
  - **`@krizaka/tokens`:** the themes as data — `appearance` (also on `/native`): System, Light and Dark (required), Blueprint (navy) and Carbone (near-black) as optional dark surface sets, the colours of each miniature, every brand's accent family per theme, and `passes` — the themes each accent reads on, computed with WCAG 2 (text ≥ 4.5:1, fill ≥ 3:1, its label ≥ 4.5:1) and tested for every combination. `appearance.css` applies the surface sets (`html.theme-blueprint`, `html.theme-carbone`) and the accent (`html[data-accent="<brand>"]`). No paper theme, no brand-named theme. Density stays `html[data-density="compact"]`.
  - **`@krizaka/ui/account-settings`:** `AppearanceSettings` — theme cards (a radio group of live miniatures, one check), accent, density, language and an opt-in sound, as `SettingsRow`s; driven by data, `onChange` out. Native twin: still the gap of [#503](https://github.com/krizaka/krizaka-ui/issues/503).
  - **`@krizaka/ui/theme`:** `useAppearance()` applies the choices at once and keeps them in the browser; `ThemeScript` restores the accent and the density before paint.

- [#700](https://github.com/krizaka/krizaka-ui/pull/700) [`bb1c5ca`](https://github.com/krizaka/krizaka-ui/commit/bb1c5cafdbc49efc4d84dfbb35917de9d02fb3e5) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - The admin's editors of a kind's vocabulary (ADR-006 §7, [#690](https://github.com/krizaka/krizaka-ui/issues/690); `@krizaka/organize` `KindConfig`, krizaka-ts#89) — new entry `@krizaka/ui/kind-config-editor`, web and React Native, same props.
  
  - **`TagSetEditor`:** the presets of a variant (name, colour from the closed palette, order — drag, buttons or Alt + ↑ ↓), who manages tags, « people can add their own », the most (1 to 200). A name another tag has is marked in place.
  - **`StatusSetEditor`:** the states in their order, each with a label in French and one in English (every field says its language), a tone, « final »; the initial state; the moves from × to with their roles, a second press and the reasons to pick from (off by default, never free text). A final state's row says « Final: no way out »; the initial state is never final. A derived set is shown read-only.
  - Both take the descriptor and give it back (`value` / `onChange`), show `kindConfigProblems` in place (`problems`), and never hold the save logic. The pure changes are tested to keep the contract by construction.

## 3.57.0

### Minor Changes

- [#698](https://github.com/krizaka/krizaka-ui/pull/698) [`914b702`](https://github.com/krizaka/krizaka-ui/commit/914b70297b43bab36182249158344207640dbdb0) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - Tags, statuses and views (ADR-006 §7, [#627](https://github.com/krizaka/krizaka-ui/issues/627)) — the surfaces of `@krizaka/organize@0.4.0` (krizaka-ts#89), built on `chip`, `tag-selector`, `filter-bar` and `data-table` — no new entry.
  
  - **Tokens:** the closed palette of tag markers — six names, `blue · green · amber · red · violet · gray`, as `--kz-tag-<name>` (the dot, ≥ 3:1) and `--kz-tag-<name>-text` (≥ 4.5:1) on every surface of both themes and of the product register. A test proves they are never a status tone or a product's accent (ΔE ≥ 10) and never twins of each other. The native theme gains the same roles (`tagBlue`, `tagBlueText`…).
  - **`@krizaka/ui/chip`:** `TagChip` (a name with its marker, a dot or Yomizaka's bookmark ribbon; alone, in `Chip.Group` or removable), `TagMarker`, `MarkerPicker` (recolour from the six, named and ticked), and `StatusChip`: a state of a `StatusSet` — read-only when the set is derived, the role has no move or nobody listens; otherwise a menu of `movesFrom(set, state, role)` in the set's order, a second press for a move that asks to be confirmed, a reason picked from a list (never typed). Labels in the person's language. React Native: the same, the status chip taking its moves resolved (its menu is an action sheet).
  - **`@krizaka/ui/tag-selector`:** an option may carry a `marker`; `creatable` adds a field — type to narrow, Enter takes the tag of that name or creates it in the colour chosen (`onCreate(name, marker)`), Backspace takes the last back.
  - **`@krizaka/ui/filter-bar`:** `SavedViews` (and `FilterBar views`): the `system`, `workspace` and `mine` views as chips with counts, a « modified » mark, « Save view », rename and delete; links when the views have an address; **one menu on a phone** (« View: To decide »).
  - **`@krizaka/ui/data-table`:** `SelectionBar` and `DataTable bulkActions` — the count, the actions the product gives, « Clear selection » and what the last change did, announced politely; sticky, docked above the tab bar on a phone (`--kz-dock-offset`); it says so past the most the service takes (`bulkMax`, 200).
  - `@krizaka/organize` (≥ 0.4, its browser-safe `/contract` only) is now a dependency of `@krizaka/ui`.

## 3.56.0

No changes in this release.

## 3.55.0

### Minor Changes

- [#684](https://github.com/krizaka/krizaka-ui/pull/684) [`ba195fb`](https://github.com/krizaka/krizaka-ui/commit/ba195fb1d4ec5458803777bf62abfd77ba5aa827) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - Plus Jakarta Sans is back, for the products' titles only (ADR-006 §2, krizaka-ui#670). `@krizaka/fonts` gets the role `product-display` (`--kz-font-product-display`, variable, latin + latin-ext, weights 550 / 650 / 700 in use, never 800): the files are the ones the package already shipped as legacy (`legacyFonts` still lists them), declared in `fonts.css` with a metric-matched fallback (CLS 0), never preloaded, never loaded from Google Fonts. `@krizaka/tokens` adds `--kz-font-product-display` and `--kz-font-mono-meta` (Courier Prime, for identifiers and times). In the product register of `blocks.css`, `--kz-font-display` is the product face (−0.015 em from 24 px, −0.022 em from 40 px, display steps at 550 / 650), identifiers use Courier Prime (`--kz-font-mono-meta`, `font-mono-meta`), code the system monospace (eyebrows follow in [#633](https://github.com/krizaka/krizaka-ui/issues/633)); the Cahier sites keep Young Serif and never fetch the face. The typography page of ui.krizaka.com shows the two registers side by side.

- [#687](https://github.com/krizaka/krizaka-ui/pull/687) [`a01eca5`](https://github.com/krizaka/krizaka-ui/commit/a01eca5d9611a0e462ff5217ac2e597c2e572812) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - `NavBar.Session`: the bar's « who is here » island for every product, over one contract — `GET /api/me` answers 200 `{ signedIn, signupOpen, account? }` with `Cache-Control: private, no-store` and `Vary: Cookie` (`meResponse`, `meHeaders`, `meSchema` from the server-safe `@krizaka/ui/nav-bar/me` entry); signed out is never a 401 and its schema rejects an account. It takes `ProductBarActions` and the account menu for the two states, uses `@krizaka/query` with the app's credential policy, and falls back to signed out even if a failed refetch leaves a cached account.

- [#681](https://github.com/krizaka/krizaka-ui/pull/681) [`8a65333`](https://github.com/krizaka/krizaka-ui/commit/8a65333d4ec58f164178d5eab7b81709374bb45c) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - The product register, 2027 (ADR-006 §3, krizaka-ui#669). A product's root (`data-surface="product"`, or its `.brand-<id>` on `<html>` / `<body>`) now wears, from `@krizaka/ui/blocks.css` and in both themes: the slate ink (title `#222a3a`, primary `#242c3d`, secondary `[#576275](https://github.com/krizaka/krizaka-ui/issues/576275)`, muted `#646d80` — the mockup's `#8c96a8` is 2.9:1 and refused), the surfaces `#fbfbfa` / `#ffffff` / `#f4f4f2` and `[#111318](https://github.com/krizaka/krizaka-ui/issues/111318)` / `#171a21` / `#1e222b`, translucent hairlines (4 % / 8 %) on cards and separators, radius 4 / 8 / 8 / 14 / 14 / 14, titles at 700, and on an interactive card (a link or a button) the brand border, a soft shadow and a 1 px lift in 150 ms (none under reduced motion). The Cahier sites are unchanged.
  
  New roles in `@krizaka/tokens` (Cahier values, no existing value changes): `--kz-text-title`, `--kz-border-control` (a field, a checkbox, a radio: ≥ 3:1 on surfaces 0–2 in the register, WCAG 1.4.11), `--kz-border-hover`, `--kz-shadow-hover`, plus `--kz-control-row`, `--kz-density-gap` and `--kz-density-pad` tightened by `[data-density="compact"]`. `@krizaka/tailwind` maps them (`border-control`, `border-hover`, `text-fg-title`, `shadow-hover`). `Field`, `Combobox`, `SearchField`, `DatePicker`, `DateField`, `Chat`, `Checkbox` and `RadioGroup` draw `border-control`: on the Cahier sites a field's edge is now the strong border. Contrast of every role is tested per theme and per brand.

## 3.54.0

No changes in this release.

## 3.53.0

No changes in this release.

## 3.52.0

No changes in this release.

## 3.51.0

No changes in this release.

## 3.50.0

No changes in this release.

## 3.49.0

No changes in this release.

## 3.48.0

No changes in this release.

## 3.47.0

No changes in this release.

## 3.46.0

No changes in this release.

## 3.45.0

No changes in this release.

## 3.44.0

No changes in this release.

## 3.43.1

No changes in this release.

## 3.43.0

### Minor Changes

- [#474](https://github.com/krizaka/krizaka-ui/pull/474) [`f354137`](https://github.com/krizaka/krizaka-ui/commit/f354137cca01e24652ec46ee9c25d250441d6f43) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - feat: **Krizaka Cahier**, our own pen — derived from Caveat (SIL OFL 1.1, renamed, FONTLOG shipped), weight 500, tabular lining figures, a 1.25 em line box, French alphabet and § — as the `cahier` role: `--kz-font-cahier` (tokens), `font-cahier` (tailwind), `fontStack("cahier")`, `fontFamily("cahier")` (fonts). For margin marks, folios, notes and the café chalkboard line; never headings or body text (krizaka-ui#472).

## 3.42.0

No changes in this release.

## 3.41.1

No changes in this release.

## 3.41.0

No changes in this release.

## 3.40.1

No changes in this release.

## 3.40.0

No changes in this release.

## 3.39.0

### Minor Changes

- [#435](https://github.com/krizaka/krizaka-ui/pull/435) [`9905a43`](https://github.com/krizaka/krizaka-ui/commit/9905a4386e18de2c16a2c55d5fc0e455bc89405e) Thanks [@oussamaABID](https://github.com/oussamaABID)! - Lining figures (ADR-004, krizaka-ui#417): Young Serif draws old-style digits by default, so a statistic's « 4 514 » and « 39 » sat on uneven heights. `--kz-figures` (`lining-nums tabular-nums`) is the token for every figure; the preset makes `tabular-nums` lining too (an explicit `oldstyle-nums` still wins); NumberTicker, the stat band, the price, the chapter and error numbers, the decision numbers and the story's stats read the token; native `fontVariant` asks for `lining-nums`.

## 3.38.0

No changes in this release.

## 3.37.0

No changes in this release.

## 3.36.0

### Minor Changes

- [#423](https://github.com/krizaka/krizaka-ui/pull/423) [`01cfb77`](https://github.com/krizaka/krizaka-ui/commit/01cfb7758294d04434af401f9ae92e292643e405) Thanks [@oussamaABID](https://github.com/oussamaABID)! - **Cahier — the flock's field notebook (ADR-004, [#417](https://github.com/krizaka/krizaka-ui/issues/417)), the foundations.** The template tells are retired at the source, by value (no token renamed or removed):
  
  - **Colour:** paper and blue ink in light, slate and chalk in dark (surfaces, borders, text); the steel accent and every product colour unchanged; no section wash (every brand's section gradient is the page surface). New roles `--kz-paper-rule-major/-minor/-margin`, `--kz-paper-tag/-tag-edge/-tag-ink`, `--kz-paper-module` (32 px), `--kz-paper-line` (8 px), native `paper*`.
  - **Shape:** radius 2 px on controls, 0 on cards, dialogs and sheets; every Tailwind radius (`rounded-xs` … `rounded-4xl`) reads a token.
  - **Elevation:** solid offsets of paper, never a blur; no sheen, no light edge; `glass` is an opaque sheet (no backdrop blur); `shadow-glow` is an ink line; `bg-halo` an ink rule; `node-lit` without a glow.
  - **Type:** the faces of `@krizaka/fonts` 0.3.0; display steps at one weight (400) with line heights on the 8 px line; `overline` is a lower-case note (no tracking); `font-synthesis-weight: none`.
  - **Motion:** the ease is the pen's (`cubic-bezier(0.45, 0, 0.2, 1)`); `[data-reveal]` settles in place (no travel, no blur), `data-reveal="ink"` writes left to right; the backdrop's drifting glows, dome and perspective grid draw nothing; a backdrop photograph is printed, not blurred.
  - **Blocks:** `Page` and `Section` take `paper="ruled" | "lines"` (the Seyès ruling) and `margin` (the red line); `SectionHeading`/`Section` take `number` (`§ 2`, hung in the margin). The eyebrow and the labels are lower-case notes in the typewriter face; no uppercase tracked overline in the primitives.
  - **Chrome:** no frosted glass in the bar, headers, dialogs, loaders, sticky actions; the bar's current item is an ink underline.
  - New utilities `ruled`, `ruled-lines`; colours `rule-major`, `rule-minor`, `margin`, `tag`, `tag-edge`, `fg-tag`; `ease-ink`.
  - **The Cahier's signature blocks:** `@krizaka/ui/specimen-tag` (`SpecimenTag`, `Stamp` — a product's or a component's status and record on a manila tag, the stamp in lower case), `@krizaka/ui/bird-plate` (`BirdPlate` — the flock as a naturalist's plate, numbered figures and their promises), `@krizaka/ui/anatomy-plate` (`AnatomyPlate` — a component's parts numbered around the live specimen), `@krizaka/ui/page-index` (`PageIndex` — a book's index with dotted leaders and page numbers), `@krizaka/ui/footnote` (`Caption`, `FootnoteRef`, `Footnotes`). Each with its meta, examples, stories and tests; native follows ([#421](https://github.com/krizaka/krizaka-ui/issues/421)).

## 3.35.0

No changes in this release.

## 3.34.0

No changes in this release.

## 3.33.1

No changes in this release.

## 3.33.0

No changes in this release.

## 3.32.0

### Minor Changes

- [#396](https://github.com/krizaka/krizaka-ui/pull/396) [`91d044f`](https://github.com/krizaka/krizaka-ui/commit/91d044f157d2b60e06a77913c4782c90f102a840) Thanks [@oussamaABID](https://github.com/oussamaABID)! - **A steel blue, one button shape, a quiet hover** (krizaka-ui#393, ADR-003).
  
  - **Tokens.** The Krizaka accent is a steel blue, hue 208 — the exact complement of the Orazaka orange — at ≤ 60 % saturation, instead of the electric `#196df5`: `accent` `hsl(208 46% 45%)` / light `hsl(208 54% 36%)`, `accent-text` `hsl(206 58% 72%)` / `hsl(208 54% 33%)`, a slate section gradient, and every product's `info` on the same steel. AA tested in both themes. The Krizaka mark follows (`marks.krizaka`). The products' colours do not change.
  - **Button.** One shape: an 8 px radius (`--kz-radius-sm`, the radius of a field), `pill` on demand. `shape="cut"` is a deprecated alias of it (a warning in development); `shimmer` and `magnetic` are deprecated no-ops.
  - **The quiet hover.** A hover changes a colour, never a position: the cards of the blocks (LinkCard, ArgumentCard, CardGrid), Card `interactive`, ServiceCard and GlowCard step their surface and hairline in 150 ms, with a 2 px focus ring. No lift, no zoom, no light following the pointer. `PointerLight`/`usePointerLight`, `CardGrid light`/`hover`, `LinkCard hover`, `ArgumentCard hover` and `GlowCard glow="spotlight"` are deprecated no-ops; GlowCard's ring is still; MotionObserver no longer follows the pointer. The examples `link-card/hover-light` and `argument-card/hover-light` are removed.

## 3.31.0

No changes in this release.

## 3.30.0

No changes in this release.

## 3.29.0

No changes in this release.

## 3.28.0

No changes in this release.

## 3.27.0

No changes in this release.

## 3.26.0

No changes in this release.

## 3.25.0

No changes in this release.

## 3.24.0

No changes in this release.

## 3.23.0

### Patch Changes

- [#320](https://github.com/krizaka/krizaka-ui/pull/320) [`75762cc`](https://github.com/krizaka/krizaka-ui/commit/75762cce12331e3cd02ad084073c35ce9653e01d) Thanks [@oussamaABID](https://github.com/oussamaABID)! - `--kz-text-muted` now reaches WCAG AA (4.5:1) for small text on every surface, in both themes and under every brand (it was 4.11:1 on dark and 3.91:1 on light, between 3.05 and 4.17 across the surfaces). Same hue (240°), lightness moved: dark 47% to 59%, light 52% to 41%. In the light theme `--kz-text-secondary` goes from 41% to 35% so the hierarchy primary > secondary > muted holds. A new contrast test covers text-muted on the four surfaces and on each brand's section gradient.

## 3.22.0

No changes in this release.

## 3.21.0

No changes in this release.

## 3.20.0

No changes in this release.

## 3.19.0

No changes in this release.

## 3.18.2

No changes in this release.

## 3.18.1

No changes in this release.

## 3.18.0

No changes in this release.

## 3.17.0

No changes in this release.

## 3.16.1

No changes in this release.

## 3.16.0

No changes in this release.

## 3.15.0

### Minor Changes

- [#202](https://github.com/krizaka/krizaka-ui/pull/202) [`bd53e0c`](https://github.com/krizaka/krizaka-ui/commit/bd53e0c279034f364513b2530812a94a1043b267) Thanks [@oussamaABID](https://github.com/oussamaABID)! - Kachizaka (predictions among friends, points only) and Akinaza (the shop OS for Québec): their brands, marks and mascots.
  
  - `@krizaka/tokens`: `brands/kachizaka.css` / `.brand-kachizaka` — **victorious gold** accent (hue 48, the family's only gold, ≥ 10° from warning and ≥ 20° from every brand accent) with **electric cobalt** (226) as `accent-2`, section ground, light accent text and ring; the cobalt alone sits 9° from the Krizaka blue, so it never leads (a test says so). `brands/akinaza.css` / `.brand-akinaza` — **Laurentian forest green** accent (hue 130, ≥ 20° from sage, emerald, success and every accent) with a matte **copper** `accent-2` (≤ 65 % saturation, never Orazaka's orange). `marks.kachizaka` (cobalt → gold) and `marks.akinaza` (forest → copper), every stop ≥ 3:1 in both themes. Budgets `.` 4.2 kB, `./native` 2.5 kB, `scoped.css` 1.5 kB.
  - `@krizaka/ui`: `KachizakaLogo` / `KachizakaMark` ("the sealed cup": a trophy cut at its rim, the seal — a star — breathes, the ball on the orbit) and `AkinazaLogo` / `AkinazaMark` ("the open shop": an awning cut at its corner, the shop front, the open door's warm light, a coin on the orbit); `ProductLogo` / `ProductMark` accept both ids; default avatars for both. The flock welcomes **the magpie** (keeps the score) and **the beaver** (builds the shop) in `Mascot` (web and native) with their own palettes. `@krizaka/ui/sites`: a new status `development` ("In development" / "En développement") and both products in it, their address the repository until a dev site exists.

## 3.14.0

No changes in this release.

## 3.13.0

### Minor Changes

- [#196](https://github.com/krizaka/krizaka-ui/pull/196) [`bab3e55`](https://github.com/krizaka/krizaka-ui/commit/bab3e55003effe5ed2f5fa802e368d1b93199a43) Thanks [@oussamaABID](https://github.com/oussamaABID)! - Yomizaka, the fifth product (documents read, classified and checked by Orazaka): its brand and its mark.
  
  - `@krizaka/tokens`: the Yomizaka brand — **ink indigo** (藍, *ai*), accent hue 240–242 placed by test ≥ 20° from the Krizaka blue and the Orochia violet and ≥ 60° from every other brand and every status; `brands/yomizaka.css`, `.brand-yomizaka` in `brands/scoped.css`, `brands.yomizaka` and `marks.yomizaka` (ink `hsl(232 50% 55%)` → indigo `hsl(248 50% 58%)`, every stop ≥ 3:1 on surfaces 0–2 in dark and light). Size budgets `.` 3.9 kB, `./native` 2.2 kB.
  - `@krizaka/ui`: `YomizakaLogo` (web) and `YomizakaMark` (native), "the reading" — a page with the Krizaka cut at its corner, three lines of text, and a lens resting on it; a line of light scans the page (web), the lens breathes, one node rides the orbit. `ProductLogo` / `ProductMark` accept `id="yomizaka"`; `@krizaka/ui/sites` lists Yomizaka (`dev.yomizaka.com`, upcoming).

## 3.12.0

No changes in this release.

## 3.11.0

No changes in this release.

## 3.10.0

No changes in this release.

## 3.9.0

### Minor Changes

- [#178](https://github.com/krizaka/krizaka-ui/pull/178) [`dbf4e2d`](https://github.com/krizaka/krizaka-ui/commit/dbf4e2d9ed12caf7c580fc89588aa02b59d6c703) Thanks [@oussamaABID](https://github.com/oussamaABID)! - The next bricks of the stack (decisions S5, S8, S10).
  
  - **`code-block` on TanStack Highlight** (replaces the regex highlighter): grammars for TS, TSX, JS, JSX, JSON, YAML, Bash, HTML (XML), CSS, Java, Kotlin, diff and `.properties`; the colours are the tokens' text roles (the `th-*` classes, no inline colour); `lineNumbers` and `annotations` (highlight, added, removed, focus — the rest is dimmed —, dim, error, warning). `highlight(code, language)` keeps its signature and now returns `th-*` spans (the old `kz-tk-*` classes are gone). `copyLabel` / `copiedLabel` are optional: without them a block has no copy button.
  - **`markdown`** (new, web and `./native/markdown`): TanStack Markdown's AST on the tokens — headings, lists and tasks, quotes, tables, links, images, footnotes, fenced code in `CodeBlock`. Raw HTML is never rendered and executable URLs are dropped; `streaming` closes the unfinished end of a text that arrives in pieces (an AI answer) and shows a caret; React Native draws the same AST in `Text` and `View`.
  - **`recipes`** (new): `defineRecipe` writes a component's variants once as classes of the tokens — `tv(recipe)` on the web, `nativeRecipe(recipe).resolve(props, theme)` on the phone. Button, Badge, Chip and Card are built on it, web and native, with a parity test (every variant resolves on both sides, on roles that exist in both themes, and nothing is left unresolved but what only the web has). On the phone, buttons and badges take their weight and tracking, chips their size, from the same classes as the web (buttons and badges `font-semibold`, badges `tracking-wider`, small chips 12 pt sides).
  - **`app-shell`**: the keyboard — ⌘/Ctrl+B folds the sidebar (`collapseShortcut`), `AppShell.Search` is the header's search that opens your `CommandDialog` (⌘/Ctrl+K), `AppShell.Item shortcut="g p"` goes to a section by a sequence or a combination, with the keys shown on hover and `aria-keyshortcuts`; `useShortcuts`, `formatShortcut`. A new `console` template: sections with shortcuts, the palette, a page header with its links, a server-side table on `@krizaka/query` and a form that creates a row.
  - **`file-upload` and `search-field` run on `@krizaka/pacer`**: `useUploadQueue` is a queue of uploads (new `retries`, `backoff`, `shouldRetry`; pause by aborting the signal, as before) and the search fields debounce with its hooks, on the web and on the phone. The local debounce helper is gone.

### Patch Changes

- [#179](https://github.com/krizaka/krizaka-ui/pull/179) [`e3bcc51`](https://github.com/krizaka/krizaka-ui/commit/e3bcc51692773c3cea99ec6198cd0011f026a70e) Thanks [@oussamaABID](https://github.com/oussamaABID)! - The documentation moved to **https://ui.krizaka.com**, built from this repository (`apps/site`) at every change: the
  packages' `homepage` (what npm shows) and READMEs point there — `@krizaka/tokens` to /foundations/tokens, `@krizaka/icons`
  to /foundations/icons, `@krizaka/fonts` to /foundations/typography, the packages without UI to /packages/<name>.

## 3.8.0

### Minor Changes

- [#176](https://github.com/krizaka/krizaka-ui/pull/176) [`336293a`](https://github.com/krizaka/krizaka-ui/commit/336293a904d6d0fc844add376ce6dd56e57c4ba9) Thanks [@oussamaABID](https://github.com/oussamaABID)! - Yazakia is renamed **Yasakia**: `YasakiaLogo` / `YasakiaMark`, `ProductLogo` / `ProductMark` id `yasakia`, `@krizaka/tokens/brands/yasakia.css` and `.brand-yasakia` in `brands/scoped.css`, `brands.yasakia` / `marks.yasakia`. The old names (`YazakiaLogo`, `YazakiaMark`, id `yazakia`, `brands/yazakia.css`, `.brand-yazakia`) stay as deprecated aliases for one minor version.

## 3.7.1

No changes in this release.

## 3.7.0

No changes in this release.

## 3.6.0

### Minor Changes

- [#157](https://github.com/krizaka/krizaka-ui/pull/157) [`1d23271`](https://github.com/krizaka/krizaka-ui/commit/1d232714beb074a958a723828ba93bfe035ef703) Thanks [@oussamaABID](https://github.com/oussamaABID)! - `engines` is `node >=22` for every package: Node 20 reached end of life, and the products already run on Node 22. No compatibility shim.

## 3.5.0

No changes in this release.

## 3.4.0

### Patch Changes

- [#143](https://github.com/krizaka/krizaka-ui/pull/143) [`d0e43fd`](https://github.com/krizaka/krizaka-ui/commit/d0e43fd7defaba8be14d61c3b84799fec817dad5) Thanks [@oussamaABID](https://github.com/oussamaABID)! - Package homepage points to the documentation on krizaka.com (the page the npm listing links to is the one that explains the package).

## 3.3.0

No changes in this release.

## 3.2.0

No changes in this release.

## 3.1.0

No changes in this release.

## 3.0.0

No changes in this release.

## 2.10.0

### Minor Changes

- [#105](https://github.com/krizaka/krizaka-ui/pull/105) [`dc6156f`](https://github.com/krizaka/krizaka-ui/commit/dc6156fcac67f6285b966c2a27d56af75fc8db10) Thanks [@oussamaABID](https://github.com/oussamaABID)! - Yororis brand: mark, theme, mascot, icons. `@krizaka/tokens`: the `yororis` brand — `brands/yororis.css`, `.brand-yororis` in `brands/scoped.css`, `brands.yororis` and `marks.yororis` (web and native) — sand → sage, the accent on sage (≥ 60° from `--kz-success` and `--kz-warning`), the sand (mark, `accent-2`) told apart from the warning amber by its chroma, AA-tested in dark and light. `@krizaka/ui`: `YororisLogo` (web) and `YororisMark` (native) — "the hold": two filled leaves rising into a "Y" that cup a warm core, one node, the moment, on the orbit — `ProductLogo` / `ProductMark` accept `id="yororis"`, the "Brand family" story shows Krizaka and its four products; the flock gains the `crane` ("la grue écoute", the bird of listening). `@krizaka/icons`: `MomentIcon`, `ThreadIcon`, `KeepIcon`.

## 2.9.0

No changes in this release.

## 2.8.0

### Minor Changes

- [#90](https://github.com/krizaka/krizaka-ui/pull/90) [`afce4b2`](https://github.com/krizaka/krizaka-ui/commit/afce4b2ec14c42c7550fc911af7db46d2a5d8bb6) Thanks [@oussamaABID](https://github.com/oussamaABID)! - Yazakia brand: mark, theme, mascot, icons. `@krizaka/tokens`: the `yazakia` brand — `brands/yazakia.css`, `.brand-yazakia` in `brands/scoped.css`, `brands.yazakia` and `marks.yazakia` (web and native) — emerald → turquoise, the accent on turquoise (hue 174, 14° from `--kz-success`), AA-tested in dark and light. `@krizaka/ui`: `YazakiaLogo` (web) and `YazakiaMark` (native) — two arms that lean in and meet, a core, the pair on the orbit — `ProductLogo` / `ProductMark` accept `id="yazakia"`, the "Brand family" story; the flock gains the `lovebird` ("l'inséparable présente", the bird of introductions). `@krizaka/icons`: `BatchIcon`, `DebriefIcon`, `IntroIcon`.

## 2.7.0

No changes in this release.

## 2.6.0

No changes in this release.

## 2.5.0

### Minor Changes

- [#76](https://github.com/krizaka/krizaka-ui/pull/76) [`62906f4`](https://github.com/krizaka/krizaka-ui/commit/62906f4cc2a56675499253d139df2921123cdd6e) Thanks [@oussamaABID](https://github.com/oussamaABID)! - **The Krizaka material — tokens and utilities (BRAND.md §6, "Surfaces & materials", and §6.1, "the griffe").** Light
  comes from above: what you press rises, what you fill sinks, what floats is glass, only what acts glows.
  
  - `@krizaka/tokens`: new roles in `material.tokens.json` — `--kz-surface-sheen`, `--kz-fill-shade`, `--kz-edge-light`,
    `--kz-edge-on-fill`, `--kz-edge-well`, `--kz-glass-bg` / `-border` / `-blur`, `--kz-ring-width` / `-offset` / `-halo`,
    `--kz-control-sm|md|lg|field` (tightened under `[data-density="compact"]`), the griffe `--kz-cut-shape` (`bevel`) and
    `--kz-cut-size`; the ink-tinted multi-layer shadows `--kz-shadow-raised|floating|overlay`; the status tints
    `--kz-success-soft|warning-soft|danger-soft`; `--kz-radius-xs` and `--kz-radius-2xl`; `--kz-ease-spring` and
    `--kz-duration-instant|fast|base` — **0 ms under `prefers-reduced-motion`** (a generated block). Native: the new colour
    roles in `themes.*`, `radius.xs` / `radius["2xl"]`, `motion.spring` and `motion.duration`, `shadows.<theme>` as React
    Native `boxShadow` strings, `cut.size`. Contrast tests: text on glass over anything the page shows, text on the status
    tints, on-accent down to the shaded bottom of a fill in every brand and both themes.
  - `@krizaka/tailwind`: `bg-sheen`, `bg-fill-shade`, `bg-halo`, `glass` (+ `bg-glass`, `border-glass-border`),
    `shadow-raised|floating|overlay`, `shadow-glow(-lg)` (the brand's glow, composed where used), `inset-shadow-edge`,
    `inset-shadow-edge-fill`, `inset-shadow-well`, `focus-ring` / `focus-ring-inset` (the signature focus ring),
    `node` / `node-lit`, `ease-spring`, `bg-*-soft`. (`--kz-radius-xs` and `--kz-radius-2xl` are tokens, not mapped: Tailwind's own `rounded-xs` / `rounded-2xl` keep their sizes.)
  - `@krizaka/ui/native`: `Theme`, `Radius` and `Motion` follow the new roles; `useTheme().motion.duration` is 0 ms when
    the system reduces motion.
  
  Nothing changes visually yet: the primitives adopt the material in the next release.

## 2.4.0

### Minor Changes

- [#66](https://github.com/krizaka/krizaka-ui/pull/66) [`1ebdb61`](https://github.com/krizaka/krizaka-ui/commit/1ebdb61ce394a3e584dce40c5740b3193da8ea5e) Thanks [@oussamaABID](https://github.com/oussamaABID)! - The Krizaka typography in the tokens. `--kz-font-sans` is Inter, `--kz-font-display` Plus Jakarta Sans (no longer an
  alias of sans), `--kz-font-mono` JetBrains Mono — each followed by its metric-matched fallback of `@krizaka/fonts` —
  and `--kz-font-text` aliases sans. The type scale `--kz-type-<step>-{size,line-height,weight,tracking}` (display-2xl …
  display-sm, title-lg, title-md, body-lg/md/sm, caption, overline, mono-md, mono-sm), exported as `typeScale` (index: CSS;
  native: dp, with the role of each step). `@krizaka/tailwind`: `font-text` and `text-<step>` (size, line height, weight
  and tracking together: `font-display text-display-xl`). Products that override `--kz-font-*` keep their faces.

## 2.3.0

### Minor Changes

- [#65](https://github.com/krizaka/krizaka-ui/pull/65) [`f14a096`](https://github.com/krizaka/krizaka-ui/commit/f14a096eb668f010e975df9617a941cc77fe3b36) Thanks [@oussamaABID](https://github.com/oussamaABID)! - Signature components and next-level feedback (DS2, wave W1 of [#49](https://github.com/krizaka/krizaka-ui/issues/49)) — additions only, the 2.x API is unchanged:
  
  - **New entries.** `./iso` (the isometric kit: `IsoHub` from data, `IsoScene`, `IsoPrism`, `IsoStack`, `IsoDome`, `IsoTile`, `IsoLink`, `IsoNode`, `IsoLabel` — server-rendered SVG, no client JavaScript), `./nav-bar` (floating bar that tightens on scroll, one light gliding between items, accessible menus, mobile panel), `./loader` (`Loader`: delay, minimum duration, ETA, drawn and announced endings; `LoadingRegion`: content ⇄ skeleton hand-over; `useDelayedWait`), `./number-ticker`, `./glow-card`, `./marquee`, `./stepper`, `./meter`, `./chip-link` (a filter that is a link, server-safe `chipVariants`, [#45](https://github.com/krizaka/krizaka-ui/issues/45)) and `./motion` (`MotionObserver`, `RotatingWord`).
  - **Motion ([#41](https://github.com/krizaka/krizaka-ui/issues/41)).** `MotionObserver` pauses what is off screen (`data-offscreen`), lets the first screen settle (`html[data-motion]`), drives `[data-kz-magnetic]`; `RotatingWord` keeps the width of its longest word (no layout shift); `[data-reveal="soft"]`; icon nodes light up and arrows lean in links and buttons.
  - **Button.** `shape="cut"` (45° corners), `loading` draws the Krizaka loader glyph (`indicator={false}` to keep your own), `progress`, `status` success·error (drawn, a ring opens, an error shakes once), `announce`, `shimmer`, `magnetic`; `IconButton` swaps its icon for the glyph.
  - **Feedback.** `Spinner` is the Krizaka glyph (a hexagon traced by light around a node) and takes a `value`; `LoaderGlyph` exported. `Progress`: `showLabel`, `eta`, `buffer`, `segments`, `status` paused·error. `Skeleton`: one brand reflection across the page, `SkeletonText`, `SkeletonShape` (the real component as its own skeleton). `Toast`: a hairline counts the time left (paused on hover), `undoToast`, `progressToast`, `groupedToast`.
  - **Tabs** glide one light to the active tab in every variant. **Dialog** `placement="left"` ([#43](https://github.com/krizaka/krizaka-ui/issues/43)), drawers slide from their edge.
  - Visual changes (new screenshots): Spinner, Button loading, Skeleton, Tabs, the side dialog's entrance.

## 2.2.0

No changes in this release.

## 2.1.0

### Minor Changes

- [#50](https://github.com/krizaka/krizaka-ui/pull/50) [`248927c`](https://github.com/krizaka/krizaka-ui/commit/248927c06c4c2735bca2e3f5fabe54e140d91913) Thanks [@oussamaABID](https://github.com/oussamaABID)! - **The Orazaka mark wears the brand's orange, and a product can be dark (or light) first without a flash.**
  
  - **Orazaka mark (visual change).** `OrazakaLogo`, `OrazakaMark` (native) and `ProductLogo`/`ProductMark id="orazaka"`
    leave amber (`#b45309 → #f59e0b`, hues 26 → 38 — the light stop was the hue of `--kz-warning` and read at 2:1 on a
    light page) for the brand's orange: deep orange `hsl(26 90.5% 37.1%)` #b45309 → orange `hsl(26 92% 45%)` #dc6509, on
    the accent's hue 26. Every stop reads ≥ 3:1 on surfaces 0–2 in dark and light; the halo and the core's glow follow.
    Geometry and animation unchanged. The 2.0 version stays visible in Storybook, *Brand/Evolution*.
  - **`marks` (`@krizaka/tokens`, `@krizaka/tokens/native`).** Each brand file carries its mark's emblem gradient
    (`$extensions["com.krizaka"].mark`), exported as `marks.<id>` (`[offset, colour]` stops); the three marks read it —
    no colour copied into `@krizaka/ui`. Krizaka and Orochia values are unchanged. The generated constants are marked
    pure, so a bundler keeps only what an app imports.
  - **`ThemeScript defaultMode`** (fixes [#47](https://github.com/krizaka/krizaka-ui/issues/47)). `ThemeScript` takes the same `defaultMode` (`"dark" | "light" | "system"`,
    default `"system"`) as `ThemeProvider`: with nothing persisted, the script applies it before the first paint and the
    provider reports it, so the first toggle is always visible. The visitor's choice (`kz-theme`) still wins; an unknown
    stored value falls back to the default. `ThemeProvider` also applies the mode when an app renders it without the
    script. New type `ThemeScriptProps`.

## 2.0.0

### Major Changes

- [#39](https://github.com/krizaka/krizaka-ui/pull/39) [`561300f`](https://github.com/krizaka/krizaka-ui/commit/561300f9c6b9d7c03181cf4769df94608f5bf8cb) Thanks [@oussamaABID](https://github.com/oussamaABID)! - **@krizaka/ui 2.0.0 — stable.** The primitives layer the products were missing, on one token vocabulary. `@krizaka/tokens`
  and `@krizaka/tailwind` ship with it at **2.0.0**: they form one `fixed` group with `@krizaka/ui` (one version for the
  foundations and the primitives), so they skip 1.x.
  
  Migrating from `@krizaka/ui` 1.x:
  
  - **Nothing changes for the marks and the motion signature**: `KrizakaLogo`, `OrazakaLogo`, `OrochiaLogo`,
    `ProductLogo`, the `/native` marks and `motion.css` keep their names and props.
  - **New: the primitives**, one entry each (`@krizaka/ui/button`, `/card`, `/dialog`, `/toast`, `/tabs`, `/command`,
    `/countdown`…), their React Native parity in `@krizaka/ui/native`, and the registry (`@krizaka/ui/registry/*`) that
    krizaka.com/docs/ui renders.
  - **Peers**: React 19 (`react`, `react-dom` ≥ 19 recommended — 18 still resolves), Tailwind CSS ^4.1 with
    `@krizaka/tailwind` 2 (`@import "tailwindcss"; @import "@krizaka/tailwind";`), React Native ≥ 0.76 and
    react-native-svg ≥ 15 for `/native`.
  - **Theme**: one mechanism (`html.light`, the `--kz-*` tokens); a product's identity is a brand theme
    (`@krizaka/tokens/brands/<id>.css`), never a fork.
  
  The support policy (N and N-1, 6 months, deprecation with a codemod) is in `SUPPORT.md`.

### Minor Changes

- [#39](https://github.com/krizaka/krizaka-ui/pull/39) [`561300f`](https://github.com/krizaka/krizaka-ui/commit/561300f9c6b9d7c03181cf4769df94608f5bf8cb) Thanks [@oussamaABID](https://github.com/oussamaABID)! - Status colours that read as text, and a section gradient that ends on the page.
  
  - **`--kz-success-text`, `--kz-warning-text`, `--kz-danger-text`, `--kz-info-text`** (native: `successText`…): the
    statuses as small text, ≥ 4.5:1 on every surface in both themes (tested) — the fills stay for dots, borders and
    icons (`danger` was 3.6:1 in light). Preset utilities `text-fg-success`, `text-fg-warning`, `text-fg-danger`,
    `text-fg-info`; `info-text` is a brand role. Used by `Countdown` (urgent), `Field.Error`, the danger
    `DropdownMenu.Item` and the native `Txt` tones `success`/`warning`/`danger`.
  - **`--kz-brand-gradient-to` is an alias of `--kz-surface-0`** (krizaka/krizaka-ui#38), in `tokens.css` and every
    brand file: an app that changes its page surface no longer gets a line under each `SectionBackdrop`. The resolved
    values (`values`, `brands`, `/native`) are unchanged.

- [#33](https://github.com/krizaka/krizaka-ui/pull/33) [`07eb219`](https://github.com/krizaka/krizaka-ui/commit/07eb2192da82fddd7525dc1dd382b262f9cbdc8b) Thanks [@oussamaABID](https://github.com/oussamaABID)! - Brand themes: one colour per Krizaka brand. `@krizaka/tokens/brands/{krizaka,orazaka,orochia}.css` (a product's
  identity, dark and light, imported after the tokens), `brands/scoped.css` (`.brand-<id>` classes for pages that show
  several brands), `brands` in the web and native modules (`<ThemeProvider overrides={brands.orazaka}>`). Orazaka is
  orange (from its mark: `hsl(26 92% 55%)` dark under near-black text, `#b45309` light under white), Orochia velvet →
  magenta, Krizaka ink + blue (the platform default). New roles: `--kz-accent-text` (the accent as text, ≥ 4.5:1 on
  every surface; `text-fg-accent`) and the section gradient `--kz-brand-gradient-{from,via,to}`
  (`from-brand-from via-brand-via to-brand-to`), every pair tested at WCAG AA in both themes. `BRAND.md` documents the
  brand system: colours, marks, icons and the visual language of pages.

- [#22](https://github.com/krizaka/krizaka-ui/pull/22) [`2c0c91f`](https://github.com/krizaka/krizaka-ui/commit/2c0c91f14e890d8c9485c61d89e9b1bb840f4aab) Thanks [@oussamaABID](https://github.com/oussamaABID)! - `.theme-light`: the light values and the aliases on a subtree — a theme preview stays light inside a dark page, the
  counterpart of `.theme-dark` (a separate block: `html.light` is unchanged, so a product's `:root` overrides still win
  there). Tested for parity with `.theme-dark`.

## 2.0.0-beta.6

No changes in this release.

## 2.0.0-beta.5

### Minor Changes

- [#33](https://github.com/krizaka/krizaka-ui/pull/33) [`07eb219`](https://github.com/krizaka/krizaka-ui/commit/07eb2192da82fddd7525dc1dd382b262f9cbdc8b) Thanks [@oussamaABID](https://github.com/oussamaABID)! - Brand themes: one colour per Krizaka brand. `@krizaka/tokens/brands/{krizaka,orazaka,orochia}.css` (a product's
  identity, dark and light, imported after the tokens), `brands/scoped.css` (`.brand-<id>` classes for pages that show
  several brands), `brands` in the web and native modules (`<ThemeProvider overrides={brands.orazaka}>`). Orazaka is
  orange (from its mark: `hsl(26 92% 55%)` dark under near-black text, `#b45309` light under white), Orochia velvet →
  magenta, Krizaka ink + blue (the platform default). New roles: `--kz-accent-text` (the accent as text, ≥ 4.5:1 on
  every surface; `text-fg-accent`) and the section gradient `--kz-brand-gradient-{from,via,to}`
  (`from-brand-from via-brand-via to-brand-to`), every pair tested at WCAG AA in both themes. `BRAND.md` documents the
  brand system: colours, marks, icons and the visual language of pages.

## 2.0.0-beta.4

No changes in this release.

## 2.0.0-beta.3

No changes in this release.

## 2.0.0-beta.2

### Minor Changes

- [#22](https://github.com/krizaka/krizaka-ui/pull/22) [`2c0c91f`](https://github.com/krizaka/krizaka-ui/commit/2c0c91f14e890d8c9485c61d89e9b1bb840f4aab) Thanks [@oussamaABID](https://github.com/oussamaABID)! - `.theme-light`: the light values and the aliases on a subtree — a theme preview stays light inside a dark page, the
  counterpart of `.theme-dark` (a separate block: `html.light` is unchanged, so a product's `:root` overrides still win
  there). Tested for parity with `.theme-dark`.

## 2.0.0-beta.1

No changes in this release.

## 2.0.0-beta.0

No changes in this release.

## 1.3.0

No changes in this release.

## 1.2.0

### Minor Changes

- [#3](https://github.com/krizaka/krizaka-ui/pull/3) [`adc494b`](https://github.com/krizaka/krizaka-ui/commit/adc494b9d1e0d7469e696ffe463e83f54bcbdde5) Thanks [@oussamaABID](https://github.com/oussamaABID)! - @krizaka/tokens: initial release — the semantic `--kz-*` tokens from one DTCG source: `tokens.css` (dark on `:root`
  and `.theme-dark`, light on `html.light`, media invariants), typed constants (`tokens`, `values`) and React Native
  themes (`@krizaka/tokens/native`).
