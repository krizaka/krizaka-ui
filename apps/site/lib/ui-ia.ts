/* The information architecture of ui.krizaka.com (krizaka-com#115, ADR-008 §7): where every component sits, reader-first.

     Get started → Foundations → Components (by what they are for: the twelve domains) → Templates (by intent) → Tooling → Platforms

   Each group answers "you come here when…" (messages: docs.ia.groups.<id>.when); each domain too, with the owner rule of
   its entries (docs.ia.domains.<id>). The registry says what a component is (domain, category, platforms, status); this
   file only decides where a reader looks for it. Pure data — no React, no filesystem — so the sidebar, the catalogue and
   tests/docs-ia.test.mjs share one truth. */

import { domainOf,DOMAINS } from "./domains.ts";
import type { RegistryItem } from "./ui-registry";
import { FOUNDATION_PAGES, GET_STARTED_PAGES, PACKAGE_PAGES } from "./urls.ts";

export const GROUPS = ["get-started", "foundations", "components", "templates", "tooling", "platforms"] as const;
export type Group = (typeof GROUPS)[number];

/** The domain a component filters under in the catalogue. */
export function filterKeyOf(item: Pick<RegistryItem, "domain">): string {
  return domainOf(item);
}

/** Every filter value of the catalogue's "group" filter, in reading order. */
export const FILTER_KEYS = DOMAINS;

/** Paths (slugs joined by "/") of the generated pages that no MDX file writes (lib/urls.ts: the addresses). */
export const TEMPLATE_PAGE = "templates";
export const MOBILE_PAGE = "mobile";
/** Web · mobile · desktop: the parity matrix of every component and how to install each platform. */
export const PLATFORMS_PAGE = "platforms";
export const BRAND_PAGE = "foundations/brand-marks";
export const templatePurposeSlug = (purpose: string) => `${TEMPLATE_PAGE}/${purpose}`;

/** The pages of each group, in reading order, by path (content/docs/<path>.mdx, or generated). */
export const GROUP_PAGES: Record<Exclude<Group, "components" | "templates">, readonly string[]> = {
  "get-started": ["index", ...GET_STARTED_PAGES],
  foundations: FOUNDATION_PAGES.map((page) => `foundations/${page}`),
  tooling: PACKAGE_PAGES.map((page) => `packages/${page}`),
  platforms: [PLATFORMS_PAGE, MOBILE_PAGE],
};

/** The words a heading of the sidebar may take (messages: docs.ia). */
export interface IaLabels {
  groups: Record<Group, { title: string }>;
  domains: Record<(typeof DOMAINS)[number], { title: string }>;
}

/**
 * Every heading the sidebar shows — the groups, then the domains that have at least one component — in order. A heading is
 * said once: tests/docs-ia.test.mjs fails when two are the same, in either language.
 */
export function sidebarHeadings(items: Pick<RegistryItem, "domain">[], labels: IaLabels): string[] {
  const domains = DOMAINS.filter((domain) => items.some((item) => domainOf(item) === domain)).map((domain) => labels.domains[domain].title);
  return [...GROUPS.map((group) => labels.groups[group].title), ...domains];
}
