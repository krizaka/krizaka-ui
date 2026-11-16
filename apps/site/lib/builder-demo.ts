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
/** The language that may be missing on a page whose default language is `locale`: the other one. */
const OTHER_LOCALE: Record<ContentLocale, ContentLocale> = { en: "fr", fr: "en" };
export const otherLocale = (locale: ContentLocale): ContentLocale => OTHER_LOCALE[locale];

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

/** The starter page: a dog walker's booking page, in both languages. */
export function starterPage(): PageData {
  return {
    root: { props: {} },
    content: [
      {
        type: "Hero",
        props: {
          id: "hero",
          eyebrow: words("Dog walker · Montréal", "Promeneur de chiens · Montréal"),
          title: words("Your dog’s walk, on time.", "La promenade de votre chien, à l’heure."),
          lead: words(
            "Small groups of four dogs at most, in the parks of Plateau and Mile End. Book a slot, get a photo at the end of the walk.",
            "Des groupes de quatre chiens au plus, dans les parcs du Plateau et du Mile End. Réservez un créneau, recevez une photo à la fin de la promenade.",
          ),
          primary: words("Book a walk", "Réserver une promenade"),
          secondary: words("See the rounds", "Voir les tournées"),
          align: "left",
        },
      },
      {
        type: "Features",
        props: {
          id: "features",
          heading: words("What I offer", "Ce que je propose"),
          items: [
            {
              type: "Feature",
              props: {
                id: "feature-group",
                title: words("Group walk", "Promenade en groupe"),
                body: words("One hour in the park, four dogs at most, picked up and brought back to your door.", "Une heure au parc, quatre chiens au plus, récupéré et ramené à votre porte."),
              },
            },
            {
              type: "Feature",
              props: {
                id: "feature-solo",
                title: words("Solo walk", "Promenade en solo"),
                body: words("For a puppy, a senior or a shy dog: your dog has the whole walk to itself.", "Pour un chiot, un chien âgé ou craintif : votre chien a toute la promenade pour lui."),
              },
            },
            {
              type: "Feature",
              props: {
                id: "feature-visit",
                title: words("Midday visit", "Visite du midi"),
                body: words("Fifteen minutes at home: water, a short outing, a message when it is done.", "Quinze minutes à la maison : de l’eau, une courte sortie, un message quand c’est fait."),
              },
            },
          ],
        },
      },
      {
        type: "Quote",
        props: {
          id: "quote",
          text: words("Biscuit comes home tired and happy, and I get the photo at 12:30.", "Biscuit rentre fatigué et heureux, et je reçois la photo à 12 h 30."),
          author: words("Camille, Biscuit’s owner", "Camille, propriétaire de Biscuit"),
        },
      },
      {
        type: "CallToAction",
        props: {
          id: "cta",
          title: words("Next week’s walks are open for booking until Friday.", "Les promenades de la semaine prochaine se réservent jusqu’à vendredi."),
          label: words("Book now", "Réserver maintenant"),
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
export function toDocument(data: PageData, defaultLocale: ContentLocale = DEFAULT_CONTENT_LOCALE): ComposerDocument {
  const doc = fromPuckData({ root: data.root, content: withoutEmptySlots(data.content) }, defaultLocale);
  return { ...doc, locales: [...CONTENT_LOCALES], defaultLocale };
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
export function wordsFor(value: unknown, locale: ContentLocale, defaultLocale: ContentLocale = DEFAULT_CONTENT_LOCALE): { text: string; fallback: boolean } {
  if (typeof value !== "object" || value === null) return { text: "", fallback: false };
  const resolved = resolveLocalized(value as LocalizedText, locale, { defaultLocale });
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

/** The raw text of a refusal, for the collapsible block: `path — code — message`. */
export const describeIssue = (issue: DocumentIssue): string => `${issue.path || "(document)"} — ${issue.code} — ${issue.message}`;

/** The document as the panel shows it. */
export const documentJson = (doc: unknown): string => JSON.stringify(doc, null, 2);

/* ── One verdict, in words ────────────────────────────────────────────────────────────────────────────────────────── */

export type VerdictState = "valid" | "refused" | "refused-as-expected";

/** What the page says about the JSON it shows: the attacked copy when an attack is picked, else the editor's document. */
export function verdictOf(doc: ComposerDocument, picked: AttackId | null): { shown: unknown; state: VerdictState | "accepted"; issues: readonly DocumentIssue[] } {
  const shown = picked ? attack(picked, doc) : doc;
  const verdict = checkDocument(shown);
  if (verdict.ok) return { shown, state: picked ? "accepted" : "valid", issues: [] };
  return { shown, state: picked ? "refused-as-expected" : "refused", issues: verdict.issues };
}

/** The plural category of a count in a language: French has « one » at 0 and 1, English at 1 only. */
export function pluralForm(count: number, locale: string): "one" | "other" {
  return new Intl.PluralRules(locale).select(count) === "one" ? "one" : "other";
}

export type Forms = { readonly one: string; readonly other: string };
export const pluralOf = (forms: Forms, count: number, locale: string): string => forms[pluralForm(count, locale)];

/** The words the sentences need: the site's `site.builder` messages and the language of the page. */
export type SentenceWords = {
  readonly locale: string;
  readonly editor: Readonly<Record<string, string>>;
  readonly report: {
    readonly document: string;
    readonly slotItem: string;
    readonly path: string;
    readonly pathLocale: string;
    readonly sentence: string;
    readonly languages: Readonly<Record<string, string>>;
    readonly reasons: Readonly<Record<"unsafe_text" | "unsafe_handler" | "unsafe_key" | "proto" | "limit" | "unknown_prop" | "other", string>>;
    readonly fallback: string;
  };
};

const fill = (template: string, values: Record<string, string | number>): string => template.replaceAll(/\{(\w+)\}/g, (whole, name: string) => String(values[name] ?? whole));
const labelOf = (editor: SentenceWords["editor"], key: string): string => editor[key] ?? key;

type Place = { chain: string[]; field?: string; language?: string; key?: string };

/** Where a path points, in words: the chain of blocks (a nested one numbered), the field, the language written. */
function placeOf(path: string, doc: ComposerDocument, words: SentenceWords): Place {
  const parts = path.split(".");
  const chain: string[] = [];
  if (parts[0] !== "blocks") return { chain };
  // parts: blocks.<n>, then props.<name>[.<locale>] or slots.<slot>.<n> followed by the same, one level down.
  let list: readonly Block[] = doc.blocks;
  let nested = false;
  let i = 1;
  for (;;) {
    const index = Number(parts[i]);
    const block: Block | undefined = list[index];
    if (!block) return { chain };
    const name = labelOf(words.editor, `block-${block.type}`);
    chain.push(nested ? fill(words.report.slotItem, { block: name, number: index + 1 }) : name);
    i += 1;
    if (parts[i] === "slots" && parts[i + 1] !== undefined) {
      list = block.slots?.[parts[i + 1] as string] ?? [];
      nested = true;
      i += 2;
      continue;
    }
    return parts[i] === "props" ? propPlace(chain, parts[i + 1], parts[i + 2]) : { chain };
  }
}

/** The field (and the language written) a `props.<name>[.<locale>]` path ends in. */
function propPlace(chain: string[], field: string | undefined, rest: string | undefined): Place {
  if (field === undefined) return { chain };
  const localized = rest !== undefined && (CONTENT_LOCALES as readonly string[]).includes(rest);
  return { chain, field, key: field, language: localized ? rest : undefined };
}

const whereOf = (place: Place, words: SentenceWords, withField: boolean): string => {
  const block = place.chain.length ? place.chain.join(" › ") : words.report.document;
  if (!withField || !place.field) return block;
  const field = labelOf(words.editor, `field-${place.field}`);
  const language = place.language && words.report.languages[place.language];
  return fill(language ? words.report.pathLocale : words.report.path, { where: block, field, language: language ?? "" });
};

const keyReason = (key: string, code: "unsafe_key" | "unknown_prop", reasons: SentenceWords["report"]["reasons"]): string => {
  if (key === "__proto__") return reasons.proto;
  if (/^on[A-Z]/.test(key)) return reasons.unsafe_handler;
  return reasons[code];
};

/** A refusal as a sentence: « Bandeau d’accueil › Titre (anglais) : ce texte contient une balise… ». */
export function explainIssue(issue: DocumentIssue, doc: ComposerDocument, words: SentenceWords): string {
  const place = placeOf(issue.path, doc, words);
  const { reasons } = words.report;
  const sentence = (where: string, reason: string) => fill(words.report.sentence, { where, reason });
  if (issue.path === "") {
    const key = /"([^"]+)"/.exec(issue.message)?.[1];
    if (key === "__proto__") return sentence(words.report.document, fill(reasons.proto, { key }));
    if (key) return sentence(words.report.document, fill(reasons.unsafe_key, { key }));
    return sentence(words.report.document, reasons.other);
  }
  switch (issue.code) {
    case "unsafe_text":
      return sentence(whereOf(place, words, true), reasons.unsafe_text);
    case "unsafe_key":
    case "unknown_prop": {
      const key = place.key ?? "";
      return sentence(whereOf(place, words, false), fill(keyReason(key, issue.code, reasons), { key }));
    }
    case "limit":
      return sentence(whereOf(place, words, true), reasons.limit);
    default:
      return sentence(whereOf(place, words, true), reasons.other);
  }
}

/** A missing translation as a sentence: « Bandeau d’accueil › Surtitre : pas de français, la page affiche l’anglais. » */
export function explainFallback(path: string, doc: ComposerDocument, words: SentenceWords): string {
  const place = placeOf(path, doc, words);
  return fill(words.report.sentence, { where: whereOf({ ...place, language: undefined }, words, true), reason: words.report.fallback });
}
