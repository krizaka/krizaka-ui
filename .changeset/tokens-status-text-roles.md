---
"@krizaka/tokens": minor
"@krizaka/tailwind": minor
"@krizaka/ui": minor
---

Status colours that read as text, and a section gradient that ends on the page.

- **`--kz-success-text`, `--kz-warning-text`, `--kz-danger-text`, `--kz-info-text`** (native: `successText`…): the
  statuses as small text, ≥ 4.5:1 on every surface in both themes (tested) — the fills stay for dots, borders and
  icons (`danger` was 3.6:1 in light). Preset utilities `text-fg-success`, `text-fg-warning`, `text-fg-danger`,
  `text-fg-info`; `info-text` is a brand role. Used by `Countdown` (urgent), `Field.Error`, the danger
  `DropdownMenu.Item` and the native `Txt` tones `success`/`warning`/`danger`.
- **`--kz-brand-gradient-to` is an alias of `--kz-surface-0`** (krizaka/krizaka-ui#38), in `tokens.css` and every
  brand file: an app that changes its page surface no longer gets a line under each `SectionBackdrop`. The resolved
  values (`values`, `brands`, `/native`) are unchanged.
