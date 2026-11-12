import { describe, expect, it } from "vitest";

import { renderEmail, templates } from "../src";

const base = { inviteUrl: "https://app.verikora.com/en/signup?invite=example", days: 7 };

describe("signupInvitation", () => {
  it("is transactional and says who invites, the lifetime and the ignore line, in French and English", async () => {
    const fr = await renderEmail("signupInvitation", { ...base, brand: "verikora" }, { locale: "fr" });
    const en = await renderEmail("signupInvitation", { ...base, brand: "verikora" }, { locale: "en" });
    expect(fr.category).toBe("transactional");
    expect(fr.subject).toBe("Verikora : vous êtes invité");
    expect(en.subject).toBe("Verikora: you are invited");
    expect(fr.html).toContain("Créer mon compte");
    expect(en.html).toContain("Create my account");
    expect(fr.text).toContain("Ce lien est valable 7 jours");
    expect(en.text).toContain("This link is valid for 7 days");
    expect(fr.text).toContain("Si vous n’attendiez pas ce message, ignorez-le");
    expect(en.text).toContain("If you did not expect this, ignore it");
    expect(en.text).toContain(base.inviteUrl);
  });

  it("wears the product's brand, and the company's when there is none", async () => {
    const product = await renderEmail("signupInvitation", { ...base, brand: "verikora" }, { locale: "en" });
    expect(product.html).toContain("brand/verikora/mark-light-256.png");
    expect(product.html).not.toContain("brand/krizaka/");
    const company = await renderEmail("signupInvitation", base, { locale: "en" });
    expect(company.html).toContain("brand/krizaka/mark-light-256.png");
    expect(company.subject).toBe("Krizaka: you are invited");
  });

  it("carries the allowance as one escaped line, and nothing when it is absent", async () => {
    const withLine = await renderEmail("signupInvitation", { ...base, allowance: "10 files <b>included</b>" }, { locale: "en" });
    expect(withLine.html).toContain("10 files &lt;b&gt;included&lt;/b&gt;");
    expect(withLine.html).not.toContain("<b>included</b>");
    expect(withLine.text).toContain("10 files <b>included</b>");
    const without = await renderEmail("signupInvitation", base, { locale: "en" });
    expect(without.html).not.toContain("included");
  });

  it("refuses a non-https link, a lifetime out of 1–30 days, and an allowance over its bound", () => {
    const parse = (p: object) => templates.signupInvitation.schema.safeParse({ ...base, ...p }).success;
    expect(parse({})).toBe(true);
    expect(parse({ inviteUrl: "http://app.verikora.com/x" })).toBe(false);
    expect(parse({ inviteUrl: "javascript:alert(1)" })).toBe(false);
    expect(parse({ days: 0 })).toBe(false);
    expect(parse({ days: 31 })).toBe(false);
    expect(parse({ days: 1.5 })).toBe(false);
    expect(parse({ days: 30 })).toBe(true);
    expect(parse({ allowance: "x".repeat(121) })).toBe(false);
    expect(parse({ allowance: "x".repeat(120) })).toBe(true);
    expect(parse({ allowance: "a\nb" })).toBe(false);
  });
});
