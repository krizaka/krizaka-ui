import { Field, Input } from "@krizaka/ui/field";

// `invalid` sets `aria-invalid` and `data-invalid`; the error is read through `aria-describedby`.
export default function FieldInvalid() {
  return (
    <Field.Root>
      <Field.Label htmlFor="email-invalid">Email</Field.Label>
      <Input id="email-invalid" type="email" invalid defaultValue="you@" aria-describedby="email-error" />
      <Field.Error id="email-error">Enter a complete address.</Field.Error>
    </Field.Root>
  );
}
