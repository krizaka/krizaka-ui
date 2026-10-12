import { describe, expect, it } from "vitest";

import { EXPO_PUSH_URL, isExpoPushToken, type PushMessage,sendExpoPush } from "../src/index";

const token = (n: number) => `ExponentPushToken[abcdefgh${n}]`;
const message = (n: number): PushMessage => ({ to: token(n), title: "New follower", body: "Ada follows you", data: { path: "/@ada" } });

describe("expo push", () => {
  it("recognises Expo tokens and nothing else", () => {
    expect(isExpoPushToken("ExponentPushToken[xxxxxxxxxxxxxxxx]")).toBe(true);
    expect(isExpoPushToken("ExpoPushToken[xxxxxxxxxxxxxxxx]")).toBe(true);
    expect(isExpoPushToken("fcm:abc")).toBe(false);
    expect(isExpoPushToken("ExponentPushToken[]")).toBe(false);
  });

  it("batches by 100, sends with the access token, and reports dead tokens", async () => {
    const calls: { url: string; body: unknown[]; auth?: string }[] = [];
    const fetch = async (url: string, init: { method: string; headers: Record<string, string>; body: string }) => {
      const body = JSON.parse(init.body) as PushMessage[];
      calls.push({ url, body, auth: init.headers.Authorization });
      return {
        ok: true,
        status: 200,
        json: async () => ({ data: body.map((m) => (m.to === token(3) ? { status: "error", details: { error: "DeviceNotRegistered" } } : { status: "ok", id: "t" })) }),
      };
    };
    const outcome = await sendExpoPush(Array.from({ length: 150 }, (_, i) => message(i)), { fetch, accessToken: "secret" });
    expect(calls).toHaveLength(2);
    expect(calls[0].url).toBe(EXPO_PUSH_URL);
    expect(calls[0].body).toHaveLength(100);
    expect(calls[0].auth).toBe("Bearer secret");
    expect(outcome.sent).toBe(149);
    expect(outcome.deadTokens).toEqual([token(3)]);
  });

  it("never throws: a network failure is an error in the outcome", async () => {
    const outcome = await sendExpoPush([message(1)], { fetch: async () => Promise.reject(new Error("offline")) });
    expect(outcome).toEqual({ sent: 0, deadTokens: [], errors: ["offline"] });
  });

  it("drops what is not an Expo token without calling the service", async () => {
    let called = false;
    const outcome = await sendExpoPush([{ ...message(1), to: "nope" }], { fetch: async () => ((called = true), { ok: true, status: 200, json: async () => ({}) }) });
    expect(called).toBe(false);
    expect(outcome.sent).toBe(0);
  });
});

describe("expo push — answers of the service", () => {
  const reply = (status: number, body: unknown, json = true) => async () => ({
    ok: status < 400,
    status,
    json: json ? async () => body : async () => Promise.reject(new SyntaxError("not json")),
  });

  it("reports an HTTP error with the service's messages, or without when it says nothing", async () => {
    const withMessages = await sendExpoPush([message(1)], { fetch: reply(429, { errors: [{ message: "too many" }, { message: "slow down" }] }) });
    expect(withMessages).toEqual({ sent: 0, deadTokens: [], errors: ["HTTP 429: too many; slow down"] });
    const bare = await sendExpoPush([message(1)], { fetch: reply(502, null, false) });
    expect(bare.errors).toEqual(["HTTP 502: "]);
  });

  it("reports ticket errors by message, by code, or as unknown — and an answer without tickets as nothing sent", async () => {
    const tickets = [{ status: "error", message: "Invalid credentials" }, { status: "error", details: { error: "MessageTooBig" } }, { status: "error" }];
    const outcome = await sendExpoPush([message(1), message(2), message(3)], { fetch: reply(200, { data: tickets }) });
    expect(outcome.errors).toEqual(["Invalid credentials", "MessageTooBig", "unknown push error"]);
    expect(await sendExpoPush([message(1)], { fetch: reply(200, {}) })).toEqual({ sent: 0, deadTokens: [], errors: [] });
  });

  it("sends no Authorization header without an access token, and keeps the caller's sound and channel", async () => {
    let headers: Record<string, string> = {};
    let body: unknown[] = [];
    await sendExpoPush([{ ...message(1), sound: null, channelId: "alerts" }], {
      fetch: async (_url, init) => {
        headers = init.headers;
        body = JSON.parse(init.body) as unknown[];
        return { ok: true, status: 200, json: async () => ({ data: [{ status: "ok" }] }) };
      },
    });
    expect(headers.Authorization).toBeUndefined();
    expect(body[0]).toMatchObject({ sound: null, channelId: "alerts" });
  });

  it("reports a thrown value that is not an Error", async () => {
    const outcome = await sendExpoPush([message(1)], { fetch: async () => Promise.reject("socket hang up") });
    expect(outcome.errors).toEqual(["socket hang up"]);
  });
});
