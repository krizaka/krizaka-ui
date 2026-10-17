import { describe, expect, it } from "vitest";

import { EmailValidationError, renderEmail, templates } from "../src";

const HOSTILE = `<script>alert(1)</script>"><img src=x onerror=alert(1)>&amp;`;

describe("no user input is rendered unescaped", () => {
  it("escapes a hostile name and message everywhere they appear", async () => {
    const email = await renderEmail("contactNotification", { ...templates.contactNotification.example, name: HOSTILE, company: HOSTILE, message: HOSTILE }, { locale: "en" });
    expect(email.html).not.toContain("<script>alert");
    expect(email.html).not.toContain("<img src=x");
    expect(email.html).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
    expect(email.html).toContain("&amp;amp;");
  });

  it("escapes a hostile title, excerpt and cover alt of a post", async () => {
    const email = await renderEmail("newPost", { ...templates.newPost.example, title: HOSTILE, excerpt: HOSTILE, coverAlt: HOSTILE }, { locale: "fr" });
    expect(email.html).not.toContain("<script>alert");
    expect(email.html).not.toContain("<img src=x");
  });

  it("escapes the visitor's message in the auto-reply and the comment excerpt", async () => {
    const reply = await renderEmail("contactAutoreply", { name: HOSTILE, message: HOSTILE }, { locale: "en" });
    const comment = await renderEmail("commentReply", { ...templates.commentReply.example, replierName: HOSTILE, excerpt: HOSTILE }, { locale: "en" });
    for (const { html } of [reply, comment]) {
      expect(html).not.toContain("<script>alert");
      expect(html).not.toContain("<img src=x");
    }
  });

  it("keeps a visitor's line breaks without letting them break the markup", async () => {
    const email = await renderEmail("contactAutoreply", { name: "Camille", message: "un\ndeux\r\ntrois" }, { locale: "en" });
    expect(email.html).toContain("<span><br/>deux</span><span><br/>trois</span>");
  });

  it("puts a visitor's address in a mailto: only after validating it", async () => {
    await expect(renderEmail("contactNotification", { ...templates.contactNotification.example, email: 'x@y.com"><script>' }, { locale: "en" })).rejects.toBeInstanceOf(EmailValidationError);
  });
});

describe("links", () => {
  it.each(["javascript:alert(1)", "http://blog.krizaka.com/confirm", "data:text/html,<b>", "//evil.example/x", "https://", "ftp://x.example/y"])("refuses %s as a button", async (url) => {
    await expect(renderEmail("newsletterConfirm", { confirmUrl: url }, { locale: "en" })).rejects.toBeInstanceOf(EmailValidationError);
  });

  it("refuses a non-https unsubscribe link and a non-https avatar", async () => {
    await expect(renderEmail("newPost", { ...templates.newPost.example, unsubscribeUrl: "javascript:void(0)" }, { locale: "en" })).rejects.toBeInstanceOf(EmailValidationError);
    await expect(renderEmail("newsletterConfirm", { ...templates.newsletterConfirm.example, signature: { name: "A", avatarUrl: "http://x.example/a.png" } }, { locale: "en" })).rejects.toBeInstanceOf(EmailValidationError);
  });
});

describe("headers", () => {
  it("refuses a line break in a name (it would end up in the subject)", async () => {
    await expect(renderEmail("contactNotification", { ...templates.contactNotification.example, name: "Eve\r\nBcc: victim@example.com" }, { locale: "en" })).rejects.toBeInstanceOf(EmailValidationError);
    await expect(renderEmail("newPost", { ...templates.newPost.example, title: "A\nB" }, { locale: "en" })).rejects.toBeInstanceOf(EmailValidationError);
  });

  it("names the invalid fields, never their values", async () => {
    const error = await renderEmail("newsletterConfirm", { confirmUrl: "javascript:SECRET" }, { locale: "en" }).then(
      () => null,
      (e: unknown) => e as EmailValidationError,
    );
    expect(error?.fields).toEqual(["confirmUrl"]);
    expect(error?.message).not.toContain("SECRET");
  });

  it("refuses a marketing email without a way to unsubscribe", async () => {
    const { unsubscribeUrl: _omitted, ...without } = templates.newPost.example;
    await expect(renderEmail("newPost", without, { locale: "en" })).rejects.toThrow(/unsubscribeUrl/);
  });

  it("refuses control characters in a message too, but not line breaks", async () => {
    await expect(renderEmail("contactAutoreply", { name: "A", message: "a\u0000b" }, { locale: "en" })).rejects.toBeInstanceOf(EmailValidationError);
  });
});
