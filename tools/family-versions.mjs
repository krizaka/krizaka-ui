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

/** A commit the way a workflow passes it (a SHA, or HEAD): anything else is refused, never handed to git as an argument. */
export function assertCommit(commit) {
  if (!/^(?:[0-9a-f]{7,64}|HEAD)$/.test(commit)) throw new Error(`not a commit: ${JSON.stringify(commit)}`);
  return commit;
}

/** git is looked up in the system directories only, never in a PATH a job could have extended. */
const GIT_ENV = { PATH: "/usr/bin:/bin:/usr/local/bin" };

function manifestsAt(rawCommit) {
  const commit = assertCommit(rawCommit);
  const git = (...args) => execFileSync("git", args, { encoding: "utf8", env: GIT_ENV });
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
