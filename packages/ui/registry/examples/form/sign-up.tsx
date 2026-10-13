"use client";

import { KrizakaApiError } from "@krizaka/query";
import { createKrizakaForm, latestBirthDate } from "@krizaka/ui/form";
import { z } from "zod";

// The schema the sign-up API parses with: the same rules, the same keys. `signUp.*` are the app's own words.
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
// The server's codes (Orochia's register API): the ones that belong to a field land under it, the others above the button.
const register = async (v: { email: string; username: string }) => { if (v.username === "admin") throw new KrizakaApiError({ status: 400, code: "USERNAME_RESERVED" }); if (v.email.endsWith("@orochia.com")) throw new KrizakaApiError({ status: 409, code: "ACCOUNT_EXISTS" }); };

// Orochia's sign-up: the username checked as it is typed (a free one offered), an 18+ birth date, the server's refusals in place.
export default function FormSignUp() {
  const form = signUp.useForm({ i18n: { t: (key) => WORDS[key] }, codeFields: { UNDERAGE: "dateOfBirth", BIRTH_DATE_INVALID: "dateOfBirth", USERNAME_RESERVED: "username" }, onSubmit: register });
  return (
    <form.Form aria-label="Create your account" className="flex w-80 flex-col gap-4">
      <form.TextField name="email" label="E-mail" type="email" autoComplete="email" hint="We send a link to confirm it." />
      <form.TextField name="username" label="Username" start="@" autoComplete="username" transform={(v) => v.toLowerCase().replace(/\s+/g, "_")} availableHint="Free" validateAsync={async (u) => ((await taken(u)) ? { key: "signUp.username.taken", suggestion: { label: `Use @${u}_${u.length}`, value: `${u}_${u.length}` } } : null)} />
      <form.TextField name="password" label="Password" type="password" autoComplete="new-password" hint="At least 8 characters." />
      <form.DateField name="dateOfBirth" label="Date of birth" entry="parts" autoComplete="bday" hint="Private, never shown." />
      <form.Checkbox name="acceptTerms" label="I accept the terms and the privacy policy" />
      <form.FormError />
      <form.Submit>Create my account</form.Submit>
    </form.Form>
  );
}
