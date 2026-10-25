---
"@krizaka/intl": minor
---

Prevent crashes when Intl.PluralRules or Intl.RelativeTimeFormat is absent (Android Hermes) with cached dependency-free en/fr fallbacks. Native Intl behavior is unchanged. Fallback plurals use unrounded cardinal rules; relative times use long numeric wording. Getter return types now include minimal select/format fallbacks, so native-only methods require a capability check.
