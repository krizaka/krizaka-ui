# @krizaka/email — Package Contract (agent-neutral)

> Published on npm as **`@krizaka/email`**. Lives in `packages/email` of the krizaka-ui monorepo: the root
> [`AGENTS.md`](../../AGENTS.md) applies first.

## 1. What belongs here

- **Every email Krizaka sends, rendered once**: templates (typed, zod-validated), the components they are made of, the
  EN/FR catalogues, the brand themes, and `sendEmail()` / the webhook handler. An app never writes HTML for an email
  (`no-hand-written-email` ast-grep rule): it passes props to a template.
- Not here: the lists (subscribers, accounts), tokens and their signing, routes, the database — the app owns them and
  hands the package URLs and data.

## 2. Rules

- A template is `defineTemplate({ category, schema, subject, preheader, why, Body, example })`. **Marketing** emails need
  an `unsubscribeUrl`; the headers come with it.
- Every string is in `messages/en.json` + `fr.json` (same keys, placeholders, no unused key: `test/i18n.test.ts`).
- Colours: the neutrals in `theme.ts`, the accent from `themes.generated.ts` (generated from `@krizaka/tokens`).
  No other colour, no web font, no script, no external CSS.
- House of Brands: an email wears one brand; it never names another product. The legal sender (Technologies Krizaka
  Inc.) is the publisher, in the footer only.
- No user input reaches the markup except through React's escaping; URLs are `https` (zod); the dark-mode `<style>` is
  built from constants only.
- A new template ships with its example (`example`), which feeds the snapshot (`test/__snapshots__`), the content tests
  and the preview for both languages.

## 3. Quality gates

`pnpm turbo run check --filter=@krizaka/email`: ESLint and `tsc`, tests (Vitest with coverage thresholds), build, publint + attw.
