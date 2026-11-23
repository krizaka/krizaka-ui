import { DecisionStamp, PublicFooter } from "@krizaka/ui/product-page";

// The decision's neutral stamp in the brand's colour, and the public footer drawn from its data.
export default function PublicFooterExample() {
  return (
    <>
      <p className="p-6">
        <DecisionStamp>Decision noted</DecisionStamp>
      </p>
      <PublicFooter
        current="krizaka"
        family={false}
        config={{
          label: "Footer",
          columns: [
            { id: "product", title: "Product", links: [{ label: "Pricing", href: "#pricing" }, { label: "Security", href: "#security" }] },
            { id: "help", title: "Help", links: [{ label: "Contact", href: "#contact" }] },
          ],
          legal: { legalName: "Example Inc.", city: "Montréal (Québec)", showVersion: false, links: [{ label: "Privacy", href: "#privacy" }] },
        }}
      />
    </>
  );
}
