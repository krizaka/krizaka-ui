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
            [--shard <i>/<n>]        only the i-th of n slices of the pages (CI runs the slices side by side)
            [--no-external]          do not check links to other sites
            [--concurrency <n>]      default 4
            [--out <dir>]            report.json, report.md and the screenshots of the pages with problems
            [--playwright <path>]    where to require playwright from
   Exit code 1 when a problem is found, unless it matches TOLERATED (the reasons are written there, in one place).

   Why: the docs of ui.krizaka.com are the product's face; a broken example or dead link must fail the PR, not be found by a reader.
   Owner: krizaka-ui (lane platform). How it is split (ADR-026 phase D): docs-crawl-verdicts.mjs (what is a problem, what is
   tolerated), docs-crawl-pages.mjs (which pages), docs-crawl-interact.mjs (what a reader does), docs-crawl-report.mjs (the report). */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";

import { DEBUG, interact } from "./docs-crawl-interact.mjs";
import { parseArgs, pathsOfSitemap, pickShard, pickSubset } from "./docs-crawl-pages.mjs";
import { buildReport } from "./docs-crawl-report.mjs";
import {
  htmlDeclaresAnchor,
  isDeadLink,
  isFailedResourceLine,
  isReactError,
  isThirdPartyFrame,
  PERMISSIONS_POLICY,
  THIRD_PARTY_FRAME,
  toleratedBy,
} from "./docs-crawl-verdicts.mjs";

export * from "./docs-crawl-pages.mjs";
export * from "./docs-crawl-verdicts.mjs";

/** The URL of the frame that sent a request; a service worker's request has no frame (it is the page's). */
function frameUrlOf(request) {
  try {
    return request.frame().url();
  } catch {
    return undefined;
  }
}

const VIEWPORTS = { desktop: { width: 1440, height: 900, scale: 1 }, phone: { width: 390, height: 844, scale: 2 } };

/* The next functions run IN the page (page.evaluate): each is self-contained and is sent by its source, see FACTS_SCRIPT. */
function exampleLabel(el) {
  return (el.closest("[aria-label]")?.getAttribute("aria-label") || el.closest("[id]")?.id || "an example").slice(0, 80);
}

/** Empty: nothing in it has a box (a skeleton is a box with no text, and is not empty). Null when the example renders. */
function emptyKindOf(el) {
  const boxes = [...el.querySelectorAll("*")].map((e) => e.getBoundingClientRect()).filter((b) => b.width >= 1 && b.height >= 1);
  if (!el.firstElementChild || (!boxes.length && !el.textContent.trim())) return "empty";
  return boxes.length ? null : "zero";
}

function anchorWhere(a) {
  const where = [];
  for (let e = a.parentElement; e && where.length < 3; e = e.parentElement) {
    if (typeof e.className === "string" && e.className.startsWith("kz-")) where.push(e.className.split(" ")[0]);
  }
  return where.join(" < ");
}

/** A link inside an example or a catalogue thumbnail is sample content (« href="#docs" » in a nav bar's example): the
    site makes it inert. Only an absolute link to another site is checked there (« See the code » must exist). */
function isInertSample(a, href) {
  return Boolean(a.closest(".kz-live-example, .kz-catalog-live")) && !/^https?:\/\//.test(href);
}

function deadAnchorOf(a, url, href) {
  const id = decodeURIComponent(url.hash.slice(1));
  if (!id || document.getElementById(id) || document.getElementsByName(id).length) return null;
  return { href, text: a.textContent.trim().slice(0, 40), where: anchorWhere(a) };
}

function collectFacts() {
  const vw = document.documentElement.clientWidth;
  const width = document.documentElement.scrollWidth;
  const out = { overflow: width > vw + 1 ? `${width} > ${vw}` : null, links: [], anchors: [], empty: [] };
  for (const el of document.querySelectorAll(".kz-live-example")) {
    const kind = emptyKindOf(el);
    if (kind) out.empty.push({ kind, label: exampleLabel(el) });
  }
  for (const a of document.querySelectorAll("a[href]")) {
    const href = a.getAttribute("href");
    if (!href || /^(mailto:|tel:|javascript:)/.test(href) || isInertSample(a, href)) continue;
    const url = new URL(href, location.href);
    if (url.origin === location.origin && url.pathname === location.pathname && url.hash) {
      const dead = deadAnchorOf(a, url, href);
      if (dead) out.anchors.push(dead);
    } else out.links.push({ href: url.href, text: a.textContent.trim().slice(0, 40) });
  }
  return out;
}

const FACTS_SCRIPT = `(() => { ${exampleLabel} ${emptyKindOf} ${anchorWhere} ${isInertSample} ${deadAnchorOf} return (${collectFacts})(); })()`;

/** A React error is one whatever the phase; any other error raised during an interaction is the interaction's. */
function errorCategory(state, message, otherwise) {
  if (isReactError(message)) return "react-error";
  return state.phase === "interaction" ? "interaction-error" : otherwise;
}

/** The console of a third-party embed is that site's, not this page's: the page's own errors keep their origin and are still reported.
    (YouTube's embed complains about its own permissions policy; a click may wake Instagram's reel player, a report-only CSP.) */
function isThirdPartyConsole(text, url, origin, phase) {
  if (!url || url.startsWith(origin)) return false;
  if (PERMISSIONS_POLICY.test(text)) return true;
  return phase === "interaction" && /^https?:\/\//.test(url);
}

