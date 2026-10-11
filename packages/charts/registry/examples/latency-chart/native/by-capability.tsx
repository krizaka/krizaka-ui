import { LatencyChart } from "@krizaka/charts/native";

const capabilities = [
  { name: "Chat", p50: 420, p95: 1_180 },
  { name: "Embed", p50: 85, p95: 210 },
  { name: "Speech", p50: 1_350, p95: 2_900 },
  { name: "Image", p50: 4_200, p95: 9_800 },
];

// Short names: the bars stand upright on a phone.
export default function NativeByCapability() {
  return <LatencyChart title="Latency by capability" data={capabilities} height={170} objective={{ value: 2_000, label: "Objective" }} />;
}
