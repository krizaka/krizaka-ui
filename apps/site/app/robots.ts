import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";
import { AI_CRAWLERS } from "@/scripts/check-seo-family.mjs";

export const dynamic = "force-static";

/* Indexed, AI crawlers welcome by name (the family contract, krizaka-com AGENTS.md §2.4 — the list is the checker's). */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }, ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/" }))],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
