import { z } from "zod";

import { Button, Facts, Heading, Multiline, Quote, Signature, Text } from "../components";
import { useEmail } from "../context";
import { EMAIL_LOCALES } from "../messages";
import { baseSchema, line, text } from "../schema";
import { defineTemplate } from "../template";

/** How much of the visitor's own message is echoed back: enough to recognise it, never a copy of a long text. */
// @fixed: the length of an echo in an auto-reply, an editorial choice about the email's size
const ECHO_MAX = 1200;
const echo = (message: string) => (message.length > ECHO_MAX ? `${message.slice(0, ECHO_MAX).trimEnd()}…` : message);

/** The visitor's confirmation: we got it, here is what you wrote. */
export const contactAutoreply = defineTemplate({
  category: "transactional",
  schema: baseSchema.extend({ name: line(120), message: text(5000) }),
  subject: (_p, t) => t("contactAutoreply.subject"),
  preheader: (_p, t) => t("contactAutoreply.preheader"),
  why: (_p, t) => t("contactAutoreply.why"),
  Body: (p) => {
    const { t } = useEmail();
    return (
      <>
        <Heading>{t("contactAutoreply.heading")}</Heading>
        <Text>{t("common.helloName", { name: p.name })}</Text>
        <Text>{t("contactAutoreply.body")}</Text>
        <Text muted small>
          {t("contactAutoreply.yourMessage")}
        </Text>
        <Quote>
          <Multiline text={echo(p.message)} />
        </Quote>
        <Button href={t("common.links.site")}>{t("contactAutoreply.button")}</Button>
        <Signature />
      </>
    );
  },
  example: { name: "Camille Tremblay", message: "Bonjour,\nNous cherchons une IA hébergée au Québec pour nos documents.\nPouvez-vous nous appeler cette semaine ?" },
});

/** The team's notification: every field of the form, and a reply button. For people at Krizaka, never for a customer. */
export const contactNotification = defineTemplate({
  category: "internal",
  schema: baseSchema.extend({
    name: line(120),
    email: z.email().max(200),
    company: line(160).optional(),
    topic: line(60),
    timeline: line(60).optional(),
    language: z.enum(EMAIL_LOCALES),
    source: line(60).optional(),
    message: text(5000),
  }),
  subject: (p, t) => t("contactNotification.subject", { topic: p.topic, name: p.name }),
  preheader: (p, t) => t("contactNotification.preheader", { name: p.name }),
  why: (_p, t) => t("contactNotification.why"),
  Body: (p) => {
    const { t } = useEmail();
    const none = t("contactNotification.none");
    const reply = `mailto:${p.email}?subject=${encodeURIComponent(`Re: ${p.topic}`)}`;
    return (
      <>
        <Heading>{t("contactNotification.heading")}</Heading>
        <Facts
          rows={[
            [t("contactNotification.name"), p.name],
            [t("contactNotification.email"), p.email],
            [t("contactNotification.company"), p.company ?? none],
            [t("contactNotification.topic"), p.topic],
            [t("contactNotification.timeline"), p.timeline ?? none],
            [t("contactNotification.language"), p.language],
            [t("contactNotification.source"), p.source ?? none],
            [t("contactNotification.message"), p.message],
          ]}
        />
        <Button href={reply}>{t("contactNotification.button", { name: p.name })}</Button>
      </>
    );
  },
  example: { name: "Camille Tremblay", email: "camille@example.com", company: "Cabinet Tremblay", topic: "Orazaka", timeline: "This quarter", language: "fr", source: "orazaka", message: "Bonjour,\nNous cherchons une IA hébergée au Québec pour nos documents." },
});
