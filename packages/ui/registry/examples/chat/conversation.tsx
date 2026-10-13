"use client";

import { MessageBubble, MessageComposer, TypingIndicator } from "@krizaka/ui/chat";
import { useState } from "react";

// A conversation: runs grouped, the time inside, the receipt under the last of yours, typing, the composer.
export default function ChatConversation() {
  const [draft, setDraft] = useState("");
  return (
    <div className="flex max-w-md flex-col overflow-hidden rounded-xl border border-border-default bg-surface-0">
      <div className="flex flex-col gap-1 p-3">
        <MessageBubble text="Hey! Loved your sunset photo 🌅" time="19:02" grouped="first" />
        <MessageBubble text="Was it Cabo da Roca?" time="19:02" grouped="last" />
        <MessageBubble mine text="It was! Have you been?" time="19:05" grouped="first" />
        <MessageBubble mine text="We should go this weekend" time="19:05" grouped="last" status="read" showStatus />
        <TypingIndicator label="Elena is typing" />
      </div>
      <MessageComposer value={draft} onValueChange={setDraft} onSend={() => setDraft("")} placeholder="Message" sendLabel="Send" />
    </div>
  );
}
