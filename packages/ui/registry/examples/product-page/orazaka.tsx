import { ProductLogo } from "@krizaka/ui";
import { Button } from "@krizaka/ui/button";
import { Mascot } from "@krizaka/ui/mascots";
import { ProductPage } from "@krizaka/ui/product-page";

// TEMPLATE — a product's overview (Orazaka, in its orange): the promise beside the console alive, the traps it removes
// as compact cards with their bird, its decisions and what they cost, the owl's promise, the closing call.
export default function ProductPageOrazaka() {
  return (
    <ProductPage
      brand="orazaka"
      mark={<><ProductLogo id="orazaka" size={18} animated={false} /> Orazaka · sovereign AI</>}
      title="The AI that never leaves home"
      lead="Chat, image, voice and video on your own server — one governed pipeline, nothing sent anywhere."
      facts={[{ label: "Apache-2.0", tone: "ok" }, { label: "Law 25 · GDPR" }]}
      actions={<Button variant="primary" size="lg" shape="cut" shimmer>Install in three commands</Button>}
      visualLabel="orazaka.local — chat"
      visual={<p className="p-6 text-sm text-fg-secondary">“Summarise the lease in plain French.” — answered locally in 1.8 s.</p>}
      reasonsHeading={{ eyebrow: "Why", title: "Three traps it removes" }}
      reasonLabels={{ trap: "The trap", more: "Details" }}
      reasons={[
        { id: "local", title: "Local inference", trap: "Elsewhere, every prompt crosses the ocean.", mark: <Mascot bird="falcon" size={40} animated={false} />, href: "#local" },
        { id: "paid", title: "Paid once", trap: "Elsewhere, you pay per token, forever.", mark: <Mascot bird="flamingo" size={40} animated={false} />, href: "#paid" },
        { id: "asked", title: "Agents that ask", trap: "Elsewhere, an agent acts first.", mark: <Mascot bird="pigeon" size={40} animated={false} />, href: "#asked" },
      ]}
      decisions={{
        eyebrow: "Decisions",
        title: "What we chose, and what it costs you",
        labels: { chose: "We chose", refused: "We refused", because: "Because", cost: "What it costs you" },
        items: [{ id: "local", chose: "Local models by default.", refused: "A hosted API by default.", because: "A prompt that never leaves cannot leak.", cost: "A GPU, or patience." }],
      }}
      promise={{ bird: "owl", label: "The owl's promise", text: "Every personal record stays in Québec, and you can read who touched it." }}
      closing={{ title: "Ready to run it at home?", actions: <Button variant="primary" size="lg" shape="cut">Install</Button> }}
    />
  );
}
