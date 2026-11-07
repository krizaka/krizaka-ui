# Changelog

All notable changes to `@krizaka/orazaka-design-system`. Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/);
versions: [Semantic Versioning](https://semver.org/).

## [3.4.1] — 2026-10-16

### Fixed
- `@krizaka/tailwind` and `@krizaka/tokens` are declared at `^3.19.0`, like `@krizaka/ui` (they were still `^2.4.0`): npm hoisted tailwind 2.10 to the workspace root, where `theme.css`'s `@import "@krizaka/tailwind"` could not find `@krizaka/ui/motion.css` and every app build failed. A test keeps the three on one major.

## [3.4.0] — 2026-10-16

### Changed
- `ChatShowcase`'s footer is now an instance of `@krizaka/ui`'s `MessageComposer` (`variant="pill"`, inert) instead of a drawing, so the home hero and the app's chat share one component; the privacy line is its status row. New optional label `send`. Depends on `@krizaka/ui` ^3.19.0.

## [3.3.1] — 2026-10-15

### Fixed
- `RunFacts`: a value wraps at its spaces and breaks only a word that does not fit (`overflow-wrap: anywhere`); it used
  `break-all`, which cut sentences mid-word in narrow columns.

## [3.3.0] — 2026-10-15

### Added
- `ClipPlayer`: a short clip that is plainly a clip — a muted loop that plays only in view (a pause by hand sticks), a
  "Video · 5 s" badge, play/pause and sound buttons on hover and focus, a click that opens it larger in a dialog with the
  native controls; poster and a play button under reduced motion.
- `RunFacts`: what a run recorded, as a description list.

### Changed
- `VideoResult` is built on them (a loop in view instead of a still player), takes `promptNode` (the app may type the
  prompt in) and `reproduceLead`; its labels gain the player's words. New dependency: `@krizaka/icons`.

## [3.2.0] — 2026-10-15

### Added
- `VideoResult`: what a video run of a Studio leaves — the clip in a player with its poster, the exact prompt, the facts
  the run recorded (model, seed, frame, length, time, cost, run id), "Reproduce it" as a `@krizaka/ui` CodeBlock, and a
  download. Every word is a prop; a portrait clip is drawn as tall as a phone allows. Documented with `video-result.meta.ts`
  and two examples; render-tested. Web only: the mobile app draws the same facts natively (tracked in orazaka-mobile-client).

## [3.1.0] — 2026-10-14

### Removed
- The hand-made sign-in layout of the theme: `.login-split`, `.login-hero*`, `.login-form-panel`, `.auth-legal-*`,
  `.auth-footer-separator`, `.auth-lang-*`, and the Sentinel HUD animations (`.sentinel-*`, `.hud-pulse`, `.rotator-*`).
  The apps' entry screens are built on `@krizaka/ui/auth-layout`.

## [3.0.1] — 2026-10-14

### Fixed
- `ChatShowcase`: the card is sized by its final state (an invisible copy of the finished conversation shares its grid
  cell), so it no longer grows while the answer types in — the page around it does not shift (CLS 0). Reduced motion
  shows the final state directly. Tests guard it.

## [3.0.0] — 2026-10-11

The kit keeps only what is Orazaka's: the theme, the composites, and the few primitives it re-exports with an Orazaka
default. Everything @krizaka/ui 2.4 now draws is imported from there — the apps (web client, console) moved first.

### Removed (breaking)

- `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`, `Dialog`, `ToastContainer` (the
  1.x adapters, deprecated since 2.3): compose `Card.*` (`@krizaka/ui/card`), `Dialog.*` (`@krizaka/ui/dialog`),
  `Toaster` + `toast` (`@krizaka/ui/toast`). Their documentation pages go with them.
- The 1.x defaults of `CommandPalette`: `commands` and `labels` are required.
- The "2.x compatibility" block of `theme.css` — the 1.x variables (`--surface-1`, `--text-primary`, `--accent`…), their
  utilities (`text-text-primary`, `bg-card-bg`, `text-status-success`…) — and the 1.x theme classes (`html.cyberpunk`…):
  write the roles (`bg-surface-1`, `text-fg`, `text-accent`, `text-fg-danger`) and `html.theme-<name>`.

### Changed

- On `@krizaka/ui` ^2.4.0, `@krizaka/tailwind` / `@krizaka/tokens` ^2.4.0 (Loader, Stepper, Progress with ETA, the
  job toasts, Meter, NumberTicker, GlowCard, the gliding Tabs, NavBar; DS3: DataTable, Pagination, FilterBar…).

## [2.5.0] — 2026-10-11

The kit documents itself: krizaka.com/docs/orazaka/ui is generated from its code, like /docs/ui from @krizaka/ui.

### Added

- **The registry** (`registry/`, published; `./registry/*` and `./registry/examples/*` exports), in the format of
  @krizaka/ui's: one `registry/<name>.json` per component (its `src/components/<name>.meta.ts` — summary, why it exists
  above Krizaka UI, when to use / not, the @krizaka/ui primitives it is built on, accessibility, related, deprecation;
  its named examples, `registry/examples/<name>/*.tsx`; its props from their JSDoc), `registry/foundations.json` (the
  Orazaka Orange theme resolved in both modes and the five named themes, with their WCAG contrasts; the product tokens,
  the fluid type scale, the typography, the icons, the product rules quoted from the contracts) and `registry/index.json`.
  Written by `npm run registry` (in `check`, and before `npm pack`).
