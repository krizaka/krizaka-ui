import { KrizakaApiError } from "@krizaka/query";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { z } from "zod";

import { axeViolations } from "../test/axe";
import { createKrizakaForm, formMessage, issuesToFields, latestBirthDate, moneyInputText, parseMoney, problemToErrors } from "./index";
import { formProblem, validateForm } from "./server";

const WORDS: Record<string, string> = {
  "signUp.username.taken": "@{username} is taken.",
  "signUp.dateOfBirth.underage": "You must be 18 or older.",
  "form.errors.tooShort": "Au moins {minimum} caractères.",
};
const t = (key: string, values?: Readonly<Record<string, string | number>>) => WORDS[key]?.replace(/\{(\w+)\}/g, (_, n: string) => String(values?.[n]));

const signUp = createKrizakaForm({
  schema: z.object({
    email: z.email(),
    username: z.string().min(3),
    dateOfBirth: z.iso.date().refine((d) => d <= latestBirthDate(18), "signUp.dateOfBirth.underage"),
    acceptTerms: z.boolean().refine(Boolean, "signUp.terms.required"),
  }),
  defaultValues: { email: "", username: "", dateOfBirth: "", acceptTerms: false },
});

function SignUp({ onSubmit, check }: { onSubmit: (v: unknown) => unknown; check?: (u: string, s: AbortSignal) => Promise<unknown> }) {
  const form = signUp.useForm({ onSubmit, i18n: { t } });
  return (
    <form.Form aria-label="Sign up">
      <form.TextField name="email" label="E-mail" type="email" hint="We send a link." />
      <form.TextField
        name="username"
        label="Username"
        transform={(v) => v.toLowerCase()}
        availableHint="Free"
        asyncDebounceMs={200}
        validateAsync={check && (async (u, signal) => ((await check(u, signal)) ? null : { key: "signUp.username.taken", values: { username: u }, suggestion: { label: `Use @${u}_2`, value: `${u}_2` } }))}
      />
      <form.DateField name="dateOfBirth" label="Date of birth" entry="parts" />
      <form.Checkbox name="acceptTerms" label="I accept the terms" />
      <form.FormError />
      <form.Submit>Create</form.Submit>
    </form.Form>
  );
}

