import { KrizakaApiError } from "@krizaka/query";
import { createKrizakaForm, latestBirthDate } from "@krizaka/ui/native/form";
import { z } from "zod";

// The same schema as the web form (a product keeps it in packages/core): the same rules, the same keys.
const signUp = createKrizakaForm({
  schema: z.object({
    email: z.email(),
    username: z.string().min(3).max(30).regex(/^[a-z0-9_]+$/, "signUp.username.format"),
    password: z.string().min(8),
    dateOfBirth: z.iso.date().refine((d) => d <= latestBirthDate(18), "form.errors.UNDERAGE"),
    acceptTerms: z.boolean().refine(Boolean, "signUp.terms.required"),
  }),
  defaultValues: { email: "", username: "", password: "", dateOfBirth: "", acceptTerms: false },
});
const WORDS: Record<string, string> = { "signUp.username.format": "Lowercase letters, digits and _ only.", "signUp.username.taken": "This username is taken.", "signUp.terms.required": "Accept the terms to continue.", "form.errors.UNDERAGE": "You must be 18 or older.", "form.errors.BIRTH_DATE_INVALID": "Enter your real date of birth.", "form.errors.USERNAME_RESERVED": "This username is reserved.", "apiErrors.ACCOUNT_EXISTS": "This e-mail already has an account. Sign in instead." };
const taken = (u: string) => new Promise<boolean>((done) => setTimeout(() => done(["eric", "elena"].includes(u)), 300));
const register = async (v: { email: string; username: string }) => { if (v.username === "admin") throw new KrizakaApiError({ status: 400, code: "USERNAME_RESERVED" }); if (v.email.endsWith("@example.com")) throw new KrizakaApiError({ status: 409, code: "ACCOUNT_EXISTS" }); };

// Sign-up in the app: the return key walks the fields, the username is checked as typed, the 18+ birth date is day · month · year.
export default function NativeFormSignUp() {
  const form = signUp.useForm({ i18n: { t: (key) => WORDS[key], locale: "en-GB" }, codeFields: { UNDERAGE: "dateOfBirth", BIRTH_DATE_INVALID: "dateOfBirth", USERNAME_RESERVED: "username" }, onSubmit: register });
  return (
    <form.Form aria-label="Create your account" style={{ width: 312 }}>
      <form.TextField name="email" label="E-mail" keyboardType="email-address" autoComplete="email" autoCapitalize="none" textContentType="emailAddress" />
      <form.TextField name="username" label="Username" autoCapitalize="none" autoComplete="username" transform={(v) => v.toLowerCase().replace(/\s+/g, "_")} availableHint="Free" validateAsync={async (u) => ((await taken(u)) ? { key: "signUp.username.taken", suggestion: { label: `Use @${u}_${u.length}`, value: `${u}_${u.length}` } } : null)} />
      <form.TextField name="password" label="Password" secureTextEntry autoComplete="new-password" textContentType="newPassword" hint="At least 8 characters." />
      <form.DateField name="dateOfBirth" label="Date of birth" autoComplete="bday" hint="Private, never shown." />
      <form.Checkbox name="acceptTerms" label="I accept the terms and the privacy policy" />
      <form.FormError />
      <form.Submit label="Create my account" brand="orazaka" />
    </form.Form>
  );
}
