// Server-safe (no hook, no context): a Markdown text rendered on the tokens, from TanStack Markdown's AST. Raw HTML is
// never enabled (it is shown as text), executable URLs are dropped, links to another site carry `rel="noopener
// noreferrer"`, and every fenced block is a `CodeBlock` (the same grammars, the same colours). `streaming` is for a
// text that arrives in pieces — an AI answer: the unfinished end is closed and a caret marks where it goes on.
import { CodeBlock } from "@krizaka/ui/code-block";
import * as React from "react";

import { cn } from "../cn";
import { type BlockNode, type InlineNode, parseSource, textOf } from "./parse";

export type MarkdownLinkProps = React.ComponentProps<"a">;

export type MarkdownProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** The Markdown source. */
  children: string;
  /** The text is still arriving: the unfinished end is closed and a caret marks the end. */
  streaming?: boolean;
  /** Gives every heading an `id`, for `#section` links. */
  headingIds?: boolean;
  /** The words of the copy button of the code blocks, passed translated. Without them a code block has no copy button. */
  codeLabels?: { copy: string; copied: string };
  /** Your router's link (Next's `Link`) for the links that stay on the site (`/docs`, `#section`); the others are plain `a`. */
  linkAs?: React.ElementType<MarkdownLinkProps>;
};

type Context = Pick<MarkdownProps, "codeLabels" | "linkAs">;

const external = (href: string) => /^[a-z][a-z0-9+.-]*:/i.test(href);

function Inlines({ nodes, ctx }: { nodes: readonly InlineNode[]; ctx: Context }) {
  return nodes.map((node, i) => <Inline key={i} node={node} ctx={ctx} />);
}

function Inline({ node, ctx }: { node: InlineNode; ctx: Context }): React.ReactNode {
  switch (node.type) {
    case "text":
      return node.value;
    case "inlineCode":
      return <code>{node.value}</code>;
    case "strong":
      return (
        <strong>
          <Inlines nodes={node.children} ctx={ctx} />
        </strong>
      );
    case "emphasis":
      return (
        <em>
          <Inlines nodes={node.children} ctx={ctx} />
        </em>
      );
    case "strike":
      return (
        <del>
          <Inlines nodes={node.children} ctx={ctx} />
        </del>
      );
    case "break":
      return <br />;
    case "link": {
      const Link = external(node.href) ? "a" : (ctx.linkAs ?? "a");
      const props = external(node.href) && !node.href.startsWith("mailto:") && !node.href.startsWith("tel:") ? { rel: "noopener noreferrer" } : {};
      return (
        <Link href={node.href} title={node.title} {...props}>
          <Inlines nodes={node.children} ctx={ctx} />
        </Link>
      );
    }
    case "image":
      return <img src={node.src} alt={node.alt} title={node.title} loading="lazy" />;
    case "footnoteReference":
      return (
        <sup>
          <a id={`kz-fnref-${node.id}`} href={`#kz-fn-${node.id}`} data-footnote-ref="">
            {node.number}
          </a>
        </sup>
      );
    // Raw HTML is never enabled by the parser: it arrives as text. A node of this kind is shown as text too.
    case "inlineHtml":
      return node.value;
    default:
      return null;
  }
}

function Blocks({ nodes, ctx }: { nodes: readonly BlockNode[]; ctx: Context }) {
  return nodes.map((node, i) => <Block key={i} node={node} ctx={ctx} />);
}

function Block({ node, ctx }: { node: BlockNode; ctx: Context }): React.ReactNode {
  switch (node.type) {
    case "heading": {
      const Tag = `h${node.depth}` as const;
      return (
        <Tag id={node.id}>
          <Inlines nodes={node.children} ctx={ctx} />
        </Tag>
      );
    }
    case "paragraph":
      return (
        <p>
          <Inlines nodes={node.children} ctx={ctx} />
        </p>
      );
    case "code":
      return (
        <CodeBlock
          code={node.value}
          language={node.lang ?? "text"}
          file={node.title ?? node.file}
          copyLabel={ctx.codeLabels?.copy}
          copiedLabel={ctx.codeLabels?.copied}
          annotations={node.highlightLines?.map((line) => ({ lines: line, kind: "highlight" as const }))}
        />
      );
    case "list": {
      const Tag = node.ordered ? "ol" : "ul";
      const tasks = node.items.some((item) => item.checked !== undefined);
      return (
        <Tag start={node.ordered && node.start !== undefined && node.start !== 1 ? node.start : undefined} data-tasks={tasks ? "" : undefined}>
          {node.items.map((item, i) => (
            <li key={i}>
              {item.checked !== undefined ? (
                <label>
                  <input type="checkbox" checked={item.checked} disabled readOnly />{" "}
                  <ListItem blocks={item.children} ctx={ctx} />
                </label>
              ) : (
                <ListItem blocks={item.children} ctx={ctx} />
              )}
            </li>
          ))}
        </Tag>
      );
    }
    case "blockquote":
      return (
        <blockquote>
          <Blocks nodes={node.children} ctx={ctx} />
        </blockquote>
      );
    case "table":
      return (
        <div className="kz-md-table">
          <table>
            <thead>
              <tr>
                {node.header.map((cell, i) => (
                  <th key={i} scope="col" style={{ textAlign: node.align[i] ?? undefined }}>
                    <Inlines nodes={cell.children} ctx={ctx} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {node.rows.map((row, r) => (
                <tr key={r}>
                  {row.map((cell, i) => (
                    <td key={i} style={{ textAlign: node.align[i] ?? undefined }}>
                      <Inlines nodes={cell.children} ctx={ctx} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "thematicBreak":
      return <hr />;
    case "footnotes":
      return (
        <section data-footnotes="">
          <ol>
            {node.items.map((item) => (
              <li key={item.id} id={`kz-fn-${item.id}`}>
                <Blocks nodes={item.children} ctx={ctx} />
              </li>
            ))}
          </ol>
        </section>
      );
    // Raw HTML (never enabled) arrives as a paragraph of text; extensions are not enabled either. Shown as text.
    case "html":
      return <p>{node.value}</p>;
    default:
      return null;
  }
}

/** A list item: a lone paragraph is inline (a tight list), anything else keeps its blocks. */
function ListItem({ blocks, ctx }: { blocks: readonly BlockNode[]; ctx: Context }) {
  return blocks.map((block, i) => (block.type === "paragraph" && blocks.length === 1 ? <Inlines key={i} nodes={block.children} ctx={ctx} /> : <Block key={i} node={block} ctx={ctx} />));
}

/** A Markdown text on the tokens: headings, paragraphs, lists (and tasks), quotes, tables, code, links, images, footnotes. */
export function Markdown({ children, streaming, headingIds, codeLabels, linkAs, className, ...props }: MarkdownProps) {
  const blocks = parseSource(children, { streaming, headingIds });
  return (
    <div className={cn("kz-md", className)} data-streaming={streaming ? "" : undefined} aria-busy={streaming || undefined} {...props}>
      <Blocks nodes={blocks} ctx={{ codeLabels, linkAs }} />
    </div>
  );
}

export { textOf };
