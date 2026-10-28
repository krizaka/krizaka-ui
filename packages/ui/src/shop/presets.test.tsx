import { shopPresets } from "@krizaka/tokens/shop-presets";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SECTION_TYPES, sectionDefinition,type SectionType } from "./catalogue";
import { ShopFrame } from "./frame";
import { shopStarters } from "./starters";

describe("the look presets and the catalogue agree (ADR-007 §4)", () => {
  it("every default variant of a preset is a variant of its section type", () => {
    for (const p of shopPresets) {
      for (const [type, variant] of Object.entries(p.variants)) {
        expect(SECTION_TYPES as readonly string[], `${p.id}: ${type}`).toContain(type);
        expect((sectionDefinition(type as SectionType) as { variants: readonly string[] }).variants, `${p.id}: ${type}.${variant}`).toContain(variant);
      }
    }
  });

  it("every preset starts its page on a hero and offers the price board or its cards, never nothing", () => {
    for (const p of shopPresets) {
      expect(p.variants.hero, p.id).toBeTruthy();
      expect(p.variants.services, p.id).toBeTruthy();
    }
  });

  it("every starter document wears a preset that exists, at the version it names", () => {
    for (const [name, doc] of Object.entries(shopStarters)) {
      const preset = shopPresets.find((p) => p.id === doc.preset.id);
      expect(preset, name).toBeTruthy();
      expect(preset!.version, name).toBe(doc.preset.version);
    }
  });

  it("the compact price board is the default of the demo shops' looks (the CTO's decision on akinaza#398) and of the compact trades that list services", () => {
    for (const id of ["salon-vitrine", "pets-canal"]) expect(shopPresets.find((p) => p.id === id)!.variants.services).toBe("menu");
    expect(shopPresets.filter((p) => p.variants.services === "menu").length).toBeGreaterThanOrEqual(4);
  });
});

describe("the six looks (akinaza#478)", () => {
  const looks = shopPresets.filter((p) => p.id.startsWith("look-"));
  it("every look is on the catalogue: its variants exist, and it names a surface, a motion and the birds", () => {
    expect(looks).toHaveLength(6);
    for (const p of looks) {
      expect(p.surface, p.id).toBeTruthy();
      expect(p.motion, p.id).toBeTruthy();
      expect(["off", "on"], p.id).toContain(p.mascots);
      expect(sectionDefinition("booking").variants, p.id).toContain("closing");
    }
  });
});

describe("ShopFrame wears the preset", () => {
  it("sets the preset, the accent, the paper and the density the stylesheet reads", () => {
    const { container } = render(<ShopFrame preset="pets-carnet" accent="akinaza:accent-2" paper="kraft" density="airy" />);
    const el = container.firstElementChild!;
    expect(el.getAttribute("data-shop-preset")).toBe("pets-carnet");
    expect(el.getAttribute("data-shop-accent")).toBe("akinaza:accent-2");
    expect(el.getAttribute("data-paper")).toBe("kraft");
    expect(el.getAttribute("data-density")).toBe("airy");
  });

  it("draws no paper by default, and the Seyès ruling for `seyes`", () => {
    const { container, rerender } = render(<ShopFrame />);
    expect(container.firstElementChild!.hasAttribute("data-paper")).toBe(false);
    rerender(<ShopFrame paper="seyes" />);
    expect(container.firstElementChild!.getAttribute("data-paper")).toBe("ruled");
  });
});
