# @krizaka/sovkora-shared

## 2.0.1

### Patch Changes

- [#1080](https://github.com/krizaka/krizaka-ui/pull/1080) [`5bf3d4b`](https://github.com/krizaka/krizaka-ui/commit/5bf3d4b6e5ac15989707b228908fa005410ae1d2) Thanks [@krizaka-agents](https://github.com/apps/krizaka-agents)! - Refactor, behaviour unchanged: `document-viewer/locate` names its character-range constants and holds the Helvetica width table as a typed array; the PDF pre-flight reads names, extensions, base64 and the trailer with named readers instead of regular expressions.

## 2.0.0

### Major Changes

- The Sovkora shared contracts, published until 1.5.0 as `@krizaka/orazaka-shared`, are now `@krizaka/sovkora-shared`: they live in krizaka-ui (`packages/sovkora-shared`, moved from sovkora-ui-kit, ADR-029) and drop the code name. Import `@krizaka/sovkora-shared`; the exports, the schemas, the tokens and the CommonJS build are those of 1.5.0. The active-content names of a refused PDF are sorted with an explicit code-unit compare (same order). Node >= 22.
