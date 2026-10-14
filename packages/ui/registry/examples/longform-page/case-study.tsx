import { LongformPage } from "@krizaka/ui/longform-page";
import { Stat } from "@krizaka/ui/stat";

// TEMPLATE — a case study (a notary's office on Orazaka): the situation, what was done, the figures that prove it. Chapters
// in a reading column, the result as a figure that breaks out of the column; one column on a phone.
export default function LongformPageCaseStudy() {
  return (
    <LongformPage
      brand="orazaka"
      eyebrow="Case study · Notary"
      title="Eleven leases a day, none of them leaving the office"
      lead="A four-person firm in Laval summarises contracts with its own AI, on its own server."
      chapters={[
        {
          id: "before",
          title: "Before",
          pull: "The summary took twenty minutes. The cloud tools took the lease with them.",
          children: <p>Each lease was read twice by hand. Pasting it into a public chatbot was faster, and not an option.</p>,
        },
        {
          id: "after",
          title: "What changed",
          children: (
            <>
              <p>Orazaka runs on a Mac mini in the back room. A pack reads the lease and drafts the summary; the notary signs it.</p>
              <p>Nothing is sent outside the building, and every request is logged for the audit.</p>
            </>
          ),
          figure: (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Stat label="Per lease" value="2 min" trend="down" trendLabel="was 20 min" />
              <Stat label="Sent outside" value="0" hint="all answered locally" />
              <Stat label="Hours a week" value="14" trend="up" trendLabel="given back" />
            </div>
          ),
        },
      ]}
    />
  );
}
