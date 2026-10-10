import { Chip } from "@krizaka/ui/chip";

export default function ChipSmall() {
  return (
    <Chip.Group type="single" label="Speed" size="sm" defaultValue="1">
      <Chip value="0.5">0.5×</Chip>
      <Chip value="1">1×</Chip>
      <Chip value="1.5">1.5×</Chip>
      <Chip value="2">2×</Chip>
    </Chip.Group>
  );
}
