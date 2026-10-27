"use client";

import { Field } from "@krizaka/ui/field";
import { MoneyInput } from "@krizaka/ui/money-input";
import { useState } from "react";

export default function MoneyInputCurrencies() {
  const [cents, setCents] = useState<number | null>(129900);
  const [currency, setCurrency] = useState("CAD");
  return (
    <Field.Root>
      <Field.Label htmlFor="amount">Montant</Field.Label>
      <MoneyInput id="amount" value={cents} onValueChange={setCents} currency={currency} onCurrencyChange={setCurrency} currencies={["CAD", "USD", "EUR", "JPY"]} currencyLabel="Devise" locale="fr-CA" />
    </Field.Root>
  );
}
