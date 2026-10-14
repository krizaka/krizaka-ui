/* Fumadocs: one collection — the written pages of ui.krizaka.com (content/docs/**), MDX with the live-preview
   components. The component pages and the foundations are generated from the packages (lib/docs-source.ts). */

import { defineConfig, defineDocs } from "fumadocs-mdx/config";
import type { Root } from "mdast";

export const docs = defineDocs({ dir: "content/docs" });

/** The page renders the title (from the messages): a document's own leading `# Title` would repeat it. */
const PREAMBLE = new Set(["yaml", "mdxjsEsm", "html"]);
function remarkDropLeadingTitle() {
  return (tree: Root) => {
    const first = tree.children.findIndex((node) => !PREAMBLE.has(node.type));
    const node = tree.children[first];
    if (node?.type === "heading" && node.depth === 1) tree.children.splice(first, 1);
  };
}

export default defineConfig({
  mdxOptions: {
    // Before the defaults, so the table of contents never lists the dropped title.
    remarkPlugins: (defaults) => [remarkDropLeadingTitle, ...defaults],
    rehypeCodeOptions: { themes: { light: "github-light", dark: "github-dark" } },
  },
});
