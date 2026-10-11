---
"@krizaka/ui": minor
"@krizaka/tailwind": minor
---

**Krizaka UI wears its signature (BRAND.md §6): every primitive in the Krizaka material, the griffe on what matters,
and a showcase.** The API of 2.x is unchanged — props are only added; products get the new look by upgrading.

### Changements visuels (what a product sees when it upgrades)

- **Light from above.** Raised surfaces (secondary `Button`, `Card`, `Chip`, `Kbd`, `Pagination`, `FilterBar`
  triggers, the active segment of `Tabs`, `RadioGroup.Card`, `EmptyState` and `FileUpload` icons) carry a sheen, a 1-px
  edge of light along their top and an ink-tinted multi-layer shadow. Fields, tracks, checkboxes, radios, switches and
  meters are **wells** (an inner shade).
- **What floats is frosted glass**: `Popover`, `DropdownMenu`, `Tooltip`, `Dialog` (+ a hairline of the brand's light
  along its top), `Toast`, `Command`'s dialog, the lists of `Combobox` and `SearchField`, the `NavBar` when compact and
  its panel, the sticky header of `DataTable`. Text stays AA over anything (tested in @krizaka/tokens).
- **Only what acts glows**: the primary and gradient `Button`, the checked `Checkbox`, the `Switch` when on, the
  chosen radio, the current page, the selected day, the `Progress` / `Slider` fill wear the brand's glow.
- **The griffe** — the 45° cut corner — is the claw mark of the brand: **`Button` `primary` and `gradient` are cut by
  default** (new `shape="auto"`, the default; `rounded` and `pill` unchanged) with a node that lights in the cut corner
  under the pointer; status `Badge`s (success, warning, danger) are cut (`shape="auto"`); `Card variant="spotlight"`,
  the active `Tabs` segment and pill, a focused field and `Toast` cut their top-right corner. An app that must not wear
  it sets `--kz-cut-shape: round`.
- **The focus is the brand's ring**: a crisp ring of `--kz-ring` 2 px off the element, in a halo — every primitive
  (`focus-visible:focus-ring`; on fields and inside clipping containers, `focus-ring-inset`).
- **The node marks a state**: `Badge`'s dot is a lit diamond, the chosen radio's dot too, the `Switch` thumb carries one
  when on, today in the `Calendar`, the error mark of `Field.Error`.
- **Motion answers the hand**: a press compresses (0.97) on a short spring, toggles spring across, checks pop in —
  never more than 200 ms, instant under `prefers-reduced-motion`.
- **Three voices**: badges, table headers, menu labels, stat labels and weekdays speak in mono capitals; dialog titles in
  the display face.
- Statuses: `Alert` and `Toast` mark their tone with a glowing rail instead of a thick border; tints use the new
  `--kz-*-soft` roles. Menu, command and list highlights are the accent's tint with a rail of light.
- `Tabs variant="segmented"`: the active segment is a raised neutral surface (it was the accent fill).
- Buttons, fields and pickers read their heights from `--kz-control-*`: `data-density="compact"` on an ancestor tightens
  them. The default heights are unchanged.

### Added

- `Button` `variant="soft"`, `shape="auto"` (default); `Card` `variant` (`default` · `elevated` · `glass` · `outline` ·
  `spotlight`; `tone` kept as its deprecated 2.x name) and `cut`; `Badge` `shape` (`auto` · `pill` · `cut`);
  `Input` `start` / `end` affixes and `FloatingInput` (a label that rests in the field and rises); `Avatar` `status`
  (`online` · `away`) and `ring` (closes #74 — `SendIcon` is in @krizaka/icons' own release); `Tooltip` `title` and
  `shortcut` (a rich tooltip); `DataTable` `maxHeight` (a scrolling body, the header sticky); `twMergeConfig` from
  `@krizaka/ui/cn` (the merge knows the signature utilities: `bg-sheen` no longer drops `bg-surface-2`).
- React Native: the same material — `Button` (`soft`, `shape="auto"`: the griffe drawn with react-native-svg, a node in
  the cut), `Card` (sheen, edge), `Badge` (the node), `Avatar` (`status`, `ring`, `surface`), `Segmented` (a raised
  segment), `Toast` (glass); `useTheme().motion` gives 0 ms under reduced motion.
- The showcase: `@krizaka/ui/registry/showcase` (a mosaic of real primitives — a form, a chart, an Orochia tip, an
  Orazaka queue, ⌘K, toasts, a calendar, a player, settings — the brand and the theme switched live; `@krizaka/charts` is
  its optional peer) and `@krizaka/ui/registry/showcase/mobile` with its screenshots, shown first on
  krizaka.com/docs/ui.

- `@krizaka/tailwind`: every `transition-*` defaults to `--kz-duration-base` (200 ms, **0 ms under
  `prefers-reduced-motion`**): what moved by default now stops for those who ask.

### Fixed

- `Marquee`: the duplicated copy is `inert` — its links are no longer focusable (axe).
- `NumberTicker`: while it climbs, a figure shows no more decimals than its final value has (no more “28.993”).
