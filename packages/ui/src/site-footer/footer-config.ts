// The footer as the admin configures it (krizaka-internal#591): the settings an app stores (`@krizaka/settings`, audited)
// — words as message keys, so FR and EN come from the app's catalogues — and the resolved config `SiteFooter` draws.
// Pure: no React, no fetch. The structure is the design rule (founder, 2026-11-01): a few short columns, then one legal
// line that names the company once.
import type { SiteStatus } from "../sites/sites";

/** At most four columns of at most six links: past that a footer is a sitemap, and nobody reads it. */
export const FOOTER_LIMITS = { columns: 4, links: 6, legalLinks: 4 } as const;

/** A status said once, on a column's heading (never on each link). */
export type FooterStatus = Exclude<SiteStatus, "released">;

/** A link, its words resolved. `external`: it leaves this site (a plain `<a>`, never the router). */
export type FooterLink = { label: string; href: string; external?: boolean };

/** A column, its words resolved. */
export type FooterColumn = { id: string; title: string; status?: FooterStatus; links: readonly FooterLink[] };

/** The legal line: who publishes the site, once — `legalName · NEQ … · city`, then the version and the legal links. */
export type FooterLegal = {
  legalName: string;
  /** The Québec enterprise number, shown as the publisher's legal identity (`NEQ 1182652231`). */
  neq?: string;
  city: string;
  showVersion: boolean;
  links: readonly FooterLink[];
};

/** What `SiteFooter` draws from `config`: the columns, then the legal line and the socials. */
export type SiteFooterConfig = {
  /** The name of the columns' navigation (« Pied de page » / « Footer »). */
  label: string;
  columns: readonly FooterColumn[];
  legal: FooterLegal;
  social?: readonly { id: string; label: string; href: string }[];
};

/** A stored link: a message key (`labelKey`) or a proper noun the same in every language (`label`: « Verikora », « GitHub »). */
export type FooterLinkSetting = ({ labelKey: string; label?: never } | { label: string; labelKey?: never }) & {
  href: string;
  external?: boolean;
};

/** The footer as an app stores it in its settings. */
export type FooterSettings = {
  labelKey: string;
  columns: readonly { id: string; titleKey: string; status?: FooterStatus; links: readonly FooterLinkSetting[] }[];
  legal: { legalName: string; neq?: string; city: string; showVersion: boolean; links: readonly FooterLinkSetting[] };
  /** The ids of the org's social links (`@krizaka/org`) to show; their addresses are the org's, never typed here. */
  social?: readonly string[];
};

/** A social link of the org (`@krizaka/org` `links.social`). */
export type OrgSocialLink = { id: string; label: string; url: string };

const link = (l: FooterLinkSetting, t: (key: string) => string): FooterLink => ({
  label: l.labelKey === undefined ? l.label! : t(l.labelKey),
  href: l.href,
  ...(l.external ? { external: true } : {}),
});

/** The settings, their words read from the app's messages (`t`) and the socials from the org's list. */
export function resolveFooterSettings(
  settings: FooterSettings,
  t: (key: string) => string,
  social: readonly OrgSocialLink[] = [],
): SiteFooterConfig {
  const shown = (settings.social ?? []).flatMap((id) => social.filter((s) => s.id === id));
  return {
    label: t(settings.labelKey),
    columns: settings.columns.map((c) => ({
      id: c.id,
      title: t(c.titleKey),
      ...(c.status ? { status: c.status } : {}),
      links: c.links.map((l) => link(l, t)),
    })),
    legal: { ...settings.legal, links: settings.legal.links.map((l) => link(l, t)) },
    ...(shown.length > 0 ? { social: shown.map((s) => ({ id: s.id, label: s.label, href: s.url })) } : {}),
  };
}

/**
 * What is wrong with a footer's settings — the admin's form refuses to save while the list is not empty: too many
 * columns or links, a link twice, an empty column, an `http:` or a development address, a malformed NEQ.
 */
export function footerSettingsProblems(settings: FooterSettings): string[] {
  const problems: string[] = [];
  if (settings.columns.length > FOOTER_LIMITS.columns) problems.push(`at most ${FOOTER_LIMITS.columns} columns`);
  if (settings.legal.links.length > FOOTER_LIMITS.legalLinks) problems.push(`at most ${FOOTER_LIMITS.legalLinks} legal links`);
  const seen = new Set<string>();
  const all = [...settings.columns.flatMap((c) => c.links.map((l) => ({ where: c.id, l }))), ...settings.legal.links.map((l) => ({ where: "legal", l }))];
  for (const c of settings.columns) {
    if (c.links.length === 0) problems.push(`column ${c.id}: no link`);
    if (c.links.length > FOOTER_LIMITS.links) problems.push(`column ${c.id}: at most ${FOOTER_LIMITS.links} links`);
  }
  for (const { where, l } of all) {
    if (seen.has(l.href)) problems.push(`${where}: ${l.href} is already in the footer`);
    seen.add(l.href);
    if (/^http:/i.test(l.href)) problems.push(`${where}: ${l.href} is not https`);
    if (/^https?:\/\/dev\./i.test(l.href)) problems.push(`${where}: ${l.href} is a development host`);
    if (l.external && !/^[a-z][a-z0-9+.-]*:/i.test(l.href)) problems.push(`${where}: ${l.href} is external but relative`);
  }
  if (settings.legal.neq !== undefined && !/^\d{10}$/.test(settings.legal.neq)) problems.push("legal: the NEQ has ten digits");
  if (settings.legal.legalName.trim() === "") problems.push("legal: the legal name is required");
  return problems;
}
