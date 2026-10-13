import { DescriptionList } from "@krizaka/ui/description-list";

// Inline: a tip's breakdown, read like a receipt.
export default function DescriptionListReceipt() {
  return (
    <DescriptionList
      layout="inline"
      className="max-w-sm"
      items={[
        { term: "Tip from @mina", details: "$10.00" },
        { term: "Payment fees", details: "−$0.50" },
        { term: "Platform", details: "−$1.00" },
        { term: "To you", details: "$8.50", hint: "paid on Oct 15" },
      ]}
    />
  );
}
