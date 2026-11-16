// Node only. Reads a docs folder (every `*.md` under it, recursively) for `docsSource`; the folder is the only thing it touches.
import { readdir, readFile } from "node:fs/promises";
import { join, relative, sep } from "node:path";

import type { DocsFile } from "./docs-source";

async function walk(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(entries.map((e) => (e.isDirectory() ? walk(join(dir, e.name)) : e.name.endsWith(".md") ? [join(dir, e.name)] : [])));
  return nested.flat();
}

/**
 * The Markdown files of a folder, paths relative to it with `/`, sorted. A missing folder rejects (never an empty docs by mistake).
 *
 * @example
 * const docs = docsSource(await readDocsFolder("docs/public"), { locale: "fr" });
 */
export const readDocsFolder = async (dir: string): Promise<DocsFile[]> => {
  const paths = (await walk(dir)).sort();
  return Promise.all(paths.map(async (p) => ({ path: relative(dir, p).split(sep).join("/"), content: await readFile(p, "utf8") })));
};
