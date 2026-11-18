import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createDiscovery, type DiscoveryOptions } from "../src/index";
import { body, entry, json, K2, memory, PUBLIC_KEYS, signed,SUFFIXES } from "./fixtures";

const PRIMARY = "https://www.krizaka.com/.well-known/krizaka/services.json";
const FALLBACK = "https://krizaka-assets.b-cdn.net/discovery/services.json";

const DEFAULT = { apiBase: "https://default.verikora.com", webBase: "https://default.verikora.com" };
const LEGACY = { apiBase: "https://dev.verikora.com", webBase: "https://dev.verikora.com" };

type Routes = Record<string, string | Error | { status: number }>;
function fakeFetch(routes: Routes) {
  const calls: string[] = [];
  const impl = (async (url: string, init?: { signal?: AbortSignal }) => {
    calls.push(url);
    const route = routes[url];
    if (route === undefined) throw new Error("offline");
    if (route instanceof Error) throw route;
    if (typeof route === "object") return { ok: false, status: route.status, text: async () => "" };
    void init;
    return { ok: true, status: 200, text: async () => route };
  }) as unknown as typeof fetch;
  return { impl, calls };
}

function make(over: Partial<DiscoveryOptions> & { routes?: Routes } = {}) {
  const { routes = { [PRIMARY]: json(signed()) }, ...rest } = over;
  const f = fakeFetch(routes);
  const storage = rest.storage ?? memory();
  const d = createDiscovery({
    environment: "dev",
    appVersion: "1.1.0",
    manifestUrls: [PRIMARY, FALLBACK],
    publicKeys: PUBLIC_KEYS,
    allowedHostSuffixes: SUFFIXES,
    defaults: { verikora: DEFAULT },
    legacy: { verikora: LEGACY },
    storage,
    fetch: f.impl,
    ...rest,
  });
  return { d, f, storage: storage as ReturnType<typeof memory> };
}

const KEY = "krizaka.discovery.v1.dev";

describe("fallback order: live → cache → baked default → legacy", () => {
  it("uses the verified live document and caches it", async () => {
    const { d, storage } = make();
    await d.start();
    expect(d.getService("verikora")).toMatchObject({ apiBase: "https://dev.verikora.com", source: "live" });
    expect(storage.data.get(KEY)).toBe(json(signed()));
  });

  it("uses the cache when the network is down, and says so", async () => {
    const storage = memory();
    storage.data.set(KEY, json(signed(body({}, { apiBase: "https://cached.verikora.com" }))));
    const { d } = make({ storage, routes: {} });
    await d.start();
    expect(d.getService("verikora")).toMatchObject({ apiBase: "https://cached.verikora.com", source: "cache" });
  });

  it("uses the baked default when there is no cache and no network", async () => {
    const { d } = make({ routes: {} });
    await d.start();
    expect(d.getService("verikora")).toMatchObject({ apiBase: "https://default.verikora.com", source: "default" });
  });

  it("uses the legacy host when there is no default either", async () => {
    const { d } = make({ routes: {}, defaults: {} });
    await d.start();
    expect(d.getService("verikora")).toMatchObject({ apiBase: "https://dev.verikora.com", source: "legacy" });
  });

  it("works before start(): the default, never a throw", () => {
    const { d } = make();
    expect(d.getService("verikora").source).toBe("default");
  });

  it("throws only for a product it knows nothing about", () => {
    const { d } = make();
    expect(() => d.getService("nope")).toThrow(/no address for nope/);
  });

  it("falls back to the default when the document has no entry for the product or the environment", async () => {
    const { d } = make({ routes: { [PRIMARY]: json(signed(body({ services: { sovkora: body().services.sovkora! } }))) } });
    await d.start();
    expect(d.getService("verikora").source).toBe("default");
    const prod = make({ environment: "prod" });
    await prod.d.start();
    expect(prod.d.getService("verikora").source).toBe("default");
  });

  it("resolves authBase to the API unless the manifest says otherwise, keeps mediaBase, drops trailing slashes", async () => {
    const m = signed(body({}, { apiBase: "https://dev.verikora.com/edge/", webBase: "https://www.verikora.com/", mediaBase: "https://media.verikora.com/" }));
    const { d } = make({ routes: { [PRIMARY]: json(m) } });
    await d.start();
    expect(d.getService("verikora")).toEqual({
      apiBase: "https://dev.verikora.com/edge",
      webBase: "https://www.verikora.com",
      mediaBase: "https://media.verikora.com",
      authBase: "https://dev.verikora.com/edge",
      source: "live",
    });
    const auth = signed(body({}, { authBase: "https://auth.verikora.com" }));
    const other = make({ routes: { [PRIMARY]: json(auth) } });
    await other.d.start();
    expect(other.d.getService("verikora").authBase).toBe("https://auth.verikora.com");
  });
});

