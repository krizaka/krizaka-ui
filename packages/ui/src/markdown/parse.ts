// The shared half of Markdown, web and React Native: the source becomes TanStack Markdown's serializable AST
// (`@tanstack/markdown/parser`) — raw HTML is never enabled (it stays text), executable URLs are dropped (`javascript:`,
// `data:`), and a text that is still arriving is healed so the half-written end reads like the finished one.
import type { BlockNode } from "@tanstack/markdown";
import { streamingMarkdownExtension } from "@tanstack/markdown/extensions/streaming";
import { parseMarkdown } from "@tanstack/markdown/parser";

export type { BlockNode, InlineNode, ListItemNode, TableNode } from "@tanstack/markdown";

export type ParseOptions = {
  /** The text is still arriving (an AI answer): the unfinished end is closed, so it never shows `**` or a half link. */
  streaming?: boolean;
  /** Gives every heading an `id` (`#section` links, a table of contents). */
  headingIds?: boolean;
};

const FENCE = /^ {0,3}(```|~~~)/gm;

/**
 * Closes what a text cut in the middle leaves open: an emphasis (`**`, `~~`) or a code span, a link or image whose
 * address has not arrived. Inside an open code fence nothing is healed — it is shown as code as it comes.
 */
export function healStreaming(source: string): string {
  if (((source.match(FENCE) ?? []).length & 1) === 1) return source;
  let out = source.replace(/!\[[^\]\n]*\]\([^)\n]*$/, "").replace(/\[([^\]\n]*)\](?:\([^)\n]*)?$/, "$1").replace(/\[([^\]\n]*)$/, "$1");
  const cut = out.lastIndexOf("\n\n");
  const block = cut < 0 ? out : out.slice(cut + 2);
  const open = (marker: string) => (block.split(marker).length - 1) % 2 === 1;
  // A marker just opened, with nothing after it yet, is dropped rather than shown as an empty emphasis.
  const close = (marker: string) => (out.endsWith(marker) ? out.slice(0, -marker.length) : `${out}${marker}`);
  if (open("`")) return close("`");
  for (const marker of ["**", "~~"]) if (open(marker)) out = close(marker);
  return out;
}

/** The blocks of a Markdown source. */
export function parseSource(source: string, { streaming = false, headingIds = false }: ParseOptions = {}): BlockNode[] {
  return parseMarkdown(streaming ? healStreaming(source) : source, { headingIds, ...(streaming && { extensions: [streamingMarkdownExtension()] }) }).children;
}

/** The text of inline nodes (a heading's label, an image's alt). */
export function textOf(nodes: readonly { type: string; value?: string; children?: readonly unknown[] }[]): string {
  return nodes
    .map((node) => (node.children ? textOf(node.children as typeof nodes) : (node.value ?? "")))
    .join("");
}