describe("errors", () => {
  it("maps a schema's issues to keys, never to the engine's English", () => {
    const result = z.object({ a: z.string().min(1), b: z.string().min(3), c: z.email(), d: z.array(z.string()).max(2), e: z.number().max(9) }).safeParse({ a: "", b: "x", c: "no", d: ["1", "2", "3"], e: 10 });
    const fields = issuesToFields(result.error!.issues);
    expect(fields.a).toMatchObject({ key: "form.errors.required" });
    expect(fields.b).toMatchObject({ key: "form.errors.tooShort", values: { minimum: 3 } });
    expect(fields.c).toMatchObject({ key: "form.errors.invalidEmail" });
    expect(fields.d).toMatchObject({ key: "form.errors.tooMany", values: { maximum: 2 } });
    expect(fields.e).toMatchObject({ key: "form.errors.tooBig", values: { maximum: 9 } });
    expect(formMessage(fields.b!)).toBe("Use at least 3 characters.");
    expect(formMessage(fields.b!, { t })).toBe("Au moins 3 caractères.");
  });

  it("names nested fields as the form does, and keeps a schema's own key", () => {
    const result = z.object({ links: z.array(z.object({ url: z.url("profile.link.invalid") })) }).safeParse({ links: [{ url: "https://a.b" }, { url: "nope" }] });
    expect(issuesToFields(result.error!.issues)).toEqual({ "links[1].url": { key: "profile.link.invalid", source: "schema" } });
  });

  it("places a server's refusals: fields under their fields, the rest for the whole form", () => {
    const error = new KrizakaApiError({ status: 422, code: "validation-failed", fields: { email: { code: "email-domain-refused", message: "Domain refused" }, captcha: { message: "x" } } });
    const { fields, form } = problemToErrors(error, {}, (name) => name === "email");
    expect(fields.email).toMatchObject({ key: "form.errors.email-domain-refused", message: "Domain refused", source: "server" });
    expect(formMessage(fields.email!)).toBe("Domain refused");
    expect(form).toMatchObject({ key: "apiErrors.validation-failed" });
    expect(formMessage(problemToErrors({ status: 429, code: "rate-limited", retryAt: Date.now() + 30_000 }).form!)).toBe("Too many tries. Wait a moment and try again.");
  });

  it("puts a code that belongs to a field under it (UNDERAGE → dateOfBirth), the others above the button", () => {
    const codes = { UNDERAGE: "dateOfBirth", USERNAME_RESERVED: "username" };
    expect(problemToErrors({ status: 400, code: "UNDERAGE" }, {}, undefined, codes)).toEqual({ fields: { dateOfBirth: { key: "form.errors.UNDERAGE", source: "server" } }, form: null });
    expect(problemToErrors({ status: 409, code: "ACCOUNT_EXISTS" }, {}, undefined, codes).form).toMatchObject({ key: "apiErrors.ACCOUNT_EXISTS" });
  });

  it("reads money as integer minor units, the locale's way", () => {
    expect(parseMoney("12.5", "USD")).toBe(1250);
    expect(parseMoney("12,50", "EUR", "fr")).toBe(1250);
    expect(parseMoney("1,234.56", "USD", "en")).toBe(123456);
    expect(parseMoney("1 234,56", "EUR", "fr")).toBe(123456);
    expect(parseMoney("1,234", "USD", "en")).toBe(123400);
    expect(parseMoney("500", "JPY")).toBe(500);
    expect(parseMoney("12.345", "USD", "fr")).toBe(1234500);
    expect(parseMoney("1.999", "EUR", "en")).toBeNull();
    expect(parseMoney("", "USD")).toBeUndefined();
    expect(parseMoney("12a", "USD")).toBeNull();
    expect(parseMoney("1.5.", "USD")).toBeNull();
    expect(moneyInputText(1250, "EUR", "fr")).toBe("12,50");
    expect(moneyInputText(5, "USD")).toBe("0.05");
  });
});

describe("the server side", () => {
  it("validateForm answers with the keys the form shows; formProblem keeps a KrizakaApiError's refusal", async () => {
    const result = await validateForm(signUp.schema, { email: "x", username: "ab", dateOfBirth: "2001-01-01", acceptTerms: true });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.problem).toMatchObject({ status: 422, code: "validation-failed", fields: { email: { key: "form.errors.invalidEmail" }, username: { key: "form.errors.tooShort" } } });
    expect(await validateForm(z.object({ a: z.string() }), { a: "x" })).toEqual({ ok: true, value: { a: "x" } });
    expect(formProblem(new KrizakaApiError({ status: 409, code: "ACCOUNT_EXISTS" }))).toEqual({ status: 409, code: "ACCOUNT_EXISTS" });
    expect(formProblem(new Error("boom"))).toEqual({ status: 500, code: "server" });
  });
});

