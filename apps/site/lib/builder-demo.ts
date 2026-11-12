/* The data of the live demo at /builder: the blocks of the starter page, the page itself, the three canned attacks and the
   checks. Pure (no React, no DOM): the editor (app/components/builder) and tests/builder-demo.test.mjs read the same file.
   The document format, its validator and the locale resolution are @krizaka/ui-builder's (npm, never a copy). */

import {
  type Block,
  type ComposerDocument,
  defineBlocks,
  type DocumentIssue,
  fromPuckData,
  listFallbacks,
  type LocalizedText,
  resolveLocalized,
  validateDocument,
} from "@krizaka/ui-builder/document";

/** The languages of the content (the page's own language is the one it opens in). */
export const CONTENT_LOCALES = ["en", "fr"] as const;
export type ContentLocale = (typeof CONTENT_LOCALES)[number];
export const DEFAULT_CONTENT_LOCALE: ContentLocale = "en";

/** The blocks of the demo: the editor's config and the validator read this one object. */
export const BLOCKS = defineBlocks({
  blocks: {
    Hero: {
      fields: {
        eyebrow: { type: "localized", maxLength: 60 },
        title: { type: "localized", maxLength: 120 },
        lead: { type: "localized", maxLength: 280 },
        primary: { type: "localized", maxLength: 40 },
        secondary: { type: "localized", maxLength: 40 },
        align: { type: "enum", options: ["left", "center"] },
      },
    },
    Features: {
      fields: {
        heading: { type: "localized", maxLength: 80 },
        items: { type: "slot", allow: ["Feature"], max: 6, maxDepth: 1 },
      },
    },
    Feature: {
      fields: {
        title: { type: "localized", maxLength: 60 },
        body: { type: "localized", maxLength: 200 },
      },
    },
    Quote: {
      fields: {
        text: { type: "localized", maxLength: 240 },
        author: { type: "localized", maxLength: 80 },
      },
    },
    CallToAction: {
      fields: {
        title: { type: "localized", maxLength: 100 },
        label: { type: "localized", maxLength: 40 },
      },
    },
  },
});

export type BlockType = keyof typeof BLOCKS.blocks;

/** Puck's own shape for a page: what the editor holds and hands back. */
export type PageData = {
  root: { props: Record<string, unknown> };
  content: { type: string; props: { id: string; [prop: string]: unknown } }[];
};

const words = (en: string, fr: string): LocalizedText => ({ en, fr });

/** The starter page: a neighbourhood bakery's booking page, in both languages. */
export function starterPage(): PageData {
  return {
    root: { props: {} },
    content: [
      {
        type: "Hero",
        props: {
          id: "hero",
          eyebrow: words("Bakery · Montréal", "Boulangerie · Montréal"),
          title: words("Bread, baked at five.", "Du pain, cuit à cinq heures."),
          lead: words(
            "Sourdough, rye and croissants from a wood-fired oven. Order the night before, collect it warm.",
            "Levain, seigle et croissants sortis d’un four à bois. Commandez la veille, récupérez-le chaud.",
          ),
          primary: words("Order for tomorrow", "Commander pour demain"),
          secondary: words("See the opening hours", "Voir les heures d’ouverture"),
          align: "left",
        },
      },
      {
        type: "Features",
        props: {
          id: "features",
          heading: words("What we bake", "Ce que nous cuisons"),
          items: [
            {
              type: "Feature",
              props: {
                id: "feature-sourdough",
                title: words("Sourdough", "Levain"),
                body: words("A starter fed every day since 2019, a 36-hour rise.", "Un levain nourri chaque jour depuis 2019, une pousse de 36 heures."),
              },
            },
            {
              type: "Feature",
              props: {
                id: "feature-rye",
                title: words("Rye and seeds", "Seigle et graines"),
                body: words("Dense, sweet, keeps a week. Milled in Québec.", "Dense, sucré, se garde une semaine. Moulu au Québec."),
              },
            },
            {
              type: "Feature",
              props: {
                id: "feature-pastry",
                title: words("Viennoiserie", "Viennoiserie"),
                body: words("Butter croissants, laminated by hand every morning.", "Croissants au beurre, laminés à la main chaque matin."),
              },
            },
          ],
        },
      },
      {
        type: "Quote",
        props: {
          id: "quote",
          text: words("The only place where the line is part of the pleasure.", "Le seul endroit où la file d’attente fait partie du plaisir."),
          author: words("Camille, neighbour since 2021", "Camille, voisine depuis 2021"),
        },
      },
      {
        type: "CallToAction",
        props: {
          id: "cta",
          title: words("Tomorrow’s loaves are open for order until 8 pm.", "Les pains de demain se commandent jusqu’à 20 h."),
          label: words("Order now", "Commander maintenant"),
        },
      },
    ],
  };
}

