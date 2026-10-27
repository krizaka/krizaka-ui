"use client";

import { Field } from "@krizaka/ui/field";
import { MoneyInput } from "@krizaka/ui/money-input";
import { useState } from "react";

export default function MoneyInputDefault() {
  const [cents, setCents] = useState<number | null>(3900);
  return (
    <Field.Root>
      <Field.Label htmlFor="price">Price</Field.Label>
      <MoneyInput id="price" value={cents} onValueChange={setCents} currency="CAD" locale="en-CA" />
      <Field.Hint>{cents === null ? "Empty" : `${cents} cents`}</Field.Hint>
    </Field.Root>
  );
}
