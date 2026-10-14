import { CodeBlock } from "@krizaka/ui/code-block";

const code = `export async function loadVideos(signal: AbortSignal) {
  const response = await fetch("/api/videos", { signal });
  if (!response.ok) throw new Error("Could not load the videos");
  return response.json();
}`;

// Lines numbered and set apart: line 2 is where to look (everything else is dimmed), line 3 is the line to add.
export default function CodeBlockAnnotated() {
  return (
    <CodeBlock
      className="w-full max-w-xl"
      code={code}
      language="ts"
      file="videos.ts"
      copyLabel="Copy"
      copiedLabel="Copied"
      lineNumbers
      annotations={[
        { lines: 2, kind: "focus" },
        { lines: 3, kind: "added" },
      ]}
    />
  );
}
