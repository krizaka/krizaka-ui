// The highlighter of every code sample: TanStack Highlight (a deterministic, synchronous tokenizer — the same markup on
// the server and on the client) with the grammars a Krizaka page shows. Each grammar is registered by hand: nothing
// else is bundled. An unknown language is plain text, never an error.
import { createHighlighter } from "@tanstack/highlight/core";
import { css } from "@tanstack/highlight/languages/css";
import { diff } from "@tanstack/highlight/languages/diff";
import { env } from "@tanstack/highlight/languages/env";
import { html } from "@tanstack/highlight/languages/html";
import { java } from "@tanstack/highlight/languages/java";
import { js } from "@tanstack/highlight/languages/js";
import { json } from "@tanstack/highlight/languages/json";
import { jsx } from "@tanstack/highlight/languages/jsx";
import { kotlin } from "@tanstack/highlight/languages/kotlin";
import { plaintext } from "@tanstack/highlight/languages/plaintext";
import { shell } from "@tanstack/highlight/languages/shell";
import { ts } from "@tanstack/highlight/languages/ts";
import { tsx } from "@tanstack/highlight/languages/tsx";
import { yaml } from "@tanstack/highlight/languages/yaml";

/** The languages a sample can be written in, with the names they answer to (`bash`, `xml`, `yml`, `kt`, `properties`…). */
export const codeHighlighter = createHighlighter({
  languages: [css, diff, { ...env, aliases: [...(env.aliases ?? []), "properties"] }, html, java, js, json, jsx, kotlin, plaintext, shell, ts, tsx, yaml],
  fallbackLanguage: "plaintext",
});
