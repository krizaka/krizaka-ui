import { RadioGroup } from "@krizaka/ui/radio-group";

// `orientation="horizontal"`: left and right arrows, the items in a row.
export default function RadioGroupHorizontal() {
  return (
    <RadioGroup.Root label="Quality" defaultValue="1080" orientation="horizontal" className="gap-5">
      <RadioGroup.Item value="720">720p</RadioGroup.Item>
      <RadioGroup.Item value="1080">1080p</RadioGroup.Item>
      <RadioGroup.Item value="2160">4K</RadioGroup.Item>
    </RadioGroup.Root>
  );
}
