// Writes the registry of @krizaka/ui after tsup (`pnpm build`): `registry/<name>.json` for every primitive — its
// source, its npm and registry dependencies, its demo and the documentation of its props — and `registry/index.json`,
// the list. krizaka.com reads them for its docs (ComponentPreview, PropsTable); a CLI may one day copy a primitive.
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { collectRegistry, PKG } from "./registry.mjs";

const out = join(PKG, "registry");
const { version } = JSON.parse(readFileSync(join(PKG, "package.json"), "utf8"));

mkdirSync(out, { recursive: true });
for (const file of readdirSync(out)) if (file.endsWith(".json")) rmSync(join(out, file));

// tsup's client banner puts "use client" on every demo; a demo that holds a hook also says it in its source.
const demos = join(out, "demos");
for (const file of readdirSync(demos).filter((f) => f.endsWith(".js"))) {
  const code = readFileSync(join(demos, file), "utf8");
  writeFileSync(join(demos, file), code.replace(/^("use client";\n)\1/, "$1"));
}

const items = collectRegistry();
for (const item of items) writeFileSync(join(out, `${item.name}.json`), `${JSON.stringify(item, null, 2)}\n`);
writeFileSync(
  join(out, "index.json"),
  `${JSON.stringify(
    {
      name: "@krizaka/ui",
      version,
      items: items.map(({ name, type, description, dependencies, registryDependencies }) => ({
        name,
        type,
        description,
        dependencies,
        registryDependencies,
      })),
    },
    null,
    2,
  )}\n`,
);
console.log(`registry: ${items.length} primitives → registry/*.json`);
