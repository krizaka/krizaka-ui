# @krizaka/email

## 0.4.0

### Minor Changes

- [#856](https://github.com/krizaka/krizaka-ui/pull/856) [`7072887`](https://github.com/krizaka/krizaka-ui/commit/7072887e009582863469a80428d77e39ee181777) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - Four products left the organisation (krizaka/.github#413): their brands, marks, sites, avatars and chart palettes are removed. The family is Krizaka, Orazaka, Yomizaka and Akinaza. Removed: the brand themes and `brands/<id>.css` of the four, their web and native marks (`ProductLogo` and `ProductMark` take the four remaining ids), their entries in `SiteId`, `SiteMark`, `DefaultAvatarBrand`, the charts' `BrandId` and the email brands. The marks are parked in krizaka-lab.

## 0.3.0

### Minor Changes

- [#792](https://github.com/krizaka/krizaka-ui/pull/792) [`52d69f0`](https://github.com/krizaka/krizaka-ui/commit/52d69f057aa790d3c0583ddaeda7715662fb35c2) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - New `shareLink` template (EN/FR): a person shares a read-only link (sender name, link, expiry date, optional escaped note) and never the shared content. Wears the brand's tokens, so a product such as Yomizaka or Akinaza reuses it.

## 0.2.0

### Minor Changes

- [#735](https://github.com/krizaka/krizaka-ui/pull/735) [`8694d93`](https://github.com/krizaka/krizaka-ui/commit/8694d93088111feae412c77089d2cbb7a303c616) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - Three account templates, in English and French: `confirmEmail` (a new account's address), `passwordReset` and `emailChange` (the link to the new address). Yomizaka sends them through `sendEmail` instead of a hand-written text (yomizaka#48).

## 0.1.2

### Patch Changes

- [#714](https://github.com/krizaka/krizaka-ui/pull/714) [`972f53c`](https://github.com/krizaka/krizaka-ui/commit/972f53c41f865139041c5df510e1c18a6bc72967) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - Paused products (2026-10-25): the former products leave the family. The family switcher and the
  footer (`sites`) list only Krizaka, Orazaka, Yomizaka and Akinaza; `siteById` still finds a paused site (`pausedSites`), so
  a page that names one as `current` keeps rendering. Nothing published is removed: their marks (retired exports, the native `*Mark`s, their `ProductLogo` / `ProductMark` ids — the new
  `PausedBrandId`, `PausedSiteId`), their brand themes (a retired export
  and the `.brand-*` scopes, now headed DEPRECATED), the charts' a retired export palette and the email themes stay, marked
  `@deprecated`, and are removed in the next major. The examples, metas and docs speak of the products in focus only.

## 0.1.1

### Patch Changes

- [#396](https://github.com/krizaka/krizaka-ui/pull/396) [`91d044f`](https://github.com/krizaka/krizaka-ui/commit/91d044f157d2b60e06a77913c4782c90f102a840) Thanks [@oussamaABID](https://github.com/oussamaABID)! - **A steel blue, one button shape, a quiet hover** (krizaka-ui#393, ADR-003).
  
  - **Tokens.** The Krizaka accent is a steel blue, hue 208 — the exact complement of the Orazaka orange — at ≤ 60 % saturation, instead of the electric `#196df5`: `accent` `hsl(208 46% 45%)` / light `hsl(208 54% 36%)`, `accent-text` `hsl(206 58% 72%)` / `hsl(208 54% 33%)`, a slate section gradient, and every product's `info` on the same steel. AA tested in both themes. The Krizaka mark follows (`marks.krizaka`). The products' colours do not change.
  - **Button.** One shape: an 8 px radius (`--kz-radius-sm`, the radius of a field), `pill` on demand. `shape="cut"` is a deprecated alias of it (a warning in development); `shimmer` and `magnetic` are deprecated no-ops.
  - **The quiet hover.** A hover changes a colour, never a position: the cards of the blocks (LinkCard, ArgumentCard, CardGrid), Card `interactive`, ServiceCard and GlowCard step their surface and hairline in 150 ms, with a 2 px focus ring. No lift, no zoom, no light following the pointer. `PointerLight`/`usePointerLight`, `CardGrid light`/`hover`, `LinkCard hover`, `ArgumentCard hover` and `GlowCard glow="spotlight"` are deprecated no-ops; GlowCard's ring is still; MotionObserver no longer follows the pointer. The examples `link-card/hover-light` and `argument-card/hover-light` are removed.

## 0.1.0

### Minor Changes

- [#301](https://github.com/krizaka/krizaka-ui/pull/301) [`94c7726`](https://github.com/krizaka/krizaka-ui/commit/94c77268c0e5b58cb0a7b37db36cb01ef54b0b24) Thanks [@oussamaABID](https://github.com/oussamaABID)! - New package `@krizaka/email` — one branded, bilingual email system for every Krizaka app. Ten typed templates (newsletter confirm / welcome / new post / unsubscribed, contact auto-reply and team notification, sign-in link, comment reply, account deletion, data export) on React Email: email-safe HTML, a plain-text part always generated, dark mode (`prefers-color-scheme` and Outlook.com), one 600 px column, one theme per product brand generated from `@krizaka/tokens`. `sendEmail()` adds `List-Unsubscribe` / `List-Unsubscribe-Post`, idempotency keys, a delivery log and a suppression list; `handleMailgunWebhook()` feeds the suppression list from bounces and complaints. An ast-grep rule (`no-hand-written-email`) refuses hand-written HTML emails in apps.
