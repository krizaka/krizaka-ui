import { Chip } from "@krizaka/ui/chip";

// One choice: a filter. `required` keeps one chosen.
export default function ChipSingle() {
  return (
    <Chip.Group type="single" label="Format" defaultValue="all" required>
      <Chip value="all">All</Chip>
      <Chip value="videos">Videos</Chip>
      <Chip value="stories">Stories</Chip>
      <Chip value="collections">Collections</Chip>
    </Chip.Group>
  );
}
