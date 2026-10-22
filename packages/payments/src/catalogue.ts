import { rawCall } from "./stripe";

/** One product and price a product sells, as data. Amounts are integer cents, tax exclusive (the processor adds the taxes). */
export interface CataloguePlan {
  lookupKey: string;
  name: string;
  amount: number;
  currency: string;
  interval?: "month" | "year";
  /** The processor's tax code of the product (e.g. software as a service). */
  taxCode?: string;
}

export interface Catalogue {
  /** Marks what this catalogue created (`metadata.product`). */
  product: string;
  plans: CataloguePlan[];
  portal: { headline: string; cancel: "at_period_end" | "immediately" };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- the processor's JSON, read field by field below
export type StripeCall = (method: "GET" | "POST", path: string, params?: Record<string, unknown>) => Promise<Record<string, any>>;

/** The processor's API as one function (errors say which call failed), and the mode its key is in. */
export function stripeCall(config: { secretKey: string; fetch?: typeof fetch; apiBase?: string }): { call: StripeCall; mode: "test" | "live" } {
  return {
    mode: config.secretKey.startsWith("sk_live_") ? "live" : "test",
    async call(method, path, params = {}) {
      const { ok, status, json } = await rawCall(config, method, path, params);
      if (!ok) throw new Error(`${method} ${path}: ${json.error?.message ?? status}`);
      return json;
    },
  };
}

export interface SetupResult {
  prices: { lookupKey: string; status: "exists" | "created" }[];
  portal: "exists" | "created";
  webhook?: { status: "exists" } | { status: "created"; secret: string };
  tax: string;
}

const WEBHOOK_EVENTS = ["checkout.session.completed", "customer.subscription.created", "customer.subscription.updated", "customer.subscription.deleted"];

type Registration = { country: string; status: string; country_options?: { ca?: { province_standard?: { province?: string } } } };

/**
 * Creates, idempotently, what the adapter reads as DATA: products and prices (found by lookup key), the customer-portal
 * configuration and, when asked, the webhook endpoint (its signing secret is returned once — the caller stores it).
 * Test or live is decided by the key; live is refused unless `owner` is true.
 */
export async function ensureCatalogue(call: StripeCall, catalogue: Catalogue, options: { mode: "test" | "live"; owner?: boolean; webhookUrl?: string }): Promise<SetupResult> {
  if (options.mode === "live" && !options.owner) throw new Error("Live mode is the owner's: refusing");
  const prices: SetupResult["prices"] = [];
  for (const plan of catalogue.plans) {
    const existing = await call("GET", "/v1/prices", { lookup_keys: [plan.lookupKey], active: true, limit: 1 });
    if (existing.data[0]) {
      prices.push({ lookupKey: plan.lookupKey, status: "exists" });
      continue;
    }
    const product = await call("POST", "/v1/products", { name: plan.name, ...(plan.taxCode ? { tax_code: plan.taxCode } : {}), metadata: { product: catalogue.product } });
    await call("POST", "/v1/prices", { product: product.id, currency: plan.currency, unit_amount: plan.amount, tax_behavior: "exclusive", lookup_key: plan.lookupKey, ...(plan.interval ? { recurring: { interval: plan.interval } } : {}) });
    prices.push({ lookupKey: plan.lookupKey, status: "created" });
  }

  const configs = await call("GET", "/v1/billing_portal/configurations", { limit: 100 });
  let portal: SetupResult["portal"] = "exists";
  if (!configs.data.some((c: { active: boolean; metadata?: { product?: string } }) => c.active && c.metadata?.product === catalogue.product)) {
    await call("POST", "/v1/billing_portal/configurations", {
      business_profile: { headline: catalogue.portal.headline },
      metadata: { product: catalogue.product },
      features: {
        invoice_history: { enabled: true },
        payment_method_update: { enabled: true },
        customer_update: { enabled: true, allowed_updates: ["email", "name", "address", "tax_id"] },
        subscription_cancel: { enabled: true, mode: catalogue.portal.cancel },
      },
    });
    portal = "created";
  }

  let webhook: SetupResult["webhook"];
  if (options.webhookUrl) {
    const list = await call("GET", "/v1/webhook_endpoints", { limit: 100 });
    if (list.data.some((w: { url: string }) => w.url === options.webhookUrl)) webhook = { status: "exists" };
    else {
      const created = await call("POST", "/v1/webhook_endpoints", { url: options.webhookUrl, enabled_events: WEBHOOK_EVENTS, description: `${catalogue.product} payments` });
      webhook = { status: "created", secret: created.secret };
    }
  }

  let tax: string;
  try {
    const settings = await call("GET", "/v1/tax/settings");
    const regs = await call("GET", "/v1/tax/registrations", { status: "all", limit: 20 });
    const list = regs.data.map((r: Registration) => `${r.country}${r.country_options?.ca?.province_standard?.province ? `-${r.country_options.ca.province_standard.province}` : ""}:${r.status}`).join(", ");
    tax = `status ${settings.status}; head office ${settings.head_office?.address?.country ?? "missing"}; registrations: ${list || "none"}`;
  } catch (e) {
    tax = `not readable (${(e as Error).message})`;
  }
  return { prices, portal, webhook, tax };
}
