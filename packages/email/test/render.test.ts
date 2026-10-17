import { describe, expect, it } from "vitest";

import { catalogues, EMAIL_LOCALES, type EmailLocale, renderEmail, TEMPLATE_IDS, type TemplateId,templates } from "../src";

const render = (id: TemplateId, locale: EmailLocale) => renderEmail(id, templates[id].example as never, { locale });
const matrix = TEMPLATE_IDS.flatMap((id) => EMAIL_LOCALES.map((locale) => [id, locale] as const));

describe.each(matrix)("%s (%s)", (id, locale) => {
  it("renders subject, HTML and a plain-text part, and matches the committed snapshot", async () => {
    const email = await render(id, locale);
    expect(email.subject.length).toBeGreaterThan(5);
    expect(email.html).toMatch(/^<!DOCTYPE/);
    expect(email.text.trim().length).toBeGreaterThan(40);
    await expect(`${email.subject}\n\n${email.text}\n`).toMatchFileSnapshot(`./__snapshots__/${id}.${locale}.txt`);
    await expect(email.html).toMatchFileSnapshot(`./__snapshots__/${id}.${locale}.html`);
  });

  it("declares its language, both colour schemes and a hidden preheader", async () => {
    const { html } = await render(id, locale);
    expect(html).toContain(`lang="${locale}"`);
    expect(html).toContain('name="color-scheme" content="light dark"');
    expect(html).toContain("prefers-color-scheme:dark");
    expect(html).toMatch(/display:none[^"]*"[^>]*data-skip-in-text/);
  });

  it("is one column of at most 600 px, with roles for assistive technology", async () => {
    const { html } = await render(id, locale);
    expect(html).toContain("max-width:600px");
    for (const role of ["banner", "main", "contentinfo"]) expect(html).toContain(`role="${role}"`);
  });

  it("has the brand mark with alt text, hosted, never inlined", async () => {
    const { html } = await render(id, locale);
    expect(html).toContain('src="https://krizaka-assets.b-cdn.net/brand/krizaka/mark-light-256.png"');
    expect(html).toContain('alt="Krizaka"');
    expect(html).not.toContain("data:image");
  });

  it("states who sends, how to reach them and why you receive it (CASL, Loi 25)", async () => {
    const { html, text } = await render(id, locale);
    const t = catalogues[locale].common;
    expect(text).toContain("Technologies Krizaka Inc.");
    expect(text).toContain("Montréal");
    expect(html).toContain(t.links.privacy);
    expect(html).toContain(t.links.contact);
  });

  it("leaves no placeholder and no message key on the page", async () => {
    const { html, text, subject } = await render(id, locale);
    for (const out of [html, text, subject]) {
      expect(out).not.toMatch(/\{[a-zA-Z]+\}/);
      expect(out).not.toContain(`${id}.`);
      expect(out).not.toContain("common.");
    }
  });

  it("is a marketing email only when it carries a one-click unsubscribe", async () => {
    const email = await render(id, locale);
    if (email.category === "marketing") {
      expect(email.headers["List-Unsubscribe"]).toMatch(/^<https:\/\/.+>$/);
      expect(email.headers["List-Unsubscribe-Post"]).toBe("List-Unsubscribe=One-Click");
      expect(email.html).toContain(catalogues[locale].common.footer.unsubscribe);
      expect(email.text).toContain(catalogues[locale].common.footer.unsubscribe);
    }
  });
});

const ACTION_URL = { newsletterConfirm: "confirmUrl", signInLink: "signInUrl", accountDeletion: "confirmUrl", dataExport: "downloadUrl", commentReply: "url", newPost: "url" } as const;

describe("the action", () => {
  it.each(Object.entries(ACTION_URL))("%s: one button, and the link also in the plain text and as a small fallback", async (id, field) => {
    const en = await render(id as TemplateId, "en");
    const url = (templates[id as TemplateId].example as Record<string, string>)[field]!;
    expect(en.html.match(/class="kz-btn"/g)).toHaveLength(1);
    expect(en.text).toContain(url);
    expect(en.html).toContain(catalogues.en.common.fallback.replaceAll("'", "&#x27;"));
  });

  it("the newsletter confirmation has the exact words of the brief, in both languages", async () => {
    const fr = await render("newsletterConfirm", "fr");
    const en = await render("newsletterConfirm", "en");
    expect(fr.subject).toBe("Confirmez votre inscription au blogue Krizaka");
    expect(fr.html).toContain("Confirmer mon inscription");
    expect(en.html).toContain("Confirm my subscription");
    expect(fr.html).toContain("Oussama");
    expect(fr.html).toContain("Fondateur, Krizaka");
  });

  it("the new post names its cover, title and excerpt, and dates the consent in the reader's language", async () => {
    const fr = await renderEmail("newPost", { ...templates.newPost.example, consentedOn: "2026-10-01" }, { locale: "fr" });
    expect(fr.text).toContain("1 octobre 2026");
    expect(fr.html).toContain('alt="The Krizaka mark on a dark background"');
    expect(fr.html).toContain("Lire le billet");
    expect(fr.subject).toBe("Nouveau sur le blogue Krizaka : Why we keep your data in Montréal");
  });

  it("the signature can carry an avatar", async () => {
    const email = await renderEmail("newsletterConfirm", { ...templates.newsletterConfirm.example, signature: { name: "Oussama", avatarUrl: "https://krizaka-assets.b-cdn.net/people/oussama.png" } }, { locale: "en" });
    expect(email.html).toContain('src="https://krizaka-assets.b-cdn.net/people/oussama.png"');
  });

  it("an address and a CDN can be chosen", async () => {
    const email = await renderEmail("newsletterWelcome", { ...templates.newsletterWelcome.example, address: "1 rue Example, Montréal QC H2X 1Y4" }, { locale: "en", cdn: "https://cdn.example.com/" });
    expect(email.text).toContain("1 rue Example, Montréal QC H2X 1Y4");
    expect(email.html).toContain("https://cdn.example.com/brand/krizaka/mark-dark-256.png");
  });

  it("the footer's privacy and contact links can be the sender's own", async () => {
    const email = await renderEmail("newsletterConfirm", { ...templates.newsletterConfirm.example, links: { privacy: "https://blog.krizaka.com/newsletter/" } }, { locale: "en" });
    expect(email.text).toContain("Privacy https://blog.krizaka.com/newsletter/");
    expect(email.text).toContain("Contact https://www.krizaka.com/contact");
  });

  it("long messages are echoed shortened in the auto-reply", async () => {
    const message = `${"mot ".repeat(600)}fin`;
    const email = await renderEmail("contactAutoreply", { name: "Camille", message }, { locale: "fr" });
    expect(email.text).toContain("…");
    expect(email.text).not.toContain("fin");
  });
});
