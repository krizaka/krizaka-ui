import { VersusCard } from "@krizaka/ui/versus-card";

// A component and its alternative: the same stats on both sides, the reader decides.
export default function VersusCardAlternatives() {
  return (
    <VersusCard
      label="Dialog versus Sheet"
      vs="VS"
      left={{ name: "Dialog", bird: "falcon", stats: [{ label: "Focus trap", value: 100, display: "Yes" }, { label: "Bundle", value: 3.2, max: 6, display: "3.2 kB" }] }}
      right={{ name: "Sheet", bird: "pigeon", stats: [{ label: "Focus trap", value: 100, display: "Yes" }, { label: "Bundle", value: 2.4, max: 6, display: "2.4 kB" }] }}
      source="Sizes from each package's size-limit budget."
    />
  );
}
