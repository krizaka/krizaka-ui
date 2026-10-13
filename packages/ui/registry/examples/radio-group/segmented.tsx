import { RadioGroup } from "@krizaka/ui/radio-group";

// A segmented control that is a choice (a form's value), not a view switch: one light glides to the chosen segment.
export default function RadioGroupSegmented() {
  return (
    <RadioGroup.Root label="Billing" defaultValue="yearly" variant="segmented">
      <RadioGroup.Segment value="monthly">Monthly</RadioGroup.Segment>
      <RadioGroup.Segment value="yearly">Yearly</RadioGroup.Segment>
      <RadioGroup.Segment value="lifetime">Lifetime</RadioGroup.Segment>
    </RadioGroup.Root>
  );
}
