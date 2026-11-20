// The one footer of the family, for every site (krizaka-internal#3562): ONE block that reads what a site shows from the org
// JSON (`footerFor(siteId)` of `@krizaka/org`) and places it in five rows under one `<footer>` landmark, each group a
// labelled `<nav>`:
//   A  the family groups (+ at most one site column)      B  the four accounts, each its own glyph
//   C  source · licence · version · release notes          D  the company, NEQ, city, legal links
//   E  the signature line (+ the host's controls)
// `kind` ("company" | "developer") changes row C only. The library does not fetch and types no word of the content: it
// takes the resolved footer as a prop; the host passes only its own controls and, for the build, its version.
import * as React from "react";

import type { FamilyLabels, OrgFamilyEntry, SiteGroup, SiteId, SiteKind, SiteLocale } from "../sites/sites";
import { familyLabels, siteById } from "../sites/sites";
import type { OrgSocialLink } from "./footer-config";
import { FooterSocials, SiteFooter, siteFooter, SiteFooterColumn, SiteFooterLink, type SiteFooterProps } from "./site-footer";

/** What `footerFor(siteId)` of `@krizaka/org` returns, structurally: the whole `ResolvedFooter` fits. */
export interface FamilyFooterData {
  id: string;
  groups: readonly { group: SiteGroup; entries: readonly OrgFamilyEntry[] }[];
  social: readonly OrgSocialLink[];
  /** The site's source-code address; `null` shows none. */
  source: string | null;
  /** The licence's name (`Apache-2.0`); `null` shows none. */
  license: string | null;
  legal: readonly { id: string; label: Record<SiteLocale, string>; url: Record<SiteLocale, string> }[];
  line: Record<SiteLocale, string>;
  /** Whether the version line shows (when the host passes `version`). A developer footer shows it either way. */
  version: boolean;
  /** The site's own column (`footer.sites[id].column`): « The blog », « Documentation ». At most one; it wins over `children`. */
  column?: { title: Record<SiteLocale, string>; links: readonly { id: string; label: Record<SiteLocale, string>; url: Record<SiteLocale, string> }[] };
  /** The release notes' address (`footer.sites[id].releaseNotes`); shown on a developer footer. */
  releaseNotes?: string | null;
  /** Where the licence's name leads (`licenceHref`): the licence text. */
  licenceHref?: string | null;
}

/** The company's facts of row D (`org.company` of `@krizaka/org`): `legalName · NEQ … · city (region)`. */
export interface FamilyFooterCompany {
  legalName: string;
  neq?: string;
  city: string;
  region?: string;
}

/** `developer`: ui · java · ts · lab · rust — row C always holds source, licence, version and release notes. `company`: the rest — row C only holds what the org gives it. */
export type FamilyFooterKind = "company" | "developer";

/** The accounts' fixed order, whatever the order of the data. */
const SOCIAL_ORDER = ["instagram", "facebook", "youtube", "linkedin"] as const;
const socialRank = (id: string) => {
  const i = (SOCIAL_ORDER as readonly string[]).indexOf(id);
  return i === -1 ? SOCIAL_ORDER.length : i;
};

export type FamilyFooterProps = Omit<SiteFooterProps, "current" | "org" | "legal" | "groups" | "family" | "config" | "version" | "labels" | "tone"> & {
  /** `footerFor(siteId)` of `@krizaka/org`. */
  footer: FamilyFooterData;
  /** The site this footer belongs to: marked in the family. */
  current: SiteId;
  /** The family's words, translated (`familyLabels[locale]`). */
  labels: FamilyLabels;
  /** « Source code » / « Code source », translated. @default `labels.footer.source` */
  sourceLabel?: string;
  /** Which row C: a developer site's (source, licence, version, release notes) or a company site's. @default developer for an open-source site */
  kind?: FamilyFooterKind;
  /** The company's facts for row D. Without it the row holds the legal links only. */
  company?: FamilyFooterCompany;
  /** The version the site runs (`1.2.3`); shown only when the footer's selection says so. */
  version?: string;
  /** The company's contact page (`org.contact.page` of `@krizaka/org`): the « Krizaka » column's last link. */
  contact?: Record<SiteLocale, string>;
  /** The company's name for the mark's accessible name. @default "Krizaka" */
  brand?: string;
  /** Extra links at the end of row C. */
  extra?: React.ReactNode;
};

