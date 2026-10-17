# @krizaka/email

## 0.1.0

### Minor Changes

- [#301](https://github.com/krizaka/krizaka-ui/pull/301) [`94c7726`](https://github.com/krizaka/krizaka-ui/commit/94c77268c0e5b58cb0a7b37db36cb01ef54b0b24) Thanks [@oussamaABID](https://github.com/oussamaABID)! - New package `@krizaka/email` — one branded, bilingual email system for every Krizaka app. Ten typed templates (newsletter confirm / welcome / new post / unsubscribed, contact auto-reply and team notification, sign-in link, comment reply, account deletion, data export) on React Email: email-safe HTML, a plain-text part always generated, dark mode (`prefers-color-scheme` and Outlook.com), one 600 px column, one theme per product brand generated from `@krizaka/tokens`. `sendEmail()` adds `List-Unsubscribe` / `List-Unsubscribe-Post`, idempotency keys, a delivery log and a suppression list; `handleMailgunWebhook()` feeds the suppression list from bounces and complaints. An ast-grep rule (`no-hand-written-email`) refuses hand-written HTML emails in apps.
