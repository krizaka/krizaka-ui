import { tokens } from "@krizaka/tokens";
import { createSearchAPI } from "fumadocs-core/search/server";

import { type ComponentPageData, getSource, pageText } from "@/lib/docs-source";
import { getDictionary, type Locale } from "@/lib/i18n";
import { componentSearchContents, type SearchContent, tokenSearchContents } from "@/lib/search-extra";
import { getRegistryItem } from "@/lib/ui-registry";

type StructuredData = { headings: { id: string; content: string }[]; contents: { heading: string | undefined; content: string }[] };

const TOKENS_PAGE = "foundations/tokens";

/** A page's prose (its MDX, if any) plus the words the search reads beyond it (lib/search-extra.ts). */
function withExtra(data: StructuredData | undefined, extra: SearchContent[]): StructuredData {
  return { headings: data?.headings ?? [], contents: [...(data?.contents ?? []), ...extra.map((c) => ({ heading: c.heading, content: c.content }))] };
}

/** The search index of one language, built once at build time and downloaded by the search dialog (no server). A component
    page is found by its synonyms, props and examples; the tokens page by every --kz-* name. */
export function searchIndex(locale: Locale) {
  const t = getDictionary(locale);
  return createSearchAPI("advanced", {
    language: "english",
    indexes: getSource(locale)
      .getPages()
      .map((page) => {
        const { title, description } = pageText(page, t);
        const { component } = page.data as ComponentPageData;
        const own = (page.data as { structuredData?: StructuredData }).structuredData;
        const extra = component ? componentSearchContents(getRegistryItem(component)) : page.slugs.join("/") === TOKENS_PAGE ? tokenSearchContents(tokens) : [];
        return { id: page.url, title, description, url: page.url, structuredData: withExtra(own, extra) };
      }),
  });
}
