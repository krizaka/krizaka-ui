import { Chip } from "@krizaka/ui/native";

export default function NativeChipSingle() {
  return (
    <Chip.Group type="single" defaultValue="all" aria-label="Filter">
      <Chip value="all">All</Chip>
      <Chip value="live">Live</Chip>
      <Chip value="ending">Ending soon</Chip>
    </Chip.Group>
  );
}
