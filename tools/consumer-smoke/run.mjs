#!/usr/bin/env node
// The consumer smoke test: the @krizaka/* packages AS PUBLISHED on npm — never the workspace — installed into
// throwaway apps outside this repository and built the way a product builds them:
//   next  a Next.js 16 App Router app: the documented setup (tailwind preset, tokens, fonts, theme, i18n, icons), every
//         published web example of @krizaka/ui and @krizaka/charts as a Server Component page, an SSE route on
//         @krizaka/realtime, a @krizaka/query page (prefetch + KrizakaHydration) — `next build` (type-check + prerender) must pass;
//   expo  an Expo SDK 57 app (create-expo-app): every published React Native example inside @krizaka/ui/native's
//         ThemeProvider, tokens/native, icons/native, fonts/native — `tsc --noEmit` and `expo export` must pass;
//   node  a Node ESM script on @krizaka/realtime and @krizaka/push, asserting their documented contract.
//
// Usage: node tools/consumer-smoke/run.mjs [--only next,expo,node] [--dir <work dir>] [--keep]
//                                          [--expect @krizaka/ui@2.11.0]…   (wait until that version is on npm)
// Prints a Markdown table (also appended to $GITHUB_STEP_SUMMARY), writes <work dir>/results.json, exits 1 on a failure.
import { spawnSync } from "node:child_process";
import { appendFileSync, cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

import { CONSUMERS, examplesOf, nativeApp, PACKAGES, parseArgs, summaryMarkdown, webPages } from "./lib.mjs";

const here = import.meta.dirname;
const options = parseArgs(process.argv.slice(2));
const work = options.dir ?? mkdtempSync(join(tmpdir(), "kz-consumer-smoke-"));
mkdirSync(work, { recursive: true });
const NPM = ["--no-audit", "--no-fund", "--loglevel=error"];

function sh(cmd, args, cwd, { capture = false } = {}) {
  const started = Date.now();
  console.log(`\n$ (${cwd.replace(work, "<work>")}) ${cmd} ${args.join(" ")}`);
  const result = spawnSync(cmd, args, { cwd, stdio: capture ? ["ignore", "pipe", "inherit"] : "inherit", encoding: "utf8", env: { ...process.env, CI: "1", NEXT_TELEMETRY_DISABLED: "1", EXPO_NO_TELEMETRY: "1" } });
  return { ok: result.status === 0, out: (result.stdout ?? "").trim(), seconds: Math.round((Date.now() - started) / 1000) };
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** The version each package is tested at: the one a release just tagged (waited for), else `latest`. */
async function resolveVersions() {
  const versions = {};
  for (const pkg of PACKAGES) {
    const name = `@krizaka/${pkg}`;
    const expected = options.expect.find((e) => e.name === name);
    if (expected) {
      const deadline = Date.now() + 10 * 60_000;
      while (sh("npm", ["view", `${name}@${expected.version}`, "version", "--prefer-online"], work, { capture: true }).out !== expected.version) {
        if (Date.now() > deadline) throw new Error(`${name}@${expected.version} is not on npm after 10 minutes`);
        await sleep(15_000);
      }
      versions[name] = expected.version;
    } else {
      versions[name] = sh("npm", ["view", name, "version", "--prefer-online"], work, { capture: true }).out;
    }
  }
  return versions;
}

const installed = (appDir, name) => {
  const file = join(appDir, "node_modules", name, "package.json");
  return existsSync(file) ? JSON.parse(readFileSync(file, "utf8")).version : "missing";
};

/** Runs the steps in order; the first failure stops the consumer. */
function consumer(name, steps) {
  const result = { consumer: name, ok: true, steps: [] };
  for (const [label, fn] of steps) {
    let outcome;
    try {
      outcome = fn();
    } catch (error) {
      outcome = { ok: false, note: error instanceof Error ? error.message : String(error) };
    }
    result.steps.push({ name: label, ok: outcome.ok, note: outcome.note ?? (outcome.seconds !== undefined ? `${outcome.seconds}s` : undefined) });
    if (!outcome.ok) {
      result.ok = false;
      break;
    }
  }
  return result;
}

const specs = (versions, pkgs) => pkgs.map((p) => `@krizaka/${p}@${versions[`@krizaka/${p}`]}`);

function nextConsumer(versions) {
  const app = join(work, "next");
  rmSync(app, { recursive: true, force: true });
  cpSync(join(here, "next"), app, { recursive: true });
  writeFileSync(join(app, "package.json"), `${JSON.stringify({ name: "kz-smoke-next", private: true, scripts: { build: "next build" } }, null, 2)}\n`);
  const result = consumer("next", [
    ["npm install (published packages)", () => sh("npm", ["install", ...NPM, "next@16", "react@19", "react-dom@19", "typescript@5", "@types/react@19", "@types/react-dom@19", "@types/node@22", "tailwindcss@4", "@tailwindcss/postcss@4", "hls.js", ...specs(versions, CONSUMERS.next)], app)],
    ["generate the example pages", () => {
      let count = 0;
      const missing = [];
      for (const pkg of ["ui", "charts"]) {
        const { found, missing: gone } = examplesOf(join(app, "node_modules", "@krizaka", pkg), "web");
        missing.push(...gone.map((e) => e.module));
        for (const page of webPages(pkg, found)) {
          mkdirSync(dirname(join(app, page.path)), { recursive: true });
          writeFileSync(join(app, page.path), page.source);
        }
        count += found.length;
      }
      return missing.length ? { ok: false, note: `not in the package: ${missing.join(", ")}` } : { ok: true, note: `${count} web examples` };
    }],
    ["next build", () => sh("npx", ["next", "build"], app)],
  ]);
  result.versions = { next: installed(app, "next"), react: installed(app, "react"), tailwindcss: installed(app, "tailwindcss") };
  return result;
}

function expoConsumer(versions) {
  const app = join(work, "kz-smoke-expo");
  rmSync(app, { recursive: true, force: true });
  const result = consumer("expo", [
    ["create-expo-app (SDK 57, blank-typescript)", () => sh("npx", ["--yes", "create-expo-app@latest", "kz-smoke-expo", "--template", "blank-typescript@sdk-57", "--no-install"], work)],
    ["npm install", () => sh("npm", ["install", ...NPM], app)],
    ["expo install (native peers)", () => sh("npx", ["expo", "install", "react-native-svg", "expo-video", "expo-camera", "expo-font"], app)],
    ["npm install (published packages)", () => sh("npm", ["install", ...NPM, ...specs(versions, CONSUMERS.expo)], app)],
    ["generate App.tsx", () => {
      const all = ["ui", "charts"].map((pkg) => examplesOf(join(app, "node_modules", "@krizaka", pkg), "native"));
      const missing = all.flatMap((r) => r.missing.map((e) => e.module));
      const found = all.flatMap((r) => r.found);
      writeFileSync(join(app, "App.tsx"), nativeApp(found));
      return missing.length ? { ok: false, note: `not in the package: ${missing.join(", ")}` } : { ok: true, note: `${found.length} native examples` };
    }],
    ["tsc --noEmit", () => sh("npx", ["tsc", "--noEmit"], app)],
    ["expo export (android, ios)", () => sh("npx", ["expo", "export", "--platform", "android", "--platform", "ios", "--output-dir", "dist"], app)],
  ]);
  result.versions = { expo: installed(app, "expo"), "react-native": installed(app, "react-native"), react: installed(app, "react") };
  return result;
}

function nodeConsumer(versions) {
  const app = join(work, "node");
  rmSync(app, { recursive: true, force: true });
  mkdirSync(app, { recursive: true });
  writeFileSync(join(app, "package.json"), `${JSON.stringify({ name: "kz-smoke-node", private: true, type: "module" }, null, 2)}\n`);
  cpSync(join(here, "node", "smoke.mjs"), join(app, "smoke.mjs"));
  const result = consumer("node", [
    ["npm install (published packages)", () => sh("npm", ["install", ...NPM, ...specs(versions, CONSUMERS.node)], app)],
    ["node smoke.mjs", () => sh("node", ["smoke.mjs"], app)],
  ]);
  result.versions = { node: process.version };
  return result;
}

const versions = await resolveVersions();
console.log("Testing the published versions:", versions);
const run = { next: nextConsumer, expo: expoConsumer, node: nodeConsumer };
const results = options.only.map((name) => run[name](versions));

const date = new Date().toISOString().slice(0, 10);
const runtime = Object.fromEntries(results.flatMap((r) => Object.entries(r.versions).map(([name, version]) => [`${name} (${r.consumer})`, version])));
const markdown = summaryMarkdown({ versions: { ...versions, ...runtime }, results, date });
console.log(`\n${markdown}`);
writeFileSync(join(work, "results.json"), `${JSON.stringify({ date, versions, runtime, results }, null, 2)}\n`);
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, markdown);

const ok = results.every((r) => r.ok);
if (ok && !options.dir && !options.keep) rmSync(work, { recursive: true, force: true });
else console.log(`Work directory kept: ${work}`);
process.exit(ok ? 0 : 1);
