"use client";

import { PromoCodeField } from "@krizaka/ui/promo-code-field";

export default function PromoCodeFieldDefault() {
  return (
    <PromoCodeField
      label="Promo code"
      applyLabel="Apply"
      removeLabel="Remove"
      onApply={async (code) => (code.toUpperCase() === "FOUNDER" ? { ok: true, effect: "39 $ for the first year" } : { ok: false, message: "This code does not exist." })}
    />
  );
}
