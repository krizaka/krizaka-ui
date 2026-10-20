import { DocsBody, DocsPage } from "fumadocs-ui/layouts/docs/page";
import type { Metadata } from "next";

import { getSource, pageText } from "@/lib/docs-source";
import { getDictionary, type Locale } from "@/lib/i18n";
import { localizedMetadata } from "@/lib/seo";
import { buildBreadcrumbJsonLd, buildTechArticleJsonLd } from "@/lib/structured-data";
import { absoluteUrl } from "@/lib/urls";

import { JsonLd } from "../JsonLd";
import { Landing } from "./Landing";

/* The home, on its own route (app/(en)/page.tsx, app/(fr)/fr/page.tsx): a route ships the client code of everything its
   pages may render, so the home imports the landing only — not the component pages, the catalogue or the docs. Its
   title, description and search words still come from content/docs/index.mdx. */

function homeText(locale: Locale) {
  const page = getSource(locale).getPage([]);
  if (!page) throw new Error("content/docs/index.mdx is missing: the home has no title");
  return pageText(page, getDictionary(locale));
}

export function homeMetadata(locale: Locale): Metadata {
  const { description } = homeText(locale);
  const title = getDictionary(locale).site.meta.title;
  // The home names the site itself (no « · Krizaka UI » template).
  return { ...localizedMetadata(locale, { path: "/", title, description }), title: { absolute: title } };
}

export function HomePageView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const { title, description } = homeText(locale);
  const url = absoluteUrl(locale, "/");
  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd([{ name: t.docs.sections.ui.title, url }])} />
      <JsonLd data={buildTechArticleJsonLd({ locale, title, description, url })} />
      <DocsPage full toc={[]} breadcrumb={{ enabled: false }} footer={{ enabled: false }}>
        <DocsBody>
          <Landing locale={locale} />
        </DocsBody>
      </DocsPage>
    </>
  );
}