/** Puck keeps an empty slot as `[]`; the document has no prop for a slot, so an empty one is left out. */
function withoutEmptySlots(content: PageData["content"]): PageData["content"] {
  return content.map((component) => ({
    ...component,
    props: Object.fromEntries(
      Object.entries(component.props)
        .filter(([, value]) => !(Array.isArray(value) && value.length === 0))
        .map(([name, value]) => [name, isComponents(value) ? withoutEmptySlots(value) : value]),
    ) as PageData["content"][number]["props"],
  }));
}

const isComponents = (value: unknown): value is PageData["content"] =>
  Array.isArray(value) && value.length > 0 && value.every((v) => typeof v === "object" && v !== null && "type" in v && "props" in v);

/** The editor's page as a `ComposerDocument` (schema 2), in the demo's two languages. */
export function toDocument(data: PageData): ComposerDocument {
  const doc = fromPuckData({ root: data.root, content: withoutEmptySlots(data.content) }, DEFAULT_CONTENT_LOCALE);
  return { ...doc, locales: [...CONTENT_LOCALES], defaultLocale: DEFAULT_CONTENT_LOCALE };
}

export type Verdict = { ok: true } | { ok: false; issues: readonly DocumentIssue[] };

/** The same `validateDocument` a server would run before storing, against the demo's blocks. */
export function checkDocument(input: unknown): Verdict {
  const result = validateDocument(input, { registry: BLOCKS });
  return result.ok ? { ok: true } : { ok: false, issues: result.issues };
}

/** The paths of the words with no text in `locale`, which a host would show in the default language instead. */
export function missingTranslations(doc: ComposerDocument, locale: ContentLocale): string[] {
  return listFallbacks(doc, locale);
}

/** The words for a locale, and whether they are the default language's (the French is missing). */
export function wordsFor(value: unknown, locale: ContentLocale): { text: string; fallback: boolean } {
  if (typeof value !== "object" || value === null) return { text: "", fallback: false };
  const resolved = resolveLocalized(value as LocalizedText, locale, { defaultLocale: DEFAULT_CONTENT_LOCALE });
  return { text: resolved?.text ?? "", fallback: resolved?.fallback ?? false };
}

/** The «try to break it» row: each attack takes the current valid document and returns a hostile copy of it. */
export const ATTACKS = ["script", "handler", "proto"] as const;
export type AttackId = (typeof ATTACKS)[number];

const withFirstBlock = (doc: ComposerDocument, change: (block: Block) => Block): ComposerDocument => ({
  ...doc,
  blocks: doc.blocks.map((block, index) => (index === 0 ? change(block) : block)),
});

export function attack(id: AttackId, doc: ComposerDocument): unknown {
  switch (id) {
    case "script":
      return withFirstBlock(doc, (block) => ({ ...block, props: { ...block.props, title: words("<script>alert(1)</script>", "Du pain") } }));
    case "handler":
      return withFirstBlock(doc, (block) => ({ ...block, props: { ...block.props, onClick: "alert(1)" } }));
    // The key arrives from JSON.parse, as it does from a request body: an own `__proto__` property, not a prototype.
    case "proto":
      return { ...JSON.parse('{"__proto__":{"isAdmin":true}}'), ...doc };
  }
}

/** The text of a refusal, for display: `path — code — message`. */
export const describeIssue = (issue: DocumentIssue): string => `${issue.path || "(document)"} — ${issue.code} — ${issue.message}`;

/** The document as the panel shows it. */
export const documentJson = (doc: unknown): string => JSON.stringify(doc, null, 2);
