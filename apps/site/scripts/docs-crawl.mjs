#!/usr/bin/env node
/* The documentation crawler of ui.krizaka.com: EVERY page of the sitemap (English and French) opened in a real browser
   (Playwright), at desktop and phone width, with its examples driven like a reader would.

   On each page it records, by category (see CATEGORIES):
     console-error · page-error · react-error · failed-request · http-error      what the browser reports
     empty-example · zero-size-example                                           an example that renders nothing
     knob-noop · playground-empty                                                a playground control that changes nothing
     copy-empty                                                                  a copy button that copies nothing
     dead-link · dead-anchor                                                     links and #anchors that lead nowhere
     overflow-x                                                                  a page that scrolls sideways
     interaction-error                                                           an example that throws on click, focus, type

   Usage: node scripts/docs-crawl.mjs --base https://ui.krizaka.com
            [--sitemap <url|path>]   default <base>/sitemap.xml (its host is rewritten to --base)
            [--lang en|fr|both]      default both
            [--views desktop,phone]  default both
            [--subset <n>]           a fast subset: every non-component page plus n component pages (the PR check)
            [--only <substring>]     only the pages whose path contains it (debugging)
            [--no-external]          do not check links to other sites
            [--concurrency <n>]      default 4
            [--out <dir>]            report.json, report.md and the screenshots of the pages with problems
            [--playwright <path>]    where to require playwright from
   Exit code 1 when a problem is found, unless it matches TOLERATED (the reasons are written there, in one place). */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";

export const CATEGORIES = [
  "console-error",
  "page-error",
  "react-error",
  "failed-request",
  "http-error",
  "empty-example",
  "zero-size-example",
  "knob-noop",
  "playground-empty",
  "copy-empty",
  "dead-link",
  "dead-anchor",
  "overflow-x",
  "interaction-error",
];

/* Known and tolerated while it lasts, each with its reason. A tolerated problem is still listed (as « tolerated »),
   never counted as a failure. */
