// The footer of the developer sites (ui. · lab. · java. · ts. · rust.): ONE block that reads what a site shows from the
// org JSON (`footerFor(siteId)` of `@krizaka/org` ≥ 1.4.0) and places it — the family, the source code, the licence, the
// legal links, the socials, the version. The library does not fetch and types no word of the content: it takes the
// resolved footer as a prop; the host passes only its own links (`children`), its version and its controls.
import * as React from "react";

import type { FamilyLabels, OrgFamilyEntry, SiteGroup, SiteId, SiteLocale } from "../sites/sites";
import type { OrgSocialLink } from "./footer-config";
import { SiteFooter, SiteFooterColumn, SiteFooterLink, type SiteFooterProps } from "./site-footer";

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
  /** Whether the version line shows (when the host passes `version`). */
  version: boolean;
}

export type FamilyFooterProps = Omit<SiteFooterProps, "current" | "org" | "legal" | "groups" | "family" | "config" | "version" | "labels" | "tone"> & {
  /** `footerFor(siteId)` of `@krizaka/org`. */
  footer: FamilyFooterData;
  /** The site this footer belongs to: marked in the family. */
  current: SiteId;
  /** The family's words, translated (`familyLabels[locale]`). */
  labels: FamilyLabels;
  /** « Source code » / « Code source », translated. */
  sourceLabel: string;
  /** The version the site runs (`1.2.3`); shown only when the footer's selection says so. */
  version?: string;
  /** The company's name for the mark's accessible name. @default "Krizaka" */
  brand?: string;
  /** Extra links at the start of the legal group (a changelog link, for instance). */
  extra?: React.ReactNode;
};

/** The family footer of a developer site: the shared three lines, from the org's selection. */
export function FamilyFooter({ footer, current, labels, sourceLabel, version, brand = "Krizaka", extra, variant = "docs", children, ...props }: FamilyFooterProps) {
  const lang = labels.lang ?? "en";
  const entries = footer.groups.flatMap((g) => g.entries);
  const org = {
    brand: { name: brand },
    links: { social: footer.social },
    family: entries,
    footer: { line: footer.line, legal: footer.legal },
  };
  return (
    <SiteFooter
      {...props}
      current={current}
      tone="cahier"
      variant={variant}
      labels={labels}
      org={org}
      family
      groups={footer.groups.map((g) => g.group)}
      version={footer.version ? version : undefined}
      legal={
        <>
          {footer.source && (
            <SiteFooterLink href={footer.source} target="_blank" rel="noopener noreferrer">
              {sourceLabel}
            </SiteFooterLink>
          )}
          {footer.license && <span>{footer.license}</span>}
          {extra}
          {footer.legal.map((l) => (
            <SiteFooterLink key={l.id} href={l.url[lang]}>
              {l.label[lang]}
            </SiteFooterLink>
          ))}
        </>
      }
    >
      {children}
    </SiteFooter>
  );
}

FamilyFooter.Column = SiteFooterColumn;
FamilyFooter.Link = SiteFooterLink;
