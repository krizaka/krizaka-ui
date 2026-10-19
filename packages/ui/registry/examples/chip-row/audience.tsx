import { ChipRow } from "@krizaka/ui/chip-row";

// « Who is it for? » — each choice an address; the current one marked, one not ready yet.
export default function ChipRowAudience() {
  return (
    <ChipRow label="For whom?" hint="Pick the one that looks like you.">
      <ChipRow.Item href="#tenants" selected>
        Tenants
      </ChipRow.Item>
      <ChipRow.Item href="#landlords">Landlords</ChipRow.Item>
      <ChipRow.Item href="#agencies" badge="Soon">
        Agencies
      </ChipRow.Item>
    </ChipRow>
  );
}
