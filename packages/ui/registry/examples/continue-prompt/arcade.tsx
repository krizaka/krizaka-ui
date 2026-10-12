"use client";

import { ContinuePrompt } from "@krizaka/ui/continue-prompt";

// The cabinet at the end of a told page: the closing call on a CRT that switches on, 9 → 7 once, back to the top.
export default function ContinuePromptArcade() {
  return (
    <ContinuePrompt
      variant="arcade"
      brand="krizaka"
      className="w-[36rem] max-w-full"
      caption="Krizaka · Cabinet 01"
      highlight="Insert coin"
      hint="1 credit = 1 story"
      status="Credit 01"
      title="Continue?"
      countdown={{ from: 9, to: 7 }}
      actionKey="1P Start"
      actionLabel="Back to the top"
      onAction={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <p className="text-lg font-semibold">Round one is over.</p>
    </ContinuePrompt>
  );
}
