---
"@krizaka/ui": major
"@krizaka/tokens": major
"@krizaka/tailwind": major
---

**@krizaka/ui 2.0.0 — stable.** The primitives layer the products were missing, on one token vocabulary. `@krizaka/tokens`
and `@krizaka/tailwind` ship with it at **2.0.0**: they form one `fixed` group with `@krizaka/ui` (one version for the
foundations and the primitives), so they skip 1.x.

Migrating from `@krizaka/ui` 1.x:

- **Nothing changes for the marks and the motion signature**: `KrizakaLogo`, `OrazakaLogo`, `OrochiaLogo`,
  `ProductLogo`, the `/native` marks and `motion.css` keep their names and props.
- **New: the primitives**, one entry each (`@krizaka/ui/button`, `/card`, `/dialog`, `/toast`, `/tabs`, `/command`,
  `/countdown`…), their React Native parity in `@krizaka/ui/native`, and the registry (`@krizaka/ui/registry/*`) that
  krizaka.com/docs/ui renders.
- **Peers**: React 19 (`react`, `react-dom` ≥ 19 recommended — 18 still resolves), Tailwind CSS ^4.1 with
  `@krizaka/tailwind` 2 (`@import "tailwindcss"; @import "@krizaka/tailwind";`), React Native ≥ 0.76 and
  react-native-svg ≥ 15 for `/native`.
- **Theme**: one mechanism (`html.light`, the `--kz-*` tokens); a product's identity is a brand theme
  (`@krizaka/tokens/brands/<id>.css`), never a fork.

The support policy (N and N-1, 6 months, deprecation with a codemod) is in `SUPPORT.md`.
