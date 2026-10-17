import { describe, expect, it, vi } from "vitest";

import { type AppConfigClientOptions, clientHeaders, createAppConfigClient, decide, isUpgradeRequired, readUpgradeRequired, upgradePayloadOf } from "../src/client";
import { type AppConfigPayload, buildPayload, defaultRecord } from "../src/index";

const payload = (patch: Partial<AppConfigPayload> = {}): AppConfigPayload => ({ ...buildPayload(defaultRecord("ios"), null), ...patch });
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

function make(options: Partial<AppConfigClientOptions> & { responses?: Response[] } = {}) {
  const queue = [...(options.responses ?? [])];
  const fetchMock = vi.fn(async () => queue.shift() ?? json(payload()));
  let t = 0;
  const client = createAppConfigClient({ baseUrl: "https://api.example/", platform: "ios", version: "1.2.0", fetch: fetchMock as unknown as typeof fetch, now: () => t, ...options });
  return { client, fetchMock, advance: (ms: number) => (t += ms) };
}

describe("decide", () => {
  it("puts maintenance first, then force, then soft, and respects a dismissed soft prompt", () => {
    expect(decide(null)).toEqual({ kind: "ok" });
    const base = payload({ latestVersion: "2.0.0" });
    expect(decide({ ...base, maintenance: { on: true, message: null }, updateMode: "force" }).kind).toBe("maintenance");
    expect(decide({ ...base, updateMode: "force" }).kind).toBe("force");
    expect(decide({ ...base, updateMode: "soft" }).kind).toBe("soft");
    expect(decide({ ...base, updateMode: "soft" }, "2.0.0").kind).toBe("ok");
    expect(decide({ ...base, updateMode: "soft" }, "1.9.0").kind).toBe("soft");
    expect(decide({ ...base, updateMode: "none" }).kind).toBe("ok");
  });
});

describe("headers and 426", () => {
  it("builds the three headers (and the build when given)", () => {
    expect(clientHeaders({ platform: "android", version: "1.0.0" })).toEqual({ "X-Client-Platform": "android", "X-Client-Version": "1.0.0", "X-Contract-Version": "1" });
    expect(clientHeaders({ platform: "ios", version: "1.0.0", contract: 3, build: "42" })).toMatchObject({ "X-Contract-Version": "3", "X-Client-Build": "42" });
  });
  it("recognises a 426 and reads its payload, or nothing", async () => {
    expect(isUpgradeRequired({ status: 426 })).toBe(true);
    expect(isUpgradeRequired({ status: 200 })).toBe(false);
    const body = { appConfig: payload({ updateMode: "force" }) };
    expect(await readUpgradeRequired(json(body, 426))).toMatchObject({ updateMode: "force" });
    expect(await readUpgradeRequired(json({ appConfig: { x: 1 } }, 426))).toBeNull();
    expect(await readUpgradeRequired(new Response("<html>", { status: 426 }))).toBeNull();
  });
  it("reads the payload of an already parsed body, for a transport that is not fetch", () => {
    expect(upgradePayloadOf({ appConfig: payload({ updateMode: "force" }) })).toMatchObject({ updateMode: "force" });
    expect(upgradePayloadOf({ appConfig: 3 })).toBeNull();
    expect(upgradePayloadOf(null)).toBeNull();
    expect(upgradePayloadOf("x")).toBeNull();
  });
  it("exposes its headers for the same transports", () => {
    const { client } = make({ build: "42" });
    expect(client.headers).toMatchObject({ "X-Client-Platform": "ios", "X-Client-Version": "1.2.0", "X-Client-Build": "42" });
  });
});

