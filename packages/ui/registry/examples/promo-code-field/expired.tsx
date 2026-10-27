"use client";

import { PromoCodeField } from "@krizaka/ui/promo-code-field";

export default function PromoCodeFieldExpired() {
  return <PromoCodeField label="Promo code" applyLabel="Apply" removeLabel="Remove" onApply={async () => ({ ok: false, message: "This code expired on 31 October.", expired: true })} />;
}
