# @krizaka/ui

## 3.62.0

### Minor Changes

- [#721](https://github.com/krizaka/krizaka-ui/pull/721) [`4d5a522`](https://github.com/krizaka/krizaka-ui/commit/4d5a522889098c99565dfb1c710a539307ca4e04) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - EngineFlow: a calm level for small frames (`calm`) and conduits anchored the same way ([#658](https://github.com/krizaka/krizaka-ui/issues/658)). `calm` runs sparse photons at a low rate and a slow breath, with no hint and no detail line; it plays only on screen and once the page has settled, and rests under reduced motion and Save-Data (no animation frame). Every conduit now meets the node's circle and the hub's ring at the point facing the other end: the circle's centre is the node's point, its label hangs below, the circles are opaque over the conduits. Tests at 4 and 6 nodes, stories and baselines for both layouts, an example on ui.krizaka.com.
  
  The family lists Krizaka Motion at https://motion.krizaka.com (HTTPS), no longer krizaka.github.io/krizaka-motion.

- [#714](https://github.com/krizaka/krizaka-ui/pull/714) [`972f53c`](https://github.com/krizaka/krizaka-ui/commit/972f53c41f865139041c5df510e1c18a6bc72967) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - Paused products (2026-10-25): Orochia, Yasakia, Yororis and Kachizaka leave the family. The family switcher and the
  footer (`sites`) list only Krizaka, Orazaka, Yomizaka and Akinaza; `siteById` still finds a paused site (`pausedSites`), so
  a page that names one as `current` keeps rendering. Nothing published is removed: their marks (`OrochiaLogo`,
  `YasakiaLogo`, `YororisLogo`, `KachizakaLogo`, the native `*Mark`s, their `ProductLogo` / `ProductMark` ids — the new
  `PausedBrandId`, `PausedSiteId`), their brand themes (`@krizaka/tokens/brands/{orochia,yasakia,yororis,kachizaka}.css`
  and the `.brand-*` scopes, now headed DEPRECATED), the charts' `orochia` palette and the email themes stay, marked
  `@deprecated`, and are removed in the next major. The examples, metas and docs speak of the products in focus only.

### Patch Changes

- Updated dependencies [[`972f53c`](https://github.com/krizaka/krizaka-ui/commit/972f53c41f865139041c5df510e1c18a6bc72967)]:
  - @krizaka/tokens@3.62.0
  - @krizaka/tailwind@3.62.0
  - @krizaka/intl@0.4.1

## 3.61.0

### Minor Changes

- [#720](https://github.com/krizaka/krizaka-ui/pull/720) [`ce959a9`](https://github.com/krizaka/krizaka-ui/commit/ce959a93ceef9ca00487fc74af9aeb0572c42c3b) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - `SiteFooter` takes `org` (the organisation's public facts from `@krizaka/org`): its signature line is `org.footer.line` (« Une entreprise de Technologies Krizaka · Fait à Montréal ») and, without `legal`, the legal links are `org.footer.legal`. `NavBar.Brand` takes `org` too: with no children it is the Krizaka mark and `org.brand.name`. `sites` exports `OrgFacts` and `orgFamilyLabels(org, locale)`. No site writes these lines by hand any more.

### Patch Changes

- Updated dependencies []:
  - @krizaka/tailwind@3.61.0
  - @krizaka/tokens@3.61.0

## 3.60.0

### Minor Changes

- [#540](https://github.com/krizaka/krizaka-ui/pull/540) [`3861b04`](https://github.com/krizaka/krizaka-ui/commit/3861b0454b53dccd69c089a329c349054e1b92f4) Thanks [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)! - Add the read-only Wall block with token-based brick, zellige, ridge and plaster textures, plus Polaroid, PinnedNote and ShopSign items. Polaroid composes TapedPhoto's print and tape. Data positions scale on desktop and stack in reading order on phones, with safe stacking even for negative z values; photo reveals and neon effects respect reduced motion. Registry examples include their own words and can be copied without companion files.

### Patch Changes

- Updated dependencies []:
  - @krizaka/tailwind@3.60.0
  - @krizaka/tokens@3.60.0

## 3.59.0

### Minor Changes

- [#701](https://github.com/krizaka/krizaka-ui/pull/701) [`b6cda94`](https://github.com/krizaka/krizaka-ui/commit/b6cda94462f4e15f735eb8e8f69ff700c56fd66a) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - `slot-picker` moves through weeks ([#672](https://github.com/krizaka/krizaka-ui/issues/672), ADR-006 §6 — Akinaza's public booking, akinaza#315), no new entry.
  
  - **Weeks:** `week` (controlled, the ISO date of the first day) with `onWeekChange`, `minWeek`, `maxWeek`, `todayWeek`, `weekLabel` and `weekButtons` — ← Today →. The host loads the days of the week it is asked for; the picker never computes availability. `weekHref` makes the buttons links, so `?week=` holds the state (and `?slot=` through each time's `href`).
  - **Parts of the day:** `PickerDay.groups` (`Morning`, `Afternoon`), the labels from the host's messages; `slots` stays for a flat day.
  - **A full time** (`disabled`) is struck out and read with its `note`, never by colour alone.
  - **`footer`:** the time zone and the duration, formatted by the host with `@krizaka/intl`.
  - **Keyboard:** arrows between days and between times (a full time is skipped), Page Up / Page Down for the week, focus kept; the week label is a polite live region.

- [#704](https://github.com/krizaka/krizaka-ui/pull/704) [`bfb374a`](https://github.com/krizaka/krizaka-ui/commit/bfb374afd8398c80aa95033c9b736413f7eaa2ef) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - Templates for Akinaza's, Yomizaka's and Orazaka's screens ([#653](https://github.com/krizaka/krizaka-ui/issues/653), ADR-006 §6), no new entry and no fiscal or receipt logic. Audit in [#622](https://github.com/krizaka/krizaka-ui/issues/622).
  
  - **Operate · `dashboard-layout`:** `date` on the right of the heading (under the title on a phone), a `description` that may hold links to the figures, `quickActions` (2 to 4 tiles, a `nav`, `quickActionsLabel`, `linkAs`) and a `side` column (beside the widgets from `lg`, last on a phone). Example `today`.
  - **Operate · `catalogue-page`:** `plan` with the new `PlanStrip` (2 or 3 figures and a `Meter`), `dividers` (the binder), `selection` (the `SelectionBar` of [#627](https://github.com/krizaka/krizaka-ui/issues/627), after the results). Example `clients`.
  - **Show · `detail-layout`:** `notes` column with `DetailNotes` (numbered notes, an add field) before the side panel, `DetailSection` (a binder section: a titled region with its tab), over the `cover` banner of [#650](https://github.com/krizaka/krizaka-ui/issues/650). Example `client`.
  - **Act · form:** `FormSteps` (an ordered list of numbered, named steps), `FormTotals` (the sticky totals card of the `aside`), and `StickyAction mode="task"` — on every width, with the `summary` (the total) before the action. Example `new-invoice`.

### Patch Changes

- Updated dependencies []:
  - @krizaka/tailwind@3.59.0
  - @krizaka/tokens@3.59.0

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

### Patch Changes

- Updated dependencies [[`25ba3b0`](https://github.com/krizaka/krizaka-ui/commit/25ba3b0eedd8c362661537408118e71568cc7b14), [`bb1c5ca`](https://github.com/krizaka/krizaka-ui/commit/bb1c5cafdbc49efc4d84dfbb35917de9d02fb3e5), [`cbe5537`](https://github.com/krizaka/krizaka-ui/commit/cbe55378ad2b38e27612ed504dc0b71c19a30095)]:
  - @krizaka/tokens@3.58.0
  - @krizaka/tailwind@3.58.0

## 3.57.0

### Minor Changes

- [#566](https://github.com/krizaka/krizaka-ui/pull/566) [`5cf4493`](https://github.com/krizaka/krizaka-ui/commit/5cf44933b83a4400d2d38f3ae8d8c21e8670e407) Thanks [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)! - Add `SiteCahier` (`@krizaka/ui/site-cahier`, with `SiteCahierHero` and `SiteCahierDoc`), the template of the tool sites that wear krizaka.com's identity — the Cahier, the site's bird and hue, taped prints — as a frame and regions to compose, not a fixed page. Add the retro pieces of the Krizaka style: `GradeStamp` (a teacher's grade, from real data with its source), `VersusCard` (an arcade face-off with stat bars from real data) and `SpeedLines` (manga action lines, still under reduced motion). `Doodle` (krizaka-ui#565) learns the marks the tool sites need: a `circle` or a `wave` around real text (`children` — the word stays text, the ink is drawn around it), the five birds' sketches (`bird`), `flip`, and a `label` that turns a mark that says something into an image. Proposed birds: Krizaka UI → duck, Java → owl, TypeScript → pigeon, Motion → flamingo.

- [#698](https://github.com/krizaka/krizaka-ui/pull/698) [`914b702`](https://github.com/krizaka/krizaka-ui/commit/914b70297b43bab36182249158344207640dbdb0) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - Tags, statuses and views (ADR-006 §7, [#627](https://github.com/krizaka/krizaka-ui/issues/627)) — the surfaces of `@krizaka/organize@0.4.0` (krizaka-ts#89), built on `chip`, `tag-selector`, `filter-bar` and `data-table` — no new entry.
  
  - **Tokens:** the closed palette of tag markers — six names, `blue · green · amber · red · violet · gray`, as `--kz-tag-<name>` (the dot, ≥ 3:1) and `--kz-tag-<name>-text` (≥ 4.5:1) on every surface of both themes and of the product register. A test proves they are never a status tone or a product's accent (ΔE ≥ 10) and never twins of each other. The native theme gains the same roles (`tagBlue`, `tagBlueText`…).
  - **`@krizaka/ui/chip`:** `TagChip` (a name with its marker, a dot or Yomizaka's bookmark ribbon; alone, in `Chip.Group` or removable), `TagMarker`, `MarkerPicker` (recolour from the six, named and ticked), and `StatusChip`: a state of a `StatusSet` — read-only when the set is derived, the role has no move or nobody listens; otherwise a menu of `movesFrom(set, state, role)` in the set's order, a second press for a move that asks to be confirmed, a reason picked from a list (never typed). Labels in the person's language. React Native: the same, the status chip taking its moves resolved (its menu is an action sheet).
  - **`@krizaka/ui/tag-selector`:** an option may carry a `marker`; `creatable` adds a field — type to narrow, Enter takes the tag of that name or creates it in the colour chosen (`onCreate(name, marker)`), Backspace takes the last back.
  - **`@krizaka/ui/filter-bar`:** `SavedViews` (and `FilterBar views`): the `system`, `workspace` and `mine` views as chips with counts, a « modified » mark, « Save view », rename and delete; links when the views have an address; **one menu on a phone** (« View: To decide »).
  - **`@krizaka/ui/data-table`:** `SelectionBar` and `DataTable bulkActions` — the count, the actions the product gives, « Clear selection » and what the last change did, announced politely; sticky, docked above the tab bar on a phone (`--kz-dock-offset`); it says so past the most the service takes (`bulkMax`, 200).
  - `@krizaka/organize` (≥ 0.4, its browser-safe `/contract` only) is now a dependency of `@krizaka/ui`.

### Patch Changes

- Updated dependencies [[`914b702`](https://github.com/krizaka/krizaka-ui/commit/914b70297b43bab36182249158344207640dbdb0)]:
  - @krizaka/tokens@3.57.0
  - @krizaka/tailwind@3.57.0

## 3.56.0

### Minor Changes

- [#693](https://github.com/krizaka/krizaka-ui/pull/693) [`33f3849`](https://github.com/krizaka/krizaka-ui/commit/33f384959f3fbe72d91019e1b9167ee243413726) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - `ProfileBanner` (in `@krizaka/ui/profile-card`, [#650](https://github.com/krizaka/krizaka-ui/issues/650)): the top of a page about one person or place — a client, a shop, a creator, a building. It has a slim cover (an image, or a tint of the brand's accent), the avatar overlapping its lower edge at every width, the eyebrow, the name (the `h1`), a status, its facts and the actions. No text is ever drawn on the cover. `DetailLayout` gains `cover`: its header becomes the banner, with `media` as the avatar. React Native: `ProfileBanner` in `@krizaka/ui/native`. Extracted from Orochia's profile hero ([#515](https://github.com/krizaka/krizaka-ui/issues/515)).

### Patch Changes

- Updated dependencies []:
  - @krizaka/tailwind@3.56.0
  - @krizaka/tokens@3.56.0

## 3.55.0

### Minor Changes

- [#687](https://github.com/krizaka/krizaka-ui/pull/687) [`a01eca5`](https://github.com/krizaka/krizaka-ui/commit/a01eca5d9611a0e462ff5217ac2e597c2e572812) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - `AppHeader` becomes the family's top bar ([#640](https://github.com/krizaka/krizaka-ui/issues/640)), extracted from Orochia's: the slots `search`, `language`, `messages`, `notifications`, `primary` and `account` beside `actions`, drawn in a fixed order (search · language · actions · messages · notifications · primary · account), an empty slot hidden. `AppHeaderCount` (in `@krizaka/ui/app-header`) is an icon button or link with an unread count, said in its name (« Notifications, 3 new »), `max+` above `max`. `AppHeaderSearch` (new client entry `@krizaka/ui/app-header/search`) is the field-like trigger with ⌘K / Ctrl+K that opens the host's `CommandDialog`; an icon below `md`, named at every width. React Native: `AppHeader`, `AppHeaderCount` and `AppHeaderSearch` in `@krizaka/ui/native`. Existing `AppHeader` props are unchanged.

- [#687](https://github.com/krizaka/krizaka-ui/pull/687) [`a01eca5`](https://github.com/krizaka/krizaka-ui/commit/a01eca5d9611a0e462ff5217ac2e597c2e572812) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - `DataTable` `phone="list"` ([#636](https://github.com/krizaka/krizaka-ui/issues/636)): on a phone (under 36 rem, or always with `layout="cards"`) each row draws as a list row instead of a card in a box — the selection's checkbox first, the `title` column with its `priority: 2` columns joined as one line of facts (« Facture · 23 oct. »), the `status` / `badge` column at the end, a hairline between rows; the other columns go to the row's detail. A `title` column now takes `href`: its name becomes the row's link (stretched over the whole list row). The table semantics, the selection and the detail work as before; the default stays `phone="cards"`.

- [#687](https://github.com/krizaka/krizaka-ui/pull/687) [`a01eca5`](https://github.com/krizaka/krizaka-ui/commit/a01eca5d9611a0e462ff5217ac2e597c2e572812) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - `DataTable` `routeKey`: the sort, the filters and the page live in the address (`?clients.sort=visits.descending&clients.q.client=lea&clients.page=2`), so back and forward, a reload and a shared link land on the same table. `useRouteSearch` (`@krizaka/ui/router`) writes several parameters in one navigation (krizaka-ui#515, « the URL is the state »).

- [#687](https://github.com/krizaka/krizaka-ui/pull/687) [`a01eca5`](https://github.com/krizaka/krizaka-ui/commit/a01eca5d9611a0e462ff5217ac2e597c2e572812) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - `DropOverlay` gains a controlled form: `active` shows it (DOM listeners off, `onFiles` optional), for a desktop app's native drops.

- [#687](https://github.com/krizaka/krizaka-ui/pull/687) [`a01eca5`](https://github.com/krizaka/krizaka-ui/commit/a01eca5d9611a0e462ff5217ac2e597c2e572812) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - Focus: the ring is the keyboard's. An element focused by code (a heading, `main` or a region with `tabindex="-1"` and no role) shows no ring or shadow, and a tap leaves no browser highlight on the brand or a title (`-webkit-tap-highlight-color`), so the blue block seen without keyboard use is gone (krizaka-ui#659). Roving-tabindex items keep their ring. A test of `@krizaka/ui` refuses a `focus:` ring, outline or shadow, and a bare `:focus` rule that draws one.

- [#684](https://github.com/krizaka/krizaka-ui/pull/684) [`ba195fb`](https://github.com/krizaka/krizaka-ui/commit/ba195fb1d4ec5458803777bf62abfd77ba5aa827) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - Plus Jakarta Sans is back, for the products' titles only (ADR-006 §2, krizaka-ui#670). `@krizaka/fonts` gets the role `product-display` (`--kz-font-product-display`, variable, latin + latin-ext, weights 550 / 650 / 700 in use, never 800): the files are the ones the package already shipped as legacy (`legacyFonts` still lists them), declared in `fonts.css` with a metric-matched fallback (CLS 0), never preloaded, never loaded from Google Fonts. `@krizaka/tokens` adds `--kz-font-product-display` and `--kz-font-mono-meta` (Courier Prime, for identifiers and times). In the product register of `blocks.css`, `--kz-font-display` is the product face (−0.015 em from 24 px, −0.022 em from 40 px, display steps at 550 / 650), identifiers use Courier Prime (`--kz-font-mono-meta`, `font-mono-meta`), code the system monospace (eyebrows follow in [#633](https://github.com/krizaka/krizaka-ui/issues/633)); the Cahier sites keep Young Serif and never fetch the face. The typography page of ui.krizaka.com shows the two registers side by side.

- [#687](https://github.com/krizaka/krizaka-ui/pull/687) [`a01eca5`](https://github.com/krizaka/krizaka-ui/commit/a01eca5d9611a0e462ff5217ac2e597c2e572812) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - `NavBar.Session`: the bar's « who is here » island for every product, over one contract — `GET /api/me` answers 200 `{ signedIn, signupOpen, account? }` with `Cache-Control: private, no-store` and `Vary: Cookie` (`meResponse`, `meHeaders`, `meSchema` from the server-safe `@krizaka/ui/nav-bar/me` entry); signed out is never a 401 and its schema rejects an account. It takes `ProductBarActions` and the account menu for the two states, uses `@krizaka/query` with the app's credential policy, and falls back to signed out even if a failed refetch leaves a cached account.

- [#687](https://github.com/krizaka/krizaka-ui/pull/687) [`a01eca5`](https://github.com/krizaka/krizaka-ui/commit/a01eca5d9611a0e462ff5217ac2e597c2e572812) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - `@krizaka/ui/notification-preferences`: `NotificationPreferences`, categories by channels with a switch at each crossing, presets that set the whole matrix, a locked row for security. Extracted from Orochia's notification settings (krizaka-ui#515).

- [#681](https://github.com/krizaka/krizaka-ui/pull/681) [`8a65333`](https://github.com/krizaka/krizaka-ui/commit/8a65333d4ec58f164178d5eab7b81709374bb45c) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - The product register, 2027 (ADR-006 §3, krizaka-ui#669). A product's root (`data-surface="product"`, or its `.brand-<id>` on `<html>` / `<body>`) now wears, from `@krizaka/ui/blocks.css` and in both themes: the slate ink (title `#222a3a`, primary `#242c3d`, secondary `[#576275](https://github.com/krizaka/krizaka-ui/issues/576275)`, muted `#646d80` — the mockup's `#8c96a8` is 2.9:1 and refused), the surfaces `#fbfbfa` / `#ffffff` / `#f4f4f2` and `[#111318](https://github.com/krizaka/krizaka-ui/issues/111318)` / `#171a21` / `#1e222b`, translucent hairlines (4 % / 8 %) on cards and separators, radius 4 / 8 / 8 / 14 / 14 / 14, titles at 700, and on an interactive card (a link or a button) the brand border, a soft shadow and a 1 px lift in 150 ms (none under reduced motion). The Cahier sites are unchanged.
  
  New roles in `@krizaka/tokens` (Cahier values, no existing value changes): `--kz-text-title`, `--kz-border-control` (a field, a checkbox, a radio: ≥ 3:1 on surfaces 0–2 in the register, WCAG 1.4.11), `--kz-border-hover`, `--kz-shadow-hover`, plus `--kz-control-row`, `--kz-density-gap` and `--kz-density-pad` tightened by `[data-density="compact"]`. `@krizaka/tailwind` maps them (`border-control`, `border-hover`, `text-fg-title`, `shadow-hover`). `Field`, `Combobox`, `SearchField`, `DatePicker`, `DateField`, `Chat`, `Checkbox` and `RadioGroup` draw `border-control`: on the Cahier sites a field's edge is now the strong border. Contrast of every role is tested per theme and per brand.

- [#687](https://github.com/krizaka/krizaka-ui/pull/687) [`a01eca5`](https://github.com/krizaka/krizaka-ui/commit/a01eca5d9611a0e462ff5217ac2e597c2e572812) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - `@krizaka/ui/quota-meter`: `QuotaMeter`, space or time used against a plan: the figure in words, a Meter amber from 80 % and red from 95 %, the sentence for the level (a status when it matters), notices, small figures and the way out. Extracted from Orochia's storage meter (krizaka-ui#515).

- [#689](https://github.com/krizaka/krizaka-ui/pull/689) [`68cad54`](https://github.com/krizaka/krizaka-ui/commit/68cad54b00f217ecaf4de93a62f57d894a408cac) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - `RailNav` ([#647](https://github.com/krizaka/krizaka-ui/issues/647)): `shortcuts` with `shortcutsLabel` adds the product's quick ways in (a saved view, a frequent client, « New invoice ») as a named group above the footer and the expand toggle, on desktop only. An expandable rail with no `defaultExpanded` and no `expanded` now shows its words from 1280 px and stays narrow below, until the person toggles it. `AccountMenu` `showName="lg"` shows the name from 1024 px, for the family's top bar (`AppHeader` `account`).

- [#687](https://github.com/krizaka/krizaka-ui/pull/687) [`a01eca5`](https://github.com/krizaka/krizaka-ui/commit/a01eca5d9611a0e462ff5217ac2e597c2e572812) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - Reduction, batch 1 (ADR-006 §7, krizaka-ui#674): 28 entries with no user and no filed need are deprecated in 3.55 and removed in 4.0; nothing is removed in this minor. Each carries `@deprecated` JSDoc, `status: "deprecated"` in its `meta.ts` (ui.krizaka.com shows the badge and sinks it in the catalogue), and a development-only console warning, once per page and never in production (`warnDeprecated`). Showcase and effects: `terminal-replay`, `showcase`, `retro-tv`, `scroll-stage`, `landscape`, `signature`, `anatomy-plate`, `elephant` (`pointer-light` was already deprecated in 3.31). Data views: `kanban` (`tree-view` was already deprecated in 3.6). Engagement: `continue-prompt`, `promise-card`, `swipe-deck`, `match-dialog`. Web media editors: `media-capture` (web and native), `video-trimmer`, `image-cropper`. Web lifecycle screens: `update-prompt`, `force-update-screen`, `maintenance-screen` (the native twins stay). Page templates no page uses: `product-page`, `gallery-page`, `component-page`, `status-page`. Native entries no app imports: `native/vertical-video` and `native/markdown` (their web entries stay), `native/media-capture`. On watch, not deprecated: `pricing-page`, `contact-page`, `docs-layout`. A product that objects comments on krizaka-ui#674 with its issue and the entry goes back to « keep ». A test lists the deprecated entries, so a kept component, a registry example or the documentation site cannot import one.

- [#687](https://github.com/krizaka/krizaka-ui/pull/687) [`a01eca5`](https://github.com/krizaka/krizaka-ui/commit/a01eca5d9611a0e462ff5217ac2e597c2e572812) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - `@krizaka/ui/stuck`, `@krizaka/ui/doodle`, `@krizaka/ui/signature`: cards stuck into the notebook (krizaka-ui#554). `Stuck` sticks any block (a figure, a `SpecimenTag`, a card, a `TapedPhoto`) onto the page: held by `tape` (TapedPhoto's own tape, one strip or `tape-corners`), a `pin`, photo `corner`s or `glue`, tilted from data (`seed`, ±2°) on the Cahier's hard paper shadow. `Doodle` draws an arrow, a circled word, a star, a wavy underline or a tiny bird in the page margin beside a block, decoration only and not displayed below 1360 px. `Signature` is a small hand-signed mark for the end of a page: the Krizaka mark as an ink stamp and « Krizaka · Montréal » in the notebook's pen (`stamp`, `script` or `both`), never a person's signature.

- [#686](https://github.com/krizaka/krizaka-ui/pull/686) [`4339b89`](https://github.com/krizaka/krizaka-ui/commit/4339b898aab59b2c29343cb5feab7e8d201aba65) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - `Tabs` `variant="binder"` ([#648](https://github.com/krizaka/krizaka-ui/issues/648)): binder dividers (intercalaires) to organise collections, tags and statuses. Each tab is a divider with a coloured top edge (`hue`: accent · success · warning · danger · neutral, each 3:1 or more on both themes), its words and a `count` (part of its name). The active one joins the content under the list's line. Too many dividers scroll sideways with fading edges. `add` puts a « + » button after the list (outside the tablist). It works as routes too (`Tabs.Nav` / `Tabs.NavLink` take `variant`, `hue`, `count` and `add`). `Tabs.Trigger` and `Tabs.NavLink` gain `count` in every variant. React Native: `Tabs` `variant="binder"`, `hue` per item, `add`.

- [#687](https://github.com/krizaka/krizaka-ui/pull/687) [`a01eca5`](https://github.com/krizaka/krizaka-ui/commit/a01eca5d9611a0e462ff5217ac2e597c2e572812) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - Add a configurable separator to BirdPlate captions, defaulting to a middle dot.

- [#687](https://github.com/krizaka/krizaka-ui/pull/687) [`a01eca5`](https://github.com/krizaka/krizaka-ui/commit/a01eca5d9611a0e462ff5217ac2e597c2e572812) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - Add `RetroTv`, a vertical video player presented in cabinet and portable television frames.

- [#687](https://github.com/krizaka/krizaka-ui/pull/687) [`a01eca5`](https://github.com/krizaka/krizaka-ui/commit/a01eca5d9611a0e462ff5217ac2e597c2e572812) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - Make Markdown references readable on small screens: keyboard-scrollable table regions with token-based edge shadows, unbroken cell identifiers, overflow-safe prose and code, and an optional host-labelled generated chip on web and native.

### Patch Changes

- [#687](https://github.com/krizaka/krizaka-ui/pull/687) [`a01eca5`](https://github.com/krizaka/krizaka-ui/commit/a01eca5d9611a0e462ff5217ac2e597c2e572812) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - DataTable: on a phone, a card never scrolls sideways — values wrap (`min-width: 0`, `overflow-wrap: anywhere`) instead of being cut at the frame's edge, even with untyped columns.

- [#687](https://github.com/krizaka/krizaka-ui/pull/687) [`a01eca5`](https://github.com/krizaka/krizaka-ui/commit/a01eca5d9611a0e462ff5217ac2e597c2e572812) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - Dependencies: radix-ui 1.8, TanStack Table 9.3 / Virtual 3.14.21 / Query 5.104.5 and zod 4.6.7 (the monthly grouped update).

- [#687](https://github.com/krizaka/krizaka-ui/pull/687) [`a01eca5`](https://github.com/krizaka/krizaka-ui/commit/a01eca5d9611a0e462ff5217ac2e597c2e572812) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - One router context for the whole package: `ChoiceGrid`, the account settings and the code block (built apart from `@krizaka/ui/router`) bundled their own copy of it, so their `routeKey` ignored the adapter given to `RouteStateProvider` and fell back to the browser's history. Every block now imports `@krizaka/ui/router` itself.

- [#687](https://github.com/krizaka/krizaka-ui/pull/687) [`a01eca5`](https://github.com/krizaka/krizaka-ui/commit/a01eca5d9611a0e462ff5217ac2e597c2e572812) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - The product nav-bar example uses `ProductBarActions`: using the app is the primary action, no « Talk to us » button in the bar (Contact is in the footer).

- [#687](https://github.com/krizaka/krizaka-ui/pull/687) [`a01eca5`](https://github.com/krizaka/krizaka-ui/commit/a01eca5d9611a0e462ff5217ac2e597c2e572812) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - The family names `ts.krizaka.com` « Krizaka TypeScript », never « Krizaka TS », in the bar, the switcher and every footer.
- Updated dependencies [[`a01eca5`](https://github.com/krizaka/krizaka-ui/commit/a01eca5d9611a0e462ff5217ac2e597c2e572812), [`a01eca5`](https://github.com/krizaka/krizaka-ui/commit/a01eca5d9611a0e462ff5217ac2e597c2e572812), [`ba195fb`](https://github.com/krizaka/krizaka-ui/commit/ba195fb1d4ec5458803777bf62abfd77ba5aa827), [`a01eca5`](https://github.com/krizaka/krizaka-ui/commit/a01eca5d9611a0e462ff5217ac2e597c2e572812), [`a01eca5`](https://github.com/krizaka/krizaka-ui/commit/a01eca5d9611a0e462ff5217ac2e597c2e572812), [`8a65333`](https://github.com/krizaka/krizaka-ui/commit/8a65333d4ec58f164178d5eab7b81709374bb45c)]:
  - @krizaka/query@0.2.2
  - @krizaka/tailwind@3.55.0
  - @krizaka/tokens@3.55.0
  - @krizaka/intl@0.4.0

## 3.54.0

### Minor Changes

- [#624](https://github.com/krizaka/krizaka-ui/pull/624) [`19958df`](https://github.com/krizaka/krizaka-ui/commit/19958dfb9051591865da3a2b2e299c56b1a2f273) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - `ChapterIndex variant="album"` ([#621](https://github.com/krizaka/krizaka-ui/issues/621)): each chapter's `cover` as a `TapedPhoto` beside its title, one short line (`detail`) and its period — the rows alternate left and right, the prints face each other, each keeps its own aspect-ratio (no layout shift), the covers after the first two load lazily. Fix ([#620](https://github.com/krizaka/krizaka-ui/issues/620)): inside a `Page` that already draws the margin, a nested margin (the chapter blocks, a Section) draws no second red rule.

### Patch Changes

- Updated dependencies []:
  - @krizaka/tailwind@3.54.0
  - @krizaka/tokens@3.54.0

## 3.53.0

### Minor Changes

- [#618](https://github.com/krizaka/krizaka-ui/pull/618) [`da1630c`](https://github.com/krizaka/krizaka-ui/commit/da1630c4707f1be592845bd421b10dc34ea0e815) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - `@krizaka/ui/chapter` ([#617](https://github.com/krizaka/krizaka-ui/issues/617)): `ChapterIndex`, `ChapterHead` and `ChapterFoot` — the chapters of a story on the Cahier's ruled lines, never boxes. The index is an ordered list, one ruled line per chapter: the number hangs in the margin beside its red rule, the serif title is the link (its hit area the whole row), the period is quiet on the right (under the title in a narrow column), the latest wears a small « New » in the hue; an optional `detail` adds a second line. The head hangs the number in the margin beside the `h1`, then one quiet line (period · reading time) and the faced → built standfirst once (the arrow is drawn, a screen reader hears `versusLabels`). The foot puts the previous and next chapters on the lines (`rel="prev"`/`"next"`) and one line back to the story. They reuse `Page`'s paper (`data-paper="lines"`, aligned on the rows) and margin (`data-margin`, the `§` numbers' ink); every word is a prop.

### Patch Changes

- Updated dependencies []:
  - @krizaka/tailwind@3.53.0
  - @krizaka/tokens@3.53.0

## 3.52.0

### Minor Changes

- [#564](https://github.com/krizaka/krizaka-ui/pull/564) [`b17498e`](https://github.com/krizaka/krizaka-ui/commit/b17498ee584faafe0794c917079c31902041ad31) Thanks [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)! - `@krizaka/ui/text-style`: `TextStylePicker`, `StyledText` and the value they share. A person chooses the look of one text role — font (the curated `@krizaka/fonts` families, by role), size (a step of the type scale), weight, line height, letter spacing, alignment, case, italic and tone (a text role or the brand hue) — as a plain value the app stores. The picker is controlled, shows a live preview, takes `presets`, `fields` and `compact`, and warns (never clamps) when the tone's contrast on the surface is under 4.5:1 for body text or 3:1 for large text, or when body text is under `minBodySize`; its words are props (`textStyleLabels` EN, `textStyleLabelsFr`). `@krizaka/ui/text-style/server` has `parseTextStyle` (zod: anything invalid, a free font, a hex colour or CSS text, answers the default), `textStyleProps` (a `className` and a `style` of CSS variables only) and `StyledText`. `zod` is now a dependency. The first user is the Akinaza storefronts (krizaka/akinaza#236). A native picker is a follow-up.

- [#563](https://github.com/krizaka/krizaka-ui/pull/563) [`35ccec0`](https://github.com/krizaka/krizaka-ui/commit/35ccec073b0ed569feb9ac01c16b3daac2245a45) Thanks [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)! - Add explained KPI, ranked next-action and glossary blocks for web pages.

### Patch Changes

- Updated dependencies [[`a4ba630`](https://github.com/krizaka/krizaka-ui/commit/a4ba6302e98a5bbef7d86b90e491fee6d0584d76)]:
  - @krizaka/intl@0.3.0
  - @krizaka/tailwind@3.52.0
  - @krizaka/tokens@3.52.0

## 3.51.0

### Minor Changes

- [#542](https://github.com/krizaka/krizaka-ui/pull/542) [`88c7a0e`](https://github.com/krizaka/krizaka-ui/commit/88c7a0e62254fb0c700f8e35ce954c53cdc29140) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - `@krizaka/ui/taped-photo`: `TapedPhoto`, a Cahier block. It is a print taped in the notebook: slightly tilted (`tilt`, eased on a phone), with a white print border, a layered paper shadow, and tape at two corners or at the top (`tape`). It holds any picture, such as an image, a video or a live scene, and takes an optional caption written on the print. The flock's scene that opens www.krizaka.com uses it, and the Polaroids of Akinaza's shop walls build on it (krizaka/akinaza#236).

### Patch Changes

- Updated dependencies []:
  - @krizaka/tailwind@3.51.0
  - @krizaka/tokens@3.51.0

## 3.50.0

### Minor Changes

- [#531](https://github.com/krizaka/krizaka-ui/pull/531) [`56e2dc4`](https://github.com/krizaka/krizaka-ui/commit/56e2dc4fe3adb8191b884e60ee5402645d372023) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - `PageTransition` takes `routeKey` (the router's pathname): only a change of page animates, an update on the same page — a
  dialog opened through the address, a filter, a search parameter — no longer cross-fades the whole page and freezes its
  layers mid-fade. Without `routeKey` the former behaviour stays.

### Patch Changes

- Updated dependencies []:
  - @krizaka/tailwind@3.50.0
  - @krizaka/tokens@3.50.0

## 3.49.0

### Minor Changes

- [#529](https://github.com/krizaka/krizaka-ui/pull/529) [`07d8b52`](https://github.com/krizaka/krizaka-ui/commit/07d8b5295454c01f0f4056b27ab836b75b5e769e) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - The family knows Krizaka TS (`ts.krizaka.com`, the TypeScript backend building blocks on npm): `SiteId` gains `"ts"`, so its bar and footer say « You are here », and the other open-source sites list it in the switcher and the footer.

- [#520](https://github.com/krizaka/krizaka-ui/pull/520) [`f1e97a9`](https://github.com/krizaka/krizaka-ui/commit/f1e97a9ded3b90f3d35ee12c39d29d170c9c8881) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - `SettingsLayout`: the sections can be in titled groups (`nav` as `SettingsNavGroup[]`), carry a count or status (`badge`), and past five a phone gets one menu (a disclosure, no script) instead of a strip of chips. A `header` slot puts who the account is above the sections, in place of `title` and `description`. The extraction of Orochia's private-space shell (krizaka-ui#515).

### Patch Changes

- Updated dependencies []:
  - @krizaka/tailwind@3.49.0
  - @krizaka/tokens@3.49.0

## 3.48.0

### Minor Changes

- [#516](https://github.com/krizaka/krizaka-ui/pull/516) [`39d780d`](https://github.com/krizaka/krizaka-ui/commit/39d780d124fcb16d54fe80763f3bbd2ca4657de8) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - `@krizaka/ui/agenda`: `Agenda`, one day's appointments in time order (tabular times, client, service, status chip, a quiet action outside the row's link) with a « now » line between the ones past and the ones to come. The time zone and the locale are props, `now` comes from the server, the open row is `aria-current` and can be an address.

- [#512](https://github.com/krizaka/krizaka-ui/pull/512) [`ceae548`](https://github.com/krizaka/krizaka-ui/commit/ceae548da212413518ebb17a18b342c45932e5fb) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - `@krizaka/ui/drop-overlay`: `DropOverlay` — the whole window is the drop target (`accept`, rejected files handed back, motion from the tokens, instant under reduced motion). `@krizaka/ui/upload-queue`: `UploadQueue` (rows that say in words what they do, live progress, result chip, one quiet action; the shimmer runs only while working) and `TaskTray` (the non-blocking container) with the `QueueStatus` vocabulary (krizaka-ui#511).

### Patch Changes

- Updated dependencies []:
  - @krizaka/tailwind@3.48.0
  - @krizaka/tokens@3.48.0

## 3.47.0

### Minor Changes

- [#504](https://github.com/krizaka/krizaka-ui/pull/504) [`dab0bb9`](https://github.com/krizaka/krizaka-ui/commit/dab0bb93c5dd7eb6b2dbc45afbe1308a8097a96c) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - `@krizaka/ui/account-settings`: `AccountProfileCard` (picture and change action, name, e-mail with its verification, member since), `AvatarPicker` (a radiogroup grid of the family's default pictures with an upload slot), `ChoiceCards` (a single choice as cards with icon, title, description) and `LanguagePicker` (labelled, native names). `SettingsSection` gets `save`: one inline save per section (enabled while dirty, saving / saved with Undo / error as a live region), with `useSaveStatus` and `SaveStatus`. Section patterns (security, subscription, storage, my data) as registry examples (krizaka-ui#502).

### Patch Changes

- Updated dependencies []:
  - @krizaka/tailwind@3.47.0
  - @krizaka/tokens@3.47.0

## 3.46.0

### Minor Changes

- [#506](https://github.com/krizaka/krizaka-ui/pull/506) [`b4000e2`](https://github.com/krizaka/krizaka-ui/commit/b4000e2ef8fb950557c9c589cb85d2e17bf0910f) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - `ProductBarActions` and `productBarActions` (`@krizaka/ui/nav-bar`): the one definition of a product bar's right side — using the app is the primary action (« Sign in » while sign-up is closed, « Try » once it opens), « Sign in » is not repeated beside it, and « Contact » leaves the bar for the footer.

### Patch Changes

- Updated dependencies []:
  - @krizaka/tailwind@3.46.0
  - @krizaka/tokens@3.46.0

## 3.45.0

### Minor Changes

- [#499](https://github.com/krizaka/krizaka-ui/pull/499) [`c2e5d17`](https://github.com/krizaka/krizaka-ui/commit/c2e5d17c9cce68d5a5be8e9d7a42b5fc69ce45b9) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - `PageTransition` in `@krizaka/ui/motion`: wrap the root layout's `children` once and a navigation cross-fades and rises (React's `ViewTransition` where the runtime has it, plain children otherwise), from the `--kz-motion-*` tokens; `motion.css` (« PAGE TRANSITIONS ») turns every view transition of the document off under `prefers-reduced-motion`.

### Patch Changes

- [#501](https://github.com/krizaka/krizaka-ui/pull/501) [`2c7ff73`](https://github.com/krizaka/krizaka-ui/commit/2c7ff7346a4a38228784c5e9de072883e5153628) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - Web and native share their logic: `form/core` now holds `FormField`, `FieldArray` and `Watch`; `meter/model` the Meter's ratio, tone, words and ring arcs; `vertical-video/model` the labels and the shared props. No API change.
- Updated dependencies []:
  - @krizaka/query@0.2.1
  - @krizaka/tailwind@3.45.0
  - @krizaka/tokens@3.45.0

## 3.44.0

### Minor Changes

- [#488](https://github.com/krizaka/krizaka-ui/pull/488) [`c4a6ce1`](https://github.com/krizaka/krizaka-ui/commit/c4a6ce1091e1c7f64b943e3cf8681cf52c169195) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - The URL is the state, made impossible to forget (Oussama, 2026-10-22: « changer les tabs doit changer les routes »).
  
  - New `@krizaka/ui/router`: `useRouteState(key, { values, default, history })` keeps a value in a search parameter, typed from an `as const` list (an unknown value reads as the default, the default is never written, other parameters are kept); `RouteStateProvider` takes your router's adapter once (the History API is the default); pure `readRouteValue` / `writeRouteValue`.
  - `routeKey` (+ `routeValues`) on `Tabs.Root`, `Chip.Group` (single) and `ChoiceGrid`: they bind to the URL, no `useState`. Local state stays for ephemeral UI only.
  - `@krizaka/config`: the rule `krizaka/route-state-selection` (in `krizakaStack()`, severity of the stack, only pages and route components) refuses a Tabs / Chip.Group / ChoiceGrid / SegmentedControl / ToggleGroup driven by local state without `routeKey`, unless the line carries `// @ephemeral: <reason>`; the ratchet counts it as `routeStateSelection` (only goes down).

- [#488](https://github.com/krizaka/krizaka-ui/pull/488) [`c4a6ce1`](https://github.com/krizaka/krizaka-ui/commit/c4a6ce1091e1c7f64b943e3cf8681cf52c169195) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - `Tabs` as routes: `Tabs.Nav` + `Tabs.NavLink`. Each tab is a link (`href`, or your router's `Link` with `asChild`), the active one comes from the current route passed in (`current`: the path with its search; `isTabActive` is exported), so the URL is the state and no local state exists. Per WAI-ARIA these are links in a named navigation with `aria-current="page"` (not a tablist): Tab walks them, Enter follows. Same three variants and the same gliding light as `Tabs.List`. Tests, meta and an example (`routes`) included.

### Patch Changes

- Updated dependencies []:
  - @krizaka/query@0.2.1
  - @krizaka/tailwind@3.44.0
  - @krizaka/tokens@3.44.0

## 3.43.1

### Patch Changes

- [#492](https://github.com/krizaka/krizaka-ui/pull/492) [`f032b3b`](https://github.com/krizaka/krizaka-ui/commit/f032b3b5693e233c397e579b0452951033ed9932) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - Products wear plain Krizaka UI: under `data-surface="product"` on the root (an app themed at :root: set it on `<html>`) or a product brand (`.brand-orazaka`, `-orochia`, `-yasakia`, `-yororis`, `-yomizaka`, `-kachizaka`, `-akinaza`) the margin ink (`--kz-paper-rule-margin`, the red of every eyebrow, folio and margin note) is the brand's accent text colour; the red margin stays on the Krizaka sites. The same scope drops the notebook's faces: headings use the sans (`--kz-font-display` → `--kz-font-sans`, semibold) and the mono is the system monospace (no Young Serif, no Courier Prime). krizaka.com, the blog and ui.krizaka.com keep them. Test: the list equals the product brands of @krizaka/tokens. Fixes [#491](https://github.com/krizaka/krizaka-ui/issues/491).
- Updated dependencies []:
  - @krizaka/tailwind@3.43.1
  - @krizaka/tokens@3.43.1

## 3.43.0

### Minor Changes

- [#474](https://github.com/krizaka/krizaka-ui/pull/474) [`f354137`](https://github.com/krizaka/krizaka-ui/commit/f354137cca01e24652ec46ee9c25d250441d6f43) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - feat: `Elephant` (`@krizaka/ui/elephant`) — the small flying-elephant mark of the neighbour joke (« the elephant with those ears can fly »), standing or flying, sage and sand, flat, in the Krizaka line (krizaka-ui#469).

- [#476](https://github.com/krizaka/krizaka-ui/pull/476) [`398abbc`](https://github.com/krizaka/krizaka-ui/commit/398abbcc9e49188da5bbc7cb72d9651e9e715741) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - Dialog, Sheet, Popover and Tabs enter and leave with motion. The overlay and the panel enter with `@starting-style` (no JavaScript); they leave with a short keyframe exit, so the element stays mounted until the exit has played. Tabs panels fade in when they open. Durations and easings come from the `--kz-motion-*` tokens; under reduced motion the change is instant.

- [#475](https://github.com/krizaka/krizaka-ui/pull/475) [`03f349d`](https://github.com/krizaka/krizaka-ui/commit/03f349dc014414c2b4c87817ce5c912b271ab998) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - `@krizaka/ui/motion` gains the page-transition helpers: `runViewTransition`, `transitionPage`, `crossFallback`, `canViewTransition` and `sharedElementStyle`. A change of page or step goes through `document.startViewTransition` where the platform has it, a root cross-fade otherwise, and is instant under reduced motion. The DOM always updates.

- [#486](https://github.com/krizaka/krizaka-ui/pull/486) [`0b1d80d`](https://github.com/krizaka/krizaka-ui/commit/0b1d80dfe9fc742e902ce64916efda27f52e9505) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - No more family switcher: krizaka.com is the only way back between the Krizaka sites (Oussama, 2026-10-22).
  
  - `NavBar.Family` is deprecated (removed in the next minor once no site uses it).
  - `SiteFooter` lists the family on the hub only: `family` now defaults to `current === "krizaka"`, so every other site's footer holds its own columns, the legal links and one quiet « A Krizaka project » line linking to www.krizaka.com. New `products` prop filters the hub's Products column (krizaka.com's focus products), replacing CSS that hid links by URL.
  - `@krizaka/config`: the `krizaka/no-family-switcher` rule (an error in `krizakaStack()`) refuses `NavBar.Family` so it does not come back.

### Patch Changes

- [#484](https://github.com/krizaka/krizaka-ui/pull/484) [`03c4880`](https://github.com/krizaka/krizaka-ui/commit/03c4880ae3d8c95d8c3e51568e636a98bceda488) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - AppShell and RailNav: collapsing the sidebar no longer lets the brand name or the footer text spill over the content. The sidebar clips its width transition; the brand name shrinks away with the width, a text-only footer fades and narrows with it (a footer with controls stays, clipped); words stay in the tree for screen readers; reduced motion is instant. Fixes [#482](https://github.com/krizaka/krizaka-ui/issues/482).
- Updated dependencies [[`f354137`](https://github.com/krizaka/krizaka-ui/commit/f354137cca01e24652ec46ee9c25d250441d6f43)]:
  - @krizaka/tokens@3.43.0
  - @krizaka/tailwind@3.43.0
  - @krizaka/query@0.2.1

## 3.42.0

### Minor Changes

- [#466](https://github.com/krizaka/krizaka-ui/pull/466) [`d66fd35`](https://github.com/krizaka/krizaka-ui/commit/d66fd35b25c40dbbe3ca411f4da0b25d0c56528c) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - Flock `scenes`: each bird does a short scene true to its promise — the owl reads a book and turns a leaf, the flamingo and the lovebird talk with a speech mark and their neighbour answers, the crane steps out and bows, the beaver taps a log, the magpie takes a shiny point, the duck builds, the falcon scans — and the pigeon hands its parcel over (it flies back light) while the receiver reacts in its own way. One scene at a time, picked at random with long pauses now and then. CSS-free: Web Animations on a few small elements and timers between scenes, none off screen or under reduced motion. The flock now also waits for `html[data-motion="settling"]` and its stage is a `data-motion-scope` (the page pauses its loops off screen). `Mascot` gets `carrying` (the pigeon's parcel).

- [#463](https://github.com/krizaka/krizaka-ui/pull/463) [`8875459`](https://github.com/krizaka/krizaka-ui/commit/887545936a29f32d6b231e4a17b54aaf5c0895bb) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - `SiteFooter`: one band, for real. The hairline between the columns and the last line is gone (a bottom bar under the columns read as a second footer). New `path` prop: the company link that points to the page you are on (« Our story » on /story) carries `aria-current="page"` with a visible state (semibold), and a click on it scrolls to the top instead of reloading the page. `@krizaka/ui/sites`: Yororis is `development` (its card and footer chip say « In development »).

### Patch Changes

- Updated dependencies []:
  - @krizaka/query@0.2.1
  - @krizaka/tailwind@3.42.0
  - @krizaka/tokens@3.42.0

## 3.41.1

### Patch Changes

- [#454](https://github.com/krizaka/krizaka-ui/pull/454) [`cc3738c`](https://github.com/krizaka/krizaka-ui/commit/cc3738cde0d17e5821f64c990d00a762237708e1) Thanks [@oussamaABID](https://github.com/oussamaABID)! - `@krizaka/ui/sites`: the products' public addresses are `https://www.<product>.com` (the real app, sign-up closed; the apex answers 308 with www). The `dev.<product>.com` hosts are development hosts: not indexed, they send their pages to www. Every family footer, switcher and card that reads this list now links www (krizaka/.github#119).
- Updated dependencies []:
  - @krizaka/tailwind@3.41.1
  - @krizaka/tokens@3.41.1

## 3.41.0

### Minor Changes

- [#448](https://github.com/krizaka/krizaka-ui/pull/448) [`1931976`](https://github.com/krizaka/krizaka-ui/commit/19319768f0bb428cc33e4f18d33d0db604e893bf) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - feat(flock): `active` (the bird the page points at looks up and jumps), `greet` (every bird jumps once as the flock first comes into view) and `tempo` (more frequent glances and deliveries) — the flock can be tied to the page it stands in.

### Patch Changes

- Updated dependencies []:
  - @krizaka/tailwind@3.41.0
  - @krizaka/tokens@3.41.0

## 3.40.1

### Patch Changes

- [#445](https://github.com/krizaka/krizaka-ui/pull/445) [`02bedd2`](https://github.com/krizaka/krizaka-ui/commit/02bedd2173ae66ae331f13a2c3d3b1bbdcc996a6) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - fix(examples): the Progress « Bar sizes » example had zero width in a centred stage (its bars are `w-full`); the Action bar example points at the Discussions that exist.
- Updated dependencies []:
  - @krizaka/tailwind@3.40.1
  - @krizaka/tokens@3.40.1

## 3.40.0

### Minor Changes

- [#441](https://github.com/krizaka/krizaka-ui/pull/441) [`e34eb65`](https://github.com/krizaka/krizaka-ui/commit/e34eb65ba5831766eb8faf9299a94204f2e66637) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - feat: `Flock` (`@krizaka/ui/flock`) and `Mascot life` — the birds at ease in character (the falcon watches, the owl reads, the duck builds, the flamingo answers, the pigeon delivers), two neighbours glancing at each other, the pigeon carrying its parcel across, a bird looking up when you come near. CSS in `blocks.css`, one timer for the moments, paused off screen, still under reduced motion.

### Patch Changes

- [#439](https://github.com/krizaka/krizaka-ui/pull/439) [`bf2e799`](https://github.com/krizaka/krizaka-ui/commit/bf2e799ed24c31858532bb6d3bca1e95b7b105ce) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - fix(examples): the examples of the registry point at repositories and pages that exist (`krizaka-build` for Krizaka Java, the Discussions of `krizaka-ui`) — found by the documentation crawler.
- Updated dependencies []:
  - @krizaka/tailwind@3.40.0
  - @krizaka/tokens@3.40.0

## 3.39.0

### Minor Changes

- [#438](https://github.com/krizaka/krizaka-ui/pull/438) [`5c1be17`](https://github.com/krizaka/krizaka-ui/commit/5c1be17e633ae3133bf539a4f396aca746e54fad) Thanks [@oussamaABID](https://github.com/oussamaABID)! - SiteFooter is one calm band (krizaka-ui#434, peer review: « too much, a double footer »): the site's own columns beside the family's — Products · Open source (GitHub closes it) · Krizaka (our story, the blog, contact, in the reader's language) — then one line: signature, version, Montréal, legal links. The site block (the site's mark and line, which the bar already says) and the column that listed only Krizaka are gone. `@krizaka/ui/sites` adds `companyLinks` and, in `FamilyLabels`, `lang` and `company` (optional; the English words by default). www no longer passes a column of its own.

- [#435](https://github.com/krizaka/krizaka-ui/pull/435) [`9905a43`](https://github.com/krizaka/krizaka-ui/commit/9905a4386e18de2c16a2c55d5fc0e455bc89405e) Thanks [@oussamaABID](https://github.com/oussamaABID)! - Lining figures (ADR-004, krizaka-ui#417): Young Serif draws old-style digits by default, so a statistic's « 4 514 » and « 39 » sat on uneven heights. `--kz-figures` (`lining-nums tabular-nums`) is the token for every figure; the preset makes `tabular-nums` lining too (an explicit `oldstyle-nums` still wins); NumberTicker, the stat band, the price, the chapter and error numbers, the decision numbers and the story's stats read the token; native `fontVariant` asks for `lining-nums`.

### Patch Changes

- [#433](https://github.com/krizaka/krizaka-ui/pull/433) [`9d66d26`](https://github.com/krizaka/krizaka-ui/commit/9d66d260d3f83a30e782f703db1d2b7a66eca2af) Thanks [@oussamaABID](https://github.com/oussamaABID)! - **Cahier, the last pills ([#417](https://github.com/krizaka/krizaka-ui/issues/417)):** `ChipLink`, the kanban's count, the video trimmer's « kept » label, the photo grid's « main » tag, the location picker's chip and button, the step showcase's pause button and the slider's track, range and ticks are square paper (2 px); dots, avatars and thumbs stay round. The guard test covers them.
- Updated dependencies [[`9905a43`](https://github.com/krizaka/krizaka-ui/commit/9905a4386e18de2c16a2c55d5fc0e455bc89405e)]:
  - @krizaka/tokens@3.39.0
  - @krizaka/tailwind@3.39.0

## 3.38.0

### Minor Changes

- [#431](https://github.com/krizaka/krizaka-ui/pull/431) [`bf3ed81`](https://github.com/krizaka/krizaka-ui/commit/bf3ed81e5d4891609679eddceca0291ce3efd176) Thanks [@oussamaABID](https://github.com/oussamaABID)! - **Cahier, the blocks' own corners and shadows (ADR-004, [#417](https://github.com/krizaka/krizaka-ui/issues/417)):** every card corner of 10 px or more in `blocks.css` and `motion.css` is square paper, and every blurred shadow (the templates' coloured stage glow included) is gone or the paper offset. The landing and product templates' visual is a plate, no longer a fake browser window: the three dots are gone, the bar is its caption. `src/cahier.test.ts` now also reads the shipped stylesheets.

### Patch Changes

- Updated dependencies []:
  - @krizaka/tailwind@3.38.0
  - @krizaka/tokens@3.38.0

## 3.37.0

### Minor Changes

- [#428](https://github.com/krizaka/krizaka-ui/pull/428) [`a3f8f85`](https://github.com/krizaka/krizaka-ui/commit/a3f8f85c4c37252f126c55cb307b61fd645b56d8) Thanks [@oussamaABID](https://github.com/oussamaABID)! - **Cahier, the chrome (ADR-004, [#417](https://github.com/krizaka/krizaka-ui/issues/417)):** the bar is square paper — the floating bar, its items, its icon buttons and menus lose the pill (2 px); badges, chips, tabs, the language switch, toasts, progress and meter tracks, the step progress, the slot picker and the footer's tags are square too (dots stay round). The badge and the card's stat label lose their uppercase tracking; a `glass` card is an opaque sheet. A new test (`src/cahier.test.ts`) refuses an uppercase tracked label, a frosted chrome (outside a scrim over a media) and a pill on the chrome.

### Patch Changes

- Updated dependencies []:
  - @krizaka/tailwind@3.37.0
  - @krizaka/tokens@3.37.0

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

### Patch Changes

- Updated dependencies [[`01cfb77`](https://github.com/krizaka/krizaka-ui/commit/01cfb7758294d04434af401f9ae92e292643e405)]:
  - @krizaka/tokens@3.36.0
  - @krizaka/tailwind@3.36.0

## 3.35.0

### Minor Changes

- [#412](https://github.com/krizaka/krizaka-ui/pull/412) [`4fca4cc`](https://github.com/krizaka/krizaka-ui/commit/4fca4ccb3e0696c31d4e49c2fcce274b4cdf7644) Thanks [@oussamaABID](https://github.com/oussamaABID)! - sites: Krizaka Motion (the motion lab, krizaka.github.io/krizaka-motion) joins the family's open-source group — every family switcher (`NavBar.Family`) and family footer (`SiteFooter`) lists it after a bump, in English and French.

### Patch Changes

- Updated dependencies []:
  - @krizaka/tailwind@3.35.0
  - @krizaka/tokens@3.35.0

## 3.34.0

### Minor Changes

- [#414](https://github.com/krizaka/krizaka-ui/pull/414) [`bf46e00`](https://github.com/krizaka/krizaka-ui/commit/bf46e00276b5701fdeb7ccaafd2991d46d78009a) Thanks [@oussamaABID](https://github.com/oussamaABID)! - `Route` joins the motion vocabulary: `easing` (`ease-out`, `linear`, `ease-in-out`) shapes the drawing and the trips, and `paused` holds both where they are (on top of the off-screen pause).

- [#415](https://github.com/krizaka/krizaka-ui/pull/415) [`960fe68`](https://github.com/krizaka/krizaka-ui/commit/960fe68737cf6e4d8944bde1d7c255578ce006cf) Thanks [@oussamaABID](https://github.com/oussamaABID)! - `TerminalReplay` joins the motion vocabulary: `speed`, a multiplier on every delay (typing, lines, between commands) — 2 plays twice as fast, 0.5 half as fast.

- [#413](https://github.com/krizaka/krizaka-ui/pull/413) [`ba85188`](https://github.com/krizaka/krizaka-ui/commit/ba85188842da039c8bafc7af44da8201c88b4237) Thanks [@oussamaABID](https://github.com/oussamaABID)! - `NumberTicker` joins the motion vocabulary: `duration` now drives the digit roll (`trigger="change"`) as well as the climb, and the new `easing` (`ease-out`, `linear`, `ease-in-out` or any CSS easing) shapes both, through `--kz-count-duration` / `--kz-count-ease` on the figure. Unset, nothing changes.

### Patch Changes

- [#408](https://github.com/krizaka/krizaka-ui/pull/408) [`4d0dec1`](https://github.com/krizaka/krizaka-ui/commit/4d0dec17a5e0ed3efd658cfc51d2e654b5d7938b) Thanks [@oussamaABID](https://github.com/oussamaABID)! - Button: the « Sizes » example wraps on a narrow phone (360 px) instead of running 2 px past its frame.

- [#411](https://github.com/krizaka/krizaka-ui/pull/411) [`5bea576`](https://github.com/krizaka/krizaka-ui/commit/5bea576b1b4b38da2f9d7db86113050c3d495b30) Thanks [@oussamaABID](https://github.com/oussamaABID)! - DayStrip: bringing the chosen day into view scrolls the strip only, never the page. A strip low on a page used to pull the whole page down to it when it appeared (`scrollIntoView`).
- Updated dependencies []:
  - @krizaka/tailwind@3.34.0
  - @krizaka/tokens@3.34.0

## 3.33.1

### Patch Changes

- [`f552d5e`](https://github.com/krizaka/krizaka-ui/commit/f552d5eee4d81b66103b5e7492b450919805b1b5) Thanks [@oussamaABID](https://github.com/oussamaABID)! - `.kz-grow` really grows a chart: it wipes the whole SVG in from the left (`kz-grow-wipe`) instead of drawing each path's stroke, which never matched the charts' markup (classes, not stroke attributes). Works on a Sparkline's line, area and bars alike.
- Updated dependencies []:
  - @krizaka/tailwind@3.33.1
  - @krizaka/tokens@3.33.1

## 3.33.0

### Minor Changes

- [#401](https://github.com/krizaka/krizaka-ui/pull/401) [`719a57b`](https://github.com/krizaka/krizaka-ui/commit/719a57b1eab537ffa5a39e0a69cd9c49142e37f4) Thanks [@oussamaABID](https://github.com/oussamaABID)! - `motion.css`: arrival and growth, moved out of the Krizaka Motion lab. `data-kz-arrive` on an element or a cell (its table row or list item follows) plays an arrival once — `slide` (default), `fade` or `flash`, chosen by `data-kz-arrival` on an ancestor, `--kz-arrive-duration`; `.kz-grow` around a Sparkline draws its stroke and raises its fill over `--kz-grow-duration` with `--kz-grow-ease`. CSS only, paused off screen, resting done under reduced motion.

### Patch Changes

- [#400](https://github.com/krizaka/krizaka-ui/pull/400) [`7a6103f`](https://github.com/krizaka/krizaka-ui/commit/7a6103f44af8af79627f304c717bf794742d9888) Thanks [@oussamaABID](https://github.com/oussamaABID)! - `Map` follows the page's theme even when it flips before the engine has loaded: the map was created with the scheme of its first render and never corrected (a light page showed the dark basemap). The scheme is read when the engine is ready, and the effect applies any difference.
- Updated dependencies []:
  - @krizaka/tailwind@3.33.0
  - @krizaka/tokens@3.33.0

## 3.32.0

### Minor Changes

- [#396](https://github.com/krizaka/krizaka-ui/pull/396) [`91d044f`](https://github.com/krizaka/krizaka-ui/commit/91d044f157d2b60e06a77913c4782c90f102a840) Thanks [@oussamaABID](https://github.com/oussamaABID)! - **A steel blue, one button shape, a quiet hover** (krizaka-ui#393, ADR-003).
  
  - **Tokens.** The Krizaka accent is a steel blue, hue 208 — the exact complement of the Orazaka orange — at ≤ 60 % saturation, instead of the electric `#196df5`: `accent` `hsl(208 46% 45%)` / light `hsl(208 54% 36%)`, `accent-text` `hsl(206 58% 72%)` / `hsl(208 54% 33%)`, a slate section gradient, and every product's `info` on the same steel. AA tested in both themes. The Krizaka mark follows (`marks.krizaka`). The products' colours do not change.
  - **Button.** One shape: an 8 px radius (`--kz-radius-sm`, the radius of a field), `pill` on demand. `shape="cut"` is a deprecated alias of it (a warning in development); `shimmer` and `magnetic` are deprecated no-ops.
  - **The quiet hover.** A hover changes a colour, never a position: the cards of the blocks (LinkCard, ArgumentCard, CardGrid), Card `interactive`, ServiceCard and GlowCard step their surface and hairline in 150 ms, with a 2 px focus ring. No lift, no zoom, no light following the pointer. `PointerLight`/`usePointerLight`, `CardGrid light`/`hover`, `LinkCard hover`, `ArgumentCard hover` and `GlowCard glow="spotlight"` are deprecated no-ops; GlowCard's ring is still; MotionObserver no longer follows the pointer. The examples `link-card/hover-light` and `argument-card/hover-light` are removed.

### Patch Changes

- Updated dependencies [[`91d044f`](https://github.com/krizaka/krizaka-ui/commit/91d044f157d2b60e06a77913c4782c90f102a840)]:
  - @krizaka/tokens@3.32.0
  - @krizaka/tailwind@3.32.0

## 3.31.0

### Minor Changes

- [#395](https://github.com/krizaka/krizaka-ui/pull/395) [`6d2f740`](https://github.com/krizaka/krizaka-ui/commit/6d2f740164267cd3583814c12011612a0507ab30) Thanks [@oussamaABID](https://github.com/oussamaABID)! - `EngineFlow` config, the first of Krizaka Motion's shared vocabulary: `density` (`sparse` · `normal` · `dense`: photons per conduit), `trigger` (`always` · `hover` · `active`: when they travel), `easing` (`linear`, `ease-in-out` or any CSS easing), `stagger` (ms between conduits) and `breathe` (the engine's mark), next to `speed`, `layout`, `compactLayout`, `particles` and `conduit`. Exports `photonCount`, `FlowDensity`, `FlowTrigger`, `FlowEasing`.

- [#395](https://github.com/krizaka/krizaka-ui/pull/395) [`6d2f740`](https://github.com/krizaka/krizaka-ui/commit/6d2f740164267cd3583814c12011612a0507ab30) Thanks [@oussamaABID](https://github.com/oussamaABID)! - `@krizaka/ui/map` motion: `Route` (a line that draws itself once when the map is on screen, and a `courier` that makes a trip — one, or `repeatAfter` while visible; finite frames, nothing runs afterwards), `Pulse` (a heat pulse around a hot spot), `Marker drop={delay}` (a pin that drops onto its place), and the geometry behind them (`pathLength`, `pointAlong`, `sliceLine`). Everything is in place at once under reduced motion; the route is read in the list of places. Example `map/route`.

### Patch Changes

- [#375](https://github.com/krizaka/krizaka-ui/pull/375) [`b2bf5dd`](https://github.com/krizaka/krizaka-ui/commit/b2bf5dd7a50ba60f166001eb06d60e753e0f3af6) Thanks [@oussamaABID](https://github.com/oussamaABID)! - `export-brand`: the favicon's PNG sizes (`favicon-32.png`, `apple-touch-icon.png` 180, `icon-192.png`, `icon-512.png`) are exported next to `favicon.svg` for every brand, so a site's tab, home-screen and manifest icons come from the current mark.

- [#394](https://github.com/krizaka/krizaka-ui/pull/394) [`b1b2ee1`](https://github.com/krizaka/krizaka-ui/commit/b1b2ee1e4bc7f50d0096f474bd8a2b3878678fed) Thanks [@oussamaABID](https://github.com/oussamaABID)! - `EngineFlow`: the photons travel again and the engine breathes. The `kz-flow-in/out` keyframes animated `stroke-dashoffset` to `calc(var(--kz-flow-gap) * -1)`, a unitless number the browser cannot interpolate with a length, so each dot only flipped between two equivalent offsets and looked frozen on every site; the gap now carries its unit (`* -1px`). The hub's mark swells slowly in the loop system (`kz-loop`: held off screen and while the page settles, still under reduced motion). The Storybook stories sample the dash offsets in a real browser and fail if nothing moves (or if something moves under reduced motion).

- [#375](https://github.com/krizaka/krizaka-ui/pull/375) [`b2bf5dd`](https://github.com/krizaka/krizaka-ui/commit/b2bf5dd7a50ba60f166001eb06d60e753e0f3af6) Thanks [@oussamaABID](https://github.com/oussamaABID)! - `sites`: Kachizaka and Akinaza now have their dev sites (`dev.kachizaka.com`, `dev.akinaza.com`), Yasakia's line says what it is (real people, introductions and photos checked before you see them) and Orazaka's is product-first, in English and French.
- Updated dependencies []:
  - @krizaka/tailwind@3.31.0
  - @krizaka/tokens@3.31.0

## 3.30.0

### Minor Changes

- [#373](https://github.com/krizaka/krizaka-ui/pull/373) [`ec6d0cb`](https://github.com/krizaka/krizaka-ui/commit/ec6d0cb46cb7722b92f8620df19a86665baa5345) Thanks [@oussamaABID](https://github.com/oussamaABID)! - `@krizaka/ui/native` chat: `MessageBubble` takes `children` (a Markdown answer in the same bubble shape), `MessageComposer` takes a `meta` line and `ComposerMeta` draws the model chip and a status line with a shield (krizaka-ui#246, parts 2 and 3).

- [#376](https://github.com/krizaka/krizaka-ui/pull/376) [`4bd80a7`](https://github.com/krizaka/krizaka-ui/commit/4bd80a762c03c0484fa71f12fa40e0d76892d8c8) Thanks [@oussamaABID](https://github.com/oussamaABID)! - `NavBar.Menu`: the inline links of a short section (3 or fewer) now stand in the bar from `lg` up (`inlineFrom`, `"md" | "lg" | "xl"`, default `lg`); between the phone panel and that breakpoint the section is the dropdown, so long French labels no longer overflow a 768 px bar. Products can drop their `inlineUpTo={0}` overrides.

### Patch Changes

- Re-publish of 3.29.0: npm accepted `@krizaka/ui@3.29.0` into staging but never released it (409 « previously staged », no staged version listed), while `tokens` and `tailwind` 3.29.0 are live and require `@krizaka/ui ^3.29.0`. Same content as 3.29.0 (`EngineFlow`, `DocsHubPage linksLayout="stack"`).
- Updated dependencies []:
  - @krizaka/tailwind@3.30.0
  - @krizaka/tokens@3.30.0

## 3.29.0

### Minor Changes

- [#372](https://github.com/krizaka/krizaka-ui/pull/372) [`520c85a`](https://github.com/krizaka/krizaka-ui/commit/520c85aff59dfecf102afdda3990dd1e7fbf8afc) Thanks [@oussamaABID](https://github.com/oussamaABID)! - `DocsHubPage`: `linksLayout="stack"` puts one quick link per line in every collection (default `wrap` unchanged), so the first link of each card starts at the same height (krizaka-ui#212).

- [#371](https://github.com/krizaka/krizaka-ui/pull/371) [`2d7e80a`](https://github.com/krizaka/krizaka-ui/commit/2d7e80a8967b11727e1646e4c25b630b3e542de8) Thanks [@oussamaABID](https://github.com/oussamaABID)! - `@krizaka/ui/engine-flow`: `EngineFlow` — an engine at the hub and the apps it serves around it, with photons travelling each conduit in (requests), out (results) or both, in the app's brand going in and the hub's coming back; planned apps dim, dashed and still. Radial, top to bottom or left to right, with a compact layout under 560 px (top to bottom by default); S-shaped Bézier or straight conduits. SVG + CSS only (motion.css `kz-flow`): paused off screen, held while the page settles, a still frame under reduced motion — no animation frame, no canvas. Each node is a button; the detail line (polite live region) says the chosen node's line and link. The generic primitive of krizaka-motion's « Orazaka Neural Pipeline Flow ».

### Patch Changes

- Updated dependencies []:
  - @krizaka/tailwind@3.29.0
  - @krizaka/tokens@3.29.0

## 3.28.0

### Minor Changes

- [#361](https://github.com/krizaka/krizaka-ui/pull/361) [`d4386c9`](https://github.com/krizaka/krizaka-ui/commit/d4386c9ac330cd25dc033742e0086619d74faa3f) Thanks [@oussamaABID](https://github.com/oussamaABID)! - `@krizaka/ui/chip-row`: `ChipRow` and `ChipRow.Item` — a row of chip links that scrolls sideways with scroll-snap on a phone (fading edge, no scrollbar) and wraps from `md`; 44 px targets, `aria-current`, a `badge` (« Soon »), arrow-key focus (krizaka-ui#342).

- [#367](https://github.com/krizaka/krizaka-ui/pull/367) [`83f266f`](https://github.com/krizaka/krizaka-ui/commit/83f266f514bcc3b31574b5b64f00e4fd94c666c8) Thanks [@oussamaABID](https://github.com/oussamaABID)! - `@krizaka/ui/native`: `SettingsGroup` and `SettingsRow` — a titled card of hairline-divided rows (icon tile, label, help, value or control, a chevron when the row opens something; a button named by its visible words). The native twin of the web `SettingsRow` (krizaka-ui#246, part 1).

### Patch Changes

- Updated dependencies []:
  - @krizaka/tailwind@3.28.0
  - @krizaka/tokens@3.28.0

## 3.27.0

### Minor Changes

- [#347](https://github.com/krizaka/krizaka-ui/pull/347) [`a38ba39`](https://github.com/krizaka/krizaka-ui/commit/a38ba39fbab4769d75f297f3377caa56bd0cca47) Thanks [@oussamaABID](https://github.com/oussamaABID)! - `@krizaka/ui/language-switch/server`: `languagesFor`, `languageHref` and `languageNames` without the "use client" banner, so a Server Component can call them (the `language-switch` entry stays client and re-exports them for compatibility).

- [#346](https://github.com/krizaka/krizaka-ui/pull/346) [`edce6c3`](https://github.com/krizaka/krizaka-ui/commit/edce6c3530393a5925b8dd3b97f37f706594eb90) Thanks [@oussamaABID](https://github.com/oussamaABID)! - `NavBar.Menu`: a section of three links or fewer is not a dropdown any more — its links stand in the bar as plain links, the current one marked (`inlineUpTo`, 3 by default; `0` keeps a dropdown, above the limit it is a dropdown as before). The phone panel is unchanged. « Navigation in the family » says it.

### Patch Changes

- [#360](https://github.com/krizaka/krizaka-ui/pull/360) [`4b91705`](https://github.com/krizaka/krizaka-ui/commit/4b917052a32cb7e1f51f8159d93483774639af94) Thanks [@oussamaABID](https://github.com/oussamaABID)! - `ImageCropper` (web): a picture that was already loaded before React attached (cache, server render) is measured on mount, so a portrait source covers the frame at any zoom; the box's percentages are rounded so float noise never drops a `top` / `left`.

- [#359](https://github.com/krizaka/krizaka-ui/pull/359) [`159e685`](https://github.com/krizaka/krizaka-ui/commit/159e685ea5de50e1d3d968dfdd8aef96399881b1) Thanks [@oussamaABID](https://github.com/oussamaABID)! - `locateQuote` (DocumentViewer): a quote starting in the middle of a text item is boxed from where its glyphs start (shared by sans-serif advance widths) instead of an even share of the item, so highlights no longer begin a few characters late.

- [#357](https://github.com/krizaka/krizaka-ui/pull/357) [`df6aecb`](https://github.com/krizaka/krizaka-ui/commit/df6aecb8c58b527a0da24a8a76ccbba81060e72c) Thanks [@oussamaABID](https://github.com/oussamaABID)! - `languageHref`: the path split no longer uses a backtracking regular expression (CodeQL polynomial ReDoS); a regression test guards a very long path.

- [#350](https://github.com/krizaka/krizaka-ui/pull/350) [`b2688ce`](https://github.com/krizaka/krizaka-ui/commit/b2688cecb66c7260a3a2b7e867513a7fe9dd6378) Thanks [@oussamaABID](https://github.com/oussamaABID)! - `WuSamaMark` shares Krizaka's contour: the hexagonal shield, the open vertex with a lit blue node and the centre W in Krizaka blue.
- Updated dependencies []:
  - @krizaka/tailwind@3.27.0
  - @krizaka/tokens@3.27.0

## 3.26.0

### Minor Changes

- [#336](https://github.com/krizaka/krizaka-ui/pull/336) [`022a3cd`](https://github.com/krizaka/krizaka-ui/commit/022a3cd17ec971df4aa0fdf3a713e7bd8a418d17) Thanks [@oussamaABID](https://github.com/oussamaABID)! - Navigation standard (NAV-STD). `NavBar` menus: the panel is 28 rem (40 rem in two columns, never wider than the page between its gutters), aligned under its trigger and kept inside the page (`placePanel`), its descriptions wrap on two lines at most instead of being cut on one, the icon tile stays at the top. New `@krizaka/ui/language-switch` — `LanguageSwitch`, `languagesFor(path)`, `languageHref(path, to)`: a globe and the current code (`FR`) opening a menu of the languages named in their own language, as links with `hreflang` that keep the page; `variant="inline"` for a panel. `NavBar.Language` (a menu in the bar, a row in the mobile panel) and `NavBar.MobilePreferences` (the panel's last group: theme, language) place it. It replaces the pill that names the other language.

### Patch Changes

- Updated dependencies []:
  - @krizaka/tailwind@3.26.0
  - @krizaka/tokens@3.26.0

## 3.25.0

### Minor Changes

- [#333](https://github.com/krizaka/krizaka-ui/pull/333) [`5ffbac7`](https://github.com/krizaka/krizaka-ui/commit/5ffbac71e68bc3997124e4b16a708c2c86527b9e) Thanks [@oussamaABID](https://github.com/oussamaABID)! - New `@krizaka/ui/account-menu` — `AccountMenu`, the menu under a signed-in person's avatar: identity first (picture from `defaultAvatar` or `src`, name, e-mail), profile and settings links, the language as a compact submenu showing the current one, extra rows, and Sign out as a quiet item. `DropdownMenu` gains `Sub`, `SubTrigger`, `SubContent`, `RadioGroup` and `RadioItem`, and its panel is `overflow-x-hidden` with `overscroll-contain`, so it never draws a stray scrollbar at its natural height (it scrolls only when the screen is shorter).

- [#338](https://github.com/krizaka/krizaka-ui/pull/338) [`aa04764`](https://github.com/krizaka/krizaka-ui/commit/aa04764f91992a81e5484e1ac8244470a5377f1b) Thanks [@oussamaABID](https://github.com/oussamaABID)! - `@krizaka/ui/changelog-page` adds `releasesFromPulls`: for a repository that publishes no releases (a product in development), its merged pull requests become one changelog entry per week — conventional titles in plain language, housekeeping left out (krizaka/krizaka-ui#307).

- [#343](https://github.com/krizaka/krizaka-ui/pull/343) [`d4ad371`](https://github.com/krizaka/krizaka-ui/commit/d4ad3712534f89e18c0d4e3bb69443082aa7af5d) Thanks [@oussamaABID](https://github.com/oussamaABID)! - Six blocks for a shop's storefront (Akinaza): `ServiceCard` (`@krizaka/ui/service-card`) — a service as a card with icon or photo, duration, capacity, price (« from » when it varies), inclusions, a « Popular » tag and one way in (a link or a press); `SlotPicker` (`@krizaka/ui/slot-picker`) — the next free times as chips, a strip of days then the day's times, each a link or a toggle; `OpeningHours` (`@krizaka/ui/opening-hours`) — the weekly hours in one native-disclosure row (open now · closes at…) that unfolds into the week with today marked. Plus `CoverHero` (`@krizaka/ui/cover-hero`) — the shop's first screen over its photo or muted loop (a still under reduced motion; the brand's colours without a cover); `StickyAction` (`@krizaka/ui/sticky-action`) — the page's one action held at the bottom of a phone, pure CSS; `MediaGallery` (`@krizaka/ui/media-gallery`) — the shop's photos and loops in tiles, the first featured. Web (native: n/a, the storefront is a web page).

### Patch Changes

- Updated dependencies []:
  - @krizaka/tailwind@3.25.0
  - @krizaka/tokens@3.25.0

## 3.24.0

### Minor Changes

- [#339](https://github.com/krizaka/krizaka-ui/pull/339) [`0187e71`](https://github.com/krizaka/krizaka-ui/commit/0187e71b95394f0a77016316b182a42049e6f505) Thanks [@oussamaABID](https://github.com/oussamaABID)! - `WuSamaMark`: the founder's byline mark (Oussama's nickname, Wu-sama) — a gold W of five straight legs inside the Krizaka hexagon, split at its top and bottom vertices, ink and one amber, code-drawn SVG, still, cropped to the emblem below 48 px. An original mark, inspired by and not derived from the culture its name nods to: its geometry is measured on the Krizaka hexagon and guarded by tests (no curve, no bat-wing silhouette).

### Patch Changes

- Updated dependencies []:
  - @krizaka/tailwind@3.24.0
  - @krizaka/tokens@3.24.0

## 3.23.0

### Minor Changes

- [#296](https://github.com/krizaka/krizaka-ui/pull/296) [`08aab96`](https://github.com/krizaka/krizaka-ui/commit/08aab961e16999c9ef393c7bca57acf499e6ba3f) Thanks [@oussamaABID](https://github.com/oussamaABID)! - New marks for Yomizaka, Kachizaka, Akinaza, Yororis and Yasakia (web and native, same geometry), chosen from three directions per brand: Yomizaka "the watch" (the owl, two lenses under a calm brow), Kachizaka "the podium" (gold winner, cobalt steps, a lit diamond), Akinaza "the cut log" (year rings, a 45° copper cut, a copper heart), Yororis "held" (two open hands cup a warm core), Yasakia "one conversation" (one bubble, a tail on each side, the spark inside). The family grammar is kept: dashed orbit and ring, the lit core breathes, everything still under reduced motion, and below 48 px the view box crops to the emblem. Two-colour brands keep their colours apart. The Kachizaka mark's classes move from `kzm-` (Krizaka's) to `kcm-`. `familyMotion` (marks/shared) is the shared web motion.

- [#300](https://github.com/krizaka/krizaka-ui/pull/300) [`9b7a4d7`](https://github.com/krizaka/krizaka-ui/commit/9b7a4d7c6b48ca69adaf51e3d2c7d65329b19e25) Thanks [@oussamaABID](https://github.com/oussamaABID)! - captcha: new `Captcha` and `CaptchaDisclosure` (`@krizaka/ui/captcha`) — Cloudflare Turnstile that stays hidden unless a challenge is needed (managed mode, `appearance: "interaction-only"`), a framed box on the tokens when it does appear, the theme following the page, an accessible error with a retry, and the « Protected by Cloudflare Turnstile · Privacy · Terms » line (EN/FR) for under the submit button.

- [#323](https://github.com/krizaka/krizaka-ui/pull/323) [`840cff6`](https://github.com/krizaka/krizaka-ui/commit/840cff69dcb2aaebbd9159058e67c6f0ebd06b29) Thanks [@oussamaABID](https://github.com/oussamaABID)! - `ChangelogPage` gains the `security` and `breaking` kinds (words and colour, both themes), and `@krizaka/ui/changelog-page` ships its data adapter: `parseChangesets` (a changesets CHANGELOG.md), `parseReleaseBody` (a GitHub Release), `draftFromTitles` / `changeFromTitle` (conventional PR titles to a plain-language draft), `kindOfTag`, `anchorOf`, `newestFirst` and `changelogRss` (an RSS 2.0 feed) — one `Release` shape for every Krizaka site's changelog (krizaka/krizaka-ui#307).

- [#292](https://github.com/krizaka/krizaka-ui/pull/292) [`c77236d`](https://github.com/krizaka/krizaka-ui/commit/c77236d8ddad35c2a49e861bcfee6d6dd5c45482) Thanks [@oussamaABID](https://github.com/oussamaABID)! - Desktop (ADR-002: desktop is the web components in the Orazaka Mac app's Tauri window). `AppShell.Root desktop`: the shell is a desktop app's window — the header, its title and the sidebar's top are the title bar (`data-tauri-drag-region`, never on a control), the top clears the traffic lights (`--kz-titlebar-inset`), no drawer, the desktop's density (32 px rows, 13 px text, a 48 px header), the chrome not selectable, the content scrolling under a fixed header (`--kz-window-height`). `acceleratorOf` (from `@krizaka/ui/app-shell`) writes a shortcut as a native menu accelerator (`mod+k` → `CmdOrCtrl+K`) so the menu bar answers the shell's keys. AppShell is the first component with `desktop: "desktop"` in the parity matrix.

- [#310](https://github.com/krizaka/krizaka-ui/pull/310) [`ffa3402`](https://github.com/krizaka/krizaka-ui/commit/ffa34028fa60befc174ab98f0b65cdf269755ee6) Thanks [@oussamaABID](https://github.com/oussamaABID)! - `DocsNav` (`@krizaka/ui/docs-nav`) — the pages of a documentation in quiet groups for the `sidebar` of `DocsLayout` / `DocsArticlePage`: each group folds, the group of the current page is open, only the current page is marked; one-line titles, no icon. Server-safe, native `details`.

- [#310](https://github.com/krizaka/krizaka-ui/pull/310) [`ffa3402`](https://github.com/krizaka/krizaka-ui/commit/ffa34028fa60befc174ab98f0b65cdf269755ee6) Thanks [@oussamaABID](https://github.com/oussamaABID)! - `MediaGrid` can head its grid like its shelf (`grid={{ label: "Videos" }}`, the same heading style as “Shorts”), and both headings take a `hint`: a small “i” that opens the section's one-line definition and a link to the glossary (`SectionHint`, also exported). The section is a named landmark; the hint opens on a press or hover and closes on Escape.

- [#281](https://github.com/krizaka/krizaka-ui/pull/281) [`4dfbbc9`](https://github.com/krizaka/krizaka-ui/commit/4dfbbc904efa0d97549f7b16bc939e94dd28bc22) Thanks [@oussamaABID](https://github.com/oussamaABID)! - SiteFooter: `variant` — `site` (the full footer, unchanged), `docs` (compact: the site's columns in a row on the documentation's width, no site block, never the family) and `app` (one slim line for a signed-in product: publisher line, version, legal links). One footer component for every Krizaka surface; a page renders exactly one `contentinfo`.

- [#306](https://github.com/krizaka/krizaka-ui/pull/306) [`e74e415`](https://github.com/krizaka/krizaka-ui/commit/e74e415348782780c8d06560d319cb016fffe04a) Thanks [@oussamaABID](https://github.com/oussamaABID)! - Cards get a quiet hover. `LinkCard` and `ArgumentCard` take `hover="light"` (the pointer's light and the coloured lift, still the default) or `hover="quiet"`: no coloured glow or halo, a 2 px lift, one step of surface and hairline, the title leaning towards the accent text, and a focus ring on the whole card. `CardGrid hover="quiet"` quiets every card of a grid; a card can still say `hover="light"`. Under `prefers-reduced-motion` the quiet card does not lift. Documented on ui.krizaka.com with both hovers side by side.

- [#324](https://github.com/krizaka/krizaka-ui/pull/324) [`c10fd78`](https://github.com/krizaka/krizaka-ui/commit/c10fd78250a8ff8936b95b56626ec49b16c657aa) Thanks [@oussamaABID](https://github.com/oussamaABID)! - New `RailNav` (`@krizaka/ui/rail-nav`) and `AppHeader` (`@krizaka/ui/app-header`): the compact navigation of an application. `RailNav` is a vertical rail of icons on a desktop — the product's mark on top, a tooltip and an `aria-label` on each icon, an accent bar on the left edge of the current one, a footer slot for settings and the account, arrow keys / Home / End between items, the Krizaka focus ring — and becomes a bottom tab bar on a phone (same items, same order, clear of the home indicator). `expandable` widens it to show the words. `accent` scopes a product's brand tokens. `AppHeader` sits beside it with the product's name as text and optional chips; the mark is the rail's on a desktop and the header's on a phone, so exactly one brand mark is visible at every width (tested). Web; on a native phone the rail is the existing `TabBar` (parity noted), on the Mac the web form.

- [#327](https://github.com/krizaka/krizaka-ui/pull/327) [`528be7e`](https://github.com/krizaka/krizaka-ui/commit/528be7ee412c18d5d79b6d34c260d469163e822a) Thanks [@oussamaABID](https://github.com/oussamaABID)! - `settings-layout`: a calm, flat settings screen. New `SettingsRow` (label and help on the left, the control or value on the right, stacked on a phone), `SettingsSection variant="flat"` (no card: a title then hairline-divided rows) and `SettingsLayout variant="flat"` (one column of at most 45rem). The section list keeps its hidden scrollbars and `overflow-y-hidden` (tested: no stray scrollbar). The default `card` variant is unchanged.

- [#318](https://github.com/krizaka/krizaka-ui/pull/318) [`57a123f`](https://github.com/krizaka/krizaka-ui/commit/57a123f5527aab2edcb091a0d40e2feb7ab21ad6) Thanks [@oussamaABID](https://github.com/oussamaABID)! - New `Waveform` (`@krizaka/ui/waveform`, and `Waveform` on `@krizaka/ui/native`): the bars of a sound drawn on their own, for a card or a banner. `peaks` (resampled to `bars`), `size` (sm · md · lg), `tone` (accent · neutral), `playing` for a gentle idle motion. Decorative by default (`aria-hidden`); a `label` makes it an image. Still under `prefers-reduced-motion`, and paused off screen on the web. `AudioPlayer` now shares its bar resampling (`resamplePeaks`, unchanged).

### Patch Changes

- [#320](https://github.com/krizaka/krizaka-ui/pull/320) [`75762cc`](https://github.com/krizaka/krizaka-ui/commit/75762cce12331e3cd02ad084073c35ce9653e01d) Thanks [@oussamaABID](https://github.com/oussamaABID)! - `--kz-text-muted` now reaches WCAG AA (4.5:1) for small text on every surface, in both themes and under every brand (it was 4.11:1 on dark and 3.91:1 on light, between 3.05 and 4.17 across the surfaces). Same hue (240°), lightness moved: dark 47% to 59%, light 52% to 41%. In the light theme `--kz-text-secondary` goes from 41% to 35% so the hierarchy primary > secondary > muted holds. A new contrast test covers text-muted on the four surfaces and on each brand's section gradient.

- [#317](https://github.com/krizaka/krizaka-ui/pull/317) [`80f530d`](https://github.com/krizaka/krizaka-ui/commit/80f530dcf40c077f54737ef7adb23087fb509fb3) Thanks [@oussamaABID](https://github.com/oussamaABID)! - GenUi: a line that closes one brace too many keeps its first complete object (measured on Orazaka dev: a model's `updateComponents` line ended with `}}}`) — only stray `}` / `]` may follow, the object is validated as any other; `leadingObject` is exported.

- [#331](https://github.com/krizaka/krizaka-ui/pull/331) [`5798ea6`](https://github.com/krizaka/krizaka-ui/commit/5798ea6b183d8b2fa6033b9fc5007b168a7e1993) Thanks [@oussamaABID](https://github.com/oussamaABID)! - NavBar test: let the hover-intent timer finish before Escape, so it cannot reopen the menu (red on every PR run on a slow runner).

- [#328](https://github.com/krizaka/krizaka-ui/pull/328) [`fba8ca4`](https://github.com/krizaka/krizaka-ui/commit/fba8ca409e5bfc8a206f88c3243f0f1cc7757f63) Thanks [@oussamaABID](https://github.com/oussamaABID)! - NavBar test: the Escape assertion waits for Radix's close instead of racing it (flaky on loaded CI runners, red on main).

- [#281](https://github.com/krizaka/krizaka-ui/pull/281) [`4dfbbc9`](https://github.com/krizaka/krizaka-ui/commit/4dfbbc904efa0d97549f7b16bc939e94dd28bc22) Thanks [@oussamaABID](https://github.com/oussamaABID)! - `SiteFooter`: a `SiteFooter.Column` with no link (empty, `null` or `false` children) now renders nothing instead of a heading over an empty list, the site's own columns share the row with an auto-fit grid (it was a fixed 2/3-column grid that left empty cells beside a single column on the Kachizaka and Yomizaka dev sites), and falsy children are dropped one by one.

- [#244](https://github.com/krizaka/krizaka-ui/pull/244) [`07efd21`](https://github.com/krizaka/krizaka-ui/commit/07efd218c85f87f97be91b1081ad22215c013b53) Thanks [@oussamaABID](https://github.com/oussamaABID)! - Tabs: add missing `data-[state=inactive]:hidden` to `TabsContent` to prevent ghost rendering and vertical stacking under `forceMount` (fixes [#213](https://github.com/krizaka/krizaka-ui/issues/213)).
  cn, Button: memoize `{ twMergeConfig }` in `cn()` at module scope and use `cn()` in `Button` (fixes [#211](https://github.com/krizaka/krizaka-ui/issues/211)).
- Updated dependencies [[`75762cc`](https://github.com/krizaka/krizaka-ui/commit/75762cce12331e3cd02ad084073c35ce9653e01d)]:
  - @krizaka/tokens@3.23.0
  - @krizaka/tailwind@3.23.0

## 3.22.0

### Minor Changes

- [#293](https://github.com/krizaka/krizaka-ui/pull/293) [`9c804b3`](https://github.com/krizaka/krizaka-ui/commit/9c804b3274ac5e3169138cd1290f653e642deb4a) Thanks [@oussamaABID](https://github.com/oussamaABID)! - Two blocks for product landing pages. `ComparisonTable` (`@krizaka/ui/comparison-table`): a fair “versus” grid — every row aligned across the columns, your column a highlighted band of the same grid, an icon per question, a bold key phrase then the detail, neutral answers elsewhere; one card per question on a phone; rows rise in staggered. `StepShowcase` and `DeviceFrame` (`@krizaka/ui/step-showcase`): a guided tour in one device frame (phone, browser window, macOS window) — the steps beside it with a bar filling under the current one, each recording played muted then the next, crossfading; plays only in view, holds on hover and focus, a play / pause button, no native controls, posters first and the video once seen; dots and swipe on a phone; posters and manual steps under reduced motion.

- [#314](https://github.com/krizaka/krizaka-ui/pull/314) [`2cb1c7d`](https://github.com/krizaka/krizaka-ui/commit/2cb1c7d6e2a33d3a9cc0014744a0241419ef3fc1) Thanks [@oussamaABID](https://github.com/oussamaABID)! - Data-driven UI (ADR-082, krizaka/orazaka#207): `@krizaka/ui/genui` draws the interface a model describes in A2UI v0.9 — `GenUiStream` (a model's answer, its prose and its `a2ui` fence, growing as it streams), `GenUiSurface`, the strict validator (`validateMessage`: catalog `krizaka:genui/v1` only, unknown components and properties refused, tree-only, prototype-safe JSON pointers, size and depth caps), the store (`readStream`, `applyMessage`) and the base catalog (`Column`, `Row`, `Text`, `Card`, `Callout`, `Table`). `@krizaka/charts/genui` adds `chartsGenUiCatalog` (`KpiStat`, `ChartCard` with line · bar · area · pie).

- [#309](https://github.com/krizaka/krizaka-ui/pull/309) [`d08b205`](https://github.com/krizaka/krizaka-ui/commit/d08b2052441939a4c6d6914d03b38bcf4125bd36) Thanks [@oussamaABID](https://github.com/oussamaABID)! - New `MetaRow` (`@krizaka/ui/meta-row`, web and `@krizaka/ui/native`): one quiet line of dot-separated facts ("HD 720p · 9:16 · 0:05 · 24 fps · Oct 16, 2026") with optional status chips at its end (a `Badge`). A real list whose dots are hidden from assistive technology; empty facts are dropped so no dot dangles. Server-safe on the web.

- [#291](https://github.com/krizaka/krizaka-ui/pull/291) [`3c92001`](https://github.com/krizaka/krizaka-ui/commit/3c92001306cf61bfd15c533d2e447f203897bc53) Thanks [@oussamaABID](https://github.com/oussamaABID)! - NavBar: compact menus and one item lit. A menu link is icon · title · one line, in a 20 rem panel (36 rem in two columns) instead of a sheet over the page. Menus open on click, keyboard, or a pointer that rests 200 ms (`delayDuration`) — passing over the bar opens nothing; the light stays on the open menu's trigger, and moving on to a plain link closes the menu, so two items are never lit. A press outside closes the mobile panel. New `NavBar.MobileGroup` (a named group of the phone panel, the same groups as the bar's menus). `useSlidingIndicator` takes `prefer`. The `family-product` example and the docs follow the product-site standard: Product ▾ · Platforms ▾ · Docs.

### Patch Changes

- [#308](https://github.com/krizaka/krizaka-ui/pull/308) [`284468a`](https://github.com/krizaka/krizaka-ui/commit/284468a656417b92e30eb9cb853c4546409b09f5) Thanks [@oussamaABID](https://github.com/oussamaABID)! - Focus rings only for the keyboard. A mouse click on a link (the brand, a nav item, a card) no longer shows a blue outline: the preset's base layer hides the outline of any element that is focused without `:focus-visible`, and gives keyboard focus on an element without its own ring the token ring (`--kz-ring`, the signature offset). The skip link's ring follows `:focus-visible` too.
- Updated dependencies [[`284468a`](https://github.com/krizaka/krizaka-ui/commit/284468a656417b92e30eb9cb853c4546409b09f5)]:
  - @krizaka/tailwind@3.22.0
  - @krizaka/tokens@3.22.0

## 3.21.0

### Minor Changes

- [#297](https://github.com/krizaka/krizaka-ui/pull/297) [`74961d3`](https://github.com/krizaka/krizaka-ui/commit/74961d3a1d8c5745bc0a97b4a757315a070158a6) Thanks [@oussamaABID](https://github.com/oussamaABID)! - `UpdatePrompt` (the soft invitation to update), `ForceUpdateScreen` (the blocking screen after a `426` or `updateMode: force`) and `MaintenanceScreen` (the service is down on purpose) — web and `/native`, for the app-version contract of `@krizaka/app-config` (krizaka/.github#75). Every word is a prop; the screens decide nothing, the backend's parameters do.

### Patch Changes

- [#295](https://github.com/krizaka/krizaka-ui/pull/295) [`92d4fad`](https://github.com/krizaka/krizaka-ui/commit/92d4fade4897b966ae970661a93a0233d6dd8570) Thanks [@oussamaABID](https://github.com/oussamaABID)! - Tabs (pills) and the other sideways-scrolling rows (settings nav, shorts shelf, date-picker presets, day strip, table of contents) no longer draw a vertical scrollbar. `overflow-x` forced `overflow-y` to `auto`, so a 1–2 px overhang (a focus ring, a border) showed a thin thumb at the end of the bar. These rows now clip vertically, keep the sideways scroll, hide their scrollbar, and get their focus ring room from padding.
- Updated dependencies []:
  - @krizaka/tailwind@3.21.0
  - @krizaka/tokens@3.21.0

## 3.20.0

### Minor Changes

- [#272](https://github.com/krizaka/krizaka-ui/pull/272) [`dbac304`](https://github.com/krizaka/krizaka-ui/commit/dbac304839ab3264c7f6af455b383f15294f80c1) Thanks [@oussamaABID](https://github.com/oussamaABID)! - `VerticalVideo` takes `fit="fill"`: in a box that has its own size (a bento tile, a grid cell) the clip covers it edge to edge instead of drawing a small 9:16 frame inside it; the caption's name line wraps and stays clear of the action rail (the disclosure no longer runs under the share count). `Progress` never cuts a short label to make room for its figure: in a narrow box the figure goes under the label. The `glow-card/plans` example lays its columns out on its container (three side by side only when each has room), its buttons span their card on one line with short labels; the `chat/conversation` example, given a height, sits its messages on the composer.

- [#283](https://github.com/krizaka/krizaka-ui/pull/283) [`e89d93a`](https://github.com/krizaka/krizaka-ui/commit/e89d93ab3c118674d756d363dbc3f12e0e40571b) Thanks [@oussamaABID](https://github.com/oussamaABID)! - Platform parity — web · native · desktop. Every component's meta now declares `parity`: why it is not on the platform it lacks (`gap` ✗ with the issue that tracks it, or `n/a` with the reason and the component that answers there) and its desktop form (the Orazaka Mac app renders the web components: `"web"`, `"desktop"` or an absence). The registries carry it (`registry/<name>.json` and `registry/index.json`: `parity.{web,native,desktop}.state`), ui.krizaka.com draws the matrix from it, and the registry tests fail on a component without a decision.

- [#285](https://github.com/krizaka/krizaka-ui/pull/285) [`a3539a6`](https://github.com/krizaka/krizaka-ui/commit/a3539a6d5955303eb958ad2dd145b466b3cdc00a) Thanks [@oussamaABID](https://github.com/oussamaABID)! - media-grid: the whole `VideoCard` opens the video (the title's stretched link now covers the picture too; badges and duration let the click through), the animated preview is requested only after the pointer or focus rests `previewDelay` (200 ms), fades in over the poster and is removed on leave (on a phone only the most visible card plays it, never under Save-Data or reduced motion; none for a blurred picture), `posterPriority` for the first row, and new `VideoCardSkeleton`, `MediaGridSkeleton` (the real 16:9 and 9:16 shapes) and `LoadMore` (infinite scroll a screenful ahead, with the button as fallback).

### Patch Changes

- [#274](https://github.com/krizaka/krizaka-ui/pull/274) [`ef85add`](https://github.com/krizaka/krizaka-ui/commit/ef85add0cacb882f358a689a6a19102bffa3a89c) Thanks [@oussamaABID](https://github.com/oussamaABID)! - Linear-time trimming of trailing slashes (`defaultAvatarUrl`) and of array indices (`findUnused`): CodeQL polynomial-ReDoS findings. A compiled `.pyc` is no longer tracked.
- Updated dependencies []:
  - @krizaka/tailwind@3.20.0
  - @krizaka/tokens@3.20.0

## 3.19.0

### Minor Changes

- [#254](https://github.com/krizaka/krizaka-ui/pull/254) [`97ea37e`](https://github.com/krizaka/krizaka-ui/commit/97ea37ea4c01e9a2265343124fed39f4c53cb1d2) Thanks [@oussamaABID](https://github.com/oussamaABID)! - `CardGrid` takes a `foundation`: one wide card that the others stand on (an engine, a platform), a hairline stem joining it to a frame around the cards, an optional `foundationLabel` on the frame and `foundationPosition` (`start` above, `end` under). The cards still share one height and the pointer's light.

- [#250](https://github.com/krizaka/krizaka-ui/pull/250) [`fc5e2e0`](https://github.com/krizaka/krizaka-ui/commit/fc5e2e0c539558873f15a3e2440bf4b43764d075) Thanks [@oussamaABID](https://github.com/oussamaABID)! - feat(chat): `MessageComposer variant="pill"` — one rounded field with `leading` (mode chip, attach) inside on the left, a round send inside on the right, a reserved `status` line under it; `busy` holds the send without moving the box, `canSend` allows an attachment alone, `inputProps`/`sendProps` forward attributes.

### Patch Changes

- Updated dependencies []:
  - @krizaka/tailwind@3.19.0
  - @krizaka/tokens@3.19.0

## 3.18.2

### Patch Changes

- [#243](https://github.com/krizaka/krizaka-ui/pull/243) [`1ceaa22`](https://github.com/krizaka/krizaka-ui/commit/1ceaa2202dce57169a698d0de7926dd6f1d832e4) Thanks [@oussamaABID](https://github.com/oussamaABID)! - fix(sites): Yasakia is in development, not coming soon.
- Updated dependencies []:
  - @krizaka/tailwind@3.18.2
  - @krizaka/tokens@3.18.2

## 3.18.1

### Patch Changes

- [#233](https://github.com/krizaka/krizaka-ui/pull/233) [`f1c16df`](https://github.com/krizaka/krizaka-ui/commit/f1c16dfb7836ed394f96409f8383891614f8ccb5) Thanks [@oussamaABID](https://github.com/oussamaABID)! - VideoCard: on a 9:16 card the count and the quick action move to a second line, so the creator's name is no longer cut to an initial on a shelf.
- Updated dependencies []:
  - @krizaka/tailwind@3.18.1
  - @krizaka/tokens@3.18.1

## 3.18.0

### Minor Changes

- [#231](https://github.com/krizaka/krizaka-ui/pull/231) [`a9a8dcf`](https://github.com/krizaka/krizaka-ui/commit/a9a8dcf098e6bc6d31b1ccb6aa6c3d7abc081c72) Thanks [@oussamaABID](https://github.com/oussamaABID)! - Media grid ([#228](https://github.com/krizaka/krizaka-ui/issues/228)), web: `@krizaka/ui/media-grid` — `MediaGrid` for feeds of mixed orientations (`split`: the 9:16 clips on a `ShortsShelf`, the others in a uniform 16:9 grid; `uniform`: one frame, a clip of the other shape drawn whole over a blurred copy; `layout="list"`), `ShortsShelf` (equal-height 9:16 cards, scroll-snap, arrows with a mouse, a swipe on touch, “See all”) and an aspect-aware `VideoCard` (poster, animated preview on hover/focus, duration, badges, creator, count, one quick action; one body height so rows align; a single stretched link). The React Native counterpart and `masonry` stay on the issue.

### Patch Changes

- Updated dependencies []:
  - @krizaka/tailwind@3.18.0
  - @krizaka/tokens@3.18.0

## 3.17.0

### Minor Changes

- [#229](https://github.com/krizaka/krizaka-ui/pull/229) [`dad5abb`](https://github.com/krizaka/krizaka-ui/commit/dad5abb9324ae94a7fba575e868f770d960c2475) Thanks [@oussamaABID](https://github.com/oussamaABID)! - DataTable: responsive by itself ([#222](https://github.com/krizaka/krizaka-ui/issues/222)). Columns get a `type` (`title` · `badge` · `status` · `number` · `date` · `link` · `text`: sensible widths, alignment, truncation or line clamps, the full value on hover), a `priority` (2 to 7: the column leaves the row when the table's own width falls under its tier and goes to the row's detail, opened by a chevron; under 36 rem the rows are cards), `minWidth` / `maxWidth`, `nowrap`, `clamp`, `subtitle`, `href`, `unit`. New props: `stickyHeader` (or a px offset), `striped`, `scroll` (the sideways scroll is now an opt-in, with edge fades, once columns are typed), `stickyFirstColumn`; one row height per density. Opening a row no longer remounts it (the focus stays on its button). Tables without `type` / `priority` render as before. `CataloguePage` takes `railFrom="wide"` to keep its filters as a bar above the results under 1280 px. Three new examples: models catalogue, invoice list, admin runs.

### Patch Changes

- Updated dependencies []:
  - @krizaka/tailwind@3.17.0
  - @krizaka/tokens@3.17.0

## 3.16.1

### Patch Changes

- [#219](https://github.com/krizaka/krizaka-ui/pull/219) [`e5ef0fc`](https://github.com/krizaka/krizaka-ui/commit/e5ef0fc5c088235d279db1118169b2c159f03929) Thanks [@oussamaABID](https://github.com/oussamaABID)! - `@krizaka/ui/sites`: Yomizaka is "In development" (its repository is public and it has a dev site), not "Coming soon" — the same honest status as krizaka.com's product list, in the family switcher and every footer.
- Updated dependencies []:
  - @krizaka/tailwind@3.16.1
  - @krizaka/tokens@3.16.1

## 3.16.0

### Minor Changes

- [#205](https://github.com/krizaka/krizaka-ui/pull/205) [`a2703e6`](https://github.com/krizaka/krizaka-ui/commit/a2703e6dc1205a7227d9322ac4804be40b13e16c) Thanks [@oussamaABID](https://github.com/oussamaABID)! - `@krizaka/ui/document-viewer` — `DocumentViewer`: a PDF drawn page by page with pdf.js (an optional peer the app loads with `loadPdfjs={() => import("pdfjs-dist")}`), and the passages of a report lit where they sit. `highlights` are quotes: `locateQuote` (pure, exported) finds them in the PDF's own text positions and gives one box per line in fractions of the page; `activeId` scrolls to a passage, a click on a box calls `onActiveChange`, `onLocate` tells the app what was placed. A passage the text layer cannot place is never drawn at a guessed place: the viewer goes to its page when known and shows the quote in a bar.

### Patch Changes

- Updated dependencies []:
  - @krizaka/tailwind@3.16.0
  - @krizaka/tokens@3.16.0

## 3.15.0

### Minor Changes

- [#202](https://github.com/krizaka/krizaka-ui/pull/202) [`bd53e0c`](https://github.com/krizaka/krizaka-ui/commit/bd53e0c279034f364513b2530812a94a1043b267) Thanks [@oussamaABID](https://github.com/oussamaABID)! - Kachizaka (predictions among friends, points only) and Akinaza (the shop OS for Québec): their brands, marks and mascots.
  
  - `@krizaka/tokens`: `brands/kachizaka.css` / `.brand-kachizaka` — **victorious gold** accent (hue 48, the family's only gold, ≥ 10° from warning and ≥ 20° from every brand accent) with **electric cobalt** (226) as `accent-2`, section ground, light accent text and ring; the cobalt alone sits 9° from the Krizaka blue, so it never leads (a test says so). `brands/akinaza.css` / `.brand-akinaza` — **Laurentian forest green** accent (hue 130, ≥ 20° from sage, emerald, success and every accent) with a matte **copper** `accent-2` (≤ 65 % saturation, never Orazaka's orange). `marks.kachizaka` (cobalt → gold) and `marks.akinaza` (forest → copper), every stop ≥ 3:1 in both themes. Budgets `.` 4.2 kB, `./native` 2.5 kB, `scoped.css` 1.5 kB.
  - `@krizaka/ui`: `KachizakaLogo` / `KachizakaMark` ("the sealed cup": a trophy cut at its rim, the seal — a star — breathes, the ball on the orbit) and `AkinazaLogo` / `AkinazaMark` ("the open shop": an awning cut at its corner, the shop front, the open door's warm light, a coin on the orbit); `ProductLogo` / `ProductMark` accept both ids; default avatars for both. The flock welcomes **the magpie** (keeps the score) and **the beaver** (builds the shop) in `Mascot` (web and native) with their own palettes. `@krizaka/ui/sites`: a new status `development` ("In development" / "En développement") and both products in it, their address the repository until a dev site exists.

### Patch Changes

- [#203](https://github.com/krizaka/krizaka-ui/pull/203) [`b31934f`](https://github.com/krizaka/krizaka-ui/commit/b31934f3183fa229d8d02dea266c2213ea5ba75c) Thanks [@oussamaABID](https://github.com/oussamaABID)! - New server-safe entry `@krizaka/ui/avatar/defaults` (`defaultAvatarUrl`, `defaultAvatarSvg`, …): the pure helpers of the default avatars can be called in a Server Component. `@krizaka/ui/avatar` keeps re-exporting them for client code, but calling them from the server through it failed ("Attempted to call defaultAvatarUrl() from the server"). A test now checks that no server entry reaches a "use client" module.
- Updated dependencies [[`bd53e0c`](https://github.com/krizaka/krizaka-ui/commit/bd53e0c279034f364513b2530812a94a1043b267)]:
  - @krizaka/tokens@3.15.0
  - @krizaka/tailwind@3.15.0

## 3.14.0

### Minor Changes

- [#193](https://github.com/krizaka/krizaka-ui/pull/193) [`24b4e1d`](https://github.com/krizaka/krizaka-ui/commit/24b4e1d8c96f6858708bc37cd357caaeae6ea3a1) Thanks [@oussamaABID](https://github.com/oussamaABID)! - `SiteFooter` gets a product mode: `family={false}` drops the family columns — a deployed product is independent, so its footer holds only its own columns, the legal links, the version and one publisher line (“A Krizaka product” / « Un produit Krizaka », linking to www.krizaka.com). `NavBar.Family` in the phone panel no longer repeats its heading: the company's own group carries no second “Krizaka” title.

### Patch Changes

- Updated dependencies []:
  - @krizaka/tailwind@3.14.0
  - @krizaka/tokens@3.14.0

## 3.13.0

### Minor Changes

- [#196](https://github.com/krizaka/krizaka-ui/pull/196) [`bab3e55`](https://github.com/krizaka/krizaka-ui/commit/bab3e55003effe5ed2f5fa802e368d1b93199a43) Thanks [@oussamaABID](https://github.com/oussamaABID)! - Yomizaka, the fifth product (documents read, classified and checked by Orazaka): its brand and its mark.
  
  - `@krizaka/tokens`: the Yomizaka brand — **ink indigo** (藍, *ai*), accent hue 240–242 placed by test ≥ 20° from the Krizaka blue and the Orochia violet and ≥ 60° from every other brand and every status; `brands/yomizaka.css`, `.brand-yomizaka` in `brands/scoped.css`, `brands.yomizaka` and `marks.yomizaka` (ink `hsl(232 50% 55%)` → indigo `hsl(248 50% 58%)`, every stop ≥ 3:1 on surfaces 0–2 in dark and light). Size budgets `.` 3.9 kB, `./native` 2.2 kB.
  - `@krizaka/ui`: `YomizakaLogo` (web) and `YomizakaMark` (native), "the reading" — a page with the Krizaka cut at its corner, three lines of text, and a lens resting on it; a line of light scans the page (web), the lens breathes, one node rides the orbit. `ProductLogo` / `ProductMark` accept `id="yomizaka"`; `@krizaka/ui/sites` lists Yomizaka (`dev.yomizaka.com`, upcoming).

### Patch Changes

- Updated dependencies [[`bab3e55`](https://github.com/krizaka/krizaka-ui/commit/bab3e55003effe5ed2f5fa802e368d1b93199a43)]:
  - @krizaka/tokens@3.13.0
  - @krizaka/tailwind@3.13.0

## 3.12.0

### Minor Changes

- [#192](https://github.com/krizaka/krizaka-ui/pull/192) [`37026c0`](https://github.com/krizaka/krizaka-ui/commit/37026c021f83467b2232b5f0004c6626aa1c48a7) Thanks [@oussamaABID](https://github.com/oussamaABID)! - Avatar: default profile pictures. `defaultAvatar={{ brand, seed }}` shows the product's own picture (the brand's gradient and a silhouette, one of six tones from the person's id) when there is no photo or it fails to load; `fallbackSrc` does the same with your own image. Web and `/native`. `defaultAvatarUrl`, `defaultAvatarSvg` and the rest of the set are exported from `@krizaka/ui/avatar`; the pictures are served from the Krizaka CDN (`people/defaults/v1/<brand>/`, WebP 256/512 and SVG) and generated by `tools/export-brand.mjs`, which also exports every logo and mark (SVG, PNG, dark and light), avatars and social previews to `brand/<brand>/`.

### Patch Changes

- [#190](https://github.com/krizaka/krizaka-ui/pull/190) [`0fd4768`](https://github.com/krizaka/krizaka-ui/commit/0fd4768b5b3a96ecd7f49edb7552ea161db4ed4b) Thanks [@oussamaABID](https://github.com/oussamaABID)! - `Showcase`: the slides' column is `minmax(0, 1fr)` — a slide holding a wide code block (a `<pre>`) no longer widens the slideshow past a phone's width.

- [#191](https://github.com/krizaka/krizaka-ui/pull/191) [`a155470`](https://github.com/krizaka/krizaka-ui/commit/a155470425733014970cbe8fda23b97e78d5d951) Thanks [@oussamaABID](https://github.com/oussamaABID)! - `SiteFooter` never makes a phone page scroll sideways: its frame and columns shrink to the screen (`minmax(0, 1fr)`,
  `min-w-0`) and a long link wraps instead of pushing the page wider (seen on ui.krizaka.com at 350–390 px).
- Updated dependencies []:
  - @krizaka/tailwind@3.12.0
  - @krizaka/tokens@3.12.0

## 3.11.0

### Minor Changes

- [#187](https://github.com/krizaka/krizaka-ui/pull/187) [`053b4fd`](https://github.com/krizaka/krizaka-ui/commit/053b4fd79deca79542a29774ecb56ced33c36e18) Thanks [@oussamaABID](https://github.com/oussamaABID)! - `LinkCard` pins its foot (the facts in `extra`, then the way in `cta`) to the bottom of the card, so in a `CardGrid` row whose sentences have different lengths the status chips and the links sit on one line and the card bottoms line up. New `footerAlign="bottom" | "top"` (default `bottom`; `top` keeps the previous flow under the text) — a card that is already as tall as its content looks the same. The foot is one `.kz-link-card-foot` element wrapping `extra` and `cta`. New example `card-grid/aligned` and a story that measures the row in the browser (one height, facts and links on one line).

- [#184](https://github.com/krizaka/krizaka-ui/pull/184) [`9deecc8`](https://github.com/krizaka/krizaka-ui/commit/9deecc88ac4cadfec76bb1029dd2a174cdb0f766) Thanks [@oussamaABID](https://github.com/oussamaABID)! - `Showcase` (`@krizaka/ui/showcase`, native in `@krizaka/ui/native`): a slideshow that advances by itself and shows it. A segmented progress bar — the current segment fills over the `interval`, every segment is a button — with a counter (`labels.counter`, “Image 1 of 17”), previous / next and a visible pause / play button (WCAG 2.2.2). The fill is the timer (`.kz-showcase-fill`, its two rules shipped with the component), so what is seen is what decides; the show holds while the pointer is over it, while a keyboard focus is inside, while the tab is hidden and while it is off screen, and never advances under `prefers-reduced-motion` (manual only, the segment drawn full, no pause button). ←/→, Home/End; `aria-roledescription="carousel"` and `slide` groups named “n of N”; the live region is polite only after the visitor navigates. Slides are slots (`renderItem`, `getTitle`), `transition="fade" | "slide"`, `loop`, controlled `index`. `useTypedText` is the optional typed reveal of a text. Native: swipeable pages with the same bar, counter and buttons; the autoplay holds while dragging, in the background and with Reduce Motion on.

### Patch Changes

- Updated dependencies []:
  - @krizaka/tailwind@3.11.0
  - @krizaka/tokens@3.11.0

## 3.10.0

### Minor Changes

- [#181](https://github.com/krizaka/krizaka-ui/pull/181) [`be56fb5`](https://github.com/krizaka/krizaka-ui/commit/be56fb5997859a7f7fdc6319651696ed9d18f0df) Thanks [@oussamaABID](https://github.com/oussamaABID)! - One navigation for the whole Krizaka family (NAV-SYS).
  
  - `@krizaka/ui/sites` (new, server-safe): the family as data — `sites` (id, name, url, host, kind `company · product · open-source`, group, status `released · upcoming · construction`, mark, repo) for www.krizaka.com, dev.orazaka.com, dev.orochia.com, dev.yasakia.com, dev.yororis.com, ui.krizaka.com, java.krizaka.com and github.com/krizaka; `siteGroups`, `siteById`, `sitesByGroup`; `familyLabels.en` / `.fr` (each site's line, groups, statuses, signature, place).
  - `NavBar.Family` (`current`, `labels`, `defaultOpen`): the family switcher attached to the brand — a chevron that opens every site grouped Krizaka · Products · Open source · GitHub, the current one marked (`aria-current="true"`, “You are here”), statuses in words; click or keyboard only (never on hover), Escape returns the focus; inside `NavBar.Mobile` it renders as the panel's last group.
  - `NavBar.Badge` (`env`, `version`): `DEV · v1.2.3` beside the brand. `NavBar.Repo` (`href`, `label`): the site's repository as an icon link.
  - `@krizaka/ui/site-footer` (new): `SiteFooter` (`current`, `labels`, `version`, `env`, `legal`, own columns with `SiteFooter.Column` / `SiteFooter.Link`) — the family in columns, “A Krizaka company / product / open-source project”, the version, Montréal.
  - Composed examples of each site's bar: www, ui., java., dev.<product>, admin.<product>.

### Patch Changes

- Updated dependencies []:
  - @krizaka/tailwind@3.10.0
  - @krizaka/tokens@3.10.0

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
- Updated dependencies [[`dbf4e2d`](https://github.com/krizaka/krizaka-ui/commit/dbf4e2d9ed12caf7c580fc89588aa02b59d6c703), [`dbf4e2d`](https://github.com/krizaka/krizaka-ui/commit/dbf4e2d9ed12caf7c580fc89588aa02b59d6c703), [`e3bcc51`](https://github.com/krizaka/krizaka-ui/commit/e3bcc51692773c3cea99ec6198cd0011f026a70e)]:
  - @krizaka/pacer@0.1.0
  - @krizaka/tokens@3.9.0
  - @krizaka/tailwind@3.9.0
  - @krizaka/intl@0.2.1
  - @krizaka/query@0.2.1

## 3.8.0

### Minor Changes

- [#176](https://github.com/krizaka/krizaka-ui/pull/176) [`336293a`](https://github.com/krizaka/krizaka-ui/commit/336293a904d6d0fc844add376ce6dd56e57c4ba9) Thanks [@oussamaABID](https://github.com/oussamaABID)! - Yazakia is renamed **Yasakia**: `YasakiaLogo` / `YasakiaMark`, `ProductLogo` / `ProductMark` id `yasakia`, `@krizaka/tokens/brands/yasakia.css` and `.brand-yasakia` in `brands/scoped.css`, `brands.yasakia` / `marks.yasakia`. The old names (`YazakiaLogo`, `YazakiaMark`, id `yazakia`, `brands/yazakia.css`, `.brand-yazakia`) stay as deprecated aliases for one minor version.

### Patch Changes

- Updated dependencies [[`336293a`](https://github.com/krizaka/krizaka-ui/commit/336293a904d6d0fc844add376ce6dd56e57c4ba9)]:
  - @krizaka/tokens@3.8.0
  - @krizaka/tailwind@3.8.0

## 3.7.1

### Patch Changes

- [#173](https://github.com/krizaka/krizaka-ui/pull/173) [`3028240`](https://github.com/krizaka/krizaka-ui/commit/3028240cc34c0bfe3562d80102add8046c94943d) Thanks [@oussamaABID](https://github.com/oussamaABID)! - `ShortFeed` sizes its slides to the feed (`h-full`) instead of the screen, so a feed in a box shows one video at a time; the "AI-generated" pill of `VerticalVideo` stays on one line.
- Updated dependencies []:
  - @krizaka/tailwind@3.7.1
  - @krizaka/tokens@3.7.1

## 3.7.0

### Minor Changes

- [#165](https://github.com/krizaka/krizaka-ui/pull/165) [`45ab77b`](https://github.com/krizaka/krizaka-ui/commit/45ab77b1b731058c167d184906085a39ad588c1b) Thanks [@oussamaABID](https://github.com/oussamaABID)! - Product-branded waits (web and React Native). `Loader` takes the product's animated mark in place of the Krizaka glyph while it waits (`mark={<OrochiaLogo animated />}` on the web, `product="orochia"` natively; the ending is still the drawn check or cross, the delay and the words stay). New native `BrandedRefresh`: a pull-to-refresh where the product's mark grows into place as you pull (iOS) and turns while it refreshes (iOS and Android), announced when the refresh starts. New native `SplashHandoff`: the static native splash dissolves into the animated mark until the first screen is ready, then leaves (still under reduced motion). Replaces each app's own `BusyMark` and static splash.

- [#171](https://github.com/krizaka/krizaka-ui/pull/171) [`e53f6c5`](https://github.com/krizaka/krizaka-ui/commit/e53f6c575e6fc46753ff4698040a752c8ff297be) Thanks [@oussamaABID](https://github.com/oussamaABID)! - `VerticalVideo` and `ShortFeed` (`@krizaka/ui/vertical-video`, native `@krizaka/ui/native/vertical-video` on expo-video): a 9:16 short video with the action rail of a short-video feed on the right — the creator's avatar with follow (+), like, comments, share (counts compact in the viewer's locale), a `tipSlot` for the product's own action and `topStart` / `aboveCaption` slots — and the creator's caption bottom-left (name, seal, an "AI-GENERATED"-style `disclosure` pill, two-line caption that expands, tags, credit), a progress hairline, everything over the picture on the invariant `scrim` / `fg-on-media` tokens. Tap pauses, double tap (long press on a phone) likes, Space/K and L on the focused video; under reduced motion nothing autoplays. `ShortFeed` is a snap-scrolling feed (web: CSS scroll-snap, only the slides near the one in view mounted, the next preloaded, ↑/↓ move; native: a paging FlatList) that plays the one in view. All words are props; no media is hard-coded (`src` / `uri` are yours). The mobile `feed` template is now a vertical feed built on them.

### Patch Changes

- [#161](https://github.com/krizaka/krizaka-ui/pull/161) [`1a17d81`](https://github.com/krizaka/krizaka-ui/commit/1a17d816ce419e3cb5ce29bcc4cb0ce48aa8b2ca) Thanks [@oussamaABID](https://github.com/oussamaABID)! - The examples show the Krizaka UI cast (Camille, Noor, Tomás, Ada — fictional portraits generated by Orazaka, on the Krizaka CDN) in `ProfileCard`, `PersonCard`/`SwipeDeck`, `Avatar` and the native profile screen, in place of grey placeholders and borrowed first names; the dating-style example reads "Camille, 29".
- Updated dependencies []:
  - @krizaka/query@0.2.0
  - @krizaka/tailwind@3.7.0
  - @krizaka/tokens@3.7.0

## 3.6.0

### Minor Changes

- [#160](https://github.com/krizaka/krizaka-ui/pull/160) [`76dfbba`](https://github.com/krizaka/krizaka-ui/commit/76dfbba54ba376ed47ee1b336f66518a529aeb8a) Thanks [@oussamaABID](https://github.com/oussamaABID)! - Deprecation is a status of the registry: a component marked `deprecated` carries `{ since, removedIn, use, reason }` (checked by the registry test) and krizaka.com/docs/ui flags it. `TreeView` (`@krizaka/ui/tree-view`) is the first: no product uses it and no planned work needs it, it still works and goes in 4.0.0 — drill down with `List` instead.

- [#157](https://github.com/krizaka/krizaka-ui/pull/157) [`1d23271`](https://github.com/krizaka/krizaka-ui/commit/1d232714beb074a958a723828ba93bfe035ef703) Thanks [@oussamaABID](https://github.com/oussamaABID)! - `engines` is `node >=22` for every package: Node 20 reached end of life, and the products already run on Node 22. No compatibility shim.

- [#163](https://github.com/krizaka/krizaka-ui/pull/163) [`6c576b0`](https://github.com/krizaka/krizaka-ui/commit/6c576b0c637187a15721a2d4ca553b8995f4ef40) Thanks [@oussamaABID](https://github.com/oussamaABID)! - More varied templates, each with its intent and its reason: a case study (`longform-page/case-study`), a FAQ (`docs-article-page/faq`), a tip checkout (`detail-layout/checkout`), an empty page (`empty-state/library`), planned maintenance (`status-page/maintenance`), a notifications centre and a "find a place nearby" map screen (`split-view/notifications`, `split-view/nearby`), and two native screens built on `Screen`: a map-centric one (`screen/native/map`, with the DS5 `Map` and a bottom sheet) and notifications.

- [#162](https://github.com/krizaka/krizaka-ui/pull/162) [`9eef77f`](https://github.com/krizaka/krizaka-ui/commit/9eef77fdb3ab8b576aa4a713f905c5e5f0210038) Thanks [@oussamaABID](https://github.com/oussamaABID)! - fix(native): `PersonCard` draws one photo — the scrim under the name is sized in points from the overlay's own layout, so the photo is no longer cut in two (a dark band over the face and none under the name) on iOS.
  
  feat(ui): `MatchDialog` takes a `container` — draw the dialog inside a brand scope (`.brand-…`) so it wears the product's identity instead of the default one.

- [#164](https://github.com/krizaka/krizaka-ui/pull/164) [`9c5c7ca`](https://github.com/krizaka/krizaka-ui/commit/9c5c7cabb8f78c07aefd5bbb52651a16a6a5fdf6) Thanks [@oussamaABID](https://github.com/oussamaABID)! - New `SkipLink` (`@krizaka/ui/skip-link`): the standalone "skip to content" link for app shells that keep their own layout (WCAG 2.4.1). Visually hidden until focused, then a visible pill above everything in the brand ring; its label is passed translated, `href` defaults to `#content`, and Enter really moves focus to the target. `MarketingLayout` uses it, and `AppShell.Root` takes `skipLabel` (the link lands on `AppShell.Main`, now `id="content"`).

- [#156](https://github.com/krizaka/krizaka-ui/pull/156) [`6695970`](https://github.com/krizaka/krizaka-ui/commit/669597042290c56c577dacd30204426c188a7092) Thanks [@oussamaABID](https://github.com/oussamaABID)! - Templates are grouped by intent. Every template example now carries a `purpose` (Convince, Explain, Show, Act, Operate, Converse, Recover) and a `why` (the user goal its layout serves); `templatePurposes` gives each group its "you come here when…" line, and `registry/index.json` lists the `templates` in that order. The six React Native screens (app shell, sign-in, profile, feed, chat, settings) are templates too.

### Patch Changes

- [#158](https://github.com/krizaka/krizaka-ui/pull/158) [`73ea416`](https://github.com/krizaka/krizaka-ui/commit/73ea41619af7d5ef193a9a0856b8be0cdea609eb) Thanks [@oussamaABID](https://github.com/oussamaABID)! - Dialog, Sheet and AlertDialog give focus back to the element that opened them when there is no `Dialog.Trigger` (a controlled `open` opened by a plain button): on Escape focus no longer falls to `<body>` (WCAG 2.4.3). A consumer's `onCloseAutoFocus` that prevents the default still wins.

- [#166](https://github.com/krizaka/krizaka-ui/pull/166) [`debffad`](https://github.com/krizaka/krizaka-ui/commit/debffad6a764420e10415e1cd33f8c03f599339d) Thanks [@oussamaABID](https://github.com/oussamaABID)! - `Marker` (the map) no longer breaks hydration: its host element was created in a `useState` initializer that differed between the server (nothing) and the browser (an element portalled into), so React threw away the server HTML of every page that drew a marker. It now uses `useSyncExternalStore` with a server snapshot — same first render on both sides. Test: render to a string with no `document`, hydrate, no recoverable error.
- Updated dependencies [[`1d23271`](https://github.com/krizaka/krizaka-ui/commit/1d232714beb074a958a723828ba93bfe035ef703)]:
  - @krizaka/tokens@3.6.0
  - @krizaka/tailwind@3.6.0
  - @krizaka/intl@0.2.0
  - @krizaka/query@0.2.0

## 3.5.0

### Minor Changes

- [#150](https://github.com/krizaka/krizaka-ui/pull/150) [`7b63c08`](https://github.com/krizaka/krizaka-ui/commit/7b63c08ee6718a0106f983cc024417c43b9c75d1) Thanks [@oussamaABID](https://github.com/oussamaABID)! - A people kit, web and React Native: `Chat` (conversation item, message bubble with its status, composer, typing indicator), `SwipeDeck` with `PersonCard`, `MatchDialog`, `TagSelector`, `StepProgress`, `VerifiedBadge`, `PhotoGrid`; on React Native, `Screen` (header, content that rises with the keyboard, footer) and six templates built on it — app shell, sign-in, profile, feed, chat, settings. Dates, places and sliders come from the controls already published.

### Patch Changes

- Updated dependencies []:
  - @krizaka/tailwind@3.5.0
  - @krizaka/tokens@3.5.0

## 3.4.0

### Minor Changes

- [#149](https://github.com/krizaka/krizaka-ui/pull/149) [`4978908`](https://github.com/krizaka/krizaka-ui/commit/49789080247338b7009e0fde98884d8cb97f3381) Thanks [@oussamaABID](https://github.com/oussamaABID)! - Data display, from the apps' screens: `List` (`./list`: records dense or comfortable, selectable, actions beside each
  row, windowed, its states — the web side of the native list), `DescriptionList` and `KeyValueGrid`
  (`./description-list`: term and value, stacked, inline like a receipt, a grid of figures), `ActivityFeed` and `Timeline`
  (`./activity-feed`: by day, runs folded, “… ago” kept fresh, new events announced), `TreeView` (`./tree-view`: the ARIA
  tree, branches loaded on demand) and `Kanban` (`./kanban`: drag and drop or Space and the arrows, every move announced).
  `Stat` takes a `chart` and `StatGrid` lays figures out. React Native: `DescriptionList` and `ActivityFeed`.

- [#144](https://github.com/krizaka/krizaka-ui/pull/144) [`fb1e90a`](https://github.com/krizaka/krizaka-ui/commit/fb1e90af44db93e2e571d8b4ef95178b3fa6b983) Thanks [@oussamaABID](https://github.com/oussamaABID)! - Maps, open source and free (DS5): `@krizaka/ui/map` — `Map` on MapLibre GL JS over Protomaps PMTiles hosted on the
  Krizaka CDN (the world to zoom 6, Montréal–Québec to 14; no API key, no metered service), its style generated from the
  tokens in dark and light and the product's accent (`mapStyle`, `mapPalette`), `Marker` (a button when it does something),
  `Cluster`, `UserPosition` (a pulse, still under reduced motion), `RadiusCircle`, `LocationPicker` (the pin, the distance
  chip, Near me asking for the position only when pressed) and `StaticMap` (the fallback without WebGL, the picture of a
  card) — the places read as a list in place of the canvas, the OpenStreetMap (ODbL) and Protomaps attribution always
  drawn. `@krizaka/ui/native/map` brings the same on MapLibre Native (details in a `Sheet`). `maplibre-gl` and
  `@maplibre/maplibre-react-native` are optional peers; `pmtiles`, `@protomaps/basemaps` and `@krizaka/tokens` are
  dependencies. `tools/map-assets.mjs` publishes and checks the tiles and glyphs. The skill `skills/map/SKILL.md`.

- [#145](https://github.com/krizaka/krizaka-ui/pull/145) [`96cc209`](https://github.com/krizaka/krizaka-ui/commit/96cc209e1089b58a4aa855e1622d7972e11e7f83) Thanks [@oussamaABID](https://github.com/oussamaABID)! - React Native gets the feedback Orazaka's Jobs tab waits for, with the web's props: `Loader` (+ `LoaderGlyph`,
  `useDelayedWait`: shown after a delay, never blinking, announced, ending in words), `Stepper` (each step's status read),
  `Meter` (thresholds, parts, bar or ring) and `NumberTicker` (the final value read from the first frame).

- [#153](https://github.com/krizaka/krizaka-ui/pull/153) [`86eb46b`](https://github.com/krizaka/krizaka-ui/commit/86eb46b5de2fe74df388eaae5a2e8706e20a8e6d) Thanks [@oussamaABID](https://github.com/oussamaABID)! - React Native lists and inputs: `SwipeableRow` (actions under a swipe, a full swipe runs the outermost, the same actions
  for screen readers), `PullToRefresh` (the platform's control in the accent), `OtpInput` (one input under the boxes: the
  keyboard's code suggestion fills them all) and `MediaPicker` in its own entry `@krizaka/ui/native/media-picker`
  (expo-image-picker, optional peer). `Avatar` takes `presence` and a story `ring`; a toast is swiped away, plays its
  tone's haptic and can be a snackbar; `SearchField` takes a Cancel button.

- [#146](https://github.com/krizaka/krizaka-ui/pull/146) [`097641a`](https://github.com/krizaka/krizaka-ui/commit/097641aa010f090e579d15e88a70e728be96a1df) Thanks [@oussamaABID](https://github.com/oussamaABID)! - React Native navigation: `TabBar` (the app's main sections, badges said in words, a tick, reselect), `Header` (a large
  title that folds into the bar, `useCollapsingHeader`), `Tabs` (underlined or segmented, with their panels) and `Fab`.
  `ThemeProvider` takes the safe-area `insets` (`useSafeAreaInsets()`): the bars and the floating button keep clear of them.

- [#147](https://github.com/krizaka/krizaka-ui/pull/147) [`bf3bfb8`](https://github.com/krizaka/krizaka-ui/commit/bf3bfb8a2aeb4e425c781949e5ba737fb534bb60) Thanks [@oussamaABID](https://github.com/oussamaABID)! - React Native overlays and screens: `ActionSheet` (a short list of actions from the bottom edge, the destructive one in
  danger, cancel apart), `ImageViewer` (full screen: pinch and double tap to zoom, swipe between images, swipe down to
  close, moved by the screen reader's swipes), `PermissionPrompt` (why before the system asks, then the settings once
  refused) and `Onboarding` (a first launch in a few slides).

### Patch Changes

- [#143](https://github.com/krizaka/krizaka-ui/pull/143) [`d0e43fd`](https://github.com/krizaka/krizaka-ui/commit/d0e43fd7defaba8be14d61c3b84799fec817dad5) Thanks [@oussamaABID](https://github.com/oussamaABID)! - Package homepage points to the documentation on krizaka.com (the page the npm listing links to is the one that explains the package).
- Updated dependencies [[`d0e43fd`](https://github.com/krizaka/krizaka-ui/commit/d0e43fd7defaba8be14d61c3b84799fec817dad5)]:
  - @krizaka/intl@0.1.1
  - @krizaka/query@0.1.1
  - @krizaka/tailwind@3.4.0
  - @krizaka/tokens@3.4.0

## 3.3.0

### Minor Changes

- [#139](https://github.com/krizaka/krizaka-ui/pull/139) [`990cfb9`](https://github.com/krizaka/krizaka-ui/commit/990cfb9bb36cad0aebb0258a9eb3b60a546a7799) Thanks [@oussamaABID](https://github.com/oussamaABID)! - The controls, crafted (DS5). `RadioGroup` gains tactile keys that press in (`RadioGroup.Button`, `variant="buttons"`:
  raised on their ledge, sunk while held and once chosen), a segmented control that is a form's value
  (`RadioGroup.Segment`, `variant="segmented"`, one light gliding to the choice) and cards with a lit check. `Slider`
  gains `ticks` and `marks`, `floatingValue`, `tone` (`gradient` · `solid`), `size="lg"` and `orientation="vertical"`.
  `@krizaka/ui/native` gains `Switch` (drawn by the theme; `showLabel` makes the settings row), `RadioGroup` (list · cards
  · buttons · segmented), `Slider` (range, steps, floating value, vertical, adjustable for VoiceOver / TalkBack), `Sheet`
  (a bottom sheet), `Select` and `Combobox` (a field that opens a sheet; async search) — each with its haptic. The form
  adapters wear them without a change to any form: web `DateField entry="wheel"` and the typed date of
  `@krizaka/ui/date-picker`, `RadioGroup variant` `buttons` · `segmented`, `Slider ticks` / `marks` (the value floats);
  native `DateField` on wheels by default (`entry="parts"` to type it), `Switch` / `RadioGroup` / `Select` on the new
  controls, and new `form.Slider` and `form.Combobox`. Wheels show a quiet band until turned (`unset`). The skill
  `skills/choice-controls/SKILL.md`.

### Patch Changes

- Updated dependencies []:
  - @krizaka/tailwind@3.3.0

## 3.2.0

### Minor Changes

- [#135](https://github.com/krizaka/krizaka-ui/pull/135) [`e414534`](https://github.com/krizaka/krizaka-ui/commit/e414534cb63dfe68be426f6646ba2f9454659be9) Thanks [@oussamaABID](https://github.com/oussamaABID)! - Dates and times, redesigned (DS5). `@krizaka/ui/date-picker` wears the Krizaka material — the chosen day a lit fill,
  today the node of the marks, a period one continuous band — and gains: `Calendar` `variant="card"` and
  `numberOfMonths={2}` (its title opens the months of the year), `DateRangePicker` on two months with lit presets,
  `MonthPicker` (`YYYY-MM`), `DayStrip` (the days ahead, closed and marked days), `WheelPicker` + `Wheel` (spinbuttons,
  the curve a scroll-driven animation), `TimePicker` (wheels on the locale's 12 or 24 hours, or `variant="slots"` by part
  of the day), `DateField` (day · month · year typed) and `DateWheel` (bounded: an age gate is
  `max={latestBirthDate(18)}`), with the helpers `timeSlots`, `ageOn`, `formatTime`, `monthNames`… shared with native.
  `@krizaka/ui/native` gains `Calendar`, `MonthPicker`, `DayStrip`, `TimePicker`, `DateWheel`, `WheelPicker` + `Wheel`
  (adjustable for VoiceOver / TalkBack) and haptics: `ThemeProvider haptics={(kind) => …}` (expo-haptics in the app),
  `useTheme().haptic`. `cn` and the new `tv` know the material's utilities (`bg-sheen`, `bg-fill-shade`, `shadow-glow`,
  `inset-shadow-edge`…), so a surface is no longer dropped under its sheen. The skill `skills/date-picker/SKILL.md`.

### Patch Changes

- Updated dependencies []:
  - @krizaka/tailwind@3.2.0

## 3.1.0

### Minor Changes

- [#127](https://github.com/krizaka/krizaka-ui/pull/127) [`3dca7b7`](https://github.com/krizaka/krizaka-ui/commit/3dca7b7d8e298fde5531506cc7c4dadfd64c85be) Thanks [@oussamaABID](https://github.com/oussamaABID)! - `@krizaka/ui/form` and `@krizaka/ui/native/form` — forms on TanStack Form v1 behind the facade (PS3): `createKrizakaForm({ schema, defaultValues, i18n })` on a zod 4 (Standard Schema) schema shared with the server; typed fields wired to the current primitives through thin adapters (`TextField` with a debounced `validateAsync` and a suggestion, `TextArea`, `Checkbox`, `Switch`, `RadioGroup`, `Select`, `Combobox`, `DateField` — calendar or day · month · year —, `TagInput`, `FileUpload`, `Money` in integer cents, `Slider`), `Submit`, `FormError`, `FieldArray`, `Watch`, `FormField`; errors shown once a field is left and gone as soon as fixed, as i18n keys (`form.errors.*`, never the engine's English); server Problem Details `fields` (and `codeFields`) onto their fields; `useFormWithAction` for Server Actions and `@krizaka/ui/form/server` (`validateForm`, `formProblem`). Native: the same definitions on `TextField`, `Checkbox`, `DateField`, chips and the system's switch, the return key walking the fields, `scroll` above the keyboard, the product's mark as the submit's loader. Also `latestBirthDate`, `isRealDate`, `parseMoney`.

- [#127](https://github.com/krizaka/krizaka-ui/pull/127) [`3dca7b7`](https://github.com/krizaka/krizaka-ui/commit/3dca7b7d8e298fde5531506cc7c4dadfd64c85be) Thanks [@oussamaABID](https://github.com/oussamaABID)! - Native form fields in `@krizaka/ui/native` ([#122](https://github.com/krizaka/krizaka-ui/issues/122)): `TextField` (label, hint, error, every `TextInput` prop, `multiline`, an `end` adornment), `Checkbox` (a 44-pt row, words as a node with links, its error) and `DateField` (a memorable date typed as day · month · year in the locale's order, numeric keypads, auto-advance, `YYYY-MM-DD`, no native module) — with `datePartsOrder` and `composeDate`.

### Patch Changes

- Updated dependencies []:
  - @krizaka/tailwind@3.1.0

## 3.0.0

### Major Changes

- [#118](https://github.com/krizaka/krizaka-ui/pull/118) [`59aa124`](https://github.com/krizaka/krizaka-ui/commit/59aa124fb88ac3c4cf0ec8d82c3a242f9f260134) Thanks [@oussamaABID](https://github.com/oussamaABID)! - **`@krizaka/ui/data-table` v2 — on TanStack Table v9, the API redone (no v1 compatibility).** Products never import
  `@tanstack/*`: the escape hatch is `useDataTable().table`. New: `filters` (text, facet, range — `DataTableFilters`
  builds a `FilterBar` from the columns' `filter`, with facet counts and an announced result count), `groupBy` +
  `aggregate`, `renderDetail` (a panel under a row) and `getSubRows` (trees), `columnVisibility` (`DataTableColumnsMenu`),
  `pinning`, `resizing` (drag or ← → on a focusable separator), pagination under the table (`page`, `pageSize`,
  `pageSizeOptions`), server mode (`manual: { sorting, filtering, pagination }` + `rowCount` + `onStateChange` with a
  `DataTableQuery`), CSV export (`DataTableExport`, `dataTableCsv`), every state controlled or `default*`, `toolbar`.
  Same markup and accessibility, cards on a phone kept. **Breaking:** `manualSort` → `manual={{ sorting: true }}`;
  `virtualize={{ rowHeight, height, overscan }}` → `virtualized={{ height, estimateRowHeight, overscan }}` (rows are
  measured); a column's `width` is a number of px (was a CSS string); `DataTableColumn.value` returns `CellValue`; the
  hand-written sort and selection are gone.
  
  **New `@krizaka/ui/virtual`** (TanStack Virtual v3): `VirtualList` (its own scrolling region or `scroll="window"`,
  measured items, `onEndReached`, `ref.scrollToIndex` that respects reduced motion), `VirtualGrid` (as many columns as
  the width allows), `useVirtualizer` / `useWindowVirtualizer` through the facade.
  
  **New `@krizaka/ui/native/list`**: `List` on FlashList v2 (separators, skeleton rows, empty and error states, pull to
  refresh tinted with the theme, a spinner for the next page) and `useInfiniteList` (`useInfiniteQuery` of
  `@krizaka/query`, `meta: { list: true }`, the next page asked once at a time). `@shopify/flash-list` and
  `@krizaka/query` are optional peers. Ships the `skills/` SKILL.md of the three entries.

### Patch Changes

- Updated dependencies []:
  - @krizaka/tailwind@3.0.0

## 2.10.0

### Minor Changes

- [#107](https://github.com/krizaka/krizaka-ui/pull/107) [`05d097f`](https://github.com/krizaka/krizaka-ui/commit/05d097f1dde51092b9f86d54abede4fe0553cd11) Thanks [@oussamaABID](https://github.com/oussamaABID)! - **Page templates** (W4 of [#49](https://github.com/krizaka/krizaka-ui/issues/49)): every page of a Krizaka site has its template — a new `templates` category of
  krizaka.com/docs/ui with fifteen entries, each a distinct composition of the blocks (bento, split hero with the product
  alive, timeline, staggered gallery, sticky filters, editorial chapters, changelog with a sticky date…): `landing-page`,
  `product-page`, `how-it-works-page`, `gallery-page`, `docs-hub-page`, `docs-article-page`, `component-page`,
  `catalogue-page`, `longform-page`, `changelog-page`, `contact-page`, `legal-page`, `status-page` (also « under
  construction »), `error-page` and `pricing-page`. Words and content as props, the product's brand through `brand`, cut
  calls to action, staged motion, one column on a phone (each example has a phone story). Templates are Server
  Components: they import the blocks through the package's entries, keeping each block's client boundary.

- [#105](https://github.com/krizaka/krizaka-ui/pull/105) [`dc6156f`](https://github.com/krizaka/krizaka-ui/commit/dc6156fcac67f6285b966c2a27d56af75fc8db10) Thanks [@oussamaABID](https://github.com/oussamaABID)! - Yororis brand: mark, theme, mascot, icons. `@krizaka/tokens`: the `yororis` brand — `brands/yororis.css`, `.brand-yororis` in `brands/scoped.css`, `brands.yororis` and `marks.yororis` (web and native) — sand → sage, the accent on sage (≥ 60° from `--kz-success` and `--kz-warning`), the sand (mark, `accent-2`) told apart from the warning amber by its chroma, AA-tested in dark and light. `@krizaka/ui`: `YororisLogo` (web) and `YororisMark` (native) — "the hold": two filled leaves rising into a "Y" that cup a warm core, one node, the moment, on the orbit — `ProductLogo` / `ProductMark` accept `id="yororis"`, the "Brand family" story shows Krizaka and its four products; the flock gains the `crane` ("la grue écoute", the bird of listening). `@krizaka/icons`: `MomentIcon`, `ThreadIcon`, `KeepIcon`.

### Patch Changes

- Updated dependencies []:
  - @krizaka/tailwind@2.10.0

## 2.9.0

### Minor Changes

- [#94](https://github.com/krizaka/krizaka-ui/pull/94) [`815e47e`](https://github.com/krizaka/krizaka-ui/commit/815e47e3f0e58232016c5449dfd8c5cce6893291) Thanks [@oussamaABID](https://github.com/oussamaABID)! - **Layouts and templates** (W4 of [#49](https://github.com/krizaka/krizaka-ui/issues/49)): the shells of the products' screens, in a new `layouts` category of
  krizaka.com/docs/ui — `app-shell` (`AppShell`: a sidebar that collapses to its icons, a sticky header, a drawer on a
  phone), `dashboard-layout` (`DashboardLayout`, `Widget`), `settings-layout` (`SettingsLayout`, `SettingsSection`),
  `auth-layout` (`AuthLayout`), `detail-layout` (`DetailLayout`), `split-view` (`SplitView`), `marketing-layout`
  (`MarketingLayout`) and `docs-layout` (`DocsLayout`). Eleven **templates** — examples flagged `template: true`, whole
  screens with real words and a phone story: Orochia's creator studio, an administration console, Orazaka's console for
  Eric, sign-in, onboarding, account settings, a video's page, messages, a product page, pricing and credits, a
  documentation hub.

- [#95](https://github.com/krizaka/krizaka-ui/pull/95) [`3336895`](https://github.com/krizaka/krizaka-ui/commit/33368951b781d41323e086e24d8548c8c2801a11) Thanks [@oussamaABID](https://github.com/oussamaABID)! - A finer Yazakia mark: **two voices** — two solid speech bubbles, mirrored, that overlap, the left a shade deeper;
  where they overlap, a lens lit from above is the bright core that breathes. A filled glyph of Orochia's weight that
  reads at 16–24 px in a navigation chip (the first mark read as a thin "Y") and stays rich at 128 px. Same API
  (`YazakiaLogo`, `YazakiaMark`, `ProductLogo`/`ProductMark id="yazakia"`: `size`, `animated`, `title`), same gradient
  (`marks.yazakia` of @krizaka/tokens), same motion (the orbit and the pair turn, the core breathes; still under
  reduced motion), web and native drawn from one geometry without masks.

- [#106](https://github.com/krizaka/krizaka-ui/pull/106) [`32bf2c4`](https://github.com/krizaka/krizaka-ui/commit/32bf2c45beb6960b23bdacf318cb71c4b55ee819) Thanks [@oussamaABID](https://github.com/oussamaABID)! - The storytelling kit, generalised from krizaka.com/story: `ScrollStage` + `Scene` (chapters played once as they scroll
  in, one loop each while on screen), `ChoiceGrid` (choices as tiles, a radio group with roving focus when selectable),
  `ProfileCard` + `StatGauge` (web and native), `StageBanner`, `PromiseCard`, `GoalGauge` (a goal in steps; web and native), `ContinuePrompt`,
  `Achievement` + `AchievementList` + `Emblem`, and `Landscape` (the Krizaka valley at dusk, own or brand tone). Sober
  and professional by default; `variant="arcade"` (on a component or once on its stage) is the opt-in cabinet flavour.
  Styles in `@krizaka/ui/story.css`, imported once by the app. Reduced motion: everything still and visible. The flock
  gains `Phoenix` (web and native), the comeback.

### Patch Changes

- Updated dependencies []:
  - @krizaka/tailwind@2.9.0

## 2.8.0

### Minor Changes

- [#90](https://github.com/krizaka/krizaka-ui/pull/90) [`afce4b2`](https://github.com/krizaka/krizaka-ui/commit/afce4b2ec14c42c7550fc911af7db46d2a5d8bb6) Thanks [@oussamaABID](https://github.com/oussamaABID)! - Yazakia brand: mark, theme, mascot, icons. `@krizaka/tokens`: the `yazakia` brand — `brands/yazakia.css`, `.brand-yazakia` in `brands/scoped.css`, `brands.yazakia` and `marks.yazakia` (web and native) — emerald → turquoise, the accent on turquoise (hue 174, 14° from `--kz-success`), AA-tested in dark and light. `@krizaka/ui`: `YazakiaLogo` (web) and `YazakiaMark` (native) — two arms that lean in and meet, a core, the pair on the orbit — `ProductLogo` / `ProductMark` accept `id="yazakia"`, the "Brand family" story; the flock gains the `lovebird` ("l'inséparable présente", the bird of introductions). `@krizaka/icons`: `BatchIcon`, `DebriefIcon`, `IntroIcon`.

### Patch Changes

- Updated dependencies []:
  - @krizaka/tailwind@2.8.0

## 2.7.0

### Minor Changes

- [#87](https://github.com/krizaka/krizaka-ui/pull/87) [`f88a70d`](https://github.com/krizaka/krizaka-ui/commit/f88a70dcb01bf141eacc9a5192f351b5593ae8f9) Thanks [@oussamaABID](https://github.com/oussamaABID)! - `@krizaka/ui/mascot-state` and `@krizaka/ui/native`: `MascotState` — a moment told by a bird of the flock (nothing yet,
  a long task, done, it failed, welcome) beside the words and the next action — and its presets `ErrorState`,
  `SuccessState`, `LoadingState`, `WelcomeState`. The bird is chosen by the job (owl reads, falcon watches, duck builds,
  flamingo answers and gets paid, pigeon delivers), the mood by the moment. `role="alert"` for an error, `role="status"`
  otherwise (`aria-busy` while thinking); a staged arrival (bird, words, action) that stops under reduced motion;
  `stacked` or `inline`, `framed` for an empty list, `titleAs="h1"` for a full page.

### Patch Changes

- Updated dependencies []:
  - @krizaka/tailwind@2.7.0

## 2.6.0

### Minor Changes

- [#77](https://github.com/krizaka/krizaka-ui/pull/77) [`a1d60b7`](https://github.com/krizaka/krizaka-ui/commit/a1d60b7cf3999e44e2a15f3141a36890b3ead7f0) Thanks [@oussamaABID](https://github.com/oussamaABID)! - **Page blocks** (W4 of [#49](https://github.com/krizaka/krizaka-ui/issues/49), closes [#63](https://github.com/krizaka/krizaka-ui/issues/63)): the pieces every page of a Krizaka site is made of, in a new `blocks` category
  of krizaka.com/docs/ui — twelve entries, words as props, the brand through `.brand-<id>`, a subject's colour through
  `--kz-hue`, styles in `@krizaka/ui/blocks.css`, imported once by the app (`import "@krizaka/ui/blocks.css"` in its root layout).
  
  - `@krizaka/ui/page` — `Page` (one width `--kz-page-max`, one pair of gutters `--kz-page-gutter`: the bar, the hero and
    every section share their edges), `Section` (heading, `divider`, `spacing`, the brand's `backdrop`), `SectionHeading`,
    `Facts`, `Ticks`.
  - `@krizaka/ui/page-hero` — `PageHero`: back link, eyebrow, h1, lead, facts or actions, the page's bird; painted at once.
  - `@krizaka/ui/card-grid` — `CardGrid`: responsive, equal rows, staggered reveal, the pointer's light.
  - `@krizaka/ui/pointer-light` — `PointerLight`, `usePointerLight`.
  - `@krizaka/ui/link-card` — `LinkCard`: an entry point, the whole card one link (icon, title, sentence, the way in).
  - `@krizaka/ui/argument-card` — `ArgumentCard`, compact: the trap in one line, the way in; the long version in a panel.
  - `@krizaka/ui/mascot-quote` — `MascotQuote`: a rule told by a bird (`inline`, `callout`).
  - `@krizaka/ui/decision-list` — `DecisionList`: chose · refused · because · what it costs.
  - `@krizaka/ui/code-block` — `CodeBlock` (file, highlighted code on the tokens, copy) and `CodeTabs` (Maven · Gradle · npm).
  - `@krizaka/ui/action-bar` — `ActionBar`: link actions as buttons, or icon buttons with a CSS tooltip.
  - `@krizaka/ui/cta-panel` — `CtaPanel`: the call to act at the end of a section or a page.
  - `@krizaka/ui/toc` — `Toc` and `TocLayout`: the sections of a reading page, the one being read marked.

- [#86](https://github.com/krizaka/krizaka-ui/pull/86) [`17bc58b`](https://github.com/krizaka/krizaka-ui/commit/17bc58ba6e84c79ff9d45cde656517c8e5680b97) Thanks [@oussamaABID](https://github.com/oussamaABID)! - `@krizaka/ui/terminal-replay` — `TerminalReplay`: a terminal session played back, each command typed at the prompt and
  its output line by line, the screen following the last line. Rendered whole by the server (no JavaScript, reduced
  motion and assistive technology read the full transcript), a fixed-height screen (no layout shift), starts when it
  scrolls into view and waits off screen, play · pause · replay controls and an optional copy of the commands;
  `autoPlay={false}` keeps it at rest. Web, beta.

### Patch Changes

- Updated dependencies []:
  - @krizaka/tailwind@2.6.0

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

### Patch Changes

- Updated dependencies [[`62906f4`](https://github.com/krizaka/krizaka-ui/commit/62906f4cc2a56675499253d139df2921123cdd6e)]:
  - @krizaka/tailwind@2.5.0

## 2.4.0

### Minor Changes

- [#70](https://github.com/krizaka/krizaka-ui/pull/70) [`e4c3dc4`](https://github.com/krizaka/krizaka-ui/commit/e4c3dc42045edff501a493f5d1fd93b1e327e0b7) Thanks [@oussamaABID](https://github.com/oussamaABID)! - The data and media primitives (epic [#49](https://github.com/krizaka/krizaka-ui/issues/49), wave W2b), web and React Native where it makes sense:
  
  - **Data** — `@krizaka/ui/pagination` (pages or cursor, links or buttons, folded into "Page 3 of 12" on a phone; native
    `Pagination`), `@krizaka/ui/data-table` (sort, selection, loading / empty / error, cards in a narrow container,
    windowing), `@krizaka/ui/filter-bar` (`FilterBar`, `FilterMenu`, the filters in the address),
    `@krizaka/ui/combobox` (ARIA 1.2 autocomplete: static or fetched with a debounced, aborted `onSearch`, several values
    as chips, creatable), `@krizaka/ui/tag-input`, `@krizaka/ui/date-picker` (`DatePicker`, `DateRangePicker` with
    presets, `Calendar`: ISO dates, the locale's names through `@krizaka/intl`), `@krizaka/ui/search-field` (⌘K,
    suggestions; native `SearchField`).
  - **Media** — `@krizaka/ui/video-player` (accessible controls and keyboard, HLS through an hls.js the app loads only
    where needed, signed sources, subtitles, speed, full screen, pause off screen; native on expo-video at
    `@krizaka/ui/native/video-player`), `@krizaka/ui/file-upload` (`Dropzone`, `UploadList`, `useUploadQueue`: pause and
    resume through an AbortSignal, Tus-ready without depending on it), `@krizaka/ui/media-capture` (camera photo or clip,
    permission on a gesture, file-picker fallback; native on expo-camera at `@krizaka/ui/native/media-capture`),
    `@krizaka/ui/video-trimmer` (edge handles over a filmstrip, a playhead, every part stylable — closes [#44](https://github.com/krizaka/krizaka-ui/issues/44)),
    `@krizaka/ui/audio-player` (a seekable waveform), `@krizaka/ui/image-cropper` (a focus point and a zoom, `cropRect`).
  - A new catalogue category, `media`. hls.js, expo-video and expo-camera are optional peers.

### Patch Changes

- Updated dependencies [[`1ebdb61`](https://github.com/krizaka/krizaka-ui/commit/1ebdb61ce394a3e584dce40c5740b3193da8ea5e)]:
  - @krizaka/tailwind@2.4.0

## 2.3.0

### Minor Changes

- [#65](https://github.com/krizaka/krizaka-ui/pull/65) [`f14a096`](https://github.com/krizaka/krizaka-ui/commit/f14a096eb668f010e975df9617a941cc77fe3b36) Thanks [@oussamaABID](https://github.com/oussamaABID)! - Signature components and next-level feedback (DS2, wave W1 of [#49](https://github.com/krizaka/krizaka-ui/issues/49)) — additions only, the 2.x API is unchanged:
  
  - **New entries.** `./iso` (the isometric kit: `IsoHub` from data, `IsoScene`, `IsoPrism`, `IsoStack`, `IsoDome`, `IsoTile`, `IsoLink`, `IsoNode`, `IsoLabel` — server-rendered SVG, no client JavaScript), `./nav-bar` (floating bar that tightens on scroll, one light gliding between items, accessible menus, mobile panel), `./loader` (`Loader`: delay, minimum duration, ETA, drawn and announced endings; `LoadingRegion`: content ⇄ skeleton hand-over; `useDelayedWait`), `./number-ticker`, `./glow-card`, `./marquee`, `./stepper`, `./meter`, `./chip-link` (a filter that is a link, server-safe `chipVariants`, [#45](https://github.com/krizaka/krizaka-ui/issues/45)) and `./motion` (`MotionObserver`, `RotatingWord`).
  - **Motion ([#41](https://github.com/krizaka/krizaka-ui/issues/41)).** `MotionObserver` pauses what is off screen (`data-offscreen`), lets the first screen settle (`html[data-motion]`), drives `[data-kz-magnetic]`; `RotatingWord` keeps the width of its longest word (no layout shift); `[data-reveal="soft"]`; icon nodes light up and arrows lean in links and buttons.
  - **Button.** `shape="cut"` (45° corners), `loading` draws the Krizaka loader glyph (`indicator={false}` to keep your own), `progress`, `status` success·error (drawn, a ring opens, an error shakes once), `announce`, `shimmer`, `magnetic`; `IconButton` swaps its icon for the glyph.
  - **Feedback.** `Spinner` is the Krizaka glyph (a hexagon traced by light around a node) and takes a `value`; `LoaderGlyph` exported. `Progress`: `showLabel`, `eta`, `buffer`, `segments`, `status` paused·error. `Skeleton`: one brand reflection across the page, `SkeletonText`, `SkeletonShape` (the real component as its own skeleton). `Toast`: a hairline counts the time left (paused on hover), `undoToast`, `progressToast`, `groupedToast`.
  - **Tabs** glide one light to the active tab in every variant. **Dialog** `placement="left"` ([#43](https://github.com/krizaka/krizaka-ui/issues/43)), drawers slide from their edge.
  - Visual changes (new screenshots): Spinner, Button loading, Skeleton, Tabs, the side dialog's entrance.

### Patch Changes

- Updated dependencies [[`f14a096`](https://github.com/krizaka/krizaka-ui/commit/f14a096eb668f010e975df9617a941cc77fe3b36)]:
  - @krizaka/tailwind@2.3.0

## 2.2.0

### Minor Changes

- [#51](https://github.com/krizaka/krizaka-ui/pull/51) [`430dc6d`](https://github.com/krizaka/krizaka-ui/commit/430dc6dacf233e8c9f754d4e5ccc1ab8cbac23ce) Thanks [@oussamaABID](https://github.com/oussamaABID)! - `@krizaka/ui/mascots` — the Krizaka flock as a shared module: `Mascot` (web) and `Mascot` in `@krizaka/ui/native`. Five
  birds (falcon, owl, duck, flamingo, pigeon) in five moods (`welcome`, `thinking`, `success`, `empty`, `error`), drawn on
  one 120 × 120 grid from the site's original birds. `tone="brand"` (default) paints them in the host's accent
  (`--kz-accent`, `--kz-accent-2`) — blue on krizaka.com, orange in Orazaka, violet in Orochia — and `tone="own"` in each
  bird's signature colours of the Krizaka story. Light idle motion and a gesture per mood (wave, thinking dots, hop and
  badge, shake), all off under `prefers-reduced-motion` or with `animated={false}`. Documented by its `meta.ts` and five
  named examples (+ one native) on krizaka.com/docs/ui.

### Patch Changes

- Updated dependencies []:
  - @krizaka/tailwind@2.2.0

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

### Patch Changes

- Updated dependencies []:
  - @krizaka/tailwind@2.1.0

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

- [#12](https://github.com/krizaka/krizaka-ui/pull/12) [`f5bf3c5`](https://github.com/krizaka/krizaka-ui/commit/f5bf3c5622d5c3d7068ba011b29b64b61dfb059f) Thanks [@oussamaABID](https://github.com/oussamaABID)! - 2.0.0-beta: primitives — the first layer of `@krizaka/ui` 2.0, the atoms.
  
  New entries, one per component, on the `@krizaka/tailwind` roles (dark, light and every product theme):
  `@krizaka/ui/cn`, `/slot` (`Slot`, `VisuallyHidden`), `/button` (`Button`, `IconButton`, `buttonVariants`), `/badge`
  (`Badge`, `badgeVariants`), `/avatar` (`Avatar`, `Avatar.Group`), `/field` (`Field.Root/Label/Hint/Error`, `Input`,
  `Textarea`, `Select`), `/theme` (`ThemeScript`, `ThemeProvider`, `useTheme`, `ThemeToggle`), `/skeleton`,
  `/empty-state`, `/spinner` and `/countdown` (`Countdown`, `useCountdown`, `splitDuration` — the Orochia kit's API,
  unchanged). Server entries carry no directive; `avatar`, `theme` and `countdown` are client entries.
  
  The primitives need React 19 and Tailwind CSS v4 with `@krizaka/tailwind` then `@krizaka/ui/tailwind.css`
  (`tailwindcss` and `@krizaka/tailwind` are optional peers). New dependencies: `radix-ui`, `tailwind-variants`, `clsx`.
  
  **The marks stay compatible**: `.` (`KrizakaLogo`, `OrazakaLogo`, `OrochiaLogo`, `ProductLogo`, `MotionObserver`,
  `RotatingWord`, `cx`), `./native`, `./motion.css` and `./tailwind.css` are unchanged and still run on React 18. The
  major is the start of the 2.0 line (pre-release `beta`); `@krizaka/tokens` and `@krizaka/tailwind` move with it as
  members of the fixed group, without change.

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

- [#39](https://github.com/krizaka/krizaka-ui/pull/39) [`561300f`](https://github.com/krizaka/krizaka-ui/commit/561300f9c6b9d7c03181cf4769df94608f5bf8cb) Thanks [@oussamaABID](https://github.com/oussamaABID)! - What the products asked for before 2.0.0.
  
  - **`Command.List emptyLabel`**: the "nothing matches" message is rendered beside the listbox, never inside it (axe
    `aria-required-children`). `Command.Empty` inside `Command.List` still renders but warns in development; the
    no-results example is back in the documentation.
  - **`Card.Image loading`**: `lazy` by default, `eager` (with `fetchPriority="high"`) for the first cards of a page.
  - **`Button variant="gradient"`** (web and native): accent → accent-2, the brand's signature call to action. Native
    draws it with react-native-svg.
  - **Native `Avatar` draws SVG** (`….svg`, `data:image/svg+xml`, or `svg` for any URI) with react-native-svg — generated
    avatars no longer fall back to the initial.
  - **`Countdown showLabel`** (web and native): the label written before the segments, still its accessible name.

- [#33](https://github.com/krizaka/krizaka-ui/pull/33) [`07eb219`](https://github.com/krizaka/krizaka-ui/commit/07eb2192da82fddd7525dc1dd382b262f9cbdc8b) Thanks [@oussamaABID](https://github.com/oussamaABID)! - One family of marks. `KrizakaLogo` and `OrazakaLogo` are redrawn on the grammar of `OrochiaLogo` (unchanged): a bold
  emblem in an orbit, a bright core, a crop below 48 px — Krizaka an ink hexagonal shield with a blue node and core,
  Orazaka three solid shards in its orange. Native `KrizakaMark`, `OrazakaMark` and `ProductMark` join `OrochiaMark`,
  whose neutral strokes now follow the theme. New primitive `@krizaka/ui/section-backdrop` (`SectionBackdrop`: the
  brand's section gradient, light dome, perspective grid, blurred foreground, a 40 s drift that stops under reduced
  motion). Words in the accent now use `text-fg-accent` (outline button hover, card title hover, menu indicator; native
  `Txt tone="accent"`).

- [#17](https://github.com/krizaka/krizaka-ui/pull/17) [`7de0337`](https://github.com/krizaka/krizaka-ui/commit/7de0337830983f4f2e1794d0a2cad1c77a77bda0) Thanks [@oussamaABID](https://github.com/oussamaABID)! - 2.0.0-beta: the second layer of primitives — the structure of a page and what opens over it.
  
  New entries (server-safe unless noted), on the `@krizaka/tailwind` roles, in dark, light and every product theme:
  
  - `@krizaka/ui/card` — `Card.Root` (`asChild`, `reveal`, `radius`, `tone` default·elevated·glass, `interactive`),
    `Card.Media` (`aspect`), `Card.Image` (`fallback`), `Card.Overlay` (`corner`), `Card.Body` (`padding`),
    `Card.Title` (`as`), `Card.Description`, `Card.Stat`, `Card.Footer`, and `card` (the `tv` slots). No hook, no context.
  - `@krizaka/ui/dialog` (client) — `Dialog.Root/Trigger/Content/Header/Title/Description/Body/Footer/Close` on Radix
    Dialog (`placement` center·bottom·right, `size` sm·md·lg, `closeLabel` required), `Sheet` (= bottom placement) and
    `AlertDialog` (`confirmLabel`, `cancelLabel`, `tone` danger·primary, async `onConfirm` with a loading state).
  - `@krizaka/ui/toast` (client) — `Toaster` (sonner, its own styling and `richColors` off, every part on a role; `label`
    and `closeLabel` required) and `toast` re-exported.
  - `@krizaka/ui/popover`, `/dropdown-menu`, `/tooltip` (client) — thin Radix wrappers on one floating surface
    (`bg-surface-2`, border, `shadow-lg`, `kz-pop`); menu items take `tone="danger"`; `Tooltip` waits 300 ms by default.
  - `@krizaka/ui/stat` (`trend` up·down·flat with `trendLabel`), `/page-header` (`title`, `description`, `actions`,
    `breadcrumb`), `/alert` (`tone` info·success·warning·danger, `role="alert"` only for danger and warning), `/separator`
    (Radix), `/kbd`.
  
  New dependency: `sonner`. Status colours stay soft (tint, border, icon) and the text a text role, for WCAG AA in light.

- [#36](https://github.com/krizaka/krizaka-ui/pull/36) [`5167bcb`](https://github.com/krizaka/krizaka-ui/commit/5167bcbb4857022b1e9562a10f17bc58e8691301) Thanks [@oussamaABID](https://github.com/oussamaABID)! - The code drives the documentation: krizaka.com/docs/ui is generated from the registry, and the registry from the code.
  
  - Every component has a typed `meta.ts` beside it (`src/meta.ts`): summary, status, category, platforms (`web` ·
    `native` · `both`), when to use it and when not (and what to use instead), best practices, accessibility (keyboard,
    roles), related components, and per platform the names to import — for React Native, what differs from the web API.
    `segmented` and `txt` (React Native only) are documented too.
  - Named examples, one per significant variant: `registry/examples/<name>/<example>.tsx` and
    `registry/examples/<name>/native/<example>.tsx` (≤ 40 lines, the code a product copies), shipped as source and
    compiled (`@krizaka/ui/registry/examples/<name>/<example>`). The stories render them.
  - `registry/<name>.json` carries the meta, the web and native imports, props (native props documented too) and
    examples (title, description, code, module); `registry/index.json` lists title, summary, status, category,
    platforms and example counts.
  - **Breaking for registry readers**: `registry/demos/*` and the `./registry/demos/*` export are replaced by the
    examples; `demo` in an item is now its first web example.
  - Storybook is internal (CI's visual and a11y tests): no GitHub Pages, no ui.krizaka.com mirror.

- [#22](https://github.com/krizaka/krizaka-ui/pull/22) [`2c0c91f`](https://github.com/krizaka/krizaka-ui/commit/2c0c91f14e890d8c9485c61d89e9b1bb840f4aab) Thanks [@oussamaABID](https://github.com/oussamaABID)! - Navigation and input primitives: `./tabs` (`Tabs.Root/List/Trigger/Content`, variant underline · segmented · pills),
  `./chip` (`Chip` selectable or removable, `Chip.Group` single · multiple on Radix Toggle Group), `./switch`, `./slider`
  (one value or a range, `formatValue` for aria-valuetext, `showLabel`, `origin`), `./checkbox` and `./radio-group`
  (`RadioGroup.Item`, `RadioGroup.Card` — a whole card is the radio), `./command` (cmdk: `Command.*` and
  `CommandDialog`), `./confirm-button` (two presses, `timeoutMs`, announced) and `./progress` (bar · ring,
  indeterminate, server-safe). `Dialog.Content` takes `hideClose` (`closeLabel` then optional) and `dismissible={false}`
  (Escape and an outside click do not close it). New dependency: `cmdk`.
  
  Class merging, checked as a product installs the package: `scripts/consumer.mjs` (run by `publint`) packs
  `@krizaka/ui`, installs it alone in an empty folder and asserts that `cn("px-2", "px-4")` is `"px-4"` and that a
  product's `className` wins over a variant. The merge engine is tailwind-variants' own since 3.3 (bundled, it never
  imports `tailwind-merge`), so `@krizaka/ui` declares `tailwind-variants ^3.3.1` and no `tailwind-merge`.

- [#28](https://github.com/krizaka/krizaka-ui/pull/28) [`8147bb6`](https://github.com/krizaka/krizaka-ui/commit/8147bb658fa2841f53e81230d216d6882a182e4b) Thanks [@oussamaABID](https://github.com/oussamaABID)! - The registry: every primitive published as data, for documentation sites and a future `npx @krizaka/cli add`.
  
  - `@krizaka/ui/registry/<name>` (JSON): its sources, npm dependencies, the primitives it builds on, its demo and the
    documentation of its props (react-docgen-typescript: name, type, default, description, required);
    `@krizaka/ui/registry/index` lists them all.
  - `@krizaka/ui/registry/demos/<name>`: one demo per primitive (ESM, client, ≤ 40 lines, the `.tsx` source beside it),
    the very code of its default story. Demos that open over the page take `defaultOpen`.
  - Every prop a primitive declares has a JSDoc description (the variants included), so editors show it too.

### Patch Changes

- [#30](https://github.com/krizaka/krizaka-ui/pull/30) [`c612967`](https://github.com/krizaka/krizaka-ui/commit/c612967ca62df35017c701aeeaba4b062e313318) Thanks [@oussamaABID](https://github.com/oussamaABID)! - `@krizaka/ui/native` reaches parity with the web for the React Native apps: `ThemeProvider` / `useTheme` (`mode`
  dark·light·system through `useColorScheme`, the `@krizaka/tokens/native` roles with a product's `overrides`, `fonts`,
  `useReducedMotion`), `Txt`, `Button`, `IconButton`, `Card.Root/Media/Image/Overlay/Body/Title/Description/Footer`,
  `Badge`, `Chip` + `Chip.Group`, `Avatar` + `Avatar.Group`, `Skeleton`, `EmptyState`, `Spinner`, `Countdown` (the web's
  clock, `countdown/core`), `Segmented`, `Progress` (bar and ring, react-native-svg) and `Toaster` / `toast`. Same prop
  names as the web where the concept is the same, `StyleSheet` only, accessibility through `role` and `aria-*`, every
  animation still under reduced motion. No new dependency for an app: the token values are inlined, the peers stay
  `react-native` ≥ 0.76 and `react-native-svg` ≥ 15. `dist/native.js` is checked to carry no `"use client"`, no DOM and
  no other import.
- Updated dependencies [[`561300f`](https://github.com/krizaka/krizaka-ui/commit/561300f9c6b9d7c03181cf4769df94608f5bf8cb), [`561300f`](https://github.com/krizaka/krizaka-ui/commit/561300f9c6b9d7c03181cf4769df94608f5bf8cb), [`07eb219`](https://github.com/krizaka/krizaka-ui/commit/07eb2192da82fddd7525dc1dd382b262f9cbdc8b)]:
  - @krizaka/tailwind@2.0.0

## 2.0.0-beta.6

### Minor Changes

- [#36](https://github.com/krizaka/krizaka-ui/pull/36) [`5167bcb`](https://github.com/krizaka/krizaka-ui/commit/5167bcbb4857022b1e9562a10f17bc58e8691301) Thanks [@oussamaABID](https://github.com/oussamaABID)! - The code drives the documentation: krizaka.com/docs/ui is generated from the registry, and the registry from the code.
  
  - Every component has a typed `meta.ts` beside it (`src/meta.ts`): summary, status, category, platforms (`web` ·
    `native` · `both`), when to use it and when not (and what to use instead), best practices, accessibility (keyboard,
    roles), related components, and per platform the names to import — for React Native, what differs from the web API.
    `segmented` and `txt` (React Native only) are documented too.
  - Named examples, one per significant variant: `registry/examples/<name>/<example>.tsx` and
    `registry/examples/<name>/native/<example>.tsx` (≤ 40 lines, the code a product copies), shipped as source and
    compiled (`@krizaka/ui/registry/examples/<name>/<example>`). The stories render them.
  - `registry/<name>.json` carries the meta, the web and native imports, props (native props documented too) and
    examples (title, description, code, module); `registry/index.json` lists title, summary, status, category,
    platforms and example counts.
  - **Breaking for registry readers**: `registry/demos/*` and the `./registry/demos/*` export are replaced by the
    examples; `demo` in an item is now its first web example.
  - Storybook is internal (CI's visual and a11y tests): no GitHub Pages, no ui.krizaka.com mirror.

### Patch Changes

- Updated dependencies []:
  - @krizaka/tailwind@2.0.0-beta.6

## 2.0.0-beta.5

### Minor Changes

- [#33](https://github.com/krizaka/krizaka-ui/pull/33) [`07eb219`](https://github.com/krizaka/krizaka-ui/commit/07eb2192da82fddd7525dc1dd382b262f9cbdc8b) Thanks [@oussamaABID](https://github.com/oussamaABID)! - One family of marks. `KrizakaLogo` and `OrazakaLogo` are redrawn on the grammar of `OrochiaLogo` (unchanged): a bold
  emblem in an orbit, a bright core, a crop below 48 px — Krizaka an ink hexagonal shield with a blue node and core,
  Orazaka three solid shards in its orange. Native `KrizakaMark`, `OrazakaMark` and `ProductMark` join `OrochiaMark`,
  whose neutral strokes now follow the theme. New primitive `@krizaka/ui/section-backdrop` (`SectionBackdrop`: the
  brand's section gradient, light dome, perspective grid, blurred foreground, a 40 s drift that stops under reduced
  motion). Words in the accent now use `text-fg-accent` (outline button hover, card title hover, menu indicator; native
  `Txt tone="accent"`).

### Patch Changes

- Updated dependencies [[`07eb219`](https://github.com/krizaka/krizaka-ui/commit/07eb2192da82fddd7525dc1dd382b262f9cbdc8b)]:
  - @krizaka/tailwind@2.0.0-beta.5

## 2.0.0-beta.4

### Patch Changes

- [#30](https://github.com/krizaka/krizaka-ui/pull/30) [`c612967`](https://github.com/krizaka/krizaka-ui/commit/c612967ca62df35017c701aeeaba4b062e313318) Thanks [@oussamaABID](https://github.com/oussamaABID)! - `@krizaka/ui/native` reaches parity with the web for the React Native apps: `ThemeProvider` / `useTheme` (`mode`
  dark·light·system through `useColorScheme`, the `@krizaka/tokens/native` roles with a product's `overrides`, `fonts`,
  `useReducedMotion`), `Txt`, `Button`, `IconButton`, `Card.Root/Media/Image/Overlay/Body/Title/Description/Footer`,
  `Badge`, `Chip` + `Chip.Group`, `Avatar` + `Avatar.Group`, `Skeleton`, `EmptyState`, `Spinner`, `Countdown` (the web's
  clock, `countdown/core`), `Segmented`, `Progress` (bar and ring, react-native-svg) and `Toaster` / `toast`. Same prop
  names as the web where the concept is the same, `StyleSheet` only, accessibility through `role` and `aria-*`, every
  animation still under reduced motion. No new dependency for an app: the token values are inlined, the peers stay
  `react-native` ≥ 0.76 and `react-native-svg` ≥ 15. `dist/native.js` is checked to carry no `"use client"`, no DOM and
  no other import.
- Updated dependencies []:
  - @krizaka/tailwind@2.0.0-beta.4

## 2.0.0-beta.3

### Minor Changes

- [#28](https://github.com/krizaka/krizaka-ui/pull/28) [`8147bb6`](https://github.com/krizaka/krizaka-ui/commit/8147bb658fa2841f53e81230d216d6882a182e4b) Thanks [@oussamaABID](https://github.com/oussamaABID)! - The registry: every primitive published as data, for documentation sites and a future `npx @krizaka/cli add`.
  
  - `@krizaka/ui/registry/<name>` (JSON): its sources, npm dependencies, the primitives it builds on, its demo and the
    documentation of its props (react-docgen-typescript: name, type, default, description, required);
    `@krizaka/ui/registry/index` lists them all.
  - `@krizaka/ui/registry/demos/<name>`: one demo per primitive (ESM, client, ≤ 40 lines, the `.tsx` source beside it),
    the very code of its default story. Demos that open over the page take `defaultOpen`.
  - Every prop a primitive declares has a JSDoc description (the variants included), so editors show it too.

### Patch Changes

- Updated dependencies []:
  - @krizaka/tailwind@2.0.0-beta.3

## 2.0.0-beta.2

### Minor Changes

- [#22](https://github.com/krizaka/krizaka-ui/pull/22) [`2c0c91f`](https://github.com/krizaka/krizaka-ui/commit/2c0c91f14e890d8c9485c61d89e9b1bb840f4aab) Thanks [@oussamaABID](https://github.com/oussamaABID)! - Navigation and input primitives: `./tabs` (`Tabs.Root/List/Trigger/Content`, variant underline · segmented · pills),
  `./chip` (`Chip` selectable or removable, `Chip.Group` single · multiple on Radix Toggle Group), `./switch`, `./slider`
  (one value or a range, `formatValue` for aria-valuetext, `showLabel`, `origin`), `./checkbox` and `./radio-group`
  (`RadioGroup.Item`, `RadioGroup.Card` — a whole card is the radio), `./command` (cmdk: `Command.*` and
  `CommandDialog`), `./confirm-button` (two presses, `timeoutMs`, announced) and `./progress` (bar · ring,
  indeterminate, server-safe). `Dialog.Content` takes `hideClose` (`closeLabel` then optional) and `dismissible={false}`
  (Escape and an outside click do not close it). New dependency: `cmdk`.
  
  Class merging, checked as a product installs the package: `scripts/consumer.mjs` (run by `publint`) packs
  `@krizaka/ui`, installs it alone in an empty folder and asserts that `cn("px-2", "px-4")` is `"px-4"` and that a
  product's `className` wins over a variant. The merge engine is tailwind-variants' own since 3.3 (bundled, it never
  imports `tailwind-merge`), so `@krizaka/ui` declares `tailwind-variants ^3.3.1` and no `tailwind-merge`.

### Patch Changes

- Updated dependencies []:
  - @krizaka/tailwind@2.0.0-beta.2

## 2.0.0-beta.1

### Minor Changes

- [#17](https://github.com/krizaka/krizaka-ui/pull/17) [`7de0337`](https://github.com/krizaka/krizaka-ui/commit/7de0337830983f4f2e1794d0a2cad1c77a77bda0) Thanks [@oussamaABID](https://github.com/oussamaABID)! - 2.0.0-beta: the second layer of primitives — the structure of a page and what opens over it.
  
  New entries (server-safe unless noted), on the `@krizaka/tailwind` roles, in dark, light and every product theme:
  
  - `@krizaka/ui/card` — `Card.Root` (`asChild`, `reveal`, `radius`, `tone` default·elevated·glass, `interactive`),
    `Card.Media` (`aspect`), `Card.Image` (`fallback`), `Card.Overlay` (`corner`), `Card.Body` (`padding`),
    `Card.Title` (`as`), `Card.Description`, `Card.Stat`, `Card.Footer`, and `card` (the `tv` slots). No hook, no context.
  - `@krizaka/ui/dialog` (client) — `Dialog.Root/Trigger/Content/Header/Title/Description/Body/Footer/Close` on Radix
    Dialog (`placement` center·bottom·right, `size` sm·md·lg, `closeLabel` required), `Sheet` (= bottom placement) and
    `AlertDialog` (`confirmLabel`, `cancelLabel`, `tone` danger·primary, async `onConfirm` with a loading state).
  - `@krizaka/ui/toast` (client) — `Toaster` (sonner, its own styling and `richColors` off, every part on a role; `label`
    and `closeLabel` required) and `toast` re-exported.
  - `@krizaka/ui/popover`, `/dropdown-menu`, `/tooltip` (client) — thin Radix wrappers on one floating surface
    (`bg-surface-2`, border, `shadow-lg`, `kz-pop`); menu items take `tone="danger"`; `Tooltip` waits 300 ms by default.
  - `@krizaka/ui/stat` (`trend` up·down·flat with `trendLabel`), `/page-header` (`title`, `description`, `actions`,
    `breadcrumb`), `/alert` (`tone` info·success·warning·danger, `role="alert"` only for danger and warning), `/separator`
    (Radix), `/kbd`.
  
  New dependency: `sonner`. Status colours stay soft (tint, border, icon) and the text a text role, for WCAG AA in light.

### Patch Changes

- Updated dependencies []:
  - @krizaka/tailwind@2.0.0-beta.1

## 2.0.0-beta.0

### Major Changes

- [#12](https://github.com/krizaka/krizaka-ui/pull/12) [`f5bf3c5`](https://github.com/krizaka/krizaka-ui/commit/f5bf3c5622d5c3d7068ba011b29b64b61dfb059f) Thanks [@oussamaABID](https://github.com/oussamaABID)! - 2.0.0-beta: primitives — the first layer of `@krizaka/ui` 2.0, the atoms.
  
  New entries, one per component, on the `@krizaka/tailwind` roles (dark, light and every product theme):
  `@krizaka/ui/cn`, `/slot` (`Slot`, `VisuallyHidden`), `/button` (`Button`, `IconButton`, `buttonVariants`), `/badge`
  (`Badge`, `badgeVariants`), `/avatar` (`Avatar`, `Avatar.Group`), `/field` (`Field.Root/Label/Hint/Error`, `Input`,
  `Textarea`, `Select`), `/theme` (`ThemeScript`, `ThemeProvider`, `useTheme`, `ThemeToggle`), `/skeleton`,
  `/empty-state`, `/spinner` and `/countdown` (`Countdown`, `useCountdown`, `splitDuration` — the Orochia kit's API,
  unchanged). Server entries carry no directive; `avatar`, `theme` and `countdown` are client entries.
  
  The primitives need React 19 and Tailwind CSS v4 with `@krizaka/tailwind` then `@krizaka/ui/tailwind.css`
  (`tailwindcss` and `@krizaka/tailwind` are optional peers). New dependencies: `radix-ui`, `tailwind-variants`, `clsx`.
  
  **The marks stay compatible**: `.` (`KrizakaLogo`, `OrazakaLogo`, `OrochiaLogo`, `ProductLogo`, `MotionObserver`,
  `RotatingWord`, `cx`), `./native`, `./motion.css` and `./tailwind.css` are unchanged and still run on React 18. The
  major is the start of the 2.0 line (pre-release `beta`); `@krizaka/tokens` and `@krizaka/tailwind` move with it as
  members of the fixed group, without change.

### Patch Changes

- Updated dependencies []:
  - @krizaka/tailwind@2.0.0-beta.0

## 1.3.0

### Minor Changes

- [#9](https://github.com/krizaka/krizaka-ui/pull/9) [`559b9b7`](https://github.com/krizaka/krizaka-ui/commit/559b9b70478e3e42c98f6dd220515d477d3f0b78) Thanks [@oussamaABID](https://github.com/oussamaABID)! - New export `@krizaka/ui/tailwind.css`: import it after the `@krizaka/tailwind` preset and Tailwind generates the classes
  the components use (`@source "./dist"`). Every component now has stories, published at
  https://krizaka.github.io/krizaka-ui/latest/.

## 1.2.0

### Patch Changes

- [#2](https://github.com/krizaka/krizaka-ui/pull/2) [`a46f9d4`](https://github.com/krizaka/krizaka-ui/commit/a46f9d423f1c151f37a10237f8cd5a27a25466ba) Thanks [@oussamaABID](https://github.com/oussamaABID)! - build: monorepo — the package moves to `packages/ui` of the krizaka-ui monorepo (pnpm, Turborepo, Changesets).
  Same exports, same `dist`; `repository.directory` now points at `packages/ui` and releases are published by
  Changesets with provenance.

- [#5](https://github.com/krizaka/krizaka-ui/pull/5) [`dae54c9`](https://github.com/krizaka/krizaka-ui/commit/dae54c96626ad15cf3c55ec9129c3011358a230d) Thanks [@oussamaABID](https://github.com/oussamaABID)! - motion.css reads the accent: the `kz-spotlight` glow and the `kz-lift` shadow mix `--kz-accent` (`color-mix` in oklab)
  instead of a hard-coded violet, with the former violet as fallback for hosts without tokens.
