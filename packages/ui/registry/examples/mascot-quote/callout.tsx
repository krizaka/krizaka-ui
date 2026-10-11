import { MascotQuote } from "@krizaka/ui/mascot-quote";

// `callout`: a promise alone in a section — larger, the bird alive (its loop pauses off screen and under reduced motion).
export default function MascotQuoteCallout() {
  return (
    <MascotQuote className="max-w-2xl" variant="callout" bird="owl" mood="welcome" label="The owl's promise">
      Every personal record stays in Québec, and you can read who touched it — Law 25, by design.
    </MascotQuote>
  );
}
