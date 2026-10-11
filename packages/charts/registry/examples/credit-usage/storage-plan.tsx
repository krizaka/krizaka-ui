import { CreditUsage } from "@krizaka/charts/credits";

// Orochia's console: the platform's video storage, in gigabytes, past the warning level.
export default function StoragePlan() {
  return (
    <CreditUsage
      title="Platform storage"
      description="Bunny Stream · Growth plan"
      used={1_742}
      limit={2_000}
      format={{ style: "unit", unit: "gigabyte" }}
      labels={{ remaining: "free of {limit}" }}
    />
  );
}
