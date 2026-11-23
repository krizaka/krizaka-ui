import { FindingCard, ProductActions, ProductHero, ProductMoment } from "@krizaka/ui/product-page";

// The hero in depth: the promise and its way in, the product moment beside them, a still far behind.
const lines = [{ text: "The rent is paid on the first day." }, { text: "A deposit of two months of rent.", flagged: true }, { text: "The lease renews itself." }];

export default function ProductHeroExample() {
  return (
    <ProductHero
      title="Find the clauses to review before you send."
      lead="Each finding shows the line and its reference."
      backdrop="https://krizaka-assets.b-cdn.net/site/brand-films/film/le-monde-de-krizaka-16x9.f3ec7dbb08.jpg"
      actions={<ProductActions primary={{ href: "#demo", label: "Ask for a demo" }} secondary={{ href: "#report", label: "See a report" }} />}
      visual={
        <ProductMoment
          label="A fictional lease, read, one clause found"
          tag="Fictional lease"
          lines={lines}
          answer={<FindingCard finding={{ verdict: "To check", tone: "danger", title: "A deposit cannot be asked for.", reference: "Art. 1904" }} />}
        />
      }
    />
  );
}
