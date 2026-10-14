# @krizaka/ui

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