describe("a form", () => {
  it("shows an error once the field is left, not while it is first typed; it goes as soon as it is fixed", async () => {
    const user = userEvent.setup();
    const { container } = render(<SignUp onSubmit={() => undefined} />);
    const username = screen.getByLabelText("Username");
    await user.type(username, "Er");
    expect(screen.queryByRole("alert")).toBeNull();
    await user.tab();
    expect(screen.getByText("Au moins 3 caractères.")).toBeTruthy();
    expect(username.getAttribute("aria-invalid")).toBe("true");
    expect(username.getAttribute("aria-describedby")).toContain("-error");
    expect((username as HTMLInputElement).value).toBe("er");
    await user.type(username, "c");
    expect(screen.queryByText("Au moins 3 caractères.")).toBeNull();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("a refused submit shows every error and focuses the first; a valid one sends the schema's output", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<SignUp onSubmit={onSubmit} />);
    await user.click(screen.getByRole("button", { name: "Create" }));
    await waitFor(() => expect(document.activeElement).toBe(screen.getByLabelText("E-mail")));
    expect(screen.getByText("Enter an e-mail address, like name@example.com.")).toBeTruthy();
    expect(onSubmit).not.toHaveBeenCalled();
    await user.type(screen.getByLabelText("E-mail"), "eric@example.com");
    await user.type(screen.getByLabelText("Username"), "eric");
    await user.type(screen.getByLabelText("Day"), "27");
    await user.type(screen.getByLabelText("Month"), "03");
    await user.type(screen.getByLabelText("Year"), "2015");
    expect(screen.getByText("You must be 18 or older.")).toBeTruthy();
    await user.clear(screen.getByLabelText("Year"));
    await user.type(screen.getByLabelText("Year"), "1990");
    await user.click(screen.getByRole("checkbox", { name: "I accept the terms" }));
    await user.click(screen.getByRole("button", { name: "Create" }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ email: "eric@example.com", username: "eric", dateOfBirth: "1990-03-27", acceptTerms: true }));
  });

  it("checks a username as it is typed, debounced, and offers the free one", async () => {
    const user = userEvent.setup();
    const check = vi.fn(async (u: string) => u !== "eric");
    render(<SignUp onSubmit={() => undefined} check={check} />);
    await user.type(screen.getByLabelText("Username"), "eric");
    expect(await screen.findByText("@eric is taken.")).toBeTruthy();
    expect(check.mock.calls.map(([u]) => u)).toEqual(["eric"]);
    await user.click(screen.getByRole("button", { name: "Use @eric_2" }));
    expect((screen.getByLabelText("Username") as HTMLInputElement).value).toBe("eric_2");
    expect(await screen.findByText("Free")).toBeTruthy();
  });

  it("puts a server's refusal under its field until it changes, and the rest above the button", async () => {
    const user = userEvent.setup();
    let answer: unknown = new KrizakaApiError({ status: 422, code: "validation-failed", fields: { email: { code: "taken", message: "This e-mail already has an account." } } });
    render(
      <SignUp
        onSubmit={() => {
          throw answer;
        }}
      />,
    );
    await user.type(screen.getByLabelText("E-mail"), "eric@example.com");
    await user.type(screen.getByLabelText("Username"), "eric");
    await user.type(screen.getByLabelText("Day"), "1");
    await user.type(screen.getByLabelText("Month"), "1");
    await user.type(screen.getByLabelText("Year"), "1990");
    await user.click(screen.getByRole("checkbox"));
    await user.click(screen.getByRole("button", { name: "Create" }));
    expect(await screen.findByText("This e-mail already has an account.")).toBeTruthy();
    await user.type(screen.getByLabelText("E-mail"), "x");
    expect(screen.queryByText("This e-mail already has an account.")).toBeNull();
    answer = new KrizakaApiError({ status: 429, code: "rate-limited" });
    await user.click(screen.getByRole("button", { name: "Create" }));
    expect(await screen.findByText("Too many tries. Wait a moment and try again.")).toBeTruthy();
  });
});

