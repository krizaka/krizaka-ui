import { ContinuePrompt } from "@krizaka/ui/continue-prompt";

// The end of a trial: the question, what counts, a line, and the one action that continues (a link with `href`).
export default function ContinuePromptOffer() {
  return (
    <ContinuePrompt
      className="w-[28rem] max-w-full"
      caption="Your trial"
      highlight="3 days left"
      status="All features on"
      title="Keep your studio?"
      count="3"
      actionLabel="Continue with Creator"
      href="#plans"
    >
      <p className="text-sm text-fg-secondary">Your videos, challenges and earnings stay exactly where they are.</p>
    </ContinuePrompt>
  );
}
