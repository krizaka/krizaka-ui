import type { ComponentMeta } from "../../meta";

export const meta = {
  title: "OTP input",
  summary: "A one-time code in boxes over one real input: the keyboard's suggestion of the code and pasting fill every box at once.",
  status: "beta",
  category: "forms",
  platforms: "native",
  parity: { web: { status: "gap", issue: "krizaka/krizaka-ui#279", reason: "The web sign-in asks for verification codes too." }, desktop: { status: "gap", issue: "krizaka/krizaka-ui#279", reason: "The Mac app signs in with the web's form." } },
  whenToUse: ["Verifying a phone number or an email at sign-up.", "Confirming a payout with a code."],
  whenNotToUse: [
    { when: "For a password.", use: "field" },
  ],
  bestPractices: ["Check the code in `onComplete`; disable it while checking.", "Say what went wrong under it and send a new code."],
  accessibility: {
    keyboard: [],
    notes: ["One text input named by `label`: screen readers read the code as one value.", "`invalid` turns the boxes to danger and plays an error tick."],
  },
  related: ["field", "button"],
  native: {
    imports: ["OtpInput"],
    differences: [],
    examples: [
      { name: "verify", title: "Verify", description: "Six digits from a text message." },
      { name: "invalid", title: "Refused", description: "An expired code, its words under the boxes." },
    ],
  },
} satisfies ComponentMeta;
