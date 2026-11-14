/* The crawlers robots.txt welcomes by name: the family's AI-crawler list. `krizaka-seo-family` (the bin of `@krizaka/config`) fails CI
   on the built export if one of them has no group in robots.txt, so this list cannot drift from the family's. */
export const AI_CRAWLERS: readonly string[] = [
  "Googlebot",
  "Google-Extended",
  "Bingbot",
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "Perplexity-User",
  "Claude-SearchBot",
  "Claude-User",
  "ClaudeBot",
  "anthropic-ai",
  "Applebot",
  "Applebot-Extended",
  "CCBot",
];
