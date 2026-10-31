// Named parts: a Server Component cannot dot into a client module (`SiteFooter.Column`).
import { org } from "@krizaka/org";
import { SiteFooter as FamilyFooter, SiteFooterColumn, SiteFooterLink } from "@krizaka/ui/site-footer";
import { familyLabels } from "@krizaka/ui/sites";

import { loadReleases, releaseId } from "@/lib/changelog";
import { changelogHref } from "@/lib/changelog-link";
import { format, getDictionary, type Locale } from "@/lib/i18n";
import { packageVersion } from "@/lib/package-version";
import { localePath } from "@/lib/urls";

/* The footer every Krizaka site shares (@krizaka/ui/site-footer, NAV-SYS): the org line (@krizaka/org), the
   version of @krizaka/ui this site was built from (linking /changelog#<version>), the family on one line — and this site's own links first (three lines, krizaka-internal#754). */
export async function SiteFooter({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).site;
  const entries = (await loadReleases()).map(releaseId);
  const links = [
    { id: "getStarted", path: "/installation" },
    { id: "foundations", path: "/foundations/tokens" },
    { id: "components", path: "/components" },
    { id: "templates", path: "/templates" },
  ] as const;
  return (
    <FamilyFooter
      current="ui"
      tone="cahier"
      labels={familyLabels[locale]}
      org={org}
      legal={
        <>
          <SiteFooterLink href={changelogHref(localePath(locale, "/changelog"), packageVersion("ui"), entries)}>{format(t.footer.changelog, { version: packageVersion("ui") })}</SiteFooterLink>
          {org.footer.legal.map((l) => (
            <SiteFooterLink key={l.id} href={l.url[locale]}>
              {l.label[locale]}
            </SiteFooterLink>
          ))}
        </>
      }
    >
      <SiteFooterColumn title={t.footer.docs}>
        {links.map((l) => (
          <SiteFooterLink key={l.id} href={localePath(locale, l.path)}>
            {t.bar[l.id]}
          </SiteFooterLink>
        ))}
      </SiteFooterColumn>
    </FamilyFooter>
  );
}
