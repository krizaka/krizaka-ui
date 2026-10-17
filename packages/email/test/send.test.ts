import { describe, expect, it, vi } from "vitest";

import { consoleLog, hashAddress, mailConfigured, type MailEnv,memoryIdempotency, memoryLog, memorySuppression, sendEmail, templates } from "../src";

const ENV: MailEnv = { MAIL_PROVIDER: "mailgun", MAIL_API_KEY: "key-test", MAIL_DOMAIN: "mg.example.com", MAIL_FROM: "Oussama, Krizaka Blog <blog@mg.example.com>" };
const ok = () => vi.fn(async (_url: string | URL | Request, _init?: RequestInit) => new Response(JSON.stringify({ id: "<20261016.abc@mg.example.com>", message: "Queued. Thank you." }), { status: 200 }));
const sent = (fetchMock: ReturnType<typeof ok>) => new URLSearchParams(String(fetchMock.mock.calls[0]![1]!.body));

describe("sendEmail", () => {
  it("posts the rendered email to the provider with the unsubscribe headers, no tracking, and the plain text", async () => {
    const fetch = ok();
    const log = memoryLog();
    const result = await sendEmail("newPost", templates.newPost.example, { to: "Reader@Example.com", locale: "fr", env: ENV, fetch, log, now: () => new Date("2026-10-16T12:00:00Z") });
    expect(result.status).toBe("sent");
    expect(result).toMatchObject({ messageId: "<20261016.abc@mg.example.com>" });
    const [url, init] = fetch.mock.calls[0]!;
    expect(url).toBe("https://api.mailgun.net/v3/mg.example.com/messages");
    expect((init!.headers as Record<string, string>).Authorization).toBe(`Basic ${Buffer.from("api:key-test").toString("base64")}`);
    const form = sent(fetch);
    expect(form.get("to")).toBe("reader@example.com");
    expect(form.get("from")).toBe(ENV.MAIL_FROM);
    expect(form.get("subject")).toContain("Nouveau sur le blogue Krizaka");
    expect(form.get("h:List-Unsubscribe")).toMatch(/^<https:\/\/blog\.krizaka\.com\/api\/newsletter\/unsubscribe/);
    expect(form.get("h:List-Unsubscribe-Post")).toBe("List-Unsubscribe=One-Click");
    expect(form.get("o:tracking")).toBe("no");
    expect(form.get("text")).toContain("Lire le billet");
    expect(form.get("html")).toContain("<!DOCTYPE");
    expect(log.entries).toEqual([{ at: "2026-10-16T12:00:00.000Z", template: "newPost", category: "marketing", locale: "fr", to: hashAddress("reader@example.com"), status: "sent", messageId: "<20261016.abc@mg.example.com>", idempotencyKey: undefined }]);
    expect(JSON.stringify(log.entries)).not.toContain("reader@example.com");
  });

  it("marks a test: subject prefix and tag", async () => {
    const fetch = ok();
    await sendEmail("newsletterConfirm", templates.newsletterConfirm.example, { to: "qa+x@example.com", locale: "en", env: ENV, fetch, testLabel: "Krizaka QA" });
    const form = sent(fetch);
    expect(form.get("subject")).toBe("[test Krizaka QA] Confirm your subscription to the Krizaka blog");
    expect(form.get("o:tag")).toBe("test");
    expect(form.get("h:List-Unsubscribe")).toBeNull();
  });

  it("sets Reply-To, the EU API and a default sender", async () => {
    const fetch = ok();
    await sendEmail("contactAutoreply", templates.contactAutoreply.example, { to: "a@example.com", locale: "fr", env: { MAIL_API_KEY: "k", MAIL_DOMAIN: "mg.example.com", MAIL_API_URL: "https://api.eu.mailgun.net/" }, fetch, replyTo: "contact@krizaka.com" });
    expect(fetch.mock.calls[0]![0]).toBe("https://api.eu.mailgun.net/v3/mg.example.com/messages");
    const form = sent(fetch);
    expect(form.get("h:Reply-To")).toBe("contact@krizaka.com");
    expect(form.get("from")).toBe("Krizaka <contact@mg.example.com>");
  });

  it("never mails a suppressed address — except the team", async () => {
    const fetch = ok();
    const suppression = memorySuppression();
    suppression.add("Bounced@example.com", "bounce");
    const log = memoryLog();
    const r = await sendEmail("newsletterConfirm", templates.newsletterConfirm.example, { to: "bounced@example.com", locale: "en", env: ENV, fetch, suppression, log });
    expect(r.status).toBe("suppressed");
    expect(fetch).not.toHaveBeenCalled();
    expect(log.entries[0]).toMatchObject({ status: "suppressed" });
    suppression.add("team@krizaka.com", "bounce");
    const internal = await sendEmail("contactNotification", templates.contactNotification.example, { to: "team@krizaka.com", locale: "en", env: ENV, fetch, suppression });
    expect(internal.status).toBe("sent");
  });

  it("sends once per idempotency key, and gives the key back when the send fails", async () => {
    const fetch = ok();
    const idempotency = memoryIdempotency();
    const log = memoryLog();
    const opts = { to: "a@example.com", locale: "en", env: ENV, idempotency, log, idempotencyKey: "confirm:abc" } as const;
    expect((await sendEmail("newsletterConfirm", templates.newsletterConfirm.example, { ...opts, fetch })).status).toBe("sent");
    expect((await sendEmail("newsletterConfirm", templates.newsletterConfirm.example, { ...opts, fetch })).status).toBe("duplicate");
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(sent(fetch).get("h:X-Krizaka-Idempotency-Key")).toBe("confirm:abc");

    const down = vi.fn(async () => new Response("no", { status: 503 }));
    const retry = { ...opts, idempotencyKey: "confirm:def" };
    expect(await sendEmail("newsletterConfirm", templates.newsletterConfirm.example, { ...retry, fetch: down })).toMatchObject({ status: "failed", error: "provider-503" });
    expect((await sendEmail("newsletterConfirm", templates.newsletterConfirm.example, { ...retry, fetch })).status).toBe("sent");
    expect(log.entries.map((e) => e.status)).toEqual(["sent", "duplicate", "failed", "sent"]);
  });

  it("fails closed when nothing is configured, and on a network error", async () => {
    const fetch = ok();
    expect(await sendEmail("newsletterConfirm", templates.newsletterConfirm.example, { to: "a@example.com", locale: "en", env: {}, fetch })).toMatchObject({ status: "failed", error: "not-configured" });
    expect(await sendEmail("newsletterConfirm", templates.newsletterConfirm.example, { to: "a@example.com", locale: "en", env: { MAIL_API_KEY: "unset", MAIL_DOMAIN: "x" }, fetch })).toMatchObject({ status: "failed" });
    const broken = vi.fn(async () => Promise.reject(new Error("ECONNRESET")));
    expect(await sendEmail("newsletterConfirm", templates.newsletterConfirm.example, { to: "a@example.com", locale: "en", env: ENV, fetch: broken })).toMatchObject({ status: "failed", error: "network" });
    expect(fetch).not.toHaveBeenCalled();
  });

  it("accepts a provider answer without an id", async () => {
    const fetch = vi.fn(async () => new Response("not json", { status: 200 }));
    expect(await sendEmail("newsletterConfirm", templates.newsletterConfirm.example, { to: "a@example.com", locale: "en", env: ENV, fetch })).toMatchObject({ status: "sent", messageId: undefined });
  });

  it("refuses an unusable recipient (a programming error, not a delivery problem)", async () => {
    await expect(sendEmail("newsletterConfirm", templates.newsletterConfirm.example, { to: "a@b.com\r\nBcc: x@y.com", locale: "en", env: ENV })).rejects.toThrow(RangeError);
  });

  it("reads process.env by default and knows what « configured » means", async () => {
    expect(mailConfigured(ENV)).toBe(true);
    expect(mailConfigured({ ...ENV, MAIL_PROVIDER: "other" })).toBe(false);
    expect(mailConfigured({ MAIL_API_KEY: "k" })).toBe(false);
    const fetch = ok();
    expect(await sendEmail("newsletterConfirm", templates.newsletterConfirm.example, { to: "a@example.com", locale: "en", fetch })).toMatchObject({ status: "failed", error: "not-configured" });
  });

  it("logs one JSON line per email on the console", () => {
    const lines: string[] = [];
    consoleLog((l) => lines.push(l)).record({ at: "t", template: "newPost", category: "marketing", locale: "en", to: "abc", status: "sent" });
    expect(JSON.parse(lines[0]!)).toMatchObject({ event: "email.delivery", template: "newPost", to: "abc" });
    expect(() => consoleLog().record({ at: "t", template: "x", category: "internal", locale: "en", to: "z", status: "sent" })).not.toThrow();
  });
});
