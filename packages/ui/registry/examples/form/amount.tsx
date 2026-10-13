"use client";

import { Chip } from "@krizaka/ui/chip";
import { createKrizakaForm } from "@krizaka/ui/form";
import { z } from "zod";

const tip = createKrizakaForm({
  schema: z.object({
    amount: z.number({ message: "tip.amount.invalid" }).int().min(100, "tip.amount.min").max(50_000, "tip.amount.max"),
    message: z.string().max(140),
    anonymous: z.boolean(),
  }),
  defaultValues: { amount: 500, message: "", anonymous: false },
  i18n: { t: (key) => ({ "tip.amount.invalid": "Enter an amount.", "tip.amount.min": "At least $1.", "tip.amount.max": "At most $500." })[key] },
});
const PRESETS = [200, 500, 1000];

// A tip in cents: typed the locale's way (`12.50`), never a float; presets set the field from outside.
export default function FormAmount() {
  const form = tip.useForm({ onSubmit: (values) => new Promise((done) => setTimeout(() => done(values), 400)) });
  return (
    <form.Form aria-label="Send a tip" className="flex w-80 flex-col gap-4">
      <form.Money name="amount" label="Amount" currency="USD" hint="Between $1 and $500." />
      <form.Watch name="amount">
        {(amount) => (
          <div className="flex gap-2" role="group" aria-label="Suggested amounts">
            {PRESETS.map((cents) => <Chip key={cents} selected={amount === cents} onSelectedChange={() => form.setValue("amount", cents)}>{`$${cents / 100}`}</Chip>)}
          </div>
        )}
      </form.Watch>
      <form.TextArea name="message" label="A word for the creator" rows={2} maxLength={140} />
      <form.Checkbox name="anonymous" label="Send it anonymously" />
      <form.Submit>Send the tip</form.Submit>
    </form.Form>
  );
}
