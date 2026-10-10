# @krizaka/ui

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
