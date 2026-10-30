// Pure. A look (`look-*` of @krizaka/tokens, akinaza#478) is applied to a shop page by rewriting the variants of the sections the
// page already has — never their order, settings, blocks, text or photos. The closing call and the sticky bar are different jobs
// from the strip of next times, so a look leaves them as they are.
import { shopPresets } from "@krizaka/tokens/shop-presets";

import { SECTION_DEFINITIONS } from "../catalogue";
import type { Section, ShopPage } from "../schema";

/** What `applyLook` reads of a look: its id and version, and one variant per section type. */
export type ShopLookLike = { id: string; version: number; variants: Readonly<Record<string, string>> };

/** The looks, in the order of the addendum (Cahier first), then the owners' advanced looks. Every `look-*` preset is listed (a test). */
export const SHOP_LOOK_ORDER = ["look-cahier", "look-krizaka", "look-editorial", "look-boutique", "look-affiche", "look-nuit", "look-atelier", "look-rue", "look-velours"] as const;

export const SHOP_LOOKS = SHOP_LOOK_ORDER
  .map((id) => shopPresets.find((p) => p.id === id))
  .filter((p): p is (typeof shopPresets)[number] => p !== undefined);

/** A look by id, or undefined for a trade preset or an unknown id. */
export const shopLookOf = (id: string) => SHOP_LOOKS.find((p) => p.id === id);

/** Booking variants a look rewrites: the strip of next times and the panel. `closing` and `sticky` keep their own job. */
const REWRITTEN_BOOKING = new Set(["strip", "panel"]);

const variantsOf = (type: string) => SECTION_DEFINITIONS.find((d) => d.type === type)?.variants as readonly string[] | undefined;

function restyle(section: Section, look: ShopLookLike): Section {
  const variant = look.variants[section.type];
  if (!variant || variant === section.variant || !variantsOf(section.type)?.includes(variant)) return section;
  if (section.type === "booking" && !REWRITTEN_BOOKING.has(section.variant)) return section;
  return { ...section, variant } as Section;
}

/**
 * The page wearing a look: its preset reference, the look's own density and accent, and the variants of its sections. Everything
 * else is the owner's and stays: `applyLook(applyLook(p, a), b)` has the content of `p`.
 */
export function applyLook(page: ShopPage, look: ShopLookLike): ShopPage {
  const sections = page.sections.map((s) => restyle(s, look));
  const same = page.preset.id === look.id && page.preset.version === look.version && page.density === undefined && page.accent === undefined && sections.every((s, i) => s === page.sections[i]);
  if (same) return page;
  return { ...page, preset: { id: look.id, version: look.version }, density: undefined, accent: undefined, sections };
}