describe("arrays and actions", () => {
  const links = createKrizakaForm({ schema: z.object({ links: z.array(z.object({ url: z.url() })).max(2) }), defaultValues: { links: [{ url: "https://a.example" }] } });

  function Links({ action }: { action: (v: { links: { url: string }[] }) => Promise<{ ok: true } | { ok: false; problem: { fields: Record<string, string> } }> }) {
    const form = links.useFormWithAction(action);
    return (
      <form.Form>
        <form.FieldArray name="links">
          {(array) => (
            <>
              {array.items.map((_, i) => (
                <form.TextField key={i} name={array.fieldName(i, "url") as "links"} label={`Link ${i + 1}`} />
              ))}
              <button type="button" onClick={() => array.push({ url: "" })}>
                Add
              </button>
              {array.error ? <p>{array.error}</p> : null}
            </>
          )}
        </form.FieldArray>
        <form.Submit>Save</form.Submit>
      </form.Form>
    );
  }

  it("grows a list of fields and validates each item and the list", async () => {
    const user = userEvent.setup();
    const action = vi.fn(async () => ({ ok: true as const }));
    render(<Links action={action} />);
    await user.click(screen.getByRole("button", { name: "Add" }));
    await user.type(screen.getByLabelText("Link 2"), "nope");
    await user.tab();
    expect(screen.getByText("Enter a web address, like https://example.com.")).toBeTruthy();
    await user.clear(screen.getByLabelText("Link 2"));
    await user.type(screen.getByLabelText("Link 2"), "https://b.example");
    await user.click(screen.getByRole("button", { name: "Add" }));
    await user.type(screen.getByLabelText("Link 3"), "https://c.example");
    await act(async () => {
      await user.click(screen.getByRole("button", { name: "Save" }));
    });
    expect(screen.getByText("Choose at most 2.")).toBeTruthy();
    expect(action).not.toHaveBeenCalled();
  });

  it("sends through a Server Action and shows its refusal under the item", async () => {
    const user = userEvent.setup();
    const action = vi.fn(async () => ({ ok: false as const, problem: { fields: { "links[0].url": "profile.link.blocked" } } }));
    render(<Links action={action} />);
    await user.click(screen.getByRole("button", { name: "Save" }));
    await waitFor(() => expect(action).toHaveBeenCalledWith({ links: [{ url: "https://a.example" }] }));
    expect(await screen.findByText("Check this field.")).toBeTruthy();
    expect(screen.getByLabelText("Link 1").getAttribute("aria-invalid")).toBe("true");
  });
});

describe("the controls of DS5 behind the same fields", () => {
  it("a date on wheels, tactile keys, a segmented choice and a stepped slider: the same values in the form", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const prefs = createKrizakaForm({
      schema: z.object({ dateOfBirth: z.iso.date(), size: z.enum(["s", "m", "l"]), billing: z.enum(["monthly", "yearly"]), share: z.number() }),
      defaultValues: { dateOfBirth: "", size: "s" as "s" | "m" | "l", billing: "monthly" as "monthly" | "yearly", share: 50 },
    });
    function Prefs() {
      const form = prefs.useForm({ onSubmit, i18n: { locale: "en-US" } });
      return (
        <form.Form aria-label="Preferences">
          <form.DateField name="dateOfBirth" label="Date of birth" entry="wheel" max="2008-10-11" />
          <form.RadioGroup name="size" label="Size" variant="buttons" options={[{ value: "s", label: "S" }, { value: "m", label: "M", description: "Most taken" }, { value: "l", label: "L" }]} />
          <form.RadioGroup name="billing" label="Billing" variant="segmented" options={[{ value: "monthly", label: "Monthly" }, { value: "yearly", label: "Yearly" }]} />
          <form.Slider name="share" label="Share" step={10} ticks />
          <form.Submit>Save</form.Submit>
        </form.Form>
      );
    }
    const { container } = render(<Prefs />);
    expect(await axeViolations(container)).toEqual([]);
    screen.getByRole("spinbutton", { name: "Year" }).focus();
    await user.keyboard("{ArrowDown}");
    await user.click(screen.getByRole("radio", { name: "M Most taken" }));
    await user.click(screen.getByRole("radio", { name: "Yearly" }));
    screen.getByRole("slider", { name: "Share" }).focus();
    await user.keyboard("{ArrowRight}");
    await user.click(screen.getByRole("button", { name: "Save" }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ dateOfBirth: "2007-10-11", size: "m", billing: "yearly", share: 60 }));
  });
});
