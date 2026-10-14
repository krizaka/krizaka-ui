/* The documentation of Krizaka UI, on Fumadocs — the whole of ui.krizaka.com.

   - written      content/docs/** — MDX written here (Get started, the foundations' prose, the packages without UI).
                  Their titles and descriptions on the site come from messages (docs.pages.ui.<page>), so the sidebar,
                  the page heading and the SEO metadata are translated; the body is English (developer documentation).
   - components   one page per component of the @krizaka/ui (and @krizaka/charts) registry, generated at every build
                  from the workspace packages (virtual pages, see componentFiles): the code of the component drives it.
                  An optional content/docs/components/<name>.mdx enriches the generated page (rendered under "Notes").
   - generated    typography, icons, brand marks, templates (by intent) and the mobile parity, laid out from the
                  packages' data (lib/ui-foundations.ts).

   English has no prefix (/components/button), French lives under /fr (lib/urls.ts). */

import type * as PageTree from "fumadocs-core/page-tree";
import { loader, update, type VirtualFile } from "fumadocs-core/source";

import { docs } from "@/.source/server";
import { format, getDictionary, type Locale, type TranslationDictionary } from "@/lib/i18n";
import { type Foundation, foundationSlugs, foundationStructuredData, purposeOf } from "@/lib/ui-foundations";
import { GROUP_PAGES, JOBS, PATTERNS, placementOf, templatePurposeSlug } from "@/lib/ui-ia";
import { getRegistryItems, type RegistryItem } from "@/lib/ui-registry";
import { localePath } from "@/lib/urls";

/** What a generated page carries: the registry item it renders (title and description are its own), or the
    foundation it lays out from the packages' data (Typography, Icons: title and description from messages). */
export interface ComponentPageData {
  component?: string;
  /** A foundation of Krizaka UI laid out from the packages' data (Typography, Icons). */
  foundation?: Foundation;
}

