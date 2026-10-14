// The package as a product installs it: packed, installed alone (with React 19) in an empty folder, then used from
// there: a chart rendered on the server (Node, no DOM) gives its frame, summary and data table; the registry's JSON
// and compiled examples resolve. Run by `pnpm --filter @krizaka/charts publint` after the build.
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

import { packWithSiblings } from "../../../tools/workspace-pack.mjs";

const pkg = resolve(import.meta.dirname, "..");
const dir = mkdtempSync(join(tmpdir(), "krizaka-charts-consumer-"));
const run = (cmd, args, cwd) => execFileSync(cmd, args, { cwd, stdio: ["ignore", "pipe", "inherit"], encoding: "utf8" });

try {
  // The package and the workspace packages it depends on (a release pull request names versions npm does not have yet).
  const tarballs = packWithSiblings(pkg, dir).map((entry) => entry.tarball);
  writeFileSync(join(dir, "package.json"), JSON.stringify({ name: "consumer", private: true, type: "module" }));
  run("npm", ["install", "--no-audit", "--no-fund", "--loglevel=error", ...tarballs, "react@19", "react-dom@19"], dir);
  writeFileSync(
    join(dir, "check.mjs"),
    `import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { LineChart } from "@krizaka/charts/line";
import { Funnel } from "@krizaka/charts/funnel";
const data = [{ m: "2026-04", v: 182000 }, { m: "2026-05", v: 164000 }, { m: "2026-06", v: 231000 }];
const html = renderToString(createElement(LineChart, { title: "Earnings", data, x: "m", y: "v", yLabel: "Earnings", format: { style: "money", currency: "EUR" } }));
assert.ok(html.includes("Line chart, 3 (Apr 2026 – Jun 2026).") && html.includes("<table") && html.includes("€2,310.00"), "a line chart renders on the server");
const funnel = renderToString(createElement(Funnel, { title: "Sign-up", data: [{ s: "Visit", n: 100 }, { s: "Sign-up", n: 20 }], label: "s", value: "n" }));
assert.ok(funnel.includes("Visit → Sign-up 20%"), "an ECharts chart renders its frame on the server without loading ECharts");
console.log("✓ @krizaka/charts installed alone: charts render on the server with their summary and table");
const { default: registry } = await import("@krizaka/charts/registry/index", { with: { type: "json" } });
const { default: line } = await import("@krizaka/charts/registry/line-chart", { with: { type: "json" } });
const { default: Example } = await import("@krizaka/charts/registry/examples/line-chart/creator-earnings");
assert.equal(registry.name, "@krizaka/charts");
assert.ok(line.web.examples.length > 0 && line.native.examples.length > 0 && line.web.props.length > 0, "an item carries its examples and props");
assert.equal(typeof Example, "function", "a compiled example is a component");
console.log("✓ the registry (" + registry.items.length + " components) and its examples resolve from the package");
`,
  );
  process.stdout.write(run("node", ["check.mjs"], dir));
} finally {
  rmSync(dir, { recursive: true, force: true });
}
