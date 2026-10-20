// The home has its own route and stays light: a route ships the client code of every module its *server* components may
// import — a server module that holds lib/ui-examples.ts (every example of the registry, ≈ 490 client modules, ~300 kB
// gzip) puts them all in the route. Inside a client component ("use client") its dynamic imports are lazy chunks: fine.
// Walks the server imports from each home route and fails if one reaches the map.
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FORBIDDEN = path.join(root, "lib/ui-examples.ts");

function resolveLocal(from, spec) {
  const base = spec.startsWith("@/") ? path.join(root, spec.slice(2)) : spec.startsWith(".") ? path.resolve(path.dirname(from), spec) : null;
  if (!base) return null;
  for (const candidate of [base, `${base}.ts`, `${base}.tsx`, path.join(base, "index.ts"), path.join(base, "index.tsx")]) if (existsSync(candidate) && /\.tsx?$/.test(candidate)) return candidate;
  return null;
}

/** Every local module reachable from `entry` through the server graph (a "use client" module is reached, not entered), with the path to it. */
function graph(entry) {
  const seen = new Map([[entry, [entry]]]);
  const queue = [entry];
  while (queue.length) {
    const file = queue.shift();
    const source = readFileSync(file, "utf8").replace(/\/\*[\s\S]*?\*\/|^\s*\/\/.*$/gm, "");
    if (/^\s*["']use client["']/.test(source)) continue;
    for (const [, spec] of source.matchAll(/(?:from|import)\s*\(?\s*"([^"]+)"/g)) {
      const next = resolveLocal(file, spec);
      if (next && !seen.has(next)) {
        seen.set(next, [...seen.get(file), next]);
        queue.push(next);
      }
    }
  }
  return seen;
}

for (const route of ["app/(en)/page.tsx", "app/(fr)/fr/page.tsx"]) {
  test(`${route}: the home's own route never imports the registry's examples map`, () => {
    const entry = path.join(root, route);
    assert.ok(existsSync(entry), `${route} exists (the home is not a page of the docs catch-all)`);
    const reach = graph(entry);
    const chain = reach.get(FORBIDDEN);
    assert.equal(chain, undefined, `reached through ${chain?.map((f) => path.relative(root, f)).join(" → ")}`);
    assert.ok(reach.has(path.join(root, "app/components/landing/Landing.tsx")), "the walker follows the home's imports");
  });
}

test("the docs catch-all leaves the home to its route", () => {
  assert.ok(!existsSync(path.join(root, "app/(en)/[[...slug]]")), "an optional catch-all would also match / and take the home back");
  assert.ok(existsSync(path.join(root, "app/(en)/[...slug]/page.tsx")));
});
