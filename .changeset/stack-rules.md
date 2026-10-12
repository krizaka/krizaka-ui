---
"@krizaka/config": minor
---

The stack rules of ADR-001 (TanStack under `@krizaka/*` facades): `krizakaStack()` (`@krizaka/config/eslint/stack`)
brings three warnings — `krizaka/no-fetch-in-client-effect` (a `fetch` / `krizakaFetch` in a `useEffect` of a
`"use client"` file), `krizaka/no-direct-tanstack-import` (any `@tanstack/*` import outside a `@krizaka/*` package) and
`krizaka/no-local-table-or-form` (a `<table>`, or a `<form>` of more than one field). `krizaka-ratchet` counts the same
patterns (`fetchInClientEffect`, `directTanstackImport`, `localTableOrForm`) and the imports of the dependencies listed
under `retire` (`retiredImport`); a `lint-ratchet.json` without them still checks, and `--update` records them. New
`@krizaka/config/dependency-cruiser`: the shared boundary (`krizaka-no-direct-tanstack`) an app `extends`. Every
`krizaka/*` rule now lives in one plugin object (`@krizaka/config/eslint/plugin`), so the configs compose.
