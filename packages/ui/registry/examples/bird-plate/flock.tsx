import { BirdPlate } from "@krizaka/ui/bird-plate";

// Plate I: the five birds of the film, each numbered, each with its promise word for word.
export default function BirdPlateFlock() {
  return (
    <BirdPlate
      title="Plate I · The flock"
      subtitle="five promises, as the film says them"
      figures={[
        { bird: "falcon", label: "the falcon", promise: "keeps watch: security comes first." },
        { bird: "owl", label: "the owl", promise: "reads every page and knows every face." },
        { bird: "duck", label: "the duck", promise: "builds, line by line, in the open." },
        { bird: "flamingo", label: "the flamingo", promise: "answers, and the payment follows." },
        { bird: "pigeon", label: "the pigeon", promise: "delivers, every time." },
      ]}
    />
  );
}
