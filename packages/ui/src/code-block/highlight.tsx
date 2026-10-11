// A small highlighter for the samples of a page (blocks.css `.kz-tk-*`): comments, strings, annotations, XML tags and
// keywords — no highlighter in the bundle, no colour outside the tokens (each ≥ 4.5:1 on the code surface in both
// themes). It colours what helps reading a sample; it is not a parser.
import type * as React from "react";

const CLASS = { comment: "kz-tk-comment", string: "kz-tk-string", annotation: "kz-tk-annotation", tag: "kz-tk-tag", keyword: "kz-tk-keyword" } as const;
type Kind = keyof typeof CLASS;

const KEYWORDS =
  "public|private|protected|final|static|class|interface|record|extends|implements|return|new|try|catch|throw|throws|if|else|void|import|from|export|function|const|let|var|val|fun|true|false|null|this|default|async|await|type";

const TOKEN = new RegExp(
  [
    String.raw`(?<comment>\/\/[^\n]*|\/\*[\s\S]*?\*\/|<!--[\s\S]*?-->|(?:^|(?<=[\s]))#[^\n]*)`,
    String.raw`(?<string>"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|\x60(?:[^\x60\\]|\\.)*\x60)`,
    String.raw`(?<annotation>@[A-Za-z][\w.]*)`,
    String.raw`(?<tag><\/?[A-Za-z][\w.:-]*|\/?>)`,
    String.raw`(?<keyword>\b(?:${KEYWORDS})\b)`,
  ].join("|"),
  "g",
);

/** Splits `code` into text and coloured spans. A `#` after a space starts a comment (shell, YAML, properties), not in CSS or code. */
export function highlight(code: string, language: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let last = 0;
  for (const m of code.matchAll(TOKEN)) {
    const kind = Object.entries(m.groups ?? {}).find(([, v]) => v !== undefined)?.[0] as Kind | undefined;
    if (!kind) continue;
    if (kind === "tag" && !/^(xml|html|svg|jsx|tsx)$/.test(language)) continue;
    if (kind === "comment" && m[0].startsWith("#") && /^(css|scss|tsx?|jsx?|java|kotlin|kt)$/.test(language)) continue;
    if (kind === "string" && m[0].startsWith("'") && /^(xml|html|kotlin|kt|java)$/.test(language)) continue;
    if (m.index > last) out.push(code.slice(last, m.index));
    out.push(
      <span key={m.index} className={CLASS[kind]}>
        {m[0]}
      </span>,
    );
    last = m.index + m[0].length;
  }
  if (last < code.length) out.push(code.slice(last));
  return out;
}
