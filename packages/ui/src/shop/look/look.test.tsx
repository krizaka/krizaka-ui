import { shopPresets } from "@krizaka/tokens/shop-presets";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SECTION_DEFINITIONS } from "../catalogue";
import { parseShopPage, type ShopPage } from "../schema";
import { shopStarters } from "../starters";
import { applyLook, SHOP_LOOK_ORDER, SHOP_LOOKS, shopLookOf } from "./apply-look";
import { MASCOT_SLOTS, mascotFor, ShopMascot } from "./mascots";

/** Everything of a page that is the owner's: the order, the keys, the settings, the blocks, the text. */
const content = (p: ShopPage) => p.sections.map(({ variant: _v, ...rest }) => rest);
const pages = Object.entries(shopStarters) as [string, ShopPage][];

describe("applyLook (akinaza#478)", () => {
  it("offers the looks, in the addendum's order, then the owners' advanced looks", () => {
    expect(SHOP_LOOKS.map((l) => l.id)).toEqual(["look-cahier", "look-krizaka", "look-editorial", "look-boutique", "look-affiche", "look-nuit", "look-atelier", "look-rue", "look-velours"]);
    expect(shopLookOf("look-nuit")?.surface).toBe("deep");
    expect(shopLookOf("salon-vitrine")).toBeUndefined();
  });

  it("offers every look of @krizaka/tokens: none is dropped because the order forgot it, none is named that does not exist", () => {
    const tokensLooks = shopPresets.filter((p) => p.id.startsWith("look-")).map((p) => p.id).sort();
    expect([...SHOP_LOOK_ORDER].sort()).toEqual(tokensLooks);
    expect(SHOP_LOOKS).toHaveLength(SHOP_LOOK_ORDER.length);
  });

  it("every variant a look names exists in the catalogue", () => {
    for (const look of SHOP_LOOKS) {
      for (const [type, variant] of Object.entries(look.variants)) {
        const def = SECTION_DEFINITIONS.find((d) => d.type === type);
        expect(def, `${look.id}.${type}`).toBeTruthy();
        expect(def!.variants as readonly string[], `${look.id}.${type}.${variant}`).toContain(variant);
      }
    }
  });

  for (const [name, page] of pages) {
    for (const look of SHOP_LOOKS) {
      it(`${name} wearing ${look.id}: the content is the owner's, the page stays valid`, () => {
        const next = applyLook(page, look);
        expect(content(next)).toEqual(content(page));
        expect(next.preset).toEqual({ id: look.id, version: look.version });
        expect(parseShopPage(next), JSON.stringify(parseShopPage(next))).toMatchObject({ ok: true });
        for (const s of next.sections) {
          const wanted = look.variants[s.type];
          const was = page.sections.find((x) => x.key === s.key)!;
          if (s.type === "booking" && !["strip", "panel"].includes(was.variant)) expect(s.variant, "closing and sticky keep their job").toBe(was.variant);
          else if (wanted) expect(s.variant).toBe(wanted);
          else expect(s.variant).toBe(was.variant);
        }
      });
    }
  }

  it("is idempotent and pure: the same look returns the same page, and the input is untouched", () => {
    const page = structuredClone(shopStarters.salonCompact);
    const before = JSON.stringify(page);
    const once = applyLook(page, SHOP_LOOKS[0]!);
    expect(JSON.stringify(page)).toBe(before);
    expect(applyLook(once, SHOP_LOOKS[0]!)).toBe(once);
  });

  it("forgets the previous look's density and accent, which belonged to it", () => {
    const page = { ...structuredClone(shopStarters.salonCompact), density: "airy" as const, accent: "krizaka" };
    const next = applyLook(page, SHOP_LOOKS[1]!);
    expect(next.density).toBeUndefined();
    expect(next.accent).toBeUndefined();
  });
});

describe("the Krizaka look's birds", () => {
  it("only a look with mascots on has birds", () => {
    expect(mascotFor({ type: "reviews", variant: "quote" }, shopLookOf("look-cahier"))).toBeUndefined();
    expect(mascotFor({ type: "reviews", variant: "quote" }, shopLookOf("look-krizaka"))).toBe("owl");
    expect(mascotFor({ type: "reviews", variant: "quote" }, undefined)).toBeUndefined();
  });

  it("never on the hero, the gallery, the wall, the TV or the videos; the closing call has the pigeon, the strip the beaver", () => {
    const krizaka = shopLookOf("look-krizaka");
    for (const s of [{ type: "hero", variant: "tv" }, { type: "gallery", variant: "wall" }, { type: "gallery", variant: "mosaic" }, { type: "video", variant: "tv" }, { type: "booking", variant: "panel" }] as const) {
      expect(mascotFor(s, krizaka), `${s.type}.${s.variant}`).toBeUndefined();
    }
    expect(mascotFor({ type: "booking", variant: "closing" }, krizaka)).toBe("pigeon");
    expect(mascotFor({ type: "booking", variant: "strip" }, krizaka)).toBe("beaver");
  });

  it("each slot has a different bird (at most one per section, none shared)", () => {
    const birds = Object.values(MASCOT_SLOTS);
    expect(new Set(birds).size).toBe(birds.length);
  });

  it("draws a decorative, server-rendered SVG", () => {
    const { container } = render(<ShopMascot bird="owl" />);
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("aria-hidden")).toBe("true");
    expect(container.querySelectorAll("script")).toHaveLength(0);
  });
});
