# ADR-005 — `@krizaka/payments`: the payments port, shared

Status: accepted (2026-10-22). Issue: krizaka/krizaka-ui#480 (consumers: krizaka/akinaza#136, Yomizaka).

## Context
Akinaza and Yomizaka each carried a copy of the same payments port and Stripe adapter (webhook verification, idempotent
events, setup script). The org rule is « share before a second copy », and the stack rule is that a vendor is chosen in
configuration while prices and rules are data.

## Decision
- **A level-0 package of this monorepo**, `@krizaka/payments`, zero runtime dependency, like `@krizaka/push`: the port
  (`PaymentsPort`, vendor-free `PaymentEvent`s), the Stripe adapter over `fetch`, `verifySignature`, `applyOnce` +
  `EventStore` (`pgEventStore` on a one-line `payment_events` table), `formatPrice`, and `ensureCatalogue` with its CLI.
- **Plans are the product's names**, mapped to a price lookup key and a mode (`payment` | `subscription`) by the product's
  configuration. **No amount, no product word** in the package: the price is read by lookup key and formatted with the locale.
- **Entitlements stay in the products** (accounts, credits, plans, tables): the package knows events, not accounts' state.
- **Catalogue as data**: products, prices (tax exclusive, cents), the customer-portal configuration and the webhook endpoint
  come from a JSON file; the setup is idempotent and refuses live mode unless the owner says so.
- Published on npm through trusted publishing like the others; products consume the published version, never a link.

## Consequences
Both products delete their copy and depend on a version. Another processor is another adapter in this package. The first
npm publication of a new package needs the owner to declare the trusted publisher once (see AGENTS.md §4).
