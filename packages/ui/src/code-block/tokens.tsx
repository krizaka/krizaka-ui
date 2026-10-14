// Code → React nodes, from TanStack Highlight's tokens: spans with the `th-*` classes that blocks.css paints with the
// tokens' text roles (≥ 4.5:1 on the code surface, both themes). No raw HTML: the nodes are elements and text.
import { type HighlightDecoration, type HighlightRenderNode, renderTokens } from "@tanstack/highlight/core";
import * as React from "react";

import { codeHighlighter } from "./highlighter";

/** What an annotation says about its lines. */
export type AnnotationKind = "highlight" | "added" | "removed" | "focus" | "dim" | "error" | "warning";

/** Lines of a sample set apart: one line (`3`) or a range (`[3, 5]`), counted from 1. */
export type CodeAnnotation = {
  lines: number | readonly [number, number];
  kind: AnnotationKind;
};

export type HighlightOptions = {
  /** A number before every line. */
  lineNumbers?: boolean;
  /** Lines set apart: highlighted, added, removed, in focus (the others are dimmed), dimmed, error, warning. */
  annotations?: readonly CodeAnnotation[];
};

const toReact = (node: HighlightRenderNode, key: number): React.ReactNode => {
  if (node.type === "text") return node.value;
  const data = Object.fromEntries(Object.entries(node.data ?? {}).map(([name, value]) => [`data-${name}`, value]));
  return React.createElement("span", { key, className: node.classNames.join(" "), ...data }, node.children.map(toReact));
};

/** Splits `code` into text and coloured spans (`th-keyword`, `th-string`…), and into lines when numbered or annotated. */
export function highlight(code: string, language = "text", { lineNumbers, annotations }: HighlightOptions = {}): React.ReactNode[] {
  const { tokens } = codeHighlighter.tokenize(code, { lang: language });
  const decorations: HighlightDecoration[] = (annotations ?? []).map(({ lines, kind }) => ({ lines, className: `kz-line kz-line-${kind}`, data: { kind } }));
  return renderTokens(tokens, { lineNumbers, decorations }).map(toReact);
}

/** The language a sample is tokenized in (`bash` → `shell`, `xml` → `html`, unknown → `plaintext`). */
export function normalizeCodeLanguage(language?: string): string {
  return codeHighlighter.normalizeLanguage(language);
}
