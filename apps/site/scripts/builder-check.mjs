#!/usr/bin/env node
/* The live demo at /builder, driven in a real browser (Playwright), in English and French, dark and light, at 1440 and 360 px:
   - the editor loads and draws the starter page; one verdict says what the JSON shown is (valid · refused, as expected);
   - the French switch shows the French words, clearing a text lists it in a sentence that names the block and the field;
   - each of the three attacks is refused with a sentence, the raw code and path in a collapsible block;
   - axe (WCAG 2.x A and AA) finds no serious or critical defect, in the page and in the editor's canvas;
   - the keyboard: « Skip the editor » is a link, the shortcut to the fields is within 10 tab stops and lands on a field,
     and the site's bar never covers the editor's header;
   - the canvas is set in the site's font;
   - the page is a workspace (krizaka-ui#3549): no docs menu, a « ← Documentation » link, the title in the Cahier's Young Serif
     and never bold, the editor's top at 320 px or less from the top at 1440 and 780 px or less at 360, the editor as wide as
     the window (less the gutters) and as tall as the rest of the screen, the preview 720 px wide or more at 1440, the first
     field one tab stop from the top of the page (a shortcut; at most 10), nothing scrolls sideways, in both themes with
     reduced motion.
   Also fails on a console error. Usage:
   node scripts/builder-check.mjs --base http://localhost:4600 [--playwright <path>] [--axe <path to axe.min.js>] [--shots <dir>] */

import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

import { LIMITS } from "./builder-limits.mjs";

const args = process.argv.slice(2);
const flag = (name, fallback) => (args.includes(name) ? args[args.indexOf(name) + 1] : fallback);
const base = flag("--base", "http://localhost:4600").replace(/\/$/, "");
const shots = flag("--shots", "");
const require = createRequire(import.meta.url);
const { chromium } = require(flag("--playwright", "playwright"));
const axeSource = readFileSync(flag("--axe", "") || require.resolve("axe-core/axe.min.js"), "utf8");

const WORDS = {
  en: {
    path: "/builder/",
    title: "Bread, baked at five.",
    missing: "Missing translations",
    valid: /Valid · 4 blocks/,
    group: /Content language/,
    other: "Français",
    otherTitle: "Du pain, cuit à cinq heures.",
    expected: /Refused, as expected · 1 problem$/,
    verdict: "Validator verdict",
    one: /^1 text has no French/,
    attacks: [
      ["script", /script/i, /^Hero › Title \(English\): this text holds a tag/],
      ["handler", /onClick/, /^Hero: “onClick” is not an allowed field\. Event handlers are refused/],
      ["proto", /__proto__/, /^Document: the key “__proto__” is always refused/],
    ],
    raw: "Raw code and path",
    skip: "Skip the editor",
    toFields: "Edit the selected block",
    fieldsToggle: "Fields",
  },
  fr: {
    path: "/fr/builder/",
    title: "Du pain, cuit à cinq heures.",
    missing: "Traductions manquantes",
    valid: /Valide · 4 blocs/,
    group: /Langue du contenu/,
    other: "English",
    otherTitle: "Bread, baked at five.",
    expected: /Refusé, comme prévu · 1 problème$/,
    verdict: "Verdict du validateur",
    one: /^1 texte n’a pas d’anglais/,
    attacks: [
      ["script", /script/i, /^Bandeau d’accueil › Titre \(anglais\) : ce texte contient une balise/],
      ["handler", /onClick/, /^Bandeau d’accueil : « onClick » n’est pas un champ autorisé\. Les gestionnaires d’évènements sont refusés/],
      ["proto", /__proto__/, /^Document : la clé « __proto__ » est toujours refusée/],
    ],
    raw: "Code et chemin bruts",
    skip: "Passer l’éditeur",
    toFields: "Modifier le bloc sélectionné",
    fieldsToggle: "Champs",
  },
};

