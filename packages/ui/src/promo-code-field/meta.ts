import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Promo code field",
  summary: "Enter a code, apply it, and see the state: checking, applied with its effect, or refused (invalid, expired). The caller validates.",
  status: "experimental",
  adoption: "orazaka#417",
  category: "forms",
  domain: "commerce",
  platforms: "web",
  parity: { native: { status: "gap", issue: "krizaka/krizaka-ui#782", reason: "The native twins of PromoCodeField, MoneyInput and CopyButton are a follow-up of the coupons surfaces." }, desktop: "web" },
  whenToUse: ["At checkout or on a plan page where a coupon is applied.", "When the check is the product's (a request, a rule) and the field only shows the result."],
  whenNotToUse: [{ when: "For any other text entry.", use: "field" }],
  bestPractices: ["`onApply` returns `{ ok: false, message }` for a refusal, it never rejects; `expired: true` sets `data-state=expired`.", "Say the effect in words (“39 $ for the first year”), already formatted.", "The input keeps the code after a refusal so it can be corrected."],
  accessibility: {
    keyboard: [{ keys: "Enter", action: "Applies the code." }],
    notes: ["The refusal is under the field, linked by `aria-describedby`, and announced politely.", "Applied: the chip's remove button is named “Remove CODE”.", "While checking, the button is busy (`aria-busy`)."],
  },
  related: ["field", "chip", "button"],
  web: {
    imports: ["PromoCodeField"],
    examples: [
      { name: "default", title: "Try “FOUNDER”", description: "Idle, then applied or refused." },
      { name: "applied", title: "Applied", description: "A code already applied, in French." },
      { name: "expired", title: "Expired", description: "A refusal with the expired state." },
    ],
  },
} satisfies ComponentMeta;
