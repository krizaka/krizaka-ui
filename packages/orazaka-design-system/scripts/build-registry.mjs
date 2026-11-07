// Writes the registry of @krizaka/orazaka-design-system (`npm run registry`, run by `check` and before `npm pack`):
// `registry/<name>.json` for every component, `registry/foundations.json` (the theme resolved in both modes, the
// product tokens and rules) and `registry/index.json`, the catalogue — the format of @krizaka/ui's registry.
// krizaka.com/docs/orazaka/ui is generated from them at every build of the site. Build output (git-ignored); the
// examples (`registry/examples/**.tsx`) are sources, published as they are.
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { collectFoundations, collectRegistry, PACKAGE, PKG, PRODUCT, reexportsFromUi } from "./registry.mjs";

const out = join(PKG, "registry");
const pkg = JSON.parse(readFileSync(join(PKG, "package.json"), "utf8"));

mkdirSync(out, { recursive: true });
for (const file of readdirSync(out)) if (file.endsWith(".json")) rmSync(join(out, file));

const items = await collectRegistry();
for (const item of items) writeFileSync(join(out, `${item.name}.json`), `${JSON.stringify(item, null, 2)}\n`);
writeFileSync(join(out, "foundations.json"), `${JSON.stringify(await collectFoundations(), null, 2)}\n`);

const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
writeFileSync(
  join(out, "index.json"),
  json({
    name: PACKAGE,
    version: pkg.version,
    product: PRODUCT,
    extends: { name: "@krizaka/ui", range: pkg.dependencies["@krizaka/ui"] },
    install: {
      command: `npm install ${PACKAGE} && npm install -D tailwindcss`,
      css: `@import "tailwindcss";\n@import "${PACKAGE}/theme.css";`,
      note: "The package ships its TypeScript sources: add it to `transpilePackages` (with @krizaka/orazaka-shared and @krizaka/ui).",
    },
    reexports: reexportsFromUi(),
    items: items.map((item) => ({
      name: item.name,
      type: item.type,
      title: item.title,
      summary: item.summary,
      description: item.description,
      status: item.status,
      deprecated: item.deprecated,
      category: item.category,
      platforms: item.platforms,
      builtOn: item.builtOn,
      examples: { web: item.web?.examples.length ?? 0, native: 0 },
      dependencies: [],
      registryDependencies: [],
    })),
  }),
);
console.log(`registry: ${items.length} components + foundations → registry/*.json`);
