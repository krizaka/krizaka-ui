import { z } from "zod";

import { Button, FallbackLink, Heading, Signature, Text } from "../components";
import { useEmail } from "../context";
import { baseSchema, httpsUrl, line } from "../schema";
import { defineTemplate } from "../template";
import { BRAND_NAMES } from "../theme";

/** An invitation to create an account: sent by the product, never by a person; the link lives a number of days. */
export const signupInvitation = defineTemplate({
  category: "transactional",
  schema: baseSchema.extend({ inviteUrl: httpsUrl, days: z.number().int().min(1).max(30), allowance: line(120).optional() }),
  subject: (p, t) => t("signupInvitation.subject", { brand: BRAND_NAMES[p.brand] }),
  preheader: (p, t) => t("signupInvitation.preheader", { brand: BRAND_NAMES[p.brand] }),
  why: (p, t) => t("signupInvitation.why", { brand: BRAND_NAMES[p.brand] }),
  Body: (p) => {
    const { t, theme } = useEmail();
    return (
      <>
        <Heading>{t("signupInvitation.heading", { brand: theme.name })}</Heading>
        <Text>{t("signupInvitation.body", { brand: theme.name })}</Text>
        {p.allowance ? <Text>{p.allowance}</Text> : null}
        <Button href={p.inviteUrl}>{t("signupInvitation.button")}</Button>
        <Text muted small>
          {t("signupInvitation.expiry", { count: p.days })}
        </Text>
        <FallbackLink href={p.inviteUrl} />
        <Text muted small>
          {t("signupInvitation.ignore")}
        </Text>
        <Signature />
      </>
    );
  },
  example: { inviteUrl: "https://www.example.com/en/signup?invite=[redacted:url-param]", days: 7, allowance: "10 files included while we are in pilot" },
});
