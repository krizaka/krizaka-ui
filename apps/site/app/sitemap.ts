import type { MetadataRoute } from "next";

import { allDocsPaths } from "@/lib/docs-source";
import { absoluteUrl } from "@/lib/urls";

export const dynamic = "force-static";

/* Every page in both languages, each with its hreflang alternates (English at the path, French under /fr). */
export default function sitemap(): MetadataRoute.Sitemap {
  return allDocsPaths().flatMap((path) => {
    const languages = { en: absoluteUrl("en", path), "fr-CA": absoluteUrl("fr", path), "x-default": absoluteUrl("en", path) };
    const priority = path === "/" ? 1 : path.startsWith("/components/") ? 0.7 : 0.8;
    return (["en", "fr"] as const).map((locale) => ({ url: absoluteUrl(locale, path), changeFrequency: "weekly" as const, priority, alternates: { languages } }));
  });
}
