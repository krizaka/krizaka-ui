---
"@krizaka/ui": minor
---

Ship `@krizaka/ui/catalog.json`: the catalogue of the package in the `krizaka-catalog/v1` shape (krizaka-internal#3947). It has one entry per name a product imports, with its import line, props, an example that uses it, its rules (do / don't) and status. `scripts/build-catalog.mjs` writes it at build. `scripts/catalog.test.mjs` is the guard: an entry point without an entry, or an entry without an example, fails, apart from the gaps recorded in `scripts/catalog-gaps.json`, and that list can only shrink. The coding agents read the catalogue through the krizaka-docs MCP, and llms.txt now ends each component line with its import line, taken from the same catalogue.
