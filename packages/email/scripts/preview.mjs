#!/usr/bin/env node
/* The email preview: every template, in both languages and a brand, written to `.preview/` (git-ignored) with an index
   that shows each one in a frame — light, dark and phone width. Needs the build (`pnpm --filter @krizaka/email build`).

     pnpm --filter @krizaka/email preview                      # writes .preview/ and prints the index path
     pnpm --filter @krizaka/email preview -- --shots <dir>     # also screenshots (Playwright): light and dark, desktop and phone
     pnpm --filter @krizaka/email preview -- --brand orazaka   # a product's theme */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { EMAIL_LOCALES, renderEmail, TEMPLATE_IDS, templates } from "../dist/index.js";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const arg = (name) => {
  const i = process.argv.indexOf(name);
  return i > 0 ? process.argv[i + 1] : undefined;
};
const brand = arg("--brand") ?? "krizaka";
const shots = arg("--shots");
const out = path.join(root, ".preview");
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

const rows = [];
for (const id of TEMPLATE_IDS) {
  for (const locale of EMAIL_LOCALES) {
    const email = await renderEmail(id, { ...templates[id].example, brand }, { locale });
    const base = `${id}.${locale}`;
    fs.writeFileSync(path.join(out, `${base}.html`), email.html);
    fs.writeFileSync(path.join(out, `${base}.txt`), `Subject: ${email.subject}\n${Object.entries(email.headers).map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n${email.text}`);
    rows.push({ id, locale, base, subject: email.subject, category: email.category });
  }
}

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const index = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Krizaka emails — preview</title>
<style>body{font:14px/1.4 system-ui,sans-serif;margin:0;background:#eef0f5;color:#12141a}header{position:sticky;top:0;background:#fff;border-bottom:1px solid #d9dce6;padding:10px 16px;display:flex;gap:8px;align-items:center;z-index:1}
main{display:grid;grid-template-columns:repeat(auto-fill,minmax(420px,1fr));gap:16px;padding:16px}figure{margin:0;background:#fff;border:1px solid #d9dce6;border-radius:8px;overflow:hidden}figcaption{padding:8px 12px;font-weight:600;display:flex;justify-content:space-between}
figcaption small{font-weight:400;color:#566073}iframe{width:100%;height:720px;border:0;display:block}button{font:inherit;padding:6px 12px;border:1px solid #b7bccb;background:#fff;border-radius:6px;cursor:pointer}
main.phone iframe{width:375px;margin:0 auto}a{color:#0954ce}</style>
<header><strong>Emails — ${esc(brand)}</strong><button id="dark">Dark</button><button id="phone">Phone width</button></header>
<main>${rows.map((r) => `<figure><figcaption>${esc(r.id)} · ${r.locale}<small>${esc(r.category)} · <a href="${r.base}.txt">text</a></small></figcaption><div style="padding:0 12px 6px" class="subject">${esc(r.subject)}</div><iframe loading="lazy" title="${esc(r.base)}" src="${r.base}.html"></iframe></figure>`).join("")}</main>
<script>
const frames=()=>[...document.querySelectorAll("iframe")];
document.getElementById("dark").onclick=e=>{const on=e.target.dataset.on!=="1";e.target.dataset.on=on?"1":"";frames().forEach(f=>{const d=f.contentDocument;d.documentElement.toggleAttribute("data-ogsc",on);d.documentElement.style.background=on?"#0a0c11":""})};
document.getElementById("phone").onclick=()=>document.querySelector("main").classList.toggle("phone");
</script></html>`;
fs.writeFileSync(path.join(out, "index.html"), index);
console.log(`${rows.length} emails: ${pathToFileURL(path.join(out, "index.html"))}`);

if (shots) {
  const { chromium } = await import("playwright");
  fs.mkdirSync(shots, { recursive: true });
  const browser = await chromium.launch();
  for (const scheme of ["light", "dark"]) {
    for (const [name, width] of [["desktop", 760], ["phone", 375]]) {
      const page = await browser.newPage({ colorScheme: scheme, viewport: { width, height: 900 } });
      for (const r of rows) {
        await page.goto(pathToFileURL(path.join(out, `${r.base}.html`)).href);
        await page.waitForLoadState("networkidle");
        await page.screenshot({ path: path.join(shots, `${brand}-${r.base}-${scheme}-${name}.png`), fullPage: true });
      }
      await page.close();
    }
  }
  await browser.close();
  console.log(`screenshots in ${shots}`);
}
