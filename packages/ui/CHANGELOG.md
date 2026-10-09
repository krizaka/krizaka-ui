# @krizaka/ui

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
