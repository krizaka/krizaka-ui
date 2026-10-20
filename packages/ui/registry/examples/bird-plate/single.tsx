import { BirdPlate } from "@krizaka/ui/bird-plate";

// `layout="single"`: one bird, large, its caption beside it — the subject of a page (here, the owl on Yomizaka's).
export default function BirdPlateSingle() {
  return (
    <BirdPlate
      className="max-w-xl"
      layout="single"
      start={2}
      figures={[{ bird: "owl", mood: "thinking", label: "the owl", promise: "reads every page and knows every face." }]}
    />
  );
}
