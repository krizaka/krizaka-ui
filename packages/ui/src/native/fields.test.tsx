// The form fields of React Native: TextField, Checkbox, DateField.
import { describe, expect, test } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react-native";
import * as React from "react";

import { Checkbox } from "./checkbox";
import { composeDate, DateField, datePartsOrder } from "./date-picker";
import { TextField } from "./field";

describe("TextField", () => {
  test("named by its label; the hint is the input's hint; the text comes back on every key", async () => {
    const texts: string[] = [];
    await render(<TextField label="E-mail" hint="We send a link." onValueChange={(t) => texts.push(t)} keyboardType="email-address" />);
    const input = screen.getByLabelText("E-mail");
    expect(input.props.keyboardType).toBe("email-address");
    expect(input.props.accessibilityHint).toBe("We send a link.");
    expect(screen.getByText("We send a link.")).toBeTruthy();
    await fireEvent.changeText(input, "eric@");
    expect(texts).toEqual(["eric@"]);
  });

  test("an error replaces the hint, as an alert read with the input", async () => {
    await render(<TextField label="Password" hint="8 characters" error="Use at least 8 characters." secureTextEntry />);
    expect(screen.getByRole("alert")).toHaveTextContent("Use at least 8 characters.");
    expect(screen.queryByText("8 characters")).toBeNull();
    expect(screen.getByLabelText("Password").props.accessibilityHint).toBe("Use at least 8 characters.");
  });

  test("disabled: not editable", async () => {
    await render(<TextField label="Name" disabled />);
    expect(screen.getByLabelText("Name").props.editable).toBe(false);
  });
});

describe("Checkbox", () => {
  test("a row that toggles, uncontrolled", async () => {
    const changes: boolean[] = [];
    await render(<Checkbox onCheckedChange={(c) => changes.push(c)}>I am 18 or older</Checkbox>);
    const box = screen.getByRole("checkbox", { name: "I am 18 or older" });
    expect(box).not.toBeChecked();
    await fireEvent.press(box);
    expect(screen.getByRole("checkbox", { name: "I am 18 or older" })).toBeChecked();
    expect(changes).toEqual([true]);
  });

  test("controlled, named by `label` when its words are a node, with its error", async () => {
    const changes: boolean[] = [];
    await render(
      <Checkbox checked={false} onCheckedChange={(c) => changes.push(c)} label="I accept the terms" error="Accept the terms.">
        <></>
      </Checkbox>,
    );
    await fireEvent.press(screen.getByRole("checkbox", { name: "I accept the terms" }));
    expect(screen.getByRole("checkbox", { name: "I accept the terms" })).not.toBeChecked();
    expect(changes).toEqual([true]);
    expect(screen.getByRole("alert")).toHaveTextContent("Accept the terms.");
  });
});

describe("DateField", () => {
  test("the boxes follow the locale's order", () => {
    expect(datePartsOrder("en-US")).toEqual(["month", "day", "year"]);
    expect(datePartsOrder("fr-FR")).toEqual(["day", "month", "year"]);
    expect(datePartsOrder("ja-JP")).toEqual(["year", "month", "day"]);
  });

  test("composes what was typed in ISO order, real date or not", () => {
    expect(composeDate({ day: "", month: "", year: "" })).toBe("");
    expect(composeDate({ day: "7", month: "3", year: "1990" })).toBe("1990-03-07");
    expect(composeDate({ day: "31", month: "02", year: "19" })).toBe("19-02-31");
  });

  test("typing gives YYYY-MM-DD; digits only, as long as the box", async () => {
    const values: string[] = [];
    await render(<DateField label="Date of birth" locale="en-GB" onValueChange={(v) => values.push(v)} />);
    await fireEvent.changeText(screen.getByLabelText("Date of birth, Day"), "2a7");
    await fireEvent.changeText(screen.getByLabelText("Date of birth, Month"), "3");
    await fireEvent.changeText(screen.getByLabelText("Date of birth, Year"), "19901");
    expect(values).toEqual(["--27", "-03-27", "1990-03-27"]);
    expect(screen.getByLabelText("Date of birth, Day").props.value).toBe("27");
    expect(screen.getByLabelText("Date of birth, Year").props.keyboardType).toBe("number-pad");
  });

  test("controlled: a value set from outside fills the boxes; the error is announced", async () => {
    const { rerender } = await render(<DateField label="Date of birth" value="" onValueChange={() => undefined} />);
    await rerender(<DateField label="Date of birth" value="2015-03-27" onValueChange={() => undefined} error="You must be 18 or older." />);
    expect(screen.getByLabelText("Date of birth, Year").props.value).toBe("2015");
    expect(screen.getByLabelText("Date of birth, Month").props.value).toBe("03");
    expect(screen.getByRole("alert")).toHaveTextContent("You must be 18 or older.");
  });

  test("the last box's blur is the field's", async () => {
    let blurred = 0;
    await render(<DateField label="Expiry" locale="fr-FR" onBlur={() => blurred++} />);
    await fireEvent(screen.getByLabelText("Expiry, Day"), "blur");
    await fireEvent(screen.getByLabelText("Expiry, Year"), "blur");
    expect(blurred).toBe(1);
  });
});
