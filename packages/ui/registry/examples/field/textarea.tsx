import { Field, Textarea } from "@krizaka/ui/field";

export default function FieldTextarea() {
  return (
    <Field.Root>
      <Field.Label htmlFor="bio">Bio</Field.Label>
      <Textarea id="bio" placeholder="A few words about you" />
    </Field.Root>
  );
}
