import { MarginItem, MarginLayout } from "@krizaka/ui/margin-layout";

// Demo data: a fictitious lease check. The note sits in the right margin from 64 rem, under the text below.
export default function MarginLayoutFindings() {
  return (
    <MarginLayout aria-label="Findings">
      <MarginItem number="1" note="Clause 4.2, page 3">
        The deposit is two months of rent, which is above the legal limit.
      </MarginItem>
      <MarginItem number="2" note="Clause 9, page 6">
        The notice period for ending the lease is not stated.
      </MarginItem>
      <MarginItem number="3" note="Signature page">
        The tenant's signature is missing on the last page.
      </MarginItem>
    </MarginLayout>
  );
}
