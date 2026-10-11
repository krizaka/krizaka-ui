import { DecisionList } from "@krizaka/ui/decision-list";

const decisions = [
  {
    id: "local",
    chose: "Local inference by default.",
    refused: "A hosted API as the default path.",
    because: "A prompt that never leaves cannot leak.",
    cost: "You need a GPU, or patience on a CPU.",
  },
  {
    id: "telemetry",
    chose: "Zero telemetry.",
    refused: "Anonymous usage statistics.",
    because: "Anonymous rarely stays anonymous.",
    cost: "You tell us what breaks: we cannot see it.",
  },
];

// The decisions behind a product: what it chose, what it refused, why — and what it costs the reader, said honestly.
export default function DecisionListProduct() {
  return (
    <DecisionList
      className="w-full max-w-4xl"
      reveal={false}
      decisions={decisions}
      labels={{ chose: "We chose", refused: "We refused", because: "Because", cost: "What it costs you" }}
    />
  );
}
