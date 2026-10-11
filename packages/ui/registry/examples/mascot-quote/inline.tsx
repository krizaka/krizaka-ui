import { MascotQuote } from "@krizaka/ui/mascot-quote";

// `inline`: a rule inside a card or beside a paragraph — small, the bird still (it hops once under the pointer).
export default function MascotQuoteInline() {
  return (
    <MascotQuote className="max-w-sm" bird="falcon" label="The falcon's rule">
      Nothing crosses the walls: no prompt, no file, no metric.
    </MascotQuote>
  );
}
