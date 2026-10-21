import { ActionBar } from "@krizaka/ui/action-bar";
import { CtaPanel } from "@krizaka/ui/cta-panel";

// The invitation at the end of a page: why it matters, and the ways to answer.
export default function CtaPanelDiscuss() {
  return (
    <CtaPanel
      className="w-full max-w-4xl"
      id="discuss"
      title="Something to say about it?"
      body="A decision you would make differently, a starter you miss: the discussions are open, and every idea gets an answer."
    >
      <ActionBar
        label="Talk about it"
        primaryFirst
        actions={[
          { href: "https://github.com/krizaka/krizaka-ui/discussions", label: "Discuss" },
          { href: "https://github.com/krizaka/krizaka-build/issues/new", label: "Propose" },
        ]}
      />
    </CtaPanel>
  );
}
