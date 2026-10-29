import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { BRAND_COLOURS, BRAND_IDS, BRAND_NAMES, type BrandId,getTheme, NEUTRALS, renderEmail, TEMPLATE_IDS, templates } from "../src";

function luminance(hex: string): number {
  const channel = (i: number) => {
    const c = parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(0) + 0.7152 * channel(1) + 0.0722 * channel(2);
}
const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi! + 0.05) / (lo! + 0.05);
};

const PRODUCTS = BRAND_IDS.filter((b) => b !== "krizaka");

describe("brands", () => {
  it("has the company and every product of @krizaka/tokens", () => {
    const files = fs.readdirSync(path.join(__dirname, "../../tokens/src/brands")).filter((f) => f.endsWith(".brand.json")).map((f) => f.replace(".brand.json", ""));
    expect([...BRAND_IDS].sort()).toEqual(files.sort());
    expect(Object.keys(BRAND_NAMES).sort()).toEqual(files.sort());
  });

  it.each(BRAND_IDS)("%s: the button, the links and the text are readable (WCAG AA) in light and dark", (id) => {
    const c = BRAND_COLOURS[id];
    for (const scheme of ["light", "dark"] as const) {
      expect(contrast(c.onAccent[scheme], c.accent[scheme]), `button ${scheme}`).toBeGreaterThanOrEqual(4.5);
      expect(contrast(c.link[scheme], NEUTRALS[scheme].card), `link ${scheme}`).toBeGreaterThanOrEqual(4.5);
      expect(contrast(NEUTRALS[scheme].text, NEUTRALS[scheme].card), `text ${scheme}`).toBeGreaterThanOrEqual(7);
      expect(contrast(NEUTRALS[scheme].muted, NEUTRALS[scheme].card), `muted ${scheme}`).toBeGreaterThanOrEqual(4.5);
      expect(contrast(NEUTRALS[scheme].muted, NEUTRALS[scheme].page), `muted on page ${scheme}`).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("hosts the marks under brand/<brand>/ on the CDN", () => {
    expect(getTheme("orazaka").logo).toEqual({ light: "https://krizaka-assets.b-cdn.net/brand/orazaka/mark-light-256.png", dark: "https://krizaka-assets.b-cdn.net/brand/orazaka/mark-dark-256.png" });
    expect(getTheme().id).toBe("krizaka");
  });
});

describe("House of Brands: a product email never shows another product", () => {
  const names = (except: BrandId) => PRODUCTS.filter((p) => p !== except).map((p) => BRAND_NAMES[p]);

  // Renders every template in both locales for one brand: heavy on a loaded CI runner, hence the explicit budget.
  it.each(PRODUCTS)("%s", { timeout: 30_000 }, async (brand) => {
    for (const id of TEMPLATE_IDS.filter((t) => t !== "contactNotification")) {
      for (const locale of ["en", "fr"] as const) {
        const email = await renderEmail(id, { ...templates[id].example, brand } as never, { locale });
        for (const other of names(brand)) {
          expect(email.html, `${id}/${locale} shows ${other}`).not.toContain(other);
          expect(email.html.toLowerCase()).not.toContain(`/brand/${other.toLowerCase()}/`);
        }
        expect(email.html).toContain(`/brand/${brand}/mark-light-256.png`);
        expect(email.html).toContain(BRAND_COLOURS[brand].accent.light);
        expect(email.html).toContain(BRAND_COLOURS[brand].accent.dark);
      }
    }
  });

  it("signs a product's email as its team, and the company's as Oussama", async () => {
    const product = await renderEmail("signInLink", { ...templates.signInLink.example, brand: "yomizaka" }, { locale: "fr" });
    const company = await renderEmail("signInLink", templates.signInLink.example, { locale: "fr" });
    expect(product.text).toContain("L'équipe Yomizaka");
    expect(product.subject).toBe("Votre lien de connexion à Yomizaka");
    expect(company.text).toContain("Oussama");
  });
});

describe("dark scheme", () => {
  it("swaps the mark, the card, the text and the button in the dark scheme (and for Outlook.com)", async () => {
    const { html } = await renderEmail("newsletterConfirm", templates.newsletterConfirm.example, { locale: "en" });
    const dark = BRAND_COLOURS.krizaka.accent.dark;
    expect(html).toContain(`.kz-btn{background-color:${dark}!important`);
    expect(html).toContain(`.kz-card{background-color:${NEUTRALS.dark.card}!important`);
    expect(html).toContain("[data-ogsc] .kz-card");
    expect(html).toContain(".kz-logo-light{display:none!important");
    expect(html).toContain("mark-dark-256.png");
  });

  it("paints the page itself, not only the body, so the dark page colour reaches the whole canvas", async () => {
    const { html } = await renderEmail("newsletterConfirm", templates.newsletterConfirm.example, { locale: "en" });
    expect(html).toMatch(/<table[^>]*class="kz-page"[^>]*style="background-color:#f3f4f8"/);
  });
});
