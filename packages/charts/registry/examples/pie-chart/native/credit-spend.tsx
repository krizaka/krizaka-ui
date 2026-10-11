import { DonutChart } from "@krizaka/charts/native";

const spend = [
  { model: "Chat", credits: 18_400 },
  { model: "Image", credits: 9_650 },
  { model: "Video", credits: 7_200 },
  { model: "Speech", credits: 2_100 },
];

export default function CreditSpend() {
  return <DonutChart title="Credits spent in September" data={spend} label="model" value="credits" format="compact" centerLabel="credits" />;
}
