import { z } from "zod";

import { Button, FallbackLink, Heading, Quote, Signature, Text } from "../components";
import { useEmail } from "../context";
import { baseSchema, httpsUrl, line, text } from "../schema";
import { defineTemplate } from "../template";
import { BRAND_NAMES } from "../theme";

/** The sign-in link: one use, short life. */
export const signInLink = defineTemplate({
  category: "transactional",
  schema: baseSchema.extend({ signInUrl: httpsUrl, minutes: z.number().int().min(1).max(1440).default(15) }),
  subject: (p, t) => t("signInLink.subject", { brand: BRAND_NAMES[p.brand] }),
  preheader: (p, t) => t("signInLink.preheader", { minutes: p.minutes }),
  why: (_p, t) => t("signInLink.why"),
  Body: (p) => {
    const { t, theme } = useEmail();
    return (
      <>
        <Heading>{t("signInLink.heading", { brand: theme.name })}</Heading>
        <Text>{t("signInLink.body", { minutes: p.minutes })}</Text>
        <Button href={p.signInUrl}>{t("signInLink.button")}</Button>
        <FallbackLink href={p.signInUrl} />
        <Text muted small>
          {t("signInLink.ignore")}
        </Text>
        <Signature />
      </>
    );
  },
  example: { signInUrl: "https://blog.krizaka.com/api/auth/signin?t=example" },
});

/** Someone answered your comment. */
export const commentReply = defineTemplate({
  category: "transactional",
  schema: baseSchema.extend({ replierName: line(80), postTitle: line(200), excerpt: text(600), url: httpsUrl }),
  subject: (p, t) => t("commentReply.subject", { name: p.replierName }),
  preheader: (p, t) => t("commentReply.preheader", { name: p.replierName, title: p.postTitle }),
  why: (_p, t) => t("commentReply.why"),
  Body: (p) => {
    const { t } = useEmail();
    return (
      <>
        <Heading>{t("commentReply.heading", { name: p.replierName })}</Heading>
        <Text muted small>
          {t("commentReply.under", { title: p.postTitle })}
        </Text>
        <Quote>{p.excerpt}</Quote>
        <Button href={p.url}>{t("commentReply.button")}</Button>
        <FallbackLink href={p.url} />
        <Signature />
      </>
    );
  },
  example: { replierName: "Samir", postTitle: "Why we keep your data in Montréal", excerpt: "Good point about the backups: where do they live, and who holds the keys?", url: "https://blog.krizaka.com/posts/why-montreal#comment-42" },
});

/** The deletion of an account asks for a confirmation: nothing is deleted before it. */
export const accountDeletion = defineTemplate({
  category: "transactional",
  schema: baseSchema.extend({ confirmUrl: httpsUrl, hours: z.number().int().min(1).max(168).default(24) }),
  subject: (p, t) => t("accountDeletion.subject", { brand: BRAND_NAMES[p.brand] }),
  preheader: (p, t) => t("accountDeletion.preheader", { hours: p.hours }),
  why: (_p, t) => t("accountDeletion.why"),
  Body: (p) => {
    const { t, theme } = useEmail();
    return (
      <>
        <Heading>{t("accountDeletion.heading")}</Heading>
        <Text>{t("accountDeletion.body", { brand: theme.name })}</Text>
        <Button href={p.confirmUrl}>{t("accountDeletion.button")}</Button>
        <Text muted small>
          {t("accountDeletion.expiry", { hours: p.hours })}
        </Text>
        <FallbackLink href={p.confirmUrl} />
        <Text muted small>
          {t("accountDeletion.ignore")}
        </Text>
        <Signature />
      </>
    );
  },
  example: { confirmUrl: "https://blog.krizaka.com/api/account/delete?t=example" },
});

/** The copy of a person's data is ready to download (Loi 25: access and portability). */
export const dataExport = defineTemplate({
  category: "transactional",
  schema: baseSchema.extend({ downloadUrl: httpsUrl, days: z.number().int().min(1).max(30).default(7) }),
  subject: (p, t) => t("dataExport.subject", { brand: BRAND_NAMES[p.brand] }),
  preheader: (p, t) => t("dataExport.preheader", { days: p.days }),
  why: (_p, t) => t("dataExport.why"),
  Body: (p) => {
    const { t } = useEmail();
    return (
      <>
        <Heading>{t("dataExport.heading")}</Heading>
        <Text>{t("dataExport.body", { days: p.days })}</Text>
        <Button href={p.downloadUrl}>{t("dataExport.button")}</Button>
        <FallbackLink href={p.downloadUrl} />
        <Signature />
      </>
    );
  },
  example: { downloadUrl: "https://blog.krizaka.com/api/account/export?t=example" },
});
