import { MarginItem, MarginLayout } from "@krizaka/ui/margin-layout";

// Demo data: a step flow. A note is optional per item.
export default function MarginLayoutSteps() {
  return (
    <MarginLayout aria-label="Steps">
      <MarginItem number="01" note="Takes about two minutes.">
        Add the documents to check.
      </MarginItem>
      <MarginItem number="02">Choose what to compare them with.</MarginItem>
      <MarginItem number="03" note="You can change the result before you sign.">
        Read the report and decide.
      </MarginItem>
    </MarginLayout>
  );
}
