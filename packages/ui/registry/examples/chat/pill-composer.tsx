"use client";

import { MessageComposer } from "@krizaka/ui/chat";
import { useState } from "react";

// The chat card's composer: one rounded field — the mode chip and attach inside on the left, the round send inside on
// the right — and a quiet status line under it (privacy, cost). The field keeps its box while an answer streams.
export default function ChatPillComposer() {
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <div className="mx-auto w-full max-w-xl">
      <MessageComposer
        variant="pill"
        value={draft}
        busy={busy}
        onValueChange={setDraft}
        onSend={() => {
          setDraft("");
          setBusy(true);
          setTimeout(() => setBusy(false), 1500);
        }}
        placeholder="Ask your private AI…"
        sendLabel="Send"
        leading={
          <>
            <button type="button" className="h-8 rounded-full border border-border-default px-3 text-xs font-medium text-fg-secondary">
              Chat
            </button>
            <button type="button" aria-label="Attach a file" className="grid h-8 w-8 place-items-center rounded-full text-fg-secondary hover:bg-surface-2">
              +
            </button>
          </>
        }
        status={busy ? "Answering…" : "Runs locally · nothing leaves your network · ~30 credits"}
      />
    </div>
  );
}
