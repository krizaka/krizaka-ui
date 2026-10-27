"use client";

import { PromoCodeField } from "@krizaka/ui/promo-code-field";

export default function PromoCodeFieldApplied() {
  return <PromoCodeField label="Code promo" applyLabel="Appliquer" removeLabel="Retirer" applied={{ code: "FOUNDER", effect: "39 $ la première année" }} onApply={async () => ({ ok: false, message: "Code expiré." })} />;
}
