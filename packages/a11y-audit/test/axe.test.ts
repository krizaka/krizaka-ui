import { type Browser,chromium } from "playwright-core";

import { auditPage, findingsOf, normaliseTarget } from "../src/index.js";

let browser: Browser;
beforeAll(async () => {
  browser = await chromium.launch();
});
afterAll(async () => {
  await browser.close();
});

const BAD = `<!doctype html><html lang="en"><head><title>t</title></head><body>
<main><h1>Title</h1>
<p style="color:#bbb;background:#fff">Pale text on white</p>
<button><svg width="8" height="8"></svg></button>
<input type="text" id="x">
<div id="widget"><img src="data:image/gif;base64,R0lGODlhAQABAAAAACw="></div>
</main></body></html>`;
const GOOD = `<!doctype html><html lang="en"><head><title>t</title></head><body>
<main><h1>Title</h1>
<p style="color:#222;background:#fff">Dark text on white</p>
<button>Save</button>
<label for="x">Name</label><input type="text" id="x">
</main></body></html>`;

describe("auditPage (real Chromium)", () => {
  it("fails a page with a contrast, a nameless button, an unlabelled input and an image without alt", async () => {
    const page = await browser.newPage();
    await page.setContent(BAD);
    const rules = new Set((await auditPage(page)).map((x) => x.rule));
    expect([...rules]).toEqual(expect.arrayContaining(["color-contrast", "button-name", "label", "image-alt"]));
    await page.close();
  });

  it("passes a clean page, and leaves out what it is told to exclude", async () => {
    const page = await browser.newPage();
    await page.setContent(GOOD);
    expect(await auditPage(page)).toEqual([]);
    await page.setContent(BAD);
    const rules = (await auditPage(page, { exclude: ["#widget"] })).map((x) => x.rule);
    expect(rules).not.toContain("image-alt");
    expect((await auditPage(page, { tags: ["wcag2aa"] })).map((x) => x.rule)).toContain("color-contrast");
    await page.close();
  });
});

describe("findingsOf / normaliseTarget", () => {
  it("one finding per node, ids and indexes normalised, unknown impact is minor", () => {
    expect(normaliseTarget("#radix-:r3a: > li:nth-child(4)")).toBe("#radix-:r#: > li:nth-child(#)");
    const out = findingsOf([{ id: "x", impact: null, help: "h", nodes: [{ target: ["ul > li:nth-child(2)"] }, { target: [] }] }]);
    expect(out).toEqual([
      { rule: "x", impact: "minor", help: "h", target: "ul > li:nth-child(#)" },
      { rule: "x", impact: "minor", help: "h", target: "" },
    ]);
  });
});
