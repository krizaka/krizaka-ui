import { Button } from "@krizaka/ui/button";
import { ComponentPage } from "@krizaka/ui/component-page";
import { LinkCard } from "@krizaka/ui/link-card";

// TEMPLATE — a component's page (what ui.krizaka.com generates from the registry): name, summary, status and
// platforms, the live preview, the import line, its sections; related components aside (under it on a phone).
export default function ComponentPageButton() {
  return (
    <ComponentPage
      className="w-full"
      back={<a href="#catalogue">← Components</a>}
      eyebrow="Actions"
      title="Button"
      summary="The action: six looks, three sizes, the Krizaka cut, and the whole life of an action built in."
      facts={[{ label: "Web + Mobile", tone: "ok" }, { label: "Stable" }]}
      preview={
        <div className="flex flex-wrap items-center justify-center gap-3 p-8">
          <Button variant="primary">Publish</Button>
          <Button variant="secondary">Save a draft</Button>
        </div>
      }
      install={{ code: 'import { Button } from "@krizaka/ui/button";', language: "ts", copyLabel: "Copy", copiedLabel: "Copied" }}
      sections={[
        { id: "when", title: "When to use", children: <p className="text-sm text-fg-secondary">For the action a block is about; links that look like actions use `asChild`.</p> },
        { id: "a11y", title: "Accessibility", children: <p className="text-sm text-fg-secondary">A real button; while loading it says so in a live region.</p> },
      ]}
      aside={<LinkCard href="#confirm-button" title="Confirm button" description="A destructive action in two presses." titleAs="span" />}
    />
  );
}
