import { ChipRow } from "@krizaka/ui/chip-row";

// The quick filters of a home page: each chip is one link, the colour a dot, the count muted. The link's name is its label and its count (« To review 5 »).
export default function ChipRowFilters() {
  return (
    <ChipRow label="Filter your documents">
      <ChipRow.Item href="#review" marker="amber" count={5}>
        To review
      </ChipRow.Item>
      <ChipRow.Item href="#failed" marker="red" count={3}>
        Failed
      </ChipRow.Item>
      <ChipRow.Item href="#rosemont" marker="blue" count={6} selected>
        Rosemont
      </ChipRow.Item>
      <ChipRow.Item href="#villeray" marker="green" count={6}>
        Villeray
      </ChipRow.Item>
      <ChipRow.Item href="#2026" marker="violet" count={4}>
        2026
      </ChipRow.Item>
      <ChipRow.Item href="#archive" marker="gray" count={12}>
        Archive
      </ChipRow.Item>
    </ChipRow>
  );
}
