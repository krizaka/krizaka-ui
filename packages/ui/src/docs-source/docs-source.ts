// Server-safe, pure, no network: a folder of `<page>.<locale>.md` files (already read: `{ path, content }`) becomes what a
// documentation page needs — the page list, the nav groups (`DocsNav`), the headings (`Toc`) and previous / next
// (`DocsArticlePage`). The heading ids are the ones `Markdown` gives with `headingIds`, so a `#section` link always lands.
// `./node` reads the folder; this entry never touches the file system.
import { parseSource, textOf } from "../markdown/parse";

/** A file of the folder: its path under the folder (`guides/install.fr.md`) and its text. */
export type DocsFile = { path: string; content: string };

export type DocsHeading = { id: string; label: string; depth: 2 | 3 };

export type DocsPage = {
  /** The path without the locale and the extension: `guides/install` (`""` for `index`). */
  slug: string;
  /** The address: `basePath` + slug. */
  href: string;
  locale: string;
  /** True when the page has no file in `locale` and is the `defaultLocale` one. */
  fallback: boolean;
  title: string;
  description: string;
  group: string;
  order: number;
  /** `YYYY-MM-DD`, when the front matter says it. */
  updated?: string;
  readingMinutes: number;
  /** The Markdown after the front matter: give it to `Markdown` (`headingIds`). */
  body: string;
  /** The `h2` and `h3` of the body. */
  headings: readonly DocsHeading[];
};

/** A group of `DocsNav`: assignable to its `groups` prop. */
export type DocsNavTreeGroup = { id: string; title: string; items: readonly { href: string; label: string }[] };

export type DocsPageView = DocsPage & {
  /** The `toc` prop of `DocsArticlePage` without its label: the `h2`s. */
  toc: { items: readonly { id: string; label: string }[] };
  /** The `pager` prop of `DocsArticlePage` without its labels. */
  pager: { previous?: { href: string; title: string }; next?: { href: string; title: string } };
  /** The `breadcrumb` prop of `DocsArticlePage`: the group's first page is not invented, the docs home is. */
  breadcrumb: readonly { href: string; label: string }[];
};

export type DocsSourceOptions = {
  /** The reader's language: `fr`. */
  locale: string;
  /** The language a page falls back to when it is not translated yet. Default `en`. */
  defaultLocale?: string;
  /** The address the pages live under, no trailing slash. Default `/docs`. */
  basePath?: string;
  /** The title of the pages with no `group` in their front matter. Default `Docs`. */
  rootGroupTitle?: string;
  /** The label of the home in the breadcrumb. Default `Docs`. */
  homeLabel?: string;
};

export type DocsSource = {
  locale: string;
  /** Every language the folder has a file in. */
  locales: readonly string[];
  /** The pages in reading order. */
  pages: readonly DocsPage[];
  /** The groups of the nav, in reading order. */
  groups: readonly DocsNavTreeGroup[];
  /** One page ready for `DocsArticlePage`, or `undefined` for an unknown slug. */
  page: (slug: string) => DocsPageView | undefined;
};

const NAME = /^(.+)\.([a-z]{2}(?:-[A-Za-z0-9]+)*)\.md$/;
const FRONT = /^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/;
const WORDS_PER_MINUTE = 200;

type Raw = { slug: string; locale: string; path: string; meta: Record<string, string>; body: string };

function unquote(value: string): string {
  const v = value.trim();
  const quoted = v.length >= 2 && (v.startsWith('"') || v.startsWith("'")) && v.at(-1) === v[0];
  return quoted ? v.slice(1, -1) : v;
}

function frontMatter(content: string): { meta: Record<string, string>; body: string } {
  const found = FRONT.exec(content);
  if (!found) return { meta: {}, body: content };
  const meta: Record<string, string> = {};
  for (const line of (found[1] ?? "").split(/\r?\n/)) {
    const colon = line.indexOf(":");
    if (colon > 0 && !line.startsWith("#")) meta[line.slice(0, colon).trim()] = unquote(line.slice(colon + 1));
  }
  return { meta, body: content.slice(found[0].length) };
}

const slugId = (text: string) => text.normalize("NFD").replaceAll(/[̀-ͯ]/g, "").toLowerCase().replaceAll(/[^a-z0-9]+/g, "-").replaceAll(/^-|-$/g, "");

function parseFiles(files: readonly DocsFile[]): Raw[] {
  const out: Raw[] = [];
  for (const file of files) {
    if (!file.path.endsWith(".md")) continue;
    const name = NAME.exec(file.path);
    if (!name) throw new Error(`docs-source: "${file.path}" must be named <page>.<locale>.md (guide.fr.md)`);
    const slug = (name[1] ?? "").replace(/(^|\/)index$/, "").replaceAll(/^\/|\/$/g, "");
    const { meta, body } = frontMatter(file.content);
    out.push({ slug, locale: name[2] ?? "", path: file.path, meta, body });
  }
  const seen = new Set<string>();
  for (const raw of out) {
    const key = `${raw.locale}:${raw.slug}`;
    if (seen.has(key)) throw new Error(`docs-source: two files give the page "${raw.slug || "index"}" in ${raw.locale} (${raw.path})`);
    seen.add(key);
  }
  return out;
}