const browser = await chromium.launch();
const problems = [];

/** Runs in the page: where things are. */
function workspaceFacts() {
  const rect = (el) => (el ? el.getBoundingClientRect() : null);
  const editor = document.querySelector(".kz-builder-editor");
  const h1 = document.querySelector("main h1");
  const frame = document.querySelector(".kz-builder-editor iframe");
  const back = document.querySelector(".kz-builder-crumb a");
  const gutter = parseFloat(getComputedStyle(document.querySelector(".kz-workspace-gutter")).paddingLeft);
  return {
    docsMenu: !!document.querySelector("#nd-sidebar, .kz-docs"),
    back: back ? { text: back.textContent.trim(), href: new URL(back.href).pathname } : null,
    title: h1 ? { family: getComputedStyle(h1).fontFamily, weight: Number(getComputedStyle(h1).fontWeight) } : null,
    editorTop: Math.round(rect(editor).top + scrollY),
    editorWidth: Math.round(rect(editor).width),
    editorBottom: Math.round(rect(editor).bottom + scrollY),
    gutter,
    previewWidth: frame ? Math.round(rect(frame).width) : 0,
    innerWidth,
    innerHeight,
    scrollWidth: document.documentElement.scrollWidth,
  };
}

async function axeDefects(page) {
  // The canvas is an iframe: axe must live in it too, or its blocks are never audited.
  await page.evaluate(axeSource);
  for (const frame of page.frames()) if (frame !== page.mainFrame()) await frame.evaluate(axeSource);
  return page.evaluate(async () => {
    const result = await globalThis.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"] } });
    return result.violations.filter((v) => v.impact === "serious" || v.impact === "critical").map((v) => `${v.id} (${v.impact}) ${v.nodes.slice(0, 2).map((n) => n.target.join(" ")).join(" ; ")}`);
  });
}