describe("the client", () => {
  it("checks the backend with the platform, the version and the language, and decides", async () => {
    const { client, fetchMock } = make({ language: () => "fr", responses: [json(payload({ updateMode: "soft", latestVersion: "1.4.0" }))] });
    const states: string[] = [];
    client.subscribe(() => states.push(client.getState().status));
    await client.check();
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, { headers: Record<string, string> }];
    expect(url).toBe("https://api.example/api/v1/app-config?platform=ios&version=1.2.0&locale=fr");
    expect(init.headers["X-Client-Platform"]).toBe("ios");
    expect(states).toEqual(["loading", "ready"]);
    expect(client.getState().decision.kind).toBe("soft");
  });

  it("skips a check made too soon, unless forced", async () => {
    const { client, fetchMock, advance } = make();
    await client.check();
    await client.check();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    advance(299_999);
    await client.check();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    advance(2);
    await client.check();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    await client.check({ force: true });
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("takes the interval as an option", async () => {
    const { client, fetchMock, advance } = make({ minIntervalMs: 10 });
    await client.check();
    advance(11);
    await client.check();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("fails open on a network error, a bad status or garbage", async () => {
    const fail = vi.fn(async () => {
      throw new Error("offline");
    });
    const offline = createAppConfigClient({ baseUrl: "https://x", platform: "ios", version: "1.0.0", fetch: fail as unknown as typeof fetch });
    await offline.check();
    expect(offline.getState()).toMatchObject({ status: "failed", decision: { kind: "ok" } });
    const { client } = make({ responses: [json({}, 500)] });
    await client.check();
    expect(client.getState().status).toBe("failed");
    const garbage = make({ responses: [json({ hello: 1 })] });
    await garbage.client.check();
    expect(garbage.client.getState()).toMatchObject({ status: "failed", config: null });
  });

  it("uses the global fetch when none is given", async () => {
    const original = globalThis.fetch;
    globalThis.fetch = vi.fn(async () => json(payload())) as unknown as typeof fetch;
    try {
      const client = createAppConfigClient({ baseUrl: "https://x", platform: "web", version: "1.0.0" });
      await client.check();
      expect(client.getState().status).toBe("ready");
    } finally {
      globalThis.fetch = original;
    }
  });

  it("fills in what an older backend leaves out", async () => {
    const { client } = make({ responses: [json({ ...payload(), flags: undefined, message: undefined, storeUrl: undefined, locale: undefined })] });
    await client.check();
    expect(client.getState().config).toMatchObject({ flags: {}, message: null, storeUrl: null, locale: "en" });
  });

  it("remembers a dismissed soft prompt per version, in the storage given", async () => {
    const store = new Map<string, string>();
    const storage = { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => void store.set(k, v) };
    const soft = payload({ updateMode: "soft", latestVersion: "1.4.0" });
    const first = make({ storage, responses: [json(soft)] });
    await first.client.check();
    expect(first.client.getState().decision.kind).toBe("soft");
    await first.client.dismissSoft();
    expect(first.client.getState().decision.kind).toBe("ok");
    const second = make({ storage, responses: [json(soft)] });
    await second.client.check();
    expect(second.client.getState().decision.kind).toBe("ok");
    const newer = make({ storage, responses: [json({ ...soft, latestVersion: "1.5.0" })] });
    await newer.client.check();
    expect(newer.client.getState().decision.kind).toBe("soft");
  });

  it("dismissSoft does nothing before a config is known, and works without storage", async () => {
    const { client } = make({ responses: [json(payload({ updateMode: "soft", latestVersion: "1.4.0" }))] });
    await client.dismissSoft();
    expect(client.getState().decision.kind).toBe("ok");
    await client.check();
    await client.dismissSoft();
    expect(client.getState().decision.kind).toBe("ok");
  });

  it("a 426 on any request forces the update, even without a usable body", async () => {
    const { client } = make({ responses: [json({ appConfig: payload({ updateMode: "force", minSupportedVersion: "2.0.0", latestVersion: "2.1.0", storeUrl: "https://apps.apple.com/app/id1", message: "Update" }) }, 426), new Response("nope", { status: 426 })] });
    const response = await client.fetch("https://api.example/api/v1/things", { headers: { "X-Client-Version": "9.9.9" } });
    expect(response.status).toBe(426);
    expect(client.getState().decision).toMatchObject({ kind: "force", config: { minSupportedVersion: "2.0.0", storeUrl: "https://apps.apple.com/app/id1" } });
    const blind = make({ responses: [new Response("nope", { status: 426 })] });
    await blind.client.fetch("https://api.example/x");
    expect(blind.client.getState().decision).toMatchObject({ kind: "force", config: { updateMode: "force", storeUrl: null, flags: {} } });
  });

  it("a 426 keeps what a previous check already knew", async () => {
    const { client } = make({ responses: [json(payload({ storeUrl: "https://play.google.com/x", minSupportedVersion: "1.0.0", latestVersion: "1.1.0", message: "Hi", flags: { a: true }, contract: { min: 1, max: 2, sunset: null }, locale: "fr" })), new Response("", { status: 426 })] });
    await client.check();
    await client.fetch("https://api.example/x");
    expect(client.getState().decision).toMatchObject({ kind: "force", config: { storeUrl: "https://play.google.com/x", message: "Hi", flags: { a: true }, locale: "fr", contract: { max: 2 } } });
  });

  it("sends the client headers on its own fetch without overriding the caller's, whatever form they take", async () => {
    const { client, fetchMock } = make();
    const sent = (n: number) => (fetchMock.mock.calls[n] as unknown as [string, { headers: Record<string, string> | Headers }])[1].headers;
    await client.fetch("https://api.example/x", { headers: { "x-client-version": "override", Accept: "application/json" } });
    expect(sent(0)).toEqual({ "x-client-version": "override", Accept: "application/json", "X-Client-Platform": "ios", "X-Contract-Version": "1" });
    await client.fetch("https://api.example/y");
    expect(sent(1)).toMatchObject({ "X-Client-Version": "1.2.0" });
    await client.fetch("https://api.example/z", { headers: [["Authorization", "Bearer t"]] });
    expect(sent(2)).toMatchObject({ Authorization: "Bearer t", "X-Client-Platform": "ios" });
    await client.fetch("https://api.example/h", { headers: new Headers({ "x-client-platform": "android" }) });
    const real = sent(3) as Headers;
    expect(real.get("x-client-platform")).toBe("android");
    expect(real.get("x-client-version")).toBe("1.2.0");
  });

  it("checks again on every resume and stops when detached", async () => {
    const { client, fetchMock, advance } = make();
    let fire = () => {};
    const stop = vi.fn();
    const detach = client.attach((callback) => {
      fire = callback;
      return stop;
    });
    advance(1_000_000);
    fire();
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    detach();
    expect(stop).toHaveBeenCalled();
  });

  it("unsubscribes listeners", async () => {
    const { client } = make();
    const listener = vi.fn();
    const off = client.subscribe(listener);
    off();
    await client.check();
    expect(listener).not.toHaveBeenCalled();
  });
});
