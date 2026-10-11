import { Sankey } from "@krizaka/charts/sankey";

// Thousands of credits in September.
const flows = [
  { from: "Pro plans", to: "Chat", credits: 182 },
  { from: "Pro plans", to: "Image", credits: 64 },
  { from: "Studio plans", to: "Video", credits: 121 },
  { from: "Studio plans", to: "Image", credits: 48 },
  { from: "Studio plans", to: "Chat", credits: 37 },
  { from: "Chat", to: "Delivered", credits: 211 },
  { from: "Chat", to: "Refunded", credits: 8 },
  { from: "Image", to: "Delivered", credits: 104 },
  { from: "Image", to: "Refunded", credits: 8 },
  { from: "Video", to: "Delivered", credits: 109 },
  { from: "Video", to: "Refunded", credits: 12 },
];

export default function CreditFlow() {
  return (
    <Sankey
      title="Where the credits went (k)"
      data={flows}
      source="from"
      target="to"
      value="credits"
      format="integer"
      sourceLabel="From"
      targetLabel="To"
      valueLabel="Credits (k)"
    />
  );
}
