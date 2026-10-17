// Named parts: a Server Component cannot dot into a client module (`SiteFooter.Column`).
import { SiteFooter as FamilyFooter, SiteFooterColumn, SiteFooterLink } from "@krizaka/ui/site-footer";
import { familyLabels } from "@krizaka/ui/sites";

import { format, getDictionary, type Locale } from "@/lib/i18n";
import { packageVersion } from "@/lib/package-version";
import { localePath } from "@/lib/urls";

/* The footer every Krizaka site shares (@krizaka/ui/site-footer, NAV-SYS): « A Krizaka open-source project », the
   version of @krizaka/ui this site was built from (linking /changelog#<version>), the family in columns — and this site's own column first. */
export function SiteFooter({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).site;
  const links = [
    { id: "getStarted", path: "/installation" },
    { id: "foundations", path: "/foundations/tokens" },
    { id: "components", path: "/components" },
    { id: "templates", path: "/templates" },
  ] as const;
  return (
    <FamilyFooter
      current="ui"
      labels={familyLabels[locale]}
      legal={
        <SiteFooterLink href={`${localePath(locale, "/changelog")}#${packageVersion("ui")}`}>{format(t.footer.changelog, { version: packageVersion("ui") })}</SiteFooterLink>
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
