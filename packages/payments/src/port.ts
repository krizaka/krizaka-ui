/**
 * The payments PORT. A product's domain knows its plans (named by the product), customers and these events — never a vendor.
 * The adapter is chosen by the product's configuration; another processor is another adapter. Prices are the processor's
 * data, found by the adapter: no amount appears in code.
 */
export type PlanKind = string;

/** What the domain learns from a processor, vendor-free. `id` is unique per event: the domain applies each once. */
export type PaymentEvent =
  | { id: string; type: "payment_paid"; kind: PlanKind; accountId: string; customerId: string | null }
  | { id: string; type: "subscription_started"; accountId: string; customerId: string | null; subscriptionId: string | null }
  | { id: string; type: "subscription_changed"; accountId: string | null; customerId: string | null; subscriptionId: string; status: string; active: boolean; periodEnd: number | null }
  | { id: string; type: "ignored" };

export interface CheckoutRequest {
  kind: PlanKind;
  customerId: string;
  accountId: string;
  successUrl: string;
  cancelUrl: string;
  locale: "en" | "fr";
}

/** The processor's price of a plan: integer minor units (cents), a lowercase ISO currency, the billing interval (null = one-off). */
export interface Price {
  amount: number;
  currency: string;
  interval: "day" | "week" | "month" | "year" | null;
}

export interface PaymentsPort {
  /** Creates the processor's customer for an account (idempotent per account). */
  createCustomer(email: string, accountId: string): Promise<{ id: string }>;
  /** A hosted payment page for a plan; the amount, the taxes and the invoice are the processor's. */
  checkout(request: CheckoutRequest): Promise<{ url: string }>;
  /** The hosted page where the customer manages the subscription and the invoices, and cancels. */
  portal(customerId: string, returnUrl: string, locale: "en" | "fr"): Promise<{ url: string }>;
  /** The processor's current price of a plan (read by lookup key). */
  price(kind: PlanKind): Promise<Price>;
  /** Verifies the notification's proof of origin (read from its headers) over the raw body and translates it; throws `PaymentsError` on a bad signature. */
  parseWebhook(rawBody: string, headers: Headers, nowSeconds: number): PaymentEvent;
}

export class PaymentsError extends Error {
  constructor(readonly status: number, message: string) {
    super(message);
    this.name = "PaymentsError";
  }
}
