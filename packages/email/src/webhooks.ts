import { createHmac, timingSafeEqual } from "node:crypto";

import { type DeliveryLog, normalizeAddress, type SuppressionList, type SuppressionReason } from "./delivery";

/** Mailgun signs each webhook: HMAC-SHA256 of `timestamp + token` with the webhook signing key, in hex. */
export interface MailgunSignature {
  timestamp: string;
  token: string;
  signature: string;
}

/** How old a webhook may be before it is refused as a replay. */
// @fixed: Mailgun's own guidance for webhook replay protection is a few minutes
export const WEBHOOK_MAX_AGE_SECONDS = 15 * 60;

/** `nowSeconds` is the clock, injected (the replay window is measured against it). */
export function verifyMailgunSignature({ timestamp, token, signature }: MailgunSignature, signingKey: string, nowSeconds: number): boolean {
  if (![timestamp, token, signature].every((v) => typeof v === "string" && v.length > 0 && v.length < 512)) return false;
  const age = Math.abs(nowSeconds - Number(timestamp));
  if (!Number.isFinite(age) || age > WEBHOOK_MAX_AGE_SECONDS) return false;
  const expected = createHmac("sha256", signingKey).update(timestamp + token).digest();
  const given = Buffer.from(signature, "hex");
  return given.length === expected.length && timingSafeEqual(given, expected);
}

export interface WebhookOptions {
  signingKey: string;
  suppression: SuppressionList;
  log?: DeliveryLog;
  /** Called after an address is suppressed — remove it from your own list there (the blog deletes the subscriber). */
  onSuppress?: (email: string, reason: SuppressionReason) => void | Promise<void>;
  /** The clock, injected: a webhook older than the replay window is refused. */
  now: () => Date;
}

export type WebhookResult = { ok: true; action: "suppressed" | "ignored"; reason?: SuppressionReason } | { ok: false; error: "signature" | "payload" };

/** What the events mean for the list: a permanent failure, a complaint or an unsubscribe suppresses; a soft failure does not. */
function reasonFor(event: string, severity: string | undefined): SuppressionReason | null {
  if (event === "complained") return "complaint";
  if (event === "unsubscribed") return "unsubscribed";
  if (event === "failed" && severity === "permanent") return "bounce";
  return null;
}

/** Handles one Mailgun webhook body (parsed JSON): verifies the signature, then feeds the suppression list. */
export async function handleMailgunWebhook(body: unknown, options: WebhookOptions): Promise<WebhookResult> {
  const b = (body ?? {}) as { signature?: MailgunSignature; "event-data"?: { event?: unknown; severity?: unknown; recipient?: unknown } };
  if (!b.signature || !verifyMailgunSignature(b.signature, options.signingKey, options.now().getTime() / 1000)) return { ok: false, error: "signature" };
  const data = b["event-data"];
  if (!data || typeof data.event !== "string" || typeof data.recipient !== "string") return { ok: false, error: "payload" };
  const reason = reasonFor(data.event, typeof data.severity === "string" ? data.severity : undefined);
  if (!reason) return { ok: true, action: "ignored" };
  const email = normalizeAddress(data.recipient);
  await options.suppression.add(email, reason);
  await options.onSuppress?.(email, reason);
  return { ok: true, action: "suppressed", reason };
}
