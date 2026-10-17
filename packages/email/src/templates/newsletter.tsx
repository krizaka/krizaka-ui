import { z } from "zod";

import { Button, FallbackLink, Heading, PostPreview, Signature, Text } from "../components";
import { useEmail } from "../context";
import { baseSchema, httpsUrl, line } from "../schema";
import { defineTemplate } from "../template";

const hours = z.number().int().min(1).max(168).default(48);

/** The double opt-in: one button, the link small underneath, nothing recorded until it is clicked. */
export const newsletterConfirm = defineTemplate({
  category: "transactional",
  schema: baseSchema.extend({ confirmUrl: httpsUrl, hours }),
  subject: (_p, t) => t("newsletterConfirm.subject"),
  preheader: (p, t) => t("newsletterConfirm.preheader", { hours: p.hours }),
  why: (_p, t) => t("newsletterConfirm.why"),
  Body: (p) => {
    const { t } = useEmail();
    return (
      <>
        <Heading>{t("newsletterConfirm.heading")}</Heading>
        <Text>{t("common.hello")}</Text>
        <Text>{t("newsletterConfirm.body")}</Text>
        <Button href={p.confirmUrl}>{t("newsletterConfirm.button")}</Button>
        <Text muted small>
          {t("newsletterConfirm.expiry", { hours: p.hours })}
        </Text>
        <FallbackLink href={p.confirmUrl} />
        <Text muted small>
          {t("newsletterConfirm.ignore")}
        </Text>
        <Signature />
      </>
    );
  },
  example: { confirmUrl: "https://blog.krizaka.com/api/newsletter/confirm?t=eyJleGFtcGxlIjoidG9rZW4ifQ.c2lnbmF0dXJl" },
});

/** After the click: thanks, what to expect, a way into the blog. */
export const newsletterWelcome = defineTemplate({
  category: "marketing",
  schema: baseSchema.extend({ blogUrl: httpsUrl.optional() }),
  subject: (_p, t) => t("newsletterWelcome.subject"),
  preheader: (_p, t) => t("newsletterWelcome.preheader"),
  why: (_p, t) => t("newsletterWelcome.why"),
  Body: (p) => {
    const { t } = useEmail();
    return (
      <>
        <Heading>{t("newsletterWelcome.heading")}</Heading>
        <Text>{t("newsletterWelcome.body")}</Text>
        <Button href={p.blogUrl ?? t("common.links.blog")}>{t("newsletterWelcome.button")}</Button>
        <Signature />
      </>
    );
  },
  example: { unsubscribeUrl: "https://blog.krizaka.com/api/newsletter/unsubscribe?t=example" },
});

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

/** A new post: title, cover, excerpt and « Read the post ». */
export const newPost = defineTemplate({
  category: "marketing",
  schema: baseSchema.extend({
    title: line(200),
    excerpt: line(500),
    url: httpsUrl,
    coverUrl: httpsUrl.optional(),
    coverAlt: line(200).optional(),
    /** The day the person confirmed (`YYYY-MM-DD`): the proof of consent, said in the footer. */
    consentedOn: isoDate.optional(),
  }),
  subject: (p, t) => t("newPost.subject", { title: p.title }),
  preheader: (p, t) => t("newPost.preheader", { excerpt: p.excerpt }),
  why: (p, t) => (p.consentedOn ? t("newPost.whyOn", { date: new Intl.DateTimeFormat(t("common.dateLocale"), { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${p.consentedOn}T00:00:00Z`)) }) : t("newPost.why")),
  Body: (p) => {
    const { t } = useEmail();
    return (
      <>
        <PostPreview eyebrow={t("newPost.eyebrow")} title={p.title} excerpt={p.excerpt} coverUrl={p.coverUrl} coverAlt={p.coverAlt ?? p.title} />
        <Button href={p.url}>{t("newPost.button")}</Button>
        <FallbackLink href={p.url} />
        <Signature />
      </>
    );
  },
  example: {
    title: "Why we keep your data in Montréal",
    excerpt: "A short, true story about where the servers are, who can read what, and what it costs us to keep it that way.",
    url: "https://blog.krizaka.com/posts/why-montreal",
    coverUrl: "https://krizaka-assets.b-cdn.net/brand/krizaka/social-preview-1280x640.png",
    coverAlt: "The Krizaka mark on a dark background",
    consentedOn: "2026-10-01",
    unsubscribeUrl: "https://blog.krizaka.com/api/newsletter/unsubscribe?t=example",
  },
});

/** The last email: confirmation of the unsubscription, and a way back. */
export const newsletterUnsubscribed = defineTemplate({
  category: "transactional",
  schema: baseSchema.extend({ resubscribeUrl: httpsUrl.optional() }),
  subject: (_p, t) => t("newsletterUnsubscribed.subject"),
  preheader: (_p, t) => t("newsletterUnsubscribed.preheader"),
  why: (_p, t) => t("newsletterUnsubscribed.why"),
  Body: (p) => {
    const { t } = useEmail();
    return (
      <>
        <Heading>{t("newsletterUnsubscribed.heading")}</Heading>
        <Text>{t("newsletterUnsubscribed.body")}</Text>
        <Text muted>{t("newsletterUnsubscribed.changedMind")}</Text>
        <Button href={p.resubscribeUrl ?? `${t("common.links.blog")}newsletter/`}>{t("newsletterUnsubscribed.button")}</Button>
        <Signature />
      </>
    );
  },
  example: {},
});
