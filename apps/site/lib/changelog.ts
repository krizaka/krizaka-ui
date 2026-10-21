import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { anchorOf, newestFirst, parseChangesets, type Release } from "@krizaka/ui/changelog-page";

import { packageVersion } from "./package-version";

/* The changelog of Krizaka UI, per package: the CHANGELOG.md that changesets writes in each workspace package
   (packages/<dir>/CHANGELOG.md), dated from the publish times of the npm registry — read ONCE before the build (scripts/gen-release-times.mjs), never
   while pages are generated, never written for the page. A package or a version npm does not know yet is left out rather than given an invented date. */

const PACKAGES_DIR = path.resolve(process.cwd(), "..", "..", "packages");
const MAX = 120;

/** The publish dates, written once before the build (scripts/gen-release-times.mjs): a missing file means none are known. */
function publishTimes(name: string): Record<string, string> {
  try {
    const all = JSON.parse(readFileSync(path.resolve(process.cwd(), "lib", "release-times.json"), "utf8")) as Record<string, Record<string, string>>;
    return all[name] ?? {};
  } catch {
    return {};
  }
}

let cached: Promise<Release[]> | undefined;

/** Every release of every package, newest first. */
export function loadReleases(): Promise<Release[]> {
  cached ??= (async () => {
    const dirs = readdirSync(PACKAGES_DIR, { withFileTypes: true }).filter((d) => d.isDirectory());
    const lists = await Promise.all(
      dirs.map(async (d) => {
        try {
          const name = (JSON.parse(readFileSync(path.join(PACKAGES_DIR, d.name, "package.json"), "utf8")) as { name: string }).name;
          const md = readFileSync(path.join(PACKAGES_DIR, d.name, "CHANGELOG.md"), "utf8");
          const time = publishTimes(name);
          return parseChangesets(md, name, (v) => time[v]?.slice(0, 10)).map((r) => ({ ...r, url: `https://www.npmjs.com/package/${name}/v/${r.version}` }));
        } catch {
          return [];
        }
      }),
    );
    return lists.flat().sort(newestFirst).slice(0, MAX);
  })();
  return cached;
}

/** The anchor of a release: the bare version for @krizaka/ui (the footer links `/changelog#<version>`), else per package. */
export const releaseId = (r: Pick<Release, "source" | "version">) => (r.source === "@krizaka/ui" ? r.version : anchorOf(r));

/** The version the footer shows and links: the installed @krizaka/ui. */
export const uiVersion = () => packageVersion("ui");
