import { Chip } from "@krizaka/ui/native";
import { createKrizakaForm } from "@krizaka/ui/native/form";
import { z } from "zod";

const tip = createKrizakaForm({
  schema: z.object({ amount: z.number({ message: "tip.amount.invalid" }).int().min(100, "tip.amount.min").max(50_000, "tip.amount.max"), message: z.string().max(140), anonymous: z.boolean() }),
  defaultValues: { amount: 500, message: "", anonymous: false },
  i18n: { t: (key) => ({ "tip.amount.invalid": "Enter an amount.", "tip.amount.min": "At least €1.", "tip.amount.max": "At most €500." })[key], locale: "fr-FR" },
});
const PRESETS = [200, 500, 1000];

// A tip in cents on the decimal keypad, typed the locale's way (`12,50` in French); presets set the field from outside.
export default function NativeFormAmount() {
  const form = tip.useForm({ onSubmit: (values) => new Promise((done) => setTimeout(() => done(values), 400)) });
  return (
    <form.Form aria-label="Send a tip" style={{ width: 312 }}>
      <form.Money name="amount" label="Amount" currency="EUR" hint="Between €1 and €500." />
      <form.Watch name="amount">
        {(amount) => (
          <Chip.Group type="single" aria-label="Suggested amounts" value={String(amount)} onValueChange={(v) => form.setValue("amount", Number(v))}>
            {PRESETS.map((cents) => <Chip key={cents} value={String(cents)}>{`${cents / 100} €`}</Chip>)}
          </Chip.Group>
        )}
      </form.Watch>
      <form.TextArea name="message" label="A word for the creator" maxLength={140} />
      <form.Checkbox name="anonymous" label="Send it anonymously" />
      <form.Submit label="Send the tip" />
    </form.Form>
  );
}
