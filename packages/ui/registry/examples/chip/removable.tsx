import { Chip } from "@krizaka/ui/chip";

// Chosen tags, each with a named remove button.
export default function ChipRemovable() {
  return (
    <div className="flex flex-wrap gap-2">
      <Chip removable removeLabel="Remove #night" onRemove={() => {}}>
        #night
      </Chip>
      <Chip removable removeLabel="Remove #city" onRemove={() => {}}>
        #city
      </Chip>
    </div>
  );
}
