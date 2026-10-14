import { KrizakaLogo } from "@krizaka/ui";

import { format, getDictionary, type Locale } from "@/lib/i18n";
import { packageVersion } from "@/lib/package-version";
import { KRIZAKA_JAVA_URL, KRIZAKA_UI_ISSUES_URL, KRIZAKA_UI_REPO_URL, KRIZAKA_URL, NPM_ORG_URL } from "@/lib/site";

/* The footer: what this site is (generated from the code, at every release), the version it was built from, and the
   ways out — Krizaka, Krizaka Java, the repository, npm, an issue. Server Component. */
export function SiteFooter({ locale }: { locale: Locale }) {
  const f = getDictionary(locale).site.footer;
  const links = [
    { href: KRIZAKA_URL, label: f.krizaka },
    { href: KRIZAKA_JAVA_URL, label: f.java },
    { href: KRIZAKA_UI_REPO_URL, label: f.github },
    { href: NPM_ORG_URL, label: f.npm },
    { href: KRIZAKA_UI_ISSUES_URL, label: f.issues },
  ];
  return (
    <footer className="kz-ui-footer" aria-label={f.aria}>
      <div className="kz-ui-footer-inner">
        <div className="kz-ui-footer-brand">
          <a href={KRIZAKA_URL} className="kz-ui-footer-project">
            <KrizakaLogo size={20} animated={false} />
            {f.project}
          </a>
          <p>{f.tagline}</p>
          <p className="kz-ui-footer-meta">
            {format(f.version, { version: packageVersion("ui") })} · {f.license}
          </p>
        </div>
        <ul className="kz-ui-footer-links">
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
