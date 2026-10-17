import { type DeliveryLog, hashAddress, type IdempotencyStore, normalizeAddress, type SuppressionList } from "./delivery";
import type { EmailLocale } from "./messages";
import { type RenderedEmail, renderEmail, type TemplateProps } from "./render";
import type { TemplateId } from "./templates";

/** The `MAIL_*` variables (bounded context MAIL): the provider is a value, `mailgun` today. */
export interface MailEnv {
  MAIL_PROVIDER?: string | undefined;
  MAIL_API_KEY?: string | undefined;
  MAIL_DOMAIN?: string | undefined;
  MAIL_API_URL?: string | undefined;
  MAIL_FROM?: string | undefined;
}

export interface SendEmailOptions {
  to: string;
  locale: EmailLocale;
  /** One key per intention (`confirm:<email>:<day>`): a second call with it sends nothing. Needs `idempotency`. */
  idempotencyKey?: string;
  replyTo?: string;
  /** Marks a test: the subject starts with `[test <label>]` and the provider tags it. */
  testLabel?: string;
  /** Defaults to `process.env`. */
  env?: MailEnv;
  fetch?: typeof fetch;
  log?: DeliveryLog;
  suppression?: SuppressionList;
  idempotency?: IdempotencyStore;
  /** Where the brand marks are hosted. */
  cdn?: string;
  /** The clock, for the log's timestamp (without it an entry has no `at`: the log drain stamps it). */
  now?: () => Date;
}

export type SendResult =
  | { status: "sent"; messageId: string | undefined; email: RenderedEmail }
  | { status: "suppressed" | "duplicate"; email: RenderedEmail }
  | { status: "failed"; error: string; email: RenderedEmail };

const configured = (v: string | undefined): v is string => typeof v === "string" && v.trim() !== "" && v.trim() !== "unset";
const EMAIL = /^[^\s@<>()",;:]+@[^\s@<>()",;:]+\.[^\s@<>()",;:]{2,}$/;

/** The sender is configured when the key, the domain and the sender address are all set (fail closed). */
export function mailConfigured(env: MailEnv): boolean {
  return (env.MAIL_PROVIDER === undefined || env.MAIL_PROVIDER.trim().toLowerCase() === "mailgun") && configured(env.MAIL_API_KEY) && configured(env.MAIL_DOMAIN);
}

/** The form fields of Mailgun's `POST /v3/{domain}/messages`. Exported for the tests and for apps that post themselves. */
export function mailgunForm(email: RenderedEmail, o: { from: string; to: string; replyTo?: string | undefined; idempotencyKey?: string | undefined; testLabel?: string | undefined }): URLSearchParams {
  const subject = o.testLabel ? `[test ${o.testLabel.replace(/[\r\n]+/g, " ").slice(0, 40)}] ${email.subject}` : email.subject;
  const form = new URLSearchParams({ from: o.from, to: o.to, subject, text: email.text, html: email.html, "o:tracking": "no", "o:tag": o.testLabel ? "test" : email.template, "h:X-Krizaka-Template": email.template });
  for (const [name, value] of Object.entries(email.headers)) form.set(`h:${name}`, value);
  if (o.replyTo) form.set("h:Reply-To", o.replyTo);
  if (o.idempotencyKey) form.set("h:X-Krizaka-Idempotency-Key", o.idempotencyKey);
  return form;
}

/**
 * Renders a template and sends it through the `MAIL_*` provider. Adds the unsubscribe headers, refuses a suppressed
 * address (bounced, complained, unsubscribed), sends once per idempotency key, and logs the outcome. Never throws for a
 * delivery problem: the result says `failed`. It throws for a programming error (invalid props, unusable address).
 */
export async function sendEmail<K extends TemplateId>(id: K, props: TemplateProps<K>, options: SendEmailOptions): Promise<SendResult> {
  const env: MailEnv = options.env ?? (process.env as MailEnv);
  const to = normalizeAddress(options.to);
  if (!EMAIL.test(to) || to.length > 254) throw new RangeError("@krizaka/email: the recipient is not an e-mail address");
  const email = await renderEmail(id, props, { locale: options.locale, ...(options.cdn ? { cdn: options.cdn } : {}) });
  const { log, suppression, idempotency, idempotencyKey } = options;
  const entry = (status: "sent" | "failed" | "suppressed" | "duplicate", extra: { messageId?: string | undefined; detail?: string | undefined } = {}) =>
    log?.record({ ...(options.now ? { at: options.now().toISOString() } : {}), template: id, category: email.category, locale: options.locale, to: hashAddress(to), status, idempotencyKey, ...extra });

  if (email.category !== "internal" && suppression && (await suppression.has(to))) {
    await entry("suppressed", { detail: "suppressed" });
    return { status: "suppressed", email };
  }
  if (idempotencyKey && idempotency && !(await idempotency.claim(idempotencyKey))) {
    await entry("duplicate");
    return { status: "duplicate", email };
  }
  const fail = async (error: string): Promise<SendResult> => {
    if (idempotencyKey && idempotency) await idempotency.release(idempotencyKey);
    await entry("failed", { detail: error });
    return { status: "failed", error, email };
  };
  if (!mailConfigured(env)) return fail("not-configured");

  const base = (configured(env.MAIL_API_URL) ? env.MAIL_API_URL.trim() : "https://api.mailgun.net").replace(/\/$/, "");
  const from = configured(env.MAIL_FROM) ? env.MAIL_FROM.trim() : `Krizaka <contact@${env.MAIL_DOMAIN}>`;
  const form = mailgunForm(email, { from, to, replyTo: options.replyTo, idempotencyKey, testLabel: options.testLabel });
  try {
    const res = await (options.fetch ?? fetch)(`${base}/v3/${env.MAIL_DOMAIN}/messages`, {
      method: "POST",
      headers: { Authorization: `Basic ${Buffer.from(`api:${env.MAIL_API_KEY}`).toString("base64")}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
    });
    if (!res.ok) return fail(`provider-${res.status}`);
    const body = (await res.json().catch(() => ({}))) as { id?: unknown };
    const messageId = typeof body.id === "string" ? body.id : undefined;
    await entry("sent", { messageId });
    return { status: "sent", messageId, email };
  } catch {
    return fail("network");
  }
}
