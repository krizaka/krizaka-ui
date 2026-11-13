import { Button } from "@krizaka/ui/button";
import { LandingPage } from "@krizaka/ui/landing-page";
import { MediaCarousel } from "@krizaka/ui/media-carousel";
import { Section } from "@krizaka/ui/page";

const PIC = (a: string, b: string) => `data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 900'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${a}'/><stop offset='1' stop-color='${b}'/></linearGradient></defs><rect width='1600' height='900' fill='url(#g)'/></svg>`)}`;

// TEMPLATE — a home that leads with words and a full-width demo: no `visual` (a single-column hero), the quiet backdrop,
// a carousel in `showcase` between the proofs and the features.
export default function LandingPageShowcase() {
  return (
    <LandingPage
      backdrop="quiet"
      title="An AI that never leaves your server"
      lead="Chat, image and voice on your own machine, every run recorded."
      actions={<Button variant="primary" size="lg">Install</Button>}
      proofs={[
        { value: "0", label: "calls to the outside" },
        { value: "128", label: "runs measured, each with its record" },
      ]}
      showcase={
        <Section spacing="sm" title="See it work" id="showcase-title" lead="Three minutes, no cuts.">
          <MediaCarousel
            label="Sovkora at work"
            autoplay
            caption="bar"
            textVersion
            slides={[
              { id: "a", src: PIC("#1d3f6b", "#4d7fb8"), alt: "A chat answered on the local server", caption: "Fig. 1a — a chat, answered locally" },
              { id: "b", src: PIC("#23496f", "#6b9bc9"), alt: "The run's cost and model, side by side", caption: "Fig. 1b — the run, accounted for" },
            ]}
          />
        </Section>
      }
      featuresHeading={{ title: "What it does" }}
      features={[
        { id: "chat", size: "lg", title: "Chat", text: "Answers from models that run on your server." },
        { id: "image", title: "Image", text: "Generated and kept in your storage." },
      ]}
    />
  );
}