function headingsOf(body: string): { headings: DocsHeading[]; firstH1?: string } {
  const headings: DocsHeading[] = [];
  let firstH1: string | undefined;
  for (const node of parseSource(body, { headingIds: true })) {
    if (node.type !== "heading") continue;
    const label = textOf(node.children).trim();
    if (node.depth === 1) firstH1 ??= label;
    else if (node.depth === 2 || node.depth === 3) headings.push({ id: node.id ?? slugId(label), label, depth: node.depth });
  }
  return { headings, firstH1 };
}

/** `YYYY-MM-DD` and a real day (2026-02-30 is not): the date survives a round trip through `Date`. */
function isIsoDate(text: string): boolean {
  const day = new Date(`${text}T00:00:00Z`);
  return !Number.isNaN(day.getTime()) && day.toISOString().startsWith(text) && text.length === 10;
}

function pageOf(raw: Raw, o: { locale: string; fallback: boolean; basePath: string; rootGroupTitle: string }): DocsPage {
  const { headings, firstH1 } = headingsOf(raw.body);
  const title = raw.meta.title ?? firstH1;
  if (!title) throw new Error(`docs-source: "${raw.path}" has no title (front matter \`title:\` or a first # heading)`);
  const order = raw.meta.order === undefined ? Number.POSITIVE_INFINITY : Number(raw.meta.order);
  if (Number.isNaN(order)) throw new Error(`docs-source: "${raw.path}" has an order that is not a number ("${raw.meta.order}")`);
  const updated = raw.meta.updated;
  if (updated !== undefined && !isIsoDate(updated)) throw new Error(`docs-source: "${raw.path}" has an updated that is not YYYY-MM-DD ("${updated}")`);
  const words = raw.body.split(/\s+/).filter(Boolean).length;
  return {
    slug: raw.slug,
    href: raw.slug ? `${o.basePath}/${raw.slug}` : o.basePath || "/",
    locale: o.locale,
    fallback: o.fallback,
    title,
    description: raw.meta.description ?? "",
    group: raw.meta.group ?? o.rootGroupTitle,
    order,
    ...(updated !== undefined && { updated }),
    readingMinutes: Math.max(1, Math.ceil(words / WORDS_PER_MINUTE)),
    body: raw.body,
    headings,
  };
}

/** Reads the files of a docs folder once and answers for one language. Throws, naming the file, on a name or a front matter it cannot use. */
export function docsSource(files: readonly DocsFile[], options: DocsSourceOptions): DocsSource {
  const { locale, defaultLocale = "en", rootGroupTitle = "Docs", homeLabel = "Docs" } = options;
  const basePath = (options.basePath ?? "/docs").replace(/\/$/, "");
  const raws = parseFiles(files);
  const locales = [...new Set(raws.map((r) => r.locale))].sort((a, b) => a.localeCompare(b));
  const bySlug = new Map<string, Map<string, Raw>>();
  for (const raw of raws) bySlug.set(raw.slug, (bySlug.get(raw.slug) ?? new Map()).set(raw.locale, raw));

  const pages: DocsPage[] = [];
  for (const [, variants] of bySlug) {
    const own = variants.get(locale);
    const raw = own ?? variants.get(defaultLocale);
    if (raw) pages.push(pageOf(raw, { locale, fallback: !own, basePath, rootGroupTitle }));
  }
  // Groups by the lowest order of their pages, pages by order then title: the reading order, the one previous / next follows.
  const groupRank = new Map<string, number>();
  for (const p of pages) groupRank.set(p.group, Math.min(groupRank.get(p.group) ?? Number.POSITIVE_INFINITY, p.order));
  const collator = new Intl.Collator(locale);
  const groupNames = [...groupRank.keys()].sort((a, b) => (groupRank.get(a) ?? 0) - (groupRank.get(b) ?? 0) || collator.compare(a, b));
  const inGroup = (g: string) => pages.filter((p) => p.group === g).sort((a, b) => (a.order === b.order ? collator.compare(a.title, b.title) : a.order - b.order));
  const ordered = groupNames.flatMap(inGroup);
  const groups = groupNames.map((g, i) => ({ id: slugId(g) || `group-${i}`, title: g, items: inGroup(g).map((p) => ({ href: p.href, label: p.title })) }));

  return {
    locale,
    locales,
    pages: ordered,
    groups,
    page(slug) {
      const index = ordered.findIndex((p) => p.slug === slug);
      const page = ordered[index];
      if (!page) return undefined;
      const prev = ordered[index - 1];
      const next = ordered[index + 1];
      return {
        ...page,
        toc: { items: page.headings.filter((h) => h.depth === 2).map(({ id, label }) => ({ id, label })) },
        pager: { ...(prev && { previous: { href: prev.href, title: prev.title } }), ...(next && { next: { href: next.href, title: next.title } }) },
        breadcrumb: [{ href: basePath || "/", label: homeLabel }, ...(slug ? [{ href: page.href, label: page.title }] : [])],
      };
    },
  };
}
