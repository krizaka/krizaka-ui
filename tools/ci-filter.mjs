import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

export function selectTurboFilter(changedFiles, affectedFilter) {
  return changedFiles.some((file) => !/^(packages|apps)\/.+/.test(file)) ? "*" : affectedFilter;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const base = process.argv[2];
  if (!base) {
    console.error("Usage: node tools/ci-filter.mjs <base-branch>");
    process.exitCode = 2;
  } else {
    const changedFiles = execFileSync("git", ["diff", "--name-only", "-z", `origin/${base}...HEAD`], {
      encoding: "utf8",
    })
      .split("\0")
      .filter(Boolean);
    console.log(`TURBO_FILTER=${selectTurboFilter(changedFiles, `...[origin/${base}]`)}`);
  }
}
