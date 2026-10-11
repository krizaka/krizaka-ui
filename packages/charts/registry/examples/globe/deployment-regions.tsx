import { Globe3D } from "@krizaka/charts/globe";

const regions = [
  { label: "Paris · eu-west-3", lon: 2.35, lat: 48.86, value: 0.9998, tone: "success" as const },
  { label: "Frankfurt · eu-central-1", lon: 8.68, lat: 50.11, value: 0.9995, tone: "success" as const },
  { label: "Montréal · ca-central-1", lon: -73.57, lat: 45.5, value: 0.9991, tone: "success" as const },
  { label: "Virginia · us-east-1", lon: -77.46, lat: 38.95, value: 0.9962, tone: "warning" as const },
  { label: "Singapore · ap-southeast-1", lon: 103.82, lat: 1.35, value: 0.9997, tone: "success" as const },
];

export default function DeploymentRegions() {
  return (
    <Globe3D
      title="Orazaka regions"
      description="Availability over 30 days · replication from Paris"
      points={regions}
      arcs={[
        { from: regions[0]!.label, to: regions[1]!.label },
        { from: regions[0]!.label, to: regions[2]!.label },
        { from: regions[2]!.label, to: regions[3]!.label },
        { from: regions[1]!.label, to: regions[4]!.label },
      ]}
      regions={["FR", "DE", "BE", "CH", "CA", "US", "SG"]}
      center={[-20, 40]}
      format={{ style: "number", options: { style: "percent", maximumFractionDigits: 2 } }}
      pointLabel="Region"
      valueLabel="Availability"
    />
  );
}