export const TOLERATED = [
  { re: /krizaka-assets\.b-cdn\.net\/maps\/v1\//, why: "the CDN's map tiles may lack CORS headers; MapGate shows the photograph meanwhile" },
  { re: /net::ERR_ABORTED/, why: "a request cancelled by a navigation or a prefetch" },
];

const REACT_ERROR = /Minified React error #\d+|React error #\d+|Hydration failed|hydrat\w+ (error|mismatch)|did not match|Text content does not match|Maximum update depth|Cannot update a component|Each child in a list should have a unique "key"/i;

export function parseArgs(argv) {
  const get = (name, fallback) => (argv.includes(name) ? argv[argv.indexOf(name) + 1] : fallback);
  return {
    base: get("--base", "http://localhost:4600").replace(/\/$/, ""),
    sitemap: get("--sitemap", null),
    lang: get("--lang", "both"),
    views: get("--views", "desktop,phone").split(","),
    subset: get("--subset", null) ? Number(get("--subset")) : null,
    only: get("--only", null),
    external: !argv.includes("--no-external"),
    concurrency: Number(get("--concurrency", "4")),
    out: get("--out", null),
    playwright: get("--playwright", "playwright"),
  };
}

/** The paths of a sitemap's <loc> entries, made relative (the host of the file is the production one). */
export function pathsOfSitemap(xml) {
  return [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => new URL(m[1]).pathname).filter((p, i, all) => all.indexOf(p) === i);
}

/** The pages of a fast subset: every page that is not a component page, and `sample` component pages (stable). */
export function pickSubset(paths, sample) {
  const isComponent = (p) => /^\/(fr\/)?components\/[^/]+\/?$/.test(p);
  const components = paths.filter(isComponent);
  const step = Math.max(1, Math.floor(components.length / Math.max(1, sample)));
  const picked = new Set(components.filter((_, i) => i % step === 0).slice(0, sample));
  for (const key of ["button", "dialog", "map", "line-chart", "vertical-video"]) for (const p of components) if (p.replace(/\/$/, "").endsWith(`/${key}`)) picked.add(p);
  return paths.filter((p) => !isComponent(p) || picked.has(p));
}

export function toleratedBy(text) {
  return TOLERATED.find((t) => t.re.test(text))?.why ?? null;
}

export function summarize(problems) {
  const counts = Object.fromEntries(CATEGORIES.map((c) => [c, 0]));
  const tolerated = Object.fromEntries(CATEGORIES.map((c) => [c, 0]));
  for (const p of problems) (p.tolerated ? tolerated : counts)[p.category]++;
  return { counts, tolerated };
}

const DEBUG = process.argv.includes("--debug");
const VIEWPORTS = { desktop: { width: 1440, height: 900, scale: 1 }, phone: { width: 390, height: 844, scale: 2 } };

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const require = createRequire(import.meta.url);
  const { chromium } = require(opts.playwright);
  const origin = new URL(opts.base).origin;

  const sitemapSource = opts.sitemap ?? `${opts.base}/sitemap.xml`;
  const xml = /^https?:/.test(sitemapSource) ? await (await fetch(sitemapSource)).text() : readFileSync(sitemapSource, "utf8");
  let paths = pathsOfSitemap(xml);
  if (opts.lang === "en") paths = paths.filter((p) => !p.startsWith("/fr"));
  if (opts.lang === "fr") paths = paths.filter((p) => p === "/fr" || p.startsWith("/fr/"));
  if (opts.only) paths = paths.filter((p) => p.includes(opts.only));
  if (opts.subset) paths = pickSubset(paths, opts.subset);
  console.log(`docs-crawl: ${paths.length} pages × ${opts.views.join("+")} on ${opts.base}`);
  if (opts.out) mkdirSync(opts.out, { recursive: true });

  const browser = await chromium.launch();
  const problems = [];
  const add = (page, view, category, detail) => {
    const why = toleratedBy(detail);
    problems.push({ page, view, category, detail: detail.slice(0, 300), tolerated: Boolean(why), ...(why ? { why } : {}) });
  };

  // Links are checked once for the whole crawl.
  const linkCache = new Map();
  const htmlCache = new Map();
  const request = (await browser.newContext()).request;
  const fetchStatus = (url) => {
    if (!linkCache.has(url)) {
      linkCache.set(
        url,
        (async () => {
          try {
            let r = await request.head(url, { timeout: 15000, maxRedirects: 5 });
            if (r.status() >= 400) r = await request.get(url, { timeout: 20000, maxRedirects: 5 });
            return r.status();
          } catch (e) {
            return `error: ${String(e.message).split("\n")[0].slice(0, 80)}`;
          }
        })(),
      );
    }
    return linkCache.get(url);
  };
  const htmlOf = (url) => {
    if (!htmlCache.has(url)) htmlCache.set(url, request.get(url, { timeout: 20000 }).then((r) => (r.ok() ? r.text() : "")).catch(() => ""));
    return htmlCache.get(url);
  };

  const linkRefs = new Map(); // href -> where it was found; checked once, after the crawl
  const crawlPage = async (context, view, path) => {
    const page = await context.newPage();
    let phase = "load";
    const note = (category, detail) => add(path, view, category, phase === "interaction" ? `[during an interaction] ${detail}` : detail);
    page.on("console", (m) => {
      if (m.type() !== "error") return;
      const text = m.text();
      if (/^Failed to load resource/.test(text)) return; // reported by the response / requestfailed handlers, with the URL
      const from = m.location()?.url ? ` (${m.location().url.replace(origin, "")})` : "";
      note(REACT_ERROR.test(text) ? "react-error" : phase === "interaction" ? "interaction-error" : "console-error", text.slice(0, 220) + from);
    });
    page.on("pageerror", (e) => note(REACT_ERROR.test(e.message) ? "react-error" : phase === "interaction" ? "interaction-error" : "page-error", e.message.slice(0, 220)));
    page.on("requestfailed", (r) => note("failed-request", `${r.method()} ${r.url().replace(origin, "")} — ${r.failure()?.errorText}`));
    page.on("response", (r) => {
      if (r.status() >= 400 && !r.url().startsWith("data:")) note("http-error", `${r.status()} ${r.url().replace(origin, "")}`);
    });
    page.on("dialog", (d) => d.dismiss().catch(() => {}));

    let response;
    try {
      response = await page.goto(origin + path, { waitUntil: "load", timeout: 45000 });
      await page.waitForLoadState("networkidle", { timeout: 4000 }).catch(() => {}); // a page that keeps a socket open (a captcha) is judged after 4 s
    } catch (e) {
      add(path, view, "http-error", `the page did not load: ${String(e.message).split("\n")[0]}`);
      await page.close();
      return;
    }
    if (!response || response.status() !== 200) add(path, view, "http-error", `the page answers ${response?.status()}`);

    // Wake every lazy example: scroll down the page.
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < Math.min(height, 40000); y += 700) {
      await page.evaluate((top) => window.scrollTo(0, top), y);
      await page.waitForTimeout(60);
    }
    await page.waitForTimeout(700);
    await page.evaluate(() => window.scrollTo(0, 0));

    // 1 · Overflow, empty examples, links and anchors.
    const facts = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const out = { overflow: document.documentElement.scrollWidth > vw + 1 ? `${document.documentElement.scrollWidth} > ${vw}` : null, links: [], anchors: [], empty: [] };
      for (const el of document.querySelectorAll(".kz-live-example")) {
        const label = (el.closest("[aria-label]")?.getAttribute("aria-label") || el.closest("[id]")?.id || "an example").slice(0, 80);
        // Empty: nothing in it has a box (a skeleton is a box with no text, and is not empty).
        const boxes = [...el.querySelectorAll("*")].map((e) => e.getBoundingClientRect()).filter((b) => b.width >= 1 && b.height >= 1);
        if (!el.firstElementChild || (!boxes.length && !el.textContent.trim())) out.empty.push({ kind: "empty", label });
        else if (!boxes.length) out.empty.push({ kind: "zero", label });
      }
      for (const a of document.querySelectorAll("a[href]")) {
        const href = a.getAttribute("href");
        if (!href || /^(mailto:|tel:|javascript:)/.test(href)) continue;
        const url = new URL(href, location.href);
        // A link inside an example or a catalogue thumbnail is sample content (« href="#docs" » in a nav bar's example): the
        // site makes it inert. Only an absolute link to another site is checked there (« See the code » must exist).
        if (a.closest(".kz-live-example, .kz-catalog-live") && !/^https?:\/\//.test(href)) continue;
        if (url.origin === location.origin && url.pathname === location.pathname && url.hash) {
          const id = decodeURIComponent(url.hash.slice(1));
          if (id && !document.getElementById(id) && !document.getElementsByName(id).length) {
            const where = [];
            for (let e = a.parentElement; e && where.length < 3; e = e.parentElement) if (typeof e.className === "string" && e.className.startsWith("kz-")) where.push(e.className.split(" ")[0]);
            out.anchors.push({ href, text: a.textContent.trim().slice(0, 40), where: where.join(" < ") });
          }
        } else out.links.push({ href: url.href, text: a.textContent.trim().slice(0, 40) });
      }
      return out;
    });
    if (facts.overflow) note("overflow-x", `the page scrolls sideways (${facts.overflow})`);
    for (const e of facts.empty) note(e.kind === "zero" ? "zero-size-example" : "empty-example", e.label);
    for (const a of facts.anchors) note("dead-anchor", `${a.href} (« ${a.text} »)${a.where ? ` in ${a.where}` : ""}: no such id on the page`);
    for (const l of facts.links) {
      if (/\/_next\//.test(new URL(l.href).pathname)) continue;
      const key = l.href;
      if (!linkRefs.has(key)) linkRefs.set(key, []);
      linkRefs.get(key).push({ path, view, text: l.text });
    }

    // 2 · Interactions.
    const t0 = Date.now();
    phase = "interaction";
    await context.grantPermissions(["clipboard-read", "clipboard-write"], { origin }).catch(() => {});
    await interact(page, note);
    phase = "load";
    if (DEBUG) console.log(`  ${view} ${path}: interactions ${Date.now() - t0} ms`);

    if (opts.out && problems.some((p) => p.page === path && p.view === view && !p.tolerated)) {
      await page.screenshot({ path: `${opts.out}/${view}${path.replace(/\//g, "_") || "_"}.png` }).catch(() => {});
    }
    await page.close();
  };

  const jobs = opts.views.flatMap((view) => paths.map((path) => ({ view, path })));
  let next = 0;
  let done = 0;
  const worker = async () => {
    const contexts = {};
    while (next < jobs.length) {
      const { view, path } = jobs[next++];
      const vp = VIEWPORTS[view];
      contexts[view] ??= await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: vp.scale, isMobile: view === "phone", hasTouch: view === "phone" });
      try {
        await crawlPage(contexts[view], view, path);
      } catch (e) {
        add(path, view, "page-error", `the crawler could not finish this page: ${String(e.message).split("\n")[0]}`);
      }
      if (++done % 50 === 0) console.log(`  … ${done}/${jobs.length}`);
    }
    for (const c of Object.values(contexts)) await c.close();
  };
  await Promise.all(Array.from({ length: Math.max(1, opts.concurrency) }, worker));

  // Links, once each, in parallel. Other sites often refuse a robot (403, 429, 999): only a 404/410 or an unresolvable host is dead there.
  const hrefs = [...linkRefs.keys()].filter((h) => opts.external || new URL(h).origin === origin);
  let cursor = 0;
  const checkWorker = async () => {
    while (cursor < hrefs.length) {
      const href = hrefs[cursor++];
      const url = new URL(href);
      const internal = url.origin === origin;
      const status = await fetchStatus(url.origin + url.pathname + url.search);
      const dead = typeof status === "string" ? /ENOTFOUND|certificate/.test(status) : internal ? status >= 400 : status === 404 || status === 410;
      let anchorDead = false;
      if (!dead && internal && url.hash && status === 200) {
        const id = decodeURIComponent(url.hash.slice(1));
        const html = await htmlOf(origin + url.pathname);
        anchorDead = Boolean(id && html && !new RegExp(`(id|name)=["']${id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`).test(html));
      }
      if (!dead && !anchorDead) continue;
      for (const ref of linkRefs.get(href)) add(ref.path, ref.view, dead ? "dead-link" : "dead-anchor", dead ? `${href} → ${status} (« ${ref.text} »)` : `${href}: no such id on the target page`);
    }
  };
  await Promise.all(Array.from({ length: 16 }, checkWorker));
  await browser.close();

  const { counts, tolerated } = summarize(problems);
  const failures = problems.filter((p) => !p.tolerated);
  const byComponent = {};
  for (const p of failures) {
    const m = /^\/(?:fr\/)?components\/([^/]+)/.exec(p.page);
    const k = m ? m[1] : p.page;
    byComponent[k] ??= {};
    byComponent[k][p.category] = (byComponent[k][p.category] ?? 0) + 1;
  }
  const report = { base: opts.base, pages: paths.length, views: opts.views, counts, tolerated, total: failures.length, byComponent, problems };
  const sum = (o) => Object.values(o).reduce((x, y) => x + y, 0);
  const md = [
    `# docs-crawl — ${opts.base}`,
    `${paths.length} pages × ${opts.views.join(" + ")}; ${failures.length} problem(s), ${problems.length - failures.length} tolerated.`,
    "",
    "| Category | Problems | Tolerated |",
    "|---|---:|---:|",
    ...CATEGORIES.map((c) => `| ${c} | ${counts[c]} | ${tolerated[c]} |`),
    "",
    "## By component or page",
    ...Object.entries(byComponent).sort((a, b) => sum(b[1]) - sum(a[1])).map(([k, v]) => `- ${k}: ${Object.entries(v).map(([c, n]) => `${c} ×${n}`).join(", ")}`),
    "",
    "## Problems",
    ...failures.map((p) => `- [${p.category}] ${p.view} ${p.page} — ${p.detail}`),
  ].join("\n");
  if (opts.out) {
    writeFileSync(`${opts.out}/report.json`, JSON.stringify(report, null, 2));
    writeFileSync(`${opts.out}/report.md`, md + "\n");
  }
  for (const p of failures.slice(0, 200)) console.log(`✗ [${p.category}] ${p.view} ${p.page} — ${p.detail}`);
  if (failures.length > 200) console.log(`… and ${failures.length - 200} more (see report.md)`);
  console.log(JSON.stringify(counts));
  console.log(failures.length ? `docs-crawl: ${failures.length} problem(s) on ${opts.base}` : `docs-crawl: ${paths.length} pages × ${opts.views.length} views on ${opts.base} — all good`);
  process.exit(failures.length ? 1 : 0);
}

