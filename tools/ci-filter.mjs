import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

/** A change outside `packages/` and `apps/` (root config, lockfile, workflows) checks everything; otherwise the affected packages. */
export function selectTurboFilter(changedFiles, affectedFilter) {
  return changedFiles.some((file) => !/^(packages|apps)\/.+/.test(file)) ? "*" : affectedFilter;
}

/** The base branch of a pull request, as a plain branch name (it ends up in a Turbo filter). */
export function baseBranch(name) {
  if (!/^[A-Za-z0-9._/-]+$/.test(name ?? "") || name.startsWith("-") || name.includes("..")) {
    throw new Error(`not a branch name: ${JSON.stringify(name)}`);
  }
  return name;
}

// `git diff --name-only -z origin/<base>...HEAD | node tools/ci-filter.mjs <base>` — the workflow lists the files, this
// script only reads them (no process spawned here).
if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  try {
    const base = baseBranch(process.argv[2]);
    const changedFiles = readFileSync(0, "utf8").split("\0").filter(Boolean);
    console.log(`TURBO_FILTER=${selectTurboFilter(changedFiles, `...[origin/${base}]`)}`);
  } catch (error) {
    console.error(`${error.message}\nUsage: git diff --name-only -z origin/<base>...HEAD | node tools/ci-filter.mjs <base>`);
    process.exitCode = 2;
  }
}