describe("what a hijack cannot do", () => {
  it("ignores a document with a bad signature and keeps the cache", async () => {
    const storage = memory();
    storage.data.set(KEY, json(signed()));
    const tampered = signed(body({ issuedAt: "2026-10-22T00:00:00Z" }, { apiBase: "https://evil.verikora.com" }));
    tampered.signature = signed(body({ issuedAt: "2026-10-22T00:00:01Z" })).signature;
    const { d } = make({ storage, routes: { [PRIMARY]: json(tampered), [FALLBACK]: json(tampered) } });
    await d.start();
    expect(await d.refresh()).toEqual({ ok: false, reason: "bad-signature" });
    expect(d.getService("verikora")).toMatchObject({ apiBase: "https://dev.verikora.com", source: "cache" });
  });

  it("ignores a document signed by a key the app did not bake", async () => {
    const { d } = make({ routes: { [PRIMARY]: json(signed(body(), K2.seed)) } }); // names k1, signed with k2's secret
    await d.start();
    expect(d.getService("verikora").source).toBe("default");
  });

  it("refuses a validly signed address outside the allow-list and uses the default", async () => {
    const m = signed(body({}, { apiBase: "https://attacker.example.net" }));
    const { d } = make({ routes: { [PRIMARY]: json(m) } });
    await d.start();
    expect(d.getService("verikora")).toMatchObject({ apiBase: "https://default.verikora.com", source: "default" });
    expect(d.getGate("verikora")).toEqual({ state: "ok", updateAvailable: false });
  });

  it("refuses an http address and a Bunny-style shared host even when signed", async () => {
    for (const apiBase of ["http://dev.verikora.com", "https://x.b-cdn.net"]) {
      const { d } = make({ routes: { [PRIMARY]: json(signed(body({}, { apiBase }))) } });
      await d.start();
      expect(d.getService("verikora").source).toBe("default");
    }
  });

  it("refuses a replay: a document older than the one in force", async () => {
    const storage = memory();
    storage.data.set(KEY, json(signed(body({ issuedAt: "2026-10-21T12:00:00Z" }))));
    const old = signed(body({ issuedAt: "2026-10-01T00:00:00Z" }, { apiBase: "https://old.verikora.com" }));
    const { d } = make({ storage, routes: { [PRIMARY]: json(old), [FALLBACK]: json(old) } });
    await d.start();
    expect(await d.refresh()).toEqual({ ok: false, reason: "older than the document in force" });
    expect(d.getService("verikora").apiBase).toBe("https://dev.verikora.com");
  });

  it("re-verifies the cache: a tampered cache is ignored", async () => {
    const storage = memory();
    const m = signed();
    m.services.verikora!.dev!.apiBase = "https://evil.verikora.com";
    storage.data.set(KEY, json(m));
    const { d } = make({ storage, routes: {} });
    await d.start();
    expect(d.getService("verikora").source).toBe("default");
    storage.data.set(KEY, "garbage");
    const again = make({ storage, routes: {} });
    await again.d.start();
    expect(again.d.getService("verikora").source).toBe("default");
  });

  it("refuses an oversized body", async () => {
    const { d } = make({ routes: { [PRIMARY]: "x".repeat(70_000), [FALLBACK]: "x".repeat(70_000) } });
    expect(await d.refresh()).toEqual({ ok: false, reason: "manifest too large" });
  });
});

