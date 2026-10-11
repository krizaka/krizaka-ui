import { ArgumentCard } from "@krizaka/ui/argument-card";
import { MascotQuote } from "@krizaka/ui/mascot-quote";
import { Mascot } from "@krizaka/ui/mascots";

// Without a detail page the card unfolds in place (`panelLabel`): what it does, the long version, the bird's rule.
// In a grid, cards with a fold align at the top — opening one never stretches its neighbours.
export default function ArgumentCardUnfold() {
  return (
    <ArgumentCard
      className="max-w-md"
      id="escrow"
      title="Pledges in escrow"
      mark={<Mascot bird="pigeon" size={40} animated={false} />}
      hook={{ label: "The trap", text: "Elsewhere, fans pay for a video that never comes." }}
      panelLabel="Details"
      points={{ label: "What it does", items: ["Credits wait on a ledger.", "The creator is paid when the video is out."] }}
      details={[{ label: "What it costs you", text: "Payouts wait for the delivery, not the pledge." }]}
      rule={<MascotQuote bird="pigeon" label="The pigeon's rule">Nothing is paid that was not delivered.</MascotQuote>}
    />
  );
}
