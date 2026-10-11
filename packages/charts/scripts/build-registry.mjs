// Writes the registry of @krizaka/charts after tsup (`pnpm build`): `registry/<name>.json` for every documented
// component — its documentation (src/meta/<name>.ts), its named examples with their code, the props of its web and
// native components — and `registry/index.json`, the catalogue. The same shape as @krizaka/ui's registry (plus
// `package`, `engine`, `source`, `install`): krizaka.com/docs/ui renders both.
import { copyFileSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { collectRegistry, EXAMPLES, nativeScreenshotsOf, PKG } from "./registry.mjs";

const out = join(PKG, "registry");
const { version } = JSON.parse(readFileSync(join(PKG, "package.json"), "utf8"));

mkdirSync(out, { recursive: true });
for (const file of readdirSync(out)) if (file.endsWith(".json")) rmSync(join(out, file));

// tsup's client banner puts "use client" on every example; an example that holds a hook also says it in its source.
// Its declaration is the same for every example (tsup does not build them, see tsup.config.ts): a component.
const DECLARATION = `import type { ComponentType } from "react";
/** A named example of the @krizaka/charts registry. */
declare const Example: ComponentType;
export default Example;
`;
for (const file of readdirSync(EXAMPLES, { recursive: true }).filter((f) => f.endsWith(".js"))) {
  const code = readFileSync(join(EXAMPLES, file), "utf8");
  writeFileSync(join(EXAMPLES, file), code.replace(/^("use client";\n)\1/, "$1"));
  writeFileSync(join(EXAMPLES, file.replace(/\.js$/, ".d.ts")), DECLARATION);
}

const items = await collectRegistry();
for (const item of items) writeFileSync(join(out, `${item.name}.json`), `${JSON.stringify(item, null, 2)}\n`);

// The screenshots of the native examples (the Linux baselines of their stories), beside each example.
for (const file of readdirSync(EXAMPLES, { recursive: true }).filter((f) => f.endsWith(".png"))) rmSync(join(EXAMPLES, file));
for (const item of items) {
  for (const example of item.native?.examples ?? []) {
    const shots = example.screenshots && nativeScreenshotsOf(item.name, example.name);
    if (!shots) continue;
    copyFileSync(shots.dark, join(out, example.screenshots.dark));
    copyFileSync(shots.light, join(out, example.screenshots.light));
  }
}
writeFileSync(
  join(out, "index.json"),
  `${JSON.stringify(
    {
      name: "@krizaka/charts",
      version,
      items: items.map((item) => ({
        name: item.name,
        type: item.type,
        package: item.package,
        engine: item.engine,
        title: item.title,
        summary: item.summary,
        description: item.description,
        status: item.status,
        category: item.category,
        platforms: item.platforms,
        examples: { web: item.web?.examples.length ?? 0, native: item.native?.examples.length ?? 0 },
        dependencies: item.dependencies,
        registryDependencies: item.registryDependencies,
      })),
    },
    null,
    2,
  )}\n`,
);
console.log(`registry: ${items.length} components → registry/*.json`);
