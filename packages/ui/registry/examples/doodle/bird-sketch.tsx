import { Doodle } from "@krizaka/ui/doodle";

// The five birds as sketches: a bird in a margin signs the page. Each one says what it is for assistive technology.
export default function DoodleBirdSketch() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
      {(["falcon", "owl", "duck", "flamingo", "pigeon"] as const).map((bird) => (
        <Doodle key={bird} kind="bird" bird={bird} label={`A sketch of the ${bird}`} />
      ))}
    </div>
  );
}
