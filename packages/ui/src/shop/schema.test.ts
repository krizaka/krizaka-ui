import { describe, expect, it } from "vitest";

import { SECTION_DEFINITIONS, SECTION_TYPES, sectionDefinition } from "./catalogue";
import { SHOP_LIMITS } from "./limits";
import { createMigrator, migrateShopPage, SHOP_MIGRATIONS } from "./migrate";
import { parseShopPage, type ShopPage } from "./schema";
import { shopStarters } from "./starters";

const clone = <T,>(v: T): T => structuredClone(v);
const base = (): ShopPage => clone(shopStarters.salonCompact);
const pathsOf = (input: unknown) => {
  const r = parseShopPage(input);
  return r.ok ? [] : r.issues.map((i) => i.path);
};

describe("the shop page document", () => {
  it.each(Object.entries(shopStarters))("parses the starter document %s", (_name, doc) => {
    const r = parseShopPage(doc);
    expect(r.ok ? [] : r.issues).toEqual([]);
  });

  it("knows the 13 section types of the ADR, each with a default variant first", () => {
    expect(SECTION_TYPES).toEqual(["hero", "services", "booking", "gallery", "video", "reviews", "bulletin", "team", "visit", "story", "social", "faq", "policies"]);
    expect(sectionDefinition("services").defaultVariant).toBe("menu");
    expect(sectionDefinition("hero").defaultVariant).toBe("poster");
    expect(sectionDefinition("services").variants).toEqual(["menu", "cards", "index", "carousel"]);
  });

  it("builds a valid section from every definition's default settings and first variant", () => {
    for (const d of SECTION_DEFINITIONS) {
      const doc = {
        schema: 1,
        preset: { id: "salon-vitrine", version: 1 },
        sections: [{ key: "s_x", type: d.type, variant: d.defaultVariant, settings: d.settingsDefault }],
      };
      const r = parseShopPage(doc);
      expect(r.ok ? [] : r.issues, d.type).toEqual([]);
    }
  });

  it("refuses an unknown type, with its path", () => {
    const doc = base() as unknown as { sections: { type: string }[] };
    doc.sections[2]!.type = "carousel3d";
    expect(pathsOf(doc).length).toBeGreaterThan(0);
  });

  it("refuses a variant that is not in its type, with the path of the variant", () => {
    const doc = base();
    (doc.sections[2] as { variant: string }).variant = "poster";
    expect(pathsOf(doc)).toContain("sections.2.variant");
  });

  it("refuses a second hero, and a hero that is not first", () => {
    const doc = base();
    doc.sections.push(clone(doc.sections[0]!));
    (doc.sections[doc.sections.length - 1] as { key: string }).key = "s_other";
    expect(pathsOf(doc)).toContain(`sections.${doc.sections.length - 1}.type`);
    const swapped = base();
    swapped.sections.reverse();
    expect(pathsOf(swapped).some((p) => p.endsWith(".type"))).toBe(true);
  });

  it("refuses 17 sections", () => {
    const doc = base();
    doc.sections = Array.from({ length: SHOP_LIMITS.sections + 1 }, (_, i) =>
      i === 0 ? doc.sections[0]! : { key: `s_${i}`, type: "booking", variant: "strip", settings: { count: 4 } },
    ) as ShopPage["sections"];
    expect(pathsOf(doc)).toContain("sections");
  });

  it("refuses 25 blocks in a section", () => {
    const doc = base();
    const gallery = doc.sections.find((s) => s.type === "gallery")!;
    gallery.blocks = Array.from({ length: SHOP_LIMITS.blocks + 1 }, (_, i) => ({ key: `b_${i}`, type: "note" as const, settings: { text: "Hi" } }));
    const i = doc.sections.indexOf(gallery);
    expect(pathsOf(doc)).toContain(`sections.${i}.blocks`);
  });

  it("refuses more than 12 photos in a gallery, 6 cards, 3 flyers, and a block type the section does not allow", () => {
    const gallery = base();
    const g = gallery.sections.find((s) => s.type === "gallery")!;
    g.blocks = Array.from({ length: SHOP_LIMITS.photos + 1 }, (_, i) => ({ key: `b_${i}`, type: "photo" as const, settings: { mediaId: `m${i}` } }));
    expect(pathsOf(gallery).some((p) => p.endsWith(".blocks"))).toBe(true);

    const cards = base();
    const services = cards.sections.find((s) => s.type === "services")!;
    services.variant = "cards";
    services.blocks = Array.from({ length: SHOP_LIMITS.cards + 1 }, (_, i) => ({ key: `b_${i}`, type: "service" as const, settings: { serviceId: `s${i}` } }));
    expect(pathsOf(cards).some((p) => p.endsWith(".blocks"))).toBe(true);

    const wrong = base();
    const g2 = wrong.sections.find((s) => s.type === "gallery")!;
    (g2 as { blocks: unknown }).blocks = [{ key: "b_1", type: "flyer", settings: { text: "x" } }];
    expect(pathsOf(wrong).length).toBeGreaterThan(0);
  });

  it("refuses a section whose settings do not match its type, a duplicate key and a pick with nothing picked", () => {
    const doc = base();
    (doc.sections[2] as { settings: unknown }).settings = { source: "everything" };
    expect(pathsOf(doc).some((p) => p.startsWith("sections.2.settings"))).toBe(true);

    const dup = base();
    dup.sections[1]!.key = dup.sections[0]!.key;
    expect(pathsOf(dup)).toContain("sections.1.key");

    const pick = base();
    const s = pick.sections.find((x) => x.type === "services")!;
    (s.settings as { source: string }).source = "pick";
    expect(pathsOf(pick).some((p) => p.endsWith(".blocks"))).toBe(true);
  });

  it("refuses an http address in a social link and a malformed preset", () => {
    const doc = base();
    doc.sections.push({ key: "s_social", type: "social", variant: "links", settings: {}, blocks: [{ key: "b1", type: "link", settings: { platform: "tiktok", url: "http://tiktok.com/@x" } }] });
    expect(pathsOf(doc).some((p) => p.includes("blocks.0.settings.url"))).toBe(true);
    const preset = base();
    (preset.preset as { id: string }).id = "Salon Vitrine";
    expect(pathsOf(preset)).toContain("preset.id");
  });

  it("refuses what is not a document", () => {
    expect(parseShopPage(null).ok).toBe(false);
    expect(parseShopPage({ schema: 2, preset: { id: "a-b", version: 1 }, sections: [] }).ok).toBe(false);
  });
});

