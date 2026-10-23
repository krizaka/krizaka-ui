# @krizaka/ui — Repository Contract (agent-neutral)

> Scope of [`krizaka/krizaka-ui`](https://github.com/krizaka/krizaka-ui), published on npm as **`@krizaka/ui`**.
> Lives in `packages/ui` of the krizaka-ui monorepo: the root [`AGENTS.md`](../../AGENTS.md) applies first.

## 1. What belongs here

- The **primitives** (level 1 of the root contract): `cn`, `slot`, `button`, `badge`, `avatar`, `field`, `theme`,
  `skeleton`, `empty-state`, `spinner`, `countdown`, `card`, `dialog`, `toast`, `popover`, `dropdown-menu`, `tooltip`,
  `stat`, `page-header`, `alert`, `separator`, `kbd`, `tabs`, `chip`, `switch`, `slider`, `checkbox`, `radio-group`,
  `command`, `confirm-button`, `progress`, `section-backdrop`, `loader`, `meter`, `stepper`, `number-ticker`, `terminal-replay`,
  `nav-bar` (with the family switcher `NavBar.Family`), `language-switch` (the one language control of the family), `sites` (the Krizaka family as data), `site-footer`, `chip-link`, `glow-card`, `marquee`, `iso`, `mascots`, `elephant` (the neighbour joke: a small standing or flying mark, Yororis), and the data and media primitives `pagination`,
  `data-table` (TanStack Table v9), `virtual` (TanStack Virtual v3), `form` (TanStack Form v1: `./form`, `./form/server`, `./native/form`), `filter-bar`, `combobox`, `tag-input`, `date-picker`, `search-field`, `video-player`, `file-upload`,
  `media-capture`, `video-trimmer`, `audio-player`, `image-cropper`, `document-viewer` (pdf.js, an optional peer loaded by the app; passages lit from the PDF's text positions), `map` (MapLibre over Protomaps PMTiles on the Krizaka CDN, the style generated from the tokens; `maplibre-gl` an optional peer, loaded on demand; native `./native/map` on `@maplibre/maplibre-react-native`, an optional peer), and the **page blocks** (category `blocks`) `page`,
  `page-hero`, `card-grid`, `pointer-light`, `link-card`, `argument-card`, `mascot-quote`, the Cahier's `specimen-tag`, `bird-plate`, `taped-photo`, `stuck` (a block stuck into the notebook: tape, pin, corners, glue), `doodle` (margin doodles), `signature` (the house's stamp and name), `anatomy-plate`, `page-index`, `footnote` (ADR-004), `decision-list`, `code-block` (TanStack Highlight), `markdown` (TanStack Markdown; `./native/markdown`), `recipes` (`defineRecipe`: the variants of Button, Badge, Chip and Card written once, read by `tv()` on the web and by `nativeRecipe` on the phone),
  `action-bar`, `cta-panel`, `toc`, and the **layouts** (category `layouts`, with their templates) `app-shell`,
  `dashboard-layout`, `settings-layout`, `auth-layout`, `detail-layout`, `split-view`, `marketing-layout`, `docs-layout`, `docs-nav`, and the **storytelling kit** (`story.css`, sober by default, `variant="arcade"` opt-in)
  `scroll-stage`, `choice-grid`, `profile-card`, `stage-banner`, `goal-gauge`, `continue-prompt`, `achievement`,
  `promise-card`, `landscape`,
  and the **page templates** (category `templates`) `landing-page`, `product-page`, `how-it-works-page`, `gallery-page`, `docs-hub-page`, `docs-article-page`, `component-page`, `catalogue-page`, `longform-page`, `changelog-page`, `contact-page`, `legal-page`, `status-page`, `error-page`, `pricing-page` —
  one entry each, built with `tailwind-variants` on the preset's
  roles, Radix UI for non-trivial interactions. They follow the 12-point component contract (README, "Primitives").
- The **native platform** (`./native`, `src/native`): the theme (`ThemeProvider`/`useTheme` on the
  `@krizaka/tokens/native` roles + a product's `overrides`) and the same primitives for React Native — `Txt`,
  `Button`, `IconButton`, `Card.*`, `Badge`, `Chip`, `Avatar`, `Skeleton`, `EmptyState`, `Spinner`, `Countdown`,
  `Segmented`, `Progress`, `Toaster`/`toast`, `Mascot`, `Pagination`, `SearchField`, the form fields `TextField`, `Checkbox`, `DateField`, the controls `Switch`, `RadioGroup`, `Slider`, `Select`, `Combobox`, `Sheet`, the dates and times `Calendar`, `MonthPicker`, `DayStrip`, `TimePicker`, `DateWheel`, `WheelPicker` + `Wheel` (haptics through the provider's `haptics`, the app's module) — with the web's prop names where the
  concept is the same. What needs an Expo module has its own entry, the module an **optional peer** installed only by
  the apps that use it: `./native/video-player` (expo-video), `./native/media-capture` (expo-camera) and `./native/list`
  (FlashList v2 and `@krizaka/query`: `List` + `useInfiniteList`, the app's QueryClient context) and `./native/form` (the forms of `./form` on the native fields; TanStack Form is a dependency); they import the
  platform through `@krizaka/ui/native` (one theme context). Jest and Storybook render them on stand-ins
  (`src/native/mocks`).
- The **brand layer shared by every Krizaka product**: the animated marks (`KrizakaLogo`, `OrazakaLogo`,
  `OrochiaLogo`, `YasakiaLogo`, `YororisLogo`, `YomizakaLogo`, `KachizakaLogo`, `AkinazaLogo`, `ProductLogo`; native `KrizakaMark`, `OrazakaMark`, `OrochiaMark`, `YasakiaMark`, `YororisMark`, `YomizakaMark`, `KachizakaMark`, `AkinazaMark`, `ProductMark`), one family drawn from
  shared geometry (`marks/*-geometry.ts`, colours tested against the brand themes of `@krizaka/tokens`, see its
  `BRAND.md`), and the **Krizaka motion signature** (`motion.css`, `./motion`: `MotionObserver` — reveal, off-screen
  pause, settle, spotlight, magnetism — and `RotatingWord`; the section backdrop's layers; the loader glyph; the
  isometric kit's `kz-iso-*`).
- Nothing product-specific: a product's components live in its own design system (`@krizaka/orochia-design-system`,
  `@krizaka/orazaka-design-system`), which builds on this package.

## 2. Rules

- **Marks and motion: no framework, no CSS library.** Marks embed their own CSS with prefixed classes (`kzm-`, `ozm-`,
  `orom-`, `yzm-`, `yrm-`); the signature is plain CSS with `kz-` classes and `--kz-*` variables. They run on React 18 and 19.
- **Primitives: React 19, Tailwind v4 + `@krizaka/tailwind`.** Dependencies: `radix-ui`, `tailwind-variants` (its
  merge engine is the one `cn` uses — a single copy), `clsx`, `sonner` (the toasts), `cmdk` (the command palette; it
  shares Radix's Dialog with `./dialog`), and the headless engines behind the facade (ADR-001, pinned exactly):
  `@tanstack/react-table` (`./data-table`), `@tanstack/react-virtual` (`./virtual`) and `@tanstack/react-form` (`./form`, `./native/form`) — a product never imports them;
  `useDataTable()` and `useVirtualizer` are the escape hatches. Colours are roles only (lint `krizakaUi`, strict);
  words are props (`label`, `units`…), never `t()`; state is `data-*`; `className` is merged last.
- **Server by default**: an entry gets `"use client"` only when it holds a hook or a portal (tsup client group).
- **Native: `StyleSheet` and the theme's roles only** — no NativeWind, no dependency beyond `react-native` and
  `react-native-svg` (the token values are inlined by tsup; their types are declared in `src/native/theme.tsx` and
  checked against `@krizaka/tokens/native` by a test). Accessibility through `role` and `aria-*` (what
  react-native-web maps to ARIA). `dist/native.js` has no `"use client"`, no DOM, no other import
  (`scripts/native-dist.mjs`, run by `publint`). Its stories (`src/native/<Name>.stories.tsx`, `Native/<Name>`, with
  the `nativeFrame` decorator) render in the web Storybook through react-native-web.
- **Both themes**: neutral strokes read the host's `--kz-*` tokens and fall back to the text colour.
- **Unique ids per instance** (`useId`); decorative by default, an accessible image with `title`.
- **A story per component** (`src/**/<Name>.stories.tsx`, one per variant), rendered and tested by `apps/storybook`.
- **Reduced motion**: every animation stops under `prefers-reduced-motion`; marks also take `animated={false}`.
- A change to a mark is a change to the brand: it ships as a new version that every app adopts — the apps never
  keep a copy.

## 3. Quality gates

- `pnpm turbo run check --filter=@krizaka/ui`: type-check, tests (Vitest + happy-dom for the web; Jest with React
  Native's preset and Testing Library for `src/native`), build (tsup), size, publint.
- **Size budgets** (`size-limit`, gzip, peers excluded): `.` ≤ 8 kB; `./native` ≤ 31.5 kB (with the flock's geometry; 2.5.0: the material's roles and shadows of the inlined tokens; 2.8.0: the Yasakia mark and the lovebird; 2.9: the finer Yasakia mark — two voices and a lit lens, +0.15 kB; the storytelling kit's ProfileCard, GoalGauge and the phoenix; the Yororis mark, the crane and the fifth brand's inlined tokens, +0.7 kB; 3.13: the Yomizaka mark, +0.9 kB; 3.15: the Kachizaka and Akinaza marks, the magpie and the beaver, +1.3 kB; 3.1: the form fields TextField, Checkbox and DateField and the date helpers, +1.7 kB; 3.2: the dates and times — Calendar, MonthPicker, DayStrip, the wheels, TimePicker, DateWheel — +4.9 kB; the controls — Switch, RadioGroup, Slider, Sheet, Select, Combobox — +4.9 kB) (Metro
  bundles it into the app, nothing is downloaded: a regression guard, not a budget); the shared runtime
  (`./cn`: clsx + tailwind-variants and its merge engine, paid once per app) ≤ 14 kB; each primitive is measured
  without that runtime (Radix included): `./button` ≤ 3.5 kB (it draws the loader glyph), `./avatar` ≤ 6 kB, `./theme` ≤ 2 kB, `./countdown` ≤ 2 kB,
  `./slot` ≤ 2 kB, `./field` ≤ 1.5 kB, `./card` ≤ 3 kB, `./separator` ≤ 2 kB (Radix's `Primitive` and `Slot`),
  `./confirm-button` ≤ 4 kB, `./progress` ≤ 1.8 kB, `./section-backdrop` ≤ 1 kB, `./mascots` ≤ 5.5 kB (seven birds' geometry and the phoenix; the crane +0.27 kB), `./iso` ≤ 4.5 kB (a hero with no
  client JavaScript), `./loader`, `./meter`, `./stepper`, `./glow-card`, `./chip-link` ≤ 2 kB, `./motion`, `./number-ticker`,
  `./marquee` ≤ 1.5 kB, `./update-prompt`, `./force-update-screen` and `./maintenance-screen` ≤ 3.5 kB (the screens of the app-version contract, on the `./button` entry), `./showcase` ≤ 3 kB (the slideshow's state, observers and controls), `./terminal-replay` ≤ 2.5 kB (its timer, observer and controls), the other atoms ≤ 1 kB. The controls carry Radix's roving focus
  or its form plumbing: `./switch` ≤ 6 kB, `./checkbox` ≤ 6 kB, `./chip` ≤ 10 kB, `./tabs` ≤ 10 kB, `./radio-group`
  ≤ 12.5 kB (3.2: the tactile keys, the cards' check and the segments' gliding light), `./slider` ≤ 12 kB. What opens over the page carries Radix's machinery (dismissable layer, focus scope, scroll lock,
  and Floating UI for what is placed next to a trigger) — shared between these entries in an app, but counted in
  each: `./dialog` ≤ 16.5 kB, `./toast` ≤ 11.5 kB (sonner), `./nav-bar` ≤ 24.6 kB (Radix NavigationMenu and the family's marks — 3.13: +0.6 kB for the Yomizaka mark; 3.15: +0.8 kB for Kachizaka and Akinaza; NAV-STD: +0.7 kB for the language switch and the panel placement), `./language-switch` ≤ 2.4 kB (a disclosure, no menu engine), `./tooltip` ≤ 20 kB, `./popover` ≤ 25 kB,
  `./dropdown-menu` ≤ 32 kB, `./command` ≤ 21 kB (cmdk alone is 14.9 kB: it imports Radix's Dialog itself; with
  `CommandDialog` on the platform's Dialog, 19 kB measured, +10 %). The data and media primitives (`@krizaka/intl`
  counted, the optional peers hls.js / expo-video / expo-camera never bundled — the app passes or installs them):
  `./pagination` ≤ 2 kB, `./video-trimmer` ≤ 2.4 kB, `./audio-player` ≤ 2.8 kB, `./search-field` ≤ 5.5 kB (its debounce is `@krizaka/pacer`, on TanStack Pacer and its store),
  `./media-capture` ≤ 3.8 kB, `./file-upload` ≤ 9 kB (it draws `Progress`; its queue is `@krizaka/pacer`: retries, backoff, per-file pause), `./data-table` ≤ 44 kB for `DataTable` (TanStack Table v9 with every feature registered, the windowing of TanStack Virtual, Radix Checkbox, the pagination) and ≤ 41 kB for its toolbar (`FilterBar` on Radix DropdownMenu, `SearchField`), `./virtual` ≤ 12 kB (TanStack Virtual),
  `./image-cropper` ≤ 12.5 kB, `./document-viewer` ≤ 5 kB (pdf.js is the app's) and `./video-player` ≤ 15 kB (Radix Slider), `./combobox` ≤ 15.5 kB and `./tag-input` ≤
  16 kB (the chips' Radix Toggle), `./date-picker` ≤ 35 kB (Radix Popover; 3.2: the month picker, the day strip, the wheels, the time picker, the typed date and the date wheel), `./filter-bar` ≤ 34 kB (Radix
  DropdownMenu); `./native/video-player` ≤ 2 kB, `./native/media-capture` ≤ 2.5 kB, `./native/list` ≤ 2 kB (FlashList and @krizaka/query are the app's), `./form` ≤ 24.5 kB and `./native/form` ≤ 23 kB (TanStack Form v1 and its store, ~20 kB measured; the fields import the primitives' entries), `./form/server` ≤ 1.5 kB, `./map` ≤ 16 kB and `./native/map` ≤ 13.5 kB (the basemap's layers of @protomaps/basemaps and the inlined tokens the style is generated from; MapLibre, PMTiles and MapLibre Native are optional peers, loaded on demand on the web). The page blocks (their styles are
  `blocks.css`, not counted): `./cta-panel`, `./card-grid`, `./pointer-light`, `./link-card`, `./decision-list`, `./toc` ≤ 1 kB,
  `./page` ≤ 1.25 kB (3.36: `paper`, `margin`, `number`), `./page-hero` ≤ 1.2 kB, `./argument-card`, `./action-bar` ≤ 1.4 kB, the Cahier's blocks (ADR-004) `./anatomy-plate`, `./footnote` ≤ 1 kB, `./specimen-tag`, `./page-index` ≤ 1.2 kB, `./bird-plate` ≤ 5.8 kB (the birds' geometry), `./mascot-quote` ≤ 5 kB (the bird's
  geometry; 3.2: the merge engine told the material's utilities), `./code-block` ≤ 19.5 kB (Radix Tabs for `CodeTabs`, TanStack Highlight and its grammars), `./markdown` ≤ 17 kB (TanStack Markdown; its code blocks are `./code-block`), `./recipes` ≤ 3 kB. The layouts: `./dashboard-layout`, `./settings-layout`,
  `./detail-layout`, `./split-view`, `./marketing-layout`, `./docs-layout` ≤ 1 kB, `./docs-nav` ≤ 1.2 kB, `./auth-layout`, `./settings-layout` ≤ 1.2 kB,
  `./app-shell` ≤ 18 kB (Radix Dialog for the drawer, as `./dialog`; the desktop window form and `acceleratorOf`, +0.12 kB). The storytelling kit (its styles are `story.css`, not counted):
  `./profile-card`, `./stage-banner`, `./goal-gauge`, `./promise-card` ≤ 1 kB, `./scroll-stage`, `./achievement` ≤ 1.2 kB,
  `./continue-prompt` ≤ 4 kB (it draws `Button`), `./choice-grid` ≤ 1.6 kB (its roving focus), `./landscape` ≤ 8 kB (the valley's geometry).
  The page templates ≤ 1.5 kB each (the blocks they import through the package's own entries are not counted).
- **publint + attw** with the `esm-only` profile: the package is ESM only by design; `./motion.css`, `./blocks.css` and
  `./tailwind.css` are CSS exports and are not resolved as modules.
- The published surface: exports `.`, one entry per primitive (`./cn`, `./slot`, `./button`, `./badge`, `./avatar`,
  `./field`, `./theme`, `./skeleton`, `./empty-state`, `./spinner`, `./countdown`, `./card`, `./dialog`, `./toast`,
  `./popover`, `./dropdown-menu`, `./tooltip`, `./stat`, `./page-header`, `./alert`, `./separator`, `./kbd`, `./tabs`,
  `./chip`, `./chip-link`, `./switch`, `./slider`, `./checkbox`, `./radio-group`, `./command`, `./confirm-button`, `./progress`,
  `./section-backdrop`, `./iso`, `./motion`, `./loader`, `./nav-bar`, `./language-switch`, `./sites`, `./site-footer`, `./number-ticker`, `./terminal-replay`, `./glow-card`, `./marquee`, `./stepper`,
  `./meter`, `./mascots`, `./pagination`, `./data-table`, `./filter-bar`, `./combobox`, `./tag-input`, `./date-picker`,
  `./search-field`, `./video-player`, `./file-upload`, `./media-capture`, `./video-trimmer`, `./audio-player`,
  `./image-cropper`, `./page`, `./page-hero`, `./card-grid`, `./pointer-light`, `./link-card`, `./argument-card`,
  `./mascot-quote`, `./specimen-tag`, `./bird-plate`, `./anatomy-plate`, `./page-index`, `./footnote`, `./stuck`, `./doodle`, `./signature`, `./decision-list`, `./code-block`, `./markdown`, `./recipes`, `./action-bar`, `./cta-panel`, `./toc`, `./app-shell`,
  `./dashboard-layout`, `./settings-layout`, `./auth-layout`, `./detail-layout`, `./split-view`, `./marketing-layout`,
  `./docs-layout`, `./docs-nav`, `./scroll-stage`, `./choice-grid`, `./profile-card`, `./stage-banner`, `./goal-gauge`, `./continue-prompt`,
  `./achievement`, `./promise-card`, `./landscape`, `./virtual`, `./form`, `./form/server`, `./map`), `./native`, `./native/video-player`, `./native/media-capture`, `./native/list`, `./native/form`, `./native/map`, `./native/markdown`, `./motion.css`,
  `./blocks.css` (the page blocks' styles, imported once by the app), `./story.css` (the storytelling kit's, the same way), `./tailwind.css`, `./registry/*` (the registry's JSON), `./registry/examples/*` (the compiled examples), `./package.json`;
  files `dist`, `registry` (JSON, examples as `.tsx`, `.js`, `.d.ts`), `tailwind.css`, `README.md`, `LICENSE`. Adding an
  entry is a minor; removing or renaming one is a breaking change.
- **The registry — the code drives the documentation** (`scripts/build-registry.mjs`, run by `build`): one
  `registry/<name>.json` per component and `registry/index.json`, rendered by **ui.krizaka.com** at every build
  of the site (the only public documentation: Storybook is internal). A new component comes with:
  - a `meta.ts` beside it (`src/<name>/meta.ts`; React Native only: `src/native/meta/<name>.ts`), typed by
    `src/meta.ts` — summary, status, category, platforms, when to use / not, best practices, accessibility, related,
    and per platform its imports and named examples (native: what differs from the web);
  - its examples, `registry/examples/<name>/<example>.tsx` and `…/native/<example>.tsx` (≤ 40 lines, importing what a
    product imports), one per significant variant, each rendered by a story; a layout's **templates** are examples
    flagged `template: true` (≤ 160 lines, a whole screen) with a phone story too (`parameters: { phone: true }`);
  - a JSDoc on every prop its web and native components declare.
  - its **parity** (`parity` in the meta, `Parity` of `src/meta.ts`): the platform it lacks says why — `gap` (✗, the
    issue that tracks it) or `n/a` (the reason, and `use`: the component that answers there) — and its desktop form (the
    Orazaka Mac app renders the web components, ADR-002). `tools/parity.mjs` checks it; a new web component without a
    native and a desktop decision fails `scripts/registry.test.mjs` with the shape to write.
  `scripts/registry.test.mjs` fails otherwise. The JSON and the compiled examples are build output (git-ignored).

## 4. Release

Through Changesets (root `AGENTS.md` §4): add a `.changeset/*.md` for `@krizaka/ui`; merging the "Version Packages"
pull request publishes with provenance and tags `@krizaka/ui@x.y.z`. Semantic versioning — a visual change to a mark
is at least a minor.
