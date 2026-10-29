/* The server half of the one door to Fumadocs UI (ADR-008 §7): the docs layout and page frame, the highlighted code block
   and the default MDX components. Pages import the content engine's UI from here and nowhere else, so the engine can be
   replaced behind app/components/docs/fumadocs/ without touching a page. (Fumadocs Core — the source loader, the page
   tree and the types — is not UI and is not concerned.) */
export { ServerCodeBlock } from "fumadocs-ui/components/codeblock.rsc";
export { DocsLayout } from "fumadocs-ui/layouts/docs";
export { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/layouts/docs/page";
export { default as defaultMdxComponents } from "fumadocs-ui/mdx";