describe("the migrations of the document", () => {
  it("returns a current document as it is", () => {
    const r = migrateShopPage(shopStarters.petsRoute);
    expect(r.ok && r.from).toBe(1);
    expect(r.ok && r.doc).toEqual(shopStarters.petsRoute);
  });

  it("refuses a newer schema, no schema and a non-object", () => {
    expect(migrateShopPage({ schema: 9 }).ok).toBe(false);
    expect(migrateShopPage({}).ok).toBe(false);
    expect(migrateShopPage([]).ok).toBe(false);
  });

  it("has a migration for every version below the current one (none yet: schema 1 is the first format)", () => {
    expect(SHOP_MIGRATIONS.map((m) => m.from)).toEqual([]);
  });

  it("walks a chain of migrations, purely, and a migrated document migrates to itself", () => {
    const migrations = [
      { from: 1, up: (d: Record<string, unknown>) => ({ ...d, density: "airy" }) },
      { from: 2, up: (d: Record<string, unknown>) => ({ ...d, extra: true }) },
    ];
    const migrate = createMigrator(migrations, 3);
    const old = { schema: 1, preset: { id: "a-b", version: 1 }, sections: [] };
    const before = clone(old);
    const r = migrate(old);
    expect(old).toEqual(before);
    expect(r.ok && r.doc).toEqual({ schema: 3, preset: { id: "a-b", version: 1 }, sections: [], density: "airy", extra: true });
    const again = migrate((r as { doc: unknown }).doc);
    expect(again.ok && again.doc).toEqual(r.ok && r.doc);
    expect(createMigrator([], 2)({ schema: 1 }).ok).toBe(false);
  });
});