function listenToPage(page, { origin, state, note }) {
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    const text = m.text();
    if (isFailedResourceLine(text)) return; // reported by the response / requestfailed handlers, with the URL
    const url = m.location()?.url;
    if (isThirdPartyConsole(text, url, origin, state.phase)) return;
    const from = url ? ` (${url.replace(origin, "")})` : "";
    note(errorCategory(state, text, "console-error"), text.slice(0, 220) + from);
  });
  page.on("pageerror", (e) => note(errorCategory(state, e.message, "page-error"), e.message.slice(0, 220)));
  // A request that a third-party frame sends (an embed's telemetry, its CSP reports) is marked, and TOLERATED lists it without counting it.
  page.on("requestfailed", (r) => {
    const detail = `${r.method()} ${r.url().replace(origin, "")} — ${r.failure()?.errorText}`;
    note("failed-request", isThirdPartyFrame(frameUrlOf(r), origin) ? `${THIRD_PARTY_FRAME} ${detail}` : detail);
  });
  page.on("response", (r) => {
    if (r.status() >= 400 && !r.url().startsWith("data:")) note("http-error", `${r.status()} ${r.url().replace(origin, "")}`);
  });
  page.on("dialog", (d) => d.dismiss().catch(() => {}));
}

/** Wake every lazy example: scroll down the page. */
async function scrollThrough(page) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < Math.min(height, 40000); y += 700) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(60);
  }
  await page.waitForTimeout(700);
  await page.evaluate(() => window.scrollTo(0, 0));
}

/** Notes what the page's facts say, and files its links for the check after the crawl. */
function recordFacts(facts, { path, view, note, linkRefs }) {
  if (facts.overflow) note("overflow-x", `the page scrolls sideways (${facts.overflow})`);
  for (const e of facts.empty) note(e.kind === "zero" ? "zero-size-example" : "empty-example", e.label);
  for (const a of facts.anchors) {
    const where = a.where ? ` in ${a.where}` : "";
    note("dead-anchor", `${a.href} (« ${a.text} »)${where}: no such id on the page`);
  }
  for (const l of facts.links) {
    if (new URL(l.href).pathname.includes("/_next/")) continue;
    if (!linkRefs.has(l.href)) linkRefs.set(l.href, []);
    linkRefs.get(l.href).push({ path, view, text: l.text });
  }
}

/** Is this link dead, or its #anchor? Other sites often refuse a robot (403, 429, 999): only a 404/410 or an unresolvable host is dead there. */
async function judgeLink(href, { origin, fetchStatus, htmlOf }) {
  const url = new URL(href);
  const internal = url.origin === origin;
  const status = await fetchStatus(url.origin + url.pathname + url.search);
  const dead = isDeadLink(status, internal);
  if (dead || !internal || !url.hash || status !== 200) return { dead, anchorDead: false, status };
  const id = decodeURIComponent(url.hash.slice(1));
  const html = await htmlOf(origin + url.pathname);
  return { dead, anchorDead: Boolean(id && html && !htmlDeclaresAnchor(html, id)), status };
}

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
  paths = pickShard(paths, opts.shard);
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
    const state = { phase: "load" };
    const note = (category, detail) => add(path, view, category, state.phase === "interaction" ? `[during an interaction] ${detail}` : detail);
    listenToPage(page, { origin, state, note });

    let response;
    try {
      response = await page.goto(origin + path, { waitUntil: "load", timeout: 45000 });
      await page.waitForLoadState("networkidle", { timeout: 4000 }).catch(() => {}); // a page that keeps a socket open (a captcha) is judged after 4 s
    } catch (e) {
      add(path, view, "http-error", `the page did not load: ${String(e.message).split("\n")[0]}`);
      await page.close();
      return;
    }
    if (response?.status() !== 200) add(path, view, "http-error", `the page answers ${response?.status()}`);

    await scrollThrough(page);

    // 1 · Overflow, empty examples, links and anchors.
    recordFacts(await page.evaluate(FACTS_SCRIPT), { path, view, note, linkRefs });

    // 2 · Interactions.
    const t0 = Date.now();
    state.phase = "interaction";
    await context.grantPermissions(["clipboard-read", "clipboard-write"], { origin }).catch(() => {});
    await interact(page, note);
    state.phase = "load";
    if (DEBUG) console.log(`  ${view} ${path}: interactions ${Date.now() - t0} ms`);

    if (opts.out && problems.some((p) => p.page === path && p.view === view && !p.tolerated)) {
      await page.screenshot({ path: `${opts.out}/${view}${path.replaceAll("/", "_") || "_"}.png` }).catch(() => {});
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
      const { dead, anchorDead, status } = await judgeLink(href, { origin, fetchStatus, htmlOf });
      if (!dead && !anchorDead) continue;
      for (const ref of linkRefs.get(href)) add(ref.path, ref.view, dead ? "dead-link" : "dead-anchor", dead ? `${href} → ${status} (« ${ref.text} »)` : `${href}: no such id on the target page`);
    }
  };
  await Promise.all(Array.from({ length: 16 }, checkWorker));
  await browser.close();

  const { report, md, failures } = buildReport(opts, paths, problems);
  const { counts } = report;
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


if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) await main();
