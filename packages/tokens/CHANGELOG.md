# @krizaka/tokens

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
