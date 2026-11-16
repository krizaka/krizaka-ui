// Writes `catalog.json` after the registry (`pnpm build`): the catalogue of @krizaka/ui in the krizaka-catalog/v1 shape,
// published as `@krizaka/ui/catalog.json` and read by the krizaka-docs MCP of the coding agents (krizaka-internal#3947).
// scripts/catalog.test.mjs is its guard: an entry point without an entry, or an entry without an example, fails.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { packageCatalog } from "./catalog.mjs";
import { collectRegistry, PKG } from "./registry.mjs";

const pkg = JSON.parse(readFileSync(join(PKG, "package.json"), "utf8"));
const catalog = await packageCatalog(collectRegistry, pkg, join(PKG, "src"), existsSync, (file) => readFileSync(file, "utf8"));
writeFileSync(join(PKG, "catalog.json"), `${JSON.stringify(catalog)}\n`);
console.log(`catalog: ${catalog.entries.length} entries → catalog.json`);
