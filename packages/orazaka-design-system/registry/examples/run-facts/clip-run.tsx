import { RunFacts } from "@krizaka/orazaka-design-system";

// What the run of Eric's tea-pour shot recorded.
export default function ClipRun() {
  return (
    <RunFacts
      facts={[
        { label: "Model", value: "Wan 2.2 A14B" },
        { label: "Orazaka run", value: "25948442-7c68-4e66-94d6-39cd8b96438d" },
        { label: "Seed", value: "20261011" },
        { label: "Frame", value: "832×480 · 16 fps · 5 s" },
      ]}
    />
  );
}
