import { describe, expect, it } from "vitest";

import { type Catalogue, ensureCatalogue, stripeCall } from "../src/index";

const catalogue: Catalogue = {
  product: "demo",
  plans: [
    { lookupKey: "demo_monthly", name: "Demo monthly", amount: 3900, currency: "cad", interval: "month", taxCode: "txcd_10103001" },
    { lookupKey: "demo_once", name: "Demo once", amount: 999, currency: "cad" },
  ],
  portal: { headline: "Manage your subscription", cancel: "at_period_end" },
};
type Req = { method: string; path: string; params: Record<string, unknown> };

/** A fake processor: what exists is data; every call is recorded. */
function processor(state: { prices?: string[]; portal?: boolean; webhooks?: { url: string; status: string }[]; taxFails?: boolean; taxEmpty?: boolean } = {}) {
  const log: Req[] = [];
  const call = (async (method: string, path: string, params: Record<string, unknown> = {}) => {
    log.push({ method, path, params });
    if (path === "/v1/prices" && method === "GET") return { data: (state.prices ?? []).includes((params.lookup_keys as string[])[0]!) ? [{ id: "price_x", unit_amount: 1, currency: "cad" }] : [] };
    if (path === "/v1/products") return { id: "prod_1" };
    if (path === "/v1/prices") return { id: "price_new", unit_amount: params.unit_amount, currency: params.currency };
    if (path === "/v1/billing_portal/configurations" && method === "GET") return { data: state.portal ? [{ active: true, metadata: { product: "demo" } }, { active: false, metadata: {} }] : [{ active: true, metadata: { product: "other" } }] };
    if (path === "/v1/billing_portal/configurations") return { id: "bpc_1" };
    if (path === "/v1/webhook_endpoints" && method === "GET") return { data: state.webhooks ?? [] };
    if (path === "/v1/webhook_endpoints") return { id: "we_1", secret: "whsec_new" };
    if (path === "/v1/tax/settings") { if (state.taxFails) throw new Error("not enabled"); if (state.taxEmpty) return { status: "pending" }; return { status: "active", head_office: { address: { country: "CA" } } }; }
    if (path === "/v1/tax/registrations") return state.taxEmpty ? { data: [] } : { data: [{ country: "CA", status: "active" }, { country: "CA", status: "active", country_options: { ca: { province_standard: { province: "QC" } } } }] };
    throw new Error(`unexpected ${method} ${path}`);
  }) as never;
  return { call, log };
}

describe("the catalogue is data, created once", () => {
  it("creates what is missing: products, prices (tax exclusive), portal", async () => {
    const { call, log } = processor();
    const out = await ensureCatalogue(call, catalogue, { mode: "test" });
    expect(out.prices).toEqual([{ lookupKey: "demo_monthly", status: "created" }, { lookupKey: "demo_once", status: "created" }]);
    const monthly = log.find((r) => r.path === "/v1/prices" && r.method === "POST")!;
    expect(monthly.params).toMatchObject({ currency: "cad", unit_amount: 3900, tax_behavior: "exclusive", lookup_key: "demo_monthly", recurring: { interval: "month" } });
    const product = log.find((r) => r.path === "/v1/products")!;
    expect(product.params).toMatchObject({ name: "Demo monthly", tax_code: "txcd_10103001", metadata: { product: "demo" } });
    const once = log.filter((r) => r.path === "/v1/prices" && r.method === "POST")[1]!;
    expect(once.params.recurring).toBeUndefined();
    expect(log.filter((r) => r.path === "/v1/products")[1]!.params.tax_code).toBeUndefined();
    expect(out.portal).toBe("created");
    const portal = log.find((r) => r.path === "/v1/billing_portal/configurations" && r.method === "POST")!;
    expect(JSON.stringify(portal.params)).toContain("at_period_end");
  });
  it("is idempotent: what exists is left alone", async () => {
    const { call, log } = processor({ prices: ["demo_monthly", "demo_once"], portal: true });
    const out = await ensureCatalogue(call, catalogue, { mode: "test" });
    expect(out.prices.every((p) => p.status === "exists")).toBe(true);
    expect(out.portal).toBe("exists");
    expect(log.some((r) => r.method === "POST")).toBe(false);
  });
  it("creates the webhook endpoint and returns its secret once; an existing one is left", async () => {
    const created = await ensureCatalogue(processor().call, catalogue, { mode: "test", webhookUrl: "https://x.test/api/webhooks/payments" });
    expect(created.webhook).toEqual({ status: "created", secret: "whsec_new" });
    const exists = await ensureCatalogue(processor({ webhooks: [{ url: "https://x.test/api/webhooks/payments", status: "enabled" }] }).call, catalogue, { mode: "test", webhookUrl: "https://x.test/api/webhooks/payments" });
    expect(exists.webhook).toEqual({ status: "exists" });
    expect((await ensureCatalogue(processor().call, catalogue, { mode: "test" })).webhook).toBeUndefined();
  });
  it("reports the tax readiness, or that it cannot be read", async () => {
    const ok = await ensureCatalogue(processor().call, catalogue, { mode: "test" });
    expect(ok.tax).toBe("status active; head office CA; registrations: CA:active, CA-QC:active");
    const empty = await ensureCatalogue(processor({ taxEmpty: true }).call, catalogue, { mode: "test" });
    expect(empty.tax).toBe("status pending; head office missing; registrations: none");
    const nope = await ensureCatalogue(processor({ taxFails: true }).call, catalogue, { mode: "test" });
    expect(nope.tax).toBe("not readable (not enabled)");
  });
  it("refuses live mode unless the owner says so", async () => {
    await expect(ensureCatalogue(processor().call, catalogue, { mode: "live" })).rejects.toThrow(/owner/);
    await expect(ensureCatalogue(processor().call, catalogue, { mode: "live", owner: true })).resolves.toBeDefined();
  });
  it("a portal that cancels immediately", async () => {
    const { call, log } = processor();
    await ensureCatalogue(call, { ...catalogue, portal: { headline: "h", cancel: "immediately" } }, { mode: "test" });
    expect(JSON.stringify(log.find((r) => r.path === "/v1/billing_portal/configurations" && r.method === "POST")!.params)).toContain("immediately");
  });
  it("tells test from live by the key", () => {
    expect(stripeCall({ secretKey: "sk_test_x", fetch: (async () => new Response("{}")) as never }).mode).toBe("test");
    expect(stripeCall({ secretKey: "sk_live_x", fetch: (async () => new Response("{}")) as never }).mode).toBe("live");
  });
  it("calls the processor with form encoding and a GET query, and surfaces its errors", async () => {
    const seen: { url: string; init?: RequestInit }[] = [];
    const { call } = stripeCall({ secretKey: "sk_test_x", fetch: (async (url: string, init?: RequestInit) => { seen.push({ url, init }); return url.includes("bad") ? new Response(JSON.stringify({ error: { message: "nope" } }), { status: 400 }) : new Response("{}"); }) as never });
    await call("GET", "/v1/prices", { limit: 1 });
    await call("POST", "/v1/products", { name: "n" });
    expect(seen[0]!.url).toBe("https://api.stripe.com/v1/prices?limit=1");
    expect(String(seen[1]!.init?.body)).toBe("name=n");
    await expect(call("GET", "/bad")).rejects.toThrow("GET /bad: nope");
    const opaque = stripeCall({ secretKey: "sk_test_x", fetch: (async () => new Response("x", { status: 502 })) as never });
    await expect(opaque.call("GET", "/v1/x")).rejects.toThrow("GET /v1/x: 502");
  });
});
