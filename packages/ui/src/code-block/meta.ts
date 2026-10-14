import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Code block",
  summary:
    "A code sample: its language and file name, the code highlighted by TanStack Highlight on the tokens (TS, TSX, JS, JSON, YAML, Bash, HTML, CSS, Java, Kotlin, diff — it scrolls sideways, never shrinks), numbered lines, lines set apart (highlighted, added, removed, in focus) and a copy button that says it copied — `CodeTabs` puts several build tools side by side.",
  status: "beta",
  category: "blocks",
  platforms: "web",
  whenToUse: [
    "Installation lines, a configuration file, the few lines a reader copies to start.",
    "The same thing in Maven, Gradle and npm (`CodeTabs`).",
  ],
  whenNotToUse: [
    { when: "For a word of code inside a sentence: use `Ticks` from the page entry.", use: "page" },
    { when: "For a keyboard shortcut.", use: "kbd" },
  ],
  bestPractices: [
    "Show the file the lines belong in (`pom.xml`, `application.yml`); `Terminal` for a command.",
    "Keep samples short enough to copy whole; link to the full file instead of pasting it.",
    "Set lines apart with `annotations` (`focus` greys the rest, `added` / `removed` for a change, `highlight` for the line to read); number them with `lineNumbers` when the text refers to a line.",
    "Name the language (`ts`, `bash`, `yaml`, `java`…); an unknown one is shown as plain text, never an error. The same grammars colour the code of `Markdown`.",
    "The copy words arrive as props (`copyLabel`, `copiedLabel`).",
  ],
  accessibility: {
    keyboard: [
      { keys: "Tab", action: "Focuses the code, which then scrolls with the arrow keys; then the copy button." },
      { keys: "Arrow keys", action: "In CodeTabs, move between the tabs (Radix Tabs)." },
    ],
    notes: [
      "A `figure` whose caption is the file name; the button's label changes to the copied words in a polite live region.",
      "The colours of the highlighter are the tokens' text roles (≥ 4.5:1 on the code surface, both themes); a line set apart never relies on colour alone (`added` and `removed` carry a + / − mark, `focus` greys the other lines to the quiet text role).",
    ],
  },
  related: ["tabs", "page", "kbd"],
  web: {
    imports: ["CodeBlock", "CodeTabs", "highlight", "normalizeCodeLanguage"],
    examples: [
      { name: "file", title: "A file", description: "A YAML sample in its file, with a comment and the copy button." },
      { name: "annotated", title: "Numbered, annotated lines", description: "A TypeScript sample with numbered lines: one in focus (the rest dimmed), one added." },
      { name: "build-tools", title: "Build tools", description: "`CodeTabs`: Maven and Gradle side by side." },
    ],
  },
} satisfies ComponentMeta;
