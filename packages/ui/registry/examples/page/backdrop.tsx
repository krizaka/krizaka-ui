import { Button } from "@krizaka/ui/button";
import { Section } from "@krizaka/ui/page";

// `backdrop`: the brand's colour transition behind a section (SectionBackdrop) — a closing call, the page's main moment.
// `actions` sit on the right of the heading (under it on a phone).
export default function PageBackdrop() {
  return (
    <Section
      id="get-started"
      className="w-full"
      backdrop={{ direction: "up" }}
      eyebrow="Get started"
      title="Install it in four lines"
      lead="Tokens, the Tailwind preset and the primitives — one version for the three."
      actions={<Button variant="primary">Read the guide</Button>}
    />
  );
}
