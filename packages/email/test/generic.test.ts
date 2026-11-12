import { describe, expect, it } from "vitest";

import { EmailValidationError, renderEmail, templates } from "../src";

const code = templates.verificationCode.example;
const note = templates.notification.example;
const HOSTILE = `<script>alert(1)</script>"><img src=x onerror=alert(1)>`;

describe("verificationCode", () => {
  it("shows the code, its life and the « ignore it » line, in both languages", async () => {
    const en = await renderEmail("verificationCode", { ...code, purpose: "Confirm your sign-in" }, { locale: "en" });
    const fr = await renderEmail("verificationCode", { ...code, ttlMinutes: 1 }, { locale: "fr" });
    expect(en.category).toBe("transactional");
    expect(en.text).toContain(code.code);
    expect(en.text).toContain("Confirm your sign-in");
    expect(en.text).toContain("10 minutes");
    expect(fr.text).toContain("1 minute.");
    expect(fr.text).not.toContain("1 minutes");
    expect(fr.text).toContain("Si vous n’avez rien demandé, ignorez-le");
  });

  it("wears the brand and no other", async () => {
    const email = await renderEmail("verificationCode", { ...code, brand: "verikora" }, { locale: "en" });
    expect(email.html).toContain("brand/verikora/mark-light-256.png");
    expect(email.html).not.toContain("brand/krizaka/");
  });

  it.each(["12345", "1234567", "12a456", "１２３４５６", " 123456", ""])("refuses the code %j", async (bad) => {
    await expect(renderEmail("verificationCode", { ...code, code: bad }, { locale: "en" })).rejects.toBeInstanceOf(EmailValidationError);
  });

  it.each([0, 61, 1.5, -1])("refuses ttlMinutes %s", async (ttlMinutes) => {
    await expect(renderEmail("verificationCode", { ...code, ttlMinutes }, { locale: "en" })).rejects.toBeInstanceOf(EmailValidationError);
  });

  it.each([1, 60])("accepts ttlMinutes %s", async (ttlMinutes) => {
    await expect(renderEmail("verificationCode", { ...code, ttlMinutes }, { locale: "en" })).resolves.toBeTruthy();
  });

  it("escapes a hostile purpose and refuses a line break in it", async () => {
    const email = await renderEmail("verificationCode", { ...code, purpose: HOSTILE }, { locale: "en" });
    expect(email.html).not.toContain("<script>alert");
    expect(email.html).not.toContain("<img src=x");
    await expect(renderEmail("verificationCode", { ...code, purpose: "a\nb" }, { locale: "en" })).rejects.toBeInstanceOf(EmailValidationError);
  });
});

describe("notification", () => {
  it("renders title and line, and no button without an action", async () => {
    const email = await renderEmail("notification", { title: "Your export is ready", line: "It holds 3 files." }, { locale: "en" });
    expect(email.category).toBe("transactional");
    expect(email.html).not.toContain('class="kz-btn"');
    expect(email.text).toContain("It holds 3 files.");
    expect(email.subject).toContain("Your export is ready");
  });

  it("renders the action as one button with the link also in the text", async () => {
    const email = await renderEmail("notification", note, { locale: "fr" });
    expect(email.html.match(/class="kz-btn"/g)).toHaveLength(1);
    expect(email.text).toContain(note.actionUrl);
    expect(email.text).toContain(note.actionLabel);
  });

  it("escapes the caller's content everywhere", async () => {
    const email = await renderEmail("notification", { ...note, title: HOSTILE, line: HOSTILE, actionLabel: HOSTILE }, { locale: "en" });
    expect(email.html).not.toContain("<script>alert");
    expect(email.html).not.toContain("<img src=x");
    expect(email.html).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
  });

  it.each(["http://x.example/a", "javascript:alert(1)", "//x.example"])("refuses the action url %s", async (actionUrl) => {
    await expect(renderEmail("notification", { ...note, actionUrl }, { locale: "en" })).rejects.toBeInstanceOf(EmailValidationError);
  });

  it("refuses an action label without a url, and a url without a label", async () => {
    await expect(renderEmail("notification", { title: "T", line: "L", actionLabel: "Open" }, { locale: "en" })).rejects.toBeInstanceOf(EmailValidationError);
    await expect(renderEmail("notification", { title: "T", line: "L", actionUrl: note.actionUrl }, { locale: "en" })).rejects.toBeInstanceOf(EmailValidationError);
  });

  it("refuses a line break in the title (it is the subject)", async () => {
    await expect(renderEmail("notification", { ...note, title: "A\r\nBcc: x@y.z" }, { locale: "en" })).rejects.toBeInstanceOf(EmailValidationError);
  });
});

describe("snapshots of the generic emails under a product brand", () => {
  it.each(["verificationCode", "notification"] as const)("%s wears Verikora in both languages", async (id) => {
    for (const locale of ["en", "fr"] as const) {
      const email = await renderEmail(id, { ...templates[id].example, brand: "verikora" } as never, { locale });
      await expect(`${email.subject}\n\n${email.text}\n`).toMatchFileSnapshot(`./__snapshots__/${id}.verikora.${locale}.txt`);
      await expect(email.html).toMatchFileSnapshot(`./__snapshots__/${id}.verikora.${locale}.html`);
    }
  });
});
