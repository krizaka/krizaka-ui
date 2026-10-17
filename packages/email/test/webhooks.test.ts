import { createHmac } from "node:crypto";

import { describe, expect, it, vi } from "vitest";

import { handleMailgunWebhook, memorySuppression, verifyMailgunSignature } from "../src";

const KEY = "whsec-test";
const NOW = new Date("2026-10-16T12:00:00Z");
const sign = (timestamp: string, token = "tok123") => ({ timestamp, token, signature: createHmac("sha256", KEY).update(timestamp + token).digest("hex") });
const payload = (event: string, extra: Record<string, unknown> = {}, ts = String(NOW.getTime() / 1000)) => ({ signature: sign(ts), "event-data": { event, recipient: "Gone@Example.com", ...extra } });

describe("Mailgun webhooks", () => {
  it("verifies the signature, and refuses a forged, a replayed or a malformed one", () => {
    const now = NOW.getTime() / 1000;
    expect(verifyMailgunSignature(sign(String(now)), KEY, now)).toBe(true);
    expect(verifyMailgunSignature({ ...sign(String(now)), signature: "00".repeat(32) }, KEY, now)).toBe(false);
    expect(verifyMailgunSignature(sign(String(now - 3600)), KEY, now)).toBe(false);
    expect(verifyMailgunSignature(sign("abc"), KEY, now)).toBe(false);
    expect(verifyMailgunSignature({ timestamp: "", token: "", signature: "" }, KEY, now)).toBe(false);
    expect(verifyMailgunSignature({ ...sign(String(now)), signature: "zz" }, KEY, now)).toBe(false);
    expect(verifyMailgunSignature(sign(String(now)), "another-key", now)).toBe(false);
  });

  it.each([
    ["failed", { severity: "permanent" }, "bounce"],
    ["complained", {}, "complaint"],
    ["unsubscribed", {}, "unsubscribed"],
  ] as const)("suppresses on %s and tells the app", async (event, extra, reason) => {
    const suppression = memorySuppression();
    const onSuppress = vi.fn();
    const result = await handleMailgunWebhook(payload(event, extra), { signingKey: KEY, suppression, onSuppress, now: () => NOW });
    expect(result).toEqual({ ok: true, action: "suppressed", reason });
    expect(suppression.reasons.get("gone@example.com")).toBe(reason);
    expect(onSuppress).toHaveBeenCalledWith("gone@example.com", reason);
  });

  it("ignores what does not end a relationship: a soft failure, a delivery, an open", async () => {
    const suppression = memorySuppression();
    for (const [event, extra] of [["failed", { severity: "temporary" }], ["delivered", {}], ["opened", {}], ["failed", {}]] as const) {
      expect(await handleMailgunWebhook(payload(event, extra), { signingKey: KEY, suppression, now: () => NOW })).toEqual({ ok: true, action: "ignored" });
    }
    expect(suppression.reasons.size).toBe(0);
  });

  it("refuses a bad signature and a body that is not an event", async () => {
    const suppression = memorySuppression();
    const bad = { ...payload("complained"), signature: { ...sign("1"), signature: "ff" } };
    expect(await handleMailgunWebhook(bad, { signingKey: KEY, suppression, now: () => NOW })).toEqual({ ok: false, error: "signature" });
    expect(await handleMailgunWebhook(null, { signingKey: KEY, suppression, now: () => NOW })).toEqual({ ok: false, error: "signature" });
    expect(await handleMailgunWebhook({ signature: sign(String(NOW.getTime() / 1000)) }, { signingKey: KEY, suppression, now: () => NOW })).toEqual({ ok: false, error: "payload" });
    expect(await handleMailgunWebhook({ signature: sign(String(NOW.getTime() / 1000)), "event-data": { event: 1 } }, { signingKey: KEY, suppression, now: () => NOW })).toEqual({ ok: false, error: "payload" });
    expect(suppression.reasons.size).toBe(0);
  });
});
