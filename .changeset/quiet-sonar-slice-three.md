---
"@krizaka/ui": patch
---

Native elements instead of ARIA roles where they are equivalent (`<section aria-label>` for scrollable regions, `<output>` for status text), the internal style factories of the deprecated components no longer carry the deprecation tag, and the test assertions use `toHaveLength`. No change to the public API.
