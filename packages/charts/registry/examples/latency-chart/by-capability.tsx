import { LatencyChart } from "@krizaka/charts/latency";

// Milliseconds, per capability, over the last 24 hours (the console's supervision).
const capabilities = [
  { name: "Chat", p50: 420, p95: 1_180 },
  { name: "Embeddings", p50: 85, p95: 210 },
  { name: "Speech to text", p50: 1_350, p95: 2_900 },
  { name: "Image", p50: 4_200, p95: 9_800 },
  { name: "Translation", p50: 610, p95: 1_640 },
];

export default function ByCapability() {
  return (
    <LatencyChart
      title="Latency by capability"
      description="Last 24 hours"
      data={capabilities}
      objective={{ value: 2_000, label: "Objective" }}
    />
  );
}
