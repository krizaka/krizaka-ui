import { CodeBlock } from "@krizaka/ui/code-block";
import { name as BUILDER_NAME, version as BUILDER_VERSION } from "@krizaka/ui-builder/package.json";
import type { Metadata } from "next";

import { format, getDictionary, type Locale } from "@/lib/i18n";
import { localizedMetadata } from "@/lib/seo";
import { KRIZAKA_UI_BUILDER_REPO_URL } from "@/lib/site";
import { buildBreadcrumbJsonLd } from "@/lib/structured-data";
import { absoluteUrl } from "@/lib/urls";

import { DocsBody, DocsPage } from "../docs/fumadocs/server";
import { JsonLd } from "../JsonLd";
import { BuilderDemoLoader } from "./BuilderDemoLoader";

/* /builder and /fr/builder: the live demo of Krizaka UI Builder. The page's words and the way to get the package are
   server-rendered; the editor is a lazy client chunk (BuilderDemoLoader). */

export function builderMetadata(locale: Locale): Metadata {
  const b = getDictionary(locale).site.builder;
  return localizedMetadata(locale, { path: "/builder", title: b.metaTitle, description: b.metaDescription });
}

export function BuilderPageView({ locale }: Readonly<{ locale: Locale }>) {
  const t = getDictionary(locale);
  const b = t.site.builder;
  const url = absoluteUrl(locale, "/builder");
  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd([{ name: t.docs.sections.ui.title, url: absoluteUrl(locale, "/") }, { name: b.eyebrow, url }])} />
      <DocsPage full toc={[]} breadcrumb={{ enabled: false }} footer={{ enabled: false }}>
        <DocsBody>
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6">
            <header className="grid gap-3">
              <p className="text-sm font-semibold text-fg-accent">{b.eyebrow}</p>
              <h1 className="max-w-3xl text-3xl font-bold text-fg sm:text-4xl">{b.title}</h1>
              <p className="max-w-3xl text-lg text-fg-secondary">{format(b.lead, { version: BUILDER_VERSION })}</p>
              <p className="text-sm font-medium text-fg">{b.nothingSaved}</p>
            </header>

            <BuilderDemoLoader />

            <section aria-labelledby="builder-get" className="grid max-w-3xl gap-3">
              <h2 id="builder-get" className="text-xl font-bold text-fg">
                {b.get.title}
              </h2>
              <p className="text-fg-secondary">{b.get.lead}</p>
              <CodeBlock code={b.get.install} language="bash" file={b.get.installLabel} />
              <p className="flex flex-wrap gap-x-5 gap-y-1">
                <a className="font-medium text-fg-accent underline underline-offset-4" href={KRIZAKA_UI_BUILDER_REPO_URL}>
                  {b.get.github}
                </a>
                <a className="font-medium text-fg-accent underline underline-offset-4" href={`https://www.npmjs.com/package/${BUILDER_NAME}`}>
                  {b.get.npm}
                </a>
              </p>
              <p className="text-sm text-fg-secondary">{b.get.licence}</p>
            </section>
          </div>
        </DocsBody>
      </DocsPage>
    </>
  );
}