- `scripts/registry.test.mjs` (in `npm test`): fails when an exported component has no meta or example, a prop has no
  description, a reference does not resolve, a theme falls below AA, or an example speaks as an admin.
- `SkeletonGroupProps`; JSDoc on `ChatShowcase`'s `labels` and `className`.

## [2.4.0] — 2026-10-11

Built on `@krizaka/ui`, `@krizaka/tokens` and `@krizaka/tailwind` **2.1.0** (floor raised from 2.0.0).

### Changed

- **The Orazaka mark is the brand's orange.** `OrazakaLogo` / `ProductLogo id="orazaka"` (and `OrazakaMark` native) of
  `@krizaka/ui` 2.1.0 leave amber (`#b45309 → #f59e0b`) for deep orange `#b45309` → orange `#dc6509` on the accent's
  hue 26 — every stop ≥ 3:1 on dark and light pages — read from `marks.orazaka` of `@krizaka/tokens`.
- `ThemeScript` takes `defaultMode` like `ThemeProvider` (`@krizaka/ui/theme`): an Orazaka app that wants to be dark
  first passes `defaultMode="dark"` to both — no flash, the visitor's `kz-theme` still wins.

## [2.3.0] — 2026-10-10

No markup of a primitive is left in the kit: what it still drew itself is now drawn by `@krizaka/ui` 2.0.0 (stable).
No export is removed (semver minor); the 1.x APIs below are deprecated and go in 3.0.

### Changed

- `CommandPalette` is a product composite on `CommandDialog` from `@krizaka/ui/command` (cmdk + the platform dialog:
  combobox and listbox roles, arrows, Enter, filtering, focus trap, Escape, focus return). New props: `commands`
  (entries with a `section`, an `icon` of the registry, an `href` and/or `onSelect`, `keywords`), `labels` (the words,
  translated), `onNavigate` (default `router.push`), `shortcut` (default `k`).
- `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` are drawn by `@krizaka/ui/card`
  (`Card.Root`, `Card.Body`, `Card.Title`…), with their 1.x look kept through `className`.
- `Dialog` (1.x props: `open`, `onClose`, `title`, `description`, `closeLabel`) is drawn by `@krizaka/ui/dialog` (Radix:
  focus trap and focus return, which 1.x lacked).
- `ToastContainer` (1.x controlled list) is drawn by the `@krizaka/ui/toast` `Toaster` (sonner): each item becomes a
  `toast[variant]` with its id; new optional `label` and `closeLabel`.
- Dependencies: `@krizaka/ui`, `@krizaka/tokens`, `@krizaka/tailwind` `^2.0.0` (stable). `@krizaka/orazaka-shared`
  1.1.1 takes `@krizaka/tokens` `^2.0.0` (nothing else changes).

### Deprecated

- `Card*` → `Card.*` from `@krizaka/ui/card`; `Dialog` → `Dialog.*` from `@krizaka/ui/dialog`; `ToastContainer`,
  `ToastItem`, `ToastVariant` → `Toaster` + `toast` from `@krizaka/ui/toast`; the 1.x defaults of `CommandPalette`
  (English words, 1.x routes) → pass `labels` and `commands`. All removed in 3.0.

## [2.2.1] — 2026-10-10

### Added

- `Icon` takes an optional `fallback`: the icon drawn when `name` comes from data and is not in the registry (a Studio
  whose `iconKey` the kit does not know showed an empty square).

### Fixed

- `ChatShowcase`: the composer placeholder reads at AA (`text-fg-secondary`; `text-fg-muted` measured 3.9:1 on
  `surface-1`, which Lighthouse counts against the page even though the composer is decorative).

### Changed

- `tokens`, `themes`, `status` (re-exported from `@krizaka/orazaka-shared` 1.1.0) are the Orazaka orange for React
  Native and the CLI too: `dark` and `light` come from `@krizaka/tokens/native`, each theme gains `onAccent` and
  `accentText`, and `electric` joins the named themes.

## [2.2.0] — 2026-10-09

### Changed

- **Orazaka is orange.** The default theme (dark and light) is the Orazaka brand of `@krizaka/tokens`
  (`brands/orazaka.css`, imported by `theme.css`): the orange of the Orazaka mark — `hsl(26 92% 55%)` under near-black
  text in dark (7.4:1), the mark's deep stop `#b45309` under white in light (5.1:1). `info` stays blue. Nothing to
  change in an app: the roles (`bg-accent`, `text-on-accent`…) take the new values.

### Added

- The named theme `electric` (`html.theme-electric`, `.theme-electric`): Electric Blue, the 2.x identity, for the
  users who chose it.
- Every named theme sets its whole accent family (`accent-text`, `accent-2`, `ring`, `info`, section gradient), so an
  island never keeps the brand's orange; `accent-text` is tested at AA on every surface.