const WORDS = familyLabels.en.footer!;
/** Row C by the site's kind, when the host does not say: the open-source sites are the developer ones. */
const DEFAULT_KIND: Record<SiteKind, FamilyFooterKind> = { company: "company", product: "company", "open-source": "developer" };

/** The family footer of every site: the five rows, from the org's selection. */
export function FamilyFooter({ footer, current, labels, sourceLabel, kind, company, version, contact, brand = "Krizaka", extra, controls, variant = "docs", children, ...props }: Readonly<FamilyFooterProps>) {
  const lang = labels.lang ?? "en";
  const words = { ...WORDS, ...familyLabels[lang].footer, ...labels.footer };
  const rowKind: FamilyFooterKind = kind ?? DEFAULT_KIND[siteById(current).kind];
  const developer = rowKind === "developer";
  const s = siteFooter({ variant, tone: "cahier" });
  const entries = footer.groups.flatMap((g) => g.entries);
  const org = {
    brand: { name: brand },
    links: { social: footer.social },
    ...(contact ? { contact: { page: contact } } : {}),
    family: entries,
    footer: { line: footer.line, legal: footer.legal },
  };
  const social = [...footer.social].sort((a, b) => socialRank(a.id) - socialRank(b.id)).map((x) => ({ id: x.id, label: x.label, href: x.url }));
  const shownVersion = developer ? version : undefined;
  const source = footer.source;
  const licence = footer.license;
  const identity = company && [company.legalName, company.neq && `NEQ ${company.neq}`, company.region ? `${company.city} (${company.region})` : company.city].filter(Boolean).join(" · ");
  const hasProject = Boolean(source || licence || shownVersion || (developer && footer.releaseNotes) || extra);
  const rows = (
    <div className="flex flex-col gap-4 pt-2">
      {social.length > 0 && (
        <nav aria-label={words.social}>
          <FooterSocials s={s} links={social} />
        </nav>
      )}
      {hasProject && (
        <nav aria-label={words.project} className={s.legal()}>
          {source && (
            <SiteFooterLink href={source} target="_blank" rel="noopener noreferrer">
              {sourceLabel ?? words.source}
            </SiteFooterLink>
          )}
          {licence &&
            (footer.licenceHref ? (
              <SiteFooterLink href={footer.licenceHref} target="_blank" rel="noopener noreferrer">
                {licence}
              </SiteFooterLink>
            ) : (
              <span>{licence}</span>
            ))}
          {shownVersion && (
            <span className={s.version()}>
              <span className="sr-only">{labels.version} </span>v{shownVersion.replace(/^v/, "")}
            </span>
          )}
          {developer && footer.releaseNotes && <SiteFooterLink href={footer.releaseNotes}>{words.releaseNotes}</SiteFooterLink>}
          {extra}
        </nav>
      )}
      <div className={s.legal()}>
        {identity && <span className={s.identity()}>{identity}</span>}
        {footer.legal.length > 0 && (
          <nav aria-label={words.legal} className={s.legal()}>
            {footer.legal.map((l) => (
              <SiteFooterLink key={l.id} href={l.url[lang]}>
                {l.label[lang]}
              </SiteFooterLink>
            ))}
          </nav>
        )}
      </div>
      <div className={s.bottom()}>
        {/* The company named once: the signature line only when the legal line above does not already name it. */}
        {!identity && <p className={s.identity()}>{footer.line[lang]}</p>}
        {controls && <div className={s.controls()}>{controls}</div>}
      </div>
    </div>
  );
  return (
    <SiteFooter {...props} current={current} tone="cahier" variant={variant} labels={labels} org={org} family groups={footer.groups.map((g) => g.group)} rows={rows}>
      {footer.column ? (
        <SiteFooterColumn title={footer.column.title[lang]}>
          {footer.column.links.map((l) => (
            <SiteFooterLink key={l.id} href={l.url[lang]}>
              {l.label[lang]}
            </SiteFooterLink>
          ))}
        </SiteFooterColumn>
      ) : (
        children
      )}
    </SiteFooter>
  );
}

FamilyFooter.Column = SiteFooterColumn;
FamilyFooter.Link = SiteFooterLink;
