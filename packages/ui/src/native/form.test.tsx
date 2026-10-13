// The native form: the same createKrizakaForm and schema as the web, on the native fields.
import { describe, expect, jest, test } from "@jest/globals";
import { KrizakaApiError } from "@krizaka/query";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import * as React from "react";
import { AccessibilityInfo } from "react-native";
import { z } from "zod";

import { createKrizakaForm, latestBirthDate } from "./form";

const signUp = createKrizakaForm({
  schema: z.object({
    email: z.email(),
    username: z.string().min(3),
    dateOfBirth: z.iso.date().refine((d) => d <= latestBirthDate(18), "signUp.dateOfBirth.underage"),
    plan: z.enum(["free", "plus"]),
    acceptTerms: z.boolean().refine(Boolean, "signUp.terms.required"),
    price: z.number().int().min(100),
  }),
  defaultValues: { email: "", username: "", dateOfBirth: "", plan: "free" as "free" | "plus", acceptTerms: false, price: 500 },
  i18n: { t: (key) => ({ "signUp.dateOfBirth.underage": "You must be 18 or older.", "signUp.username.taken": "Taken." })[key], locale: "en-GB" },
});

function SignUp({ onSubmit, check }: { onSubmit: (v: unknown) => unknown; check?: (u: string) => Promise<boolean> }) {
  const form = signUp.useForm({ onSubmit });
  return (
    <form.Form aria-label="Sign up">
      <form.TextField name="email" label="E-mail" />
      <form.TextField name="username" label="Username" asyncDebounceMs={5} validateAsync={check && (async (u) => ((await check(u)) ? null : { key: "signUp.username.taken", suggestion: { label: "Use eric_2", value: "eric_2" } }))} />
      <form.DateField name="dateOfBirth" label="Date of birth" entry="parts" />
      <form.RadioGroup name="plan" label="Plan" options={[{ value: "free", label: "Free" }, { value: "plus", label: "Plus" }]} />
      <form.Money name="price" label="Price" currency="USD" />
      <form.Checkbox name="acceptTerms" label="I accept the terms" />
      <form.FormError />
      <form.Submit label="Create" />
    </form.Form>
  );
}

const type = async (label: string, text: string) => {
  await fireEvent.changeText(screen.getByLabelText(label), text);
  await fireEvent(screen.getByLabelText(label), "blur");
};

