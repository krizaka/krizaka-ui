import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";

import { axeViolations } from "../test/axe";
import { formatMinorUnits, MoneyInput, parseMinorUnits } from "./index";

describe("parseMinorUnits", () => {
  it("reads decimals as integer cents, never a float", () => {
    expect(parseMinorUnits("12,50", "fr-CA", 2)).toBe(1250);
    expect(parseMinorUnits("12.5", "en-CA", 2)).toBe(1250);
    expect(parseMinorUnits("1 234,5", "fr-CA", 2)).toBe(123450);
    expect(parseMinorUnits("0.29", "en-CA", 2)).toBe(29);
    expect(parseMinorUnits("19.99", "en-CA", 2)).toBe(1999);
    expect(parseMinorUnits("", "en-CA", 2)).toBeNull();
  });
  it("refuses more decimals than the currency has, and non-amounts", () => {
    expect(parseMinorUnits("1.234", "en-CA", 2)).toBeUndefined();
    expect(parseMinorUnits("5.5", "en-CA", 0)).toBeUndefined();
    expect(parseMinorUnits("abc", "en-CA", 2)).toBeUndefined();
  });
  it("formats exact minor units by locale", () => {
    expect(formatMinorUnits(123450, "en-CA", 2)).toBe("1,234.50");
    expect(formatMinorUnits(5, "en-CA", 2)).toBe("0.05");
    expect(formatMinorUnits(500, "en-CA", 0)).toBe("500");
    expect(formatMinorUnits(1250, "fr-CA", 2).endsWith(",50")).toBe(true);
  });
});

function Harness({ currency = "CAD", locale = "en-CA", start = null as number | null }) {
  const [v, setV] = React.useState<number | null>(start);
  return (
    <>
      <label htmlFor="m">Amount</label>
      <MoneyInput id="m" value={v} onValueChange={setV} currency={currency} locale={locale} />
      <output>{String(v)}</output>
    </>
  );
}

describe("MoneyInput", () => {
  it("emits integer cents, refuses a third decimal, pads on blur", async () => {
    const user = userEvent.setup();
    const { container } = render(<Harness />);
    expect(await axeViolations(container)).toEqual([]);
    const input = screen.getByLabelText("Amount") as HTMLInputElement;
    await user.type(input, "12.345");
    expect(input.value).toBe("12.34");
    expect(screen.getByRole("status").textContent).toBe("1234");
    await user.clear(input);
    await user.type(input, "7");
    await user.tab();
    expect(input.value).toBe("7.00");
    expect(screen.getByRole("status").textContent).toBe("700");
  });
  it("accepts no decimals for a currency without any", async () => {
    const user = userEvent.setup();
    render(<Harness currency="JPY" />);
    const input = screen.getByLabelText("Amount") as HTMLInputElement;
    await user.type(input, "5.5");
    expect(input.value).toBe("55");
  });
  it("shows the initial amount in the locale", () => {
    render(<Harness locale="fr-CA" start={3900} />);
    expect((screen.getByLabelText("Amount") as HTMLInputElement).value).toMatch(/^39,00$/);
  });
});