for (const [locale, w] of Object.entries(WORDS)) {
  for (const theme of ["dark", "light"]) {
    for (const width of [1440, 360]) {
      const tag = `${locale}/${theme}/${width}`;
      const context = await browser.newContext({ viewport: { width, height: width === 360 ? 780 : 1000 }, colorScheme: theme, reducedMotion: "reduce" });
      await context.addInitScript((t) => localStorage.setItem("kz-theme", t), theme);
      const page = await context.newPage();
      page.on("console", (m) => m.type() === "error" && problems.push(`${tag}: console: ${m.text().slice(0, 200)}`));
      page.on("pageerror", (e) => problems.push(`${tag}: exception: ${e.message.slice(0, 200)}`));
      try {
        await page.goto(base + w.path, { waitUntil: "load" });
        const canvas = page.frameLocator("iframe").first();
        await canvas.getByRole("heading", { level: 1, name: w.title }).waitFor({ timeout: 20000 });
        const verdict = page.getByLabel(w.verdict);
        await verdict.getByText(w.valid).waitFor({ timeout: 5000 });
        if ((await page.getByText(/problems?\b|problèmes?\b/).count()) !== 0) problems.push(`${tag}: a refusal is shown on the valid starter page`);

        // The workspace: where things are, measured on the first screen of a fresh load.
        const f = await page.evaluate(workspaceFacts);
        const limit = LIMITS[width];
        if (f.docsMenu) problems.push(`${tag}: the docs menu is on the page`);
        if (f.back?.text !== "← Documentation" && f.back?.text !== "Documentation") problems.push(`${tag}: no « Documentation » link (${JSON.stringify(f.back)})`);
        if (f.back && f.back.href.replace(/\/$/, "") !== (locale === "fr" ? "/fr" : "")) problems.push(`${tag}: the Documentation link leads to ${f.back.href}`);
        if (!/Young Serif/.test(f.title?.family ?? "") || f.title.weight > 400) problems.push(`${tag}: the title is ${JSON.stringify(f.title)}, not Young Serif at one weight`);
        if (f.editorTop > limit.editorTop) problems.push(`${tag}: the editor starts ${f.editorTop} px from the top (limit ${limit.editorTop})`);
        if (Math.abs(f.editorWidth - (f.innerWidth - 2 * f.gutter)) > 1) problems.push(`${tag}: the editor is ${f.editorWidth} px wide in a ${f.innerWidth} px window with ${f.gutter} px gutters`);
        if (f.editorBottom < f.innerHeight - 20 || f.editorBottom > f.innerHeight + 560) problems.push(`${tag}: the editor ends at ${f.editorBottom} in a ${f.innerHeight} px window`);
        if (limit.previewWidth && f.previewWidth < limit.previewWidth) problems.push(`${tag}: the preview is ${f.previewWidth} px wide (at least ${limit.previewWidth})`);
        if (f.scrollWidth > f.innerWidth) problems.push(`${tag}: the page scrolls sideways (${f.scrollWidth} > ${f.innerWidth})`);
        if (shots) console.log(`${tag}: editor top ${f.editorTop}, ${f.editorWidth} wide, preview ${f.previewWidth}`);
        // The first field is one tab stop from the top of the page: the shortcut is the first stop, Enter lands on the field.
        await page.evaluate(() => document.activeElement?.blur());
        let stops = 0;
        for (; stops < LIMITS.tabStops; stops++) {
          await page.keyboard.press("Tab");
          if ((await page.evaluate(() => document.activeElement?.textContent)) === w.toFields) break;
        }
        if (stops + 1 > LIMITS.tabStops) problems.push(`${tag}: the shortcut to the first field is not within ${LIMITS.tabStops} tab stops`);
        await page.keyboard.press("Enter");
        // On a phone the fields are a tab of the rail: opened first, the focus follows on the next frame.
        const onField = () => /^(INPUT|TEXTAREA)$/.test(document.activeElement?.tagName ?? "") && !!document.activeElement?.closest(".kz-builder-editor");
        if (!(await page.waitForFunction(onField, null, { timeout: 2000 }).then(() => true, () => false))) problems.push(`${tag}: Tab then Enter does not land on a field`);
        await page.evaluate(() => document.activeElement?.blur());

        // One verdict, never green on a refusal: pick each attack, read the sentence, the raw block, the verdict tone.
        for (const [id, button, sentence] of w.attacks) {
          await page.getByRole("button", { name: button }).first().click();
          await verdict.getByText(w.expected).waitFor({ timeout: 5000 });
          if ((await verdict.getAttribute("data-tone")) === "success") problems.push(`${tag}: attack ${id}: the refusal is green`);
          if ((await page.getByLabel(w.verdict).count()) !== 1) problems.push(`${tag}: attack ${id}: more than one verdict`);
          const text = await page.locator("ul[aria-label]").filter({ hasText: /./ }).first().innerText();
          if (!sentence.test(text)) problems.push(`${tag}: attack ${id} reads: ${text.slice(0, 140)}`);
          const raw = page.locator("details").filter({ hasText: w.raw });
          if (await raw.evaluate((d) => d.open)) problems.push(`${tag}: the raw block is open`);
          await raw.locator("summary").click();
          if (!/ — (unsafe_text|unsafe_key|shape) — /.test(await raw.innerText())) problems.push(`${tag}: attack ${id}: no raw code and path`);
          await raw.locator("summary").click();
          const json = await page.locator("pre[aria-label] code").innerText();
          if (id === "script" && !json.includes("<script>")) problems.push(`${tag}: the JSON shown is not the attacked copy`);
        }
        await page.getByRole("button", { name: /Back to the valid document|Revenir au document valide/ }).click();
        await verdict.getByText(w.valid).waitFor({ timeout: 5000 });

        // The other language, and a missing text in a sentence.
        await page.getByRole("group", { name: w.group }).getByRole("button", { name: w.other }).click();
        await canvas.getByRole("heading", { level: 1, name: w.otherTitle }).waitFor({ timeout: 5000 });
        // On a phone the fields are a tab of the rail (the shortcut above may have opened it already).
        if (width < 600 && (await page.locator(".kz-builder-editor input[type=text]:visible").count()) === 0) await page.getByRole("button", { name: w.fieldsToggle, exact: true }).first().click();
        await page.locator(".kz-builder-editor input[type=text]:visible").first().fill("");
        const status = page.getByRole("status").filter({ hasText: w.one });
        await status.waitFor({ timeout: 5000 });
        const sentences = await status.locator("xpath=following-sibling::ul[1]").innerText();
        if (/blocks\.\d|props\./.test(sentences)) problems.push(`${tag}: a raw path in the missing list: ${sentences.slice(0, 100)}`);

        const defects = await axeDefects(page);
        if (defects.length) problems.push(`${tag}: axe: ${defects.join(" | ")}`);
        if (shots) await page.screenshot({ path: `${shots}/builder-${locale}-${theme}-${width}.png`, fullPage: false });

        if (width === 1440 && theme === "dark") {
          // Keyboard: the skip link is the first tab stop of the demo and leads past the editor.
          const skip = page.getByRole("link", { name: w.skip });
          await skip.focus();
          await page.keyboard.press("Enter");
          if (!(await page.evaluate(() => document.activeElement?.id === "builder-after"))) problems.push(`${tag}: the skip link does not land after the editor`);
          // …and the shortcut to the fields is within 10 tab stops of it and lands on a text field of the editor.
          await skip.focus();
          let stops = 0;
          for (; stops < 10; stops++) {
            await page.keyboard.press("Tab");
            if ((await page.evaluate(() => document.activeElement?.textContent)) === w.toFields) break;
          }
          if (stops >= 10) problems.push(`${tag}: no shortcut to the fields within 10 tab stops`);
          await page.keyboard.press("Enter");
          if (!(await page.evaluate(() => /^(INPUT|TEXTAREA)$/.test(document.activeElement?.tagName ?? "") && !!document.activeElement?.closest(".kz-builder-editor")))) problems.push(`${tag}: the shortcut does not focus a field`);
          // The site's bar never covers the editor's header: the field in view has the editor's header under it, clear of the bar.
          const covered = await page.evaluate(() => {
            const bar = document.querySelector(".kz-site-bar-wrap");
            const editor = document.querySelector(".kz-builder-editor");
            if (!bar || !editor) return "no bar or editor";
            editor.scrollIntoView({ block: "start" });
            const barBottom = bar.getBoundingClientRect().bottom;
            return editor.getBoundingClientRect().top < barBottom - 0.5 ? `editor top ${Math.round(editor.getBoundingClientRect().top)} < bar bottom ${Math.round(barBottom)}` : "";
          });
          if (covered) problems.push(`${tag}: the bar covers the editor: ${covered}`);
          // The canvas is set in the site's font.
          const fonts = await page.evaluate(async () => {
            const first = (v) => v.split(",")[0].replace(/["']/g, "").trim();
            const frame = document.querySelector("iframe").contentDocument;
            const h1 = frame.querySelector("h1");
            await frame.fonts.ready;
            const family = first(getComputedStyle(h1).fontFamily);
            return { site: first(getComputedStyle(document.body).fontFamily), canvas: family, loaded: frame.fonts.check(`16px "${family}"`) };
          });
          if (fonts.site !== fonts.canvas || !fonts.loaded) problems.push(`${tag}: the canvas font is ${JSON.stringify(fonts)}`);
        }
      } catch (error) {
        problems.push(`${tag}: ${error.message.split("\n")[0]}`);
      }
      await context.close();
    }
  }
}
await browser.close();
if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log("builder-check: one verdict, sentences in en and fr, axe clean, keyboard path, site font (en/fr × dark/light × 1440/360)");