describe("native form", () => {
  test("a refused submit shows the errors and announces the first; a valid one sends the schema's output", async () => {
    const announce = jest.spyOn(AccessibilityInfo, "announceForAccessibility").mockImplementation(() => undefined);
    const onSubmit = jest.fn();
    await render(<SignUp onSubmit={onSubmit} />);
    await fireEvent.press(screen.getByRole("button", { name: "Create" }));
    await waitFor(() => expect(announce).toHaveBeenCalledWith("Enter an e-mail address, like name@example.com."));
    expect(onSubmit).not.toHaveBeenCalled();
    await type("E-mail", "eric@example.com");
    await type("Username", "eric");
    await type("Date of birth, Day", "27");
    await type("Date of birth, Month", "3");
    await type("Date of birth, Year", "2015");
    expect(screen.getByText("You must be 18 or older.")).toBeTruthy();
    await type("Date of birth, Year", "1990");
    await fireEvent.press(screen.getByRole("radio", { name: "Plus" }));
    await type("Price", "12,5");
    await fireEvent.press(screen.getByRole("checkbox", { name: "I accept the terms" }));
    await fireEvent.press(screen.getByRole("button", { name: "Create" }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ email: "eric@example.com", username: "eric", dateOfBirth: "1990-03-27", plan: "plus", acceptTerms: true, price: 1250 }));
    announce.mockRestore();
  });

  test("checks a username as typed and offers the free one; a server refusal lands on its field", async () => {
    const check = jest.fn(async (u: string) => u !== "eric");
    const onSubmit = jest.fn(() => {
      throw new KrizakaApiError({ status: 422, code: "validation-failed", fields: { email: { message: "This e-mail already has an account." } } });
    });
    await render(<SignUp onSubmit={onSubmit} check={check} />);
    await act(async () => {
      await fireEvent.changeText(screen.getByLabelText("Username"), "eric");
      await new Promise((done) => setTimeout(done, 30));
    });
    expect(await screen.findByText("Taken.")).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Use eric_2" }));
    expect(screen.getByLabelText("Username").props.value).toBe("eric_2");
    await type("E-mail", "eric@example.com");
    await type("Date of birth, Day", "1");
    await type("Date of birth, Month", "1");
    await type("Date of birth, Year", "1990");
    await fireEvent.press(screen.getByRole("checkbox", { name: "I accept the terms" }));
    await fireEvent.press(screen.getByRole("button", { name: "Create" }));
    expect(await screen.findByText("This e-mail already has an account.")).toBeTruthy();
  });

  test("the return key walks the text fields in order, the last one sends; a code lands on its field", async () => {
    const onSubmit = jest.fn(() => {
      throw new KrizakaApiError({ status: 400, code: "USERNAME_RESERVED" });
    });
    function Short() {
      const form = signUp.useForm({ onSubmit, codeFields: { USERNAME_RESERVED: "username" }, i18n: { t: (key) => (key === "form.errors.USERNAME_RESERVED" ? "Reserved." : undefined) } });
      return (
        <form.Form>
          <form.TextField name="email" label="E-mail" />
          <form.TextField name="username" label="Username" />
        </form.Form>
      );
    }
    await render(<Short />);
    expect(screen.getByLabelText("E-mail").props.returnKeyType).toBe("next");
    expect(screen.getByLabelText("Username").props.returnKeyType).toBe("go");
    await fireEvent(screen.getByLabelText("Username"), "submitEditing");
    await waitFor(() => expect(screen.getByText("Enter an e-mail address, like name@example.com.")).toBeTruthy());
  });

  test("the new controls: wheels for a date, a switch row, a sheet for a select, a slider, a searched choice", async () => {
    const settings = createKrizakaForm({
      schema: z.object({
        dateOfBirth: z.iso.date().refine((d) => d <= "2008-10-11", "underage"),
        push: z.boolean(),
        language: z.string().min(1),
        volume: z.number(),
        city: z.string(),
      }),
      defaultValues: { dateOfBirth: "", push: false, language: "", volume: 50, city: "" },
      i18n: { t: (key) => (key === "underage" ? "You must be 18 or older." : undefined), locale: "en-GB" },
    });
    const onSubmit = jest.fn();
    function Settings() {
      const form = settings.useForm({ onSubmit });
      return (
        <form.Form>
          <form.DateField name="dateOfBirth" label="Date of birth" max="2008-10-11" />
          <form.Switch name="push" label="Push notifications" hint="On this phone." />
          <form.Select name="language" label="Language" options={[{ value: "fr", label: "Français" }, { value: "en", label: "English" }]} />
          <form.Slider name="volume" label="Volume" step={10} />
          <form.Combobox name="city" label="City" options={[{ value: "mtl", label: "Montréal" }, { value: "qc", label: "Québec" }]} />
          <form.Submit label="Save" />
        </form.Form>
      );
    }
    await render(<Settings />);
    // The wheels rest on the latest date allowed until turned: a year back gives a real date.
    await fireEvent(screen.getByRole("spinbutton", { name: "Year" }), "accessibilityAction", { nativeEvent: { actionName: "increment" } });
    await fireEvent.press(screen.getByRole("switch", { name: "Push notifications" }));
    await fireEvent.press(screen.getByRole("button", { name: "Language" }));
    await fireEvent.press(screen.getByRole("radio", { name: "Français" }));
    await fireEvent(screen.getByRole("slider", { name: "Volume" }), "accessibilityAction", { nativeEvent: { actionName: "increment" } });
    await fireEvent.press(screen.getByRole("button", { name: "City" }));
    await fireEvent.press(screen.getByRole("radio", { name: "Québec" }));
    await fireEvent.press(screen.getByRole("button", { name: "Save" }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ dateOfBirth: "2007-10-11", push: true, language: "fr", volume: 60, city: "qc" }));
  });
});
