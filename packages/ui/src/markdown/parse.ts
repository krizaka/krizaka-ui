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

/** A link or image cut at its end: `[label`, `[label]`, `[label](http…` become `label`, an image is dropped. Linear: one scan of the last `[`. */
function healLink(text: string): string {
  const open = text.lastIndexOf("[");
  if (open < 0) return text;
  const rest = text.slice(open + 1);
  if (rest.includes("\n")) return text;
  const image = open > 0 && text[open - 1] === "!";
  const close = rest.indexOf("]");
  const after = close < 0 ? "" : rest.slice(close + 1);
  const cut = close < 0 || after === "" || (after.startsWith("(") && !after.includes(")"));
  if (!cut) return text;
  const head = text.slice(0, image ? open - 1 : open);
  return image ? head : head + (close < 0 ? rest : rest.slice(0, close));
}

/**
 * Closes what a text cut in the middle leaves open: an emphasis (`**`, `~~`) or a code span, a link or image whose
 * address has not arrived. Inside an open code fence nothing is healed — it is shown as code as it comes.
 */
export function healStreaming(source: string): string {
  if (((source.match(FENCE) ?? []).length & 1) === 1) return source;
  let out = healLink(source);
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
