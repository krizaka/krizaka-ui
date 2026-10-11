import { PieChart } from "@krizaka/charts/pie";

// Gigabytes; past six slices the smallest fold into “Other”.
const kinds = [
  { kind: "Videos", gb: 812 },
  { kind: "Thumbnails", gb: 64 },
  { kind: "Audio", gb: 121 },
  { kind: "Subtitles", gb: 3 },
  { kind: "Project files", gb: 96 },
  { kind: "Exports", gb: 210 },
  { kind: "Fonts", gb: 1 },
  { kind: "Logs", gb: 2 },
];

export default function StorageByKind() {
  return (
    <PieChart
      title="Storage by kind"
      data={kinds}
      label="kind"
      value="gb"
      format={{ style: "unit", unit: "gigabyte" }}
      otherLabel="Other"
    />
  );
}
