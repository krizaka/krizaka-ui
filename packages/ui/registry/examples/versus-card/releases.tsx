import { VersusCard } from "@krizaka/ui/versus-card";

// Two releases face to face, on figures measured by the build: the bird of the release that builds, and the one that reads.
export default function VersusCardReleases() {
  return (
    <VersusCard
      label="Krizaka UI 2.0 versus 1.9"
      source="Measured by size-limit and Vitest on the tagged builds."
      left={{
        name: "Krizaka UI 2.0",
        bird: "duck",
        caption: "The release that builds",
        stats: [
          { label: "Gzipped bundle", value: 4.1, max: 6, display: "4.1 kB" },
          { label: "Coverage", value: 94, display: "94 %" },
        ],
      }}
      right={{
        name: "Krizaka UI 1.9",
        bird: "owl",
        caption: "The release that reads",
        stats: [
          { label: "Gzipped bundle", value: 5.2, max: 6, display: "5.2 kB" },
          { label: "Coverage", value: 88, display: "88 %" },
        ],
      }}
    />
  );
}
