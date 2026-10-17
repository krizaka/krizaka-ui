import { createHash } from "node:crypto";

import type { EmailCategory } from "./template";

/** One line of the delivery log: what was sent, to whom (a hash, never the address), and how it went. */
export interface DeliveryLogEntry {
  /** When (ISO), if the caller gave a clock. */
  at?: string;
  template: string;
  category: EmailCategory;
  locale: string;
  /** A short hash of the recipient: enough to correlate with a complaint, nothing to leak (Loi 25). */
  to: string;
  status: "sent" | "failed" | "suppressed" | "duplicate";
  /** The provider's message id, when it accepted the message. */
  messageId?: string | undefined;
  idempotencyKey?: string | undefined;
  /** A reason, never a body: the provider's status or `suppressed:<reason>`. */
  detail?: string | undefined;
}

/** Where the log goes: the app's database, a stream, a file. The package only asks for `record`. */
export interface DeliveryLog {
  record(entry: DeliveryLogEntry): void | Promise<void>;
}

/** The addresses that must never be mailed again: hard bounces, complaints, unsubscribes reported by the provider. */
export interface SuppressionList {
  has(email: string): boolean | Promise<boolean>;
  add(email: string, reason: SuppressionReason): void | Promise<void>;
}

export type SuppressionReason = "bounce" | "complaint" | "unsubscribed";

/** Remembers which idempotency keys were already used, so a retry or a double click never sends twice. */
export interface IdempotencyStore {
  /** True the first time a key is claimed, false after. */
  claim(key: string): boolean | Promise<boolean>;
  /** Gives the key back (the send failed: a retry must be able to go). */
  release(key: string): void | Promise<void>;
}

export const normalizeAddress = (email: string) => email.trim().toLowerCase();

/** A short, stable hash of an address, for logs. */
export const hashAddress = (email: string) => createHash("sha256").update(normalizeAddress(email)).digest("hex").slice(0, 12);

export function memoryLog(): DeliveryLog & { entries: DeliveryLogEntry[] } {
  const entries: DeliveryLogEntry[] = [];
  return { entries, record: (entry) => void entries.push(entry) };
}

/** One JSON line per email on the standard output: what DigitalOcean and every log drain keep. */
export function consoleLog(write: (line: string) => void = (line) => console.log(line)): DeliveryLog {
  return { record: (entry) => write(JSON.stringify({ event: "email.delivery", ...entry })) };
}

export function memorySuppression(): SuppressionList & { reasons: Map<string, SuppressionReason> } {
  const reasons = new Map<string, SuppressionReason>();
  return { reasons, has: (email) => reasons.has(normalizeAddress(email)), add: (email, reason) => void reasons.set(normalizeAddress(email), reason) };
}

export function memoryIdempotency(): IdempotencyStore {
  const used = new Set<string>();
  return {
    claim: (key) => (used.has(key) ? false : (used.add(key), true)),
    release: (key) => void used.delete(key),
  };
}
