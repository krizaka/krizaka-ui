import { createSearchAPI } from "fumadocs-core/search/server";

import { getSource, pageText } from "@/lib/docs-source";
import { getDictionary, type Locale } from "@/lib/i18n";

/** The search index of one language, built once at build time and downloaded by the search dialog (no server). */
export function searchIndex(locale: Locale) {
  const t = getDictionary(locale);
  return createSearchAPI("advanced", {
    language: "english",
    indexes: getSource(locale)
      .getPages()
      .map((page) => {
        const { title, description } = pageText(page, t);
        return { id: page.url, title, description, url: page.url, structuredData: page.data.structuredData };
      }),
  });
}
