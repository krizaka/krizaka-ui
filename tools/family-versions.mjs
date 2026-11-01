#!/usr/bin/env node
// The published @krizaka/* packages of this repository at one commit, as the `{ name: version }` that
// krizaka/.github's dispatch-release takes (krizaka-internal#879). Read from the commit itself (`git show`), never from the
// working tree, which changesets leaves on its release branch.
//
//   node tools/family-versions.mjs <commit>      prints {"@krizaka/ui":"3.77.0",…}
import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";

/** `{ name: version }` of the public @krizaka/* manifests among `texts` (unparsable or private ones are skipped). */
export function familyOf(texts) {
  const out = {};
  for (const text of texts) {
    let pkg;
    try {
      pkg = JSON.parse(text);
    } catch {
      continue;
    }
    if (!pkg.private && pkg.name?.startsWith("@krizaka/") && pkg.version) out[pkg.name] = pkg.version;
  }
  return out;
}

function manifestsAt(commit) {
  const git = (...args) => execFileSync("git", args, { encoding: "utf8" });
  return git("ls-tree", "--name-only", commit, "packages/")
    .split("\n")
    .filter(Boolean)
    .flatMap((dir) => {
      try {
        return [git("show", `${commit}:${dir}/package.json`)];
      } catch {
        return [];
      }
    });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.stdout.write(JSON.stringify(familyOf(manifestsAt(process.argv[2] ?? "HEAD"))));
}
