#!/usr/bin/env node
/* The live demo at /builder, driven in a real browser (Playwright): the editor chunk loads and the starter page is drawn,
   the French switch shows the French words, clearing a French text lists it under « Missing translations », and each of the
   three attacks is refused with its message. Also fails on a console error. Usage:
   node scripts/builder-check.mjs --base http://localhost:4600 [--playwright <path to playwright>] */

import { createRequire } from "node:module";

const args = process.argv.slice(2);
const flag = (name, fallback) => (args.includes(name) ? args[args.indexOf(name) + 1] : fallback);
const base = flag("--base", "http://localhost:4600").replace(/\/$/, "");
const { chromium } = createRequire(import.meta.url)(flag("--playwright", "playwright"));

const WORDS = {
  en: { path: "/builder/", title: "Bread, baked at five.", missing: "Missing translations", attack: "An onClick prop", refused: "Refused", valid: /Valid · 4 blocks/ },
  fr: { path: "/fr/builder/", title: "Du pain, cuit à cinq heures.", missing: "Traductions manquantes", attack: "Une prop onClick", refused: "Refusé", valid: /Valide · 4 blocs/ },
};

const browser = await chromium.launch();
const problems = [];
for (const [locale, w] of Object.entries(WORDS)) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  page.on("console", (m) => m.type() === "error" && problems.push(`${locale}: console: ${m.text().slice(0, 200)}`));
  page.on("pageerror", (e) => problems.push(`${locale}: exception: ${e.message.slice(0, 200)}`));
  await page.goto(base + w.path, { waitUntil: "load" });
  const canvas = page.frameLocator("iframe").first();
  try {
    // The page opens in its own language; the starter page is drawn in the editor's canvas.
    await canvas.getByRole("heading", { level: 1, name: w.title }).waitFor({ timeout: 20000 });
    await page.getByText(w.valid).first().waitFor({ timeout: 5000 });
    // Clearing the French eyebrow (the first block is selected) lists it.
    await page.getByRole("group", { name: /Content language|Langue du contenu/ }).getByRole("button", { name: "Français" }).click();
    await canvas.getByRole("heading", { level: 1, name: WORDS.fr.title }).waitFor({ timeout: 5000 });
    const eyebrow = page.locator(".kz-builder-editor input[type=text]:visible").first();
    await eyebrow.fill("");
    await page.getByText(/1 (text|texte)/).first().waitFor({ timeout: 5000 });
    // The three attacks are refused, each with its message.
    for (const [id, expected] of [["script", /text holds no markup/], ["handler", /not an allowed prop name/], ["proto", /__proto__/]]) {
      const names = { script: /script/i, handler: /onClick/, proto: /__proto__/ };
      await page.getByRole("button", { name: names[id] }).first().click();
      await page.getByText(w.refused, { exact: true }).waitFor({ timeout: 5000 });
      const text = await page.getByRole("list", { name: /Result of the attack|Résultat de l’attaque/ }).innerText();
      if (!expected.test(text)) problems.push(`${locale}: attack ${id} shows: ${text.slice(0, 120)}`);
    }
  } catch (error) {
    problems.push(`${locale}: ${error.message.split("\n")[0]}`);
  }
  await context.close();
}
await browser.close();
if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log("builder-check: the editor loads, switches language, lists a missing French text and refuses the three attacks (en, fr)");
