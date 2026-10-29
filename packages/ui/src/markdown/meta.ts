import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Markdown",
  summary:
    "A Markdown text on the tokens — headings, lists and tasks, quotes, tables, links, images, footnotes, fenced code in `CodeBlock` — parsed by TanStack Markdown, safe by default (raw HTML is never rendered), with a streaming mode for a text that arrives in pieces: an AI answer. React Native draws the same AST in `Text` and `View`.",
  status: "beta",
  category: "data-display",
  domain: "conversation",
  platforms: "both",
  parity: { desktop: "web" },
  whenToUse: [
    "An AI answer, a message, a release note, a description written by a person or a model.",
    "A text that arrives in pieces (`streaming`): the unfinished end is closed, so no `**` or half a link ever shows.",
    "Content that comes from a user or a model, which must never run HTML.",
    "Product documentation and generated references with wide tables of identifiers, without custom rendering components.",
  ],
  whenNotToUse: [
    { when: "For MDX with embedded application components: keep the host's MDX pipeline." },
    { when: "For one sample of code on a page.", use: "code-block" },
    { when: "For a few words with a bold part: write the JSX." },
  ],
  bestPractices: [
    "Pass the words of the code blocks' copy button with `codeLabels` (translated); without them a block has no button.",
    "Give your router's link to `linkAs`: the links that stay on the site go through it, the others open as plain links with `rel=\"noopener noreferrer\"`.",
    "Set `streaming` while the text is arriving and drop it when it is complete: the caret goes away and the text is read as written.",
    "Write the source in the user's language; the component adds no words of its own.",
    "On a phone, give `onLinkPress` to open a link in your app's browser; the default opens http(s) links with the system.",
    "Pass `generated` and the translated `generatedLabel` to mark generated content; without the label no chip is shown. The host reads front matter and passes its `generated: true` value as the prop.",
    "Tables scroll within a focusable frame with edge shadows. Inline code in cells never breaks, including at hyphens; the first column fits its content and other cells wrap between items. Prose breaks a long word only at overflow; fenced code scrolls without wrapping.",
  ],
  accessibility: {
    keyboard: [
      { keys: "Tab", action: "Moves through the links, table regions and code blocks." },
      { keys: "ArrowLeft / ArrowRight", action: "Scrolls the focused table region or code block sideways." },
    ],
    notes: [
      "The structure is real elements: headings in order, lists, a table with column headers, `figure` and `figcaption` for a titled code block.",
      "A task list is disabled checkboxes inside their labels, so each item reads as done or not done.",
      "While `streaming`, the root carries `aria-busy`; the caret is decorative (a CSS pseudo-element) and still under reduced motion.",
      "Raw HTML in the source is shown as text, and links or images with an executable address (`javascript:`, `data:`) are dropped.",
      "Each table region is named from its column headers; the generated chip is a static label, not a button.",
    ],
  },
  related: ["code-block", "page", "txt"],
  web: {
    imports: ["Markdown", "parseSource", "healStreaming"],
    examples: [
      { name: "basic", title: "A document", description: "A heading, a list, a table and a titled code block." },
      { name: "ai-stream", title: "An AI answer arriving", description: "`streaming`: the end of the text is closed at every cut, with a caret; the button plays it from the start." },
      { name: "wide-table", title: "A generated reference on a phone", description: "Nine columns of long identifiers, a host-labelled generated chip, long prose and scrolling code." },
    ],
  },
  native: {
    entry: "@krizaka/ui/native/markdown",
    deprecated: { since: "3.55.0", removedIn: "4.0.0", reason: "No app imports `@krizaka/ui/native/markdown` (ADR-006 audit, 2026-10-25). The web entry stays." },
    imports: ["Markdown"],
    differences: [
      "Drawn in `Text` and `View` from the same AST: no `linkAs`; `onLinkPress` receives the address (http(s) links open with the system by default).",
      "Code blocks scroll sideways and are coloured by the same grammars, from the theme's text roles; there is no copy button.",
      "`headingIds` and `codeLabels` do not exist: there is nothing to link to on a phone, and no copy button.",
      "Tables use content-sized columns inside a horizontal ScrollView with a visible scroll indicator, rather than the web's scroll shadows. Text uses native line breaking.",
    ],
    examples: [
      { name: "basic", title: "A document", description: "A heading, a list, a table and a code block." },
      { name: "ai-stream", title: "An AI answer arriving", description: "`streaming` with the answer cut mid-sentence: nothing half-written shows." },
      { name: "wide-table", title: "A generated reference on a phone", description: "Nine content-sized columns of identifiers in a horizontal scroller, with a host-labelled generated chip." },
    ],
  },
} satisfies ComponentMeta;
