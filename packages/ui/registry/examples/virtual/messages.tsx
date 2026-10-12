"use client";

import { VirtualList } from "@krizaka/ui/virtual";

type Message = { id: string; author: string; text: string };
const LINES = ["On my way.", "Can you send the cut from yesterday? The second take, with the sunset over the river and the drone shot at the end.", "Done!", "Thanks — looks great, posting it tonight at eight. I'll tag you."];
const messages: Message[] = Array.from({ length: 50_000 }, (_, i) => ({ id: `m${i}`, author: i % 2 ? "Elena" : "Noah", text: LINES[i % LINES.length]! }));

// 50,000 messages of different heights: each one measured, ~15 in the page, the scrollbar right from the start.
export default function VirtualMessages() {
  return (
    <VirtualList
      items={messages}
      getKey={(m) => m.id}
      estimateSize={64}
      gap={8}
      height={360}
      label="Messages"
      className="border border-border-default bg-surface-1 p-3"
      renderItem={(m) => (
        <div className="rounded-lg bg-surface-2 px-3 py-2 text-sm text-fg">
          <p className="text-xs font-semibold text-fg-secondary">{m.author}</p>
          <p>{m.text}</p>
        </div>
      )}
    />
  );
}
