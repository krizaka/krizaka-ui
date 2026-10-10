import { Checkbox } from "@krizaka/ui/checkbox";
import { Field } from "@krizaka/ui/field";

// In a `Field`: `invalid` and its error, wired by `aria-describedby`.
export default function CheckboxInvalid() {
  return (
    <Field.Root className="w-80">
      <Checkbox invalid aria-describedby="age-error">
        I am 18 or older
      </Checkbox>
      <Field.Error id="age-error">You must be 18 or older to continue.</Field.Error>
    </Field.Root>
  );
}
