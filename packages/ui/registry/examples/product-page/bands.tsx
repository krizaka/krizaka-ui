import { ClosingBand, LimitsBand, ProductActions } from "@krizaka/ui/product-page";

// Trust before the call: what the product does not do beside its bird as a specimen, then the closing and its one way in.
export default function ProductBandsExample() {
  return (
    <>
      <LimitsBand
        title="What it does not do"
        items={["It does not decide. You do.", "It is not legal advice.", "It reads only what you give it."]}
        bird="owl"
        caption="Fig. 1 · the owl, reads what you give it"
      />
      <ClosingBand title="See it on" inked="a lease." action={<ProductActions primary={{ href: "#demo", label: "Ask for a demo" }} />} />
    </>
  );
}
