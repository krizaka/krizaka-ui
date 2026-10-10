import { Chip } from "@krizaka/ui/chip";

export default function ChipMultiple() {
  return (
    <Chip.Group type="multiple" label="Tags" defaultValue={["night", "rain"]}>
      <Chip value="night">#night</Chip>
      <Chip value="city">#city</Chip>
      <Chip value="rain">#rain</Chip>
      <Chip value="neon">#neon</Chip>
    </Chip.Group>
  );
}
