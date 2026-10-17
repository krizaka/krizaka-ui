import { describe, expect, it, vi } from "vitest";

import { type AppConfigRecord, defaultRecord, type Platform } from "../src/index";
import { type AppConfigStore, cachedStore, checkClientVersion, createAppConfigHandler, memoryStore, schemaSql, withClientVersionGuard } from "../src/server";
import cases from "./cases.json";

const rec = (config: Record<string, unknown> = {}, platform: Platform = "ios"): AppConfigRecord => ({ ...defaultRecord(platform), ...config }) as AppConfigRecord;
const get = (path: string, headers: Record<string, string> = {}) => new Request(`https://api.example${path}`, { headers });

describe("the shared fixture through the guard", () => {
  for (const c of cases.cases) {
    it(c.name, async () => {
      const store = memoryStore([rec(c.config, c.platform as Platform)]);
      const client = c.client as { version?: string; contract?: number };
      const headers: Record<string, string> = { "x-client-platform": c.platform };
      if (client.version) headers["x-client-version"] = client.version;
      if (client.contract) headers["x-contract-version"] = String(client.contract);
      const outcome = await checkClientVersion(get("/api/v1/things", headers), { store });
      const expected = c.expect.guard as { status: number; code?: string; deprecation?: boolean; sunset?: string };
      expect(outcome.refusal?.status ?? 200).toBe(expected.status);
      if (expected.code) {
        const body = await outcome.refusal?.json();
        expect(body).toMatchObject({ code: expected.code, status: 426, appConfig: { updateMode: "force" } });
        expect(outcome.refusal?.headers.get("content-type")).toBe("application/problem+json");
        expect(outcome.refusal?.headers.get("upgrade")).toMatch(/^krizaka-app\//);
      }
      if (expected.deprecation !== undefined) expect("Deprecation" in outcome.headers).toBe(expected.deprecation);
      if (expected.sunset) expect(outcome.headers.Sunset).toBe(expected.sunset);
    });
  }
});

describe("the endpoint", () => {
  const handler = createAppConfigHandler({ store: memoryStore([rec({ minSupportedVersion: "1.2.0", latestVersion: "1.4.0", message: { en: "Update", fr: "Mettez à jour" } })]) });

  it("answers publicly with cache headers and the payload of the version asked", async () => {
    const response = await handler(get("/api/v1/app-config?platform=ios&version=1.3.0&locale=fr"));
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("public, max-age=60, stale-while-revalidate=300");
    expect(response.headers.get("vary")).toBe("Accept-Language");
    expect(response.headers.get("x-contract-version")).toBe("1");
    expect(await response.json()).toMatchObject({ updateMode: "soft", message: "Mettez à jour", locale: "fr" });
  });

  it("reads the platform and the language from the headers when the query has none", async () => {
    const response = await handler(get("/api/v1/app-config", { "x-client-platform": "ios", "accept-language": "fr-CA,fr;q=0.9" }));
    expect(await response.json()).toMatchObject({ platform: "ios", locale: "fr" });
    const noLanguage = await handler(get("/api/v1/app-config?platform=ios", { "accept-language": "x" }));
    expect(await noLanguage.json()).toMatchObject({ locale: "en" });
  });

  it("is conditional", async () => {
    const first = await handler(get("/api/v1/app-config?platform=ios"));
    const again = await handler(get("/api/v1/app-config?platform=ios", { "if-none-match": first.headers.get("etag") ?? "" }));
    expect(again.status).toBe(304);
  });

  it("serves the defaults for a platform nobody configured", async () => {
    const response = await handler(get("/api/v1/app-config?platform=linux"));
    expect(await response.json()).toMatchObject({ minSupportedVersion: "0.0.0", updateMode: "none" });
  });

  it("refuses an unknown platform or an unreadable version with a 400", async () => {
    const platform = await handler(get("/api/v1/app-config?platform=playstation"));
    expect(platform.status).toBe(400);
    expect(await platform.json()).toMatchObject({ code: "unknown-platform" });
    const version = await handler(get("/api/v1/app-config?platform=ios&version=soon"));
    expect(await version.json()).toMatchObject({ code: "invalid-version" });
    expect((await handler(get("/api/v1/app-config"))).status).toBe(400);
  });

  it("takes the max-age as an option", async () => {
    const short = createAppConfigHandler({ store: memoryStore(), maxAgeSeconds: 10 });
    expect((await short(get("/api/v1/app-config?platform=web"))).headers.get("cache-control")).toContain("max-age=10");
  });
});

describe("the guard", () => {
  const store = memoryStore([rec({ minSupportedVersion: "2.0.0", latestVersion: "2.0.0", contractMin: 1, contractMax: 2 })]);

  it("lets a request without client headers through, untouched", async () => {
    expect(await checkClientVersion(get("/api/v1/things"), { store })).toEqual({ refusal: null, headers: {}, result: null });
  });

  it("guards a platform nobody configured with the defaults", async () => {
    const outcome = await checkClientVersion(get("/api/v1/things", { "x-client-platform": "web", "x-client-version": "0.0.1" }), { store: memoryStore() });
    expect(outcome.refusal).toBeNull();
  });

  it("explains a contract refusal and uses the problem base it is given", async () => {
    const contractStore = memoryStore([rec({ contractMin: 2, contractMax: 2 })]);
    const outcome = await checkClientVersion(get("/api/v1/things", { "x-client-platform": "ios", "x-contract-version": "1" }), { store: contractStore, problemBase: "https://x.example/p/" });
    const body = (await outcome.refusal?.json()) as { type: string; detail: string; instance: string };
    expect(body.type).toBe("https://x.example/p/contract-unsupported");
    expect(body.detail).toMatch(/contract/);
    expect(body.instance).toBe("/api/v1/things");
  });

  it("wraps a route handler: refuses before it runs, decorates after", async () => {
    const handler = vi.fn(() => new Response("[]"));
    const guarded = withClientVersionGuard({ store }, handler);
    const refused = await guarded(get("/api/v1/things", { "x-client-platform": "ios", "x-client-version": "1.0.0" }));
    expect(refused.status).toBe(426);
    expect(handler).not.toHaveBeenCalled();
    const served = await guarded(get("/api/v1/things", { "x-client-platform": "ios", "x-client-version": "2.0.0", "x-contract-version": "1" }));
    expect(served.status).toBe(200);
    expect(served.headers.get("x-contract-version")).toBe("2");
    expect(served.headers.get("deprecation")).toBe("true");
    expect(handler).toHaveBeenCalledOnce();
  });
});

describe("cachedStore", () => {
  const flaky = () => {
    const state = { reads: 0, failing: false };
    const store: AppConfigStore = {
      get: async (platform) => {
        state.reads += 1;
        if (state.failing) throw new Error("db down");
        return platform === "ios" ? rec({ minSupportedVersion: "2.0.0", latestVersion: "2.0.0" }) : undefined;
      },
    };
    return { state, store };
  };

  it("reads once per ttl", async () => {
    const { state, store } = flaky();
    let t = 0;
    const cached = cachedStore(store, { ttlMs: 1000, now: () => t });
    await cached.get("ios");
    await cached.get("ios");
    expect(state.reads).toBe(1);
    t = 1500;
    await cached.get("ios");
    expect(state.reads).toBe(2);
  });

  it("serves the last value in an outage and the defaults when it has none", async () => {
    const { state, store } = flaky();
    let t = 0;
    const cached = cachedStore(store, { ttlMs: 1 });
    expect((await cachedStore(store, { ttlMs: 1, now: () => t }).get("ios"))?.minSupportedVersion).toBe("2.0.0");
    const warm = cachedStore(store, { ttlMs: 1, now: () => t });
    await warm.get("ios");
    state.failing = true;
    t = 10;
    expect((await warm.get("ios"))?.minSupportedVersion).toBe("2.0.0");
    expect((await cached.get("android"))?.minSupportedVersion).toBe("0.0.0");
  });

  it("evicts one platform or all", async () => {
    const { state, store } = flaky();
    const cached = cachedStore(store, { ttlMs: 60_000 });
    await cached.get("ios");
    await cached.get("android");
    cached.evict("ios");
    await cached.get("ios");
    await cached.get("android");
    expect(state.reads).toBe(3);
    cached.evict();
    await cached.get("ios");
    await cached.get("android");
    expect(state.reads).toBe(5);
  });
});

describe("schemaSql", () => {
  it("is the tables of the contract", () => {
    expect(schemaSql).toContain("CREATE TABLE IF NOT EXISTS app_config ");
    expect(schemaSql).toContain("CREATE TABLE IF NOT EXISTS app_config_history");
    expect(schemaSql).toContain("min_supported_version");
  });
});
