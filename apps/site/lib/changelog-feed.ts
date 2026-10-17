import { changelogRss } from "@krizaka/ui/changelog-page";

import { loadReleases } from "./changelog";
import { getDictionary, type Locale } from "./i18n";
import { absoluteUrl } from "./urls";

/** The changelog as RSS 2.0, in a language. */
export async function changelogFeed(locale: Locale): Promise<Response> {
  const c = getDictionary(locale).site.changelog;
  const page = absoluteUrl(locale, "/changelog");
  const xml = changelogRss({
    releases: await loadReleases(),
    title: c.feedTitle,
    description: c.feedDescription,
    siteUrl: absoluteUrl(locale, "/"),
    pageUrl: page,
    feedUrl: `${page}feed.xml`,
    language: c.langTag,
    tagLabel: c.tags,
  });
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}


