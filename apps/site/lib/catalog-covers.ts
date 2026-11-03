/* What the catalogue's cards show live, as data the tests read (no alias import). A card's preview never calls a third party:
   /components would load it for every visitor, and the page would never settle (krizaka-internal#2285: the abuse family's cover
   was Captcha's form, Cloudflare Turnstile kept a request open and the layout crawl timed out). Such an example stays on its
   component's page, where the reader opens it. */

/** Examples that load a third-party script when they render: never a card's or a family's preview. */
export const THIRD_PARTY_EXAMPLES: ReadonlySet<string> = new Set(["captcha/form"]);

/** The component whose example stands for its family on the family's card (its first previewable web example unless named). */
export const FAMILY_COVERS: Record<string, { component: string; example?: string; scale?: number }> = {
  foundations: { component: "button", example: "sizes", scale: 0.65 },
  forms: { component: "date-picker", example: "calendar" },
  "data-display": { component: "stat", example: "grid" },
  "navigation-shell": { component: "nav-bar", example: "site" },
  feedback: { component: "alert", example: "warning", scale: 0.7 },
  maps: { component: "map", example: "places" },
  media: { component: "video-player", example: "default" },
  "page-blocks": { component: "cta-panel", example: "discuss" },
  abuse: { component: "captcha", example: "disclosure", scale: 0.7 },
};

/** The first example of a list that a card may show live. */
export function previewExample<T>(examples: readonly T[], keyOf: (example: T) => string): T | undefined {
  return examples.find((example) => !THIRD_PARTY_EXAMPLES.has(keyOf(example)));
}