/** Plain text of the code-written documentation: `asChild` → asChild (titles, SEO, search, sidebar). */
const plain = (text: string) => text.replace(/`/g, "");

/** The words of a component for the search index: its summary and when to use it, under its title. */
function structuredData(item: RegistryItem) {
  const contents = [item.summary, ...item.whenToUse, ...item.whenNotToUse.map((w) => w.when), ...item.accessibility.notes];
  return { headings: [], contents: contents.map((content) => ({ heading: undefined, content: plain(content) })) };
}

/**
 * The ui collection, plus one page per component of the registry: virtual when there is no enrichment MDX, the MDX
 * page marked with its component otherwise; and the sidebar of the components, grouped by category.
 */
function componentFiles(files: VirtualFile[]): VirtualFile[] {
  const items = getRegistryItems();
  const byName = new Map(items.map((item) => [item.name, item]));
  const pagePath = (name: string) => `components/${name}.mdx`;
  const written = new Set(files.filter((f) => f.type === "page").map((f) => f.path));
  const out = files
    .filter((file) => !(file.type === "meta" && file.path === "components/meta.json"))
    .map((file) => {
      const name = file.type === "page" && file.path.startsWith("components/") ? file.path.slice(11, -4) : undefined;
      const item = name ? byName.get(name) : undefined;
      if (!item || file.type !== "page") return file;
      return { ...file, data: { ...file.data, title: item.title, description: plain(item.summary), component: item.name, structuredData: structuredData(item) } };
    });
  for (const item of items) {
    if (written.has(pagePath(item.name))) continue;
    out.push({
      type: "page",
      path: pagePath(item.name),
      data: { title: item.title, description: plain(item.summary), component: item.name, structuredData: structuredData(item) } as never,
    });
  }
  // The pages generated from the packages' data and the registry (@krizaka/fonts, @krizaka/tokens, @krizaka/icons, the
  // templates by intent, the mobile parity, the brand marks): virtual pages at /<path>. The sidebar is
  // lib/docs-source.ts `uiTree` (lib/ui-ia.ts), not a meta.json: every component is placed by what it does.
  for (const foundation of foundationSlugs()) {
    // `templates` is a folder too (templates/<intent>): its page is the folder's index.
    const file = foundation === "templates" ? "templates/index.mdx" : `${foundation}.mdx`;
    if (written.has(file)) continue;
    out.push({
      type: "page",
      path: file,
      data: { title: foundation, foundation, structuredData: foundationStructuredData(foundation) } as never,
    });
  }
  return out;
}

function createSource(locale: Locale) {
  const source = docs.toFumadocsSource();
  const files = update(source)
    .files((all) => componentFiles(all as VirtualFile[]) as typeof all)
    .build();
  return loader({ baseUrl: localePath(locale, "/"), source: files });
}

type DocsSource = ReturnType<typeof createSource>;
export type DocsPage = ReturnType<DocsSource["getPages"]>[number];

const sources = new Map<string, DocsSource>();

export function getSource(locale: Locale): DocsSource {
  if (!sources.has(locale)) sources.set(locale, createSource(locale));
  return sources.get(locale)!;
}

/** The message key of a written page: its last slug, `index` for the section's home. */
export const pageKey = (slugs: string[]) => slugs.at(-1) ?? "index";

export interface PageText {
  title: string;
  description: string;
}

/** Title and description shown on the site — messages for the written pages, the code for the generated ones. */
export function pageText(page: DocsPage, t: TranslationDictionary): PageText {
  // A page of templates by intent: the intent's title and its "you come here when…".
  const foundation = (page.data as ComponentPageData).foundation;
  const purpose = foundation ? purposeOf(foundation) : null;
  if (purpose) {
    const words = t.docs.ia.purposes[purpose];
    return { title: words.title, description: words.when };
  }
  // A component page: its title and summary come from its code (the registry), in English.
  const component = (page.data as ComponentPageData).component;
  if (component) return { title: page.data.title ?? component, description: page.data.description ?? "" };
  const pages: Record<string, PageText | undefined> = t.docs.pages.ui;
  const text = pages[pageKey(page.slugs)];
  return { title: text?.title ?? page.data.title ?? "", description: text?.description ?? page.data.description ?? "" };
}

/**
 * The sidebar: seven groups, each with its "you come here when…" (lib/ui-ia.ts) — Get started, Foundations,
 * Components (by the job they do), Patterns (blocks, then screen layouts), Templates (by intent), Tooling, Mobile. A
 * heading appears once; a component is in one place; the deprecated ones close their job, flagged.
 */
function uiTree(source: DocsSource, t: TranslationDictionary, name: string): PageTree.Root {
  const ia = t.docs.ia;
  const pages = new Map(source.getPages().map((page) => [page.slugs.join("/"), page]));
  const item = (page: DocsPage, label?: string): PageTree.Item => ({
    type: "page",
    name: label ?? pageText(page, t).title,
    url: page.url,
    $id: `ui:${page.url}`,
  });
  const separator = (id: string, label: string): PageTree.Separator => ({ type: "separator", $id: `ui:${id}`, name: label });
  const written = (slugs: readonly string[]) => slugs.flatMap((slug) => pages.get(slug === "index" ? "" : slug)).filter((page): page is DocsPage => Boolean(page)).map((page) => item(page));
  // The first two groups open at once; the long ones (components, patterns…) open on the group of the page being read.
  const folder = (group: keyof typeof ia.groups, children: PageTree.Node[]): PageTree.Folder => ({
    type: "folder",
    $id: `ui:${group}`,
    name: ia.groups[group].title,
    description: ia.groups[group].when,
    defaultOpen: group === "get-started" || group === "foundations",
    children,
  });
  const items = getRegistryItems();
  const itemsOf = (match: (placement: ReturnType<typeof placementOf>) => boolean) => items.filter((entry) => match(placementOf(entry)));
  const components = (entries: RegistryItem[]) =>
    entries.flatMap((entry) => {
      const page = pages.get(`components/${entry.name}`);
      if (!page) return [];
      return [item(page, entry.status === "deprecated" ? format(t.docs.component.deprecatedName, { name: entry.title }) : undefined)];
    });
  const jobs = JOBS.flatMap((job) => {
    const nodes = components(itemsOf((p) => p.group === "components" && p.job === job));
    return nodes.length ? [separator(`job:${job}`, ia.jobs[job].title), ...nodes] : [];
  });
  const patterns = PATTERNS.flatMap((pattern) => {
    const nodes = components(itemsOf((p) => p.group === "patterns" && p.pattern === pattern));
    return nodes.length ? [separator(`pattern:${pattern}`, ia.patterns[pattern].title), ...nodes] : [];
  });
  const templates = [pages.get("templates"), ...Object.keys(ia.purposes).map((purpose) => pages.get(templatePurposeSlug(purpose)))]
    .filter((page): page is DocsPage => Boolean(page))
    .map((page) => item(page));
  return {
    name,
    children: [
      folder("get-started", written(GROUP_PAGES["get-started"])),
      folder("foundations", written(GROUP_PAGES.foundations)),
      folder("components", jobs),
      folder("patterns", patterns),
      folder("templates", templates),
      folder("tooling", written(GROUP_PAGES.tooling)),
      folder("mobile", written(GROUP_PAGES.mobile)),
    ],
  };
}

/** The sidebar in the reader's language. */
export function getPageTree(locale: Locale): PageTree.Root {
  const t = getDictionary(locale);
  return uiTree(getSource(locale), t, t.docs.sections.ui.title);
}

/** Locale-less paths of every page (sitemap, llms.txt): `/`, `/installation`, `/components/button`… */
export function allDocsPaths(): string[] {
  return getSource("en")
    .getPages()
    .map((page) => page.url);
}
