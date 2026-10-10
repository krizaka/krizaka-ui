import { Button } from "@krizaka/ui/button";
import { Field, Input } from "@krizaka/ui/field";
import { Popover } from "@krizaka/ui/popover";

export default function PopoverForm({ defaultOpen = false }: { defaultOpen?: boolean }) {
  return (
    <Popover.Root defaultOpen={defaultOpen}>
      <Popover.Trigger asChild>
        <Button variant="outline">Set a goal</Button>
      </Popover.Trigger>
      <Popover.Content aria-label="Set a goal" align="center">
        <div className="flex flex-col gap-3">
          <Field.Root>
            <Field.Label htmlFor="goal-amount">Amount</Field.Label>
            <Input id="goal-amount" defaultValue="250" />
          </Field.Root>
          <div className="flex justify-end gap-2">
            <Popover.Close asChild>
              <Button size="sm" variant="ghost">
                Cancel
              </Button>
            </Popover.Close>
            <Button size="sm" variant="primary">
              Save
            </Button>
          </div>
        </div>
      </Popover.Content>
    </Popover.Root>
  );
}
