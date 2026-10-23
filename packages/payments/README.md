# @krizaka/payments

Payments for every Krizaka product, **the vendor behind a port**: the Stripe adapter (Checkout, customer portal, price read
by lookup key, verified webhook), idempotent event application, a locale-aware price formatter and a catalogue setup that
creates products, prices, the portal and the webhook **from data**.

```bash
npm install @krizaka/payments
```

ESM only, Node ≥ 22, **zero dependency**: no SDK, you pass `fetch`. Nothing is read from the environment: keys are arguments.

## Use

```ts
import { applyOnce, formatPrice, pgEventStore, stripeAdapter } from "@krizaka/payments";

// The only place a vendor is chosen: your configuration.
const payments = stripeAdapter({
  secretKey, webhookSecret,
  plans: { founder: { lookupKey: "akinaza_founder_monthly_cad", mode: "subscription" } },
});

const { url } = await payments.checkout({ kind: "founder", customerId, accountId, successUrl, cancelUrl, locale: "fr" });
const price = formatPrice(await payments.price("founder"), "fr"); // « 39 $ », read from the processor, never typed

// The webhook route: verify over the raw body, then apply each event once.
const event = payments.parseWebhook(await req.text(), req.headers, Math.floor(Date.now() / 1000)); // throws PaymentsError (400)
await applyOnce(pgEventStore(query), event, {
  subscription_started: async (e) => { /* … */ },
  subscription_changed: async (e) => { /* … */ },
});
```

- **Events are vendor-free** (`payment_paid`, `subscription_started`, `subscription_changed`); plans are named by the product.
- **Idempotent**: `applyOnce` records the id first (`payment_events (id text primary key, type text)`), so a replay runs no handler.
  If the handler throws, the id is given back (`EventStore.forget`, implemented by `pgEventStore`) and the error propagates. The webhook
  then answers an error, and the processor's retry applies the event.
- **Atomic**: prefer `applyOnceInTransaction`. It records the id and runs the effect in **one transaction**, so they commit together
  or roll back together. That also covers a crash between the two:

```ts
await applyOnceInTransaction((work) => db.transaction(work), event, {
  payment_paid: async (e, query) => { await query("UPDATE accounts SET audit_credits = audit_credits + 1 WHERE id = $1", [e.accountId]); },
});
```
- **Taxes** are the processor's (Stripe Tax: GST + QST from the buyer's address).

## Setup from data

```jsonc
// catalogue.json — the products and prices are data (cents, tax exclusive)
{ "product": "akinaza",
  "plans": [{ "lookupKey": "akinaza_founder_monthly_cad", "name": "Akinaza — Founder offer", "amount": 3900, "currency": "cad", "interval": "month", "taxCode": "txcd_10103001" }],
  "portal": { "headline": "Manage your subscription", "cancel": "at_period_end" } }
```

```bash
PAYMENTS_STRIPE_SECRET_KEY=… npx krizaka-payments-setup --catalogue catalogue.json \
  --webhook-url https://www.example.com/api/webhooks/payments --secret-out ./whsec   # idempotent; live needs --i-am-the-owner
```
