import { describe, expect, it, vi } from "vitest";

import { ApiError, createApiClient } from "../src/api";
import { createSessionStore } from "../src/session";
import type { KeyValueStorage } from "../src/storage";

function sessionWith(token: string | null) {
  const data = new Map<string, string>(token ? [["s", token]] : []);
  const storage: KeyValueStorage = {
    get: async (key) => data.get(key) ?? null,
    set: async (key, value) => void data.set(key, value),
    remove: async (key) => void data.delete(key),
  };
  return createSessionStore({ storage, key: "s" });
}

const json = (status: number, body: unknown) => new Response(JSON.stringify(body), { status });

function client(fetchImpl: typeof fetch, token: string | null = "tok", timeoutMs = 50) {
  const session = sessionWith(token);
  return { session, api: createApiClient({ baseUrl: () => "https://api.example.com", session, fetch: fetchImpl, language: () => "fr-CA", productName: "Yomizaka", timeoutMs }) };
}

describe("createApiClient", () => {
  it("sends the bearer token, the language and no cookie", async () => {
    const fetchImpl = vi.fn(async () => json(200, { ok: true }));
    const { api } = client(fetchImpl as unknown as typeof fetch);
    expect(await api.call("/api/me")).toEqual({ ok: true });
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://api.example.com/api/me");
    expect(init).toMatchObject({ method: "GET", credentials: "omit", headers: { Authorization: "Bearer tok", "Accept-Language": "fr-CA", Accept: "application/json" } });
    expect(init.body).toBeUndefined();
  });

  it("sends a JSON body with its content type and no token when signed out", async () => {
    const fetchImpl = vi.fn(async () => json(200, {}));
    const { api } = client(fetchImpl as unknown as typeof fetch, null);
    await api.call("/api/auth/login", { method: "POST", body: { a: 1 }, headers: { "X-Extra": "1" } });
    const init = (fetchImpl.mock.calls[0] as unknown as [string, RequestInit])[1];
    expect(init.body).toBe('{"a":1}');
    expect(init.headers).toMatchObject({ "Content-Type": "application/json", "X-Extra": "1" });
    expect(init.headers).not.toHaveProperty("Authorization");
  });

  it("sends a FormData as multipart, without a JSON content type", async () => {
    const fetchImpl = vi.fn(async () => json(201, {}));
    const { api } = client(fetchImpl as unknown as typeof fetch);
    const form = new FormData();
    form.append("file", "x");
    await api.call("/api/documents", { method: "POST", body: form });
    const init = (fetchImpl.mock.calls[0] as unknown as [string, RequestInit])[1];
    expect(init.body).toBe(form);
    expect(init.headers).not.toHaveProperty("Content-Type");
  });

  it("gives the address and the headers of a request that is not JSON", async () => {
    const { api } = client((async () => json(200, {})) as typeof fetch);
    expect(api.url("/api/x")).toBe("https://api.example.com/api/x");
    expect(await api.authHeaders()).toEqual({ Authorization: "Bearer tok", "Accept-Language": "fr-CA" });
    expect(await client((async () => json(200, {})) as typeof fetch, null).api.authHeaders()).toEqual({ "Accept-Language": "fr-CA" });
  });

  it("throws an ApiError carrying the status and the body", async () => {
    const { api } = client((async () => json(409, { error: "taken", code: "x" })) as typeof fetch);
    await expect(api.call("/x")).rejects.toMatchObject({ name: "ApiError", status: 409, message: "taken", body: { code: "x" } });
  });

  it("names the status when the body has no error, and survives a body that is not JSON", async () => {
    const { api } = client((async () => new Response("<html>", { status: 502 })) as typeof fetch);
    const error = await api.call("/x").catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).message).toBe("HTTP 502");
  });

  it("drops the session and tells the app on a 401 with a token", async () => {
    const { api, session } = client((async () => json(401, {})) as typeof fetch);
    const signedOut = vi.fn();
    api.setSignedOutHandler(signedOut);
    await expect(api.call("/x")).rejects.toBeInstanceOf(ApiError);
    expect(signedOut).toHaveBeenCalledOnce();
    expect(await session.readToken()).toBeNull();
  });

  it("keeps a 401 without a token as a plain refusal (a wrong password)", async () => {
    const { api } = client((async () => json(401, { error: "bad" })) as typeof fetch, null);
    const signedOut = vi.fn();
    api.setSignedOutHandler(signedOut);
    await expect(api.call("/x")).rejects.toMatchObject({ status: 401 });
    expect(signedOut).not.toHaveBeenCalled();
  });

  it("does not need a signed-out handler", async () => {
    const { api } = client((async () => json(401, {})) as typeof fetch);
    await expect(api.call("/x")).rejects.toMatchObject({ status: 401 });
  });

  it("fails like a network error when the server does not answer in time", async () => {
    const hang = ((_: string, init: RequestInit) => new Promise((_, reject) => init.signal?.addEventListener("abort", () => reject(new DOMException("aborted", "AbortError"))))) as unknown as typeof fetch;
    const { api } = client(hang, "tok", 10);
    await expect(api.call("/x")).rejects.toThrow(new TypeError("Yomizaka did not answer in time"));
  });

  it("rejects as cancelled when the caller aborts", async () => {
    const hang = ((_: string, init: RequestInit) => new Promise((_, reject) => init.signal?.addEventListener("abort", () => reject(new DOMException("aborted", "AbortError"))))) as unknown as typeof fetch;
    const { api } = client(hang, "tok", 1000);
    const caller = new AbortController();
    const pending = api.call("/x", { signal: caller.signal });
    setTimeout(() => caller.abort(), 5);
    await expect(pending).rejects.toMatchObject({ name: "AbortError" });
  });
});
