import { Chip } from "@krizaka/ui/chip";

export default function ChipDemo() {
  return (
    <div className="flex gap-2">
      <Chip>Subtitles</Chip>
      <Chip defaultSelected>HD</Chip>
      <Chip disabled>4K</Chip>
    </div>
  );
}
