---
"@krizaka/ui": patch
---

fix(analysis-report): a long unbroken token (address, URL, identifier) now wraps in the finding text, the quote and the reference at phone width (`overflow-wrap: anywhere`, web; `minWidth: 0` on the native columns). New `long-address` example and story.
