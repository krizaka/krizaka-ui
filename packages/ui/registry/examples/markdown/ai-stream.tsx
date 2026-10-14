"use client";

import { Button } from "@krizaka/ui/button";
import { Markdown } from "@krizaka/ui/markdown";
import * as React from "react";

const answer = `Use **a queue**, not a loop: \`createQueue\` runs two files at once, retries a failure after a pause and lets you pause one file.

1. Add each file with its \`id\`.
2. Pause it with \`queue.pause(id)\`.
3. Read the progress from the snapshot.

See [the pacer docs](https://www.krizaka.com/docs/ui).`;

// A text that arrives in pieces: `streaming` closes the unfinished end (no stray `**`) and shows a caret. It rests
// mid-answer; the button plays it from the first letter.
export default function MarkdownAiStream() {
  const [count, setCount] = React.useState(130);
  const [started, setStarted] = React.useState(false);
  const playing = started && count < answer.length;
  React.useEffect(() => {
    if (!playing) return;
    const timer = setTimeout(() => setCount((n) => n + 6), 40);
    return () => clearTimeout(timer);
  }, [count, playing]);
  return (
    <div className="grid max-w-xl gap-4">
      <Markdown streaming={count < answer.length}>{answer.slice(0, count)}</Markdown>
      <Button size="sm" variant="secondary" onClick={() => (setCount(0), setStarted(true))} className="justify-self-start">Play it</Button>
    </div>
  );
}
