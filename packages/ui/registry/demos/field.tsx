import { Field, Input } from "@krizaka/ui/field";

export default function FieldDemo() {
  return (
    <Field.Root>
      <Field.Label htmlFor="email">Email</Field.Label>
      <Input id="email" type="email" aria-describedby="email-hint" placeholder="you@example.com" />
      <Field.Hint id="email-hint">We never share it.</Field.Hint>
    </Field.Root>
  );
}
