import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Copy button",
  summary: "A button that copies a value, says “Copied” in a live region, and falls back to a selected field when the clipboard is unavailable.",
  status: "beta",
  category: "actions",
  platforms: "web",
  parity: { native: { status: "gap", issue: "krizaka/krizaka-ui#782", reason: "The native twins of PromoCodeField, MoneyInput and CopyButton are a follow-up of the coupons surfaces." }, desktop: "web" },
  whenToUse: ["To copy a link, a code or an identifier: an owner link, a coupon, an API key.", "Beside a value the person must paste elsewhere."],
  whenNotToUse: [{ when: "To copy a block of code with its file name and language.", use: "code-block" }, { when: "For an action that is not a copy.", use: "button" }],
  bestPractices: ["`label` says what is copied (“Copy link”), not just “Copy”.", "Keep `fallbackLabel` short: it appears above the selected value when the clipboard is refused.", "Pass a `@krizaka/icons` icon through `icon` to match the page."],
  accessibility: {
    keyboard: [{ keys: "Enter / Space", action: "Copies the value." }],
    notes: ["“Copied” is announced politely (`role=status`) and names the button while it shows.", "Icon only: the label is the accessible name.", "Without the Clipboard API a read-only field appears, selected: nothing fails silently."],
  },
  related: ["button", "code-block"],
  web: {
    imports: ["CopyButton"],
    examples: [
      { name: "default", title: "With words", description: "The label, then “Copied” for 1.8 s." },
      { name: "icon-only", title: "Icon only", description: "A ghost button beside a code." },
    ],
  },
} satisfies ComponentMeta;
