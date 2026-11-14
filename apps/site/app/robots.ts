import type { MetadataRoute } from "next";

import { AI_CRAWLERS } from "@/lib/ai-crawlers";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

/* Indexed, AI crawlers welcome by name (the family contract, krizaka-com AGENTS.md §2.4 — the list is checked on the export by krizaka-seo-family). */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }, ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/" }))],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
