// The document a shop page is (ADR-007 §1): an ordered list of sections, each a `type` × `variant` with its settings and
// its blocks. Parsed on write (a route refuses an invalid one, with the path) and on read. The storage is the product's.
import { shopOwnerChoices, shopPresets } from "@krizaka/tokens/shop-presets";
import * as z from "zod/mini";

import { SECTION_DEFINITIONS, type SectionType } from "./catalogue";
import { SHOP_LIMITS } from "./limits";

/** The version of the document's format; migrations are pure functions schema n → n + 1 (`migrate.ts`). */
// @fixed: ADR-007 §1 — the format version of the code, bumped with a migration; not a shop setting.
export const SHOP_SCHEMA_VERSION = 1;

/** A look preset by id and version (`@krizaka/tokens`): `salon-atelier`. The mode is the visitor's, never stored. */
export const presetRef = z.object({
  id: z.string().check(z.regex(/^[a-z]+-[a-z]+$/, "a preset id (trade-name)")),
  version: z.int().check(z.minimum(1)),
});

const sectionUnion = z.discriminatedUnion(
  "type",
  SECTION_DEFINITIONS.map((d) => d.schema) as unknown as [z.ZodMiniObject, ...z.ZodMiniObject[]],
);

export const shopPageSchema = z
  .object({
    schema: z.literal(SHOP_SCHEMA_VERSION),
    preset: presetRef,
    /** Overrides the preset's density. */
    density: z.optional(z.enum(["compact", "airy"])),
    /** One of the accents the look lists as tested (`krizaka`, `akinaza:accent-2`…): the owner's choice within the look. */
    accent: z.optional(z.string().check(z.regex(/^[a-z]+(:accent-2)?$/, "an accent of the look"))),
    /** The owner's title face over the look's (`serif` · `sans` · `poster`, `shopOwnerChoices` of `@krizaka/tokens`). */
    face: z.optional(z.enum(Object.keys(shopOwnerChoices.faces) as [keyof typeof shopOwnerChoices.faces])),
    /** The owner's motion level over the look's (`calm` · `soft` · `editorial` · `lively`): CSS only, still under reduced motion. */
    motion: z.optional(z.enum(Object.keys(shopOwnerChoices.motions) as [keyof typeof shopOwnerChoices.motions])),
    sections: z.array(sectionUnion).check(z.minLength(1), z.maxLength(SHOP_LIMITS.sections)),
  })
  .check(
    z.superRefine((page, ctx) => {
      const add = (path: (string | number)[], message: string) => ctx.issues.push({ code: "custom", message, path, input: page });
      // The look exists at the version named, and the accent is one of its tested list: a document can only wear a proven combination.
      const preset = shopPresets.find((p) => p.id === page.preset.id);
      if (!preset) add(["preset", "id"], `no look preset "${page.preset.id}"`);
      else if (page.preset.version > preset.version) add(["preset", "version"], `${preset.id} has no version ${page.preset.version}`);
      if (preset && page.accent !== undefined && !preset.accents.includes(page.accent)) add(["accent"], `"${page.accent}" is not one of the accents of ${preset.id}`);
      const seen = new Set<string>();
      page.sections.forEach((section, i) => {
        const s = section as { key: string; type: string };
        if (seen.has(s.key)) add(["sections", i, "key"], `the key "${s.key}" is used twice`);
        seen.add(s.key);
        if (s.type === "hero" && i !== 0) add(["sections", i, "type"], "the hero is the first section, and there is only one");
      });
    }),
  );

/** A section of any type, as parsed: its `settings` and `blocks` are the type's own. */
export type Section = z.output<(typeof SECTION_DEFINITIONS)[number]["schema"]>;
export type ShopPage = {
  schema: typeof SHOP_SCHEMA_VERSION;
  preset: z.output<typeof presetRef>;
  density?: "compact" | "airy" | undefined;
  accent?: string | undefined;
  face?: keyof typeof shopOwnerChoices.faces | undefined;
  motion?: keyof typeof shopOwnerChoices.motions | undefined;
  sections: Section[];
};
export type SectionOf<T extends SectionType> = Extract<Section, { type: T }>;

export type ShopPageIssue = { path: string; message: string };
export type ShopPageResult = { ok: true; page: ShopPage } | { ok: false; issues: ShopPageIssue[] };

/** Validates a document; an invalid one answers every issue with its path (`sections.2.variant`), for a 422. */
export function parseShopPage(input: unknown): ShopPageResult {
  const result = shopPageSchema.safeParse(input);
  if (result.success) return { ok: true, page: result.data as unknown as ShopPage };
  return { ok: false, issues: result.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })) };
}
