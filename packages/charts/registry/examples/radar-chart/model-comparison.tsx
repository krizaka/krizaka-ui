import { RadarChart } from "@krizaka/charts/radar";

// Scores out of 100, higher is better on every axis.
const scores = [
  { measure: "Quality", large: 92, small: 78 },
  { measure: "Speed", large: 64, small: 91 },
  { measure: "Cost efficiency", large: 55, small: 88 },
  { measure: "French", large: 95, small: 84 },
  { measure: "Tool use", large: 89, small: 70 },
];

export default function ModelComparison() {
  return (
    <RadarChart
      title="Two chat models compared"
      description="Orazaka evaluation set, October 2026 · out of 100"
      data={scores}
      x="measure"
      xLabel="Measure"
      series={[
        { key: "large", label: "Mistral Large" },
        { key: "small", label: "Mistral Small" },
      ]}
      max={100}
      format="integer"
    />
  );
}
