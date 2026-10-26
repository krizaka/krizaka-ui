# @krizaka/email

One email system for every Krizaka app. Typed, branded, bilingual (EN/FR) templates on [React Email](https://react.email)
(MIT): email-safe HTML (tables, inline styles), a plain-text part always generated from the same tree, dark mode, one
600 px column, and a `sendEmail()` adapter over the `MAIL_*` provider (Mailgun today).

```ts
import { sendEmail, consoleLog } from "@krizaka/email";

await sendEmail(
  "newsletterConfirm",
  { confirmUrl: "https://blog.krizaka.com/api/newsletter/confirm?t=…" },
  { to: "reader@example.com", locale: "fr", log: consoleLog(), idempotencyKey: "confirm:<hash>" },
);
```

Only rendering, without sending: `const { subject, html, text, headers } = await renderEmail("newPost", props, { locale: "en" })`.

## Templates

| id | category | what |
| :-- | :-- | :-- |
| `newsletterConfirm` | transactional | double opt-in: one button, the link small underneath |
| `newsletterWelcome` | marketing | after the click |
| `newPost` | marketing | title, cover, excerpt, « Read the post » |
| `newsletterUnsubscribed` | transactional | the last email, and a way back |
| `contactAutoreply` | transactional | krizaka.com contact form: « we received it », the visitor's message echoed |
| `contactNotification` | internal | the team's notification: every field, a reply button |
| `signInLink`, `commentReply`, `accountDeletion`, `dataExport`, `confirmEmail`, `passwordReset`, `emailChange` | transactional | accounts |

Every template takes `brand` (default `krizaka`; one theme per product, generated from `@krizaka/tokens`),
`address` (the postal address of the sender — CASL), `signature` (a name, a role, an avatar slot) and
`unsubscribeUrl`. **A `marketing` template refuses to render without `unsubscribeUrl`**, and any email with one gets
`List-Unsubscribe` and `List-Unsubscribe-Post: List-Unsubscribe=One-Click` (RFC 8058, Gmail and Yahoo's bulk-sender rules).

House of Brands: a product email wears its own brand and never names another product (tested for every brand).

## Safety

- Props are validated with zod before anything renders; the error names the fields, never the values.
- React escapes every text; URLs must be `https`; names and titles cannot hold control characters (no header injection);
  `contactNotification` builds its `mailto:` only from a validated address. A test feeds hostile input to every field.
- `sendEmail` never mails an address in the `suppression` list (bounce, complaint, unsubscribed) and sends once per
  `idempotencyKey`; the delivery log holds a hash of the recipient, never the address.
- Bounces and complaints: `handleMailgunWebhook(body, { signingKey, suppression, onSuppress })` verifies the signature
  (HMAC-SHA256, replay window) and feeds the suppression list; `onSuppress` is where an app removes the address from its
  own list.

## Dark mode

Light colours are inline (the only thing every client keeps); the dark scheme is classes under
`@media (prefers-color-scheme: dark)` and `[data-ogsc]` (Outlook.com), with `color-scheme` meta. The mark is two PNGs
(`brand/<brand>/mark-light|dark-256.png` on Bunny) swapped by the scheme. All colours are tested for WCAG AA in both.

## Preview

```bash
pnpm --filter @krizaka/email build
pnpm --filter @krizaka/email preview                         # .preview/index.html: every email, light/dark, phone width
pnpm --filter @krizaka/email preview -- --shots <dir>        # + Playwright screenshots
```

The committed snapshots (`test/__snapshots__/*.html|txt`) are the reference: a template change shows in the diff.

## Colours

`src/themes.generated.ts` is generated from `@krizaka/tokens` (`pnpm --filter @krizaka/email gen`; the build fails when
it is stale).
