import { Chip } from "@krizaka/ui/chip";

// Alone, a chip is a pressed button: `selected` / `onSelectedChange`, or `defaultSelected`.
export default function ChipToggle() {
  return (
    <div className="flex gap-2">
      <Chip>Subtitles</Chip>
      <Chip defaultSelected>HD</Chip>
      <Chip disabled>4K</Chip>
    </div>
  );
}
