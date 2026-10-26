import { ProductLogo } from "@krizaka/ui";
import { ArgumentCard } from "@krizaka/ui/argument-card";
import { CardGrid } from "@krizaka/ui/card-grid";
import { LinkCard } from "@krizaka/ui/link-card";

const products = [
  { id: "yomizaka", name: "Yomizaka", hook: "Document checks and signed reports." },
  { id: "akinaza", name: "Akinaza", hook: "Receipts read and sorted for the shop." },
] as const;

// `foundation`: one wide card that the cards below stand on, a hairline stem to a frame around them. One column on a phone.
export default function CardGridFoundation() {
  return (
    <CardGrid
      className="w-full max-w-5xl"
      min={240}
      reveal={false}
      foundationLabel="Powered by Orazaka"
      foundation={
        <LinkCard
          href="#orazaka"
          icon={<ProductLogo id="orazaka" size={28} animated={false} />}
          title="The engine"
          description="Every product's AI runs on Orazaka: one pipeline, your models, your network."
          cta="Open the engine"
        />
      }
    >
      {products.map((p) => (
        <ArgumentCard key={p.id} id={`product-${p.id}`} icon={<ProductLogo id={p.id} size={32} animated={false} />} title={p.name} hook={{ label: "Uses it for", text: p.hook }} more={{ href: `#${p.id}`, label: "Details" }} />
      ))}
    </CardGrid>
  );
}
