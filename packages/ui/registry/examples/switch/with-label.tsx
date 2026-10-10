import { Field } from "@krizaka/ui/field";
import { Switch } from "@krizaka/ui/switch";

// Named by a visible label (`Field.Label htmlFor`), with a hint.
export default function SwitchWithLabel() {
  return (
    <Field.Root className="w-80">
      <div className="flex items-center justify-between gap-4">
        <Field.Label htmlFor="digest" className="text-sm text-fg">
          Weekly digest
        </Field.Label>
        <Switch id="digest" defaultChecked aria-describedby="digest-hint" />
      </div>
      <Field.Hint id="digest-hint">One email on Monday with what you missed.</Field.Hint>
    </Field.Root>
  );
}
