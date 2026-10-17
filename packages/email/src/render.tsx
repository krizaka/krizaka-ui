import { render } from "@react-email/render";
import { type ReactElement } from "react";
import type { z } from "zod";

import { Card,EmailShell, Footer, Header } from "./components";
import { type EmailContextValue, EmailProvider, type EmailSignature } from "./context";
import { type EmailLocale, i18n } from "./messages";
import { type EmailCategory, type TemplateDefinition } from "./template";
import { type TemplateId, templates } from "./templates";
import { getTheme } from "./theme";

/** A template's props, as the caller writes them (defaults not yet applied). */
export type TemplateProps<K extends TemplateId> = z.input<(typeof templates)[K]["schema"]>;

export interface RenderOptions {
  locale: EmailLocale;
  /** Where the brand marks are hosted (default: Krizaka's Bunny CDN). */
  cdn?: string;
}

export interface RenderedEmail {
  template: TemplateId;
  category: EmailCategory;
  locale: EmailLocale;
  subject: string;
  /** Email-safe HTML: tables, inline styles, a `<style>` for the dark scheme. */
  html: string;
  /** The plain-text alternative, always generated from the same tree. */
  text: string;
  /** `List-Unsubscribe` and `List-Unsubscribe-Post` when the email has an unsubscribe link. */
  headers: Record<string, string>;
}

/** The props did not pass the template's schema: say which fields, never the values. */
export class EmailValidationError extends Error {
  readonly fields: string[];
  constructor(template: string, fields: string[]) {
    super(`@krizaka/email: invalid props for "${template}": ${fields.join(", ")}`);
    this.name = "EmailValidationError";
    this.fields = fields;
  }
}

/** A subject is one line: control characters and line breaks (header injection) become a space. */
// eslint-disable-next-line no-control-regex -- the point of the rule is to refuse control characters
const oneLine = (s: string) => s.replace(/[\u0000-\u001f\u007f\u2028\u2029]+/g, " ").replace(/\s+/g, " ").trim();

/** RFC 8058: the two headers Gmail and Yahoo ask of bulk mail, and the mail client's own « unsubscribe » button. */
export function unsubscribeHeaders(url: string): Record<string, string> {
  return { "List-Unsubscribe": `<${url}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" };
}

/**
 * Validates the props (zod), then renders the template in a language and a brand: subject, HTML, plain text, headers.
 * Nothing the caller passes is rendered unescaped: React escapes the text, and URLs must be `https`.
 */
export async function renderEmail<K extends TemplateId>(id: K, props: TemplateProps<K>, options: RenderOptions): Promise<RenderedEmail> {
  const template = templates[id] as unknown as TemplateDefinition<z.ZodType<{ brand: "krizaka"; address?: string; signature?: EmailSignature; links?: { privacy?: string; contact?: string }; unsubscribeUrl?: string }>>;
  const parsed = template.schema.safeParse(props);
  if (!parsed.success) throw new EmailValidationError(id, [...new Set(parsed.error.issues.map((i) => i.path.join(".") || "(root)"))]);
  const p = parsed.data;
  if (template.category === "marketing" && !p.unsubscribeUrl) throw new EmailValidationError(id, ["unsubscribeUrl (required: this email is sent to a list)"]);

  const { locale } = options;
  const t = i18n.translator(locale);
  const theme = getTheme(p.brand, options.cdn);
  const signature = p.signature ?? (p.brand === "krizaka" ? { name: "Oussama", role: t("common.signatureFounder") } : { name: t("common.signatureTeam", { brand: theme.name }) });
  const context: EmailContextValue = {
    theme,
    locale,
    t,
    legal: { name: t("common.legalName"), address: p.address ?? t("common.address") },
    links: { site: t("common.links.site"), privacy: p.links?.privacy ?? t("common.links.privacy"), contact: p.links?.contact ?? t("common.links.contact") },
    signature,
    unsubscribeUrl: p.unsubscribeUrl,
    why: template.why(p, t),
  };
  const Body = template.Body;
  const tree: ReactElement = (
    <EmailProvider value={context}>
      <EmailShell preheader={template.preheader(p, t)}>
        <Header />
        <Card>
          <Body {...p} />
        </Card>
        <Footer />
      </EmailShell>
    </EmailProvider>
  );
  const [html, text] = await Promise.all([render(tree), render(tree, { plainText: true })]);
  return {
    template: id,
    category: template.category,
    locale,
    subject: oneLine(template.subject(p, t)),
    html,
    text,
    headers: p.unsubscribeUrl ? unsubscribeHeaders(p.unsubscribeUrl) : {},
  };
}
