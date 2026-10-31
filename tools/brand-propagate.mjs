#!/usr/bin/env node
// After a brand export (`export-brand.mjs --upload`), every consumer repository's committed icons must follow the CDN
// manifest, or its `brand-icons` guard fails CI at the next unrelated change (krizaka-ui#393 broke eleven of them at once).
// This tool clones each consumer, runs its own `sync-brand-icons.mjs`, and — with --apply — opens one small pull request per
// repository that drifted, with auto-merge on (squash). Without --apply it only reports who drifts.
//
//   node tools/brand-propagate.mjs                 # report
//   node tools/brand-propagate.mjs --apply         # one PR per drifted repository
//   node tools/brand-propagate.mjs --only krizaka-com,yomizaka
//
// Needs `gh` (logged in) and git. No secret is read: the sync scripts only download public files.
import { execFileSync } from "node:child_process";
import { mkdtempSync, existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

/** The repositories that carry a brand-icons guard — the products in focus (the paused ones, 2026-10-25, are left out). */
export const CONSUMERS = ["krizaka-com", "krizaka-blog", "krizaka-build", "yomizaka", "akinaza", "orazaka-web-client"];
/** Where each repository keeps its sync script (the first that exists wins). */
export const SYNC_SCRIPTS = ["scripts/sync-brand-icons.mjs", "site/scripts/sync-brand-icons.mjs", "apps/site/scripts/sync-brand-icons.mjs", "scripts/gen-favicon.mjs"];

/** The script to run in a checkout, given the files it has; null when it has none. */
export function syncScriptOf(has) {
  return SYNC_SCRIPTS.find((p) => has(p)) ?? null;
}

/** The branch a propagation PR uses (one per day, so a re-run updates it). */
export const branchFor = (date) => `chore/brand-icons-${date.toISOString().slice(0, 10)}`;

const sh = (cmd, args, cwd) => execFileSync(cmd, args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();

function run(argv) {
  const apply = argv.includes("--apply");
  const only = argv.includes("--only") ? argv[argv.indexOf("--only") + 1].split(",") : CONSUMERS;
  const report = [];
  for (const repo of only) {
    const dir = mkdtempSync(join(tmpdir(), `brand-${repo}-`));
    try {
      sh("gh", ["repo", "clone", `krizaka/${repo}`, dir, "--", "--depth=1", "--quiet"]);
      const script = syncScriptOf((p) => existsSync(join(dir, p)));
      if (!script) {
        report.push(`${repo}: no sync script`);
        continue;
      }
      sh("node", [script], dir);
      const changed = sh("git", ["status", "--porcelain"], dir).split("\n").filter(Boolean);
      if (!changed.length) {
        report.push(`${repo}: in sync`);
        continue;
      }
      report.push(`${repo}: DRIFT (${changed.length} files)`);
      if (!apply) continue;
      const branch = branchFor(new Date());
      sh("git", ["checkout", "-b", branch], dir);
      sh("git", ["add", "-A"], dir);
      sh("git", ["commit", "-m", "chore(brand): icons follow the CDN brand manifest"], dir);
      sh("git", ["push", "-u", "origin", branch], dir);
      const url = sh("gh", ["pr", "create", "--title", "chore(brand): icons follow the CDN brand manifest", "--body", "Re-synced by krizaka-ui `tools/brand-propagate.mjs` after a brand export.\n\n🤖 Generated with [Claude Code](https://claude.com/claude-code)"], dir);
      sh("gh", ["pr", "merge", url, "--auto", "--squash"], dir);
      report.push(`${repo}: PR ${url}`);
    } catch (e) {
      report.push(`${repo}: ERROR ${String(e.stderr || e.message).split("\n")[0]}`);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  }
  console.log(report.join("\n"));
}

if (import.meta.url === `file://${process.argv[1]}`) run(process.argv.slice(2));
