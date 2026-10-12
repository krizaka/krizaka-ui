import { LongformPage } from "@krizaka/ui/longform-page";
import { MascotQuote } from "@krizaka/ui/mascot-quote";
import { Mascot } from "@krizaka/ui/mascots";

// TEMPLATE — a long read (Krizaka's story): numbered chapters in a reading column, a sentence pulled into the margin,
// a bird's quote breaking out under the text. Editorial, not cards; one column on a phone.
export default function LongformPageStory() {
  return (
    <LongformPage
      eyebrow="Our story"
      title="Why a studio in Montréal builds its own AI"
      lead="Three products, one rule: what is yours stays yours."
      aside={<Mascot bird="owl" mood="welcome" size={112} />}
      chapters={[
        {
          id: "start",
          title: "It started with a lease",
          pull: "The prompt crossed the ocean before the answer came back.",
          children: (
            <>
              <p>A notary asked a chatbot to summarise a lease. The answer was good; the lease was now on someone else's server.</p>
              <p>We built Orazaka so that question never has to leave the office.</p>
            </>
          ),
        },
        {
          id: "creators",
          title: "Then came the creators",
          children: <p>Orochia pays creators 90 % of what their fans spend, every Monday — no algorithm in between.</p>,
          figure: <MascotQuote bird="flamingo" label="The flamingo's rule">Whoever does the work gets paid first.</MascotQuote>,
        },
      ]}
    />
  );
}