/* The examples and playgrounds of the page, driven like a reader would. Errors raised meanwhile are attributed to the
   interaction by `note` (the phase). */
async function interact(page, note) {
  const lap = (what, t) => DEBUG && console.log(`    ${what}: ${Date.now() - t} ms`);
  let t = Date.now();
  // Playgrounds: every control must change the canvas or the code.
  const plays = page.locator(".kz-play");
  for (let i = 0; i < (await plays.count()); i++) {
    const play = plays.nth(i);
    await play.scrollIntoViewIfNeeded().catch(() => {});
    await page.waitForTimeout(400);
    const canvas = play.locator(".kz-play-canvas");
    const snap = async () => ({
      html: await canvas.evaluate((c) => c.innerHTML).catch(() => ""),
      code: await play.locator(".kz-play-code").evaluate((c) => c.textContent).catch(() => ""),
      shot: (await canvas.screenshot({ animations: "disabled" }).catch(() => Buffer.alloc(0))).toString("base64"),
    });
    const same = (a, b) => a.html === b.html && a.code === b.code && a.shot === b.shot;
    const box = await canvas.boundingBox();
    const filled = await canvas.evaluate((c) => c.children.length > 0 && !c.querySelector(".kz-play-wait")).catch(() => false);
    if (!box || box.width < 4 || box.height < 4 || !filled) note("playground-empty", "the playground canvas renders nothing");
    const rows = play.locator(".kz-play-row");
    for (let r = 0; r < (await rows.count()); r++) {
      const row = rows.nth(r);
      const label = ((await row.locator(".kz-play-label").first().textContent().catch(() => "")) ?? "").trim().slice(0, 30);
      const before = await snap();
      let acted = false;
      const sw = row.locator('[role="switch"]');
      const slider = row.locator('[role="slider"]');
      const input = row.locator('input[type="text"], input:not([type]), textarea');
      const options = row.locator('[role="radio"], button');
      try {
        if (await sw.count()) {
          await sw.first().click({ timeout: 3000 });
          acted = true;
        } else if (await slider.count()) {
          await slider.first().focus();
          await page.keyboard.press("ArrowRight");
          await page.keyboard.press("ArrowRight");
          acted = true;
        } else if (await input.count()) {
          await input.first().fill("Krizaka x");
          acted = true;
        } else if (await options.count()) {
          // choose the options in turn until one changes the canvas
          for (let c = 0; c < (await options.count()); c++) {
            const el = options.nth(c);
            const on = (await el.getAttribute("aria-checked")) === "true" || (await el.getAttribute("aria-pressed")) === "true" || ["on", "checked"].includes((await el.getAttribute("data-state")) ?? "");
            if (on) continue;
            await el.click({ timeout: 3000 });
            acted = true;
            await page.waitForTimeout(200);
            if (!same(before, await snap())) break;
          }
        }
      } catch (e) {
        note("interaction-error", `playground control « ${label} »: ${String(e.message).split("\n")[0].slice(0, 120)}`);
        continue;
      }
      if (!acted) continue;
      await page.waitForTimeout(250);
      if (same(before, await snap())) note("knob-noop", `playground control « ${label} » changes neither the canvas nor the code`);
    }
  }

  lap("playgrounds", t);
  t = Date.now();
  // Copy buttons: they must copy something.
  const copies = page.locator('button[aria-label*="opy" i], button[aria-label*="opier" i], button[data-copy], pre ~ button[aria-live], figure button[aria-live="polite"]');
  const copyCount = Math.min(await copies.count(), 40);
  for (let i = 0; i < copyCount; i++) {
    const btn = copies.nth(i);
    // A « Copy » button inside an example is sample content (a tooltip's trigger), unless it sits in a code block.
    const sample = await btn.evaluate((b) => Boolean(b.closest(".kz-live-example, .kz-catalog-live")) && !b.parentElement?.querySelector("pre, code") && !b.closest("figure, [data-rehype-pretty-code-figure]")).catch(() => false);
    if (sample) continue;
    await btn.scrollIntoViewIfNeeded({ timeout: 1000 }).catch(() => {});
    if (!(await btn.isVisible().catch(() => false))) continue;
    try {
      await page.evaluate(() => navigator.clipboard.writeText("__empty__"));
      await btn.click({ timeout: 3000, force: true });
      let text = "";
      for (let tries = 0; tries < 8 && (!text.trim() || text === "__empty__"); tries++) {
        await page.waitForTimeout(150);
        text = await page.evaluate(() => navigator.clipboard.readText());
      }
      if (!text.trim() || text === "__empty__") note("copy-empty", `a copy button copied nothing (« ${((await btn.getAttribute("aria-label")) ?? "").slice(0, 40)} »)`);
    } catch (e) {
      note("interaction-error", `a copy button threw: ${String(e.message).split("\n")[0].slice(0, 120)}`);
    }
  }

  lap("copy", t);
  t = Date.now();
  // Examples: click the first control, open what opens, type in the first field, focus the tabbables.
  const examples = page.locator(".kz-live-example");
  const total = Math.min(await examples.count(), 60);
  for (let i = 0; i < total; i++) {
    const ex = examples.nth(i);
    try {
      await ex.scrollIntoViewIfNeeded({ timeout: 2000 });
    } catch {
      continue;
    }
    await page.waitForTimeout(120);
    const url = page.url();
    const targets = ex.locator('button:not([disabled]), [role="tab"], [role="switch"], [role="checkbox"], [role="combobox"], summary, [role="button"]:not([aria-disabled="true"])');
    if (await targets.count()) {
      const first = targets.first();
      if (await first.isVisible().catch(() => false)) {
        await first.click({ timeout: 2500 }).catch((e) => {
          if (!/intercepts pointer|not stable|detached|outside of the viewport|not visible|Timeout/.test(String(e.message))) note("interaction-error", `click threw: ${String(e.message).split("\n")[0].slice(0, 120)}`);
        });
        await page.waitForTimeout(250);
        if (await page.locator('[role="dialog"], [role="alertdialog"], [role="menu"], [role="listbox"], [data-radix-popper-content-wrapper]').count()) {
          await page.keyboard.press("Escape");
          await page.waitForTimeout(150);
        }
      }
    }
    const field = ex.locator('input[type="text"], input[type="search"], input[type="email"], input:not([type]), textarea').first();
    if (await field.count()) {
      await field.fill("Krizaka", { timeout: 2000 }).catch(() => {});
      await field.press("Enter", { timeout: 1000 }).catch(() => {});
    }
    const tabbables = ex.locator('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex="0"]');
    for (let t = 0; t < Math.min(await tabbables.count(), 3); t++) await tabbables.nth(t).focus({ timeout: 800 }).catch(() => {});
    if (page.url() !== url) {
      // An example that navigates away is a link doing its job; come back.
      await page.goBack({ waitUntil: "networkidle" }).catch(() => {});
      break;
    }
  }
  lap("examples", t);
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) await main();
