import { Button } from "@krizaka/ui/button";
import { LandingPage } from "@krizaka/ui/landing-page";
import { Meter } from "@krizaka/ui/meter";

// TEMPLATE — a company's landing (krizaka.com): the promise beside the product alive, a band of proofs, the features
// as a bento where the main one takes the room, the closing call. On a phone the window follows the words, the bento
// is one column, the proofs stack.
export default function LandingPageKrizaka() {
  return (
    <LandingPage
      eyebrow="Software studio · Montréal"
      title="Products that keep what is yours"
      lead="Krizaka builds sovereign AI and a platform where creators are paid — open source, on your servers or ours."
      actions={
        <>
          <Button variant="primary" size="lg" shape="cut" shimmer>See the products</Button>
          <Button variant="secondary" size="lg" shape="cut">Read the docs</Button>
        </>
      }
      visualLabel="orazaka.local — console"
      visual={
        <div className="grid gap-3 p-5">
          <p className="font-mono text-xs text-fg-secondary">$ npx orazaka install</p>
          <p className="font-mono text-xs text-fg-success">✓ 1,284 answers this week, none left the server</p>
          <Meter label="Credits" value={3800} max={12000} valueText="3,800 of 12,000" showLabel />
        </div>
      }
      proofs={[
        { value: "34", label: "public repositories" },
        { value: "Apache-2.0", label: "every line" },
        { value: "0", label: "telemetry calls" },
      ]}
      featuresHeading={{ eyebrow: "What we build", title: "Three products, one way of building" }}
      features={[
        { id: "orazaka", size: "lg", title: "Orazaka — the AI that never leaves home", text: "Chat, image, voice and video on your own server, one governed pipeline." },
        { id: "orochia", title: "Orochia", text: "Creators paid 90 % of what fans spend." },
        { id: "yazakia", title: "Yazakia", text: "Meet by talking first — coming." },
        { id: "blocks", size: "md", title: "Open building blocks", text: "Users, billing, notifications — on Maven Central and npm." },
        { id: "ui", size: "md", title: "One design system", text: "Krizaka UI, web and mobile, documented from its code." },
      ]}
      closing={{ title: "Something to build together?", body: "Tell us what you need; a person answers within two days.", actions: <Button variant="primary" size="lg" shape="cut">Contact us</Button> }}
    />
  );
}
