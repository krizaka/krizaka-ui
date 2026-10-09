# @krizaka/ui

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
