import { DonutChart } from "@krizaka/charts/pie";

const spend = [
  { model: "Chat · Mistral Large", credits: 18_400 },
  { model: "Image · Flux", credits: 9_650 },
  { model: "Video · Wan 2.2", credits: 7_200 },
  { model: "Speech · Whisper", credits: 2_100 },
  { model: "Embeddings", credits: 640 },
];

export default function CreditSpend() {
  return (
    <DonutChart
      title="Credits spent in September"
      data={spend}
      label="model"
      value="credits"
      labelHeader="Model"
      valueHeader="Credits"
      format="integer"
      centerLabel="credits"
    />
  );
}
