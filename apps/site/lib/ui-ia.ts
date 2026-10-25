/* The information architecture of ui.krizaka.com (krizaka-com#115): where every component sits, reader-first.

     Get started → Foundations → Components (by the job they do) → Patterns → Templates (by intent) → Tooling → Platforms

   Each group answers "you come here when…" (messages: docs.ia.groups.<id>.when); each job of the components too. The
   registry says what a component is (category, platforms, status); this file only decides where a reader looks for it.
   Pure data — no React, no filesystem — so the sidebar, the catalogue and tests/docs-ia.test.mjs share one truth. */

import type { Category, RegistryItem } from "./ui-registry";
import { FOUNDATION_PAGES, GET_STARTED_PAGES, PACKAGE_PAGES } from "./urls.ts";

export const GROUPS = ["get-started", "foundations", "components", "patterns", "templates", "tooling", "platforms"] as const;
export type Group = (typeof GROUPS)[number];

/** The jobs a component does, in reading order. */
export const JOBS = ["actions", "inputs", "navigation", "overlays", "feedback", "data", "media", "maps", "charts", "brand", "utilities"] as const;
export type Job = (typeof JOBS)[number];

/** The two kinds of patterns: the blocks a page is made of, and the layouts of whole screens. */
export const PATTERNS = ["blocks", "layouts"] as const;
export type Pattern = (typeof PATTERNS)[number];

/** The category of the registry → the job (or pattern, or template) it belongs to, unless OVERRIDES says otherwise. */
const BY_CATEGORY: Record<Category, Job | Pattern | "templates"> = {
  actions: "actions",
  forms: "inputs",
  navigation: "navigation",
  overlays: "overlays",
  feedback: "feedback",
  "data-display": "data",
  media: "media",
  charts: "charts",
  blocks: "blocks",
  layouts: "layouts",
  templates: "templates",
  layout: "layouts",
  foundations: "utilities",
};

/** Components whose job is not their category's: a map is a map, a bird is brand, a divider is a utility. */
const OVERRIDES: Partial<Record<string, Job | Pattern>> = {
  map: "maps",
  mascots: "brand",
  "mascot-state": "brand",
  "mascot-quote": "brand",
  "bird-plate": "brand",
  "taped-photo": "brand",
  iso: "brand",
  landscape: "brand",
  "glow-card": "brand",
  "section-backdrop": "brand",
  "scroll-stage": "brand",
  "pointer-light": "brand",
  marquee: "brand",
  card: "data",
  separator: "utilities",
  "page-header": "blocks",
};

export type Placement = { group: "components"; job: Job } | { group: "patterns"; pattern: Pattern } | { group: "templates" };

/** Where a component of the registry is found in the sidebar. */
export function placementOf(item: Pick<RegistryItem, "name" | "category">): Placement {
  const where = OVERRIDES[item.name] ?? BY_CATEGORY[item.category];
  if (where === "templates") return { group: "templates" };
  if ((PATTERNS as readonly string[]).includes(where)) return { group: "patterns", pattern: where as Pattern };
  return { group: "components", job: where as Job };
}

/** The job a component filters under in the catalogue: its job, its pattern or `templates`. */
export function filterKeyOf(item: Pick<RegistryItem, "name" | "category">): string {
  const placement = placementOf(item);
  return placement.group === "components" ? placement.job : placement.group === "patterns" ? placement.pattern : "templates";
}

/** Every filter value of the catalogue's "group" filter, in reading order. */
export const FILTER_KEYS = [...JOBS, ...PATTERNS, "templates"] as const;

/** Paths (slugs joined by "/") of the generated pages that no MDX file writes (lib/urls.ts: the addresses). */
export const TEMPLATE_PAGE = "templates";
export const MOBILE_PAGE = "mobile";
/** Web · mobile · desktop: the parity matrix of every component and how to install each platform. */
export const PLATFORMS_PAGE = "platforms";
export const BRAND_PAGE = "foundations/brand-marks";
export const templatePurposeSlug = (purpose: string) => `${TEMPLATE_PAGE}/${purpose}`;

/** The pages of each group, in reading order, by path (content/docs/<path>.mdx, or generated). */
export const GROUP_PAGES: Record<Exclude<Group, "components" | "patterns" | "templates">, readonly string[]> = {
  "get-started": ["index", ...GET_STARTED_PAGES],
  foundations: FOUNDATION_PAGES.map((page) => `foundations/${page}`),
  tooling: PACKAGE_PAGES.map((page) => `packages/${page}`),
  platforms: [PLATFORMS_PAGE, MOBILE_PAGE],
};

/** The words a heading of the sidebar may take (messages: docs.ia). */
export interface IaLabels {
  groups: Record<Group, { title: string }>;
  jobs: Record<Job, { title: string }>;
  patterns: Record<Pattern, { title: string }>;
}

/**
 * Every heading the sidebar shows — the seven groups, then the jobs and the two kinds of patterns that have at least one
 * component — in order. A heading is said once: tests/docs-ia.test.mjs fails when two are the same, in either language.
 */
export function sidebarHeadings(items: Pick<RegistryItem, "name" | "category">[], labels: IaLabels): string[] {
  const placed = items.map(placementOf);
  const jobs = JOBS.filter((job) => placed.some((p) => p.group === "components" && p.job === job)).map((job) => labels.jobs[job].title);
  const patterns = PATTERNS.filter((pattern) => placed.some((p) => p.group === "patterns" && p.pattern === pattern)).map((pattern) => labels.patterns[pattern].title);
  return [...GROUPS.map((group) => labels.groups[group].title), ...jobs, ...patterns];
}
