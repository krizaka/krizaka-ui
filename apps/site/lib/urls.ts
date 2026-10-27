/* The addresses of ui.krizaka.com — one place, pure (no React, no filesystem), shared by the sidebar, the written docs'
   links, the sitemap and tests/urls.test.mjs.

     /                          Krizaka UI — what it is, the catalogue
     /installation, /theming    get started
     /foundations/<page>        tokens · typography · icons · motion · navigation · layouts · brand-marks · cahier-site · shop-presets
     /components                the catalogue: every component, filters, live previews
     /components/<name>         one page per component of the registries (@krizaka/ui, @krizaka/charts)
     /templates                 every template; /templates/<intent> one intent
     /packages/<package>        the packages without UI: tailwind · intl · i18n · query · realtime · push · app-config · config
     /platforms                 web · mobile · desktop: the parity matrix, how to install each
     /mobile                    the React Native parity: what differs from the web

   English has no prefix; French is the same address under /fr (/fr/components/button).

   The documentation used to live on www.krizaka.com/docs/ui (and /{en,fr}/docs/ui/…): `pathOfLegacySlug` maps every
   old address to its new one. krizaka.com answers its old URLs with a 308 to that address (the same rule, copied in
   krizaka-com lib/ui-redirects.ts and tested there). */

export const SITE_URL = "https://ui.krizaka.com";

export const GET_STARTED_PAGES = ["installation", "theming"] as const;
export const FOUNDATION_PAGES = ["tokens", "typography", "icons", "motion", "navigation", "layouts", "brand-marks", "cahier-site", "shop-presets"] as const;
export const PACKAGE_PAGES = ["tailwind", "intl", "i18n", "query", "realtime", "push", "app-config", "config"] as const;

/** The path (no locale) of a page of the old /docs/ui, by its slug there (`""` for /docs/ui itself). */
export function pathOfLegacySlug(slug: string): string {
  const clean = slug.replace(/^\/+|\/+$/g, "");
  if (clean === "") return "/";
  if ((GET_STARTED_PAGES as readonly string[]).includes(clean)) return `/${clean}`;
  if ((FOUNDATION_PAGES as readonly string[]).includes(clean)) return `/foundations/${clean}`;
  if ((PACKAGE_PAGES as readonly string[]).includes(clean)) return `/packages/${clean}`;
  if (clean === "mobile") return "/mobile";
  if (clean === "platforms") return "/platforms";
  if (clean === "templates" || clean === "screens") return "/templates";
  if (clean.startsWith("templates-")) return `/templates/${clean.slice("templates-".length)}`;
  return `/components/${clean}`;
}

/** A path of the site in a locale: English unprefixed, French under /fr. */
export function localePath(locale: string, path: string): string {
  const p = path === "/" ? "" : path;
  return locale === "fr" ? `/fr${p}` : p || "/";
}

/**
 * A link written in a doc, in the reader's language: an absolute path of this site (`/components/button`) gets the
 * locale; an old `/docs/ui/…` link is mapped to its new address; anything else (another site, an anchor) is left as is.
 */
export function resolveDocHref(href: string | undefined, locale: string): string | undefined {
  if (!href || !href.startsWith("/") || href.startsWith("//")) return href;
  const [pathPart, hash = ""] = href.split("#");
  const legacy = /^\/docs\/ui(?:\/(.*))?$/.exec(pathPart);
  const path = legacy ? pathOfLegacySlug(legacy[1] ?? "") : pathPart;
  return `${localePath(locale, path)}${hash ? `#${hash}` : ""}`;
}

/** The address of a component's page. */
export const componentPath = (locale: string, name: string) => localePath(locale, `/components/${name}`);

/** The absolute address of a page as the static host serves it (one folder per page: a trailing slash). */
export function absoluteUrl(locale: string, path: string): string {
  const p = localePath(locale, path);
  return `${SITE_URL}${p.endsWith("/") ? p : `${p}/`}`;
}
