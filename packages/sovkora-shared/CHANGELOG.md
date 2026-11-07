# @krizaka/sovkora-shared

## 2.0.0

### Major Changes

- The Sovkora shared contracts, published until 1.5.0 as `@krizaka/orazaka-shared`, are now `@krizaka/sovkora-shared`: they live in krizaka-ui (`packages/sovkora-shared`, moved from sovkora-ui-kit, ADR-029) and drop the code name. Import `@krizaka/sovkora-shared`; the exports, the schemas, the tokens and the CommonJS build are those of 1.5.0. The active-content names of a refused PDF are sorted with an explicit code-unit compare (same order). Node >= 22.
