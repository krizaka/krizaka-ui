"use client";

import { Button } from "@krizaka/ui/button";
import { Chip } from "@krizaka/ui/chip";
import { DetailLayout } from "@krizaka/ui/detail-layout";
import { Field, Textarea } from "@krizaka/ui/field";
import { Stat } from "@krizaka/ui/stat";
import * as React from "react";

const AMOUNTS = [3, 5, 10, 20];

// TEMPLATE — tipping a creator (Orochia): who is paid, the amount in one tap, an optional word, the summary beside the
// action — under the form on a phone, where the pay button stays last. The total is always said before the button.
export default function DetailLayoutCheckout() {
  const [amount, setAmount] = React.useState("5");
  return (
    <div className="brand-orochia w-full">
      <DetailLayout
        back={<a href="#elena">← Elena's page</a>}
        eyebrow="Tip"
        title="Say thanks to Elena"
        meta="She keeps 90 %. Paid out every Monday."
        aside={
          <div className="flex flex-col gap-4 rounded-xl border border-border-default bg-surface-1 p-4">
            <Stat label="You pay" value={`€${amount}`} hint="no fee added on top" />
            <Button variant="primary" className="w-full">{`Tip €${amount}`}</Button>
          </div>
        }
      >
        <form className="flex max-w-lg flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
          <Chip.Group type="single" label="Amount" value={amount} onValueChange={(v) => v && setAmount(v)} required>
            {AMOUNTS.map((a) => (
              <Chip key={a} value={String(a)}>{`€${a}`}</Chip>
            ))}
          </Chip.Group>
          <Field.Root>
            <Field.Label htmlFor="note">A word for her (optional)</Field.Label>
            <Textarea id="note" rows={3} placeholder="The rooftop scene was incredible." />
          </Field.Root>
        </form>
      </DetailLayout>
    </div>
  );
}
