import type { MDXComponents } from "mdx/types";
import type { AnchorHTMLAttributes } from "react";

import type { Locale } from "@/lib/i18n";
import { resolveDocHref } from "@/lib/urls";

import { ComponentCatalog } from "./ComponentCatalog";
import { ComponentHero } from "./ComponentHero";
import { defaultMdxComponents } from "./fumadocs/server";

/** The components a written page may use, and its links in the reader's language (lib/urls.ts). */
export function getMdxComponents(locale: Locale): MDXComponents {
  const Anchor = defaultMdxComponents.a;
  return {
    ...defaultMdxComponents,
    a: ({ href, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) => <Anchor href={resolveDocHref(href, locale)} {...props} />,
    ComponentCatalog: () => <ComponentCatalog locale={locale} />,
    ComponentHero: () => <ComponentHero locale={locale} />,
  };
}
