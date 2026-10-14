import type { Metadata } from "next";

import { SITE_URL } from "@/lib/site";
import { absoluteUrl } from "@/lib/urls";

type Locale = "fr" | "en";

/**
 * Self-referential canonical + hreflang alternates for one page of ui.krizaka.com: English at the path, French under
 * /fr, `x-default` → English. `path` has no locale ("/" for the home, else "/components/button").
 */
export function buildAlternates(locale: Locale, path: string): NonNullable<Metadata["alternates"]> {
  return {
    canonical: absoluteUrl(locale, path),
    languages: { en: absoluteUrl("en", path), "fr-CA": absoluteUrl("fr", path), "x-default": absoluteUrl("en", path) },
    // For AI engines: the machine-readable summary of the site, advertised in every page's <head>.
    types: { "text/plain": `${SITE_URL}/llms.txt` },
  };
}

/** Per-page metadata: the locale's copy, canonical + hreflang, and the Open Graph / Twitter card of the page. */
export function localizedMetadata(locale: Locale, opts: { path: string; title: string; description: string }): Metadata {
  const url = absoluteUrl(locale, opts.path);
  return {
    title: opts.title,
    description: opts.description,
    alternates: buildAlternates(locale, opts.path),
    openGraph: { title: opts.title, description: opts.description, url, type: "article" },
    twitter: { card: "summary_large_image", title: opts.title, description: opts.description },
  };
}