## [2.1.0] — 2026-10-09

### Added

- A named theme also works as an **island**: `.theme-custom`, `.theme-cyberpunk`, `.theme-solarized`, `.theme-krizaka` on
  any element give it that theme inside any page — as `.theme-dark` does for dark. A theme picker draws its previews
  with the roles (`bg-surface-1`, `bg-accent`…) inside the island and shows the real tokens. `html.theme-<name>` stays
  the first selector, so it still outweighs `html.light` on the root.

## [2.0.0] — 2026-10-09

The kit becomes a theme and a set of composites on the Krizaka platform (`@krizaka/tokens`, `@krizaka/tailwind`,
`@krizaka/ui` 2). No export is removed: every primitive is re-exported, and the 1.x variables stay mapped until 3.0.

### Changed

- `theme.css` is the **Electric Blue** identity expressed as `--kz-*` role overrides, on the organisation's mechanism:
  dark by default on `:root` (and `.theme-dark`), light on `html.light`, a named theme on `html.theme-<name>`
  (`custom`, `cyberpunk`, `solarized`, `krizaka`). It imports `@krizaka/tailwind` and `@krizaka/ui/tailwind.css`
  itself: the app keeps two lines (`tailwindcss`, then this `theme.css`).
- The accent is the brief's — `hsl(217 92% 60%)` dark, `hsl(217 92% 50%)` light (was amber `hsl(38 92% 50%)`); the
  surfaces, borders and text are the platform's (the krizaka.com values).
- **Contrast adjustments (WCAG AA, tested):** white on the dark accent reads 3.6:1, so the dark accent carries
  near-black text (`--kz-on-accent: hsl(240 6% 5%)`, 5.4:1) and its hover lightens to `hsl(217 92% 66%)` (6.6:1); the
  same holds for the dark named themes and solarized. Solarized text is darker (primary `hsl(192 14% 25%)`, secondary
  `hsl(192 14% 32%)`, muted `hsl(186 5% 42%)` — the 1.x primary read 3.7:1); krizaka muted text is `hsl(210 8% 46%)`
  (was 2.5:1). Named-theme hovers lighten instead of darkening.
- `Button`, `Badge`, `Input`, `Skeleton` are the `@krizaka/ui` primitives. `Button` keeps `primary` as its default
  variant; sizes follow the primitive (`lg` is `h-12`, `icon` is `h-10 w-10`); `ref` is a prop (React 19). `Badge` is
  the platform badge (uppercase, `tone`, `dot`, `pulse`). `Skeleton` keeps `rect` as its default shape.
- `Card*`, `Dialog`, `ToastContainer`, `CommandPalette`, `ChatShowcase` are tokenized: roles only (`bg-surface-1`,
  `text-fg-secondary`, `border-border-subtle`, `text-success` / `text-danger` / `text-warning`), no `[var(--…)]`, no
  `dark:`, no raw palette colour, `cn()` instead of template strings — a `className` override now wins.
- The 1.x `@custom-variant` declarations are gone: `dark:` comes from `@krizaka/tailwind` (`:root:not(.light)`).
- Lint: the four UI rules of `@krizaka/config` (strict) and `krizaka-ratchet` at zero; `check` = lint, type-check, Jest,
  publint (`validate` runs it).
- The theme's own idle and entrance animations stop under `prefers-reduced-motion`.

### Added

- `IconButton`, `buttonVariants`, `badgeVariants`, `Field`, `Textarea`, `Select`, `skeletonVariants`, `cn`, the
  `BadgeVariant` and `ButtonVariants` types.
- Product tokens `--orazaka-accent-glow`, `--orazaka-grid-color`, `--orazaka-space-card`, `--orazaka-space-section`.
- `src/__tests__/theme.test.ts`: every theme resolved over the `@krizaka/tokens` defaults and held to WCAG AA.

### Deprecated

- `Badge` `variant` → `tone` (`default` → `neutral`).
- `Skeleton` `variant` → `shape`; `width` / `height` → a `className` or `style`.
- The **2.x compatibility block** of `theme.css` — the unprefixed 1.x variables (`--surface-*`, `--accent*`,
  `--text-*`, `--border-*`, `--status-*`, `--radius-*`, `--shadow-*`, `--background`, `--card-*`, `--input-*`…), their
  utilities (`text-text-primary`, `bg-card-bg`, `bg-status-success`…) and the 1.x theme classes (`html.custom`,
  `html.cyberpunk`, `html.solarized`, `html.krizaka`). **Removed in 3.0.**

### Removed

- From `theme.css`: the light-on-`:root` / dark-on-`.dark` mechanism and its `prefers-color-scheme` block, the
  `--accent-h/-s/-l` channels, the `@custom-variant` declarations.

### Not changed

- `@krizaka/orazaka-shared` (types, Zod schemas, tokens) — its `themes` keep the 1.x values for React Native and the
  CLI. It is CommonJS and `@krizaka/tokens` is ESM-only, so it cannot import the platform tokens yet; the mobile
  migration does it.
