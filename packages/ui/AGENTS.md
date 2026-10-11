# @krizaka/ui — Repository Contract (agent-neutral)

> Scope of [`krizaka/krizaka-ui`](https://github.com/krizaka/krizaka-ui), published on npm as **`@krizaka/ui`**.
> Lives in `packages/ui` of the krizaka-ui monorepo: the root [`AGENTS.md`](../../AGENTS.md) applies first.

## 1. What belongs here

- The **primitives** (level 1 of the root contract): `cn`, `slot`, `button`, `badge`, `avatar`, `field`, `theme`,
  `skeleton`, `empty-state`, `spinner`, `countdown`, `card`, `dialog`, `toast`, `popover`, `dropdown-menu`, `tooltip`,
  `stat`, `page-header`, `alert`, `separator`, `kbd`, `tabs`, `chip`, `switch`, `slider`, `checkbox`, `radio-group`,
  `command`, `confirm-button`, `progress`, `section-backdrop`, `loader`, `meter`, `stepper`, `number-ticker`, `terminal-replay`,
  `nav-bar`, `chip-link`, `glow-card`, `marquee`, `iso`, `mascots`, and the data and media primitives `pagination`,
  `data-table`, `filter-bar`, `combobox`, `tag-input`, `date-picker`, `search-field`, `video-player`, `file-upload`,
  `media-capture`, `video-trimmer`, `audio-player`, `image-cropper`, and the **page blocks** (category `blocks`) `page`,
  `page-hero`, `card-grid`, `pointer-light`, `link-card`, `argument-card`, `mascot-quote`, `decision-list`, `code-block`,
  `action-bar`, `cta-panel`, `toc` — one entry each, built with `tailwind-variants` on the preset's
  roles, Radix UI for non-trivial interactions. They follow the 12-point component contract (README, "Primitives").
- The **native platform** (`./native`, `src/native`): the theme (`ThemeProvider`/`useTheme` on the
  `@krizaka/tokens/native` roles + a product's `overrides`) and the same primitives for React Native — `Txt`,
  `Button`, `IconButton`, `Card.*`, `Badge`, `Chip`, `Avatar`, `Skeleton`, `EmptyState`, `Spinner`, `Countdown`,
  `Segmented`, `Progress`, `Toaster`/`toast`, `Mascot`, `Pagination`, `SearchField` — with the web's prop names where the
  concept is the same. What needs an Expo module has its own entry, the module an **optional peer** installed only by
  the apps that use it: `./native/video-player` (expo-video) and `./native/media-capture` (expo-camera); they import the
  platform through `@krizaka/ui/native` (one theme context). Jest and Storybook render them on stand-ins
  (`src/native/mocks`).
- The **brand layer shared by every Krizaka product**: the animated marks (`KrizakaLogo`, `OrazakaLogo`,
  `OrochiaLogo`, `ProductLogo`; native `KrizakaMark`, `OrazakaMark`, `OrochiaMark`, `ProductMark`), one family drawn from
  shared geometry (`marks/*-geometry.ts`, colours tested against the brand themes of `@krizaka/tokens`, see its
  `BRAND.md`), and the **Krizaka motion signature** (`motion.css`, `./motion`: `MotionObserver` — reveal, off-screen
  pause, settle, spotlight, magnetism — and `RotatingWord`; the section backdrop's layers; the loader glyph; the
  isometric kit's `kz-iso-*`).
- Nothing product-specific: a product's components live in its own design system (`@krizaka/orochia-design-system`,
  `@krizaka/orazaka-design-system`), which builds on this package.

## 2. Rules

- **Marks and motion: no framework, no CSS library.** Marks embed their own CSS with prefixed classes (`kzm-`, `ozm-`,
  `orom-`); the signature is plain CSS with `kz-` classes and `--kz-*` variables. They run on React 18 and 19.
- **Primitives: React 19, Tailwind v4 + `@krizaka/tailwind`.** Dependencies: `radix-ui`, `tailwind-variants` (its
  merge engine is the one `cn` uses — a single copy), `clsx`, `sonner` (the toasts), `cmdk` (the command palette; it
  shares Radix's Dialog with `./dialog`). Colours are roles only (lint `krizakaUi`, strict);
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

- **The Krizaka material (BRAND.md §6).** Every primitive wears it through the preset's utilities, never raw values:
  raised surfaces `bg-sheen inset-shadow-edge shadow-raised`, wells `inset-shadow-well`, what floats `glass`
  (`floating.ts`), what acts `shadow-glow`, the focus `focus-visible:focus-ring` (`focus-ring-inset` on a field or inside
  a clipping container), state marks with the node, transitions on `--kz-duration-*` and `ease-spring`. The griffe (§6.1)
  marks what matters — the CTA (`Button` `shape="auto"`), the status badge, the spotlight card, the active tab, the
  focused field, the toast — through `--kz-cut-shape`, never everywhere. Build variants with `tv` from `src/tv.ts` (it
  knows the signature classes), not from `tailwind-variants` directly.

## 3. Quality gates

- `pnpm turbo run check --filter=@krizaka/ui`: type-check, tests (Vitest + happy-dom for the web; Jest with React
  Native's preset and Testing Library for `src/native`), build (tsup), size, publint.
- **Size budgets** (`size-limit`, gzip, peers excluded): `.` ≤ 8 kB; `./native` ≤ 16.5 kB (with the flock's geometry; 2.5.0: the material's roles and shadows of the inlined tokens) (Metro
  bundles it into the app, nothing is downloaded: a regression guard, not a budget); the shared runtime
  (`./cn`: clsx + tailwind-variants and its merge engine, paid once per app) ≤ 14 kB; each primitive is measured
  without that runtime (Radix included): `./button` ≤ 3.5 kB (it draws the loader glyph), `./avatar` ≤ 6 kB, `./theme` ≤ 2.4 kB, `./countdown` ≤ 2 kB,
  `./slot` ≤ 2 kB, `./field` ≤ 1.8 kB (affixes, the floating label), `./card` ≤ 3.3 kB, `./separator` ≤ 2.2 kB (Radix's `Primitive` and `Slot`),
  `./confirm-button` ≤ 4.4 kB, `./progress` ≤ 1.8 kB, `./section-backdrop` ≤ 1 kB, `./mascots` ≤ 4.5 kB (five birds' geometry), `./iso` ≤ 4.5 kB (a hero with no
  client JavaScript), `./loader`, `./meter`, `./stepper`, `./glow-card`, `./chip-link` ≤ 2 kB, `./motion`, `./number-ticker`,
  `./marquee` ≤ 1.5 kB, `./terminal-replay` ≤ 2.5 kB (its timer, observer and controls), the other atoms ≤ 1 kB. The controls carry Radix's roving focus
  or its form plumbing: `./switch` ≤ 6 kB, `./checkbox` ≤ 6.5 kB, `./chip` ≤ 10 kB, `./tabs` ≤ 10.5 kB, `./radio-group`
  ≤ 11 kB, `./slider` ≤ 12 kB. What opens over the page carries Radix's machinery (dismissable layer, focus scope, scroll lock,
  and Floating UI for what is placed next to a trigger) — shared between these entries in an app, but counted in
  each: `./dialog` ≤ 17 kB, `./toast` ≤ 11.5 kB (sonner), `./nav-bar` ≤ 16 kB (Radix NavigationMenu), `./tooltip` ≤ 20 kB, `./popover` ≤ 25 kB,
  `./dropdown-menu` ≤ 32 kB, `./command` ≤ 21 kB (cmdk alone is 14.9 kB: it imports Radix's Dialog itself; with
  `CommandDialog` on the platform's Dialog, 19 kB measured, +10 %). The data and media primitives (`@krizaka/intl`
  counted, the optional peers hls.js / expo-video / expo-camera never bundled — the app passes or installs them):
  `./pagination` ≤ 2 kB, `./video-trimmer` ≤ 2.4 kB, `./audio-player` ≤ 2.8 kB, `./search-field` ≤ 3.2 kB,
  `./media-capture` ≤ 3.8 kB, `./file-upload` ≤ 5.3 kB (it draws `Progress`), `./data-table` ≤ 9.5 kB (Radix Checkbox),
  `./image-cropper` ≤ 12.5 kB and `./video-player` ≤ 15 kB (Radix Slider), `./combobox` ≤ 13 kB and `./tag-input` ≤
  13.5 kB (the chips' Radix Toggle), `./date-picker` ≤ 29 kB (Radix Popover), `./filter-bar` ≤ 34 kB (Radix
  DropdownMenu); `./native/video-player` ≤ 2 kB, `./native/media-capture` ≤ 2.5 kB. The page blocks (their styles are
  `blocks.css`, not counted): `./cta-panel`, `./card-grid`, `./pointer-light`, `./link-card`, `./decision-list`, `./toc` ≤ 1 kB,
  `./page-hero` ≤ 1.2 kB, `./page` ≤ 1.3 kB, `./argument-card` ≤ 1.4 kB, `./action-bar` ≤ 1.8 kB (the buttons' configured `tv`), `./mascot-quote` ≤ 4.8 kB (the bird's
  geometry), `./code-block` ≤ 12 kB (Radix Tabs for `CodeTabs`).
- 2.5.0, the material (BRAND.md §6): each entry carries the platform's `tv` taught the signature utilities
  (`src/tv.ts`, `twMergeConfig`, ≈ 0.25 kB) — hence the small raises above; `./registry/showcase` is documentation, not
  measured.
- **publint + attw** with the `esm-only` profile: the package is ESM only by design; `./motion.css`, `./blocks.css` and
  `./tailwind.css` are CSS exports and are not resolved as modules.
- The published surface: exports `.`, one entry per primitive (`./cn`, `./slot`, `./button`, `./badge`, `./avatar`,
  `./field`, `./theme`, `./skeleton`, `./empty-state`, `./spinner`, `./countdown`, `./card`, `./dialog`, `./toast`,
  `./popover`, `./dropdown-menu`, `./tooltip`, `./stat`, `./page-header`, `./alert`, `./separator`, `./kbd`, `./tabs`,
  `./chip`, `./chip-link`, `./switch`, `./slider`, `./checkbox`, `./radio-group`, `./command`, `./confirm-button`, `./progress`,
  `./section-backdrop`, `./iso`, `./motion`, `./loader`, `./nav-bar`, `./number-ticker`, `./terminal-replay`, `./glow-card`, `./marquee`, `./stepper`,
  `./meter`, `./mascots`, `./pagination`, `./data-table`, `./filter-bar`, `./combobox`, `./tag-input`, `./date-picker`,
  `./search-field`, `./video-player`, `./file-upload`, `./media-capture`, `./video-trimmer`, `./audio-player`,
  `./image-cropper`, `./page`, `./page-hero`, `./card-grid`, `./pointer-light`, `./link-card`, `./argument-card`,
  `./mascot-quote`, `./decision-list`, `./code-block`, `./action-bar`, `./cta-panel`, `./toc`), `./native`, `./native/video-player`, `./native/media-capture`, `./motion.css`,
  `./blocks.css` (the page blocks' styles, imported once by the app), `./tailwind.css`, `./registry/*` (the registry's JSON), `./registry/examples/*` (the compiled examples),
  `./registry/showcase` and `./registry/showcase/mobile` (the showcase krizaka.com/docs/ui shows first; `@krizaka/charts`
  is an optional peer for it), `./package.json`;
  files `dist`, `registry` (JSON, examples as `.tsx`, `.js`, `.d.ts`, the showcase as `.js`, `.d.ts` and its mobile screenshots), `tailwind.css`, `README.md`, `LICENSE`. Adding an
  entry is a minor; removing or renaming one is a breaking change.
- **The registry — the code drives the documentation** (`scripts/build-registry.mjs`, run by `build`): one
  `registry/<name>.json` per component and `registry/index.json`, rendered by **krizaka.com/docs/ui** at every build
  of the site (the only public documentation: Storybook is internal). A new component comes with:
  - a `meta.ts` beside it (`src/<name>/meta.ts`; React Native only: `src/native/meta/<name>.ts`), typed by
    `src/meta.ts` — summary, status, category, platforms, when to use / not, best practices, accessibility, related,
    and per platform its imports and named examples (native: what differs from the web);
  - its examples, `registry/examples/<name>/<example>.tsx` and `…/native/<example>.tsx` (≤ 40 lines, importing what a
    product imports), one per significant variant, each rendered by a story;
  - a JSDoc on every prop its web and native components declare.
  `scripts/registry.test.mjs` fails otherwise. The JSON and the compiled examples are build output (git-ignored).

## 4. Release

Through Changesets (root `AGENTS.md` §4): add a `.changeset/*.md` for `@krizaka/ui`; merging the "Version Packages"
pull request publishes with provenance and tags `@krizaka/ui@x.y.z`. Semantic versioning — a visual change to a mark
is at least a minor.
