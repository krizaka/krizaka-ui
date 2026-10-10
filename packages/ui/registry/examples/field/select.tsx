import { Field, Select } from "@krizaka/ui/field";

// A native select: the platform's menu, accessible and right on phones.
export default function FieldSelect() {
  return (
    <Field.Root>
      <Field.Label htmlFor="country">Country</Field.Label>
      <Select id="country" defaultValue="fr">
        <option value="fr">France</option>
        <option value="tn">Tunisia</option>
        <option value="ca">Canada</option>
      </Select>
    </Field.Root>
  );
}