describe("fetching", () => {
  it("falls to the second URL when the first is down, then reports when both are", async () => {
    const { d, f } = make({ routes: { [FALLBACK]: json(signed()) } });
    expect(await d.refresh()).toEqual({ ok: true, url: FALLBACK, changed: true });
    expect(f.calls).toEqual([PRIMARY, FALLBACK]);
    const down = make({ routes: { [PRIMARY]: { status: 503 }, [FALLBACK]: new Error("boom") } });
    expect(await down.d.refresh()).toEqual({ ok: false, reason: "boom" });
    const none = make({ manifestUrls: [] });
    expect(await none.d.refresh()).toEqual({ ok: false, reason: "no manifest URL" });
    const weird = make({ routes: { [PRIMARY]: { status: 500 } } });
    expect(await weird.d.refresh()).toMatchObject({ ok: false });
  });

  it("reports a non-Error failure as a network error", async () => {
    const impl = (async () => {
      throw "string";
    }) as unknown as typeof fetch;
    const { d } = make({ fetch: impl });
    expect(await d.refresh()).toEqual({ ok: false, reason: "network error" });
  });

  it("coalesces concurrent refreshes into one request", async () => {
    const { d, f } = make();
    await Promise.all([d.refresh(), d.refresh(), d.refresh()]);
    expect(f.calls).toEqual([PRIMARY]);
  });

  it("reports unchanged when the same document is fetched again", async () => {
    const { d } = make();
    await d.refresh();
    expect(await d.refresh()).toEqual({ ok: true, url: PRIMARY, changed: false });
  });

  it("survives a storage that throws, reading or writing", async () => {
    const broken = { getItem: async () => Promise.reject(new Error("x")), setItem: async () => Promise.reject(new Error("x")), removeItem: async () => undefined };
    const { d } = make({ storage: broken });
    await d.start();
    expect(d.getService("verikora").source).toBe("live");
  });

  it("works without any storage", async () => {
    const { d } = make({ storage: undefined });
    d["document"]();
    await d.start();
    expect(d.getService("verikora").source).toBe("live");
  });

  it("aborts a request that outlives the timeout and starts without waiting for it when nothing is cached", async () => {
    vi.useFakeTimers();
    try {
      const hang = ((_url: string, init: { signal: AbortSignal }) =>
        new Promise((_resolve, reject) => init.signal.addEventListener("abort", () => reject(new Error("aborted"))))) as unknown as typeof fetch;
      const { d } = make({ fetch: hang, timeoutMs: 1000 });
      const started = d.start();
      await vi.advanceTimersByTimeAsync(1000);
      await started;
      expect(d.getService("verikora").source).toBe("default");
    } finally {
      vi.useRealTimers();
    }
  });

  it("with a cache, start() answers at once and refreshes in the background", async () => {
    const storage = memory();
    storage.data.set(KEY, json(signed(body({ issuedAt: "2026-10-01T00:00:00Z" }, { apiBase: "https://cached.verikora.com" }))));
    const { d } = make({ storage });
    const seen: string[] = [];
    d.subscribe(() => seen.push(d.getService("verikora").apiBase));
    await d.start();
    expect(d.getService("verikora").source).toBe("cache");
    await vi.waitFor(() => expect(d.getService("verikora")).toMatchObject({ apiBase: "https://dev.verikora.com", source: "live" }));
    expect(seen).toContain("https://dev.verikora.com");
  });

  it("start() is idempotent", async () => {
    const { d, f } = make();
    await Promise.all([d.start(), d.start()]);
    expect(f.calls).toEqual([PRIMARY]);
  });

  it("refuses a non-https manifest URL at creation", () => {
    expect(() => make({ manifestUrls: ["http://www.krizaka.com/x"] })).toThrow(/https/);
  });
});

describe("what changes without a rebuild (the live switch)", () => {
  it("moves the address when the manifest is re-issued, and tells the subscribers", async () => {
    let current = json(signed(body({ issuedAt: "2026-10-21T12:00:00Z" })));
    const impl = (async () => ({ ok: true, status: 200, text: async () => current })) as unknown as typeof fetch;
    const { d } = make({ fetch: impl });
    await d.start();
    const before = d.version();
    const heard = vi.fn();
    const off = d.subscribe(heard);
    expect(d.getService("verikora").webBase).toBe("https://dev.verikora.com");
    current = json(signed(body({ issuedAt: "2026-10-21T13:00:00Z" }, { webBase: "https://www.verikora.com" })));
    expect(await d.refresh()).toMatchObject({ ok: true, changed: true });
    expect(d.getService("verikora").webBase).toBe("https://www.verikora.com");
    expect(d.version()).toBeGreaterThan(before);
    expect(heard).toHaveBeenCalledTimes(1);
    off();
    current = json(signed(body({ issuedAt: "2026-10-21T14:00:00Z" })));
    await d.refresh();
    expect(heard).toHaveBeenCalledTimes(1);
  });
});

