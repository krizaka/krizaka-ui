import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/layouts/docs/page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { type ComponentPageData, type DocsPage as Page, getSource, pageText } from "@/lib/docs-source";
import { getDictionary, type Locale } from "@/lib/i18n";
import { localizedMetadata } from "@/lib/seo";
import { buildBreadcrumbJsonLd, buildTechArticleJsonLd } from "@/lib/structured-data";
import { ICONS_PAGE, purposeOf,TYPOGRAPHY_PAGE } from "@/lib/ui-foundations";
import { BRAND_PAGE, MOBILE_PAGE, TEMPLATE_PAGE } from "@/lib/ui-ia";
import { getRegistryItem } from "@/lib/ui-registry";
import { absoluteUrl } from "@/lib/urls";

import { JsonLd } from "../JsonLd";
import { Landing } from "../landing/Landing";
import { BrandMarksDoc } from "./BrandMarksDoc";
import { ComponentDoc, componentToc } from "./ComponentDoc";
import { IconsDoc, iconsToc } from "./IconsDoc";
import { InlineCode } from "./InlineCode";
import { getMdxComponents } from "./mdx";
import { MobileDoc } from "./MobileDoc";
import { TemplatesDoc, templatesToc } from "./TemplatesDoc";
import { TypographyDoc, typographyToc } from "./TypographyDoc";

/* Every page of ui.krizaka.com, in one language: the routes (app/(en)/[[...slug]], app/(fr)/fr/[[...slug]]) only say
   which language and which page. */

/** Every page's slugs, for generateStaticParams (the same pages in both languages). */
export function docsStaticParams(locale: Locale) {
  return getSource(locale)
    .getPages()
    .map((page) => ({ slug: page.slugs }));
}

function resolve(locale: Locale, slug: string[] = []): Page {
  const page = getSource(locale).getPage(slug);
  if (!page) notFound();
  return page;
}

const pathOf = (slug: string[] = []) => (slug.length ? `/${slug.join("/")}` : "/");

export function docsMetadata(locale: Locale, slug: string[] = []): Metadata {
  const page = resolve(locale, slug);
  const t = getDictionary(locale);
  const text = pageText(page, t);
  // The home names the site itself; every other page is "<page> · Krizaka UI" (the layout's template).
  const title = slug.length ? text.title : { absolute: t.site.meta.title };
  return { ...localizedMetadata(locale, { path: pathOf(slug), title: slug.length ? text.title : t.site.meta.title, description: text.description }), title };
}

/* A page plus its JSON-LD — a BreadcrumbList (Krizaka UI › page) and a TechArticle. */
export function DocsPageView({ locale, slug = [] }: { locale: Locale; slug?: string[] }) {
  const page = resolve(locale, slug);
  const t = getDictionary(locale);
  const own = pageText(page, t);
  const url = absoluteUrl(locale, pathOf(slug));
  const trail = [{ name: t.docs.sections.ui.title, url: absoluteUrl(locale, "/") }, ...(slug.length ? [{ name: own.title, url }] : [])];
  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(trail)} />
      <JsonLd data={buildTechArticleJsonLd({ locale, title: own.title, description: own.description, url })} />
      <PageBody locale={locale} page={page} />
    </>
  );
}

async function PageBody({ locale, page }: { locale: Locale; page: Page }) {
  const t = getDictionary(locale);
  const { title, description } = pageText(page, t);
  const { component, foundation } = page.data as ComponentPageData;

  // A component of the registry: generated from its code; an enrichment MDX, if any, becomes its notes.
  if (component) {
    const Notes = "body" in page.data ? page.data.body : undefined;
    return (
      <DocsPage toc={componentToc(component, t, Boolean(Notes))}>
        <DocsTitle>{title}</DocsTitle>
        <DocsDescription>
          <InlineCode text={getRegistryItem(component).summary} />
        </DocsDescription>
        <DocsBody>
          <ComponentDoc name={component} locale={locale} notes={Notes && <Notes components={getMdxComponents(locale)} />} />
        </DocsBody>
      </DocsPage>
    );
  }

  // A page laid out from the packages' data: typography, icons, brand marks, templates, the mobile parity.
  if (foundation) {
    const purpose = purposeOf(foundation);
    const templates = foundation === TEMPLATE_PAGE || purpose !== null;
    const toc = foundation === ICONS_PAGE ? iconsToc(t) : templates ? templatesToc(t, purpose ?? undefined) : foundation === TYPOGRAPHY_PAGE ? typographyToc(t) : [];
    return (
      <DocsPage toc={toc} full={purpose !== null}>
        <DocsTitle>{title}</DocsTitle>
        <DocsDescription>{description}</DocsDescription>
        <DocsBody>
          {foundation === ICONS_PAGE ? (
            <IconsDoc locale={locale} />
          ) : templates ? (
            <TemplatesDoc locale={locale} purpose={purpose ?? undefined} />
          ) : foundation === MOBILE_PAGE ? (
            <MobileDoc locale={locale} />
          ) : foundation === BRAND_PAGE ? (
            <BrandMarksDoc locale={locale} />
          ) : (
            <TypographyDoc locale={locale} />
          )}
        </DocsBody>
      </DocsPage>
    );
  }

  // The home: a designed page (app/components/landing), the whole width, no table of contents.
  if (page.slugs.length === 0) {
    return (
      <DocsPage full toc={[]} breadcrumb={{ enabled: false }} footer={{ enabled: false }}>
        <DocsBody>
          <Landing locale={locale} />
        </DocsBody>
      </DocsPage>
    );
  }

  const MDX = page.data.body;
  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{title}</DocsTitle>
      <DocsDescription>{description}</DocsDescription>
      <DocsBody>
        <MDX components={getMdxComponents(locale)} />
      </DocsBody>
    </DocsPage>
  );
}
