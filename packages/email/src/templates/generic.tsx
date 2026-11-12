import { z } from "zod";

import { Button, Code, FallbackLink, Heading, Signature, Text } from "../components";
import { useEmail } from "../context";
import type { EmailTranslator } from "../messages";
import { baseSchema, httpsUrl, line, text } from "../schema";
import { defineTemplate } from "../template";
import { BRAND_NAMES } from "../theme";

/** « 1 minute » / « 10 minutes », in the reader's language. */
const sayMinutes = (n: number, t: EmailTranslator) => t("verificationCode.minutes", { count: n });

/**
 * A one-time code (6 digits), its life in minutes and, when it helps, what it is for. The code is shown with the
 * `Code` component; whoever did not ask ignores the email and nothing happens.
 */
export const verificationCode = defineTemplate({
  category: "transactional",
  schema: baseSchema.extend({
    /** Exactly 6 ASCII digits. */
    code: z.string().regex(/^\d{6}$/),
    ttlMinutes: z.number().int().min(1).max(60),
    /** What the code is for, one line (« Confirm your sign-in »). */
    purpose: line(120).optional(),
  }),
  subject: (p, t) => t("verificationCode.subject", { brand: BRAND_NAMES[p.brand], code: p.code }),
  preheader: (p, t) => t("verificationCode.preheader", { duration: sayMinutes(p.ttlMinutes, t) }),
  why: (_p, t) => t("verificationCode.why"),
  Body: (p) => {
    const { t, theme } = useEmail();
    return (
      <>
        <Heading>{t("verificationCode.heading", { brand: theme.name })}</Heading>
        {p.purpose ? <Text>{p.purpose}</Text> : null}
        <Code>{p.code}</Code>
        <Text>{t("verificationCode.body", { duration: sayMinutes(p.ttlMinutes, t) })}</Text>
        <Text muted small>
          {t("verificationCode.ignore")}
        </Text>
        <Signature />
      </>
    );
  },
  example: { code: "482913", ttlMinutes: 10 },
});

/**
 * A short notification the caller words: a title (the subject), a line and, optionally, one https action. Every
 * caller string is escaped; the template adds no product vocabulary.
 */
export const notification = defineTemplate({
  category: "transactional",
  schema: baseSchema
    .extend({
      title: line(120),
      line: text(500),
      actionLabel: line(60).optional(),
      actionUrl: httpsUrl.optional(),
    })
    .superRefine((p, ctx) => {
      if (p.actionLabel && !p.actionUrl) ctx.addIssue({ code: "custom", path: ["actionUrl"], message: "required with actionLabel" });
      if (p.actionUrl && !p.actionLabel) ctx.addIssue({ code: "custom", path: ["actionLabel"], message: "required with actionUrl" });
    }),
  subject: (p) => p.title,
  preheader: (p) => p.line.replace(/\s+/g, " ").slice(0, 140),
  why: (_p, t) => t("notification.why"),
  Body: (p) => {
    const { t, theme } = useEmail();
    return (
      <>
        <Heading>{p.title}</Heading>
        <Text>{p.line}</Text>
        {p.actionUrl && p.actionLabel ? (
          <>
            <Button href={p.actionUrl}>{p.actionLabel}</Button>
            <FallbackLink href={p.actionUrl} />
          </>
        ) : null}
        <Text muted small>
          {t("notification.about", { brand: theme.name })}
        </Text>
        <Signature />
      </>
    );
  },
  example: { title: "Your export is ready", line: "The files you asked for are available for 7 days.", actionLabel: "Open the export", actionUrl: "https://www.example.com/exports/example" },
});
