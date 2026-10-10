import { RadioGroup } from "@krizaka/ui/radio-group";

export default function RadioGroupItems() {
  return (
    <RadioGroup.Root label="Notification frequency" defaultValue="daily">
      <RadioGroup.Item value="instant">Instantly</RadioGroup.Item>
      <RadioGroup.Item value="daily">Once a day</RadioGroup.Item>
      <RadioGroup.Item value="weekly">Once a week</RadioGroup.Item>
      <RadioGroup.Item value="never" disabled>
        Never
      </RadioGroup.Item>
    </RadioGroup.Root>
  );
}
