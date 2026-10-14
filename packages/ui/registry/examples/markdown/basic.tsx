import { Markdown } from "@krizaka/ui/markdown";

const text = `## What changed in 3.9

The queue now **retries** a failed upload with a backoff, and \`pause\` keeps its place.

- Pause, resume and retry per file
- A 429 waits for its \`Retry-After\`

| Entry | Size |
| :--- | ---: |
| \`@krizaka/pacer\` | 2 kB |

\`\`\`ts title="uploads.ts"
const queue = createQueue({ retries: 3 });
\`\`\`
`;

// A Markdown text on the tokens: headings, lists, a table, a titled code block. Raw HTML is never rendered.
export default function MarkdownBasic() {
  return <Markdown className="max-w-xl" codeLabels={{ copy: "Copy", copied: "Copied" }}>{text}</Markdown>;
}
