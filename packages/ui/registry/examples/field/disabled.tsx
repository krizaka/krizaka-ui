import { Field, Input } from "@krizaka/ui/field";

export default function FieldDisabled() {
  return (
    <Field.Root>
      <Field.Label htmlFor="email-disabled">Email</Field.Label>
      <Input id="email-disabled" disabled defaultValue="you@example.com" />
    </Field.Root>
  );
}
