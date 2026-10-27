import { z } from "zod";

import { Button, FallbackLink, Heading, Quote, Signature, Text } from "../components";
import { useEmail } from "../context";
import { baseSchema, httpsUrl, line, text } from "../schema";
import { defineTemplate } from "../template";
import { BRAND_NAMES } from "../theme";

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

/** `2026-11-03` said in the reader's language (UTC: the day does not move with the server). */
function sayDate(iso: string, locale: string) {
  return new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${iso}T00:00:00Z`));
}

/**
 * A read-only link shared by a person (a manager sends a report to an owner): who shares, the link, when it stops
 * working, and an optional note. It never carries the shared content; the product is the brand it wears.
 */
export const shareLink = defineTemplate({
  category: "transactional",
  schema: baseSchema.extend({
    /** The display name of the person who shares. */
    senderName: line(80),
    shareUrl: httpsUrl,
    /** The last day the link works (`YYYY-MM-DD`). */
    expiresOn: isoDate,
    /** A short note from the sender: plain text, escaped, never shown as markup. */
    message: text(500).optional(),
  }),
  subject: (p, t) => t("shareLink.subject", { name: p.senderName, brand: BRAND_NAMES[p.brand] }),
  preheader: (p, t) => t("shareLink.preheader", { name: p.senderName, date: sayDate(p.expiresOn, t("common.dateLocale")) }),
  why: (p, t) => t("shareLink.why", { name: p.senderName }),
  Body: (p) => {
    const { t, theme } = useEmail();
    return (
      <>
        <Heading>{t("shareLink.heading", { name: p.senderName })}</Heading>
        <Text>{t("shareLink.body", { name: p.senderName, brand: theme.name })}</Text>
        {p.message ? <Quote>{p.message}</Quote> : null}
        <Button href={p.shareUrl}>{t("shareLink.button")}</Button>
        <FallbackLink href={p.shareUrl} />
        <Text muted small>
          {t("shareLink.expiry", { date: sayDate(p.expiresOn, t("common.dateLocale")) })}
        </Text>
        <Text muted small>
          {t("shareLink.ignore")}
        </Text>
        <Signature />
      </>
    );
  },
  example: { senderName: "Samir Tremblay", shareUrl: "https://www.example.com/share/example", expiresOn: "2026-11-03", message: "Here is the verification report for the 12 Rue Example unit. <b>No action needed</b> before Friday." },
});
