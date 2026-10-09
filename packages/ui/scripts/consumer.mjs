// The package as a product installs it: packed, installed alone (with its peers react / react-dom) in an empty
// folder, then imported from there. Proves that `cn` and the variants merge classes — a product's className wins —
// with nothing but what @krizaka/ui declares (the merge engine is tailwind-variants' own since 3.3: no
// tailwind-merge to install). Run by `pnpm --filter @krizaka/ui publint` after the build.
import { execFileSync } from "node:child_process";
import { mkdtempSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const pkg = resolve(import.meta.dirname, "..");
const dir = mkdtempSync(join(tmpdir(), "krizaka-ui-consumer-"));
const run = (cmd, args, cwd) => execFileSync(cmd, args, { cwd, stdio: ["ignore", "pipe", "inherit"], encoding: "utf8" });

try {
  run("pnpm", ["pack", "--pack-destination", dir], pkg);
  const tarball = readdirSync(dir).find((f) => f.endsWith(".tgz"));
  writeFileSync(join(dir, "package.json"), JSON.stringify({ name: "consumer", private: true, type: "module" }));
  run("npm", ["install", "--no-audit", "--no-fund", "--loglevel=error", join(dir, tarball), "react@19", "react-dom@19"], dir);
  writeFileSync(
    join(dir, "check.mjs"),
    `import assert from "node:assert/strict";
import { cn } from "@krizaka/ui/cn";
import { buttonVariants } from "@krizaka/ui/button";
assert.equal(cn("px-2", "px-4"), "px-4");
assert.equal(cn("text-sm text-fg", "text-fg-secondary"), "text-sm text-fg-secondary");
const button = buttonVariants({ size: "md", className: "h-9 rounded-full" }).split(" ");
assert.ok(button.includes("h-9") && !button.includes("h-10"), "a product's height wins over the primitive's");
assert.ok(button.includes("rounded-full") && !button.includes("rounded-lg"), "a product's radius wins over the primitive's");
console.log("✓ @krizaka/ui installed alone: cn and the variants let the product's className win");
`,
  );
  process.stdout.write(run("node", ["check.mjs"], dir));
} finally {
  rmSync(dir, { recursive: true, force: true });
}
