# @krizaka/icons

## 0.9.1

### Patch Changes

- [#714](https://github.com/krizaka/krizaka-ui/pull/714) [`972f53c`](https://github.com/krizaka/krizaka-ui/commit/972f53c41f865139041c5df510e1c18a6bc72967) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - Paused products (2026-10-25): the former products leave the family. The family switcher and the
  footer (`sites`) list only Krizaka, Orazaka, Yomizaka and Akinaza; `siteById` still finds a paused site (`pausedSites`), so
  a page that names one as `current` keeps rendering. Nothing published is removed: their marks (retired exports, the native `*Mark`s, their `ProductLogo` / `ProductMark` ids — the new
  `PausedBrandId`, `PausedSiteId`), their brand themes (a retired export
  and the `.brand-*` scopes, now headed DEPRECATED), the charts' a retired export palette and the email themes stay, marked
  `@deprecated`, and are removed in the next major. The examples, metas and docs speak of the products in focus only.

## 0.9.0

### Minor Changes

- [#474](https://github.com/krizaka/krizaka-ui/pull/474) [`f354137`](https://github.com/krizaka/krizaka-ui/commit/f354137cca01e24652ec46ee9c25d250441d6f43) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - feat: the neighbourhood café — `EspressoIcon`, `PlantIcon`, `WindowIcon`, `StoopIcon`, `ChairIcon`, web and React Native, in the signature grammar (24 grid, 1.5 stroke, square caps, cut corners, one node) (krizaka-ui#472).

## 0.8.0

### Minor Changes

- [#465](https://github.com/krizaka/krizaka-ui/pull/465) [`efdfb57`](https://github.com/krizaka/krizaka-ui/commit/efdfb576ae1f23061ec1a8ad93bfefcfd8a46ca0) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - Nine new signature icons: `star`, `bolt`, `wave`, `flame`, `crown`, `leaf`, `mountain` (a new « Emblems » group, to build marks and badges from) and `medal`, `podium` (ranks and standings). Web and native.

## 0.7.0

### Minor Changes

- [#423](https://github.com/krizaka/krizaka-ui/pull/423) [`01cfb77`](https://github.com/krizaka/krizaka-ui/commit/01cfb7758294d04434af401f9ae92e292643e405) Thanks [@oussamaABID](https://github.com/oussamaABID)! - **A pen stroke (Cahier, ADR-004, [#417](https://github.com/krizaka/krizaka-ui/issues/417)):** the icons draw with a 1.5 stroke, square caps and mitred joins — a nib, not lucide's rounded marker. `strokeWidth` still overrides the width.

## 0.6.0

### Minor Changes

- [#334](https://github.com/krizaka/krizaka-ui/pull/334) [`58947d9`](https://github.com/krizaka/krizaka-ui/commit/58947d918ed851483c5e35bf9865a28e87605b6e) Thanks [@oussamaABID](https://github.com/oussamaABID)! - Four icons for a league of friends: `SoccerIcon`, `HockeyIcon`, `BasketballIcon` (the three games a multi-sport league follows) and `TrophyIcon` (the season's cup). Same grammar as the set: 24 grid, 1.75 stroke, cut corners, one node (the ball's centre, the puck, the cup's heart), web and native.

## 0.5.1

### Patch Changes

- [#179](https://github.com/krizaka/krizaka-ui/pull/179) [`e3bcc51`](https://github.com/krizaka/krizaka-ui/commit/e3bcc51692773c3cea99ec6198cd0011f026a70e) Thanks [@oussamaABID](https://github.com/oussamaABID)! - The documentation moved to **https://ui.krizaka.com**, built from this repository (`apps/site`) at every change: the
  packages' `homepage` (what npm shows) and READMEs point there — `@krizaka/tokens` to /foundations/tokens, `@krizaka/icons`
  to /foundations/icons, `@krizaka/fonts` to /foundations/typography, the packages without UI to /packages/<name>.

## 0.5.0

### Minor Changes

- [#157](https://github.com/krizaka/krizaka-ui/pull/157) [`1d23271`](https://github.com/krizaka/krizaka-ui/commit/1d232714beb074a958a723828ba93bfe035ef703) Thanks [@oussamaABID](https://github.com/oussamaABID)! - `engines` is `node >=22` for every package: Node 20 reached end of life, and the products already run on Node 22. No compatibility shim.

## 0.4.1

### Patch Changes

- [#143](https://github.com/krizaka/krizaka-ui/pull/143) [`d0e43fd`](https://github.com/krizaka/krizaka-ui/commit/d0e43fd7defaba8be14d61c3b84799fec817dad5) Thanks [@oussamaABID](https://github.com/oussamaABID)! - Package homepage points to the documentation on krizaka.com (the page the npm listing links to is the one that explains the package).

## 0.4.0

### Minor Changes

- [#105](https://github.com/krizaka/krizaka-ui/pull/105) [`dc6156f`](https://github.com/krizaka/krizaka-ui/commit/dc6156fcac67f6285b966c2a27d56af75fc8db10) Thanks [@oussamaABID](https://github.com/oussamaABID)! - a former product brand: mark, theme, mascot, icons. `@krizaka/tokens`: the a retired export brand — retired exports in `brands/scoped.css`, retired exports (web and native) — sand → sage, the accent on sage (≥ 60° from `--kz-success` and `--kz-warning`), the sand (mark, `accent-2`) told apart from the warning amber by its chroma, AA-tested in dark and light. `@krizaka/ui`: a retired export (web) and a retired export (native) — "the hold": two filled leaves rising into a "Y" that cup a warm core, one node, the moment, on the orbit — `ProductLogo` / `ProductMark` accept a retired export, the "Brand family" story shows Krizaka and its four products; the flock gains the `crane` ("la grue écoute", the bird of listening). `@krizaka/icons`: `MomentIcon`, `ThreadIcon`, `KeepIcon`.

## 0.3.0

### Minor Changes

- [#90](https://github.com/krizaka/krizaka-ui/pull/90) [`afce4b2`](https://github.com/krizaka/krizaka-ui/commit/afce4b2ec14c42c7550fc911af7db46d2a5d8bb6) Thanks [@oussamaABID](https://github.com/oussamaABID)! - a former product brand: mark, theme, mascot, icons. `@krizaka/tokens`: the a retired export brand — retired exports in `brands/scoped.css`, retired exports (web and native) — emerald → turquoise, the accent on turquoise (hue 174, 14° from `--kz-success`), AA-tested in dark and light. `@krizaka/ui`: a retired export (web) and a retired export (native) — two arms that lean in and meet, a core, the pair on the orbit — `ProductLogo` / `ProductMark` accept a retired export, the "Brand family" story; the flock gains the `lovebird` ("l'inséparable présente", the bird of introductions). `@krizaka/icons`: `BatchIcon`, `DebriefIcon`, `IntroIcon`.

## 0.2.0

### Minor Changes

- [#66](https://github.com/krizaka/krizaka-ui/pull/66) [`1ebdb61`](https://github.com/krizaka/krizaka-ui/commit/1ebdb61ce394a3e584dce40c5740b3193da8ea5e) Thanks [@oussamaABID](https://github.com/oussamaABID)! - `iconGroups` and `iconGuidelines` in `@krizaka/icons/glyphs`: the groups of the set, the sizes, colour and the node,
  accessibility and how to ask for a new icon, as data — krizaka.com/docs/ui/icons renders them with `glyphIndex`.

## 0.1.0

### Minor Changes

- [#39](https://github.com/krizaka/krizaka-ui/pull/39) [`561300f`](https://github.com/krizaka/krizaka-ui/commit/561300f9c6b9d7c03181cf4769df94608f5bf8cb) Thanks [@oussamaABID](https://github.com/oussamaABID)! - `SoundIcon`, `MuteIcon` and `FlagIcon` (report), web and native, in the signature grammar (krizaka/krizaka-ui#35): the
  media controls and the report action no longer need another icon set. 70 icons. First stable release: 0.1.0.

- [#33](https://github.com/krizaka/krizaka-ui/pull/33) [`07eb219`](https://github.com/krizaka/krizaka-ui/commit/07eb2192da82fddd7525dc1dd382b262f9cbdc8b) Thanks [@oussamaABID](https://github.com/oussamaABID)! - First release: the Krizaka signature icons — 67 icons (31 product, 15 system, 21 interface) in one drawing language
  (24 grid, 1.75 stroke, cut corners, a node at the core of every product icon that can carry the brand accent),
  React (tree-shakable, server-safe, ≈ 0.55 kB per icon) and React Native (`@krizaka/icons/native`), the raw glyphs in
  `@krizaka/icons/glyphs`.

## 0.1.0-beta.0

### Minor Changes

- [#33](https://github.com/krizaka/krizaka-ui/pull/33) [`07eb219`](https://github.com/krizaka/krizaka-ui/commit/07eb2192da82fddd7525dc1dd382b262f9cbdc8b) Thanks [@oussamaABID](https://github.com/oussamaABID)! - First release: the Krizaka signature icons — 67 icons (31 product, 15 system, 21 interface) in one drawing language
  (24 grid, 1.75 stroke, cut corners, a node at the core of every product icon that can carry the brand accent),
  React (tree-shakable, server-safe, ≈ 0.55 kB per icon) and React Native (`@krizaka/icons/native`), the raw glyphs in
  `@krizaka/icons/glyphs`.
