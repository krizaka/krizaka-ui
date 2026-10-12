import { z } from "zod";

import { KrizakaApiError } from "../src/errors";
import { configureKrizakaFetch, krizakaFetch, parseWith } from "../src/fetch";
import { fakeHttp, json, problem } from "./helpers";

const Video = z.object({ id: z.string(), title: z.string() });
let restore: () => void = () => undefined;
afterEach(() => {
  restore();
  configureKrizakaFetch({});
});

describe("krizakaFetch", () => {
  it("validates the body with the schema and types the result", async () => {
    const http = fakeHttp(json({ id: "v1", title: "Hello", extra: true }));
    restore = configureKrizakaFetch({ fetch: http.fetch });
    const video = await krizakaFetch("/api/videos/v1", { schema: Video });
    expect(video).toEqual({ id: "v1", title: "Hello" });
    const headers = http.calls[0]!.init.headers as Headers;
    expect(headers.get("accept")).toContain("application/problem+json");
    expect(http.calls[0]!.init.credentials).toBeUndefined();
  });

  it("returns the raw body without a schema (JSON, text, nothing)", async () => {
    const http = fakeHttp(
      json([1, 2]),
      new Response("plain", { headers: { "content-type": "text/plain" } }),
      new Response(null, { status: 204 }),
      new Response("", { status: 200 }),
      new Response("{oops", { headers: { "content-type": "application/json" } }),
    );
    restore = configureKrizakaFetch({ fetch: http.fetch });
    await expect(krizakaFetch("/a")).resolves.toEqual([1, 2]);
    await expect(krizakaFetch("/b")).resolves.toBe("plain");
    await expect(krizakaFetch("/c")).resolves.toBeUndefined();
    await expect(krizakaFetch("/d")).resolves.toBeUndefined();
    await expect(krizakaFetch("/e")).resolves.toBe("{oops");
  });

  it("sends JSON, query parameters, the base URL, the app's headers and credentials", async () => {
    const http = fakeHttp(json({ ok: true }));
    restore = configureKrizakaFetch({ fetch: http.fetch, baseUrl: "https://api.example.com/", credentials: "include", headers: { "x-app": "demo", "x-over": "app" } });
    await krizakaFetch("v1/items?sort=new", {
      method: "POST",
      json: { name: "A" },
      query: { tag: ["a", "b"], page: 2, skip: undefined, none: null, on: true },
      headers: { "x-over": "call" },
    });
    await krizakaFetch(new URL("https://other.example.com/x"), { query: { empty: undefined } });
    await krizakaFetch("/y", { credentials: "omit", body: "raw", headers: { "content-type": "text/plain" } });
    const [first, second, third] = http.calls;
    expect(first!.url).toBe("https://api.example.com/v1/items?sort=new&tag=a&tag=b&page=2&on=true");
    expect(first!.init).toMatchObject({ method: "POST", body: '{"name":"A"}', credentials: "include" });
    const headers = first!.init.headers as Headers;
    expect([headers.get("content-type"), headers.get("x-app"), headers.get("x-over")]).toEqual(["application/json", "demo", "call"]);
    expect(second!.url).toBe("https://other.example.com/x");
    expect(third!.url).toBe("https://api.example.com/y");
    expect(third!.init).toMatchObject({ credentials: "omit", body: "raw" });
  });

  it("injects the bearer token (native) unless the call sets Authorization", async () => {
    const http = fakeHttp(json({}));
    let token: string | null = "t0k";
    restore = configureKrizakaFetch({ fetch: http.fetch, getToken: async () => token });
    await krizakaFetch("/me");
    await krizakaFetch("/me", { headers: { authorization: "Basic x" } });
    token = null;
    await krizakaFetch("/me");
    const auth = http.calls.map((call) => (call.init.headers as Headers).get("authorization"));
    expect(auth).toEqual(["Bearer t0k", "Basic x", null]);
  });

  it("throws the server's Problem Details, a 429 with retryAt, a 401", async () => {
    const http = fakeHttp(
      problem({ status: 409, type: "https://krizaka.com/problems/auction-closed", title: "Closed", detail: "The auction is closed" }),
      json({ error: "Too many requests", code: "RATE_LIMITED" }, 429, { "retry-after": "2" }),
      new Response(null, { status: 401 }),
    );
    restore = configureKrizakaFetch({ fetch: http.fetch });
    await expect(krizakaFetch("/bid")).rejects.toMatchObject({ status: 409, code: "auction-closed", detail: "The auction is closed" });
    const limited = (await krizakaFetch("/bid").catch((e: unknown) => e)) as KrizakaApiError;
    expect(limited).toBeInstanceOf(KrizakaApiError);
    expect(limited).toMatchObject({ status: 429, code: "RATE_LIMITED" });
    expect(limited.retryInMs()).toBeGreaterThan(1000);
    await expect(krizakaFetch("/me")).rejects.toMatchObject({ status: 401, code: "unauthorized" });
  });

  it("turns a missing response into a network error and lets an abort through", async () => {
    const abort = Object.assign(new Error("aborted"), { name: "AbortError" });
    const http = fakeHttp(new TypeError("Failed to fetch"), abort);
    restore = configureKrizakaFetch({ fetch: http.fetch });
    await expect(krizakaFetch("/x")).rejects.toMatchObject({ status: 0, code: "network", detail: "Failed to fetch" });
    await expect(krizakaFetch("/x")).rejects.toBe(abort);
    const odd = fakeHttp(new Error("x"));
    restore = configureKrizakaFetch({ fetch: (() => Promise.reject("not an error")) as unknown as typeof fetch });
    await expect(krizakaFetch("/x")).rejects.toMatchObject({ code: "network", detail: undefined });
    expect(odd.calls).toHaveLength(0);
  });

  it("refuses a body the schema does not accept", async () => {
    const http = fakeHttp(json({ id: 1 }));
    restore = configureKrizakaFetch({ fetch: http.fetch });
    const error = (await krizakaFetch("/v", { schema: Video }).catch((e: unknown) => e)) as KrizakaApiError;
    expect(error).toMatchObject({ code: "invalid-response", status: 200 });
    expect(Object.keys(error.fields!)).toEqual(["id", "title"]);
  });

  it("uses the global fetch by default", async () => {
    const http = fakeHttp(json({ ok: 1 }));
    const original = globalThis.fetch;
    globalThis.fetch = http.fetch;
    try {
      await expect(krizakaFetch("/g")).resolves.toEqual({ ok: 1 });
    } finally {
      globalThis.fetch = original;
    }
  });
});

describe("parseWith", () => {
  it("names a root issue and accepts any Standard Schema", async () => {
    await expect(parseWith(z.string(), 3)).rejects.toMatchObject({ fields: { $: expect.any(Object) } });
    const keyed = { "~standard": { version: 1, vendor: "test", validate: () => ({ issues: [{ message: "bad", path: [{ key: "a" }, 0] }] }) } } as const;
    await expect(parseWith(keyed, {})).rejects.toMatchObject({ detail: "bad", fields: { "a.0": { message: "bad" } } });
    const empty = { "~standard": { version: 1, vendor: "test", validate: () => ({ issues: [] }) } } as const;
    await expect(parseWith(empty, {})).rejects.toMatchObject({ detail: undefined });
  });
});