describe("gates", () => {
  const live = async (e: Parameters<typeof body>[1], appVersion = "1.1.0") => {
    const { d } = make({ appVersion, routes: { [PRIMARY]: json(signed(body({}, e))) } });
    await d.start();
    return d;
  };

  it("is open on a current build, and says when an update is available", async () => {
    expect((await live({}, "1.2.0")).getGate("verikora")).toEqual({ state: "ok", updateAvailable: false, latestAppVersion: "1.2.0" });
    expect((await live({})).getGate("verikora")).toEqual({ state: "ok", updateAvailable: true, latestAppVersion: "1.2.0" });
  });

  it("asks for an update below minAppVersion, with the message", async () => {
    const message = { en: "Update to continue", fr: "Mettez à jour pour continuer" };
    const d = await live({ minAppVersion: "1.5.0", latestAppVersion: "1.6.0", message });
    expect(d.getGate("verikora")).toEqual({ state: "update-required", minAppVersion: "1.5.0", latestAppVersion: "1.6.0", message });
    const bare = await live({ minAppVersion: "1.5.0", latestAppVersion: "1.6.0" });
    expect(bare.getGate("verikora")).toEqual({ state: "update-required", minAppVersion: "1.5.0", latestAppVersion: "1.6.0" });
  });

  it("shows maintenance, with or without a message", async () => {
    const message = { en: "Back in an hour", fr: "De retour dans une heure" };
    expect((await live({ status: "maintenance", message })).getGate("verikora")).toEqual({ state: "maintenance", message });
    expect((await live({ status: "maintenance" })).getGate("verikora")).toEqual({ state: "maintenance" });
  });

  it("an update beats maintenance", async () => {
    expect((await live({ status: "maintenance", minAppVersion: "2.0.0" })).getGate("verikora").state).toBe("update-required");
  });

  it("keeps applying from the cache while offline, and never from a default or legacy address", async () => {
    const storage = memory();
    storage.data.set(KEY, json(signed(body({}, { status: "maintenance" }))));
    const offline = make({ storage, routes: {} });
    await offline.d.start();
    expect(offline.d.getGate("verikora").state).toBe("maintenance");
    const none = make({ routes: {} });
    await none.d.start();
    expect(none.d.getGate("verikora")).toEqual({ state: "ok", updateAvailable: false });
    expect(none.d.getGate("unknown")).toEqual({ state: "ok", updateAvailable: false });
  });

  it("never locks anyone out over a version it cannot read", async () => {
    const d = await live({ minAppVersion: "9.0.0" }, "dev-build");
    expect(d.getGate("verikora")).toEqual({ state: "ok", updateAvailable: false, latestAppVersion: "1.2.0" });
  });
});

describe("overrides and the baked addresses", () => {
  it("an override wins, needs no allow-list (a LAN address), and opens the gate", async () => {
    const lan = { apiBase: "http://192.168.1.10:3000", webBase: "http://192.168.1.10:3000" };
    const { d } = make({ overrides: { verikora: lan }, routes: { [PRIMARY]: json(signed(body({}, { status: "maintenance" }))) } });
    await d.start();
    expect(d.getService("verikora")).toMatchObject({ apiBase: "http://192.168.1.10:3000", source: "override" });
    expect(d.getGate("verikora")).toEqual({ state: "ok", updateAvailable: false });
  });

  it("refuses at creation a baked default or legacy address outside the allow-list", () => {
    expect(() => make({ defaults: { verikora: { apiBase: "https://evil.example.net", webBase: "https://evil.example.net" } } })).toThrow(/default address of verikora/);
    expect(() => make({ legacy: { verikora: { apiBase: "https://evil.example.net", webBase: "https://dev.verikora.com" } } })).toThrow(/legacy address of verikora/);
  });

  it("keeps optional bases of a baked default", () => {
    const { d } = make({ defaults: { verikora: { ...DEFAULT, authBase: "https://auth.verikora.com/", mediaBase: "https://media.verikora.com" } } });
    expect(d.getService("verikora")).toMatchObject({ authBase: "https://auth.verikora.com", mediaBase: "https://media.verikora.com" });
  });
});

describe("background refresh", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());
  it("refreshes on an interval until stopped", async () => {
    const { d, f } = make();
    const stop = d.startBackgroundRefresh(1000);
    await vi.advanceTimersByTimeAsync(3100);
    expect(f.calls).toHaveLength(3);
    stop();
    await vi.advanceTimersByTimeAsync(5000);
    expect(f.calls).toHaveLength(3);
  });
  it("defaults to fifteen minutes", async () => {
    const { d, f } = make();
    const stop = d.startBackgroundRefresh();
    await vi.advanceTimersByTimeAsync(14 * 60 * 1000);
    expect(f.calls).toHaveLength(0);
    await vi.advanceTimersByTimeAsync(61 * 1000);
    expect(f.calls).toHaveLength(1);
    stop();
  });
});

describe("options", () => {
  it("caches under a custom storage key, and uses the global fetch by default", async () => {
    const storage = memory();
    const spy = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(json(signed())));
    const { d } = make({ storage, storageKey: "custom.key", fetch: undefined });
    await d.start();
    expect(storage.data.has("custom.key")).toBe(true);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe("entry helper", () => {
  it("is a ServiceEntry", () => expect(entry().status).toBe("ok"));
});
