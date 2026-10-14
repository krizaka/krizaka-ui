// Packs a package of the monorepo with the workspace packages it depends on, so it installs the way a product's `npm
// install` would — before those packages exist on npm. On a release pull request ("chore: version packages") every
// package already carries its next version, and `@krizaka/ui@3.6.0` asks for `@krizaka/tokens@^3.2.0`, which is only
// published after the merge: installing the packed tarball alone fails with E404/ETARGET (DS5 had to pre-publish
// tokens by hand). Installing the tarballs of the siblings in the same command satisfies the range from the tree.
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";

const readJson = (file) => JSON.parse(readFileSync(file, "utf8"));
const isWorkspace = (range) => String(range).startsWith("workspace:");

/** The name → folder of every package next to `pkgDir` (the monorepo's `packages/`). */
export function workspacePackages(pkgDir) {
  const root = join(pkgDir, "..");
  return Object.fromEntries(
    readdirSync(root)
      .map((name) => join(root, name))
      .filter((dir) => existsSync(join(dir, "package.json")))
      .map((dir) => [readJson(join(dir, "package.json")).name, dir]),
  );
}

/**
 * The workspace packages `pkgDir` needs once installed — its `dependencies` and `peerDependencies` on the
 * `workspace:` protocol, and theirs, transitively — in install order (dependencies first), without `pkgDir` itself.
 */
export function workspaceDependencies(pkgDir) {
  const all = workspacePackages(pkgDir);
  const order = [];
  const visit = (dir) => {
    const manifest = readJson(join(dir, "package.json"));
    for (const field of ["dependencies", "peerDependencies"]) {
      for (const [name, range] of Object.entries(manifest[field] ?? {})) {
        if (!isWorkspace(range) || !all[name]) continue;
        if (order.some((entry) => entry.name === name)) continue;
        visit(all[name]);
        order.push({ name, dir: all[name] });
      }
    }
  };
  visit(pkgDir);
  return order;
}

/**
 * `pnpm pack` the package and its workspace dependencies into `outDir` (pnpm writes the real version ranges in place of
 * `workspace:`), and return the tarballs: the siblings first, the package last.
 */
export function packWithSiblings(pkgDir, outDir, run = (cmd, args, cwd) => execFileSync(cmd, args, { cwd, stdio: ["ignore", "pipe", "inherit"], encoding: "utf8" })) {
  const manifest = readJson(join(pkgDir, "package.json"));
  const targets = [...workspaceDependencies(pkgDir), { name: manifest.name, dir: pkgDir }];
  return targets.map(({ name, dir }) => {
    const out = run("pnpm", ["pack", "--pack-destination", outDir, "--json"], dir);
    const { filename } = JSON.parse(out);
    return { name, tarball: join(outDir, basename(filename)) };
  });
}
