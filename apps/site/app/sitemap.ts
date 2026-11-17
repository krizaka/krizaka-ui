import type { MetadataRoute } from "next";

import { allDocsPaths } from "@/lib/docs-source";
import { absoluteUrl } from "@/lib/urls";

export const dynamic = "force-static";

/* Every page in both languages, each with its hreflang alternates (English at the path, French under /fr). */
/** The day of the build: every page is regenerated from the packages at each deployment. */
const BUILT = new Date().toISOString().slice(0, 10);

function pagePriority(path: string): number {
  if (path === "/") return 1;
  return path.startsWith("/components/") ? 0.7 : 0.8;
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [...allDocsPaths(), "/changelog", "/builder"].flatMap((path) => {
    const languages = { en: absoluteUrl("en", path), "fr-CA": absoluteUrl("fr", path), "x-default": absoluteUrl("en", path) };
    const priority = pagePriority(path);
    return (["en", "fr"] as const).map((locale) => ({ url: absoluteUrl(locale, path), lastModified: BUILT, changeFrequency: "weekly" as const, priority, alternates: { languages } }));
  });
}
